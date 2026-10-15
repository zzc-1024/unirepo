<script setup lang="ts">
import { useWindowState } from '@repo/composables';
import type { Rect, ResizeDirection } from '@repo/composables';
import { computed, watch } from 'vue';

import WindowCaption from './components/WindowCaption.vue';
const props = withDefaults(
  defineProps<{
    /** 窗口是否可见 */
    visible?: boolean;
    /** 窗口标题 */
    title: string;
    /** 窗口图标 */
    icon?: string;
    /** 初始窗口矩形 */
    initialRect?: Rect;
    /** 最小宽度 */
    minWidth?: number;
    /** 最小高度 */
    minHeight?: number;
    /** z-index */
    zIndex?: number;
  }>(),
  {
    visible: true,
    icon: '',
    initialRect: () => ({ x: 120, y: 100, width: 680, height: 440 }),
    minWidth: 320,
    minHeight: 200,
    zIndex: 100,
  },
);

const emit = defineEmits<{
  'update:visible': [value: boolean];
  close: [];
  minimize: [];
  restore: [];
  focus: [];
}>();

const {
  rect,
  maximized,
  minimized,
  toggleMaximize,
  minimize: doMinimize,
  show,
} = useWindowState(props.initialRect);

/* ========== 双击/双击（鼠标 + 触摸统一检测） ========== */
// 不依赖 dblclick 事件（部分触屏不可靠），改为基于 pointerup 的点击间隔检测
const DOUBLE_TAP_INTERVAL = 350;
let lastTapTime = 0;

function handleTap(): void {
  const now = Date.now();
  if (now - lastTapTime < DOUBLE_TAP_INTERVAL) {
    toggleMaximize();
    lastTapTime = 0;
  } else {
    lastTapTime = now;
  }
}

/* ========== Pointer 事件绑定辅助（含 capture 与 pointercancel 清理） ========== */
function bindPointerEvents(
  target: HTMLElement,
  pointerId: number,
  handlers: { move: (e: PointerEvent) => void; up?: (e: PointerEvent) => void },
): void {
  const cleanup = (): void => {
    if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId);
    target.removeEventListener('pointermove', handlers.move);
    target.removeEventListener('pointerup', onUp);
    target.removeEventListener('pointercancel', cleanup);
  };
  const onUp = (ev: PointerEvent): void => {
    cleanup();
    handlers.up?.(ev);
  };
  target.addEventListener('pointermove', handlers.move);
  target.addEventListener('pointerup', onUp);
  // 触屏被系统打断（来电/手势接管）时触发，必须清理
  target.addEventListener('pointercancel', cleanup);
}

/* ========== 拖拽移动 ========== */
function onCaptionPointerDown(e: PointerEvent): void {
  // 控制按钮区域不触发拖拽
  if ((e.target as HTMLElement).closest('.window-caption__controls')) return;
  emit('focus');
  e.preventDefault();

  const target = e.currentTarget as HTMLElement;
  // 捕获指针：即使手指/鼠标移出元素，事件依然派发给该元素（触屏关键）
  target.setPointerCapture(e.pointerId);

  // 最大化状态下拖拽 → 先还原，再跟随指针
  if (maximized.value) {
    toggleMaximize();
    rect.value = {
      ...rect.value,
      x: e.clientX - rect.value.width / 2,
      y: e.clientY - 16,
    };
  }

  const offsetX = e.clientX - rect.value.x;
  const offsetY = e.clientY - rect.value.y;
  let moved = false;

  const onMove = (ev: PointerEvent): void => {
    const newX = ev.clientX - offsetX;
    const newY = Math.max(0, ev.clientY - offsetY); // 标题栏不允许拖出屏幕顶部
    if (Math.abs(newX - rect.value.x) > 3 || Math.abs(newY - rect.value.y) > 3) moved = true;
    rect.value = { ...rect.value, x: newX, y: newY };
  };

  bindPointerEvents(target, e.pointerId, {
    move: onMove,
    // 未发生位移视为一次“点击”，进入双击/双触检测
    up: () => {
      if (!moved) handleTap();
    },
  });
}

