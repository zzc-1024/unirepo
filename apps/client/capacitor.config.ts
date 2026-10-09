import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'unirepo',
  webDir: 'dist',
  server: {
    // 让 WebView 以 http://localhost 作为应用源。
    // 默认是 https，此时页面（https）再请求 http 接口会被 WebView 当作
    // mixed content 拦截，且该拦截与 android:usesCleartextTraffic 无关。
    androidScheme: 'http',
    // 允许明文 HTTP 流量：cap sync 时会写入 android:usesCleartextTraffic="true"，
    // 避免手动改的 manifest 被重新生成时覆盖。
    cleartext: true,
  },
  android: {
    // 双保险：即使将来改回 https scheme，也允许 WebView 加载不同 scheme 的资源。
    allowMixedContent: true,
  },
};

export default config;
