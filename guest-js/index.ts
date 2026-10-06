import { invoke } from '@tauri-apps/api/core';

/** Color de los iconos de una barra del sistema. */
export type SystemBarIcons = 'dark' | 'light';

export interface SystemBarsOptions {
  /** Color de fondo de la status bar, ej. '#FFFFFF'. */
  statusBarColor?: string;
  /** Color de fondo de la navigation bar, ej. '#FFFFFF'. */
  navigationBarColor?: string;
  /** Iconos de la status bar. */
  lightStatusBar?: boolean;
  /** Iconos de la navigation bar. */
  lightNavigationBar?: boolean;
}

/**
 * Cambia las barras del sistema en Android (status + navegación),
 * cada una por separado: color de fondo y estilo de iconos.
 *
 * En edge-to-edge moderno (targetSdk 35+) el color puede ser ignorado
 * por el sistema (barras transparentes), pero el estilo de iconos
 * siempre se aplica.
 */
export async function setSystemBars(options: SystemBarsOptions): Promise<void> {
  await invoke('plugin:system-bars|set_system_bars', {
    payload: {
      statusBarColor: options.statusBarColor,
      navigationBarColor: options.navigationBarColor,
      lightStatusBar: options.lightStatusBar,
      lightNavigationBar: options.lightNavigationBar,
    },
  });
}

export interface EdgeInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**Insets seguros en dp (status bar, nav bar, gestos, etc.). */
export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
  navigationBars?: EdgeInsets;
  systemBars?: EdgeInsets;
  systemGestures?: EdgeInsets;
  mandatoryGestures?: EdgeInsets;
  tappableElement?: EdgeInsets;
  screenWidth?: number;
  screenHeight?: number;
  density?: number;
}

/** Obtiene los insets reales de las barras del sistema en Android. */
export async function getSafeAreaInsets(): Promise<SafeAreaInsets> {
  return await invoke<SafeAreaInsets>('plugin:system-bars|get_insets');
}

/** Publica los insets como variables CSS en documentElement. */
export async function applySafeAreaCssVars(): Promise<SafeAreaInsets> {
  const insets = await getSafeAreaInsets();
  const style = document.documentElement.style;
  style.setProperty('--safe-area-top', `${insets.top}px`);
  style.setProperty('--safe-area-bottom', `${insets.bottom}px`);
  style.setProperty('--safe-area-left', `${insets.left}px`);
  style.setProperty('--safe-area-right', `${insets.right}px`);
  // Fondo gestual (Huawei/EMUI: navigationBars puede ser 0 con gestos activos).
  style.setProperty('--android-safe-bottom', `${insets.bottom}px`);
  return insets;
}

/**
 * Atajo para tema claro/oscuro: ajusta iconos según el fondo.
 * `dark = true` => fondos oscuros + iconos claros.
 */
export async function applyThemeToSystemBars(
  dark: boolean,
  lightColor = '#FFFFFF',
  darkColor = '#111827'
): Promise<void> {
  const color = dark ? darkColor : lightColor;
  await setSystemBars({
    statusBarColor: color,
    navigationBarColor: color,
    lightStatusBar: !dark,
    lightNavigationBar: !dark,
  });
}
