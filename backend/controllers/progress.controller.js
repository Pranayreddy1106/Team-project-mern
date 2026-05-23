import { ProgressModel } from "../models/Progress.js";
import { LectureModel } from "../models/Lecture.js";
import { CourseModel } from "../models/Course.js";
import { CertificateModel } from "../models/Certificate.js";
import { QuizModel } from "../models/Quiz.js";
import { QuizAttemptModel } from "../models/QuizAttempt.js";

// UPDATE PROGRESS (Mark lecture as watched)
export const updateProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId, lectureId, timestamp } = req.body;

    // Validate course exists
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Validate lecture exists
    const lecture = await LectureModel.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (lecture.courseId.toString() !== courseId.toString()) {
      return res.status(400).json({ message: "Lecture does not belong to this course" });
    }

    // Check if student is enrolled
    const isEnrolled = course.students.some(
      (id) => id.toString() === userId.toString()
    );
    if (!isEnrolled && course.instructor.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    // Find or create progress record
    let progress = await ProgressModel.findOne({ userId, courseId });

    if (!progress) {
      progress = await ProgressModel.create({
        userId,
        courseId,
        completedLectures: [lectureId],
        lastWatched: {
          lectureId,
          timestamp: timestamp || 0,
        },
      });
    } else {
      // Add to completed lectures if not already there
      if (!progress.completedLectures.includes(lectureId)) {
        progress.completedLectures.push(lectureId);
      }

      // Update last watched
      progress.lastWatched = {
        lectureId,
        timestamp: timestamp || 0,
      };

      await progress.save();
    }

    let certificate = null;
    const completedCount = progress.completedLectures.length;
    const totalLectures = course.lectures.length;
    const completedCourse =
      req.user.role === "student" && totalLectures > 0 && completedCount >= totalLectures;

    if (completedCourse) {
        // Verify quiz pass before issuing certificate
        const quiz = await QuizModel.findOne({ courseId });
        let quizPassed = false;
        if (quiz) {
          const attempt = await QuizAttemptModel.findOne({ userId, courseId, passed: true });
          if (attempt) quizPassed = true;
        }
        if (quizPassed) {
          certificate = await CertificateModel.findOne({ userId, courseId });
          if (!certificate) {
            certificate = await CertificateModel.create({
              userId,
              courseId,
              certificateId: `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            });
          }
        }
      }

      res.status(200).json({
        message: "Progress updated",
        progress,
        certificate,
      });
  } catch (err) {
    next(err);
  }
};

// GET PROGRESS FOR A COURSE
export const getProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const progress = await ProgressModel.findOne({
      userId,
      courseId,
    }).populate("completedLectures", "title duration");

    if (!progress) {
      return res.status(200).json({
        progress: null,
        message: "No progress found for this course",
      });
    }

    res.status(200).json({
      progress,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL PROGRESS FOR USER
export const getAllProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const allProgress = await ProgressModel.find({ userId })
      .populate("courseId", "title thumbnail lectures")
      .populate("completedLectures", "title");

    const progressWithPercentage = await Promise.all(
      allProgress.map(async (prog) => {
        if (!prog.courseId) return prog;
        const course = prog.courseId;
        const totalLectures = course.lectures ? course.lectures.length : 0;
        const completedLectures = prog.completedLectures ? prog.completedLectures.length : 0;

        // Check if quiz exists and is passed
        const quiz = await QuizModel.findOne({ courseId: course._id });
        let quizPassed = false;
        if (quiz) {
          const attempt = await QuizAttemptModel.findOne({ userId, courseId: course._id, passed: true });
          if (attempt) quizPassed = true;
        }

        const lecturePercentage = totalLectures > 0 ? (completedLectures / totalLectures) * 70 : 0;
        const quizPercentage = quizPassed ? 30 : 0;
        const finalPercentage = Math.round(lecturePercentage + quizPercentage);

        const progObj = prog.toObject();
        progObj.percentage = finalPercentage;
        progObj.quizPassed = quizPassed;
        return progObj;
      })
    );

    res.status(200).json({
      count: progressWithPercentage.length,
      progress: progressWithPercentage,
    });
  } catch (err) {
    next(err);
  }
};

// GET PROGRESS PERCENTAGE
export const getProgressPercentage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const progress = await ProgressModel.findOne({ userId, courseId });

    if (!progress) {
      return res.status(200).json({
        percentage: 0,
        message: "No progress found",
      });
    }

    const course = await CourseModel.findById(courseId);
    const totalLectures = course.lectures.length;
    const completedLectures = progress.completedLectures.length;

    // Check if a quiz exists for the course and if the student has passed it
    const quiz = await QuizModel.findOne({ courseId });
    let quizPassed = false;
    if (quiz) {
      const attempt = await QuizAttemptModel.findOne({ userId, courseId, passed: true });
      if (attempt) quizPassed = true;
    }

    // Progress: 70% lectures, 30% quiz pass
    const lecturePercentage = totalLectures > 0 ? (completedLectures / totalLectures) * 70 : 0;
    const quizPercentage = quizPassed ? 30 : 0;
    const finalPercentage = Math.round(lecturePercentage + quizPercentage);

    res.status(200).json({
      percentage: finalPercentage,
      completed: completedLectures,
      total: totalLectures,
      quizPassed,
    });
  } catch (err) {
    next(err);
  }
};
