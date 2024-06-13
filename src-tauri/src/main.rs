#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod doc_manager;
mod cmd_handler;

fn main() {
    doc_manager::create_document::check_if_files_exist();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![cmd_handler::ts_cmds::get_document_creation])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
