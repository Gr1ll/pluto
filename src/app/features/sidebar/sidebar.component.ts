import { Component, OnInit, Renderer2 } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { invoke } from "@tauri-apps/api/tauri";
import { FormsModule } from "@angular/forms";
import { Document } from "../../../types/documents";
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DocService } from "../../core/service/doc.service";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    CdkDropList,
    CdkDrag,
    RouterLink,
    CommonModule,
  ],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  constructor(protected docService: DocService, private router: Router) {}
  documentToCreate: String = "";

  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };
  targetId: number | null = null;

  async ngOnInit() {
    await this.docService.getDocumentsJson().then(() => {
      console.log("getDocumentsJson");
    });
    console.log(this.docService.Documents);
    document.addEventListener("click", this.onClickOutside.bind(this));
  }

  createDocument(documentName: String) {
    this.docService.createDocument(documentName);
  }

  public updateDocs() {
    this.getDocumentsJson();
  }

  async getDocumentsJson(): Promise<void> {
    this.docService.getDocumentsJson();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (!this.docService.Documents) return;
    moveItemInArray(
      this.docService.Documents.notes,
      event.previousIndex,
      event.currentIndex
    );

    this.docService.Documents.notes.forEach((note: Document, index: any) => {
      note.index = index;
    });
    let documentArray: string = JSON.stringify(this.docService.Documents);
    invoke("update_index", { documentArray });
  }

  deleteDocument() {
    if (this.targetId !== null) {
      const documentId = this.targetId;
      if (documentId === this.docService.currentDocumentId()) {
        this.docService.currentDocumentId.set(new Number());
        this.router.navigate(["/"]);
      }
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
