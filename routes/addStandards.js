var model = require('../config/dbconnect');


var addStandard = function (req, res) {

    console.log(req.body);
    var class_id = req.body.classId;
    var standard_1 = parseInt(req.body.standard_1);
    var standard_2 = parseInt(req.body.standard_2);
    var standard_3 = parseInt(req.body.standard_3);
    var standard_4 = parseInt(req.body.standard_4);
    var standard_5 = parseInt(req.body.standard_5);
    var standard_6 = parseInt(req.body.standard_6);
    var standard_7 = parseInt(req.body.standard_7);
    var standard_8 = parseInt(req.body.standard_8);
    var standard_9 = parseInt(req.body.standard_9);
    var standard_10 = parseInt(req.body.standard_10);


    if (class_id != null && standard_1 != null && standard_2 != null && standard_3 != null && standard_4 != null && standard_5 != null && standard_6 != null && standard_7 != null && 
        standard_8 != null && standard_9 != null && standard_10 != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('INSERT INTO class_standards(class_id, standard_1, standard_2, standard_3, standard_4, standard_5, standard_6, standard_7, standard_8, standard_9, standard_10) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE' +
                    ' standard_1 =?, standard_2 =? , standard_3 =? , standard_4=? , standard_5 =?, standard_6 =?, standard_7 =?, standard_8 =?, standard_9 =?, standard_10 =?',
                    [class_id, standard_1, standard_2, standard_3, standard_4, standard_5, standard_6, standard_7, standard_8, standard_9, standard_10, standard_1, standard_2, standard_3, standard_4, standard_5, standard_6, standard_7, standard_8, standard_9, standard_10], function (err, rows) {

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {

                            if (rows.affectedRows > 0) {
                                res.send(JSON.stringify({ error: false, message: "Success" }));

                            }
                        }
                    });
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "classId,standard_1, standard_2  and other fields can not be null" }));
    }
}



module.exports = { addStandard };