const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const express = require('express');
const app = express();

app.use(express.json());

console.log(__dirname);
app.listen(process.env.PORT, () => {
  console.log(`server has started on port: ${process.env.PORT}`)
})