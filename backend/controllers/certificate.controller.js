import { CertificateModel } from "../models/Certificate.js";
import { QuizModel } from "../models/Quiz.js";
import { QuizAttemptModel } from "../models/QuizAttempt.js";
import { LectureModel } from "../models/Lecture.js";

    

export const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    // Ensure a quiz exists for the course
    const quiz = await QuizModel.findOne({ courseId });
    if (!quiz) {
      return res.status(400).json({ message: "No quiz defined for this course" });
    }

    // Ensure the student has passed the quiz
    const attempt = await QuizAttemptModel.findOne({ userId, courseId, passed: true });
    if (!attempt) {
      return res.status(400).json({ message: "Quiz not passed – certificate cannot be generated" });
    }

    // Ensure lecture hasn't been updated after the quiz was passed
    const latestLecture = await LectureModel.findOne({ courseId }).sort({ updatedAt: -1 });
    if (latestLecture && latestLecture.updatedAt > attempt.updatedAt) {
      return res.status(400).json({ message: "Lecture updated after quiz pass – certificate cannot be generated" });
    }
    const existing = await CertificateModel.findOne({ userId, courseId });
    if (existing) {
      return res.json(existing);
    }

    const certificateId = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const certificate = await CertificateModel.create({ userId, courseId, certificateId });
    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCertificate = async (req, res) => { //get certificate by courseId and userId
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const certificate = await CertificateModel.findOne({ userId, courseId });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};