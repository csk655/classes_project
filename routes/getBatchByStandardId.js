var model = require('../config/dbconnect');


var getBatchesByStandardId = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);
    var standard_Id = parseInt(req.query.standardId)

    if (class_id != null && standard_Id != null) {

        model(function (err, connection) {

            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT batchId FROM class_standard_batch WHERE ClassId=? And StandardId=?' +
                    ' ORDER BY BatchId', [class_id, standard_Id], function (err, rows) {
                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            if (rows.length > 0) {

                                res.send(JSON.stringify({ error: false, message: "Data got!", batchesData: rows }));

                            } else {
                                res.send(JSON.stringify({ error: true, message: "No Data found" }));
                            }
                        }
                    });

            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id,standard_Id can not be null" }));
    }
}


module.exports = { getBatchesByStandardId };