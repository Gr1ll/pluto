use std::{fs::File, io::Read, path::PathBuf};

use dirs::data_dir;

fn get_app_data_dir() -> PathBuf {
    let mut path = data_dir().expect("Unable to get application data directory");
    path.push("pluto");
    path
}

pub fn return_documents() -> String {
    let app_data_dir = get_app_data_dir();
    let notes_path = app_data_dir.join("notes.json");

    let mut notes_file = File::open(&notes_path).expect("Unable to open file");
    let mut notes_data = String::new();
    notes_file
        .read_to_string(&mut notes_data)
        .expect("Unable to read file");

    return notes_data;
}

pub fn get_document_by_id(document_id: i64) -> String {
    let app_data_dir = get_app_data_dir();
    let document_path = app_data_dir.join(format!("{}.md", document_id));

    let mut document_file = File::open(&document_path).expect("Unable to open file");
    let mut document_data = String::new();
    document_file
        .read_to_string(&mut document_data)
        .expect("Unable to read file");

    return document_data;
}

pub fn get_document_name_by_id(document_id: i64) -> String {
    // get json object from document_id.json and return it
    let app_data_dir = get_app_data_dir();
    let document_path = app_data_dir.join("notes.json");

    let mut document_file = File::open(&document_path).expect("Unable to open file");
    let mut document_data = String::new();
    document_file
        .read_to_string(&mut document_data)
        .expect("Unable to read file");

    let notes_json: serde_json::Value =
        serde_json::from_str(&document_data).expect("Unable to parse JSON");
    let notes_array = notes_json["notes"]
        .as_array()
        .expect("Expected notes to be an array");

    for note in notes_array {
        if let Some(id) = note["id"].as_i64() {
            if id == document_id {
                return note["document_name"].as_str().unwrap().to_string();
            }
        }
    }

    return "".to_string();
}
