#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod doc_manager;
mod cmd_handler;

fn main() {
    doc_manager::create_document::check_if_files_exist();
    doc_manager::get_documents::return_documents();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![cmd_handler::ts_cmds::get_document_creation, cmd_handler::ts_cmds::get_documents, cmd_handler::ts_cmds::update_index])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
