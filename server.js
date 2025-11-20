const express = require('express');
const app = express();
const sql =  require('mssql');

//Allows users to to /(file they want to access) to access the file as long as it is in the public folder.
app.use(express.static('public'));

let config = {
    user: 'sa',
    password: '<EnterPasswordHere>',
    server: 'localhost',
    database: 'tacos',
    options: {
        encrypt: false, // true if using Azure, false for local Docker
    },
    port: 1433
};

sql.connect(config).then(() => {
    console.log('Connected to the database');
});

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

//Serves the test_application.html file when the root URL is accessed.
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/test_application.html');

    // Test SQL query to fetch all menu items
    sql.query`SELECT * FROM menuItems`
    .then(result => console.log(result))
    .catch(err => console.error('SQL error', err));
});

app.post('/server.js', (req, res) => {
    console.log(req.body); // Log the form data to the console
    res.end('Form submission received');
});

//Starts the server on port 3000.
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});