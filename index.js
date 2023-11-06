const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MOBILE STORE SERVER IS RUNNING");
});

app.listen(port, (req, res) => {
  console.log(`MOBILE STORE SERVER IN RUNNING ON PORT ${port}`);
});
