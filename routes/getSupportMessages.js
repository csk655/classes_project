var model = require('../config/dbconnect');


var getSupportMessagesByClass = function (req, res) {

    console.log(req.query);
    const class_id = parseInt(req.query.classId);
    const limit = 3
    const page = req.query.page
    const offset = (page - 1) * limit

    if (class_id != null) {

        model(function (err, connection) {

            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT support.id, support.subject, support.description, DATE_FORMAT(`support`.`messageDate`, "%d-%m-%Y") as messageDate, support_reply.reply, DATE_FORMAT(`support_reply`.`replyDate`, "%d-%m-%Y") as replyDate FROM'+
                    ' `support` LEFT JOIN `support_reply` ON `support`.`ID` = `support_reply`.`Support` WHERE `support`.`Class`=? LIMIT ? OFFSET ?', [class_id, limit, offset],  function (err, rows) {
                        connection.release();

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            if (rows.length > 0) {
                                res.send(JSON.stringify({ error: false, message: "Data got!", supportMessages: rows }));
                            } else {
                                res.send(JSON.stringify({ error: true, message: "No Data found", supportMessages: [] }));
                            }
                        }
                });
                
            }
        });
    } else {
        return res.send(JSON.stringify({ error: true, message: "class_id or page can not be null" }));
    }
}


module.exports = { getSupportMessagesByClass };