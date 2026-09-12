const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/identity-docs", express.static("data/identity-docs"));
app.get("/health", (req, res) => res.send("ok"));
app.listen(4000, () => console.log("backend running on http://localhost:4000"));