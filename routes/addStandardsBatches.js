var model = require('../config/dbconnect');


var addStandardBatch = function (req, res) {

    console.log(req.body);
    var class_id = req.body.classId;
    var standards_detail ;

    try {
        standards_detail = JSON.parse(req.body.Standard_list);
        console.log("standards_detail", standards_detail)
    } catch (err) {
        res.status(500);
        return res.send(JSON.stringify({ success: false, message: err.message }));
    }

    if (class_id != null && standards_detail != null) {

        var batch_data_insert = []
        var standardIdList = []
        var dataPos = 0

        for (i = 0; i < standards_detail["Standard_list"].length; i++) {

            standardIdList[i] = parseInt(standards_detail["Standard_list"][i]["standard_id"]);

            for (j = 0; j < standards_detail["Standard_list"][i]["batches_list"].length; j++) {
         
                batch_data_insert[dataPos] = [parseInt(class_id),
                    parseInt(standards_detail["Standard_list"][i]["standard_id"]),
                    parseInt(standards_detail["Standard_list"][i]["batches_list"][j]["batch_id"])]  
                dataPos++;
            }
        }

        console.log("StandardIds : ",standardIdList)
        console.log(batch_data_insert)

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {
                 
                connection.query('INSERT INTO class_standard_batch(ClassId, StandardId, BatchId) VALUES ?',
                    [batch_data_insert], function (err, rows) {

                        if (err) {
                            connection.release();
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {

                            connection.query('SELECT id as uniqueId, standardId, batchId FROM class_standard_batch WHERE classId=? AND (StandardId) IN (?)',
                                [class_id, standardIdList], function (err, rows) {
                                    connection.release();

                                    if (err) {
                                        res.status(500);
                                        res.send(JSON.stringify({ error: true, message: err.message }));
                                    } else {

                                        if (rows.length > 0) {
                                            res.send(JSON.stringify({ error: false, message: "successful", insertedData: rows }));
                                        }
                                    }
                                });

                        }
                    });
            }
        });   


    } else {
        return res.send(JSON.stringify({ error: true, message: "classId,standard details can not be null " }));
    }
}



module.exports = { addStandardBatch };





/*var json = {
   "Standard_list":[
      {
         "standard_id":"1",
         "standard_name":"First standard",
         "batches_list":[
            {
               "batch_id":1,
               "batch_name":"up Batch 1"
            },
            {
               "batch_id":2,
               "batch_name":"up  Batch 2"
            },
            {
               "batch_id":3,
               "batch_name":"upp Batch 3"
            }
         ]
      },
      {
         "standard_id":"2",
         "standard_name":"Second standard",
         "batches_list":[
            {
               "batch_id":1,
               "batch_name":"up Batch 1"
            },
            {
               "batch_id":2,
               "batch_name":"up Batch 2"
            },
            {
               "batch_id":3,
               "batch_name":"up Batch 3"
            }
         ]
      },
      {
         "standard_id":"3",
         "standard_name":"Third standard",
         "batches_list":[
            {
               "batch_id":1,
               "batch_name":"up  Batch 1"
            },
            {
               "batch_id":3,
               "batch_name":"up  Batch 3"
            }
         ]
      }
   ]
}

 var final_batchdata = [];
        for (k = 0; k < standard_data_insert.length; k++) {
            final_batchdata[k] = [standard_data_insert[k][3]]
        }
        console.log(final_batchdata)

var addStandardBatch = function (req, res) {

    console.log(req.body);
    var class_id = req.body.classId;
    var standards_detail ;

    try {
        standards_detail = JSON.parse(req.body.Standard_list);
    } catch (err) {
        res.status(500);
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

    if (class_id != null && standards_detail != null) {

        var standard_data_insert = [], batch_data_insert = []
        var dataPos = 0

        for (i = 0; i < standards_detail["Standard_list"].length; i++) {

              standard_data_insert[i] = [
                parseInt(class_id),
                parseInt(standards_detail["Standard_list"][i]["standard_id"]),
                standards_detail["Standard_list"][i]["standard_name"],
                JSON.stringify(standards_detail["Standard_list"][i]["batches_list"])]

            for (j = 0; j < standards_detail["Standard_list"][i]["batches_list"].length; j++) {

                batch_data_insert[dataPos] = [parseInt(class_id),
                    parseInt(standards_detail["Standard_list"][i]["standard_id"]),
                    parseInt(standards_detail["Standard_list"][i]["batches_list"][j]["batch_id"]),
                    standards_detail["Standard_list"][i]["batches_list"][j]["batch_name"]]
                dataPos++;
            }
        }

        console.log(standard_data_insert)
        console.log(batch_data_insert)

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {

                connection.query('insert into standards(class, standardid, standardname, batches) values ? on duplicate key update batches = values(batches)',
                    [standard_data_insert], function (err, rows) {

                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message }));
                        } else {

                            if (rows.affectedRows > 0) {

                                connection.query('INSERT INTO batches(class, standard, batchid, batchname) values ? on duplicate key update batchname = values(batchname)',
                                    [batch_data_insert], function (err, rows) {

                                        if (err) {
                                            res.status(500);
                                            res.send(JSON.stringify({ error: true, message: err.message }));
                                        } else {

                                            if (rows.affectedRows > 0) {
                                                res.send(JSON.stringify({ error: false, message: "success" }));
                                            }
                                        }
                                    });
                            }
                        }
                    });
                connection.release();
            }
        });


    } else {
        return res.send(JSON.stringify({ error: true, message: "classId,standard details can not be null" }));
    }
}

*/