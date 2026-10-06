"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// guest-js/index.ts
var index_exports = {};
__export(index_exports, {
  applySafeAreaCssVars: () => applySafeAreaCssVars,
  applyThemeToSystemBars: () => applyThemeToSystemBars,
  getSafeAreaInsets: () => getSafeAreaInsets,
  setSystemBars: () => setSystemBars
});
module.exports = __toCommonJS(index_exports);
var import_core = require("@tauri-apps/api/core");
async function setSystemBars(options) {
  await (0, import_core.invoke)("plugin:system-bars|set_system_bars", {
    payload: {
      statusBarColor: options.statusBarColor,
      navigationBarColor: options.navigationBarColor,
      lightStatusBar: options.lightStatusBar,
      lightNavigationBar: options.lightNavigationBar
    }
  });
}
async function getSafeAreaInsets() {
  return await (0, import_core.invoke)("plugin:system-bars|get_insets");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  applySafeAreaCssVars,
  applyThemeToSystemBars,
  getSafeAreaInsets,
  setSystemBars
});
