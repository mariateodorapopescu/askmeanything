// client/src/hooks/usePosts.ts
//
// Ce e un "custom hook"?
// Un hook e o funcție care începe cu "use" și poate folosi
// alte hook-uri React (useState, useEffect, etc.).
// Custom hooks = logică reutilizabilă extrasă din componente.
// Avantaj: orice componentă care vrea posts o apelează
// și primește { posts, featuredPost, loading, error } gata.

import { useState, useEffect } from 'react';
import type { Post } from '../types/Post';

// Tipul returnat de hook — TypeScript știe exact ce primești
// interface UsePostsReturn {
//   posts: Post[];               // toate posturile (fără cel featured)
//   featuredPost: Post | null;   // primul post marcat cu featured: true
//   loading: boolean;            // true cât timp fetch-ul e în curs
//   error: string | null;        // mesaj de eroare dacă ceva a mers prost
// }

interface UsePostsReturn {
  posts: Post[];
  topPosts: Post[];        // ← linie nouă
  featuredPost: Post | null;
  loading: boolean;
  error: string | null;
}

export function usePosts(): UsePostsReturn {
  // useState<T> — hook React pentru state local al componentei
  // T = tipul valorii din state (TypeScript generic)
  const [posts, setPosts]               = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [loading, setLoading]           = useState<boolean>(true);
  const [error, setError]               = useState<string | null>(null);
  const [topPosts, setTopPosts] = useState<Post[]>([]);

  // useEffect — se rulează după ce componenta se montează (apare în DOM)
  // Al doilea argument "[]" = array de dependențe gol → rulează O SINGURĂ DATĂ
  // (dacă ai pune [userId] acolo, ar re-rula de fiecare dată când userId se schimbă)
  useEffect(() => {
    // Funcție async în interiorul useEffect
    // (useEffect în sine nu poate fi async — de aceea definim funcția înăuntru)
    const fetchPosts = async () => {
  try {
    const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

    // Cele două fetch-uri rulează în paralel cu Promise.all
    const [response, topResponse] = await Promise.all([
      fetch(`${base}/api/posts`),
      fetch(`${base}/api/posts/top`),
    ]);

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data: Post[] = await response.json();
    const topData: Post[] = topResponse.ok ? await topResponse.json() : [];

    const featured = data.find(p => p.featured) ?? data[0] ?? null;
    const rest = data.filter(p => p._id !== featured?._id).slice(0, 4);

    setFeaturedPost(featured);
    setPosts(rest);
    setTopPosts(topData);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Eroare necunoscută');
  } finally {
    setLoading(false);
  }
};

    fetchPosts();
  }, []); // array gol = rulează o singură dată la mount

  // return { posts, featuredPost, loading, error };
  // return { posts, topPosts, featuredPost, loading, error };
  return { posts, topPosts, featuredPost, loading, error };
}