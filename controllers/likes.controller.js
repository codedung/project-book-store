const { StatusCodes } = require("http-status-codes");
const { likeService } = require("../services/likes.service");

const likeProcess = {
  addLikes: async (req, res) => {
    const { id: bookId } = req.params;
    const tokenData = req.tokenData;

    const addResult = await likeService.addLike(bookId, tokenData.idx);
    if (addResult.success) {
      return res.status(StatusCodes.OK).json({
        msg: addResult.msg,
      });
    }
    res.status(StatusCodes.UNAUTHORIZED).json({
      msg: addResult.msg,
    });
  },
  removeLikes: async (req, res) => {
    const { id: bookId } = req.params;
    const tokenData = req.tokenData;

    const removeResult = await likeService.removeLike(bookId, tokenData.idx);
    if (removeResult.success) {
      return res.status(StatusCodes.OK).json({
        msg: removeResult.msg,
      });
    }
    res.status(StatusCodes.UNAUTHORIZED).json({
      msg: removeResult.msg,
    });
  },
};
module.exports = { likeProcess };
