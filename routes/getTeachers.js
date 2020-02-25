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

                connection.query('SELECT t_id,t_full_name,t_mobile_no,t_gender,t_email,t_dob,t_address,t_experience,t_subject,t_high_qualification,t_profile_pic,t_blood_group,t_joining_date,t_doc_pic,class_id,class_name from teacher_details where class_id=? AND t_status="Active"',
                    [class_id], function (err, rows) {

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
        return res.send(JSON.stringify({ error: true, message: "class_id can not be null" }));
    }
}



module.exports = { getTeachers };