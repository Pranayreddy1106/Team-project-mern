import { Payment } from "../models/Payment.js";
import { CourseModel as Course } from "../models/Course.js";

export const createPaymentAndEnroll = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

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
        message: "Already enrolled",
      });
    }

    const existingPayment = await Payment.findOne({
      user: userId,
      course: courseId,
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "Payment already exists",
      });
    }

    const payment = await Payment.create({
      user: userId,
      course: courseId,
      amount: course.price || 0,
      paymentStatus: "paid",
      transactionId: "DEMO_" + Date.now(),
    });

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { students: userId },
    });

    res.status(201).json({
      message: "Payment successful & enrolled",
      data: {
        courseId,
        paymentId: payment._id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};