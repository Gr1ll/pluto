use crate::doc_manager;

#[tauri::command]
pub fn get_document_creation(document_name: &str) -> String {
    doc_manager::
    create_document::create_note_document(document_name);
    format!("Hello, {}! You've been greeted from Me!", document_name)
}

#[tauri::command]
pub fn get_documents() -> String {
    doc_manager::get_documents::return_documents()
}