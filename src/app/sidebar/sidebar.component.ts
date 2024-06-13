import { Component, OnInit, Renderer2 } from "@angular/core";
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
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [MatIconModule, FormsModule, CdkDropList, CdkDrag, RouterLink],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  constructor() {}
  documentToCreate: String = "";
  Documents: Documents | undefined = undefined;

  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };
  targetId: number | null = null;

  ngOnInit(): void {
    this.getDocumentsJson();
    document.addEventListener("click", this.onClickOutside.bind(this));
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

    this.Documents.notes.forEach((note, index) => {
      note.index = index;
    });
    let documentArray: string = JSON.stringify(this.Documents);
    invoke("update_index", { documentArray });
  }

  deleteDocument() {
    if (this.targetId !== null) {
      const documentId = this.targetId;
      invoke("delete_document", { documentId }).then(() => {
        this.getDocumentsJson();
      });
      this.hideContextMenu();
    }
  }

  onRightClick(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.targetId = index;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.showContextMenu = true;
  }

  hideContextMenu(): void {
    this.showContextMenu = false;
    this.targetId = null;
  }

  onClickOutside(event: MouseEvent): void {
    if (
      !event.target ||
      !(<HTMLElement>event.target).closest("#context-menu")
    ) {
      this.hideContextMenu();
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener("click", this.onClickOutside.bind(this));
  }
}
