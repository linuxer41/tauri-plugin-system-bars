use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::SystemBars;
#[cfg(mobile)]
use mobile::SystemBars;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the system-bars APIs.
pub trait SystemBarsExt<R: Runtime> {
    fn system_bars(&self) -> &SystemBars<R>;
}

impl<R: Runtime, T: Manager<R>> crate::SystemBarsExt<R> for T {
    fn system_bars(&self) -> &SystemBars<R> {
        self.state::<SystemBars<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("system-bars")
        .invoke_handler(tauri::generate_handler![commands::set_system_bars, commands::get_insets])
        .setup(|app, api| {
            #[cfg(mobile)]
            let system_bars = mobile::init(app, api)?;
            #[cfg(desktop)]
            let system_bars = desktop::init(app, api)?;
            app.manage(system_bars);
            Ok(())
        })
        .build()
}
