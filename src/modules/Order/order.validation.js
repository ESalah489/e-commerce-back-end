import Joi from "joi";

export const orderValidationSchema = Joi.object({
  shippingAddress: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),

  phoneNumbers: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9]+$/)
        .min(7)
        .max(15)
    )
    .min(1)
    .required(),
});
