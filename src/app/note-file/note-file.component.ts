import { Component, OnDestroy, OnInit } from "@angular/core";
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

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      console.log(params["noteId"]); //log the value of id
    });
  }

  updateContent(newContent: string): void {
    this.markdownContent = newContent;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
