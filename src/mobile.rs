use serde::de::DeserializeOwned;
use tauri::{
    plugin::{PluginApi, PluginHandle},
    AppHandle, Runtime,
};

use crate::models::*;

// initializes the Kotlin plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
    _app: &AppHandle<R>,
    api: PluginApi<R, C>,
) -> crate::Result<SystemBars<R>> {
    #[cfg(target_os = "android")]
    {
        let handle =
            api.register_android_plugin("com.iathings.systembars", "SystemBarsPlugin")?;
        Ok(SystemBars(handle))
    }
    #[cfg(not(target_os = "android"))]
    {
        let _ = api;
        Err(crate::Error::Message(
            "system-bars solo está disponible en Android".to_string(),
        ))
    }
}

/// Access to the system-bars APIs.
pub struct SystemBars<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> SystemBars<R> {
    pub fn set_system_bars(&self, payload: SystemBarsRequest) -> crate::Result<()> {
        self.0
            .run_mobile_plugin("setSystemBars", payload)
            .map_err(Into::into)
    }
}
