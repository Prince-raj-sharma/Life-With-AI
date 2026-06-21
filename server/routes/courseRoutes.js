const express = require('express');
const router = express.Router();
const { 
  getCourses, 
  getCourseDetails, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  addModule,
  addLesson,
  deleteModule,
  deleteLesson
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public
router.get('/', getCourses);
router.get('/:id', getCourseDetails);

// Admin
router.post('/', protect, admin, createCourse);
router.put('/:id', protect, admin, updateCourse);
router.delete('/:id', protect, admin, deleteCourse);
router.post('/module', protect, admin, addModule);
router.post('/lesson', protect, admin, addLesson);
router.delete('/module/:id', protect, admin, deleteModule);
router.delete('/lesson/:id', protect, admin, deleteLesson);

module.exports = router;
