const express = require("express");
const router = express.Router();
const { likeProcess } = require("../controllers/likes.controller");

router.route("/:id").post(likeProcess.addLikes).delete(likeProcess.removeLikes);

module.exports = router;
