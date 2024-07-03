import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/tauri";
import { Documents } from "../../../types/documents";

@Injectable({
  providedIn: "root",
})
export class DocService {
  constructor() {}

  public Documents: Documents | any = {};

  public createDocument(documentName: String) {
    invoke("get_document_creation", { documentName }).then(() => {
      this.getDocumentsJson();
    });
  }

  public getDocuments(): Documents | undefined {
    return this.Documents;
  }

  public updateDocs() {
    this.getDocumentsJson();
  }

  public async getDocumentsJson(): Promise<void> {
    this.Documents = await invoke("get_documents").then((res: string | any) => {
      return JSON.parse(res);
    });
    this.Documents?.notes.sort((a: any, b: any) => a.index - b.index);
  }
}
