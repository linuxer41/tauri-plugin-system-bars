const COMMANDS: &[&str] = &["set_system_bars"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        .android_path("android")
        .build();
}
