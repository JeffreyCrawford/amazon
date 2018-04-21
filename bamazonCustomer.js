/* INITIALIZE SQL CONNECTION */
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'bamazon'
});
 
connection.connect();



/* LIST ALL AVAILABLE PRODUCTS */
var listProducts = function() {
    connection.query("SELECT * FROM products", function (error, results, fields) {
        if (error) throw error;
        console.log("result ", results)
            order();
    });
}


/* EXECUTES INQUIRER AND STORES THE RESULTS */
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
        chooseProduct(chosenID, chosenQuantity);
    })
}


var chooseProduct = function(chosenID, chosenQuantity) {

    /* retrieves database entry with selected ID */
    connection.query("SELECT * FROM products WHERE item_id = ?", [chosenID], function (error, results, fields) {
        if (error) throw error;

        /* define variables for results */
        var productName = results [0].product_name;
        var currentStock = results[0].stock_quantity;
        var price = results[0].price;
        var cost = price * chosenQuantity;
        
        /* alert if insufficient stock, otherwise run updateProduct */
        if (currentStock < chosenQuantity) {
            console.log("Insufficient Quantity!");
        }
        else {
            updateProduct(chosenID, chosenQuantity, currentStock, productName, cost);
        }

        connection.end();
    });
}

/* UPDATES THE DATABASE AND CONSOLE.LOGS THE ORDER TOTAL*/
var updateProduct = function(chosenID, chosenQuantity, currentStock, productName, cost) {
    
    newStock = (currentStock - chosenQuantity)

    /* updates the database entry stock_quantity */
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newStock, chosenID], function (error, results, fields) {
        if (error) throw error;

        /* order details and new stock console.logs */
        console.log(productName);
        console.log("Order: " + chosenQuantity);
        console.log("Cost: $" + cost);
        console.log("New Stock: " + newStock);
    })
}


listProducts();

