// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod create_document;

use rustc_serialize::json::Json;
use std::fs::File;
use std::io:: {stdout, copy};
use std::path:: Path;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Me!", name)
}

fn main() {
    if Path::new("text.json").exists() {
        println!("{:?}", "file exists");
    } else {
        println!("{:?}", "file does not exist");
    }
    let mut file = File::open("text.json").unwrap();

    let mut stdout = stdout();
    let str = &copy(&mut file, &mut stdout).unwrap().to_string();
    let _data = Json::from_str(str).unwrap();
    println!("{:?}", "file");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}