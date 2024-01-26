const { StatusCodes } = require("http-status-codes");
const { cartService } = require("../services/cart.service");

const cartProcess = {
  addToCart: async (req, res) => {
    const { idx: userId } = req.tokenData;
    const addCartData = req.body;

    const addCartResult = await cartService.addCart(userId, addCartData);
    if (addCartResult.success) {
      return res.status(StatusCodes.OK).json({
        msg: addCartResult.msg,
      });
    }
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: addCartResult.msg,
    });
  },
  getCartList: async (req, res) => {
    const { idx: userId } = req.tokenData;
    let { selected } = req.body;

    const selectedCartList = await cartService.getCartList(userId, selected);
    if (selectedCartList.success) {
      return res.status(StatusCodes.OK).json({
        cartList: selectedCartList.data,
      });
    }
    res.status(StatusCodes.NOT_FOUND).json({
      msg: selectedCartList.msg,
    });
  },
  deleteCartItem: async (req, res) => {
    const { id: cartId } = req.params;

    const deleteItemResult = await cartService.deleteCartItem(cartId);
    if (deleteItemResult.success) {
      return res.status(StatusCodes.OK).json({
        msg: deleteItemResult.msg,
      });
    }
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: deleteItemResult.msg,
    });
  },
};

module.exports = { cartProcess };
