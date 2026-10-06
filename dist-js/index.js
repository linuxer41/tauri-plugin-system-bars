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
  applyThemeToSystemBars,
  setSystemBars
};
