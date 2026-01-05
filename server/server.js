require("dotenv").config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3600;


app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));


const schoolRoutes = require('./routes/schoolRoutes');
const userRoutes = require('./routes/userRoutes');


app.use('/api/schools', schoolRoutes);


app.use('/api/users', userRoutes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});