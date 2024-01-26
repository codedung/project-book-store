const { orderModel } = require("../models/order.model");

const orderService = {
  getOrderList: async (userId) => {
    const getOrderListData = await orderModel.getOrderList(userId);
    return getOrderListData;
  },
  toOrder: async (orderData, userId) => {
    const orderResult = await orderModel.toOrder(orderData, userId);
    return orderResult;
  },
  getDetailOrderList: async (userId, orderId) => {
    const userMatchResult = await orderModel.orderUserMatch(orderId);
    if (userMatchResult.success && userMatchResult.data.user_id != userId) {
      return { success: false, msg: "잘못된 접근입니다." };
    }
    const getOrderListData = await orderModel.getDetailOrderList(orderId);
    return getOrderListData;
  },
};

module.exports = { orderService };
