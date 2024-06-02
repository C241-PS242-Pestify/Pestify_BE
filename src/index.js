// external imports
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const articleRoutes = require('./routes/article');
const userRoutes = require('./routes/user');

app.use('/auth', authRoutes);
app.use('/', pageRoutes);
app.use('/', articleRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log(`server running in ${PORT}`);
  });
