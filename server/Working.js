const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const mammoth = require("mammoth");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs").promises;
const app = express();
const port = 3081;

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "admin_project",
});

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = "uploads/";
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    cb(null, Date.now() + path.extname(file.originalname));
    // cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//______________________exam creation start__________________________

//-----------------------------geting subjects in exam creation page ------------------------
app.get("/subjects", async (req, res) => {
  // Fetch subjects
  try {
    const [rows] = await db.query("SELECT * FROM subjects");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/feachingexams/:examId", async (req, res) => {
  const { examId } = req.params;
  try {
    // Fetch exams from the database
    const [rows] = await db.query("SELECT * FROM exams WHERE examId = ?", [
      examId,
    ]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/exams/:examId/subjects", async (req, res) => {
  const { examId } = req.params;

  try {
    console.log("Fetching subjects for examId:", examId);

    const [rows] = await db.query(
      "SELECT subjectId FROM exam_creation_table WHERE examId = ?",
      [examId]
    );

    const selectedSubjects = rows.map((row) => row.subjectId);
    console.log("Selected subjects:", selectedSubjects);

    res.json(selectedSubjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/update/:examId", async (req, res) => {
  const { examId } = req.params;
  const { examName, startDate, endDate, subjects } = req.body;

  try {
    // Update data in the exams table
    await db.query(
      "UPDATE exams SET examName = ?, startDate = ?, endDate = ? WHERE examId = ?",
      [examName, startDate, endDate, examId]
    );

    // Update subjects in the exam_creation_table
    // 1. Delete existing subjects that are not in the updated list
    await db.query(
      "DELETE FROM exam_creation_table WHERE examId = ? AND subjectId NOT IN (?)",
      [examId, subjects]
    );

    // 2. Insert new subjects that are not already in the table
    const existingSubjects = await db.query(
      "SELECT subjectId FROM exam_creation_table WHERE examId = ?",
      [examId]
    );
    const existingSubjectIds = existingSubjects[0].map((row) => row.subjectId);

    const newSubjects = subjects.filter(
      (subjectId) => !existingSubjectIds.includes(subjectId)
    );

    const subjectInsertPromises = newSubjects.map((subjectId) =>
      db.query(
        "INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)",
        [examId, subjectId]
      )
    );

    await Promise.all(subjectInsertPromises);

    res.json({ success: true, message: "Exam data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//--------------------------------------------END--------------------------------------------------
//---------------------------------------------inserting exam creation page data-------------------------------------------------

app.post("/exams", async (req, res) => {
  // Create exams
  const { examName, startDate, endDate, selectedSubjects } = req.body;

  try {
    const [examResult] = await db.query(
      "INSERT INTO exams (examName, startDate, endDate) VALUES (?, ?, ?)",
      [examName, startDate, endDate]
    );

    const insertedExamId = examResult.insertId;
    for (const subjectId of selectedSubjects) {
      await db.query(
        "INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)",
        [insertedExamId, subjectId]
      );
    }
    res.json({ message: "Exam created successfully", examId: insertedExamId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//--------------------------------------------END--------------------------------------------------
//--------------------------------------------desplaying only selected subjects in table in ecam creation page --------------------------------------------------

app.get("/exams-with-subjects", async (req, res) => {
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//--------------------------------------------END--------------------------------------------------
//--------------------------------------------Deleting exams from table(dalete button) --------------------------------------------------
app.delete("/exams/:examId", async (req, res) => {
  const examId = req.params.examId;

  try {
    await db.query("DELETE FROM exams WHERE examId = ?", [examId]);
    // You might also want to delete related data in other tables (e.g., exam_creation) if necessary.

    res.json({ message: `Exam with ID ${examId} deleted from the database` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//--------------------------------------------END--------------------------------------------------

//-------------------------------------------insertion/Deleting subjects in table --------------------------------------------------
app.put("/exams/:examId/subjects", async (req, res) => {
  const { examId } = req.params;
  const { subjects } = req.body;

  try {
    // First, you can delete the existing subjects associated with the exam.
    await db.query("DELETE FROM exam_creation_table WHERE examId = ?", [
      examId,
    ]);

    // Then, insert the updated subjects into the exam_creation_table.
    for (const subjectId of subjects) {
      await db.query(
        "INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)",
        [examId, subjectId]
      );
    }

    res.json({ message: "Subjects updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//--------------------------------------------END--------------------------------------------------

//--------------------------------------------updationg exam--------------------------------------------------
app.get("/update/:examId", async (req, res) => {
  const query = "SELECT * FROM exams WHERE examId = ?";
  const examId = req.params.examId;
  try {
    const [result] = await db.query(query, [examId]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//--------------------------------------------END--------------------------------------------------
//--------------------------------------------updation subjects--------------------------------------------------
app.put("/updatedata/:examId", async (req, res) => {
  const updateExamQuery =
    "UPDATE exams SET examName=?, startDate=?, endDate=? WHERE examId=?";
  const updateSubjectsQuery =
    "UPDATE exam_creation_table SET subjectId=? WHERE examId=?";

  const examId = req.params.examId;
  const { examName, startDate, endDate, subjects } = req.body;

  try {
    // Update exam details
    await db.query(updateExamQuery, [examName, startDate, endDate, examId]);

    // Check if subjects is an array before updating
    if (Array.isArray(subjects)) {
      // Update subjects
      await Promise.all(
        subjects.map((subjectId) =>
          db.query(updateSubjectsQuery, [subjectId, examId])
        )
      );
    }

    res.json({ updated: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//--------------------------------------------END--------------------------------------------------
//--------------------------------------------geting only selected subjects in edit page--------------------------------------------------
// app.get('/exams/:examId/subjects', async (req, res) => {
//     const examId = req.params.examId;

//     try {
//       const [rows] = await db.query('SELECT subjectId FROM exam_creation_table WHERE examId = ?', [examId]);
//       const selectedSubjects = rows.map(row => row.subjectId);
//       res.json(selectedSubjects);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
//--------------------------------------------END--------------------------------------------------
//--------------------------------------------updating subjects--------------------------------------------------
app.put("/exams/:examId/subjects", async (req, res) => {
  const { examId } = req.params;
  const { subjects } = req.body;

  try {
    // First, delete the existing subjects associated with the exam.
    await db.query("DELETE FROM exam_creation_table WHERE examId = ?", [
      examId,
    ]);

    // Then, insert the updated subjects into the exam_creation_table.
    for (const subjectId of subjects) {
      await db.query(
        "INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)",
        [examId, subjectId]
      );
    }

    res.json({ message: "Subjects updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//--------------------------------------------END--------------------------------------------------
//_____________________Exam creation end__________________________
//______________________courese creation start__________________________

// --------------- fetch type of test names -----------------------------
app.get("/type_of_tests", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT typeOfTestId, typeOfTestName FROM type_of_test"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// --------------- fetch type of Questions -----------------------------
app.get("/type_of_questions", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT quesionTypeId, typeofQuestion FROM quesion_type"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// --------------- fetch exams -----------------------------
app.get("/courese-exams", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT  examId,examName FROM exams");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// --------------- fetch subjects -----------------------------
app.get("/courese-exam-subjects/:examId/subjects", async (req, res) => {
  const examId = req.params.examId;

  try {
    const query = `
      SELECT s.subjectId, s.subjectName
      FROM subjects AS s
      JOIN exam_creation_table AS ec ON s.subjectId = ec.subjectId
      WHERE ec.examId = ?
    `;
    const [rows] = await db.query(query, [examId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------- inserting data into course_creation_table -----------------------------
app.post("/course-creation", async (req, res) => {
  const {
    courseName,
    examId,
    courseStartDate,
    courseEndDate,
    cost,
    discount,
    totalPrice,
  } = req.body;

  try {
    // Insert the course data into the course_creation_table
    const [result] = await db.query(
      "INSERT INTO course_creation_table (courseName,  examId,  courseStartDate, courseEndDate , cost, Discount, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        courseName,
        examId,
        courseStartDate,
        courseEndDate,
        cost,
        discount,
        totalPrice,
      ]
    );

    // Check if the course creation was successful
    if (result && result.insertId) {
      const courseCreationId = result.insertId;

      // Return the courseCreationId in the response
      res.json({ message: "Course created successfully", courseCreationId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------- inserting data into course_typeOftests,course_subjects,course_type_of_question  -----------------------------
app.post("/course_type_of_question", async (req, res) => {
  try {
    // Extract data from the request body
    const { courseCreationId, typeOfTestIds, subjectIds, typeofQuestion } =
      req.body;
    // console.log('Received request to add subjects and question types for courseCreationId:', courseCreationId);

    console.log("Received data:", req.body);

    for (const typeOfTestId of typeOfTestIds) {
      const query =
        "INSERT INTO course_typeOftests (courseCreationId, typeOfTestId) VALUES (?, ?)";
      const values = [courseCreationId, typeOfTestId];

      // Log the query before execution
      console.log("Executing query:", db.format(query, values));

      // Execute the query
      await db.query(query, values);
    }

    // Insert subjects into the course_subjects table
    console.log("Received data:", req.body);
    for (const subjectId of subjectIds) {
      const query =
        "INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)";
      const values = [courseCreationId, subjectId];
      console.log("Executing query:", db.format(query, values));
      await db.query(query, values);
    }

    // Insert question types into the course_type_of_question table
    for (const quesionTypeId of typeofQuestion) {
      const query =
        "INSERT INTO course_type_of_question (courseCreationId, quesionTypeId) VALUES (?, ?)";
      const values = [courseCreationId, quesionTypeId];
      console.log("Executing query:", db.format(query, values));
      await db.query(query, values);
    }

    // Respond with success message
    res.json({
      success: true,
      message: "Subjects and question types added successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// --------------- geting data  course_creation_table,course_typeOftests,course_subjects,course_type_of_question  -----------------------------
app.get("/course_creation_table", async (req, res) => {
  try {
    const query = `
    SELECT
    cc.*,
    subjects.subjects AS subjects,
    questions.quesion_types AS question_types,
    e.examName,
    typeOfTests.type_of_test AS type_of_test
FROM
    course_creation_table cc
      
    LEFT JOIN(
    SELECT ctt.courseCreationId,
        GROUP_CONCAT(t.typeOfTestName) AS type_of_test
    FROM
        course_typeoftests ctt
    LEFT JOIN type_of_test t ON
        ctt.typeOfTestId = t.typeOfTestId
    GROUP BY
        ctt.courseCreationId
) AS typeOfTests
ON
    cc.courseCreationId = typeOfTests.courseCreationId
    
    
LEFT JOIN(
    SELECT cs.courseCreationId,
        GROUP_CONCAT(s.subjectName) AS subjects
    FROM
        course_subjects cs
    LEFT JOIN subjects s ON
        cs.subjectId = s.subjectId
    GROUP BY
        cs.courseCreationId
) AS subjects
ON
    cc.courseCreationId = subjects.courseCreationId
LEFT JOIN(
    SELECT ct.courseCreationId,
        GROUP_CONCAT(q.typeofQuestion) AS quesion_types
    FROM
        course_type_of_question ct
    LEFT JOIN quesion_type q ON
        ct.quesionTypeId = q.quesionTypeId
    GROUP BY
        ct.courseCreationId
) AS questions
ON
    cc.courseCreationId = questions.courseCreationId
JOIN exams AS e
ON
    cc.examId = e.examId;
     `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------- deleting data into course_creation_table,course_typeOftests,course_subjects,course_type_of_question  -----------------------------
app.delete(
  "/course_creation_table_Delete/:courseCreationId",
  async (req, res) => {
    const courseCreationId = req.params.courseCreationId;

    try {
      await db.query(
        "DELETE course_creation_table, course_subjects, course_type_of_question, course_typeoftests FROM course_creation_table LEFT JOIN course_typeoftests ON course_creation_table.courseCreationId = course_typeoftests.courseCreationId LEFT JOIN course_subjects ON course_creation_table.courseCreationId = course_subjects.courseCreationId LEFT JOIN course_type_of_question ON course_creation_table.courseCreationId = course_type_of_question.courseCreationId WHERE course_creation_table.courseCreationId = ?",
        [courseCreationId]
      );

      res.json({
        message: `course with ID ${courseCreationId} deleted from the database`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// --------------- updating data into course_creation_table,course_typeOftests,course_subjects,course_type_of_question  -----------------------------
app.get("/courseupdate/:courseCreationId", async (req, res) => {
  const courseCreationId = req.params.courseCreationId;

  try {
    const query = `
      SELECT
      cc.*,
      subjects.subjects AS subjects,
      questions.quesion_types AS question_types,
      e.examName,
      typeOfTests.type_of_test AS type_of_test
  FROM
      course_creation_table cc
      
   LEFT JOIN(
      SELECT ctt.courseCreationId,
          GROUP_CONCAT(t.typeOfTestName) AS type_of_test
      FROM
          course_typeoftests ctt
      LEFT JOIN type_of_test t ON
          ctt.typeOfTestId = t.typeOfTestId
      GROUP BY
          ctt.courseCreationId
  ) AS typeOfTests
  ON
      cc.courseCreationId = typeOfTests.courseCreationId   
      
  LEFT JOIN(
      SELECT cs.courseCreationId,
          GROUP_CONCAT(s.subjectName) AS subjects
      FROM
          course_subjects cs
      LEFT JOIN subjects s ON
          cs.subjectId = s.subjectId
      GROUP BY
          cs.courseCreationId
  ) AS subjects
  ON
      cc.courseCreationId = subjects.courseCreationId
  LEFT JOIN(
      SELECT ct.courseCreationId,
          GROUP_CONCAT(q.typeofQuestion) AS quesion_types
      FROM
          course_type_of_question ct
      LEFT JOIN quesion_type q ON
          ct.quesionTypeId = q.quesionTypeId
      GROUP BY
          ct.courseCreationId
  ) AS questions
  ON
      cc.courseCreationId = questions.courseCreationId
  JOIN exams AS e
  ON
      cc.examId = e.examId
  WHERE
      cc.courseCreationId = ?;
      `;

    const [course] = await db.query(query, [courseCreationId]);

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------- feaching selected data from course_typeOftests,course_subjects,course_type_of_question  -----------------------------
app.get('/course_subjects/:courseCreationId', async (req, res) => {
  const courseCreationId = req.params.courseCreationId;

  try {
    // Query the database to get selected subjects for the specified courseCreationId
    const query = `
      SELECT cs.subjectId
      FROM course_subjects AS cs
      WHERE cs.courseCreationId = ?
    `;
    const [rows] = await db.query(query, [courseCreationId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get("/course-type-of-questions/:courseCreationId", async (req, res) => {
  const courseCreationId = req.params.courseCreationId;

  try {
    const query = `
        SELECT ctoq.quesionTypeId, qt.typeofQuestion
        FROM course_type_of_question AS ctoq
        JOIN quesion_type AS qt ON ctoq.quesionTypeId = qt.quesionTypeId
        WHERE ctoq.courseCreationId = ?
      `;
    const [rows] = await db.query(query, [courseCreationId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/course-type-of-test/:courseCreationId", async (req, res) => {
  const courseCreationId = req.params.courseCreationId;

  try {
    const query = `
        SELECT ctot.typeOfTestId , tt.typeOfTestName
        FROM course_typeoftests AS ctot
        JOIN type_of_test AS tt ON ctot.typeOfTestId  = tt.typeOfTestId 
        WHERE ctot.courseCreationId = ?
      `;
    const [rows] = await db.query(query, [courseCreationId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/course-typeoftests/:courseCreationId', async (req, res) => {
  const { courseCreationId } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT type_of_test.TypeOfTestId, type_of_test.TypeOfTestName,course_typeoftests.courseTypeOfTestId ' +
      'FROM course_typeoftests ' +
      'INNER JOIN type_of_test ON course_typeoftests.TypeOfTestId = type_of_test.TypeOfTestId ' +
      'WHERE course_typeoftests.courseCreationId = ?',
      [courseCreationId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching course_typeoftests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//______________________courese creation end __________________________
//______________________INSTRUCTION page __________________________

app.put("/update-course/:courseCreationId", async (req, res) => {
  const courseCreationId = req.params.courseCreationId;

  const {
    courseName,
    selectedExam,
    courseStartDate,
    courseEndDate,
    cost,
    discount,
    totalPrice,
    selectedTypeOfTests,
    selectedSubjects,
    selectedQuestionTypes,
  } = req.body;

  const updateQuery = `
    UPDATE course_creation_table
    SET
      courseName = ?,
      examId = ?,
      courseStartDate = ?,
      courseEndDate = ?,
      cost = ?,
      Discount = ?,       
      totalPrice = ?
    WHERE courseCreationId = ?;
  `;

  try {
    await db.query(updateQuery, [
      courseName,
      selectedExam,
      courseStartDate,
      courseEndDate,
      cost,
      discount,
      totalPrice,
      courseCreationId,
    ]);

    // Handle type of tests update
    const deleteTypeOfTestQuery =
      "DELETE FROM course_typeoftests WHERE courseCreationId = ?";
    await db.query(deleteTypeOfTestQuery, [courseCreationId]);

    const insertTestOfTestQuery =
      "INSERT INTO course_typeoftests (courseCreationId, typeOfTestId) VALUES (?, ?)";
    for (const typeOfTestId of selectedTypeOfTests) {
      await db.query(insertTestOfTestQuery, [courseCreationId, typeOfTestId]);
    }

    // Handle subjects update (assuming course_subjects table has columns courseCreationId and subjectId)
    const deleteSubjectsQuery =
      "DELETE FROM course_subjects WHERE courseCreationId = ?";
    await db.query(deleteSubjectsQuery, [courseCreationId]);

    const insertSubjectsQuery =
      "INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)";
    for (const subjectId of selectedSubjects) {
      await db.query(insertSubjectsQuery, [courseCreationId, subjectId]);
    }

    // Handle question types update (assuming course_type_of_question table has columns courseCreationId and quesionTypeId)
    const deleteQuestionTypesQuery =
      "DELETE FROM course_type_of_question WHERE courseCreationId = ?";
    await db.query(deleteQuestionTypesQuery, [courseCreationId]);

    const insertQuestionTypesQuery =
      "INSERT INTO course_type_of_question (courseCreationId, quesionTypeId) VALUES (?, ?)";
    for (const quesionTypeId of selectedQuestionTypes) {
      await db.query(insertQuestionTypesQuery, [
        courseCreationId,
        quesionTypeId,
      ]);
    }

    res.json({ message: "Course updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/exams", async (req, res) => {
  try {
    const query = "SELECT examId,examName FROM exams";
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.use((req, res, next) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  next();
});
// kevin ---------
app.post("/instructionupload", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    const fileName = file.originalname;

    // Read the content of the Word document
    const { value: fileContent } = await mammoth.extractRawText({
      path: file.path,
    });

    // Split the text into points based on a specific delimiter (e.g., dot)
    const pointsArray = fileContent.split("/").map((point) => point.trim());

    // Filter out empty points
    const filteredPointsArray = pointsArray.filter((point) => point !== "");

    // Join the array of points with a separator (e.g., comma)
    const pointsText = filteredPointsArray.join(", ");

    // Insert data into the instruction table
    const queryInstruction =
      "INSERT INTO instruction (examId, instructionHeading, documentName) VALUES (?, ?,  ?)";
    const valuesInstruction = [
      req.body.examId,
      req.body.instructionHeading,
      fileName,
    ];

    const resultInstruction = await db.query(
      queryInstruction,
      valuesInstruction
    );

    if (!resultInstruction || resultInstruction[0].affectedRows !== 1) {
      // Handle the case where the query did not succeed
      console.error(
        "Error uploading file: Failed to insert into instruction table.",
        resultInstruction
      );
      res.status(500).send("Failed to upload file.");
      return;
    }

    const instructionId = resultInstruction[0].insertId;

    // Log the obtained instructionId
    console.log("Obtained instructionId:", instructionId);

    // Insert each point into the instructions_points table with the correct instructionId
    const queryPoints =
      "INSERT INTO instructions_points (examId, points, instructionId) VALUES (?, ?, ?)";
    for (const point of filteredPointsArray) {
      // Log each point and instructionId before the insertion
      console.log(
        "Inserting point:",
        point,
        "with instructionId:",
        instructionId
      );
      await db.query(queryPoints, [req.body.examId, point, instructionId]);
    }

    // Log data to the console
    console.log("File uploaded successfully:", {
      success: true,
      instructionId,
      message: "File uploaded successfully.",
    });

    // Respond with a simple success message
    res.send("File uploaded successfully");
  } catch (error) {
    // Log error to the console
    console.error("Error uploading file:", error);

    // Respond with a simple error message
    res.status(500).send("Failed to upload file.");
  }
}); //______________________INSTRUCTION page __________________________
app.get("/exams", async (req, res) => {
  try {
    const query = "SELECT examId,examName FROM exams";
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.use((req, res, next) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  next();
});
// kevin ---------
// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const { file } = req;
//     const fileName = file.originalname;

//     // Read the content of the Word document
//     const { value: fileContent } = await mammoth.extractRawText({
//       path: file.path,
//     });

//     // Split the text into points based on a specific delimiter (e.g., dot)
//     const pointsArray = fileContent.split("/").map((point) => point.trim());

//     // Filter out empty points
//     const filteredPointsArray = pointsArray.filter((point) => point !== "");

//     // Join the array of points with a separator (e.g., comma)
//     const pointsText = filteredPointsArray.join(", ");

//     // Insert data into the instruction table
//     const queryInstruction =
//       "INSERT INTO instruction (examId, instructionHeading, examName, documentName) VALUES (?, ?, ?, ?)";
//     const valuesInstruction = [
//       req.body.examId,
//       req.body.instructionHeading,
//       req.body.examName,
//       fileName,
//     ];

//     const resultInstruction = await db.query(
//       queryInstruction,
//       valuesInstruction
//     );

//     if (!resultInstruction || resultInstruction[0].affectedRows !== 1) {
//       // Handle the case where the query did not succeed
//       console.error(
//         "Error uploading file: Failed to insert into instruction table.",
//         resultInstruction
//       );
//       res.status(500).send("Failed to upload file.");
//       return;
//     }

//     const instructionId = resultInstruction[0].insertId;

//     // Log the obtained instructionId
//     console.log("Obtained instructionId:", instructionId);

//     // Insert each point into the instructions_points table with the correct instructionId
//     const queryPoints =
//       "INSERT INTO instructions_points (examId, points, instructionId) VALUES (?, ?, ?)";
//     for (const point of filteredPointsArray) {
//       // Log each point and instructionId before the insertion
//       console.log(
//         "Inserting point:",
//         point,
//         "with instructionId:",
//         instructionId
//       );
//       await db.query(queryPoints, [req.body.examId, point, instructionId]);
//     }

//     // Log data to the console
//     console.log("File uploaded successfully:", {
//       success: true,
//       instructionId,
//       message: "File uploaded successfully.",
//     });

//     // Respond with a simple success message
//     res.send("File uploaded successfully");
//   } catch (error) {
//     // Log error to the console
//     console.error("Error uploading file:", error);

//     // Respond with a simple error message
//     res.status(500).send("Failed to upload file.");
//   }
// });

app.post("/InstructionsUpdate", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    const fileName = file.originalname;

    // Read the content of the Word document
    const { value: fileContent } = await mammoth.extractRawText({
      path: file.path,
    });

    // Split the text into points based on a specific delimiter (e.g., dot)
    const pointsArray = fileContent.split("/").map((point) => point.trim());

    // Filter out empty points
    const filteredPointsArray = pointsArray.filter((point) => point !== "");

    // Join the array of points with a separator (e.g., comma)
    const pointsText = filteredPointsArray.join(", ");

    // Insert data into the instruction table
    const queryInstruction =
      "INSERT INTO instruction (examId, instructionHeading, examName, documentName) VALUES (?, ?, ?, ?)";
    const valuesInstruction = [
      req.body.examId,
      req.body.instructionHeading,
      req.body.examName,
      fileName,
    ];

    const resultInstruction = await db.query(
      queryInstruction,
      valuesInstruction
    );

    if (!resultInstruction || resultInstruction[0].affectedRows !== 1) {
      // Handle the case where the query did not succeed
      console.error(
        "Error uploading file: Failed to insert into instruction table.",
        resultInstruction
      );
      res.status(500).json({
        success: false,
        message:
          "Failed to upload file. Couldn't insert into instruction table.",
        error: resultInstruction,
      });
      return;
    }

    const instructionId = resultInstruction[0].insertId;

    // Log the obtained instructionId
    console.log("Obtained instructionId:", instructionId);

    // Insert each point into the instructions_points table with the correct instructionId
    const queryPoints =
      "INSERT INTO instructions_points (examId, points, instructionId, instructionHeading) VALUES (?, ?, ?, ?)";
    for (const point of filteredPointsArray) {
      // Log each point and instructionHeading before the insertion
      console.log(
        "Inserting point:",
        point,
        "with instructionId:",
        instructionId,
        "and instructionHeading:",
        req.body.instructionHeading
      );
      await db.query(queryPoints, [
        req.body.examId,
        point,
        instructionId,
        req.body.instructionHeading,
      ]);
    }

    // Log data to the console
    console.log("File uploaded successfully:", {
      success: true,
      instructionId,
      message: "File uploaded successfully.",
    });

    // Respond with a simple success message
    res.json({
      success: true,
      instructionId,
      message: "File uploaded successfully.",
    });
  } catch (error) {
    // Log error to the console
    console.error("Error uploading file:", error);

    // Respond with a detailed error message
    res.status(500).json({
      success: false,
      message: "Failed to upload file.",
      error: error.message,
    });
  }
});

// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const { file } = req;
//     const fileName = file.originalname;

//     // Read the content of the Word document
//     const { value: fileContent } = await mammoth.extractRawText({
//       path: file.path,
//     });

//     // Split the text into points based on a specific delimiter (e.g., dot)
//     const pointsArray = fileContent.split("/").map((point) => point.trim());

//     // Filter out empty points
//     const filteredPointsArray = pointsArray.filter((point) => point !== "");

//     // Join the array of points with a separator (e.g., comma)
//     const pointsText = filteredPointsArray.join(", ");

//     // Insert data into the instruction table
//     const queryInstruction =
//       "INSERT INTO instruction (examId, instructionHeading, examName, documentName) VALUES (?, ?, ?, ?)";
//     const valuesInstruction = [
//       req.body.examId,
//       req.body.instructionHeading,
//       req.body.examName,
//       fileName,
//     ];

//     // Assuming db is properly initialized and connected
//     const resultInstruction = await db.query(
//       queryInstruction,
//       valuesInstruction
//     );

//     if (!resultInstruction || resultInstruction[0].affectedRows !== 1) {
//       // Handle the case where the query did not succeed
//       console.error(
//         "Error uploading file: Failed to insert into instruction table.",
//         resultInstruction
//       );
//       res.status(500).send("Failed to upload file.");
//       return;
//     }

//     const instructionId = resultInstruction[0].insertId;

//     // Log the obtained instructionId
//     console.log("Obtained instructionId:", instructionId,valuesInstruction );

//     // Insert each point into the instructions_points table with the correct instructionId
//     const queryPoints =
//       "INSERT INTO instructions_points (examId, points, instructionId) VALUES (?, ?, ?)";
//     for (const point of filteredPointsArray) {
//       // Log each point and instructionId before the insertion
//       console.log(
//         "Inserting point:",
//         point,
//         "with instructionId:",
//         instructionId
//       );
//       await db.query(queryPoints, [req.body.examId, point, instructionId]);
//     }

//     // Log data to the console
//     console.log("File uploaded successfully:", {
//       success: true,
//       instructionId,
//       message: "File uploaded successfully.",
//     });

//     // Respond with a simple success message
//     res.send("File uploaded successfully");
//   } catch (error) {
//     // Log error to the console
//     console.error("Error uploading file:", error);

//     // Respond with a simple error message
//     res.status(500).send("Failed to upload file.");
//   }
// });

app.get("/instructionData", async (req, res) => {
  try {
    // Extract examId from request parameters

    // Select all points for the specified examId from the instructions_points table
    const query = "SELECT * FROM instruction";
    const [rows] = await db.query(query);

    // Send the fetched data in the response
    res.json({ success: true, points: rows });
  } catch (error) {
    console.error("Error fetching instruction points:", error);

    // Send a consistent error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch instruction points.",
      error: error.message,
    });
  }
});

app.get("/instructionpointsGet", async (req, res) => {
  try {
    // Extract examId from request parameters
    const { instructionId } = req.params;

    // Select all points for the specified examId from the instructions_points table
    const query = "SELECT * FROM instructions_points";
    const [rows] = await db.query(query, [instructionId]);

    // Send the fetched data in the response
    res.json({ success: true, points: rows });
  } catch (error) {
    console.error("Error fetching instruction points:", error);

    // Send a consistent error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch instruction points.",
      error: error.message,
    });
  }
});

app.get("/instructionpoints/:instructionId/:id", async (req, res) => {
  try {
    const { instructionId, id } = req.params;

    // Select points for the specified instructionId and examId from the instructions_points table
    const query =
      "SELECT * FROM instructions_points WHERE instructionId = ? AND id = ?";
    const [rows] = await db.query(query, [instructionId, id]);

    // Send the fetched data in the response
    res.json({ success: true, points: rows });
  } catch (error) {
    console.error("Error fetching instruction points:", error);

    // Send a consistent error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch instruction points.",
      error: error.message,
    });
  }
});

app.get("/instructionpoints/:instructionId/", async (req, res) => {
  try {
    const { instructionId } = req.params;

    // Select points for the specified instructionId and examId from the instructions_points table
    const query = "SELECT * FROM instructions_points WHERE instructionId = ?";
    const [rows] = await db.query(query, [instructionId]);

    // Send the fetched data in the response
    res.json({ success: true, points: rows });
  } catch (error) {
    console.error("Error fetching instruction points:", error);

    // Send a consistent error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch instruction points.",
      error: error.message,
    });
  }
});
// Assuming you have an Express app and a MySQL connection pool (`db`)

app.put("/updatepoints/:instructionId/:id", async (req, res) => {
  try {
    const { instructionId, id } = req.params;
    const { points } = req.body;

    // Update the instruction point in the database
    const updateQuery =
      "UPDATE instructions_points SET points = ? WHERE instructionId = ? AND id = ?";
    await db.query(updateQuery, [points, instructionId, id]);

    res.json({
      success: true,
      message: "Instruction points updated successfully.",
    });
  } catch (error) {
    console.error("Error updating instruction points:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update instruction points.",
    });
  }
});

// its delets evrey this
app.delete("/deleteinstruction/:instructionId", async (req, res) => {
  try {
    const { instructionId } = req.params;

    // Delete data from the instructions_points table
    const deletePointsQuery =
      "DELETE FROM instructions_points WHERE instructionId = ?";
    const [deletePointsResult] = await db.query(deletePointsQuery, [
      instructionId,
    ]);

    // Delete data from the instruction table
    const deleteInstructionQuery =
      "DELETE FROM instruction WHERE instructionId = ?";
    const [deleteInstructionResult] = await db.query(deleteInstructionQuery, [
      instructionId,
    ]);

    if (
      deletePointsResult.affectedRows > 0 ||
      deleteInstructionResult.affectedRows > 0
    ) {
      res.json({ success: true, message: "Data deleted successfully." });
    } else {
      res.status(404).json({
        success: false,
        message: "No data found for the given instructionId.",
      });
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete data.",
      error: error.message,
    });
  }
});

// Add a new route to handle the deletion of a specific point
app.delete("/deletepoint/:instructionId/:id", async (req, res) => {
  try {
    const { instructionId, id } = req.params;

    // Delete the point from the instructions_points table
    const deletePointQuery =
      "DELETE FROM instructions_points WHERE instructionId = ? AND id = ?";
    const [deleteResult] = await db.query(deletePointQuery, [
      instructionId,
      id,
    ]);

    if (deleteResult.affectedRows > 0) {
      res.json({ success: true, message: "Point deleted successfully." });
    } else {
      res.status(404).json({
        success: false,
        message: "No point found for the given instructionId and id.",
      });
    }
  } catch (error) {
    console.error("Error deleting point:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete point.",
      error: error.message,
    });
  }
});

app.get("/instructionpointEdit/:instructionId", async (req, res) => {
  const instructionId = req.params.instructionId;

  try {
    // Select all points for a specific instructionId from the instructions_points table
    const query = "SELECT * FROM instructions_points WHERE instructionId = ?";
    const [rows] = await db.query(query, [instructionId]);

    // Send the fetched data in the response
    res.json({ success: true, points: rows });
  } catch (error) {
    console.error("Error fetching instruction points:", error);

    // Send a consistent error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch instruction points.",
      error: error.message,
    });
  }
});

// Ex
// const fileUpload = require("express-fileupload");
// app.use(fileUpload());
// const xlsx = require("xlsx");
// app.post('/uploadExcel', (req, res) => {
//   try {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).json({ error: 'No files were uploaded.' });
//     }

//     const excelFile = req.files.file;
//     const workbook = xlsx.read(excelFile.data, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(sheet);

//     console.log('Received file:', excelFile);
//     console.log('Data from file:', data);

//     const columns = Object.keys(data[0]);
//     const insertStatement = `INSERT INTO your_table (${columns.join(', ')}) VALUES ?`;

//     db.query(insertStatement, [data.map(item => columns.map(col => item[col]))], (err, result) => {
//       if (err) {
//         console.error('Database query error:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//       } else {
//         console.log('Result:', result);
//         res.status(200).json({ message: 'Data inserted successfully.' });
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.post("/uploadexcel", async (req, res) => {
//   try {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).json({ error: "No files were uploaded." });
//     }

//     const { file, examId, instructionHeading } = req.files;
//     console.log(
//       `examId : ${examId}, instructionHeading : ${instructionHeading}`
//     );

//     const workbook = xlsx.read(file.data, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(sheet);

//     console.log("Received file:", file);
//     console.log("Data from file:", data);

//     // Assuming you have a column named 'examId' and 'instructionHeading' in your excel file
//     // Modify the columns array accordingly based on your file structure
//     const columns = Object.keys(data[0]);

//     // Add 'examId' and 'instructionHeading' to the insert statement
//     const insertStatement = `INSERT INTO your_table (examId, instructionHeading, ${columns.join(
//       ", "
//     )}) VALUES ?`;

//     console.log("examId:", examId);
//     console.log("instructionHeading:", instructionHeading);
//     console.log("columns:", columns);

//     // Use async/await to wait for the query result
//     const result = await new Promise((resolve, reject) => {
//       db.query(
//         insertStatement,
//         [
//           data.map((item) => [
//             examId,
//             instructionHeading,
//             ...columns.map((col) => item[col]),
//           ]),
//         ],
//         (err, result) => {
//           if (err) {
//             console.error("Database query error:", err);
//             reject(err);
//           } else {
//             console.log("Result:", result, examId);
//             resolve(result);
//           }
//         }
//       );
//     });

//     res.status(200).json({ message: "Data inserted successfully.", result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

//______________________end __________________________

//______________________TEST CREATION PAGE __________________________

app.get('/testcourses', async (req, res) => {
  try {
    const [ rows ] = await db.query('SELECT courseCreationId,courseName FROM course_creation_table');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/create-test', async (req, res) => {
  const {
    testName,
    selectedCourse,
    selectedtypeOfTest,  // Assuming this is the correct property name
    startDate,
    startTime,
    endDate,
    endTime,
    duration,
    totalQuestions,
    totalMarks,
    calculator,
    status,
    sectionsData,
    selectedInstruction,
  } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO test_creation_table (TestName, courseCreationId, courseTypeOfTestId, testStartDate, testEndDate, testStartTime, testEndTime, Duration, TotalQuestions, totalMarks, calculator, status, instructionId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [testName, selectedCourse, selectedtypeOfTest, startDate, endDate, startTime, endTime, duration, totalQuestions, totalMarks, calculator, status, selectedInstruction]
    );

    if (result && result.insertId) {
      const testCreationTableId = result.insertId;

      // Process sectionsData and insert into sections table
      const results = await Promise.all(
        sectionsData.map(async (section) => {
          const [sectionResult] = await db.query(
            'INSERT INTO sections (testCreationTableId, sectionName, noOfQuestions, QuestionLimit) VALUES (?, ?, ?, ?)',
            [testCreationTableId, section.sectionName || null, section.noOfQuestions, section.QuestionLimit || null]
          );
          return sectionResult;
        })
      );

      res.json({ success: true, testCreationTableId, results, message: 'Test created successfully' });
    }
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.get('/instructions', async (req, res) => {
  try {
    const [instructions] = await db.query('SELECT instructionId, instructionHeading FROM instruction');
    res.json(instructions);
  } catch (error) {
    console.error('Error fetching instructions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Add this new API endpoint
app.get('/course-typeoftests/:courseCreationId', async (req, res) => {
  const { courseCreationId } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT type_of_test.TypeOfTestId, type_of_test.TypeOfTestName,course_typeoftests.courseTypeOfTestId ' +
      'FROM course_typeoftests ' +
      'INNER JOIN type_of_test ON course_typeoftests.TypeOfTestId = type_of_test.TypeOfTestId ' +
      'WHERE course_typeoftests.courseCreationId = ?',
      [courseCreationId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching course_typeoftests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/test_creation_table', async (req, res) => {
  try {
    const query =` SELECT tt.testCreationTableId,tt.TestName,cc.courseName,tt.testStartDate,tt.testEndDate,tt.testStartTime,tt.testEndTime,tt.status  FROM test_creation_table tt JOIN  course_creation_table cc ON tt.courseCreationId=cc.courseCreationId `
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error creating sections:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.delete('/test_table_data_delete/:testCreationTableId', async (req, res) => {
  const testCreationTableId = req.params.testCreationTableId;

  try {
    await db.query('DELETE test_creation_table, sections FROM test_creation_table LEFT JOIN sections ON test_creation_table.testCreationTableId = sections.testCreationTableId WHERE test_creation_table.testCreationTableId = ?', [testCreationTableId]);
    res.json({ message: `course with ID ${testCreationTableId} deleted from the database` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/testupdate/:testCreationTableId', async (req, res) => {
  const { testCreationTableId } = req.params;

  try {
    const [rows] = await db.query(`
    SELECT
    tc.testCreationTableId,
    tc.TestName,
    tc.testStartDate,
    tc.testEndDate,
    tc.testStartTime,
    tc.testEndTime,
    tc.Duration,
    tc.TotalQuestions,
    tc.totalMarks,
    tc.calculator,
    tc.status,
    cc.courseCreationId,
    cc.courseName,
    ctt.courseTypeOfTestId,
    tt.TypeOfTestName,
    i.instructionId,
    i.instructionHeading,
    s.sectionName,
    s.noOfQuestions,
    s.QuestionLimit
FROM
    test_creation_table AS tc
INNER JOIN course_creation_table AS cc
ON
    tc.courseCreationId = cc.courseCreationId
INNER JOIN course_typeoftests AS ctt
ON
    tc.courseCreationId = ctt.courseCreationId
INNER JOIN type_of_test AS tt
ON
    ctt.TypeOfTestId = tt.TypeOfTestId
INNER JOIN instruction AS i
ON
    tc.instructionId = i.instructionId
     INNER JOIN
        sections AS s ON tc.testCreationTableId = s.testCreationTableId
WHERE
    tc.testCreationTableId = ?
    `, [testCreationTableId]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Test not found' });
    }
  } catch (error) {
    console.error('Error fetching test data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.put('/test-update/:testCreationTableId', async (req, res) => {
  const testCreationTableId = req.params.testCreationTableId;
  const {
    TestName,
    selectedCourse,
    selectedTypeOfTests,
    testStartDate,
    testEndDate,
    testStartTime,
    testEndTime,
    Duration,
    TotalQuestions,
    totalMarks,
    calculator,
    status,
    sectionId,
    sectionName,
    noOfQuestions,
    QuestionLimit,
    selectedInstruction,
  } = req.body;

  const updateQuery = `UPDATE test_creation_table 
                       SET TestName=?, courseCreationId=?, courseTypeOfTestId=?, 
                           testStartDate=?, testEndDate=?, testStartTime=?, 
                           testEndTime=?, Duration=?, TotalQuestions=?, 
                           totalMarks=?, calculator=?, status=?, instructionId=?
                       WHERE testCreationTableId=?`;

  try {
    await db.query(updateQuery, [
      TestName,
      selectedCourse,
      selectedTypeOfTests,
      testStartDate,
      testEndDate,
      testStartTime,
      testEndTime,
      Duration,
      TotalQuestions,
      totalMarks,
      calculator,
      status,
      selectedInstruction,
      testCreationTableId,
    ]);

    // Log the update result
    const updateResult = await db.query('SELECT * FROM test_creation_table WHERE testCreationTableId = ?', [testCreationTableId]);
    console.log('Update Result:', updateResult);

    // Update section
    const updateSectionQuery = `UPDATE sections 
                                SET sectionName=?, noOfQuestions=?, QuestionLimit=? 
                                WHERE testCreationTableId=? AND sectionId=?`;

    await db.query(updateSectionQuery, [
      sectionName,
      noOfQuestions,
      QuestionLimit,
      testCreationTableId,
      sectionId,
    ]);

    res.json({ message: 'Test and section updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//______________________end __________________________

//________________________________________Document upload_________________________________


app.get('/tests', async (req, res) => {
  try {
      const [rows] = await db.query('SELECT testCreationTableId, TestName FROM test_creation_table');
      res.json(rows);
  } catch (error) {
      console.error('Error fetching test data:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/sections/:testCreationTableId', async (req, res) => {
  const { testCreationTableId } = req.params;
  try {
      const [rows] = await db.query('SELECT testCreationTableId, sectionId, sectionName FROM sections WHERE testCreationTableId = ?', [testCreationTableId]);
      res.json(rows);
  } catch (error) {
      console.error('Error fetching sections data:', error);
      res.status(500).send('Internal Server Error');
  }
});

// main working
// app.post('/upload', upload.single('document'), async (req, res) => {
//   const docxFilePath = `uploads/${req.file.filename}`;
//   const outputDir = `uploads/${req.file.originalname}_images`;

//   const docName = `${req.file.originalname}`;

//   try {
//     await fs.mkdir(outputDir, { recursive: true });
//       const result = await mammoth.convertToHtml({ path: docxFilePath });
//       const htmlContent = result.value;
//       const $ = cheerio.load(htmlContent);
//       const textResult = await mammoth.extractRawText({ path: docxFilePath });
//       const textContent = textResult.value;
//       const textSections = textContent.split('\n\n');

//       // Get all images in the order they appear in the HTML
//       const images = [];
//       $('img').each(function (i, element) {
//           const base64Data = $(this).attr('src').replace(/^data:image\/\w+;base64,/, '');
//           const imageBuffer = Buffer.from(base64Data, 'base64');
//           images.push(imageBuffer);
//       });

//       let j = 0;
//       let Question_id;
//       for (let i = 0; i < images.length; i++) {
//           if (j == 0) {
//               const questionRecord = {
//                   "question_img": images[i],
//                   "testCreationTableId": req.body.testCreationTableId,
//                   "sectionId": req.body.sectionId,
//                   "documentName": docName,
//               };
//               console.log(j);
//               Question_id = await insertRecord('questions', questionRecord);
//               j++;
//           } else if (j > 0 && j < 5) {
//               const optionRecord = {
//                   "option_img": images[i],
//                   "question_id": Question_id
//               };
//               console.log(j);
//               await insertRecord('options', optionRecord);
//               j++;
//           } else if (j == 5) {
//               const solutionRecord = {
//                   "solution_img": images[i],
//                   "question_id": Question_id
//               };
//               console.log(j);
//               await insertRecord('solution', solutionRecord);
//               j = 0;
//           }
//       }
//       res.send('Text content and images extracted and saved to the database with the selected topic ID successfully.');
//   } catch (error) {
//       console.error(error);
//       res.status(500).send('Error extracting content and saving it to the database.');
//   }
// });

// async function insertRecord(table, record) {
//   try {
//       const [result] = await db.query(`INSERT INTO ${table} SET ?`, record);
//       console.log(`${table} id: ${result.insertId}`);
//       return result.insertId;

//   } catch (err) {
//       console.error(`Error inserting data into ${table}: ${err}`);
//       throw err;
//   }
// }

// PRACTICE
// working 11
app.post("/upload", upload.single("document"), async (req, res) => {
  const docxFilePath = `uploads/${req.file.filename}`;
  const outputDir = `uploads/${req.file.originalname}_images`;

  const docName = `${req.file.originalname}`;
  try {
    await fs.mkdir(outputDir, { recursive: true });
    const result = await mammoth.convertToHtml({ path: docxFilePath });
    const htmlContent = result.value;
    const $ = cheerio.load(htmlContent);
    const textResult = await mammoth.extractRawText({ path: docxFilePath });
    const textContent = textResult.value;
    const textSections = textContent.split("\n\n");

    // Insert documentName and get documentId
    const [documentResult] = await db.query("INSERT INTO ots_document SET ?", {
      documen_name: docName,
      testCreationTableId: req.body.testCreationTableId,
    });
    const document_Id = documentResult.insertId;

    // Get all images in the order they appear in the HTML
    const images = [];
    $("img").each(function (i, element) {
      const base64Data = $(this)
        .attr("src")
        .replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");
      images.push(imageBuffer);
    });

    let j = 0;
    let Question_id;
    for (let i = 0; i < images.length; i++) {
      if (j == 0) {
        const questionRecord = {
          question_img: images[i],
          testCreationTableId: req.body.testCreationTableId,
          sectionId: req.body.sectionId,
          document_Id: document_Id,
        };
        console.log(j);
        Question_id = await insertRecord("questions", questionRecord);
        j++;
      } else if (j > 0 && j < 5) {
        const optionRecord = {
          option_img: images[i],
          question_id: Question_id,
        };
        console.log(j);
        await insertRecord("options", optionRecord);
        j++;
      } else if (j == 5) {
        const solutionRecord = {
          solution_img: images[i],
          question_id: Question_id,
        };
        console.log(j);
        await insertRecord("solution", solutionRecord);
        j = 0;
      }
    }
    res.send(
      "Text content and images extracted and saved to the database with the selected topic ID successfully."
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error extracting content and saving it to the database.");
  }
});

async function insertRecord(table, record) {
  try {
    const [result] = await db.query(`INSERT INTO ${table} SET ?`, record);
    console.log(`${table} id: ${result.insertId}`);
    return result.insertId;
  } catch (err) {
    console.error(`Error inserting data into ${table}: ${err}`);
    throw err;
  }
}

// geting Doc name

// app.get('/getRecords', async (req, res) => {
//   const { testCreationTableId, sectionId, documentName } = req.query;

//   try {
//     const records = await getRecordsByParams(testCreationTableId, sectionId, documentName);
//     res.json(records);
//   } catch (error) {
//     console.error('Error in getRecords route:', error);
//     res.status(500).send('Error fetching records from the database.');
//   }
// });
// async function getRecordsByParams(testCreationTableId, sectionId, documentName) {
//   try {
//     const query = 'SELECT * FROM questions WHERE testCreationTableId = ? AND sectionId = ? AND documentName = ?';
//     console.log('SQL Query:', query, [testCreationTableId, sectionId, documentName]);

//     // Use the actual query with parameters
//     const [results] = await db.query(query, [testCreationTableId, sectionId, documentName]);

//     const records = results.map(result => {
//       return {
//         question_id: result.question_id,
//         testCreationTableId: result.testCreationTableId,
//         documentName: result.documentName
//       };
//     });
//     return records;
//   } catch (err) {
//     console.error('Error in getRecordsByParams:', err);
//     throw err;
//   }
// }

// working document name for getting data hgfjd1232
app.get("/documentName", async (req, res) => {
  try {
    const query =
      "SELECT document_Id, testCreationTableId, documen_name FROM ots_document";
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// const sql = `
// SELECT tt.testCreationTableId, s.sectionId, q.qustion_id, q.question_img, o.option_id, o.option_img, o.option_index
// FROM test_creation_table tt, sections s, questions q, options o
// WHERE tt.testCreationTableId=q.testCreationTableId AND s.testCreationTableId=tt.testCreationTableId AND q.qustion_id=o.question_id AND tt.testCreationTableId=?
// `;

// geting data ====================================++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 1st working with id
// Fetch images based on question_id

// API endpoint to get data based on document_Id
// app.get('/api/getDocumentData/:document_Id', async (req, res) => {
//   try {
//     const document_Id = req.params.document_Id;

//     // Fetch document details
//     const documentDetails = await getDocumentDetails(document_Id);

//     if (!documentDetails) {
//       return res.status(404).send('Document not found');
//     }

//     // Fetch question details based on document_Id
//     const questions = await getImagesByType('questions', 'question_img', document_Id);

//     // Fetch option details based on document_Id
//     const options = await getImagesByType('options', 'option_img', document_Id);

//     // Fetch solution details based on document_Id
//     const solutions = await getImagesByType('solution', 'solution_img', document_Id);

//     res.json({
//       document: documentDetails,
//       questions,
//       options,
//       solutions,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching data from the database.');
//   }
// });

// // Function to get document details based on document_Id
// async function getDocumentDetails(document_Id) {
//   try {
//     const [result] = await db.query('SELECT * FROM ots_document WHERE document_Id = ?', [document_Id]);
//     return result[0];
//   } catch (err) {
//     console.error(`Error fetching document details: ${err}`);
//     throw err;
//   }
// }

// // Function to get images based on document_Id
// async function getImagesByType(table, column, document_Id) {
//   try {
//     const query = `SELECT question_id, option_id, ${column} FROM ${table} WHERE document_Id = ? ORDER BY question_id, option_id`;
//     const [results] = await db.query(query, [document_Id]);

//     return results.map(result => ({
//       question_id: result.question_id,
//       option_id: result.option_id,
//       image: `data:image/png;base64,${result[column].toString('base64')}`,
//     }));
//   } catch (err) {
//     console.error(`Error fetching images from ${table}: ${err}`);
//     throw err;
//   }
// }

// app.get('/api/getDocumentData/:document_Id', async (req, res) => {
//   try {
//     const document_Id = req.params.document_Id;

//     // Fetch document details
//     const documentDetails = await getDocumentDetails(document_Id);

//     if (!documentDetails) {
//       return res.status(404).send('Document not found');
//     }

//     // Fetch question details based on document_Id
//     const questions = await getImagesByType('questions', 'question_img', document_Id);

//     // Fetch option details based on document_Id
//     const options = await getImagesByType('options', 'option_img', document_Id);

//     // Fetch solution details based on document_Id
//     const solutions = await getImagesByType('solution', 'solution_img', document_Id);

//     res.json({
//       document: documentDetails,
//       questions,
//       options,
//       solutions,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching data from the database.');
//   }
// });

// // Reusable function to get document details based on document_Id
// async function getDocumentDetails(document_Id) {
//   try {
//     const [result] = await db.query('SELECT * FROM ots_document WHERE document_Id = ?', [document_Id]);
//     return result[0];
//   } catch (err) {
//     console.error(`Error fetching document details: ${err}`);
//     throw err;
//   }
// }

app.get("/api/getDocumentData/:document_Id", async (req, res) => {
  try {
    const document_Id = req.params.document_Id;

    // Fetch document details for the specified document_Id
    const documentDetails = await getDocumentDetails(document_Id);

    if (!documentDetails) {
      return res.status(404).send("Document not found");
    }
    // Fetch question details based on document_Id
    const questions = await getImagesByType(
      "questions",
      "question_img",
      document_Id
    );
    // Fetch option details based on document_Id
    const options = await getImagesByType("options", "option_img", document_Id);
    // Fetch solution details based on document_Id
    const solutions = await getImagesByType(
      "solution",
      "solution_img",
      document_Id
    );
    // Combine images using the combineImages function
    const combinedImages = combineImage(questions, options, solutions);

    res.json({
      document: documentDetails,
      combinedImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from the database.");
  }
});

// Reusable function to get document details based on document_Id
async function getDocumentDetails(document_Id) {
  try {
    const [result] = await db.query(
      "SELECT document_Id, testCreationTableId, documen_name FROM ots_document WHERE document_Id = ?",
      [document_Id]
    );
    return result[0]; // Return the first (and only) row
  } catch (err) {
    console.error(`Error fetching document details: ${err}`);
    throw err;
  }
}

// Function to combine images
function combineImage(questions, options, solutions) {
  const combinedImage = [];

  for (let i = 0; i < questions.length; i++) {
    const questionImage = questions[i].image;
    const optionImages = options
      .filter((opt) => opt.question_id === questions[i].question_id)
      .map((opt) => opt.image);
    const solutionImage = solutions.find(
      (sol) => sol.question_id === questions[i].question_id
    )?.image;

    combinedImage.push({
      questionImage,
      optionImages,
      solutionImage,
    });
  }

  return combinedImage;
}

// app.get('/api/getAllImages', async (req, res) => {
//   try {
//     const questionImages = await getAllImagesByType('questions', 'question_img');
//     const optionImages = await getAllImagesByType('options', 'option_img');
//     const solutionImages = await getAllImagesByType('solution', 'solution_img');

//     res.json({
//       questionImages,
//       optionImages,
//       solutionImages,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching images from the database.');
//   }
// });

// async function getAllImagesByType(table, column) {
//   try {
//     const [results] = await db.query(`SELECT ${column} FROM ${table}`);

//     const imageUrls = results.map(result => {
//       const imageBuffer = result[column];
//       return `data:image/png;base64,${imageBuffer.toString('base64')}`;
//     });

//     return imageUrls;
//   } catch (err) {
//     console.error(`Error fetching images from ${table}: ${err}`);
//     throw err;
//   }
// }
// async function getAllImagesByType(table, column) {
//   try {
//     const [results] = await db.query(`SELECT ${column} FROM ${table} ORDER BY question_id`);

//     const imageUrls = results.map(result => {
//       const imageBuffer = result[column];
//       return `data:image/png;base64,${imageBuffer.toString('base64')}`;
//     });

//     return imageUrls;
//   } catch (err) {
//     console.error(`Error fetching images from ${table}: ${err}`);
//     throw err;
//   }
// }

// 3 we
// app.get('/api/getAllImages', async (req, res) => {
//   try {
//     const questionImages = await getAllImagesByType('questions', 'question_img');
//     const optionImages = await getAllImagesByType('options', 'option_img');
//     const solutionImages = await getAllImagesByType('solution', 'solution_img');

//     res.json({
//       questionImages,
//       optionImages,
//       solutionImages,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching images from the database.');
//   }
// });

// async function getAllImagesByType(table, column) {
//   try {
//     const query = `SELECT ${column} FROM ${table} ORDER BY question_id`;
//     const [results] = await db.query(query);

//     const images = results.map(result => `data:image/png;base64,${result[column].toString('base64')}`);
//     return images;
//   } catch (err) {
//     console.error(`Error fetching images from ${table}: ${err}`);
//     throw err;
//   }
// }

app.get("/api/getAllImages", async (req, res) => {
  try {
    const questions = await getImagesByType("questions", "question_img");
    const options = await getImagesByType("options", "option_img");
    const solutions = await getImagesByType("solution", "solution_img");

    const combinedImages = combineImages(questions, options, solutions);

    res.json(combinedImages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching images from the database.");
  }
});

async function getImagesByType(table, column) {
  try {
    const query = `SELECT question_id, ${column} FROM ${table} ORDER BY question_id`;
    const [results] = await db.query(query);

    return results.map((result) => ({
      question_id: result.question_id,
      image: `data:image/png;base64,${result[column].toString("base64")}`,
    }));
  } catch (err) {
    console.error(`Error fetching images from ${table}: ${err}`);
    throw err;
  }
}

function combineImages(questions, options, solutions) {
  const combinedImages = [];

  for (let i = 0; i < questions.length; i++) {
    const questionImage = questions[i].image;
    const optionImages = options
      .filter((opt) => opt.question_id === questions[i].question_id)
      .map((opt) => opt.image);
    const solutionImage = solutions.find(
      (sol) => sol.question_id === questions[i].question_id
    )?.image;

    combinedImages.push({
      questionImage,
      optionImages,
      solutionImage,
    });
  }

  return combinedImages;
}

app.get("/api/docGetAllImages", async (req, res) => {
  try {
    const { testCreationTableId } = req.query;

    const questions = await gtImagesByType(
      "questions",
      "question_img",
      "document_Id",
      "ots_document",
      testCreationTableId
    );
    const options = await gtImagesByType(
      "options",
      "option_img",
      "document_Id",
      "ots_document",
      testCreationTableId
    );
    const solutions = await gtImagesByType(
      "solution",
      "solution_img",
      "document_Id",
      "ots_document",
      testCreationTableId
    );

    const combinedImages = combineImages(questions, options, solutions);

    res.json(combinedImages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching images from the database.");
  }
});

async function gtImagesByType(
  table,
  column,
  documentIdColumn,
  documentTable,
  testCreationTableId
) {
  try {
    const query = `
      SELECT ${table}.question_id, ${column}, ${table}.${documentIdColumn} AS document_Id
      FROM ${table}
      INNER JOIN ${documentTable} ON ${table}.${documentIdColumn} = ${documentTable}.${documentIdColumn}
      WHERE ${table}.testCreationTableId = ?
      ORDER BY ${table}.question_id
    `;

    const [results] = await db.query(query, [testCreationTableId]);

    return results.map((result) => ({
      question_id: result.question_id,
      document_Id: result.document_Id,
      image: `data:image/png;base64,${result[column].toString("base64")}`,
    }));
  } catch (err) {
    console.error(`Error fetching images from ${table}: ${err}`);
    throw err;
  }
}

// ================================ end
//_________________________________________________Dashboard_____________________________________
app.get("/courses/count", async (req, res) => {
  try {
    const [results, fields] = await db.execute(
      "SELECT COUNT(courseCreationId) AS count FROM course_creation_table"
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching course count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/test/count", async (req, res) => {
  try {
    const [results, fields] = await db.execute(
      "SELECT COUNT(testCreationTableId) AS count FROM test_creation_table"
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching course count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/question/count", async (req, res) => {
  try {
    const [results, fields] = await db.execute(
      "SELECT COUNT(qustion_id) AS count FROM questions"
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching course count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//_____________________________________________________END________________________________

//_________________________________________________FRONT END_______________________________________

app.get("/examData", async (req, res) => {
  // FetchData
  try {
    const [rows] = await db.query("SELECT * FROM exams");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/feachingcourse/:examId", async (req, res) => {
  const { examId } = req.params;
  try {
    // Fetch exams from the database
    const [rows] = await db.query(
      "SELECT * FROM course_creation_table WHERE examId = ?",
      [examId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
