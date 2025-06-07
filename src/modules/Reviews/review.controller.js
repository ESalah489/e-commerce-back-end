import review from "../../../DB/models/review-model.js";

export const createReview=async(req,res,next)=>{
    try{
        const existingReview=await review.findOne({
            productId:req.body.productId,
            userId:req.body.userId
        });
        if(existingReview){
            const error=new Error("Already reviewed this product");
            error.statusCode = 400;
            return next(error);
        }
        const newRview = await review.create(req.body);
            res
              .status(201)
              .json({ message: "Review created successfully", review: newRview });
        

    }catch(err){
     next(err);
    }
};

export const getAllReviewsofAProduct=async(req,res,next)=>{
    try{
        const { productId } = req.params;
    const reviews = await review.find({ productId })
      .populate("userId", "name") 
      .sort({ createdAt: -1 });          

    res.status(200).json({
      message: `Reviews for product ${productId} fetched successfully`,
      count: reviews.length,
      reviews,
    });

    }catch(err){
     next(err);
    }
};

export const getReviewById=async(req,res,next)=>{
    try{
         const reviewtById = await review.findById(req.params.id);
            if (!reviewtById) {
              return res.status(404).json({ message: "This review is not found!!" });
            }
            res.status(200).json(reviewtById);
    }catch(err){
     next(err);
    }
};

export const editReviewById=async(req,res,next)=>{
    try{
        const editReview = await review.findByIdAndUpdate(
              req.params.id,
              req.body,
              { new: true, runValidators: true }
            );
            if (!editReview) {
              return res.status(404).json({ message: "This review is not found!!" });
            }
            res.status(201).json(editReview);
    }catch(err){
     next(err);
    }
};

export const deleteReviewById=async(req,res,next)=>{
    try{
         const deleteReview = await review.findByIdAndDelete(req.params.id);
            if (!deleteReview) {
              return res.status(404).json({ message: "This review is not found!!" });
            }
            res.status(201).json(deleteReview);

    }catch(err){
     next(err);
    }
};