var model = require('../config/dbconnect');


var getParentByStudent = function (req, res) {

    console.log(req.query);
    var studentId = parseInt(req.query.studentId);

    if (studentId != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT parents.id, parents.fatherName, parents.motherName, parents.mobile, parents.email, parents.address'
                    + ' FROM parents INNER JOIN parent_students'
                    + ' ON parents.ID = parent_students.ParentId'
                    + ' WHERE parent_students.StudentID=? AND parents.Status=?', [studentId, "Active"], function (err, rows) {

                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            if (rows.length > 0) {
                                res.send(JSON.stringify({ error: false, message: "Data got!", parentDetail: rows[0] }));
                            } else {
                                res.send(JSON.stringify({ error: true, message: "No data found or parent is inactive" }));
                            }
                        }
                    });
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "studentId can not be null" }));
    }
}


module.exports = { getParentByStudent };