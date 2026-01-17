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
  stock: Joi.object({
    isAvailable: Joi.boolean(),
    quantity: Joi.number().min(0),
  }),
  rating: Joi.number().min(0).max(5),
  category: Joi.string()
    .valid("LED Lights", "Smart Lighting", "Decorative", "Outdoor")
    .required(),
  isFeatured: Joi.boolean(),
});

// User profile update schema
export const updateProfileSchema = Joi.object({
  name: Joi.string().trim(),
  phoneNumber: Joi.string().trim(),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
    country: Joi.string(),
  }),
});

// Order creation schema
export const orderSchema = Joi.object({
  shippingAddress: Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});
