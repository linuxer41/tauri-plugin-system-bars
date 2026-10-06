/** Color de los iconos de una barra del sistema. */
type SystemBarIcons = 'dark' | 'light';
interface SystemBarsOptions {
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
declare function setSystemBars(options: SystemBarsOptions): Promise<void>;
interface EdgeInsets {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
/**Insets seguros en dp (status bar, nav bar, gestos, etc.). */
interface SafeAreaInsets {
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
declare function getSafeAreaInsets(): Promise<SafeAreaInsets>;
/** Publica los insets como variables CSS en documentElement. */
declare function applySafeAreaCssVars(): Promise<SafeAreaInsets>;
/**
 * Atajo para tema claro/oscuro: ajusta iconos según el fondo.
 * `dark = true` => fondos oscuros + iconos claros.
 */
declare function applyThemeToSystemBars(dark: boolean, lightColor?: string, darkColor?: string): Promise<void>;

export { type EdgeInsets, type SafeAreaInsets, type SystemBarIcons, type SystemBarsOptions, applySafeAreaCssVars, applyThemeToSystemBars, getSafeAreaInsets, setSystemBars };
