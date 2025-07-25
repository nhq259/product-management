var md5 = require("md5");

const User = require("../../models/user.model");


const systemConfig = require("../../config/system");

// [GET] /admin/users
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await User.find(find).select("-password -tokenUser");
  // console.log(records);


  res.render("admin/pages/users/index", {
    pageTitle: "Danh sách người dùng",
    records: records,
  });
};

// [GET] /admin/users/create
module.exports.create = async (req, res) => {
  const users = await User.find({
    deleted: false,
  });

  res.render("admin/pages/users/create", {
    pageTitle: "Tạo mới người dùng",
    users: users,
  });
};

// [POST] /admin/users/create
module.exports.createPost = async (req, res) => {
  
  const emailExist = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  // console.log(emailExist);

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);

    const record = new User(req.body);
    await record.save();
    req.flash("success","Thêm mới người dùng thành công")

    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
};

// [GET] /admin/users/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };
  try {
    const user = await User.findOne(find);

    res.render("admin/pages/users/edit", {
      pageTitle: "Chỉnh sửa người dùng",
      user: user,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExist = await User.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await User.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật người dùng thành công");
  }
  res.redirect("back");
};

// [GET] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const user = await User.findOne(find);
    // console.log(role);

    res.render("admin/pages/users/detail", {
      pageTitle: user.fullName,
      user: user,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
};

// [Delete] /admin/users/delete/:id
module.exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id });
  await User.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", `Đã xóa người dùng thành công !`);

  res.redirect("back"); // express, chuyển hướng về trang...
};

// [Patch] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  await User.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái tài khoản thành công !");

  res.redirect("back"); // express, chuyển hướng về trang...
};