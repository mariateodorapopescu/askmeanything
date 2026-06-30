// // Combină Question + Article + BlogPost într-un singur feed unificat,
// // pentru că frontend-ul așteaptă un singur shape "Post"

// import Question from '../models/Question.js';
// import Article from '../models/Article.js';
// import BlogPost from '../models/BlogPost.js';

// // Taie un text lung la N caractere, pentru excerpt (când nu există unul nativ)
// function truncate(text, length = 160) {
//   if (!text) return '';
//   return text.length > length ? text.slice(0, length).trim() + '...' : text;
// }

// // Extrage un nume de afișat din author — care poate fi populat sau gol
// function getAuthorName(author, fallback = 'Anonim') {
//   if (!author) return fallback;
//   if (typeof author === 'string') return fallback; // ObjectId nepopulat
//   return author.name || author.username || fallback;
// }

// export const getAllPosts = async (req, res) => {
//   try {
//     // Promise.all = cele 3 query-uri rulează în paralel, nu pe rând
//     const [questions, articles, blogposts] = await Promise.all([
//       Question.find({}).populate('author', 'name username').sort({ createdAt: -1 }).limit(20),
//       Article.find({ published: true }).populate('author', 'name username').sort({ createdAt: -1 }).limit(20),
//       BlogPost.find({ published: true }).populate('author', 'name username').sort({ createdAt: -1 }).limit(20),
//     ]);

//     const mappedQuestions = questions.map(q => ({
//       _id: q._id,
//       title: q.question,
//       excerpt: truncate(q.answer),
//       content: q.answer,
//       author: 'Anonim', // Q&A e mereu anonim, indiferent ce e în DB
//       category: 'Q&A',
//       imageUrl: '',
//       featured: false,
//       createdAt: q.createdAt,
//     }));

//     const mappedArticles = articles.map(a => ({
//       _id: a._id,
//       title: a.title,
//       excerpt: a.subtitle || truncate(a.content),
//       content: a.content,
//       author: getAuthorName(a.author),
//       category: 'Articol',
//       imageUrl: a.coverImage || '',
//       featured: false,
//       createdAt: a.createdAt,
//     }));

//     const mappedBlogposts = blogposts.map(b => ({
//       _id: b._id,
//       title: b.title,
//       excerpt: truncate(b.content),
//       content: b.content,
//       author: getAuthorName(b.author),
//       category: 'Blog',
//       imageUrl: b.coverImage || '',
//       featured: false,
//       createdAt: b.createdAt,
//     }));

//     const allPosts = [...mappedQuestions, ...mappedArticles, ...mappedBlogposts]
//       .sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));

//     res.status(200).json(allPosts);
//   } catch (err) {
//     console.error('Error in getAllPosts:', err);
//     res.status(500).json({ message: 'Server error fetching posts' });
//   }
// };

// const Question = require('../models/question.model.js');
// const Article = require('../models/article.model.js');
// const BlogPost = require('../models/blogpost.model.js');

// function truncate(text, length = 160) {
//   if (!text) return '';
//   return text.length > length ? text.slice(0, length).trim() + '...' : text;
// }

// function getAuthorName(author, fallback = 'Anonim') {
//   if (!author) return fallback;
//   if (typeof author === 'string') return fallback;
//   return author.name || author.username || fallback;
// }

// const getAllPosts = async (req, res) => {
//   try {
//     const [questions, articles, blogposts] = await Promise.all([
//       Question.find({}).populate('author', 'name username').sort({ createdAt: -1 }).limit(20),
//       Article.find({ published: true }).populate('author', 'name username').sort({ createdAt: -1 }).limit(20),
//       BlogPost.find({ published: true }).populate('author', 'name username').sort({ createdAt: -1 }).limit(20),
//     ]);

//     const mappedQuestions = questions.map(q => ({
//       _id: q._id,
//       title: q.question,
//       excerpt: truncate(q.answer),
//       content: q.answer,
//       author: 'Anonim',
//       category: 'Q&A',
//       imageUrl: '',
//       featured: false,
//       createdAt: q.createdAt,
//     }));

//     const mappedArticles = articles.map(a => ({
//       _id: a._id,
//       title: a.title,
//       excerpt: a.subtitle || truncate(a.content),
//       content: a.content,
//       author: getAuthorName(a.author),
//       category: 'Articol',
//       imageUrl: a.coverImage || '',
//       featured: false,
//       createdAt: a.createdAt,
//     }));

//     const mappedBlogposts = blogposts.map(b => ({
//       _id: b._id,
//       title: b.title,
//       excerpt: truncate(b.content),
//       content: b.content,
//       author: getAuthorName(b.author),
//       category: 'Blog',
//       imageUrl: b.coverImage || '',
//       featured: false,
//       createdAt: b.createdAt,
//     }));

