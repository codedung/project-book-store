const { cartModel } = require("../models/cart.model");

const cartService = {
  addCart: async (userId, addCartData) => {
    const addCartResult = await cartModel.addCart(userId, addCartData);
    return addCartResult;
  },
  getCartList: async (userId, selected) => {
    const getListResult = await cartModel.getCartList(userId, selected);
    return getListResult;
  },
  deleteCartItem: async (cartId) => {
    const deleteItemResult = await cartModel.deleteCartItem(cartId);
    return deleteItemResult;
  },
};

module.exports = { cartService };
