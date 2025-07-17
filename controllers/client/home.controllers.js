const Product = require("../../models/product.model")

const productsHelper = require("../../helpers/product")
// [GET] /
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
      featured: "1",
      deleted: false,
      status: "active"
    }).limit(6);

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)
  // END lấy ra sp nổi bật

  // Lấy ra sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active"
  }).sort({position: "desc"}).limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew)


  // END Lấy ra sản phẩm mới nhất

  res.render("client/pages/home/index.pug",{
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew
  });
}