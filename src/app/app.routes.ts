import { Routes } from "@angular/router";
import { NoteFileComponent } from "./note-file/note-file.component";

export const routes: Routes = [
  {
    path: ":note",
    component: NoteFileComponent,
  },
];
