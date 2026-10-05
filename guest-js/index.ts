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
