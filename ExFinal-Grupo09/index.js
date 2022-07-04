const mysql = require('mysql2');
const fs = require("fs");
const path = require("path");
const moment = require('moment');
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
    if(req.body != undefined){
        let CustomerIDStr = req.body.CustomerID;
        let EmployeeIDStr =  req.body.EmployeeID;
        let OrderDateStr = req.body.OrderDate;
        let RequiredDateStr = req.body.RequiredDate;
        let ShippedDateStr = req.body.ShippedDate;
        let ShipViaStr = req.body.ShipVia;
        let FreightStr = req.body.Freight;
        let ShipNameStr = req.body.ShipName;
        let ShipAddressStr = req.body.ShipAddress;
        let ShipCityStr = req.body.ShipCity;
        let ShipRegionStr = req.body.ShipRegion;
        let ShipPostalCodeStr = req.body.ShipPostalCode;
        let ShipCountryStr = req.body.ShipCountry;
        console.log(CustomerIDStr)
        console.log(EmployeeIDStr)
        console.log(OrderDateStr)
        console.log(RequiredDateStr)
        console.log(ShippedDateStr)
        console.log(ShipViaStr)
        console.log(FreightStr)
        console.log(ShipNameStr)
        console.log(ShipAddressStr)
        console.log(ShipCityStr)
        console.log(ShipRegionStr)
        console.log(ShipPostalCodeStr)
        console.log(ShipCountryStr)


        if(CustomerIDStr != undefined || EmployeeIDStr != undefined || OrderDateStr != undefined || RequiredDateStr != undefined || ShippedDateStr != undefined
            || ShipViaStr != undefined || FreightStr != undefined || ShipNameStr != undefined || ShipAddressStr != undefined || ShipCityStr != undefined ||
            ShipRegionStr != undefined || ShipPostalCodeStr != undefined || ShipCountryStr != undefined){
 
            let insertValues = {
                CustomerID: CustomerIDStr,
                EmployeeID: EmployeeIDStr,
                OrderDate: OrderDateStr,
                RequiredDate: RequiredDateStr,
                ShippedDate: ShippedDateStr,
                ShipVia: ShipViaStr,
                Freight: FreightStr,
                ShipName: ShipNameStr,
                ShipAddress: ShipAddressStr,
                ShipCity: ShipCityStr,
                ShipRegion: ShipRegionStr,
                ShipPostalCode: ShipPostalCodeStr,
                ShipCountry: ShipCountryStr
            }        
 
            await promisePool.query("INSERT INTO orders SET ? ", insertValues);

            //console.log(moment(OrderDateStr).format('YYYY-MM-DD HH:mm:ss'));
            //OrderDateStr = moment(OrderDateStr).format('YYYY-MM-DD HH:mm:ss');
            //RequiredDateStr = moment(RequiredDateStr).format('YYYY-MM-DD HH:mm:ss');
            //ShippedDateStr = moment(ShippedDateStr).format('YYYY-MM-DD HH:mm:ss');

            [row2,fields2] = await promisePool.query("SELECT orders.OrderID FROM orders WHERE CustomerID= '"+CustomerIDStr+"' AND EmployeeID= '"+EmployeeIDStr+"' AND OrderDate= '"+OrderDateStr+"' AND RequiredDate= '"+RequiredDateStr+"' AND ShippedDate= '"+ShippedDateStr+"' AND ShipVia= '"+ShipViaStr+"' AND Freight= '"+FreightStr+"' AND ShipName= '"+ShipNameStr+"' AND ShipAddress=  '"+ShipAddressStr+"' AND ShipCity = '"+ShipCityStr+"' AND ShipRegion = '"+ShipRegionStr+"' AND ShipPostalCode= '"+ShipPostalCodeStr+"' AND ShipCountry= '"+ShipCountryStr+"'");
            
            context.res = {
                body:{
                    result: 'success',
                    data: row2
                },
                headers:{'Content-Type':'application/json'}
            }
       
        }else{
            context.res = {
                body:{
                    result: 'error',
                    message: "parámetros incorrectos"
                },
                headers:{'Content-Type':'application/json'}
            }
        }
 
 
    }else{
 
    let orderIDStr = req.query.OrderID;
    console.log(orderIDStr);
    let orderID;
    let row;
    if(orderIDStr == undefined){
        [row,fields] = await promisePool.query("SELECT customers.CompanyName,employees.FirstName,employees.LastName,orders.OrderDate,orders.RequiredDate,orders.ShippedDate,shippers.CompanyName,orders.Freight,orders.ShipName,orders.ShipAddress,orders.ShipCity,orders.ShipRegion,orders.ShipPostalCode,orders.ShipCountry FROM orders INNER JOIN employees ON (orders.EmployeeID = employees.EmployeeID)INNER JOIN customers ON ( orders.CustomerID = customers.CustomerID)INNER JOIN shippers ON ( shippers.ShipperID = orders.ShipVia)");
        context.statusCode = 200;
        context.res = {
            body:{
                result: 'success',
                data: row
            },
            headers:{'Content-Type':'application/json'}
        }
    }else{
        try{
            orderID = parseInt(orderIDStr);
            [row1,fields1] = await promisePool.query("SELECT customers.CompanyName,employees.FirstName,employees.LastName,orders.OrderDate,orders.RequiredDate,orders.ShippedDate,shippers.CompanyName,orders.Freight,orders.ShipName,orders.ShipAddress,orders.ShipCity,orders.ShipRegion,orders.ShipPostalCode,orders.ShipCountry FROM orders INNER JOIN employees ON (orders.EmployeeID = employees.EmployeeID)INNER JOIN customers ON ( orders.CustomerID = customers.CustomerID)INNER JOIN shippers ON ( shippers.ShipperID = orders.ShipVia) WHERE OrderID = "+orderID);
           
            if(row1.length == 0){
                context.statusCode = 400;
                context.res = {
                    body:{
                        result: 'error',
                        message:"parámetros incorrectos"
                    },
                    headers:{'Content-Type':'application/json'}
                }
            }
            else{
                context.statusCode = 200;
                context.res = {
                    body:{
                        result: 'success',
                        data: row1
                    },
                    headers:{'Content-Type':'application/json'}
                }
            }  
 
        }catch(error){
            context.statusCode = 400;
            context.res = {
                body:{
                    result: 'error',
                    message: "parámetros incorrectos"
                },
                headers:{'Content-Type':'application/json'}
            }
        }
 
       
   
    }
 
    }
}
