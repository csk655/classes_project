var model = require('../config/dbconnect');


var addStudentResult = function (req, res) {

    console.log(req.body);
    var subjects_list, date, class_id, student_id, new_exam, exam_id;

    class_id = parseInt(req.body.classId)
    student_id = parseInt(req.body.studentId)
    new_exam = req.body.newExam
    exam_id = parseInt(req.body.examId)
    subjects_list = req.body.subjectsList
    date = new Date();

    if (class_id != null && student_id != null && subjects_list != null) {

        model(function (err, connection) {
            if (err) {

                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));

            } else {

                if (new_exam != "null") {

                    connection.query('INSERT INTO classes_exam(ClassId, Exam, Date) VALUES(?,?,?)',
                        [class_id, new_exam, date], function (err, rows) {

                            if (err) {
                                res.status(500);
                                res.send(JSON.stringify({ error: true, message: err.message }));
                            } else {

                                if (rows.affectedRows > 0) {

                                    console.log(rows.insertId)
                                    exam_id = parseInt(rows.insertId)

                                    connection.query('INSERT INTO students_result(StudentId, ClassId, ExamId, Subjects) VALUES(?,?,?,?)',
                                        [student_id, class_id, exam_id, subjects_list], function (err, rows) {

                                            connection.release();

                                            if (err) {
                                                res.status(500);
                                                res.send(JSON.stringify({ error: true, message: err.message }));
                                            } else {

                                                if (rows.affectedRows > 0) {
                                                    res.send(JSON.stringify({ error: false, message: "Student result added successfully" }));
                                                }
                                            }
                                        });
                                }
                            }
                        });
                } else {
  
                    connection.query('INSERT INTO students_result(StudentId, ClassId, ExamId, Subjects) VALUES(?,?,?,?)',
                        [student_id, class_id, exam_id, subjects_list], function (err, rows) {

                            connection.release();

                            if (err) {
                                res.status(500);
                                res.send(JSON.stringify({ error: true, message: err.message }));
                            } else {

                                if (rows.affectedRows > 0) {
                                    res.send(JSON.stringify({ error: false, message: "Student result added successfully" }));
                                }
                            }
                        });
                }

            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id, student_id, subjects_list can not be null" }));
    }
}



module.exports = { addStudentResult };