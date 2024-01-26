const { StatusCodes } = require("http-status-codes");

const { categoryService } = require("../services/category.service");

const categoryOutput = {
  getCategoryList: async (req, res) => {
    const listResult = await categoryService.getList();

    if (listResult.success) {
      return res.status(StatusCodes.OK).json({
        msg: listResult.msg,
        listData: listResult.data,
      });
    }
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: listResult.msg,
    });
  },
};

module.exports = { categoryOutput };
