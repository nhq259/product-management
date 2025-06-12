module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", `Vui lòng nhập tiêu đề sản phẩm !`);

    res.redirect("back"); // express, chuyển hướng về trang...
    return;
  }

  // if (!req.body.title.length < 8) {
  //   req.flash("error", `Vui lòng nhập tiêu đề sản phẩm tối thiểu 8 kí tự !`);

  //   res.redirect("back"); // express, chuyển hướng về trang...
  //   return;
  // }
  next();
};