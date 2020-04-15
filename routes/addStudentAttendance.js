var model = require('../config/dbconnect');


var addStudentAttendance = function (req, res) {

    console.log(req.body);
    var attendance_list,date;

    try {
        attendance_list = JSON.parse(req.body.attendanceList);
    } catch (err) {
        res.status(500);
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

    date = new Date(req.body.date);

    if (date != null && attendance_list != null) {

        var attendance_data_insert = []

        for (i = 0; i < attendance_list["AttendanceList"].length; i++) {
            var studentData = attendance_list["AttendanceList"][i]
            attendance_data_insert[i] = [
                parseInt(studentData["studentd_id"]),
                parseInt(studentData["ClassId"]),
                date,
                studentData["isPresent"],
                studentData["isHoliday"]
            ]
        }

        console.log(attendance_data_insert)

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('INSERT INTO students_attendance(StudentId, ClassId, Date, AttendanceStatus, IsHoliday) VALUES ?',
                    [attendance_data_insert], function (err, rows) {

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {

                            if (rows.affectedRows > 0) {
                                res.send(JSON.stringify({ error: false, message: "Students attendance added successfully"}));
                            }
                        }
                    });
                connection.release();
            }
        });


    } else {
        return res.send(JSON.stringify({ error: true, message: "date or attendance list details can not be null" }));
    }
}



module.exports = { addStudentAttendance };