use serde::{Deserialize, Serialize};

/// Todo opcional: solo se aplica lo que venga definido, cada barra por separado.
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemBarsRequest {
    pub status_bar_color: Option<String>,
    pub navigation_bar_color: Option<String>,
    pub light_status_bar: Option<bool>,
    pub light_navigation_bar: Option<bool>,
}
