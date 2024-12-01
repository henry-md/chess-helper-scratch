const { Signup, Login, getAllUsers } = require("../controllers/AuthController");
const { verifyToken, authenticate } = require("../middleware/AuthMiddleware");
const router = require("express").Router();

router.post('/signup', Signup)
router.post('/login', Login)
router.get('/users', getAllUsers)
router.post('/verify-token', verifyToken)

module.exports = router