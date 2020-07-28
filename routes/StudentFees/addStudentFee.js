var path = require("path");
var dbconnectPath = path.resolve("./config/dbconnect")
var model = require(dbconnectPath);

var addStudentFee = function (req, res) {

    console.log(req.body);
    var student_id = req.body.studentId;
    var payment_mode = req.body.paymentMode;
    var transaction_id = req.body.transactionId;
    var cheque_no = req.body.chequeNo;
    var fee_amount = req.body.feeAmount;
    var date = new Date();

    if (student_id != null && payment_mode != null && transaction_id != null && cheque_no != null && fee_amount != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('INSERT INTO student_fees(StudentId, TransactionId, ChequeNo, PaymentMode, FeeAmount, Date) VALUES(?,?,?,?,?,?)',
                    [student_id, transaction_id, cheque_no, payment_mode, fee_amount, date],
                    function (err, rows) {

                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {

                            if (err) {
                                res.send(JSON.stringify({ error: true, message: err.message }));
                            } else {

                                if (rows.affectedRows > 0) {
                                    res.send(JSON.stringify({ error: false, message: "Student fee added successfully" }));
                                }

                            }
                        }
                    });
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "student_id,payment_mode,transaction_id,cheque_no,fee_amount,date can not be null" }));
    }
}


module.exports = { addStudentFee };
