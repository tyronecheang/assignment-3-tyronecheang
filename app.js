const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  session({
    secret: '702605bb-76b3-4048-b483-d9ffd0a63ff3',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('menu');
});

app.get('/game', (req, res) => {
  const mode = req.query.mode;
  req.session.mode = mode;
  res.render('game', { mode });
});


app.get('/win', (req, res) => {
  res.render('win', { mode: req.session.mode });
});

app.get('/lose', (req, res) => {
  res.render('lose', { mode: req.session.mode });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});