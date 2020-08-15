var model = require('../config/dbconnect');


var getStudents = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);
    var standard_id = req.query.standardId;
    var batchId = parseInt(req.query.batchId);
    //var startIndex = parseInt(req.query.from);
    //var endIndex = parseInt(req.query.to);

    const limit = 3
    const page = req.query.page
    // calculate offset
    const offset = (page - 1) * limit

    if (class_id != null && standard_id != null && batchId != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT students.id, students.name, students_detail.standard, students_detail.batch, students_detail.feesStructureId ,students.email, students.mobile,'
                    + ' students.gender, students.dob, students.profilePic, students.joinDate'
                    + ' FROM students INNER JOIN students_detail ON students.ID = students_detail.Student'
                    + ' INNER JOIN class_students ON students.ID = class_students.StudentId'
                    + ' WHERE class_students.ClassId = ? AND students_detail.Standard = ? AND students_detail.Batch = ? AND students.Status = "Active"'
                    + ' ORDER BY students.ID LIMIT ? OFFSET ?', [class_id, standard_id, batchId, limit, offset], function (err, rows) {

                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {

                            if (rows.length > 0) {

                                res.send(JSON.stringify({ error: false, message: "Data got!", page_number: page, studentsData: rows }));

                            } else {
                                res.send(JSON.stringify({ error: true, message: "No Data found", page_number: page, studentsData: []}));
                            }

                        }
                    });
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id,standard_id,batchId and other fields can not be null" }));
    }
}


module.exports = { getStudents };