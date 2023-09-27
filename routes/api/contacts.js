const express = require("express");
const router = express.Router();
const userMdwr = require("../../middlewares/userMiddleware");
const ctrl = require("../../controllers/contact.controller");

router.get("/", ctrl.getContact);
router.get("/:id", userMdwr.checkUserId, ctrl.getContactById);
router.post("/", userMdwr.checkUpdateContactData, ctrl.createContact);
router.put("/:id", userMdwr.checkUserId, ctrl.updateContactById);
router.delete("/:id", userMdwr.checkUserId, ctrl.deleteContact);
router.patch(
  "/:id/favorite",
  userMdwr.checkUpdateContactData,
  ctrl.updateStatusContact
);

module.exports = router;
