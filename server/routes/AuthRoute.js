const { Signup, Login, getAllUsers } = require("../controllers/AuthController");
const { userVerification } = require("../middleware/AuthMiddleware");
const router = require("express").Router();

router.post('/signup', Signup)
router.post('/login', Login)
router.get('/users', getAllUsers)
router.post('/', userVerification)

module.exports = router