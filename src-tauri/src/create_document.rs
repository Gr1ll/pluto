use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use rustc_serialize::json::Json;
use serde_json::{json, Value};

pub fn check_if_files_exist() {
    if !Path::new("notes.json").exists() {
        File::create("notes.json").unwrap();
        let json = Json::from_str("{\"notes\":[]}").unwrap();
        let mut file = File::create("notes.json").unwrap();
        file.write_all(json.to_string().as_bytes()).unwrap();
    }
    if !Path::new("config.json").exists() {
        File::create("config.json").unwrap();
    }
}

fn create_note_document(document_name: &str) {
    let json = Json::from_str("{\"name\":\"John Doe\"}").unwrap();
    let mut file = File::create(document_name).unwrap();
    file.write_all(json.to_string().as_bytes()).unwrap();
    println!("{:?}", "file");
    let mut notes_file = File::open("notes.json").expect("Unable to open file");
    let mut notes_data = String::new();
    notes_file.read_to_string(&mut notes_data).expect("Unable to read file");

    let mut notes_json: Value = serde_json::from_str(&notes_data).expect("Unable to parse JSON");
    let notes_array = notes_json["notes"].as_array_mut().expect("Expected notes to be an array");

    let new_note = json!({
        "id": notes_array.len() + 1,
        "document_name": document_name
    });

    notes_array.push(new_note);

    let mut notes_file = File::create("notes.json").expect("Unable to create file");
    notes_file.write_all(notes_json.to_string().as_bytes()).expect("Unable to write to file");

    println!("{:?}", "notes_file");
}