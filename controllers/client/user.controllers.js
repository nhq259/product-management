const md5 = require("md5");

const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");

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

// [POST] /user/login
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

  // console.log(req.cookies.cartId);
  // console.log(user.id);

  const cart = await Cart.findOne({
    user_id: user.id,
  });

  if (cart) {
  res.cookie("cartId", cart.id);
  } else {
    await Cart.updateOne(
      {
        _id: req.cookies.cartId,
      },
      {
        user_id: user.id,
      }
    );
  }

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
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
    expireAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // console.log(objectForgotPassword);

  // Nếu tồn tại email thì gửi mã otp qua email
  const subject = "MÃ OTP xác minh lấy lại mật khẩu ";
  const html = `Mã OTP để lấy lại mật khẩu là <b> ${otp} </b>. Thời hạn sử dụng là 3 phút`;
  sendMailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password.pug", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  // console.log(email,otp);

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", "OTP không hợp lệ");
    res.redirect("back");
    return;
  }
  // console.log(result);

  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  //   const confirmPassword = req.body.confirmPassword
  // console.log(password,confirmPassword);

  const tokenUser = req.cookies.tokenUser;
  // console.log(tokenUser);

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );

  res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;

  const infoUser = await User.findOne({
    tokenUser: tokenUser,
  }).select("-password");

  // console.log(infoUser);

  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
    infoUser: infoUser,
  });
};

// [GET] /user/edit/:id
module.exports.edit = async (req, res) => {
  try {
  const find = {
    deleted : false,
    _id : req.params.id
  }

  const user = await User.findOne(find).select("fullName email");
  // console.log(user);
  
  
  res.render("client/pages/user/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
    user: user

  });
  } catch (error) {

    res.redirect(`/user/info`);
  }
};

// [PATCH] /user/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id

// console.log(req.body, id);

  try {

    await User.updateOne({_id: id},{
      ...req.body,
    });
    req.flash("success", `Đã cập nhật thông tin thành công !`);

  } catch (error) {
    req.flash("error", `Đã cập nhật thông tin thất bại !`);

  }

  res.redirect("back");


  
};

// [GET] /user/password/change/:id
module.exports.changePassword = async (req, res) => {
  const id = req.params.id
  res.render("client/pages/user/change-password.pug", {
    pageTitle: "Đổi mật khẩu",
    id:id
  });
};

// [PATCH] /user/password/change/:id
module.exports.changePasswordPatch = async (req, res) => {
  const id = req.params.id
const { oldPassword, newPassword, confirmPassword } = req.body;

// console.log(req.body, id);

  try {
    const user = await User.findById(id);
    
    if (!user) {
      req.flash("error", "Người dùng không tồn tại.");
      return res.redirect("back");
    }

    // Kiểm tra mật khẩu cũ có khớp không
    if (user.password !== md5(oldPassword)) {
      req.flash("error", "Mật khẩu cũ không đúng.");
      return res.redirect("back");
    }

    // Kiểm tra mật khẩu mới và xác nhận
    if (newPassword !== confirmPassword) {
      req.flash("error", "Mật khẩu xác nhận không khớp.");
      return res.redirect("back");
    }

    // Cập nhật mật khẩu mới (mã hóa bằng md5)
    await User.updateOne({ _id: id }, { password: md5(newPassword) });

    req.flash("success", "Đổi mật khẩu thành công!");
    return res.redirect("/user/info"); // hoặc nơi bạn muốn chuyển đến
  } catch (error) {
    console.error(error);
    req.flash("error", "Có lỗi xảy ra khi đổi mật khẩu.");
    return res.redirect("back");
  }

  
};