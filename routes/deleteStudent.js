var model = require('../config/dbconnect');


var deleteStudent = function (req, res) {

    console.log(req.query);
    var student_id = req.query.studentId

    if (student_id != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('UPDATE students SET Status=? where ID=?', ["Inactive", student_id], function (err, rows) {

                    connection.release();

                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ error: true, message: err.message }));
                    } else {

                        if (err) {

                            res.send(JSON.stringify({ error: true, message: err.message }));

                        } else {

                            res.send(JSON.stringify({ error: false, message: "Delete Success" }));

                        }
                    }
                });
                
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "student_id can not be null" }));
    }
}


module.exports = { deleteStudent };

