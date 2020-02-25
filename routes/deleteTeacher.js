var model = require('../config/dbconnect');


var deleteTeacher = function (req, res) {

    console.log(req.query);
    var teacher_id = req.query.teacherId;
    var class_id = parseInt(req.query.classId);

    if (teacher_id != null && class_id != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('UPDATE teacher_details SET t_status = ? where t_id=? AND class_id=?', ["Inactive", teacher_id, class_id], function (err, rows) {

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
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "teacher_id,class_id can not be null" }));
    }
}


module.exports = { deleteTeacher };