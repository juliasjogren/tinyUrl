const express = require("express");
const bodyParser = require("body-parser");
const base62 = require("base62/lib/ascii");

const urls = [];
const port = 3000;

let count = 9597;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

app.post("/api/addUrl", (req, res) => {
  const urlInput = req.body.url;
  const newUrl = buildNewUrl(urlInput);
  res.send(newUrl);
});

app.get("/:tinyUrl", function(req, res) {
  const tinyUrl = req.params.tinyUrl;
  const url = urls.find(function(url) {
    return String(url.tinyUrl) === tinyUrl;
  });
  if (!url) {
    res.redirect("/");
  } else {
    res.redirect(url.url);
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));

function buildNewUrl(urlInput) {
  const newUrl = {};
  if (urlInput.includes("https://" || "http://")) {
    newUrl.url = urlInput;
  } else {
    newUrl.url = "https://" + urlInput;
  }
  count += 1;
  const tinyUrlCount = base62.encode(count);
  const tinyUrl = addZerosToTinyUrl(tinyUrlCount);
  newUrl.tinyUrl = tinyUrl;
  urls.push(newUrl);

  return newUrl;
}

function addZerosToTinyUrl(tinyUrl) {
  if (tinyUrl.length < 6) {
    tinyUrl = "0" + tinyUrl;
    const newTinyUrl = addZerosToTinyUrl(tinyUrl);
    tinyUrl = newTinyUrl;
  }
  return tinyUrl;
}
