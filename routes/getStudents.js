var model = require('../config/dbconnect');


var getStudents = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);
    var standard_id = req.query.standardId;
    var batchId = parseInt(req.query.batchId);
    var startIndex = parseInt(req.query.from);
    var endIndex = parseInt(req.query.to);

    if (class_id != null && standard_id != null && batchId != null && startIndex != null && endIndex != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT student_id,student_name,student_mobile_no,student_email,student_profile_pic from student_details where class_id=? AND student_standard_id=? AND batch=? AND student_status="Active"'
                    + ' ORDER BY student_id LIMIT ?,?', [class_id, standard_id, batchId, startIndex, endIndex], function (err, rows) {

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {

                            if (rows.length > 0) {

                                res.send(JSON.stringify({ error: false, message: "Data got!", result: rows }));

                            } else {
                                res.send(JSON.stringify({ error: true, message: "No Data found" }));
                            }

                        }
                    });
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id,standard_id,batchId,gender and other fields can not be null" }));
    }
}


module.exports = { getStudents };