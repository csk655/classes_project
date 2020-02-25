var model = require('../config/dbconnect');

var sendSupportReply = function (req, res) {

    console.log(req.body);
    var support_id = parseInt(req.body.supportId);
    var class_id = parseInt(req.body.classId);
    var reply = req.body.reply;
    var date = new Date();


    if (support_id != null && class_id != null && reply != null && reply != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('INSERT INTO support_reply(support_id,support_reply,class_id,date) VALUES(?,?,?,?)', [support_id, reply, class_id, date], function (err, rows) {

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
        return res.send(JSON.stringify({ error: true, message: "support_id,classId,subject,reply can not be null" }));
    }
}

module.exports = { sendSupportReply };