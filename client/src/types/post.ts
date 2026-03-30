// client/src/types/post.ts
//
// Ce e un "interface" în TypeScript?
// E un contract care descrie forma unui obiect.
// Dacă un obiect zice că e de tip Post, TypeScript
// verifică că are exact câmpurile astea cu tipurile astea.
// Beneficiu: autocomplete în editor + erori la compilare, nu la runtime.

export interface Post {
  _id: string;          // MongoDB generează automat un _id de tip string (ObjectId serialized)
  title: string;
  excerpt: string;      // rezumatul scurt afișat pe card
  content?: string;     // "?" = câmp opțional (nu e mereu necesar pe listing)
  author: string;
  category: string;
  imageUrl: string;
  featured: boolean;    // primul post cu featured: true apare în secțiunea Featured
  createdAt: string;    // ISO date string: "2025-03-18T10:00:00.000Z"
}

// Tipul răspunsului API — backend-ul tău returnează un array de Post
export type PostsResponse = Post[];