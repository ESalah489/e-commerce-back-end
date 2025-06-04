import Wishlist from "../../../DB/models/wish-list-model.js";

// ✅ Toggle add/remove product in wishlist
export const toggleWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [{ product: productId }],
      });
      return res.status(201).json({ status: "added", wishlist });
    }

    const exists = wishlist.products.find(
      (p) => p.product.toString() === productId
    );

    if (exists) {
      wishlist.products = wishlist.products.filter(
        (p) => p.product.toString() !== productId
      );
      await wishlist.save();
      return res.status(200).json({ status: "removed", wishlist });
    }

    if (wishlist.products.length >= 20) {
      return res
        .status(400)
        .json({ message: "Maximum wishlist limit reached (20 items)" });
    }

    wishlist.products.push({ product: productId });
    await wishlist.save();
    res.status(200).json({ status: "added", wishlist });
  } catch (err) {
    next(err);
  }
};

// ✅ Get user's wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    if (!wishlist) return res.status(200).json({ products: [] });

    res.status(200).json(wishlist);
  } catch (err) {
    next(err);
  }
};
