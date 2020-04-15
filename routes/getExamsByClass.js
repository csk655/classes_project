var model = require('../config/dbconnect');

var getClassExams = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);

    if (class_id != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT ExamId, Exam, Date FROM classes_exam WHERE ClassId = ?',
                    [class_id], function (err, rows) {
                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            if (rows.length > 0) {

                                res.send(JSON.stringify({ error: false, message: "Data got!", classExams: rows }));

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

module.exports = { getClassExams };