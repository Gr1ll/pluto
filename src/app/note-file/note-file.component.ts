import { Component, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { MarkdownPipe } from "../pipe/markdown.pipe";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-note-file",
  standalone: true,
  imports: [MarkdownPipe, FormsModule],
  templateUrl: "./note-file.component.html",
  styleUrl: "./note-file.component.css",
})
export class NoteFileComponent implements OnInit, OnDestroy {
  private routeSub!: Subscription;
  markdownContent: string = `# Hello, Markdown!`;
  isEditing: boolean = true;

  constructor(private route: ActivatedRoute, private renderer: Renderer2) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      console.log(params["noteId"]);
    });
  }

  updateContent(newContent: string): void {
    this.markdownContent = newContent;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      setTimeout(() => {
        const textArea = document.getElementById("markdown-editor");
        textArea?.focus();
      });
    }
  }

  toggleView(): void {
    this.isEditing = false;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
