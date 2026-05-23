import { QuizModel } from "../models/Quiz.js";
import { QuizAttemptModel } from "../models/QuizAttempt.js";
import { CourseModel } from "../models/Course.js";
import { ProgressModel } from "../models/Progress.js";
import { CertificateModel } from "../models/Certificate.js";

export const createQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { questions } = req.body;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const ownsCourse = course.instructor.toString() === req.user._id.toString();
    if (req.user.role === "instructor" && !ownsCourse) {
      return res.status(403).json({ message: "Not your course" });
    }

    if (!questions || questions.length === 0) {    //validating that questions are provided
      return res.status(400).json({ message: "Questions are required" });
    }

    const existing = await QuizModel.findOne({ courseId });
    if (existing) {
      return res.status(400).json({ message: "Quiz already exists for this course" });
    }

    const quiz = await QuizModel.create({ courseId, questions });

    res.status(201).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Verify access
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isInstructor = course.instructor.toString() === userId.toString();
    const isEnrolled = course.students.some(
      (id) => id.toString() === userId.toString()
    );

    if (!isInstructor && !isEnrolled && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    const quiz = await QuizModel.findOne({ courseId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (req.user.role === "student") {
      const progress = await ProgressModel.findOne({ userId, courseId });
      const completedCount = progress ? progress.completedLectures.length : 0;
      const totalLectures = course.lectures.length;
      if (totalLectures > 0 && completedCount < totalLectures) {
        return res.status(403).json({
          message: "Quiz is locked. You must complete all lectures in this course first.",
          isLocked: true
        });
      }
    }

    res.json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const attemptQuiz = async (req, res) => {   //only students can attempt the quiz for a course
  try {
    const { courseId } = req.params;
    const { answers } = req.body;
    const userId = req.user._id;

    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can attempt quizzes" });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const progress = await ProgressModel.findOne({ userId, courseId });
    const completedCount = progress ? progress.completedLectures.length : 0;
    const totalLectures = course.lectures.length;
    if (totalLectures > 0 && completedCount < totalLectures) {
      return res.status(403).json({ message: "You must complete all lectures in this course before attempting the quiz." });
    }

    const quiz = await QuizModel.findOne({ courseId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (!answers || answers.length !== quiz.questions.length) {   //validating that answers
      return res.status(400).json({ message: "Invalid answers" });
    }

    let correct = 0;

    quiz.questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) {
        correct++;
      }
    });

    const total = quiz.questions.length;
    const percentage = (correct / total) * 100;   
    const passed = percentage >= 75;

    const attempt = await QuizAttemptModel.create({   //storing the quiz attempt details in the database
      userId,
      courseId,
      answers,
      score: percentage,
      totalQuestions: total,
      passed,
    });

    let certificate = null;
    if (passed) {
      const totalLectures = course.lectures ? course.lectures.length : 0;
      const completedCount = progress ? progress.completedLectures.length : 0;

      if (totalLectures > 0 && completedCount >= totalLectures) {
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

    res.json({
      success: true,
      score: percentage,
      passed,
      attempt,
      certificate,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
