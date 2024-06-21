import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  WritableSignal,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { MarkdownPipe } from "../pipe/markdown.pipe";
import { FormsModule } from "@angular/forms";
import { invoke } from "@tauri-apps/api/tauri";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { DocService } from "../service/doc.service";

@Component({
  selector: "app-note-file",
  standalone: true,
  imports: [MarkdownPipe, FormsModule],
  templateUrl: "./note-file.component.html",
  styleUrl: "./note-file.component.css",
})
export class NoteFileComponent implements OnInit, OnDestroy {
  private routeSub!: Subscription;
  documentName: WritableSignal<string> = signal("");
  markdownContent: WritableSignal<string> = signal("Initial content...");
  isEditing: boolean = false;
  isEditingTitle: boolean = false;
  currentDocumentId: WritableSignal<Number> = signal(new Number());

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private docService: DocService
  ) {}

  ngOnInit() {
    let documentId: number;
    this.routeSub = this.route.params.subscribe((params) => {
      const id = params["noteId"];
      documentId = parseInt(id);
      this.currentDocumentId.set(documentId);

      invoke("get_document_name_by_id", { documentId }).then(
        (res: string | any) => {
          this.documentName.set(res);
        }
      );

      invoke("get_document_by_id", { documentId }).then((res: string | any) => {
        this.markdownContent.set(res);
      });
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  toggleView() {
    this.isEditing = false;
  }

  updateContent(newContent: string) {
    this.markdownContent.set(newContent);
    invoke("update_note_content_by_id", {
      documentId: this.currentDocumentId(),
      documentContent: newContent,
    }).then(() => {
      this.docService.updateDocs();
    });
  }

  toggleEditTitle() {
    this.isEditingTitle = !this.isEditingTitle;
  }

  toggleTitleView() {
    this.isEditingTitle = false;
  }

  updateTitle(newTitle: string) {
    this.documentName.set(newTitle);
    const documentId = this.currentDocumentId();
    const documentName = newTitle;
    invoke("update_name_by_id", { documentId, documentName }).then(() => {
      this.docService.updateDocs();
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
