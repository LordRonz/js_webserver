require('dotenv').config();
const https = require('https');
// Connect to mongodb atlas
const mongoose = require('./database/mongooseutil');
const { getAllData, getData, createData, updateData, deleteData } = require('./controllers/dataController');
const { createUser, loginUser } = require('./controllers/userController');
const fs = require('fs');

const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
}

const server = https.createServer(options, (req, res)=>{
    console.log(`${req.method} ${req.httpVersion} ${req.url}`);
    if(req.url === '/api/data' && req.method === 'GET') {
        getAllData(req, res);
    }
    else if(req.url.match(/\/api\/data\/([0-9]+)/) && req.method === 'GET') {
        const id = req.url.split('/')[3];
        getData(req, res, id);
    }
    else if(req.url.match(/\/api\/data\/page\/([0-9]+$)/) && req.method === 'GET') {
        const page = parseInt(req.url.split('/')[4]);
        getAllData(req, res, page);
    }
    else if(req.url === '/api/data' && req.method === 'POST') {
        createData(req, res);
    }
    else if(req.url.match(/\/api\/data\/([0-9]+)/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        updateData(req, res, id);
    }
    else if(req.url.match(/\/api\/data\/([0-9]+)/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        deleteData(req, res, id);
    }
    else if(req.url === '/api/user/register' && req.method === 'POST') {
        createUser(req, res);
    }
    else if(req.url === '/api/user/login' && req.method === 'POST') {
        loginUser(req, res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route Not Found' }));
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, (err) => {
    if(err) {
        console.log(err);
    }
    console.log(`server running on port ${PORT}`);
    console.log(`PID: ${process.pid}`);
});

function handleExit(signal) {
    console.log(`Received ${signal}. Close my server properly.`);
    server.close(function () {
        process.exit(0);
    });
}

process.on('SIGINT', handleExit);
process.on('SIGQUIT', handleExit);
process.on('SIGTERM', handleExit);