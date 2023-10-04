const authMiddleware  = require("../../middlewares/authMiddleware");
const authController = require("../../controllers/auth.controller");

const express = require("express");
const router = express.Router();


router.post('/register', authMiddleware.chekRegisterUser, authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/current', authController.currentUser);


module.exports = router;
