//Import necessary modules.
const express = require('express');
const app = express();
const sql =  require('mssql');

//Middleware to parse URL-encoded bodies with specific options.
app.use(
    express.urlencoded({
        extended: true,
        inflate: true,
        limit: "1mb",
        parameterLimit: 5000,
        type: "application/x-www-form-urlencoded",
    })
);

//Allows users to access resources in the public folder. 
app.use(
    express.static('public'),
);

//Database configuration settings.
let config = {
    user: 'sa',
    password: '<noThe4Most>',
    server: 'localhost',
    database: 'tacos',
    options: {
        encrypt: false, 
    },
    port: 1433
};

sql.connect(config).then(() => {
    console.log('Connected to the database');
});

//Serves the test_application.html file when the root URL is accessed.
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/test_application.html');
});

//Handles POST requests to the /filter endpoint.
app.post('/insert', (req, res) => {
    console.log("server recieved: ",req.body); 

    const request = new sql.Request();
    request.input('id', sql.Int, req.body["item-code"]);
    request.input('name', sql.VarChar, req.body["item-name"]);
    request.input('price', sql.Int, req.body["item-price"]);

    //create new menu item entry
    request.query(`
        SET XACT_ABORT ON;

        SET IDENTITY_INSERT menuItems ON;
        insert into menuItems (item_id, item_name, item_price, vegan) 
        values (
            @id, 
            @name, 
            @price,
            0
        );

        SET IDENTITY_INSERT menuItems OFF;
        
        insert into Recipe (item_id, ingredient_id, amount)
        values (@id, 1, 20);
    `)
    .then(result => {
        console.log("result of menueItems insert: ", result)
            res.json({
                message: 'Item added successfully!',
                sentData: req.body
            })
    })
    .catch(err => {
        console.error('SQL error', err)
        res.json({
            message: 'Error adding item: \n' + err.message,
            sentData: req.body,
            errorCode: err.number,
        })
    });
});

//Starts  server on port 3000.
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});