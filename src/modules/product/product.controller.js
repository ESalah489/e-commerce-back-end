import products from "../../../DB/models/product-model.js";

export const createProduct = async (req, res, next) => {
  try {
    const { title, brand } = req.body;
    const existingProduct = await products.findOne({ title, brand });
    if (existingProduct) {
      const error = new Error(
        "Product with this title and brand already exists."
      );
      error.statusCode = 400;
      return next(error);
    }

    const newProduct = await products.create(req.body);
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (err) {
    next(err);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await products.find().sort({ createdAt: -1 });
    res.status(201).json(allProducts);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const productById = await products.findById(req.params.id);
    if (!productById) {
      return res.status(404).json({ message: "This product is not found!!" });
    }
    res.status(201).json(productById);
  } catch (err) {
    next(err);
  }
};

export const editProductById = async (req, res, next) => {
  try {
    const editProduct = await products.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!editProduct) {
      return res.status(404).json({ message: "This product is not found!!" });
    }
    res.status(201).json(editProduct);
  } catch (err) {
    next(err);
  }
};

export const deletetProductById = async (req, res, next) => {
  try {
    const deleteProduct = await products.findByIdAndDelete(req.params.id);
    if (!deleteProduct) {
      return res.status(404).json({ message: "This product is not found!!" });
    }
    res.status(201).json(deleteProduct);
  } catch (err) {
    next(err);
  }
};
