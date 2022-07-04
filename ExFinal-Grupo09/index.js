const mysql = require('mysql2');
const fs = require("fs");
const path = require("path");
const certificadoUri = path.resolve(__dirname,"DigiCertGlobalRootCA.crt.pem");
const certificado = [fs.readFileSync(certificadoUri,"utf8")];
const pool = mysql.createPool({
    host: "examentgtics20221.mysql.database.azure.com",
    user: "Grupo9",
    password: "09Gt1cs!",
    database: "northwind2",
    port: 3306,
    ssl:{
        rejectUnauthorized: true,
        ca: certificado
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
            context.res = {
                body:{
                    result: 'failure',
                    message: "El OrderID tiene que ser un dato numerico"
                },
                headers:{'Content-Type':'application/json'}
            }

        }else{
            orderID = orderIDStr;
            [row1,fields1] = await promise.query("SELECT customers.CompanyName,employees.FirstName,employees.LastName,orders.OrderDate,orders.RequiredDate,orders.ShippedDate,shippers.CompanyName,orders.Freight,orders.ShipName,orders.ShipAddress,orders.ShipCity,orders.ShipRegion,orders.ShipPostalCode,orders.ShipCountry FROM ordersINNER JOIN employees ON (orders.EmployeeID = employees.EmployeeID)INNER JOIN customers ON ( orders.CustomerID = customers.CustomerID)INNER JOIN shippers ON ( shippers.ShipperID = orders.ShipVia) WHERE OrderID = "+orderID);
            if(length(row1) == 0){
                context.res = {
                    body:{
                        result: 'failure',
                        message: "No existe la Orden"
                    },
                    headers:{'Content-Type':'application/json'}
                }
            }
            else{
                context.res = {
                    body:{
                        result: 'success',
                        data:row1
                    },
                    headers:{'Content-Type':'application/json'}
                }
            }   
        }
         
    }


}