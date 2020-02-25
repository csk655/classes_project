var model = require('../config/dbconnect');


var getSupportReplyByClass = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);
    var support_id = parseInt(req.query.supportId);

    if (class_id != null && support_id != null) {

        model(function (err, connection) {

            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT support_id,support_reply,date,class_id from support_reply where class_id=? AND support_id=?', [class_id, support_id], function (err, rows) {

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
        return res.send(JSON.stringify({ error: true, message: "class_id,support_id can not be null" }));
    }
}


module.exports = { getSupportReplyByClass };