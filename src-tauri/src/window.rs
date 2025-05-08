use tauri::{App, WebviewUrl, WebviewWindow, WebviewWindowBuilder};
use tauri::{LogicalPosition, TitleBarStyle};

/// Sets up the main application window with platform-specific configurations
pub fn setup_window(app: &App) -> Result<WebviewWindow, Box<dyn std::error::Error>> {
    // Create a window builder with the default URL
    let mut win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
        .title("Fleet Lit Tauri")
        .inner_size(800.0, 600.0)
        .min_inner_size(430.0, 320.0)
        .resizable(true);

    // Platform-specific configurations
    #[cfg(target_os = "macos")]
    {
        // On macOS, use TitleBarStyle::Overlay with higher opacity
        win_builder = win_builder
            .title_bar_style(TitleBarStyle::Overlay)
            .hidden_title(true)
            .decorations(true)
            .traffic_light_position(LogicalPosition::new(15.0, 19.0));
    }

    #[cfg(not(target_os = "macos"))]
    {
        // On Windows/Linux, disable decorations completely for custom titlebar
        win_builder = win_builder.decorations(false).shadow(true); // Enable shadow for better aesthetics
    }

    // Build the window and handle potential errors
    let window = win_builder.build()?;

    // Configure macOS specific settings
    if let Err(e) = configure_macos_window(&window) {
        eprintln!("Error configuring macOS window: {}", e);
    }

    Ok(window)
}

// Configure macOS specific window settings
#[cfg(target_os = "macos")]
fn configure_macos_window(window: &tauri::WebviewWindow) -> Result<(), Box<dyn std::error::Error>> {
    use cocoa::appkit::{NSColor, NSWindow, NSWindowStyleMask, NSWindowTitleVisibility};
    use cocoa::base::{id, nil};
    use tauri::{TitleBarStyle, WindowEvent};

    // Set background color to match the theme
    let ns_window = window.ns_window()?;
    let ns_window = ns_window as id;

    unsafe {
        // Using color that matches --color-background from the dark theme
        let bg_color = NSColor::colorWithRed_green_blue_alpha_(
            nil, 0.145, // Red component
            0.145, // Green component
            0.145, // Blue component
            1.0,   // Alpha (full opacity)
        );
        ns_window.setBackgroundColor_(bg_color);

        // Hide the title bar text on macOS
        ns_window.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
    }

    // Using clone to avoid borrow issues
    let window_clone = window.clone();
    window.on_window_event(move |event| {
        match event {
            WindowEvent::Resized(..) => {
                // Check fullscreen status every time the window is resized
                if let Ok(ns_window) = window_clone.ns_window() {
                    let ns_window = ns_window as id;

                    unsafe {
                        let is_fullscreen = ns_window.styleMask() & NSWindowStyleMask::NSFullScreenWindowMask
                            == NSWindowStyleMask::NSFullScreenWindowMask;

                        if is_fullscreen {
                            // Darker and solid color for fullscreen mode
                            let fullscreen_bg_color = NSColor::colorWithRed_green_blue_alpha_(
                                nil, 0.1, 0.1, 0.1, 1.0, // Full opacity
                            );
                            ns_window.setBackgroundColor_(fullscreen_bg_color);

                            // Change title bar style in fullscreen mode
                            let _ = window_clone.set_title_bar_style(TitleBarStyle::Transparent);
                        } else {
                            // Return to normal color when not in fullscreen
                            let normal_bg_color =
                                NSColor::colorWithRed_green_blue_alpha_(nil, 0.145, 0.145, 0.145, 1.0);
                            ns_window.setBackgroundColor_(normal_bg_color);

                            // Restore title bar style to Overlay when not in fullscreen
                            let _ = window_clone.set_title_bar_style(TitleBarStyle::Overlay);
                        }
                    }
                }
            }
            _ => {}
        }
    });

    Ok(())
}

#[cfg(not(target_os = "macos"))]
fn configure_macos_window(_window: &tauri::WebviewWindow) -> Result<(), Box<dyn std::error::Error>> {
    Ok(())
}
