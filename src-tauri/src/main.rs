#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod create_document;
mod write_document;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Me!", name)
}

#[tauri::command]
fn get_document_creation(document_name: &str) -> String {
    format!("Hello, {}! You've been greeted from Me!", document_name)
}

fn main() {
   create_document::check_if_files_exist();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_document_creation])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}