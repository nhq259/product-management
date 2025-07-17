const Product = require("../../models/product.model.js");
const ProductCategory = require("../../models/product-category.model.js");

const productsHelper = require("../../helpers/product");
const ProductCategoryHelper = require("../../helpers/products-category.js");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  // products.forEach(item => {
  //   item.priceNew = (item.price*(100-item.discountPercentage)/100).toFixed(0);
  // });

  const newProducts = productsHelper.priceNewProducts(products);

  // console.log(newProducts);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {  
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active",
    };

    const product = await Product.findOne(find);
    // console.log(product);

    if(product.product_category_id){
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
      status: "active",
      deleted: false,
      });
      product.category = category;
    }
      
    product.priceNew = productsHelper.priceNewProduct(product)

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  console.log(req.params.slugCategory);

  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false,
  });

  // console.log(category.id);


  const listSubCategory = await ProductCategoryHelper.getSubCategory(category.id)

  const listSubCategoryId = listSubCategory.map(item => item.id)

  // console.log(listSubCategoryId);
  

  const products = await Product.find({
    product_category_id: {$in: [category.id, ...listSubCategoryId]},
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  // console.log(products);

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: category.title,
    products: newProducts,
  });
};
