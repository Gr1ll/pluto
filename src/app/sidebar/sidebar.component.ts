import { Component, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { invoke } from "@tauri-apps/api/tauri";
import { FormsModule } from "@angular/forms";
import { Documents } from "../../types/documents";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [MatIconModule, FormsModule],
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
  }
}
