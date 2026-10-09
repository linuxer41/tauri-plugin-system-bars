const COMMANDS: &[&str] = &["set_system_bars", "get_insets"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        .android_path("android")
        .build();
}
