import fs from "node:fs";
import path from "node:path";

import cors from "express-cors";
import express from "express";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

const PORT = process.env.PORT || 3000;
const app = express();

const BASE_PATH = path.join(process.cwd(), "resources");
const QUOTE_PATH = path.join(BASE_PATH, "quotes.json");
const IMAGE_PATH = path.join(BASE_PATH, "images");

const quotes = JSON.parse(fs.readFileSync(QUOTE_PATH));
const pictures = fs.readdirSync(path.join(IMAGE_PATH));

app.use(express.static("resources/images"));
app.use(cors());

app.get("/api/random", (_, res) => {
  res.json({ message: quotes[~~(Math.random() * quotes.length)] });
});

app.get("/api/cat", (request, res) => {
  const picture = pictures[~~(Math.random() * pictures.length)];
  res.send({ image: request.url + picture });
});

app.get("/api/rocket/async", async (_, res) => {
  await sleep(5000);
  res.send({ message: "Hello, world! 🚀" });
});

app.all("*", (_, res) => {
  res.json({ message: "/api/random" });
});

app.listen(PORT, () => {
  console.log("Listening on port %s", PORT);
});
