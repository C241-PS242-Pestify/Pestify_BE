const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
const pagesRoutes = require('./routes/pages');
const articleRoutes = require('./routes/articles');
const userRoutes = require('./routes/user');
const detailRoutes = require('./routes/detailUser');
const ensiklopediaRoutes = require('./routes/ensiklopedia');
const predictRoutes = require('./routes/predict');
const historyRoutes = require('./routes/history');
const plantRoutes = require('./routes/plants');

app.use('/auth', authRoutes);
app.use('/pages', pagesRoutes);
app.use('/user', userRoutes);
app.use('/history', historyRoutes);
app.use('/', articleRoutes);
app.use('/', detailRoutes);
app.use('/', ensiklopediaRoutes);
app.use('/', predictRoutes);
app.use('/', plantRoutes)

const ClientError = require('./exceptions/ClientError');
const InputError = require('./exceptions/InputError');

app.use((err, req, res, next) => {
  if (err instanceof ClientError || err instanceof InputError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, HOST, () => {
    console.log(`server running in ${PORT}`);
  });