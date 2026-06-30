// import express from 'express';
// import { getAllPosts } from '../controllers/posts.controller.js';

// const router = express.Router();

// router.get('/', getAllPosts);

// export default router;

// const express = require('express');
// const { getAllPosts } = require('../controllers/posts.controller.js');

// const router = express.Router();

// router.get('/', getAllPosts);

// module.exports = router;

// api/routes/posts.route.js

// import express from 'express';
// import { getAllPosts } from '../controllers/posts.controller.js';

// const router = express.Router();

// router.get('/', getAllPosts);

// export default router;

import express from 'express';
import { getAllPosts, getTopPosts, incrementView } from '../controllers/posts.controller.js';

const router = express.Router();

router.get('/',        getAllPosts);
router.get('/top',     getTopPosts);      // ← nou
router.patch('/:id/view', incrementView); // ← nou

export default router;