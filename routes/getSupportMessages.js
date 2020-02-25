var model = require('../config/dbconnect');


var getSupportMessagesByClass = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);
    var startIndex = parseInt(req.query.from);
    var endIndex = parseInt(req.query.to);

    if (class_id != null && startIndex != null && endIndex != null) {

        model(function (err, connection) {

            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT support_id,subject,description,date from support where class_id=?'
                    + ' ORDER BY support_id desc LIMIT ?,?', [class_id, startIndex, endIndex], function (err, rows) {

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


module.exports = { getSupportMessagesByClass };