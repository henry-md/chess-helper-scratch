const { getAllPgn, createPgn, deletePgn } = require("../controllers/PgnController");
const { authenticate } = require("../middleware/AuthMiddleware");
const router = require("express").Router();

router.get("/get-all-pgns", authenticate, getAllPgn);
router.post("/create-pgn", authenticate, createPgn);
router.delete("/delete-pgn", authenticate, deletePgn);

module.exports = router;