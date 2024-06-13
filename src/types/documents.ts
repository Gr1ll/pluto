export interface Document {
  id: number;
  document_name: string;
  index: number;
}

export interface Documents {
  notes: Document[];
}
