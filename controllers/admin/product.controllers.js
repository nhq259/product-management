const Product = require("../../models/product.model");

const ProductCategory = require("../../models/product-category.model");

const Acount = require("../../models/account.model");



const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const SearchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

const createTreeHelper = require("../../helpers/createTree");
const Account = require("../../models/account.model");


// [GET] /admin/products
module.exports.index = async (req, res) => {
  // console.log(req.query.status);

  // đoạn bộ lọc
  const filterStatus = filterStatusHelper(req.query);
  // console.log(filterStatus);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // TIm kiem
  const objectSearch = SearchHelper(req.query);
  // console.log(objectSearch);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //End tim kiem

  //Phân trang
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );

  // console.log(totalPage);
  // console.log(countProducts);

  //End phân trang

  //Sort
  let sort = {};

    if(req.query.sortKey && req.query.sortValue){
      sort[req.query.sortKey] = req.query.sortValue
    }else{
      sort.position = "desc";
    }
  
  //End sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  // console.log(products);
  for (const product of products) {
    //Lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: product.createdBy.account_id
    });

    if(user){
      product.accountFullName = user.fullName
    }

    //Lây ra thông tin người cập nhật gần nhất
    // console.log(product.updatedBy[product.updatedBy.length-1]);

    const updatedBy = product.updatedBy[product.updatedBy.length-1];
    if(updatedBy){
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id
    });

    updatedBy.accountFullName = userUpdated.fullName
    }

    console.log(product);

  }


  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [Patch] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }

  await Product.updateOne({ _id: id }, { 
    status: status,
      $push : {updatedBy: updatedBy}
  });

  req.flash("success", "Cập nhật trạng thái sản phẩm thành công !");

  res.redirect("back"); // express, chuyển hướng về trang...
};

// [Patch] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { 
        status: "active" ,
      $push : {updatedBy: updatedBy}
      });
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công !`
      );

      break;

    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { 
        status: "inactive",
      $push : {updatedBy: updatedBy}
      });
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công !`
      );
      break;

    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true, 
          // deletedAt: new Date() 
          deletedBy: {
        account_id :  res.locals.user.id,
        deletedAt : new Date()
    }
        }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne(
          { _id: id },
          {
            position: position,
      $push : {updatedBy: updatedBy}
          }
        );
      }
      req.flash("success", `Đã đổi vị trí thành công ${ids.length} sản phẩm!`);

      break;
    default:
      break;
  }

  // console.log(type , ids);

  res.redirect("back"); // express, chuyển hướng về trang...
};

// [Delete] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    { deleted: true, 
      // deletedAt: new Date()
      deletedBy: {
        account_id :  res.locals.user.id,
        deletedAt : new Date()
    }
    }
  );
  req.flash("success", `Đã xóa sản phẩm thành công !`);

  res.redirect("back"); // express, chuyển hướng về trang...
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  console.log(res.locals.user);
  
  let find = {
    deleted: false,
  };

  const category = await ProductCategory.find(find);

  const newCategory = createTreeHelper.tree(category);


  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id : res.locals.user.id
  }

  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
     // console.log(req.params.id);

  const find = {
    deleted : false,
    _id : req.params.id
  }

  const product = await Product.findOne(find);
  // console.log(product);

  const category = await ProductCategory.find({ deleted: false});

  const newCategory = createTreeHelper.tree(category);
  
  res.render("admin/pages/products/edit", {
    pageTitle: "Chỉnh sửa sản phẩm",
    product: product,
    category: newCategory
  });
  } catch (error) {

    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }

    await Product.updateOne({_id: id},{
      ...req.body,
      $push : {updatedBy: updatedBy}
    });
    req.flash("success", `Đã cập nhật sản phẩm thành công !`);

  } catch (error) {
    req.flash("error", `Đã cập nhật sản phẩm thất bại !`);

  }

  res.redirect("back");


  
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {

  const find = {
    deleted : false,
    _id : req.params.id
  }

  const product = await Product.findOne(find);
  // console.log(product);
  
  res.render("admin/pages/products/detail", {
    pageTitle: product.title,
    product: product
  });
  } catch (error) {

    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
