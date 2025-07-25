const express = require("express");

const router = express.Router();


const controller = require("../../controllers/admin/user.controllers");
const validate = require("../../validates/admin/user.validate");


router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit );

router.patch(
  "/edit/:id",
  validate.editPatch,
  controller.editPatch
);

router.get("/detail/:id", controller.detail );

router.delete("/delete/:id", controller.deleteUser );

router.patch("/change-status/:status/:id", controller.changeStatus);







module.exports = router;
