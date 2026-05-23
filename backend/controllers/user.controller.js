import User from "../models/User.js";
import { ProgressModel } from "../models/Progress.js";
import { QuizAttemptModel } from "../models/QuizAttempt.js";
import { CertificateModel } from "../models/Certificate.js";
import { CourseModel } from "../models/Course.js";

// GET USER PROFILE
export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// GET MY PROFILE (Authenticated user)
export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, bio, avatar } = req.body;

    const allowedUpdates = ["name", "bio", "avatar"];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return res.status(400).json({ message: "Invalid update fields" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, bio, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};

// GET USER STATISTICS
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // ── Instructor stats: aggregate across all courses they own ──
    if (userRole === "instructor") {
      const courses = await CourseModel.find({ instructor: userId });
      const courseIds = courses.map((c) => c._id);

      const totalCoursesCreated = courses.length;

      const totalStudents = courses.reduce(
        (sum, c) => sum + (c.students?.length || 0),
        0
      );

      const totalCertificates = await CertificateModel.countDocuments({
        courseId: { $in: courseIds },
      });

      const allAttempts = await QuizAttemptModel.find({
        courseId: { $in: courseIds },
      });

      const quizzesPassed = allAttempts.filter((a) => a.passed).length;

      const averageScore =
        allAttempts.length > 0
          ? Math.round(
              allAttempts.reduce((sum, a) => sum + a.score, 0) /
                allAttempts.length
            )
          : 0;

      return res.status(200).json({
        totalCoursesEnrolled: totalCoursesCreated,
        totalStudents,
        totalCertificates,
        quizzesPassed,
        averageQuizScore: averageScore,
      });
    }

    // ── Student stats (original behaviour) ──
    const totalCoursesEnrolled = await CourseModel.countDocuments({
      students: userId,
    });

    const totalQuizzesAttempted = await QuizAttemptModel.countDocuments({
      userId,
    });

    const totalCertificates = await CertificateModel.countDocuments({
      userId,
    });

    const quizzesPassed = await QuizAttemptModel.countDocuments({
      userId,
      passed: true,
    });

    const quizzes = await QuizAttemptModel.find({ userId });
    const averageScore =
      quizzes.length > 0
        ? Math.round(
            quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length
          )
        : 0;

    res.status(200).json({
      totalCoursesEnrolled,
      totalQuizzesAttempted,
      quizzesPassed,
      averageQuizScore: averageScore,
      totalCertificates,
    });
  } catch (err) {
    next(err);
  }
};

// GET INSTRUCTOR STATISTICS
export const getInstructorStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all courses created by this instructor
    const courses = await CourseModel.find({ instructor: userId });
    const courseIds = courses.map((c) => c._id);

    // Total students enrolled across all courses
    const totalStudents = courses.reduce(
      (sum, c) => sum + (c.students?.length || 0),
      0
    );

    // Total certificates issued for instructor's courses
    const totalCertificates = await CertificateModel.countDocuments({
      courseId: { $in: courseIds },
    });

    // All quiz attempts for instructor's courses
    const allAttempts = await QuizAttemptModel.find({
      courseId: { $in: courseIds },
    });

    // Overall quizzes passed
    const quizzesPassed = allAttempts.filter((a) => a.passed).length;

    // Overall average score
    const overallAvgScore =
      allAttempts.length > 0
        ? Math.round(
            allAttempts.reduce((sum, a) => sum + a.score, 0) /
              allAttempts.length
          )
        : 0;

    // Certificates grouped by course
    const certAgg = await CertificateModel.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: "$courseId", count: { $sum: 1 } } },
    ]);
    const certMap = {};
    certAgg.forEach((c) => {
      certMap[c._id.toString()] = c.count;
    });

    // Per-course stats
    const courseStats = courses.map((course) => {
      const cid = course._id.toString();
      const courseAttempts = allAttempts.filter(
        (a) => a.courseId.toString() === cid
      );
      const avgScore =
        courseAttempts.length > 0
          ? Math.round(
              courseAttempts.reduce((sum, a) => sum + a.score, 0) /
                courseAttempts.length
            )
          : 0;

      return {
        courseId: course._id,
        title: course.title,
        studentsEnrolled: course.students?.length || 0,
        quizAttempts: courseAttempts.length,
        avgQuizScore: avgScore,
        quizzesPassed: courseAttempts.filter((a) => a.passed).length,
        certified: certMap[cid] || 0,
      };
    });

    res.status(200).json({
      totalCourses: courses.length,
      totalStudents,
      totalCertificates,
      quizzesPassed,
      averageQuizScore: overallAvgScore,
      courseStats,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL USERS (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    // This is already protected by role middleware in routes
    const users = await User.find().select("-password");

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// GET USERS BY ROLE
export const getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;

    const validRoles = ["student", "instructor", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const users = await User.find({ role }).select("-password");

    res.status(200).json({
      count: users.length,
      role,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE USER (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting admin
    if (user.role === "admin" && req.user.role === "admin") {
      // Allow only if same admin
      if (user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Cannot delete other admins" });
      }
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
