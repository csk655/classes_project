var model = require('../config/dbconnect');


var addStudent = function (req, res) {

    console.log(req.body);
    var profileUrl;
    var class_id = parseInt(req.body.classId);
    var class_name = req.body.className;
    var student_name = req.body.studentName;
    var mobile_no = req.body.mobileNo;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var standard_id = req.body.standardId;
    var batch = req.body.batch;
    var email = req.body.email;
    var blood_group = req.body.bloodGroup;
    var joining_date = req.body.joiningDate;
    var updated_date = new Date();

    //parent details
    var mother_name = req.body.motherName;
    var father_name = req.body.fatherName;
    var parent_mobileNo = req.body.parentMobileNo;
    var parent_email = req.body.parentEmail;
    var address = req.body.address;

    var paths = req.files.map(file => {
            profileUrl = file.filename;
    });

    if (class_id != null, class_name != null, student_name != null && mobile_no != null && gender != null && dob != null && standard_id != null && batch != null && email != null && blood_group != null && joining_date != null && updated_date != null
        && mother_name != null && father_name != null && parent_mobileNo != null && parent_email != null && address != null && profileUrl != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('INSERT INTO student_details(class_id,class_name,student_name, student_mobile_no, student_gender, student_dob, student_standard_id, batch, student_email, student_profile_pic, student_blood_group, student_join_date, student_update_date) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE' +
                    ' student_name =?, student_mobile_no =? , student_gender =? , student_dob=? , student_standard_id =?, batch =?, student_email =?, student_profile_pic =?, student_blood_group =?, student_join_date =?, student_update_date =?',
                    [class_id, class_name,student_name, mobile_no, gender, dob, standard_id, batch, email, profileUrl, blood_group, joining_date, updated_date, student_name, mobile_no, gender, dob, standard_id, batch, email, profileUrl, blood_group, joining_date, updated_date], function (err, rows) {

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                     
                            if (rows.affectedRows > 0) {

                                connection.query('SELECT student_id from student_details where student_mobile_no=?', [mobile_no], function (err, rows) {

                                    if (err) {
                                        res.status(500);
                                        res.send(JSON.stringify({ error: true, message: err.message }));
                                    } else {

                                        var student_parent_Id = rows[0].student_id;

                                        connection.query('INSERT INTO parent(parent_id,mother_name,father_name,mobile_no,email,address,created_at) VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE' +
                                            ' mother_name=?,father_name=?,mobile_no=?,email=?,address=?,created_at=?',
                                            [student_parent_Id, mother_name, father_name, parent_mobileNo, parent_email, address, joining_date, mother_name, father_name, parent_mobileNo, parent_email, address, joining_date], function (err, rows) {

                                                if (err) {
                                                    res.status(500);
                                                    res.send(JSON.stringify({ error: true, message: err.message }));
                                                } else {

                                                    res.send(JSON.stringify({ error: false, message: "Success" }));
                                                }

                                        });
                                    }

                                });

                                
                            }
                        }
                    });
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id , classname, student_name,mobile no,gender and other fields can not be null" }));
    }
}



module.exports = { addStudent };