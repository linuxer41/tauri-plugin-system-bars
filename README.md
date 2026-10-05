# tauri-plugin-system-bars

[![crates.io](https://img.shields.io/crates/v/tauri-plugin-system-bars.svg)](https://crates.io/crates/tauri-plugin-system-bars)
[![npm](https://img.shields.io/npm/v/tauri-plugin-system-bars.svg)](https://www.npmjs.com/package/tauri-plugin-system-bars)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Tauri 2 plugin to control the Android **status bar** and **navigation bar**: background colors and light/dark icon styles, from JavaScript or Rust.

> Android only. On desktop it returns an error; on iOS it is not implemented.

## Install

**Rust** (`src-tauri/Cargo.toml`):

```toml
[dependencies]
tauri-plugin-system-bars = "0.1.0"
```

**JavaScript**:

```bash
bun add tauri-plugin-system-bars
# or: npm install tauri-plugin-system-bars
```

## Setup

Register the plugin in `src-tauri/src/lib.rs`:

```rust
tauri::Builder::default()
    .plugin(tauri_plugin_system_bars::init())
    // ...
```

Add the permission to `src-tauri/capabilities/default.json`:

```json
{
  "identifier": "default",
  "windows": ["main"],
  "permissions": ["system-bars:default"]
}
```

## Usage

### JavaScript

```ts
import {
  setSystemBars,
  applyThemeToSystemBars,
} from 'tauri-plugin-system-bars';

// Full control: each bar independently (undefined fields are not changed)
await setSystemBars({
  statusBarColor: '#FFFFFF',
  navigationBarColor: '#FFFFFF',
  lightStatusBar: true, // dark icons on light background
  lightNavigationBar: true,
});

// Theme shortcut: dark = true => dark backgrounds + light icons
await applyThemeToSystemBars(true);
await applyThemeToSystemBars(false, '#FFFFFF', '#111827');
```

### Rust

```rust
use tauri_plugin_system_bars::{SystemBarsExt, SystemBarsRequest};

let payload = SystemBarsRequest {
    status_bar_color: Some("#FFFFFF".into()),
    navigation_bar_color: Some("#FFFFFF".into()),
    light_status_bar: Some(true),
    light_navigation_bar: Some(true),
};
app.system_bars().set_system_bars(payload)?;
```

## API

### `setSystemBars(options: SystemBarsOptions): Promise<void>`

| Option               | Type      | Description                          |
| -------------------- | --------- | ------------------------------------ |
| `statusBarColor`     | `string?` | Status bar background, e.g. `#FFFFFF` |
| `navigationBarColor` | `string?` | Navigation bar background            |
| `lightStatusBar`     | `boolean?`| `true` = dark icons, `false` = light |
| `lightNavigationBar` | `boolean?`| `true` = dark icons, `false` = light |

### `applyThemeToSystemBars(dark, lightColor?, darkColor?): Promise<void>`

Convenience helper: picks colors from the theme and sets matching icon styles.

- `dark = true` → backgrounds `darkColor` (default `#111827`) + light icons
- `dark = false` → backgrounds `lightColor` (default `#FFFFFF`) + dark icons

## Android notes

- The plugin registers the Kotlin class `com.iathings.systembars.SystemBarsPlugin`.
- With modern edge-to-edge (`targetSdk` 35+), Android may **ignore the background colors** (transparent bars) but the **icon style is always applied**.
- Works per bar: status bar and navigation bar can be styled separately.

## Development

```bash
bun install
bun run build   # builds dist-js/ (ESM + CJS + types)
bun run check   # tsc --noEmit
cargo publish --dry-run
```

## License

[MIT](LICENSE)
