import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-note-file",
  standalone: true,
  imports: [],
  templateUrl: "./note-file.component.html",
  styleUrl: "./note-file.component.css",
})
export class NoteFileComponent implements OnInit, OnDestroy {
  private routeSub!: Subscription;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      console.log(params["noteId"]); //log the value of id
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
