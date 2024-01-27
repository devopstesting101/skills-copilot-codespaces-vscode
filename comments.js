// Create web server
function createServer() {
    // create web server
    const express = require('express');
    const app = express();
    const fs = require('fs');

    // create server
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    // listen to port 3000
    server.listen(3000);

    // set up static files
    app.use(express.static('public'));

    // read the data.json file
    let data = fs.readFileSync('data.json');
    let comments = JSON.parse(data);

    // listen to connection event
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.emit('all comments', comments);

        // listen to new comment event
        socket.on('new comment', (newComment) => {
            console.log('new comment: ' + newComment);
            comments.push(newComment);
            let newData = JSON.stringify(comments);
            fs.writeFileSync('data.json', newData); // write the updated comments back to the file
        });
    });
}

createServer(); // call the function to create and setup the server