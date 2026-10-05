use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
    app: &AppHandle<R>,
    _api: PluginApi<R, C>,
) -> crate::Result<SystemBars<R>> {
    Ok(SystemBars(app.clone()))
}

/// Access to the system-bars APIs.
pub struct SystemBars<R: Runtime>(AppHandle<R>);

impl<R: Runtime> SystemBars<R> {
    pub fn set_system_bars(&self, _payload: SystemBarsRequest) -> crate::Result<()> {
        Err(crate::Error::Message(
            "system-bars solo está disponible en Android".to_string(),
        ))
    }
}
