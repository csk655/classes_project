var model = require('../config/dbconnect');

var uploadSchedule = function (req, res) {

    var class_id = parseInt(req.body.classId);
    var schedulePhotoUrl = req.file.filename;
    var date = new Date();
  
    console.log("schedule url " + schedulePhotoUrl);

    if (schedulePhotoUrl != null && class_id != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('INSERT INTO teacher_schedule(schedule_photo, class_id, schedule_date) VALUES(?,?,?) ON DUPLICATE KEY UPDATE schedule_photo=?, schedule_date=? ', [schedulePhotoUrl, class_id, date, schedulePhotoUrl, date], function (err, rows) {

                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ error: true, message: err.message }));
                    } else {

                        if (rows.affectedRows > 0) {

                            res.send(JSON.stringify({ error: false, message: "Upload Success" }));

                        }
                    }
                });
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "profileUrl,class_id can not be null" }));
    }

}

module.exports = { uploadSchedule }
