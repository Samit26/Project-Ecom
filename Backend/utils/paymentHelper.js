import axios from "axios";
import config from "../config/config.js";

// Cashfree API Base URL
const CASHFREE_BASE_URL =
  config.cashfree.env === "PROD"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

// Create payment order
export const createPaymentOrder = async (orderId, amount, customerDetails) => {
  try {
    const request = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerDetails.customerId,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        customer_name: customerDetails.name,
      },
      order_meta: {
        return_url: `${config.clientUrl}/order-confirmation/${orderId}`,
        notify_url: `${config.serverUrl}/api/orders/webhook`,
      },
    };

    const response = await axios.post(`${CASHFREE_BASE_URL}/orders`, request, {
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": config.cashfree.appId,
        "x-client-secret": config.cashfree.secretKey,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Cashfree create order error:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Verify payment
export const verifyPayment = async (orderId) => {
  try {
    const response = await axios.get(
      `${CASHFREE_BASE_URL}/orders/${orderId}/payments`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": config.cashfree.appId,
          "x-client-secret": config.cashfree.secretKey,
        },
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Cashfree verify payment error:",
      error.response?.data || error.message,
    );
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
