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

        /* for each result, console.log in the following format */
        results.forEach(function(results) {
            console.log("\n");
            console.log("Product: " + results.product_name);
            console.log("ID: " + results.item_id);
            console.log("Price: $" + results.price);
            console.log("# In Stock: " + results.stock_quantity);
            console.log("Department: " + results.department_name);
        })
            console.log("\n");
            /* execute the order form */
            order();
    });
}


/* EXECUTES INQUIRER AND STORES THE RESULTS */
var inquirer = require("inquirer");
var order = function() {
    inquirer.prompt([
        {
            name: "selection",
            message: "Please select a product ID: "
        },
        {
            name: "quantity",
            message: "How many would you like to purchase? "
        }
    ]).then(function(answer) {
        /* define variables for later use */
        var chosenID = answer.selection;
        var chosenQuantity = answer.quantity

        /* execute product selection */
        chooseProduct(chosenID, chosenQuantity);
    })
}


/* QUERY THE DATABASE FOR THE SELECTED ORDER, DEFINE VARIABLES, ATTEMPT TO UPDATE */
var chooseProduct = function(chosenID, chosenQuantity) {

    /* retrieves database entry with selected ID */
    connection.query("SELECT * FROM products WHERE item_id = ?", [chosenID], function (error, results, fields) {
        if (error) throw error;

        /* define variables for results */
        var productName = results [0].product_name;
        var currentStock = results[0].stock_quantity;
        var price = results[0].price;
        var cost = price * chosenQuantity;
        
        /* alert if insufficient stock, else update product information */
        if (currentStock < chosenQuantity) {
            console.log("Insufficient Quantity!");
            orderAgain();
        }
        else {
            updateProduct(chosenID, chosenQuantity, currentStock, productName, cost);
            orderAgain();
        }
    });
}

/* UPDATES THE DATABASE AND CONSOLE.LOGS THE ORDER TOTAL*/
var updateProduct = function(chosenID, chosenQuantity, currentStock, productName, cost) {
    
    newStock = (currentStock - chosenQuantity)

    /* updates the database entry stock_quantity */
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newStock, chosenID], function (error, results, fields) {
        if (error) throw error;

        /* order details and new stock console.logs */
        console.log("\n");
        console.log("    Order Confirmed   ")
        console.log("----------------------")
        console.log("Product: " + productName);
        console.log("Quantity: " + chosenQuantity);
        console.log("Cost: $" + cost);
        console.log("Remaining Stock: " + newStock);
        console.log("----------------------")
        console.log("\n");
        console.log("Place another order? (Y/n)");
    })
}

/* ASKS THE USER TO ORDER AGAIN */
var orderAgain = function() {
    inquirer.prompt([
        {
            name: "order",
            type: "confirm",
            message: " ",
        },
    ]).then(function(answer) {
        /* if they select yes, execute order, else end the connection */
        if (answer.order) {
            console.log("\n");
            order();
        }
        else {
            connection.end();
        }
    })
}

listProducts();

