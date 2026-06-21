const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

// Admin - Create Course
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Update Course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public - Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public - Get single course details
exports.getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'modules',
      populate: { path: 'lessons' }
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Add Module
exports.addModule = async (req, res) => {
  try {
    const { title, courseId } = req.body;
    const module = await Module.create({ title, course: courseId });
    await Course.findByIdAndUpdate(courseId, { $push: { modules: module._id } });
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Add Lesson
exports.addLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, moduleId, isPreview } = req.body;
    const lesson = await Lesson.create({ title, description, videoUrl, module: moduleId, isPreview });
    await Module.findByIdAndUpdate(moduleId, { $push: { lessons: lesson._id } });
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Delete Module
exports.deleteModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        await Course.findByIdAndUpdate(module.course, { $pull: { modules: module._id } });
        await Lesson.deleteMany({ module: module._id });
        await Module.findByIdAndDelete(req.params.id);
        res.json({ message: 'Module deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin - Delete Lesson
exports.deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        await Module.findByIdAndUpdate(lesson.module, { $pull: { lessons: lesson._id } });
        await Lesson.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lesson deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
