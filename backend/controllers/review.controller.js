import { ReviewModel } from "../models/Review.js";
import { CourseModel } from "../models/Course.js";

export const addReview=async(req,res)=>{
    try{
        const {courseId, lectureId, rating, comment} = req.body;
        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({message: "Rating must be between 1 and 5"});
        }
        // Ensure comment provided
        if (!comment) {
            return res.status(400).json({message: "Comment is required"});
        }
        // Determine query for existing review
        const query = { userId: req.user._id };
        if (lectureId) {
            query.lectureId = lectureId;
        } else if (courseId) {
            query.courseId = courseId;
        } else {
            return res.status(400).json({message: "Either courseId or lectureId must be provided"});
        }
        const existing = await ReviewModel.findOne(query);
        if (existing) {
            return res.status(400).json({message: "You already submitted feedback"});
        }
        // Fetch related course to get instructor
        const course = await CourseModel.findById(courseId);
        const reviewData = {
            userId: req.user._id,
            rating,
            comment,
            instructorId: course?.instructor,
        };
        if (lectureId) reviewData.lectureId = lectureId;
        if (courseId) reviewData.courseId = courseId;
        const review = await ReviewModel.create(reviewData);
        res.status(201).json(review);
    } catch(err){
        res.status(500).json({message: err.message});
    }
};

export const getCourseReviews=async(req,res)=>{
    try{
        const{id}=req.params;
        const reviews=await ReviewModel.find({courseId:id}).populate('userId','name');
        res.status(200).json(reviews);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

export const getLectureReviews=async(req,res)=>{
    try{
        const {id}=req.params; // lectureId
        const reviews=await ReviewModel.find({lectureId:id});
        res.status(200).json(reviews);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};