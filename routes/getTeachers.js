var model = require('../config/dbconnect');


var getTeachers = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);

    if (class_id != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {                                                                                                                                                                            
                                        
                connection.query('SELECT teachers.id, teachers.name, teachers.email, teachers.mobile, teachers.gender, teachers.dob,'
                    + ' teachers.address, teachers.experience, teachers.subject, teachers.qualification, '
                    + ' teachers.profilePic, teachers.docPic, teachers.bloodGroup, teachers.joinDate'
                    + ' FROM teachers INNER JOIN class_teachers ON teachers.ID = class_teachers.TeacherId'
                    + ' WHERE class_teachers.ClassId =? AND teachers.Status = "Active"',
                    [class_id], function (err, rows) {

                        if (err) {                                                                                                                                                
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {                                                                                                                                                                            
                            if (rows.length > 0) {
                                res.send(JSON.stringify({ error: false, message: "Data got!", teachersData: rows }));
                            } else {
                                res.send(JSON.stringify({ error: true, message: "No Data found Or all teachers are inactive" }));
                            }
                        }
                    });
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id can not be null" }));
    }
}



module.exports = { getTeachers };