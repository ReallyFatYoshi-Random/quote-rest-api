import fs from "node:fs";
import path from "node:path";

import express from "express";

const PORT = process.env.PORT || 3000;
const app = express();

const BASE_PATH = path.join(process.cwd(), "resources");
const QUOTE_PATH = path.join(BASE_PATH, "quotes.json");
const IMAGE_PATH = path.join(BASE_PATH, "images");

const quotes = JSON.parse(fs.readFileSync(QUOTE_PATH));
const pictures = fs.readdirSync(path.join(IMAGE_PATH));

app.use(express.static('resources/images'))

app.get("/api/random", (_, res) => {
  res.json({ message: quotes[~~(Math.random() * quotes.length)] });
});

app.get("/api/cat", (request, res) => {
  const picture = pictures[~~(Math.random() * pictures.length)];
  res.send({ image: request.url + picture });
});

app.all("*", (_, res) => {
  res.json({ message: "/api/random" });
});

app.listen(PORT, () => {
  console.log("Listening on port %s", PORT);
});
