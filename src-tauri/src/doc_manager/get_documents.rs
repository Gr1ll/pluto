use std::{fs::File, io::Read, path::PathBuf};

use dirs::data_dir;

fn get_app_data_dir() -> PathBuf {
    let mut path = data_dir().expect("Unable to get application data directory");
    path.push("pluto");
    path
}

pub fn return_documents() -> String{
    // get json array from notes.json and return it
    let app_data_dir = get_app_data_dir();
    let notes_path = app_data_dir.join("notes.json");

    let mut notes_file = File::open(&notes_path).expect("Unable to open file");
    let mut notes_data = String::new();
    notes_file.read_to_string(&mut notes_data).expect("Unable to read file");

    return notes_data;
}