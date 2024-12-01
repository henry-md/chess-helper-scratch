const { Signup, Login, verifyToken, getAllUsers, deleteUser } = require("../controllers/AuthController");
const { authenticate } = require("../middleware/AuthMiddleware");
const router = require("express").Router();

router.post('/signup', Signup)
router.post('/login', Login)
router.get('/users', getAllUsers)
router.post('/verify-token', verifyToken)
router.delete('/delete-user/:id', authenticate, deleteUser)
module.exports = router