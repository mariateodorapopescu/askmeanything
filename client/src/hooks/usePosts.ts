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
interface UsePostsReturn {
  posts: Post[];               // toate posturile (fără cel featured)
  featuredPost: Post | null;   // primul post marcat cu featured: true
  loading: boolean;            // true cât timp fetch-ul e în curs
  error: string | null;        // mesaj de eroare dacă ceva a mers prost
}

export function usePosts(): UsePostsReturn {
  // useState<T> — hook React pentru state local al componentei
  // T = tipul valorii din state (TypeScript generic)
  const [posts, setPosts]               = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [loading, setLoading]           = useState<boolean>(true);
  const [error, setError]               = useState<string | null>(null);

  // useEffect — se rulează după ce componenta se montează (apare în DOM)
  // Al doilea argument "[]" = array de dependențe gol → rulează O SINGURĂ DATĂ
  // (dacă ai pune [userId] acolo, ar re-rula de fiecare dată când userId se schimbă)
  useEffect(() => {
    // Funcție async în interiorul useEffect
    // (useEffect în sine nu poate fi async — de aceea definim funcția înăuntru)
    const fetchPosts = async () => {
      try {
        // import.meta.env.VITE_API_URL = variabila de environment din .env
        // Vite expune variabilele care încep cu VITE_ în client
        // Fallback la localhost dacă variabila nu e setată
        const base = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

        // fetch() = browser API pentru HTTP requests
        // await = "așteaptă" promisiunea să se rezolve
        const response = await fetch(`${base}/posts`);

        // Dacă statusul HTTP nu e 2xx, aruncăm o eroare
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        // .json() parsează body-ul răspunsului din text JSON în obiect JS
        const data: Post[] = await response.json();

        // Separăm postul featured de restul
        const featured = data.find(p => p.featured) ?? data[0] ?? null;
        // .find() returnează primul element care satisface condiția
        // "??" (nullish coalescing) = dacă e null/undefined, folosește valoarea din dreapta

        // Restul posturilor (fără featured, maxim 4 pe homepage)
        const rest = data
          .filter(p => p._id !== featured?._id) // .filter() = array nou fără elementul featured
          .slice(0, 4);                          // .slice(0,4) = primele 4 elemente

        setFeaturedPost(featured);
        setPosts(rest);
      } catch (err) {
        // err e de tip "unknown" în TypeScript modern — trebuie cast
        setError(err instanceof Error ? err.message : 'Eroare necunoscută');
      } finally {
        // "finally" rulează INDIFERENT dacă a fost eroare sau nu
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // array gol = rulează o singură dată la mount

  return { posts, featuredPost, loading, error };
}