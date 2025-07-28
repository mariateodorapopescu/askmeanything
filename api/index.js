import express from 'express';
import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
// import query from './models/query.model.js';

dotenv.config();

const app = express();

app.use(express.json());

// conectare MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log(chalk.green('[OK]') + ' Connected to database');
  })
  .catch((err) => {
    console.log(chalk.red('[FAILED]') + ' Couldn\'t connect to database: ' + err.message);
  });

// pornire server
app.listen(3000, () => {
  console.log(chalk.green('[OK]') + ' Initialised server');
});
app.get('/test', (req, res) => {
    res.json({message: "Hello, world!"}); 
});
app.use('/api/user', userRoutes );
app.use('/api/users', userRoutes );
app.use('/api/auth', authRoutes );
app.get('/api/questions', async (req, res) => {
    try {
      const allQuestions = await User.find(); // fetches everything
      res.status(200).json(allQuestions);
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong', details: err });
    }
  });
app.use((err, req, res, next) =>
{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Off, a crapat =(";
    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message 
    });
}
);