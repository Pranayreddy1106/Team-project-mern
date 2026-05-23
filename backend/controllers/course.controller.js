import { CourseModel as Course } from "../models/Course.js";

// GET ALL COURSES
export const getAllCourses = async (req, res, next) => {
  try {
    const { category, difficulty, sort, search } = req.query;

    const query = {};

    // 1. Search Filter (title, description, category, difficulty)
    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { difficulty: searchRegex },
      ];
    }

    // 2. Category Filter
    if (category) {
      query.category = category;
    }

    // 3. Difficulty Filter
    if (difficulty) {
      query.difficulty = difficulty;
    }

    let dbQuery = Course.find(query)
      .populate("instructor", "name email")
      .populate("lectures", "title duration isPreview");

    // 4. Sort Behavior
    if (sort === "price-low-high") {
      dbQuery = dbQuery.sort({ price: 1 });
    } else if (sort === "price-high-low") {
      dbQuery = dbQuery.sort({ price: -1 });
    } else {
      dbQuery = dbQuery.sort({ createdAt: -1 });
    }

    const courses = await dbQuery;

    res.status(200).json({
      count: courses.length,
      courses,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE COURSE (Instructor only)
export const createCourse = async (req, res, next) => {
  try {
    const instructorId = req.user._id;

    const course = await Course.create({
      ...req.body,
      instructor: instructorId,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    next(err);
  }
};

// ENROLL COURSE (Student)
export const enrollCourse = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Instructor cannot enroll in own course",
      });
    }

    const alreadyEnrolled = course.students.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "User already enrolled in this course",
      });
    }

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { students: userId },
    });

    res.status(200).json({
      message: "Enrollment successful",
      courseId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CHECK ENROLLMENT
export const isEnrolled = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    const course = await Course.findOne({
      _id: courseId,
      students: userId,
    });

    res.status(200).json({
      enrolled: !!course,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET MY COURSES (Student enrolled courses / Instructor created courses)
export const getMyCourses = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const query =
      req.user.role === "instructor"
        ? { instructor: userId }
        : { students: userId };

    const courses = await Course.find(query)
      .populate("instructor", "name email")
      .populate("lectures", "title duration isPreview videoUrl embedUrl description resources")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: courses.length,
      courses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE COURSE
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Course.distinct('category');
    res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
};

export const getLevels = async (req, res, next) => {
  try {
    const levels = await Course.distinct('level');
    res.status(200).json({ levels });
  } catch (err) {
    next(err);
  }
};
