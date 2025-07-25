const Order = require("../../models/order.model");
const Product = require("../../models/product.model");


const productHelper = require("../../helpers/product");

// [GET] /admin/orders
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const orders = await Order.find(find);

  // Lặp qua từng đơn hàng để gán thông tin chi tiết sản phẩm
    for (let order of orders) {
      for (let item of order.products) {
        const product = await Product.findById(item.product_id).lean();

        if (product) {
          item.productName = product.title; // Gán tên sản phẩm
          item.priceNew = productHelper.priceNewProduct(product); // Tính giá sau giảm
        } else {
          item.productName = "Sản phẩm không tồn tại";
          item.priceNew = 0;
        }
      }
    }


  res.render("admin/pages/order/index", {
    pageTitle: "Danh sách đơn hàng",
    orders: orders,
  });
};

// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
  try {

  const find = {
    deleted : false,
    _id : req.params.id
  }

  const order = await Order.findOne(find);
  // console.log(product);
  // Lấy thông tin tên sản phẩm và giá mới
    for (let item of order.products) {
      const product = await Product.findById(item.product_id).lean();
      if (product) {
        item.productName = product.title;
        item.priceNew = productHelper.priceNewProduct(product); // Tính giá sau giảm
        item.thumbnail = product.thumbnail; // Gán ảnh
      } else {
        item.productName = "Không tìm thấy sản phẩm";
        item.priceNew = 0;
      }
    }
  
  res.render("admin/pages/order/detail", {
    pageTitle: "Chi tiết đơn hàng",
    order: order
  });
  } catch (error) {

    res.redirect(`${systemConfig.prefixAdmin}/orders`);
  }
};

// [Delete] /admin/orders/delete/:id
module.exports.deleteOrder = async (req, res) => {
  const id = req.params.id;

  await Order.updateOne(
    { _id: id },
    { 
      deleted: true,
    }
  );
  req.flash("success", `Đã xóa đơn hàng thành công !`);

  res.redirect("back"); // express, chuyển hướng về trang...
};