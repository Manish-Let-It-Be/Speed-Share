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

export interface SharedFile {
  share_code: string;
  file_name: string;
  file_path: string;
  mime_type: string;
  created_at: string;
}

export interface SharedText {
  share_code: string;
  content: string;
  created_at: string;
}