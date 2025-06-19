// import Order from "../../../DB/models/checkout-model.js";
// import Cart from "../../../DB/models/cart-model.js";

// export const CkeckoutOrder = async (req, res, next) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user.id }).populate(
//       "items.product"
//     );

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const { shippingAddress, phoneNumbers } = req.body;

//     if (!shippingAddress || !phoneNumbers || phoneNumbers.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Missing shipping info or phone numbers" });
//     }

//     const items = cart.items.map((item) => ({
//       product: item.product._id,
//       quantity: item.quantity,
//       price: item.product.price,
//     }));

//     const totalAmount = items.reduce(
//       (sum, item) => sum + item.quantity * item.price,
//       0
//     );

//     const username = req.user.username;
//     const email = req.user.email;

//     const newOrder = new Order({
//       user: req.user.id,
//       username,
//       email,
//       items,
//       shippingAddress,
//       phoneNumbers,
//       totalAmount,
//     });
//     await newOrder.save();
//     await cart.deleteOne();
//     res
//       .status(201)
//       .json({ message: "Order created successfully", order: newOrder });
//   } catch (err) {
//     next(err);
//   }
// };

// export const GetAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user.id })
//       .sort({ orderedAt: -1 })
//       .populate("items.product");
//     res.json(orders);
//   } catch (err) {
//     next(err);
//   }
// };




import Order from "../../../DB/models/checkout-model.js";
import Cart from "../../../DB/models/cart-model.js";

export const placeOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const { shippingAddress, phoneNumbers } = req.body;

    if (!shippingAddress || !phoneNumbers || phoneNumbers.length === 0) {
      return res
        .status(400)
        .json({ message: "Missing shipping info or phone numbers" });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const username = req.user.username;
    const email = req.user.email;

    const newOrder = new Order({
      user: req.user.id,
      username,
      email,
      items,
      shippingAddress,
      phoneNumbers,
      totalAmount,
    });
    await newOrder.save();
    await cart.deleteOne();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    next(err);
  }
};

export const GetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ orderedAt: -1 })
      .populate("items.product");
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

