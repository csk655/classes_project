var model = require('../config/dbconnect');

var getStudentResult = function (req, res) {

    console.log(req.query);

    var student_id = parseInt(req.query.studentId);
    var class_id = parseInt(req.query.classId);
    var exam_id = parseInt(req.query.examId);

    if (student_id != null && class_id != null && exam_id != null) {
  
        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                    connection.query('SELECT Subjects FROM students_result WHERE ClassId = ? AND StudentId = ? AND ExamId = ?',
                        [class_id, student_id, exam_id], function (err, rows) {
                            connection.release();

                            if (err) {
                                res.status(500);
                                res.send(JSON.stringify({ error: true, message: err.message }));
                            } else {
                                if (rows.length > 0) {

                                    res.send(JSON.stringify({ error: false, message: "Data got!", studentResult: JSON.parse(rows[0].Subjects) }));

                                } else {
                                    res.send(JSON.stringify({ error: true, message: "No Data found" }));
                                }
                            }
                        });
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id, student_id can not be null" }));
    }
}

module.exports = { getStudentResult };