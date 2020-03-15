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

                connection.query('SELECT students.ID, students.Name, students_detail.Standard, students_detail.Batch, students.Email, students.Mobile, students.Gender, students.DOB, students.ProfilePic, students.BloodGroup, students.JoinDate'
                    + ' from students INNER JOIN students_detail ON students.ID = students_detail.Student'
                    + ' WHERE students.Class=? AND students_detail.Standard=? AND students_detail.Batch=? AND students.Status = "Active"'
                    + ' ORDER BY students.ID LIMIT ?,?', [class_id, standard_id, batchId, startIndex, endIndex], function (err, rows) {

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
        return res.send(JSON.stringify({ error: true, message: "class_id,standard_id,batchId and other fields can not be null" }));
    }
}


module.exports = { getStudents };