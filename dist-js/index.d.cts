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
/**
 * Atajo para tema claro/oscuro: ajusta iconos según el fondo.
 * `dark = true` => fondos oscuros + iconos claros.
 */
declare function applyThemeToSystemBars(dark: boolean, lightColor?: string, darkColor?: string): Promise<void>;

export { type SystemBarIcons, type SystemBarsOptions, applyThemeToSystemBars, setSystemBars };
