const https = require('https');
// Connect to mongodb atlas
require('./database/mongooseutil');
const fs = require('fs');
const {
    getAllData,
    getData,
    createData,
    updateData,
    deleteData,
} = require('./controllers/dataController');
const {
    createUser,
    loginUser,
    changePass,
    deleteUser,
} = require('./controllers/userController');
const { checkId } = require('./utils');

const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
};

const server = https.createServer(options, (req, res) => {
    req.url = encodeURI(req.url);
    console.log(`${req.method} ${req.httpVersion} ${req.url}`);

    // handle timeout
    res.setTimeout(16969, () => {
        res.writeHead(408, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '408 Request Timeout' }));
    });

    // URI too long
    if (req.url.length > 50) {
        res.writeHead(414, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '414 URI Too Long' }));
        return;
    }

    if (req.url === '/api/data' && req.method === 'GET') {
        getAllData(req, res);
    } else if (
        req.url.match(/\/api\/data\/([a-fA-F0-9]+$)/)
    && req.method === 'GET'
    ) {
        const id = req.url.split('/')[3];
        if (!checkId(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid ID' }));
        } else {
            getData(req, res, id);
        }
    } else if (
        req.url.match(/\/api\/data\/page\/([0-9]+$)/)
    && req.method === 'GET'
    ) {
        const page = parseInt(req.url.split('/')[4], 10);
        getAllData(req, res, page);
    } else if (req.url === '/api/data' && req.method === 'POST') {
        createData(req, res);
    } else if (
        req.url.match(/\/api\/data\/([a-fA-F0-9]+$)/)
    && (req.method === 'PUT' || req.method === 'PATCH')
    ) {
        const id = req.url.split('/')[3];
        if (!checkId(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid ID' }));
        } else {
            updateData(req, res, id);
        }
    } else if (
        req.url.match(/\/api\/data\/([a-fA-F0-9]+$)/)
    && req.method === 'DELETE'
    ) {
        const id = req.url.split('/')[3];
        if (!checkId(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid ID' }));
        } else {
            deleteData(req, res, id);
        }
    } else if (req.url === '/api/user/register' && req.method === 'POST') {
        createUser(req, res);
    } else if (req.url === '/api/user/login' && req.method === 'POST') {
        loginUser(req, res);
    } else if (req.url === '/api/user' && req.method === 'PATCH') {
        changePass(req, res);
    } else if (req.url === '/api/user' && req.method === 'DELETE') {
        deleteUser(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route Not Found' }));
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, (e) => {
    if (e) {
        console.log(e);
    }
    console.log(`server running on port ${PORT}`);
    console.log(`PID: ${process.pid}`);
});

const handleExit = (signal) => {
    console.log(`Received ${signal}. Close my server properly.`);
    server.close((e) => {
        if (e) console.log(e);
        process.exit(0);
    });
};

process
    .on('SIGINT', handleExit)
    .on('SIGQUIT', handleExit)
    .on('SIGTERM', handleExit)
    .on('unhandledRejection', (e) => {
        throw e;
    });
