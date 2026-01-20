import Mailgun from "mailgun.js";
import formData from "form-data";

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
});

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || "";
const FROM_EMAIL =
  process.env.EMAIL_FROM || `Ajeet Lights <noreply@${MAILGUN_DOMAIN}>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ajeetlights@gmail.com";

// Helper function to send email via Mailgun
const sendEmail = async (options) => {
  try {
    const messageData = {
      from: options.from || FROM_EMAIL,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    if (options.replyTo) {
      messageData["h:Reply-To"] = options.replyTo;
    }

    const response = await mg.messages.create(MAILGUN_DOMAIN, messageData);
    console.log("Email sent successfully:", response.id);
    return {
      success: true,
      messageId: response.id,
    };
  } catch (error) {
    console.error("Mailgun error:", error);
    throw error;
  }
};

// Send email notification to admin when contact form is submitted
export const sendContactFormNotification = async (formData) => {
  try {
    const mailOptions = {
      to: ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;">
              <strong style="color: #555;">Name:</strong> ${formData.name}
            </p>
            <p style="margin: 10px 0;">
              <strong style="color: #555;">Email:</strong> ${formData.email}
            </p>
            <p style="margin: 10px 0;">
              <strong style="color: #555;">Phone:</strong> ${formData.phone || "Not provided"}
            </p>
            <p style="margin: 10px 0;">
              <strong style="color: #555;">Subject:</strong> ${formData.subject}
            </p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #ff6b35; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 12px;">
            <p>This email was sent from the Ajeet Lights website contact form.</p>
            <p>Please reply to the customer at: <a href="mailto:${formData.email}">${formData.email}</a></p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Subject: ${formData.subject}

Message:
${formData.message}

---
This email was sent from the Ajeet Lights website contact form.
Please reply to the customer at: ${formData.email}
      `,
      replyTo: formData.email,
    };

    const result = await sendEmail(mailOptions);
    console.log("Contact form email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending contact form email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Send auto-reply to customer
export const sendContactFormAutoReply = async (formData) => {
  try {
    const mailOptions = {
      to: formData.email,
      subject: "Thank you for contacting Ajeet Lights",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #ff6b35; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Ajeet Lights</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333;">Thank You for Reaching Out!</h2>
            
            <p style="color: #555; line-height: 1.6;">
              Dear ${formData.name},
            </p>
            
            <p style="color: #555; line-height: 1.6;">
              We have received your message and appreciate you taking the time to contact us. 
              Our team will review your inquiry and get back to you as soon as possible.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Message Details:</h3>
              <p style="margin: 10px 0;">
                <strong style="color: #555;">Subject:</strong> ${formData.subject}
              </p>
              <p style="margin: 10px 0; color: #555;">
                <strong>Message:</strong><br/>
                <span style="white-space: pre-wrap;">${formData.message}</span>
              </p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              If you have any urgent questions, please feel free to call us directly.
            </p>
            
            <p style="color: #555; line-height: 1.6;">
              Best regards,<br/>
              <strong>Ajeet Lights Team</strong>
            </p>
          </div>
          
          <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} Ajeet Lights. All rights reserved.</p>
            <p style="margin: 5px 0;">This is an automated message, please do not reply directly to this email.</p>
          </div>
        </div>
      `,
      text: `
Dear ${formData.name},

Thank you for contacting Ajeet Lights!

We have received your message and appreciate you taking the time to contact us. Our team will review your inquiry and get back to you as soon as possible.

Your Message Details:
Subject: ${formData.subject}
Message: ${formData.message}

If you have any urgent questions, please feel free to call us directly.

Best regards,
Ajeet Lights Team

---
© ${new Date().getFullYear()} Ajeet Lights. All rights reserved.
This is an automated message, please do not reply directly to this email.
      `,
    };

    const result = await sendEmail(mailOptions);
    console.log("Auto-reply email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending auto-reply email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Send order confirmation email to admin
export const sendOrderNotificationToAdmin = async (orderData) => {
  try {
    const itemsList = orderData.items
      .map(
        (item) =>
          `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.quantity * item.price).toFixed(2)}</td>
        </tr>`,
      )
      .join("");

    const itemsTextList = orderData.items
      .map(
        (item) =>
          `${item.name} - Qty: ${item.quantity} - ₹${item.price.toFixed(2)} each = ₹${(item.quantity * item.price).toFixed(2)}`,
      )
      .join("\n");

    const mailOptions = {
      to: ADMIN_EMAIL,
      subject: `New Order Placed - #${orderData.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background-color: #ff6b35; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🎉 New Order Received!</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Order #${orderData.orderNumber}</h2>
              <p style="color: #666; margin: 5px 0;">
                <strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleString("en-IN")}
              </p>
              <p style="color: #666; margin: 5px 0;">
                <strong>Payment Status:</strong> <span style="color: #28a745; font-weight: bold;">${orderData.paymentStatus.toUpperCase()}</span>
              </p>
              <p style="color: #666; margin: 5px 0;">
                <strong>Order Status:</strong> <span style="color: #007bff; font-weight: bold;">${orderData.orderStatus.toUpperCase()}</span>
              </p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Customer Details</h3>
              <p style="color: #555; margin: 5px 0;"><strong>Name:</strong> ${orderData.shippingAddress.name}</p>
              <p style="color: #555; margin: 5px 0;"><strong>Email:</strong> ${orderData.customerEmail}</p>
              <p style="color: #555; margin: 5px 0;"><strong>Phone:</strong> ${orderData.shippingAddress.phoneNumber}</p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Shipping Address</h3>
              <p style="color: #555; line-height: 1.6; margin: 0;">
                ${orderData.shippingAddress.name}<br/>
                ${orderData.shippingAddress.address || orderData.shippingAddress.street}<br/>
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}<br/>
                ${orderData.shippingAddress.pincode || orderData.shippingAddress.zipCode}<br/>
                ${orderData.shippingAddress.country || "India"}<br/>
                Phone: ${orderData.shippingAddress.phoneNumber}
              </p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 5px;">
              <h3 style="color: #333; margin-top: 0;">Order Summary</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px; color: #555;">Subtotal:</td>
                  <td style="padding: 5px; text-align: right; color: #555;">₹${orderData.subtotal.toFixed(2)}</td>
                </tr>
                ${
                  orderData.promoCodeDiscount > 0
                    ? `<tr>
                  <td style="padding: 5px; color: #28a745;">Promo Code Discount:</td>
                  <td style="padding: 5px; text-align: right; color: #28a745;">-₹${orderData.promoCodeDiscount.toFixed(2)}</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 5px; color: #555;">Shipping Fee:</td>
                  <td style="padding: 5px; text-align: right; color: #555;">${orderData.shippingFee === 0 ? "FREE" : `₹${orderData.shippingFee.toFixed(2)}`}</td>
                </tr>
                <tr style="border-top: 2px solid #ff6b35;">
                  <td style="padding: 10px; font-size: 18px; font-weight: bold; color: #333;">Total Amount:</td>
                  <td style="padding: 10px; font-size: 18px; font-weight: bold; color: #ff6b35; text-align: right;">₹${orderData.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 5px 0;">This is an automated notification from Ajeet Lights E-Commerce System</p>
            <p style="margin: 5px 0;">Login to admin panel to manage this order</p>
          </div>
        </div>
      `,
      text: `
NEW ORDER RECEIVED!

Order Number: #${orderData.orderNumber}
Order Date: ${new Date(orderData.createdAt).toLocaleString("en-IN")}
Payment Status: ${orderData.paymentStatus.toUpperCase()}
Order Status: ${orderData.orderStatus.toUpperCase()}

CUSTOMER DETAILS:
Name: ${orderData.shippingAddress.name}
Email: ${orderData.customerEmail}
Phone: ${orderData.shippingAddress.phoneNumber}

SHIPPING ADDRESS:
${orderData.shippingAddress.name}
${orderData.shippingAddress.address || orderData.shippingAddress.street}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}
${orderData.shippingAddress.pincode || orderData.shippingAddress.zipCode}
${orderData.shippingAddress.country || "India"}
Phone: ${orderData.shippingAddress.phoneNumber}

ORDER ITEMS:
${itemsTextList}

ORDER SUMMARY:
Subtotal: ₹${orderData.subtotal.toFixed(2)}
${orderData.promoCodeDiscount > 0 ? `Promo Code Discount: -₹${orderData.promoCodeDiscount.toFixed(2)}` : ""}
Shipping Fee: ${orderData.shippingFee === 0 ? "FREE" : `₹${orderData.shippingFee.toFixed(2)}`}
---
Total Amount: ₹${orderData.totalAmount.toFixed(2)}

---
This is an automated notification from Ajeet Lights E-Commerce System
Login to admin panel to manage this order
      `,
    };

    const result = await sendEmail(mailOptions);
    console.log("Order notification email sent to admin:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending order notification to admin:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Send order confirmation email to customer
export const sendOrderConfirmationToCustomer = async (orderData) => {
  try {
    const itemsList = orderData.items
      .map(
        (item) =>
          `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.quantity * item.price).toFixed(2)}</td>
        </tr>`,
      )
      .join("");

    const itemsTextList = orderData.items
      .map(
        (item) =>
          `${item.name} - Qty: ${item.quantity} - ₹${item.price.toFixed(2)} each = ₹${(item.quantity * item.price).toFixed(2)}`,
      )
      .join("\n");

    const mailOptions = {
      to: orderData.customerEmail,
      subject: `Order Confirmation - #${orderData.orderNumber} - Ajeet Lights`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background-color: #ff6b35; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">Ajeet Lights</h1>
            <p style="margin: 10px 0; font-size: 18px;">Thank You for Your Order!</p>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <div style="background-color: #28a745; color: white; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
              <h2 style="margin: 0;">✓ Order Confirmed!</h2>
              <p style="margin: 10px 0; font-size: 16px;">Order #${orderData.orderNumber}</p>
            </div>

            <p style="color: #555; line-height: 1.6;">
              Dear ${orderData.shippingAddress.name},
            </p>
            
            <p style="color: #555; line-height: 1.6;">
              We're excited to let you know that we've received your order and it's being processed! 
              You'll receive another email when your order ships.
            </p>

            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Order Details</h3>
              <p style="color: #666; margin: 5px 0;">
                <strong>Order Number:</strong> #${orderData.orderNumber}
              </p>
              <p style="color: #666; margin: 5px 0;">
                <strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleString("en-IN")}
              </p>
              <p style="color: #666; margin: 5px 0;">
                <strong>Payment Status:</strong> <span style="color: #28a745; font-weight: bold;">${orderData.paymentStatus.toUpperCase()}</span>
              </p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Delivery Address</h3>
              <p style="color: #555; line-height: 1.6; margin: 0;">
                ${orderData.shippingAddress.name}<br/>
                ${orderData.shippingAddress.address || orderData.shippingAddress.street}<br/>
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}<br/>
                ${orderData.shippingAddress.pincode || orderData.shippingAddress.zipCode}<br/>
                ${orderData.shippingAddress.country || "India"}<br/>
                Phone: ${orderData.shippingAddress.phoneNumber}
              </p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 5px;">
              <h3 style="color: #333; margin-top: 0;">Order Summary</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px; color: #555;">Subtotal:</td>
                  <td style="padding: 5px; text-align: right; color: #555;">₹${orderData.subtotal.toFixed(2)}</td>
                </tr>
                ${
                  orderData.promoCodeDiscount > 0
                    ? `<tr>
                  <td style="padding: 5px; color: #28a745;">Discount Applied:</td>
                  <td style="padding: 5px; text-align: right; color: #28a745;">-₹${orderData.promoCodeDiscount.toFixed(2)}</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 5px; color: #555;">Shipping Fee:</td>
                  <td style="padding: 5px; text-align: right; color: #555;">${orderData.shippingFee === 0 ? "FREE" : `₹${orderData.shippingFee.toFixed(2)}`}</td>
                </tr>
                <tr style="border-top: 2px solid #ff6b35;">
                  <td style="padding: 10px; font-size: 18px; font-weight: bold; color: #333;">Total Paid:</td>
                  <td style="padding: 10px; font-size: 18px; font-weight: bold; color: #ff6b35; text-align: right;">₹${orderData.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #555;">
                <strong>📦 What's Next?</strong><br/>
                We're preparing your order for shipment. You'll receive a tracking number once it's on its way!
              </p>
            </div>

            <p style="color: #555; line-height: 1.6;">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            
            <p style="color: #555; line-height: 1.6;">
              Thank you for shopping with Ajeet Lights!<br/>
              <strong>Team Ajeet Lights</strong>
            </p>
          </div>
          
          <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} Ajeet Lights. All rights reserved.</p>
            <p style="margin: 5px 0;">You're receiving this email because you placed an order on our website.</p>
          </div>
        </div>
      `,
      text: `
AJEET LIGHTS - ORDER CONFIRMATION

Thank You for Your Order!

Order Number: #${orderData.orderNumber}
Order Date: ${new Date(orderData.createdAt).toLocaleString("en-IN")}
Payment Status: ${orderData.paymentStatus.toUpperCase()}

Dear ${orderData.shippingAddress.name},

We're excited to let you know that we've received your order and it's being processed! 
You'll receive another email when your order ships.

DELIVERY ADDRESS:
${orderData.shippingAddress.name}
${orderData.shippingAddress.address || orderData.shippingAddress.street}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}
${orderData.shippingAddress.pincode || orderData.shippingAddress.zipCode}
${orderData.shippingAddress.country || "India"}
Phone: ${orderData.shippingAddress.phoneNumber}

ORDER ITEMS:
${itemsTextList}

ORDER SUMMARY:
Subtotal: ₹${orderData.subtotal.toFixed(2)}
${orderData.promoCodeDiscount > 0 ? `Discount Applied: -₹${orderData.promoCodeDiscount.toFixed(2)}` : ""}
Shipping Fee: ${orderData.shippingFee === 0 ? "FREE" : `₹${orderData.shippingFee.toFixed(2)}`}
---
Total Paid: ₹${orderData.totalAmount.toFixed(2)}

WHAT'S NEXT?
We're preparing your order for shipment. You'll receive a tracking number once it's on its way!

If you have any questions about your order, please don't hesitate to contact us.

Thank you for shopping with Ajeet Lights!
Team Ajeet Lights

---
© ${new Date().getFullYear()} Ajeet Lights. All rights reserved.
You're receiving this email because you placed an order on our website.
      `,
    };

    const result = await sendEmail(mailOptions);
    console.log("Order confirmation email sent to customer:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending order confirmation to customer:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
