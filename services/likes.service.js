const { likeModel } = require("../models/likes.model");
const likeService = {
  addLike: async (bookId, userId) => {
    const addResult = await likeModel.addLikeModel(bookId, userId);
    return addResult;
  },
  removeLike: async (bookId, userId) => {
    const removeResult = await likeModel.removeLikeModel(bookId, userId);
    return removeResult;
  },
};

module.exports = { likeService };
