/** 本地存储键名表：所有 localStorage 读写都应引用此处，避免散落的硬编码字符串 */
export const STORAGE_KEYS = {
  /** 主题偏好：system | light | dark */
  theme: 'unirepo-theme',
} as const;

/** 所有合法存储键的联合类型，可用于约束通用存取函数的入参 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
