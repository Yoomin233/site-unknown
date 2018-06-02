const express = require("express");
const app = express();

const fs = require("fs-extra");
const path = require("path");
var url = require("url");

const port = process.env.NODE_ENV === 'production' ? 80 : 8000;

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => res.send("welcome to root!"));

// static files
app.use("/static", express.static(path.join(__dirname, "./static")));

app.get("/loveactionmovies", async (req, res) => {
  const dirPath = path.join(__dirname, "./static/videos");
  // filter out hidden files
  const fileList = (await fs.readdir(dirPath)).filter(
    fileName =>
      !fileName.startsWith(".") &&
      fileName !== "fileList.json" &&
      fileName !== "fileStat.json"
  );
  let needsUpdateFlag = false;
  // check existing fileList
  if (fs.existsSync(path.join(__dirname, "./static/videos/fileList.json"))) {
    const content = await fs.readJSON(
      path.join(__dirname, "./static/videos/fileList.json")
    );
    // new file added
    if (content.length !== fileList.length) {
      needsUpdateFlag = true;
    }
    // if same length, no update
  } else {
    needsUpdateFlag = true;
  }
  if (needsUpdateFlag) {
    await fs.writeJSON(
      path.join(__dirname, "./static/videos/fileList.json"),
      fileList
    );
    const detailedFileListPromise = [];
    let detailedFileList;
    for (let i = 0; i < fileList.length; i++) {
      const fileName = fileList[i];
      const filePath = path.join(dirPath, fileName);
      detailedFileListPromise.push(fs.stat(filePath));
    }
    detailedFileList = await Promise.all(detailedFileListPromise);
    // append filename
    detailedFileList = detailedFileList.map((fileStat, index) => ({
      ...fileStat,
      fileName: fileList[index]
    }));
    const organizedByDateFileList = detailedFileList.reduce((prev, next) => {
      const { mtime: ctime } = next;
      const dateStr = `${ctime.getFullYear()}-${
        ctime.getMonth() < 10
          ? "0" + (ctime.getMonth() + 1)
          : ctime.getMonth() + 1
      }-${ctime.getDate() < 10 ? "0" + ctime.getDate() : ctime.getDate()}`;
      prev[dateStr] ? prev[dateStr].push(next) : (prev[dateStr] = [next]);
      return prev;
    }, {});
    await fs.writeJSON(
      path.join(__dirname, "./static/videos/fileStat.json"),
      organizedByDateFileList
    );
    res.render("loveactionmovies/index", {
      movieList: organizedByDateFileList
    });
  } else {
    const fileStatDetails = await fs.readJSON(
      path.join(__dirname, "./static/videos/fileStat.json")
    );
    res.render("loveactionmovies/index", {
      movieList: fileStatDetails
    });
  }
  // res.end(JSON.stringify(organizedByDateFileList));
});

app.get("/viewloveactionmovies", async (req, res) => {
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;
  res.render("loveactionmovies/view", {
    fileName: query.view
  });
});

app.get("/api/*", (req, res, next) => {
  res.set({ "content-type": "application/json; charset=utf-8" });
  next();
});

// app.get("/api/api1", (req, res) => {
//   res.send('{"ab": "3"}');
// });

app.listen(8000, () => console.log("server running at port 8000"));
