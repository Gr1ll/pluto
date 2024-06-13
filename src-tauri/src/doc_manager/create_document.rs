use std::fs::File;
use std::io::{Read, Write};
use rustc_serialize::json::Json;
use serde_json::{json, Value};
use std::path::PathBuf;
use dirs::data_dir;

pub fn get_app_data_dir() -> PathBuf {
    let mut path = data_dir().expect("Unable to get application data directory");
    path.push("pluto");
    path
}

pub fn check_if_files_exist() {
    let app_data_dir = get_app_data_dir();
    print!("{:?}", app_data_dir);

    let notes_path = app_data_dir.join("notes.json");
    let config_path = app_data_dir.join("config.json");

    if !app_data_dir.exists() {
        std::fs::create_dir_all(app_data_dir).unwrap();
    }

    if !notes_path.exists() {
        let mut file = File::create(&notes_path).unwrap();
        let json = Json::from_str("{\"notes\":[]}").unwrap();
        file.write_all(json.to_string().as_bytes()).unwrap();
    }

    if !config_path.exists() {
        File::create(config_path).unwrap();
    }
}

pub fn create_note_document(document_name: &str) -> bool {
    let app_data_dir = get_app_data_dir();
    let notes_path = app_data_dir.join("notes.json");

    let mut notes_file = File::open(&notes_path).expect("Unable to open file");
    let mut notes_data = String::new();
    notes_file.read_to_string(&mut notes_data).expect("Unable to read file");

    let mut notes_json: Value = serde_json::from_str(&notes_data).expect("Unable to parse JSON");
    let notes_array = notes_json["notes"].as_array_mut().expect("Expected notes to be an array");

    let document_path = app_data_dir.join(format!("{}.json", notes_array.len() + 1));
    let json = Json::from_str("{\"name\":\"John Doe\"}").unwrap();
    let mut file = File::create(&document_path).unwrap();
    file.write_all(json.to_string().as_bytes()).unwrap();

    let new_note = json!({
        "id": notes_array.len() + 1,
        "document_name": document_name
    });

    notes_array.push(new_note);

    let mut notes_file = File::create(notes_path).expect("Unable to create file");
    notes_file.write_all(notes_json.to_string().as_bytes()).expect("Unable to write to file");
    true
}
