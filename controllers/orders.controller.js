const { StatusCodes } = require("http-status-codes");
const { orderService } = require("../services/order.service");

const orderProcess = {
  getOrderList: async (req, res) => {
    if (!req.tokenData) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "로그인 후 이용이 가능합니다.",
      });
    }
    const { idx: userId } = req.tokenData;

    const getOrderListData = await orderService.getOrderList(userId);
    if (getOrderListData.success) {
      return res.status(StatusCodes.OK).json({
        data: getOrderListData.data,
      });
    }
    res.status(StatusCodes.NOT_FOUND).json({
      msg: getOrderListData.msg,
    });
  },
  toOrder: async (req, res) => {
    if (!req.tokenData) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "로그인 후 이용이 가능합니다.",
      });
    }
    const orderData = req.body;
    const { idx: userId } = req.tokenData;

    const orderResult = await orderService.toOrder(orderData, userId);
    if (orderResult.success) {
      return res.status(StatusCodes.OK).json({
        msg: orderResult.msg,
      });
    }
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: orderResult.msg,
    });
  },
  getOrderDetail: async (req, res) => {
    if (!req.tokenData) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "로그인 후 이용이 가능합니다.",
      });
    }
    const { idx: userId } = req.tokenData;
    const { id: orderId } = req.params;

    const getDetailOrderListData = await orderService.getDetailOrderList(
      userId,
      orderId
    );
    if (getDetailOrderListData.success) {
      return res.status(StatusCodes.OK).json(getDetailOrderListData.data);
    }
    res.status(StatusCodes.NOT_FOUND).json({
      msg: getDetailOrderListData.msg,
    });
  },
};

module.exports = { orderProcess };
