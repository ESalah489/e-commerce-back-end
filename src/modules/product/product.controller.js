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
    let filter={};
    let sort={};
    const {
      title, brand,minPrice,maxPrice,inStock,minRating,maxRating,
      sortBy,order = 'asc',page = 1,limit = 3}=req.query;

    if(brand){
      filter.brand={$regex:brand,$options:'i'};
    }

    if(title){
      filter.title={$regex:title,$options:'i'};
    }

    if(minPrice||maxPrice){
      filter.price={};
      if(!isNaN(Number(minPrice))) filter.price.$gte=Number(minPrice);
      if(!isNaN(Number(maxPrice))) filter.price.$lte=Number(maxPrice);
    }

    if(inStock==="true"){
      filter.stock={$gt:0}
    }else if(inStock==="false"){
      filter.stock=0;
    }

    if(minRating||maxRating){
      filter['ratings.average']={};
      if (!isNaN(Number(minRating))) filter['ratings.average'].$gte=Number (minRating);
      if(!isNaN(Number(maxRating)))filter['ratings.average'].$lte=Number(maxRating);
    }

    if (sortBy) {
      sort[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; 
    }
    
    const skip=(page-1)*limit;


    const allProducts = await products
    .find(filter)
    .sort(sort)
    .skip(Number(skip))
    .limit(Number(limit));
    const total = await products.countDocuments(filter);
    res.status(200).json({
      message: 'Products fetched successfully',
      total,
      page: Number(page),
      results: allProducts.length,
      allProducts,
    });
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
    res.status(200).json(productById);
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

export const getRelatedProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const currentProduct = await product.findById(productId);
    if (!currentProduct) 
      return res.status(404).json({ message: "Product not found" });

    const relatedProducts = await product.find({
      brand: currentProduct.brand,
      _id: { $ne: productId }  
    }).limit(3); 

    res.status(200).json(relatedProducts);
  } catch (err) {
    next(err);
  }
};
