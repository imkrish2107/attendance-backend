const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

// -------------------------
// TEST ROUTE
// -------------------------
router.get("/test", (req, res) => {
  res.json({
    ok: true,
    message: "Auth API working",
  });
});

// -------------------------
// AUTH ROUTES
// -------------------------
router.post("/register", register);
router.post("/login", login);

module.exports = router;
