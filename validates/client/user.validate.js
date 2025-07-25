module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập họ tên !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập Email !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }


  next();
};

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập Email !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }


  next();
};

module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập Email !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  next();
};

module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  if (!req.body.confirmPassword) {
    req.flash("error", `Vui lòng xác nhận mật khẩu !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  if (req.body.confirmPassword != req.body.password) {
    req.flash("error", `Mật khẩu không khớp !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  next();
};

module.exports.changePasswordPatch = (req, res, next) => {
  if (!req.body.oldPassword) {
    req.flash("error", `Vui lòng nhập mật khẩu !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  if (!req.body.newPassword) {
    req.flash("error", `Vui lòng nhập mật khẩu mới !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  if (!req.body.confirmPassword) {
    req.flash("error", `Vui lòng xác nhận mật khẩu mới !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  if (req.body.confirmPassword != req.body.newPassword) {
    req.flash("error", `Mật khẩu mới nhập không trùng khớp !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  next();
};