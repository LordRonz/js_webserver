"use strict";

const { getHeader } = require('../utils');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const { ObjectId } = require('mongodb');
const { headers } = require('../headers');
require('dotenv').config();

async function verifyToken(req, res) {
    try {
        const authHeader = await getHeader(req, 'authorization');
        if(!authHeader) {
            res.writeHead(401, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Access Denied" }));
        }

        if(!authHeader.startsWith('Bearer ')) {
            res.writeHead(401, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Use Bearer Token !" }));
        }

        const authToken = authHeader.split(" ")[1];

        if(!authToken) {
            res.writeHead(401, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Access Denied" }));
        }
        try {
            const verified = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, { algorithms: ['HS512'] });
            if(!await User.findOne({ _id: ObjectId(verified._id) })) {
                throw new Error("Invalid User");
            }
            req.user = verified;
        }
        catch(err) {
            if(err.name === 'TokenExpiredError') {
                res.writeHead(401, { ...headers, 'Content-Type': 'application/json' });
                return res.end(JSON.stringify(err));
            }
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Invalid Token" }));
        }
    }
    catch(err) {
        console.log(err);
        res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

module.exports = {
    verifyToken,
}