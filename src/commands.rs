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
