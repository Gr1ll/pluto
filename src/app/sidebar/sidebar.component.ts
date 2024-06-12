import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { invoke } from "@tauri-apps/api/tauri";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [MatIconModule, FormsModule],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent {
  constructor() {}
  documentToCreate: String = "";

  createDocument(documentName: String) {
    invoke("get_document_creation", { documentName }).then((res) => {
      console.log(res);
    });
  }
}
