const express = require('express');
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Node.js Server!' });
});

 	const bookRoutes = require('./router/books');
  app.use(express.json());
 	app.use('/api/books', bookRoutes);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
