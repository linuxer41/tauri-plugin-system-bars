use tauri::{command, AppHandle, Runtime};

use crate::models::*;
use crate::Result;
use crate::SystemBarsExt;

#[command]
pub(crate) async fn set_system_bars<R: Runtime>(
    app: AppHandle<R>,
    payload: SystemBarsRequest,
) -> Result<()> {
    app.system_bars().set_system_bars(payload)
}

#[command]
pub(crate) async fn get_insets<R: Runtime>(app: AppHandle<R>) -> Result<SafeAreaInsets> {
    app.system_bars().get_insets()
}
