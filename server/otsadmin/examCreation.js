const express = require('express');
const router = express.Router();
const db = require('../db');


// router.get('/subjects', async (req, res) => {
//     // Fetch subjects
//     try {
//       const [rows] = await db.query('SELECT * FROM subjects');
//       res.json(rows);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });   


  router.get('/feachingexams/:examId', async (req, res) => {
    const { examId } = req.params;
    try {
      // Fetch exams from the database
      const [rows] = await db.query('SELECT * FROM exams WHERE examId = ?', [examId]);
  
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.get('/exams/:examId/subjects', async (req, res) => {
    const { examId } = req.params;
  
    try {
      console.log('Fetching subjects for examId:', examId);
  
      const [rows] = await db.query(
        'SELECT subjectId FROM exam_creation_table WHERE examId = ?',
        [examId]
      );
  
      const selectedSubjects = rows.map(row => row.subjectId);
      console.log('Selected subjects:', selectedSubjects);
  
      res.json(selectedSubjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  router.put('/update/:examId', async (req, res) => {
    const { examId } = req.params;
    const { examName, startDate, endDate, subjects } = req.body;
  
    try {
      // Update data in the exams table
      await db.query('UPDATE exams SET examName = ?, startDate = ?, endDate = ? WHERE examId = ?', [examName, startDate, endDate, examId]);
  
      // Update subjects in the exam_creation_table
      // 1. Delete existing subjects that are not in the updated list
      await db.query('DELETE FROM exam_creation_table WHERE examId = ? AND subjectId NOT IN (?)', [examId, subjects]);
  
      // 2. Insert new subjects that are not already in the table
      const existingSubjects = await db.query('SELECT subjectId FROM exam_creation_table WHERE examId = ?', [examId]);
      const existingSubjectIds = existingSubjects[0].map(row => row.subjectId);
  
      const newSubjects = subjects.filter(subjectId => !existingSubjectIds.includes(subjectId));
  
      const subjectInsertPromises = newSubjects.map(subjectId =>
        db.query('INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)', [examId, subjectId])
      );
  
      await Promise.all(subjectInsertPromises);
  
      res.json({ success: true, message: 'Exam data updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/exams-with-subjects', async (req, res) => {
    // Display selected subjects in table
    try {
      const query = `
        SELECT e.examId, e.examName, e.startDate, e.endDate, GROUP_CONCAT(s.subjectName) AS subjects
        FROM exams AS e
        JOIN exam_creation_table AS ec ON e.examId = ec.examId
        JOIN subjects AS s ON ec.subjectId = s.subjectId
        GROUP BY e.examId
      `;
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;