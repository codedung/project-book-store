const { categoryModel } = require("../models/category.model");

const categoryService = {
  getList: async () => {
    const getCategoryResult = await categoryModel.getCategoryList();
    return getCategoryResult;
  },
};

module.exports = { categoryService };
