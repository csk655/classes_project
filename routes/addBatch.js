var model = require('../config/dbconnect');


var addBatch = function (req, res) {

    console.log(req.body);
    var class_id = parseInt(req.body.classId);
    var standard_id = parseInt(req.body.standardId);
    var batch_1 = parseInt(req.body.batch_1);
    var batch_2 = parseInt(req.body.batch_2);
    var batch_3 = parseInt(req.body.batch_3);

    if (class_id != null && standard_id != null && batch_1 != null && batch_2 != null && batch_3 != null) {

        model(function (err, connection) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({ error: true, message: 'Error occured with dbconnection pool' }));
            } else {
             
                var upsertQuery = "";

                var selectSql = "SELECT  COUNT(*) AS dataCount from class_batches where class_id= '" + class_id + "' AND standard_id= '" + standard_id + "'";
              
                connection.query(selectSql,function (err, rows) {
                        if (err) {
                            res.status(500);
                            res.send(JSON.stringify({ error: true, message: err.message })); 
                        } else {

                            if (rows[0].dataCount > 0) {
                                upsertQuery = "UPDATE `class_batches` SET batch_1= '" + batch_1 + "' , batch_2= '" + batch_2 + "', batch_3= '" + batch_3 + "' where `class_id` = '" + class_id + "' AND `standard_id` = '" + standard_id + "' ";
                            } else {
                                upsertQuery = "INSERT INTO class_batches(class_id, standard_id,batch_1,batch_2,batch_3) VALUES ('" + class_id + "','" + standard_id + "','" + batch_1 + "','" + batch_2 + "','" + batch_3 + "')";
                            }

                            console.log(upsertQuery)

                            connection.query(upsertQuery, function (err, rows) {
                                if (err) {
                                    res.status(500);
                                    res.send(JSON.stringify({ error: true, message: err.message }));
                                } else {

                                    if (rows.affectedRows > 0) {
                                        res.send(JSON.stringify({ error: false, message: "Success" }));
                                    }

                                }
                            });
                        }
                    });

                connection.release();
            }
        });

    } else {
        return res.send(JSON.stringify({ error: true, message: "classId, standard_id, batch_1, batch_2, batch_3 can not be null" }));
    }
}



module.exports = { addBatch };

//{ class_id: class_id, standard_id: standard_id, batch_1: batch_1, batch_2: batch_2, batch_3: batch_3 }

/*'IF EXISTS(SELECT * from class_batches where class_id= ? AND standard_id= ?)' +
    '     UPDATE class_batches SET batch_1= ? , batch_2= ?, batch_3= ? where class_id= ? AND standard_id= ?' +
    ' ELSE' +
    '   INSERT INTO class_batches (class_id,standard_id,batch_1,batch_2,batch_3)' +
    '    VALUES(?,?,?,?,?)',
    [class_id, standard_id, batch_1, batch_2, batch_3, class_id, standard_id, class_id, standard_id, batch_1, batch_2, batch_3]*/


/*'IF EXISTS(SELECT * from `class_batches` where `class_id` = ? AND `standard_id` = ?)' +
    ' THEN ' +
    '    UPDATE `class_batches` SET ? where `class_id` = ? AND `standard_id` = ?' +
    ' ELSE ' +
    '    INSERT INTO class_batches (class_id, standard_id, batch_1, batch_2, batch_3) VALUES(?, ?, ?, ?, ?)',

    [class_id, standard_id, { batch_1: batch_1, batch_2: batch_2, batch_3: batch_3 }, class_id, standard_id, class_id, standard_id, batch_1, batch_2, batch_3]
    
    'INSERT INTO class_batches (class_id, standard_id, batch_1, batch_2, batch_3) VALUES(?, ?, ?, ?, ?)',
                    [class_id, standard_id, batch_1, batch_2, batch_3]
                    
                    
                    
                    "IF EXISTS(SELECT * from `class_batches` where `class_id` = '" + class_id + "' AND `standard_id` = '" + standard_id + "')" +
                    " THEN " +
                    "    UPDATE `class_batches` SET batch_1= '" + batch_1 + "' , batch_2= '" + batch_2 + "', batch_3= '" + batch_3 + "' where `class_id` = '" + class_id + "' AND `standard_id` = '" + standard_id + "'" +
                    " ELSE '" + insertsql + "'"
                    
                       //var insertValues = { class_id: 6, standard_id: 9, batch_1: 1, batch_2: 0, batch_3: 1 }
               //var insertsql = "INSERT INTO class_batches(class_id,standard_id,batch_1,batch_2,batch_3) VALUES (?,?,?,?,?)";
                    
                    
                    */