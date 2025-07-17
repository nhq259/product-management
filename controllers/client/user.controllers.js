const md5 = require("md5");

const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");


const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register.pug", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  // console.log(req.body);
  const exitsEmail = await User.findOne({
    email: req.body.email,
  });

  if (exitsEmail) {
    req.flash("error", "Email đã tồn tại !");
    res.redirect("back");
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  // console.log(user);

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/register
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }

  if (md5(password) !== user.password) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("back");
    return;
  }

  if (user.status === "inactive") {
    req.flash("error", "Tài khoản đang bị khóa");
    res.redirect("back");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password.pug", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại !");
    res.redirect("back");
    return;
  }

  //Lưu thông tin vào DB

  const otp = generateHelper.generateRandomNumber(6);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now()
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword)
  await forgotPassword.save()

  // console.log(objectForgotPassword);
  

  // Nếu tồn tại email thì gửi mã otp qua email
  const subject = "MÃ OTP xác minh lấy lại mật khẩu "
  const html = `Mã OTP để lấy lại mật khẩu là <b> ${otp} </b>. Thời hạn sử dụng là 3 phút`
  sendMailHelper.sendMail(email,subject,html);


  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email

  res.render("client/pages/user/otp-password.pug", {
    pageTitle: "Nhập mã OTP",
    email: email
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email
  const otp = req.body.otp
  // console.log(email,otp);

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  })

  if(!result){
    req.flash("error","OTP không hợp lệ");
    res.redirect("back")
    return;
  }
  // console.log(result);

  const user = await User.findOne({
    email: email
  });

  res.cookie("tokenUser" ,user.tokenUser)
  
  
res.redirect("/user/password/reset")
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {

  res.render("client/pages/user/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password
//   const confirmPassword = req.body.confirmPassword
// console.log(password,confirmPassword);

const tokenUser = req.cookies.tokenUser
// console.log(tokenUser);

await User.updateOne({
  tokenUser : tokenUser
},{
  password: md5(password)
})

  res.redirect("/")

};