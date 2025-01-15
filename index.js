const express = require("express");
const app = express();
const port = 5000;

// mongoo DB 설치
// npm install mongoose --save
const mongoose = require("mongoose"); //package.json 에 'mongoose' 추가된거 확인.

//db 연결
mongoose
  .connect(
    "mongodb+srv://pjg2080:qwer1234@cluster0.w6djt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!!!!!!"));

app.listen(port, () => console.log("Example app listening on port ${port}!"));