//     const allPosts = [...mappedQuestions, ...mappedArticles, ...mappedBlogposts]
//       .sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));

//     res.status(200).json(allPosts);
//   } catch (err) {
//     console.error('Error in getAllPosts:', err);
//     res.status(500).json({ message: 'Server error fetching posts' });
//   }
// };

// module.exports = { getAllPosts };

// api/controllers/posts.controller.js
import Question from '../models/question.model.js';
import Article from '../models/article.model.js';
import BlogPost from '../models/blogpost.model.js';

function truncate(text, length = 160) {
  if (!text) return '';
  return text.length > length ? text.slice(0, length).trim() + '...' : text;
}

function getAuthorName(author, fallback = 'Anonim') {
  if (!author) return fallback;
  if (typeof author === 'string') return fallback;
  return author.name || author.username || fallback;
}

export const getAllPosts = async (req, res) => {
  try {
    const [questions, articles, blogposts] = await Promise.all([
      Question.find({}).populate('author', 'name username').sort({ createdAt: -1 }).limit(20),
      Article.find({ published: true }).populate('author', 'name username').sort({ createdAt: -1 }).limit(20),
      BlogPost.find({ published: true }).populate('author', 'name username').sort({ createdAt: -1 }).limit(20),
    ]);

    const mappedQuestions = questions.map(q => ({
      _id: q._id,
      title: q.question,
      excerpt: truncate(q.answer),
      content: q.answer,
      author: 'Anonim',
      category: 'Q&A',
      imageUrl: '',
      featured: false,
      createdAt: q.createdAt,
      type: 'question',
      views: q.views,
    }));

    const mappedArticles = articles.map(a => ({
      _id: a._id,
      title: a.title,
      excerpt: a.subtitle || truncate(a.content),
      content: a.content,
      author: getAuthorName(a.author),
      category: 'Articol',
      imageUrl: a.coverImage || '',
      featured: false,
      createdAt: a.createdAt,
      type: 'article',
      views: a.views,
    }));

    const mappedBlogposts = blogposts.map(b => ({
      _id: b._id,
      title: b.title,
      excerpt: truncate(b.content),
      content: b.content,
      author: getAuthorName(b.author),
      category: 'Blog',
      imageUrl: b.coverImage || '',
      featured: false,
      createdAt: b.createdAt,
      type: 'blogpost',
      views: b.views,
    }));

    const allPosts = [...mappedQuestions, ...mappedArticles, ...mappedBlogposts]
      .sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));

    res.status(200).json(allPosts);
  } catch (err) {
    console.error('Error in getAllPosts:', err);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};
// Top 3 cele mai vizualizate, din toate colecțiile combinate
export const getTopPosts = async (req, res) => {
  try {
    const [questions, articles, blogposts] = await Promise.all([
      Question.find({}).sort({ views: -1 }).limit(3),
      Article.find({ published: true }).sort({ views: -1 }).limit(3),
      BlogPost.find({ published: true }).sort({ views: -1 }).limit(3),
    ]);

    const all = [
      ...questions.map(q => ({
        _id: q._id, title: q.question, excerpt: truncate(q.answer),
        imageUrl: '', category: 'Q&A', author: 'Anonim',
        featured: false, createdAt: q.createdAt,
        views: q.views, type: 'question',
      })),
      ...articles.map(a => ({
        _id: a._id, title: a.title, excerpt: a.subtitle || truncate(a.content),
        imageUrl: a.coverImage || '', category: 'Articol', author: getAuthorName(a.author),
        featured: false, createdAt: a.createdAt,
        views: a.views, type: 'article',
      })),
      ...blogposts.map(b => ({
        _id: b._id, title: b.title, excerpt: truncate(b.content),
        imageUrl: b.coverImage || '', category: 'Blog', author: getAuthorName(b.author),
        featured: false, createdAt: b.createdAt,
        views: b.views, type: 'blogpost',
      })),
    ]
      .sort((x, y) => (y.views || 0) - (x.views || 0))
      .slice(0, 3);

    res.status(200).json(all);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Incrementează views cu 1 — apelat din frontend când userul deschide un post
// $inc e un operator Mongoose care adaugă direct în DB, atomic, fără să citească valoarea întâi
export const incrementView = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    const Model = type === 'question' ? Question
                : type === 'article'  ? Article
                : BlogPost;

    const doc = await Model.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true } // returnează documentul DUPĂ update, nu înainte
    );

    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ views: doc.views });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};