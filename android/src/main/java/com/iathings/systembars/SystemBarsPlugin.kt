package com.iathings.systembars

import android.app.Activity
import android.graphics.Color
import android.os.Build
import android.util.Log
import kotlin.math.roundToInt
import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
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

    @Command
    fun getInsets(invoke: Invoke) {
        try {
            val wm = activity.windowManager

            // Métricas de pantalla (API 30+; fallback pre-30 como EMUI/Android 10-).
            var swPx = 0
            var shPx = 0
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                val bounds = wm.currentWindowMetrics.bounds
                swPx = bounds.width()
                shPx = bounds.height()
            } else {
                @Suppress("DEPRECATION")
                val dm = android.util.DisplayMetrics()
                @Suppress("DEPRECATION")
                wm.defaultDisplay.getRealMetrics(dm)
                swPx = dm.widthPixels
                shPx = dm.heightPixels
            }
            val density = activity.resources.displayMetrics.density.coerceAtLeast(1f)
            fun dp(px: Int): Int = (px / density).roundToInt()

            val rootInsets = ViewCompat.getRootWindowInsets(activity.window.decorView)
            val nav = rootInsets?.getInsets(WindowInsetsCompat.Type.navigationBars())
            val sys = rootInsets?.getInsets(WindowInsetsCompat.Type.systemBars())
            val ges = rootInsets?.getInsets(WindowInsetsCompat.Type.systemGestures())
            val man = rootInsets?.getInsets(WindowInsetsCompat.Type.mandatorySystemGestures())
            val tap = rootInsets?.getInsets(WindowInsetsCompat.Type.tappableElement())

            Log.d("SAFEAREA", "screen=${swPx}x${shPx} density=$density sdk=${Build.VERSION.SDK_INT}")
            Log.d("SAFEAREA", "navigationBars: ${nav?.left},${nav?.top},${nav?.right},${nav?.bottom}")
            Log.d("SAFEAREA", "systemBars: ${sys?.left},${sys?.top},${sys?.right},${sys?.bottom}")
            Log.d("SAFEAREA", "gestures: ${ges?.left},${ges?.top},${ges?.right},${ges?.bottom}")
            Log.d("SAFEAREA", "mandatory: ${man?.left},${man?.top},${man?.right},${man?.bottom}")
            Log.d("SAFEAREA", "tappable: ${tap?.left},${tap?.top},${tap?.right},${tap?.bottom}")

            fun edge(e: androidx.core.graphics.Insets?): app.tauri.plugin.JSObject {
                val o = app.tauri.plugin.JSObject()
                o.put("top", dp(e?.top ?: 0))
                o.put("bottom", dp(e?.bottom ?: 0))
                o.put("left", dp(e?.left ?: 0))
                o.put("right", dp(e?.right ?: 0))
                return o
            }

            // Fondo recomendado: el maximo inferior (cubre botones y gestos en EMUI y modernos).
            val bottomDp = maxOf(
                dp(nav?.bottom ?: 0),
                dp(ges?.bottom ?: 0),
                dp(man?.bottom ?: 0),
                dp(tap?.bottom ?: 0)
            )

            val jsObject = app.tauri.plugin.JSObject()
            // Compat: top/bottom/left/right = systemBars como antes.
            jsObject.put("top", dp(sys?.top ?: 0))
            jsObject.put("bottom", bottomDp)
            jsObject.put("left", dp(sys?.left ?: 0))
            jsObject.put("right", dp(sys?.right ?: 0))
            jsObject.put("navigationBars", edge(nav))
            jsObject.put("systemBars", edge(sys))
            jsObject.put("systemGestures", edge(ges))
            jsObject.put("mandatoryGestures", edge(man))
            jsObject.put("tappableElement", edge(tap))
            jsObject.put("screenWidth", swPx)
            jsObject.put("screenHeight", shPx)
            jsObject.put("density", density.toDouble())
            invoke.resolve(jsObject)
        } catch (e: Exception) {
            Log.e("SystemBars", "getInsets failed: ${e.message}", e)
            invoke.reject("GET_INSETS_FAILED", e.message ?: "Unable to get insets")
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
