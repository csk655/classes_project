var model = require('D:/node js files/Classes Project backend/config/dbconnect');


var searchAllStudentsFee = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);
    var standard_id = req.query.standardId
    var batch_id = req.query.batchId;

    if (class_id != null && standard_id != null && batch_id != null) {

        model(function (err, connection) {

            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT students.ID ,students.Name, students_detail.Standard,students_detail.Batch, student_fees.TransactionId,student_fees.ChequeNo, student_fees.PaymentMode, student_fees.FeeAmount'
                    + ' FROM students INNER JOIN students_detail ON students.ID = students_detail.Student'
                    + ' INNER JOIN student_fees ON student_fees.StudentId = students.ID'
                    + ' INNER JOIN class_students ON class_students.StudentId = students.ID'
                    + ' WHERE class_students.ClassId = ? AND students_detail.Standard = ? AND students_detail.Batch = ?'
                    + ' ORDER BY student_fees.ID DESC', [class_id, standard_id, batch_id], function (err, rows) {

                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            if (rows.length > 0) {
                                res.send(JSON.stringify({ error: false, message: "Data got!", classAllFees: rows }));
                            } else {
                                res.send(JSON.stringify({ error: true, message: "No Data found" }));
                            }
                        }
                    });
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id,standard_id,batch_id can not be null" }));
    }
}


module.exports = { searchAllStudentsFee };