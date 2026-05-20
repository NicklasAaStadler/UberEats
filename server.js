const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Hardcodede brugere — skift passwords efter behov
const users = [
  { username: 'student@uni.dk', password: '1234', role: 'student' },
  { username: 'bruger@mail.dk', password: '1234', role: 'normal' },
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Forkert brugernavn eller adgangskode' });
  }

  res.json({ role: user.role, username: user.username });
});

app.listen(3000, () => {
  console.log('Server kører på http://localhost:3000');
});
