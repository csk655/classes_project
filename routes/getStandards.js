var model = require('../config/dbconnect');


var getStandards = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);

    if (class_id != null) {

        model(function (err, connection) {

            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT DISTINCT standardId FROM class_standard_batch WHERE ClassId=?' +
                    ' ORDER BY StandardId', [class_id], function (err, rows) {
                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            if (rows.length > 0) {

                                res.send(JSON.stringify({ error: false, message: "Data got!", standardsData: rows }));

                            } else {
                                res.send(JSON.stringify({ error: true, message: "No Data found" }));
                            }
                        }
                    });

            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id can not be null" }));
    }
}


module.exports = { getStandards };