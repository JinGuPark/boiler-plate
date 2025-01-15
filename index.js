const express = require("express");
const app = express();
const port = 5000;

// mongoo DB 설치
// npm install mongoose --save
const mongoose = require("mongoose"); //package.json 에 'mongoose' 추가된거 확인.

const { User } = require("./models/User");
const bodyParser = require("body-parser");

const config = require("./config/key");

//application/x-www-form-urlencoded 의 데이터를 분석해서 가져오기 위해 설정
app.use(bodyParser.urlencoded({ extended: true }));

//application/json 의 데이터를 분석해서 가져오기 위해 설정
app.use(bodyParser.json());

//db 연결하기
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) =>
  res.send("Hello World! <br> 새해 복 많이 받으세요.")
);

app.post("/register", (req, res) => {
  //회원가입 할때 필요한 정보들을 client에서 가져와서 db에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      seccess: true,
    });
  });
});

app.listen(port, () => console.log("Example app listening on port ${port}!"));
