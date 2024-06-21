#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod cmd_handler;
mod doc_manager;

fn main() {
    doc_manager::create_document::check_if_files_exist();
    doc_manager::get_documents::return_documents();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            cmd_handler::ts_cmds::get_document_creation,
            cmd_handler::ts_cmds::get_documents,
            cmd_handler::ts_cmds::update_index,
            cmd_handler::ts_cmds::delete_document,
            cmd_handler::ts_cmds::get_document_by_id,
            cmd_handler::ts_cmds::get_document_name_by_id,
            cmd_handler::ts_cmds::update_name_by_id,
            cmd_handler::ts_cmds::update_note_content_by_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
