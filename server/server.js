const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "*"
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("IRAP Backend Running readdy readdyy");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ahh running readdy readdyy on port ${PORT}`);
});