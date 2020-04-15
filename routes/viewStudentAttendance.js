var model = require('../config/dbconnect');
var moment = require('moment')

function formatDate(date) {
    return moment.utc(date).format('YYYY/MM/DD');
}

var getStudentAttendance = function (req, res) {

    console.log(req.query);

    var student_id = parseInt(req.query.studentId);
    var start_date = req.query.startDate;
    var end_date = req.query.endDate;

    if (student_id != null && start_date != null && end_date != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT Date, AttendanceStatus FROM students_attendance WHERE DATE BETWEEN ? AND ? AND studentid = ?',
                    [start_date, end_date, student_id], function (err, rows) {
                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            if (rows.length > 0) {

                                rows = rows.map(function (row) {
                                    return Object.assign({}, row, { AttendanceDate: formatDate(row.Date) });
                                });

                                rows = rows.map(function (item) {
                                    delete item.Date;
                                    return item;
                                });

                                res.send(JSON.stringify({ error: false, message: "Data got!", studentAttendanceData: rows }));

                            } else {
                                res.send(JSON.stringify({ error: true, message: "No Data found" }));
                            }
                        }
                    });
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id, start_date,end_date can not be null" }));
    }
}



module.exports = { getStudentAttendance };