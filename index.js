const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

// Body-parser 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB 연결
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected OK!"))
  .catch((err) => console.log(err));

// 기본 라우트
app.get("/", (req, res) => res.send("Hello World!"));

// 회원가입 라우트
app.post("/api/user/register", async (req, res) => {
  const user = new User(req.body);

  try {
    const userInfo = await user.save();
    return res.status(200).json({
      success: true,
      userInfo,
    });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, err });
  }
});

// 로그인 라우트
app.post("/api/user/login", async (req, res) => {
  try {
    // 요청된 이메일을 데이터베이스에서 찾기
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 비밀번호가 맞는지 확인
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });
    }

    // 토큰 생성
    const tokenUser = await user.generateToken();
    res.cookie("x_auth", tokenUser.token).status(200).json({
      loginSuccess: true,
      userId: tokenUser._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
});

// 인증 라우트
app.get("/api/user/auth", auth, async (req, res) => {
  try {
    const token = req.cookies.x_auth;
    if (!token) {
      return res.json({ isAuth: false, error: true });
    }

    const user = await User.findByToken(token);
    if (!user) {
      return res.json({ isAuth: false, error: true });
    }

    return res.json({ isAuth: true, user });
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
});

// 로그아웃 라우트
app.get("/api/user/logout", auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { token: "" });
    return res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, err });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
