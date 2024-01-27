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
        fs.writeFile('data.json', newData, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
        io.emit('all comments', comments);
    });

    // listen to delete comment event
    socket.on('delete comment', (id) => {
        console.log('delete comment: ' + id);
        comments.splice(id, 1);
        let newData = JSON.stringify(comments);
        fs.writeFile('data.json', newData, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
        io.emit('all comments', comments);
    });

    // listen to edit comment event
    socket.on('edit comment', (editComment) => {
        console.log('edit comment: ' + editComment);
        comments[editComment.id].comment = editComment.comment;
        let newData = JSON.stringify(comments);
        fs.writeFile('data.json', newData, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
        io.emit('all comments', comments);
    });

    // listen to disconnect event
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});