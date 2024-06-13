import { Component, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { invoke } from "@tauri-apps/api/tauri";
import { FormsModule } from "@angular/forms";
import { Documents } from "../../types/documents";
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from "@angular/cdk/drag-drop";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [MatIconModule, FormsModule, CdkDropList, CdkDrag],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  constructor() {}
  documentToCreate: String = "";
  Documents: Documents | undefined = undefined;

  ngOnInit(): void {
    this.getDocumentsJson();
  }

  createDocument(documentName: String) {
    invoke("get_document_creation", { documentName }).then(() => {
      this.getDocumentsJson();
    });
  }

  async getDocumentsJson(): Promise<void> {
    this.Documents = await invoke("get_documents").then((res: string | any) => {
      return JSON.parse(res);
    });
    this.Documents?.notes.sort((a, b) => a.index - b.index);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (!this.Documents) return;
    moveItemInArray(
      this.Documents.notes,
      event.previousIndex,
      event.currentIndex
    );
    console.log("now", event.currentIndex);
    console.log("before", event.previousIndex);

    this.Documents.notes.forEach((note, index) => {
      note.index = index;
    });
    let documentArray: string = JSON.stringify(this.Documents);
    invoke("update_index", { documentArray });
  }

  deleteDocument(documentId: number) {
    invoke("delete_document", { documentId }).then(() => {
      this.getDocumentsJson();
    });
  }
}