/* ========== 八向缩放 ========== */
const resizeDirections: ResizeDirection[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

function onResizePointerDown(e: PointerEvent, dir: ResizeDirection): void {
  if (maximized.value) return;
  e.preventDefault();
  e.stopPropagation();
  emit('focus');

  const target = e.currentTarget as HTMLElement;
  target.setPointerCapture(e.pointerId);

  const startX = e.clientX;
  const startY = e.clientY;
  const startRect = { ...rect.value };

  const onMove = (ev: PointerEvent): void => {
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    let { x, y, width, height } = startRect;

    if (dir.includes('e')) width = Math.max(props.minWidth, startRect.width + dx);
    if (dir.includes('s')) height = Math.max(props.minHeight, startRect.height + dy);
    if (dir.includes('w')) {
      width = Math.max(props.minWidth, startRect.width - dx);
      x = startRect.x + startRect.width - width;
    }
    if (dir.includes('n')) {
      height = Math.max(props.minHeight, startRect.height - dy);
      y = startRect.y + startRect.height - height;
    }

    rect.value = { x, y, width, height };
  };

  bindPointerEvents(target, e.pointerId, { move: onMove });
}

/* ========== 控制动作 ========== */
function handleClose(): void {
  emit('update:visible', false);
  emit('close');
}

function handleMinimize(): void {
  doMinimize();
  emit('minimize');
}

/** 供父组件调用：从最小化恢复 */
function restoreFromMinimize(): void {
  show();
  emit('focus');
  emit('restore');
}

defineExpose({ restore: restoreFromMinimize });

watch(
  () => props.visible,
  (v) => v && show(),
);

const style = computed(() => ({
  zIndex: props.zIndex,
  ...(maximized.value
    ? {}
    : {
        left: `${rect.value.x}px`,
        top: `${rect.value.y}px`,
        width: `${rect.value.width}px`,
        height: `${rect.value.height}px`,
      }),
}));
</script>

<template>
  <div
    v-show="visible && !minimized"
    class="window"
    :class="{ 'window--maximized': maximized }"
    :style="style"
    @pointerdown="emit('focus')"
  >
    <!-- 标题栏（拖拽区） -->
    <div class="window__caption" @pointerdown="onCaptionPointerDown">
      <WindowCaption
        :title="title"
        :icon="icon"
        :maximized="maximized"
        @minimize="handleMinimize"
        @toggle-maximize="toggleMaximize()"
        @close="handleClose"
      >
        <template v-if="$slots.icon" #icon>
          <slot name="icon" />
        </template>
      </WindowCaption>
    </div>

    <!-- 内容区：默认插槽 -->
    <div class="window__body">
      <slot />
    </div>

    <!-- 缩放把手（最大化时隐藏） -->
    <template v-if="!maximized">
      <div
        v-for="dir in resizeDirections"
        :key="dir"
        class="window__resize-handle"
        :class="`window__resize-handle--${dir}`"
        @pointerdown="onResizePointerDown($event, dir)"
      />
    </template>
  </div>
</template>

<style scoped>
.window {
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;

  @media (prefers-color-scheme: dark) {
    background-color: rgb(8, 8, 8);
  }
}

/* ✅ BEM 修饰符和元素：显式写完整类名，避免 & 拼接歧义 */
.window--maximized {
  inset: 0;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.window__caption {
  height: 32px;
  flex-shrink: 0;
  background-color: #f9f9f9;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  /* 关键：禁止浏览器在拖拽时触发页面滚动/缩放等默认手势 */
  touch-action: none;
  -webkit-touch-callout: none;
}

.window__body {
  flex: 1;
  height: 100%;
  overflow: auto;
  user-select: text;
  -webkit-user-select: text;
  /* 允许内容区正常滚动，避免拖拽内容时误触窗口移动 */
  touch-action: pan-x pan-y;
}

/* 不可见的缩放热区（尺寸加大以适配手指触控） */
.window__resize-handle {
  position: absolute;
  z-index: 1;
  touch-action: none;
}

.window__resize-handle--n {
  top: -4px;
  left: 12px;
  right: 12px;
  height: 8px;
  cursor: n-resize;
}
.window__resize-handle--s {
  bottom: -4px;
  left: 12px;
  right: 12px;
  height: 8px;
  cursor: s-resize;
}
.window__resize-handle--e {
  right: -4px;
  top: 12px;
  bottom: 12px;
  width: 8px;
  cursor: e-resize;
}
.window__resize-handle--w {
  left: -4px;
  top: 12px;
  bottom: 12px;
  width: 8px;
  cursor: w-resize;
}
.window__resize-handle--ne {
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  cursor: ne-resize;
}
.window__resize-handle--nw {
  top: -6px;
  left: -6px;
  width: 20px;
  height: 20px;
  cursor: nw-resize;
}
.window__resize-handle--se {
  bottom: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
}
.window__resize-handle--sw {
  bottom: -6px;
  left: -6px;
  width: 20px;
  height: 20px;
  cursor: sw-resize;
}
</style>
