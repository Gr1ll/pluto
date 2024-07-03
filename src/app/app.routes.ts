import { Routes } from "@angular/router";
import { NoteFileComponent } from "./features/note-file/note-file.component";

export const routes: Routes = [
  {
    path: ":noteId",
    component: NoteFileComponent,
  },
];
