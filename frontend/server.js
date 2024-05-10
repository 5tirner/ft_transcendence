import express from "express";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app = express();
const rpID = "localhost";
const protocol = "http";
const port = 5050;
const expectedOrigin = `${protocol}://${rpID}:${port}`;

app.use(express.static("srcs"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("*", (req, res) => {
  res.sendFile(__dirname + "srcs/index.html");
});

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
