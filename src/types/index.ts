export interface SharedItem {
  id: string;
  type: 'file' | 'text';
  content: string;
  name: string;
  createdAt: Date;
  shareCode?: string;
  uploadProgress?: number;
}

export interface FileItem extends SharedItem {
  type: 'file';
  size: number;
  mimeType: string;
}

export interface ShareStore {
  [code: string]: SharedItem;
}