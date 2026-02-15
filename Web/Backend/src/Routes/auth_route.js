const router = require("express").Router();
const auth = require("../Controllers/auth");

router.post("/register", auth.register);
router.post("/login", auth.login);

module.exports = router;
