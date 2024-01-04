import fs from "node:fs";
import path from "node:path";

import cors from "express-cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import swagger from "./swagger.json" assert { type: "json" };
import quotes from "./resources/quotes.json" assert { type: "json" };

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

const PORT = process.env.PORT || 3000;
const app = express();

const BASE_PATH = path.join(process.cwd(), "resources");
const IMAGE_PATH = path.join(BASE_PATH, "images");

const pictures = fs.readdirSync(path.join(IMAGE_PATH));

app.use(express.static("resources/images"));
app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagger));

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
  res.redirect("/docs");
});

app.listen(PORT, () => {
  console.log("Listening on port %s", PORT);
});
