export interface BlogPost {
  _id?: string; // Para MongoDB
  id?: string; // Para compatibilidad con otros sistemas
  title: string;
  content: string;
  images: string[];
  date: string;
  hasPDF: boolean;
  pdfUrl?: string;
}

