var model = require('../config/dbconnect');

/*{
    "ids": [
        7,
        8]
}*/

var deleteStandardBatch = function (req, res) {

    console.log(req.body);
    var batch_id_json;

    try {
        batch_id_json = JSON.parse(req.body.batchstandardids)
    } catch (err) {
        res.status(500);
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

    if (batch_id_json != null) {

        var std_bat_delete_id = []

        for (i = 0; i < batch_id_json["ids"].length; i++) {
            std_bat_delete_id[i] = [parseInt(batch_id_json["ids"][i])]
        }

        console.log(std_bat_delete_id)


        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('DELETE FROM class_standard_batch WHERE (ID) IN (?)', [std_bat_delete_id], function (err, rows) {

                        if (err) {
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {
                            res.send(JSON.stringify({ error: false, message: "Delete Success" }));
                        }
                });
                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "batch_id_json can not be null" }));
    }
}


module.exports = { deleteStandardBatch };