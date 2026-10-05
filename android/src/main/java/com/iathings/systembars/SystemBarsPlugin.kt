package com.iathings.systembars

import android.app.Activity
import android.graphics.Color
import android.os.Build
import android.util.Log
import android.view.View
import androidx.core.view.WindowCompat
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.Plugin

@InvokeArg
class SystemBarsArgs {
    var statusBarColor: String? = null
    var navigationBarColor: String? = null
    var lightStatusBar: Boolean? = null
    var lightNavigationBar: Boolean? = null
}

@TauriPlugin
class SystemBarsPlugin(private val activity: Activity) : Plugin(activity) {

    @Command
    fun setSystemBars(invoke: Invoke) {
        try {
            val args = invoke.parseArgs(SystemBarsArgs::class.java)

            // Validar colores antes de tocar la UI para fallar rápido con mensaje claro.
            val statusColor = args.statusBarColor?.let { Color.parseColor(it) }
            val navColor = args.navigationBarColor?.let { Color.parseColor(it) }

            activity.runOnUiThread {
                val window = activity.window

                // Color de fondo (best-effort: en edge-to-edge moderno el sistema
                // puede ignorarlo y las barras quedan transparentes).
                if (statusColor != null) {
                    window.statusBarColor = statusColor
                }
                if (navColor != null) {
                    window.navigationBarColor = navColor
                }

                // Quitar el velo/scrim del contraste forzado del sistema
                // sobre las barras (API 29+). Sin esto, la nav bar dibuja
                // un degradado propio que tapa el estilo pedido.
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    window.isNavigationBarContrastEnforced = false
                    window.isStatusBarContrastEnforced = false
                }

                // Vía compat: elige WindowInsetsController (API 30+) o
                // flags legacy según versión. Válido con targetSdk 36.
                val controller = WindowCompat.getInsetsController(window, window.decorView)
                args.lightStatusBar?.let { controller.isAppearanceLightStatusBars = it }
                args.lightNavigationBar?.let { controller.isAppearanceLightNavigationBars = it }

                // Refuerzo legacy: algunos fabricantes (p. ej. MIUI) ignoran
                // una de las dos vías, así se aplican ambas.
                applyLegacyLightFlags(window.decorView, args.lightStatusBar, args.lightNavigationBar)

                Log.i(
                    "SystemBars",
                    "applied sdk=${Build.VERSION.SDK_INT} " +
                        "lightStatus=${args.lightStatusBar} lightNav=${args.lightNavigationBar}"
                )
            }

            invoke.resolve()
        } catch (e: Exception) {
            Log.e("SystemBars", "failed: ${e.message}", e)
            invoke.reject(
                "SET_SYSTEM_BARS_FAILED",
                e.message ?: "Unable to set system bars"
            )
        }
    }

    @Suppress("DEPRECATION")
    private fun applyLegacyLightFlags(decorView: View, lightStatus: Boolean?, lightNav: Boolean?) {
        // read-modify-write: se conservan los demás flags que Tauri/wry usan.
        var flags = decorView.systemUiVisibility
        lightStatus?.let {
            flags = if (it) {
                flags or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
            } else {
                flags and View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR.inv()
            }
        }
        lightNav?.let {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                flags = if (it) {
                    flags or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
                } else {
                    flags and View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR.inv()
                }
            }
        }
        decorView.systemUiVisibility = flags
    }
}
