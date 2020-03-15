var model = require('../config/dbconnect');


var deleteTeacher = function (req, res) {

    console.log(req.query);
    var teacher_id = req.query.teacherId;

    if (teacher_id != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('UPDATE teachers SET Status=? WHERE ID=?', ["Inactive", teacher_id], function (err, rows) {

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
        return res.send(JSON.stringify({ error: true, message: "teacher_id can not be null" }));
    }
}


module.exports = { deleteTeacher };