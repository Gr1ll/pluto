use crate::doc_manager;

#[tauri::command]
pub fn get_document_creation(document_name: &str) -> String {
    doc_manager::create_document::create_note_document(document_name);
    format!("Hello, {}! You've been greeted from Me!", document_name)
}

#[tauri::command]
pub fn get_documents() -> String {
    doc_manager::get_documents::return_documents()
}

#[tauri::command]
pub fn update_index(document_array: &str) -> bool {
    doc_manager::create_document::update_note_array(document_array)
}

#[tauri::command]
pub fn delete_document(document_id: i64) -> bool {
    doc_manager::delete_document::delete_document(document_id)
}

#[tauri::command]
pub fn get_document_by_id(document_id: i64) -> String {
    doc_manager::get_documents::get_document_by_id(document_id)
}

#[tauri::command]
pub fn get_document_name_by_id(document_id: i64) -> String {
    doc_manager::get_documents::get_document_name_by_id(document_id)
}

#[tauri::command]
pub fn update_name_by_id(document_id: i64, document_name: &str) {
    doc_manager::write_documents::update_name_by_id(document_id, document_name);
}
