// guest-js/index.ts
import { invoke } from "@tauri-apps/api/core";
async function setSystemBars(options) {
  await invoke("plugin:system-bars|set_system_bars", {
    payload: {
      statusBarColor: options.statusBarColor,
      navigationBarColor: options.navigationBarColor,
      lightStatusBar: options.lightStatusBar,
      lightNavigationBar: options.lightNavigationBar
    }
  });
}
async function getSafeAreaInsets() {
  return await invoke("plugin:system-bars|get_insets");
}
async function applySafeAreaCssVars() {
  const insets = await getSafeAreaInsets();
  const style = document.documentElement.style;
  style.setProperty("--safe-area-top", `${insets.top}px`);
  style.setProperty("--safe-area-bottom", `${insets.bottom}px`);
  style.setProperty("--safe-area-left", `${insets.left}px`);
  style.setProperty("--safe-area-right", `${insets.right}px`);
  style.setProperty("--android-safe-bottom", `${insets.bottom}px`);
  return insets;
}
async function applyThemeToSystemBars(dark, lightColor = "#FFFFFF", darkColor = "#111827") {
  const color = dark ? darkColor : lightColor;
  await setSystemBars({
    statusBarColor: color,
    navigationBarColor: color,
    lightStatusBar: !dark,
    lightNavigationBar: !dark
  });
}
export {
  applySafeAreaCssVars,
  applyThemeToSystemBars,
  getSafeAreaInsets,
  setSystemBars
};
