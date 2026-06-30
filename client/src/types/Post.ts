// client/src/types/post.ts
//
// Ce e un "interface" în TypeScript?
// E un contract care descrie forma unui obiect.
// Dacă un obiect zice că e de tip Post, TypeScript
// verifică că are exact câmpurile astea cu tipurile astea.
// Beneficiu: autocomplete în editor + erori la compilare, nu la runtime.

export interface Post {
  _id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
  views?: number;                              // ← nou
  type?: 'question' | 'article' | 'blogpost'; // ← nou (ca să știm unde incrementăm views)
}

// Tipul răspunsului API — backend-ul tău returnează un array de Post
export type PostsResponse = Post[];