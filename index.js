require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
const e = require("express");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urlMap = [];

app.post(
  "/api/shorturl",
  function (req, res, next) {
    try {
      const url = new URL(req.body.url);
      res.url = url;
      next();
    } catch (error) {
      return res.json({ error: "Invalid URL" });
    }
  },
  function (req, res, next) {
    dns.lookup(res.url.hostname, (err) => {
      if (err)
        res.json({ error: "Invalid URL" });
      else
        next();
    });
  },
  function (req, res) {
    let short_url = urlMap.push(res.url);
    res.json({ original_url: res.url.toString(), short_url });
  }
);

app.get("/api/shorturl/:shorturl", function (req, res) {
  if (req.params.shorturl <= urlMap.length)
    res.redirect(urlMap[req.params.shorturl - 1]);
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
