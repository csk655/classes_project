var model = require('../config/dbconnect');


var deleteStudent = function (req, res) {

    console.log(req.query);
    var student_id = req.query.studentId
    var class_id = parseInt(req.query.classId);
    var standard_id = req.query.standardId;
    var batchId = parseInt(req.query.batchId);

    if (student_id != null && class_id != null && standard_id != null && batchId != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('UPDATE student_details SET student_status = ? where student_id=? AND class_id=? AND student_standard_id=? AND batch=?', ["Inactive", student_id, class_id, standard_id, batchId], function (err, rows) {

                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ error: true, message: err.message }));
                    } else {

                        if (err) {

                            res.send(JSON.stringify({ error: true, message: err.message }));

                        } else {


                            connection.query('UPDATE parent SET parent_status = ? where parent_id=?', ["Inactive", student_id], function (err, rows) {

                                if (err) {
                                    res.status(500);
                                    res.send(JSON.stringify({ error: true, message: err.message }));
                                } else {

                                    if (err) {

                                        res.send(JSON.stringify({ error: true, message: err.message }));

                                    } else {
                                        res.send(JSON.stringify({ error: false, message: "Success" }));
                                    }

                                }
                            });

                        }
                    }
                });
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "student_id,class_id,standard_id,batchId can not be null" }));
    }
}


module.exports = { deleteStudent };