import Joi from "joi";

// Validate request body against schema
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    next();
  };
};

// Product validation schema
export const productSchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().required(),
  images: Joi.array().items(Joi.string()).max(9),
  pricing: Joi.object({
    originalPrice: Joi.number().min(0).required(),
    offerPrice: Joi.number().min(0).required(),
  }).required(),
  stock: Joi.string().valid("available", "not available").required(),
  rating: Joi.number().min(0).max(5),
  category: Joi.string().required(),
  isFeatured: Joi.boolean(),
});

// User profile update schema
export const updateProfileSchema = Joi.object({
  name: Joi.string().trim(),
  phoneNumber: Joi.string().trim(),
  address: Joi.alternatives().try(
    Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      pincode: Joi.string(),
      country: Joi.string(),
    }),
    Joi.string(),
  ),
  city: Joi.string().trim(),
  state: Joi.string().trim(),
  pincode: Joi.string().trim(),
});

// Order creation schema
export const orderSchema = Joi.object({
  shippingAddress: Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().allow(""),
    street: Joi.string().allow(""),
    city: Joi.string().allow(""),
    state: Joi.string().allow(""),
    pincode: Joi.string().allow(""),
    zipCode: Joi.string().allow(""),
    country: Joi.string().allow(""),
  }).required(),
  promoCode: Joi.string().allow(""),
});
