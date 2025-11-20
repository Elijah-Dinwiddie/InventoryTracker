const express = require('express');
const app = express();

//Allows users to to /(file they want to access) to access the file as long as it is in the public folder.
app.use(express.static('public'));

//Serves the test_application.html file when the root URL is accessed.
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/test_application.html');
});

//Starts the server on port 3000.
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});