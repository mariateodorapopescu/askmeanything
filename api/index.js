import express from 'express';
import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

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
