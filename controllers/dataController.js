const Data = require('../models/dataModel');
const { ObjectId } = require('mongodb');
const { getPostData } = require('../utils');
const { verifyToken } = require('./verifyToken');
const { headers } = require('../headers');

async function getAllData(req, res, page) {
    await verifyToken(req, res);
    if(!req.user) return;
    try {
        const data = await Data.findAll(page);
        res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
        res.write(JSON.stringify(data));
        res.end();
    } catch(error) {
        console.log(error);
        res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

async function getData(req, res, id) {
    await verifyToken(req, res);
    if(!req.user) return;
    try {
        const data = await Data.findById(id);
        if(!data) {
            res.writeHead(404, { ...headers, 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Data Not Found' }));
            res.end();
        }
        else {
            res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
            res.write(JSON.stringify(data));
            res.end();
        }
    } catch(error) {
        console.log(error);
        res.writeHead(404, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Data Not Found" }));
    }
}

async function createData(req, res) {
    await verifyToken(req, res);
    if(!req.user) return;
    try {
        const body = await getPostData(req);
        const data = JSON.parse(body);
        const newData = await Data.create(data);
        res.writeHead(201, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(newData));
    } catch(error) {
        console.log(error);
        res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

async function updateData(req, res, id) {
    await verifyToken(req, res);
    if(!req.user) return;
    try {
        const body = await getPostData(req);
        const filter = { _id: ObjectId(id) };
        const updateDoc = JSON.parse(body);
        const updData = await Data.update(filter, updateDoc);
        
        if(!updData) {
            res.writeHead(404, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Data not Found" }));
        }

        res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(updData));
    } catch(error) {
        console.log(error);
        res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

async function deleteData(req, res, id) {
    await verifyToken(req, res);
    if(!req.user) return;
    try {
        const query = { _id: ObjectId(id) };
        const result = await Data.del(query);
        if(result.deletedCount === 1) {
            res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ ...result, message: 'Successful' }));
            res.end();
        }
        else {
            res.writeHead(404, { ...headers, 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Data Not Found' }));
            res.end();
        }
    } catch(error) {
        console.log(error);
        res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

module.exports = {
    getAllData,
    getData,
    createData,
    updateData,
    deleteData,
};