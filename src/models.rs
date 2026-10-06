use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EdgeInsets {
    pub top: i32,
    pub bottom: i32,
    pub left: i32,
    pub right: i32,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SafeAreaInsets {
    pub top: i32,
    pub bottom: i32,
    pub left: i32,
    pub right: i32,
    #[serde(default)]
    pub navigation_bars: EdgeInsets,
    #[serde(default)]
    pub system_bars: EdgeInsets,
    #[serde(default)]
    pub system_gestures: EdgeInsets,
    #[serde(default)]
    pub mandatory_gestures: EdgeInsets,
    #[serde(default)]
    pub tappable_element: EdgeInsets,
    #[serde(default)]
    pub screen_width: i32,
    #[serde(default)]
    pub screen_height: i32,
    #[serde(default)]
    pub density: f32,
}

/// Todo opcional: solo se aplica lo que venga definido, cada barra por separado.
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemBarsRequest {
    pub status_bar_color: Option<String>,
    pub navigation_bar_color: Option<String>,
    pub light_status_bar: Option<bool>,
    pub light_navigation_bar: Option<bool>,
}
