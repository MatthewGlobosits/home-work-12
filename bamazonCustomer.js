var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"root",
    database:"bamazon"
})

    connection.connect(function(err){
        if(err) throw err;
        console.log("connection works");
        makeTable();
    })

    var makeTable = function(){
        connection.query("SELECT * FROM bamazon_db.products", function(err,res){
            for(var i=0; i<res.length; i++){
                console.log(res[i].item_id+"|"+ res[i].product_name+"|"+ res[i].department_name+"|"+ res[i].price+"|"+res[i].stock_quantity+"\n");
            }
            promptCustomer(res);
        })
    }
    var promptCustomer = function(res){
        inquirer.prompt([{
            type:"input",
            name:"choice",
            message: "What do you want to purchase?"
        }]).then(function(answer){
            var correct = false;
            for(var i=0; i<res.length; i++){
                if(res[i].product_name==answer.choice){
                correct=true;
                var product=answer.choice;
                var id=i;
                inquirer.prompt({
                    type:"input",
                    name:"quantity",
                    message:"How many would you like to purchase?",
                    validate:function(value){
                        if(isNaN(value)===false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    if((res[id].stock_quantity-answer.quantity)>0){
                        connection.query("UPDATE bamazon_db.products SET stock_quantity='"+(res[id].stock_quantity-answer.quantity)+"'WHERE product_name='"+product+"'",function(err,res2){
                            console.log("Product purchased!");
                            makeTable()
                        })
                    } else{
                        console.log("Insufficient quantity!");
                        promptCustomer(res);
                    }
                })
             }
          }
          if(i==res.length && correct==false){
            console.log("Not a valid selection");
            promptCustomer(res);
          }
       })
    }
