const mysql = require('mysql2');
var fs = require('fs');
const path = require('path');


const pool = mysql.createPool({
    host:
    user:
    password:
    database: northwind,
    port: 3306,
    ssl:{
        rejectUnauthorized:
        ca:
    }
});

const promisePool = pool.promise();


module.exports = async function (context, req) {
    let orderIDStr = req.query.OrderID;
    let orderID;
    let row;
    if(orderID == undefined){
        [row,fields] = await promisePool.query("SELECT customers.CompanyName,employees.FirstName,employees.LastName,orders.OrderDate,orders.RequiredDate,orders.ShippedDate,shippers.CompanyName,orders.Freight,orders.ShipName,orders.ShipAddress,orders.ShipCity,orders.ShipRegion,orders.ShipPostalCode,orders.ShipCountry FROM ordersINNER JOIN employees ON (orders.EmployeeID = employees.EmployeeID)INNER JOIN customers ON ( orders.CustomerID = customers.CustomerID)INNER JOIN shippers ON ( shippers.ShipperID = orders.ShipVia)");
    }else{
        if (isNaN(orderIDStr)) {
            throw new Error('Unable to parse int');
        }
        
        orderID = orderIDStr;

        

    }


}