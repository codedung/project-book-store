const express = require("express");
const router = express.Router();
const { addLikes, removeLikes } = require("../controllers/likes.controller");

router.route("/:id").post(addLikes).delete(removeLikes);

module.exports = router;
