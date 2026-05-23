import { LectureModel } from "../models/Lecture.js";
import { CourseModel } from "../models/Course.js";
import { getEmbedUrl } from "../utils/videoHelper.js";

export const addLecture = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, videoUrl, description, duration, isPreview, resources } = req.body;

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your course" });
    }

    const lecture = await LectureModel.create({
      title,
      videoUrl,
      embedUrl: getEmbedUrl(videoUrl),
      description,
      duration,
      isPreview,
      resources,
      courseId,
    });

    // Update course lectures array
    await CourseModel.findByIdAndUpdate(courseId, {
      $push: { lectures: lecture._id },
    });

    res.status(201).json({
      message: "Lecture added successfully",
      lecture,
    });
  } catch (err) {
    next(err);
  }
};

export const getLectures = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is instructor or enrolled
    const isInstructor = course.instructor.toString() === userId.toString();
    const isEnrolled = course.students.some(
      (id) => id.toString() === userId.toString()
    );

    let lectures;
    if (isInstructor || isEnrolled || req.user.role === "admin") {
      // Full access
      lectures = await LectureModel.find({ courseId });
    } else {
      // Only preview lectures
      lectures = await LectureModel.find({ courseId, isPreview: true });
    }

    res.json({
      success: true,
      lectures,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteLecture = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lecture = await LectureModel.findById(id);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    await LectureModel.findByIdAndDelete(id);

    res.json({
      message: "Lecture deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};