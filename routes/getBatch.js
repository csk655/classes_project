var model = require('../config/dbconnect');


var getBatchesByStandard = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);
    var standard_id = parseInt(req.query.standardId);

    if(class_id != null && standard_id != null) {

        model(function (err, connection) {

            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT batch_1,batch_2,batch_3 from class_batches where class_id=? AND standard_id=?', [class_id, standard_id], function (err, rows) {

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
        return res.send(JSON.stringify({ error: true, message: "class_id,standard_id can not be null" }));
    }
}


module.exports = { getBatchesByStandard };