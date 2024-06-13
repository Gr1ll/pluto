use std::{
    fs::File,
    io::{Read, Write},
    path::PathBuf,
};

use dirs::data_dir;
use serde_json::{json, Value};

fn get_app_data_dir() -> PathBuf {
    let mut path = data_dir().expect("Unable to get application data directory");
    path.push("pluto");
    path
}

pub fn update_name_by_id(document_id: i64, document_name: &str) -> bool {
    let app_data_dir = get_app_data_dir();
    let notes_path = app_data_dir.join("notes.json");

    let mut notes_file = File::open(&notes_path).expect("Unable to open file");
    let mut notes_data = String::new();
    notes_file
        .read_to_string(&mut notes_data)
        .expect("Unable to read file");

    let mut notes_json: Value = serde_json::from_str(&notes_data).expect("Unable to parse JSON");
    let notes_array = notes_json["notes"]
        .as_array_mut()
        .expect("Expected notes to be an array");

    for note in notes_array.iter_mut() {
        if let Some(id) = note["id"].as_i64() {
            if id == document_id {
                note["document_name"] = json!(document_name);
            }
        }
    }

    let mut notes_file = File::create(notes_path).expect("Unable to create file");
    notes_file
        .write_all(notes_json.to_string().as_bytes())
        .expect("Unable to write to file");
    true
}
