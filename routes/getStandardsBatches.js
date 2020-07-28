var model = require('../config/dbconnect');


var getStandardsBatches = function (req, res) {

    console.log(req.query);
    var class_id = parseInt(req.query.classId);

    if (class_id != null) {

        model(function (err, connection) {

            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('SELECT id, standardId, batchId FROM class_standard_batch WHERE ClassId=?' +
                    ' ORDER BY StandardId, BatchId', [class_id], function (err, rows) {
                    connection.release();

                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({ error: true, message: err.message }));
                    } else {
                        if (rows.length > 0) {
       
                            res.send(JSON.stringify({ error: false, message: "Data got!", standardAndBatchData: rows}));

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


module.exports = { getStandardsBatches };


/*connection.query('SELECT ID, StandardId, StandardName, Batches FROM standards WHERE Class=?', [class_id], function (err, rows) {

    if (err) {
        res.status(500);
        res.send(JSON.stringify({ error: true, message: err.message }));
    } else {
        if (rows.length > 0) {

            var data = []
            for (i = 0; i < rows.length; i++) {
                var id = rows[i].ID
                var standardId = rows[i].StandardId
                var standardName = rows[i].StandardName
                var batchdata = JSON.parse(rows[i].Batches)
                data.push({
                    Id: id,
                    StandardId: standardId,
                    StandardName: standardName,
                    BatchData: batchdata
                })
            }

            res.send(JSON.stringify({ error: false, message: "Data got!", standardAndBatchData: data }));

        } else {
            res.send(JSON.stringify({ error: true, message: "No Data found" }));
        }
    }
});*/