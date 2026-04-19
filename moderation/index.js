const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("IA rodando no servidor");
});

app.listen(3000, () => {
  console.log("Servidor online");
});
