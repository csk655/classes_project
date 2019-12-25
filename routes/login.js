var model = require('../config/dbconnect');


exports.login = function(req,res){

    var type = req.body.type;
    var email = req.body.email;
    var password = req.body.password;

    

    if(type!=null && email !=null && password != null){

        var query ;
        if(type== "1"){
            query = 'select id,mobile,email,address,class_logo from admin where email="'+email+'"';
        }else if(type== "2"){

        }else if(type== "3"){
            
        }else if(type== "4"){
            
        }else{
            res.send('Wrong type');
        
        }
        model(function(err,connection){

            if(err){
                console.log(err);
                res.send('Error occured with dbconnection pool');

            }else{

               
                connection.query(query,function(err,rows){
                                
                    if(err){
                        console.log(err);
                       
                      
                        res.send(JSON.stringify({error : true , message : 'Error Occurred with query'}));

                        
                    }
                    else{
                        if (rows.length > 0) {
                            
                            res.send(JSON.stringify({error : false , message : "User login succssfully" , result : rows}));

                           } else {
                   
                             res.send(JSON.stringify({error : true , message : "User not exists"}));
                           }
                    }
                });
        connection.release();
               

            }
        })

    }else{
        return res.json({error: true , message : "type,email,password can not be null"});
    }
}

