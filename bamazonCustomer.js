var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'bamazon'
});
 
connection.connect();



var inquirer = require("inquirer");
var order = function() {
    inquirer.prompt([
        {
            name: "selection",
            message: "Please select a product ID"
        },
        {
            name: "quantity",
            message: "How many would you like to purchase?"
        }
    ]).then(function(answer) {
        var chosenID = answer.selection;
        var chosenQuantity = answer.quantity
        console.log(chosenID);
        console.log(chosenQuantity);
        chooseProduct(chosenID, chosenQuantity);
    })
}

var listProducts = function() {
    connection.query("SELECT * FROM products", function (error, results, fields) {
        if (error) throw error;
        console.log("result ", results)
            order();
    });
}

var chooseProduct = function(chosenID, chosenQuantity) {
    connection.query("SELECT * FROM products WHERE item_id = ?", [chosenID], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        var currentStock = results[0].stock_quantity
        if (currentStock < chosenQuantity) {
            console.log("Insufficient Quantity!")
        }
        else {
            updateProduct(chosenID, chosenQuantity, currentStock);
        }
        connection.end();
    });
}


var updateProduct = function(chosenID, chosenQuantity, currentStock) {
    newStock = (currentStock - chosenQuantity)
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newStock, chosenID], function (error, results, fields) {
        if (error) throw error;
        console.log("Order: " + chosenQuantity);
        console.log("New Stock: " + newStock);
    })
}


listProducts();

