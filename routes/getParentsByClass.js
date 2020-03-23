var model = require('../config/dbconnect');


var getParentsByClass = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);
    var email = req.query.email;

    if (class_id != null && email != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT parents.Id, parents.FatherName, parents.MotherName'
                    + ' FROM parents INNER JOIN class_parents'
                    + ' ON parents.ID = class_parents.ParentId'
                    + ' WHERE class_parents.ClassId = ? AND parents.Email = ?',

                    [class_id, email], function (err, rows) {

                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            
                            if (rows.length > 0) {

                                res.send(JSON.stringify({ error: false, message: "Data got!", parentDetails: rows }));

                            } else {
                                res.send(JSON.stringify({ error: true, message: "No Data found" }));
                            }

                        }
                    });
               
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id,email can not be null" }));
    }
}


module.exports = { getParentsByClass };