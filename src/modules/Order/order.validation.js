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

// import Joi from "joi";

// export const orderValidationSchema = Joi.object({
//   user: Joi.string().required(),
//   items: Joi.array()
//     .items(
//       Joi.object({
//         product: Joi.string().required(),
//         quantity: Joi.number().integer().min(1).required(),
//         price: Joi.number().precision(2).required(),
//       })
//     )
//     .min(1)
//     .required(),
//   shippingAddress: Joi.object({
//     address: Joi.string().required(),
//     city: Joi.string().required(),
//     postalCode: Joi.string().required(),
//     country: Joi.string().required(),
//   }).required(),
//   phoneNumbers: Joi.array()
//     .items(Joi.string().pattern(/^\+?\d{7,15}$/))
//     .min(1)
//     .required(),
//   totalAmount: Joi.number().precision(2).required(),
// });
