var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Landon#1",
    database: "bamazon_db"
});


connection.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
    makeTable();
});

var makeTable = function() {
    connection.query("Select * FROM products", function(err,res){
        for(var i=0; i<res.length; i++){
            console.log(res[i].item_id+" || "+res[i].product_name+" || "+
            res[i].department_name+" || "+res[i].price+" || "+res[i].stock_quality+"\n");
        }
    promptCustomer(res);
     })
    }

    var promptCustomer = function(res){
        inquirer.prompt([{
            type:'input',
            name:'choice',
            message:"Please enter the item you would like to purchase"
        }]).then(function(answer){
            var correct = false;
            for (var i=0;i<res.length;i++){
                if(res[i].product_name==answer.choice){
                    correct=true;
                    var product=answer.choice;
                    var id=i;
                    inquirer.prompt({
                        type:"input",
                        name:"quant",
                        message:"How many would you like to buy?",
                        validate: function(value){
                            if(isNaN(value)==false){
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }).then(function(answer){
                        if((res[id].stock_quality-answer.quant)>0){
                            connection.query("UPDATE products SET stock_quality='"+(res[id].stock_quality-
                                answer.quant)+"' WHERE product_name='"+product
                                +"'", function(err,res2){
                                    console.log("Product Bought!");
                                    makeTable();
                                })
                        } else {
                            console.log("Not a valid selection!");
                            promptCustomer(res);
                        }
                    })
                }
            }
            if(i==res.length && correct==false){
                console.log("Not a valid selection!");
                promptCustomer(res);
            }
        })
    }    
