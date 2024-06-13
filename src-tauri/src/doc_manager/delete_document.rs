use std::{
    fs::{self, File},
    io::{self, Read, Write},
    path::PathBuf,
};

use dirs::data_dir;
use serde_json::{json, Value};

fn get_app_data_dir() -> PathBuf {
    let mut path = data_dir().expect("Unable to get application data directory");
    path.push("pluto");
    path
}

pub fn delete_document(document_id: i64) -> bool {
    let app_data_dir = get_app_data_dir();
    let notes_path = app_data_dir.join("notes.json");
    let mut notes_file = File::open(&notes_path).expect("Unable to open file");
    let mut notes_data = String::new();
    notes_file
        .read_to_string(&mut notes_data)
        .expect("Unable to read file");

    let mut notes_json: Value = serde_json::from_str(&notes_data).expect("Unable to parse JSON");
    let notes_array: &mut Vec<Value> = notes_json["notes"]
        .as_array_mut()
        .expect("Expected notes to be an array");

    let mut index_to_remove = None;

    for (index, note) in notes_array.iter().enumerate() {
        if let Some(id) = note["id"].as_i64() {
            if id == document_id {
                index_to_remove = Some(index);
                break;
            }
        }
    }

    if let Some(index) = index_to_remove {
        notes_array.remove(index);
    }

    for (index, note) in notes_array.iter_mut().enumerate() {
        note["index"] = json!(index);
    }

    let mut file = File::create(&notes_path).unwrap();
    file.write_all(notes_json.to_string().as_bytes()).unwrap();

    let document_path = app_data_dir.join(format!("{}.json", document_id));
    remove_file(document_path);
    true
}

fn remove_file(document_path: PathBuf) -> io::Result<()> {
    fs::remove_file(document_path)?;
    Ok(())
}
