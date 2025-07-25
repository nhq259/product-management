module.exports.createPost = (req, res, next) => {
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

module.exports.editPatch = (req, res, next) => {
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

  next();
};