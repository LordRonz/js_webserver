const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
const { getHeader } = require('../utils');
const User = require('../models/userSchema');
const { headers } = require('../headers');
require('dotenv').config();

const verifyToken = async (req, res) => {
    try {
        const authHeader = await getHeader(req, 'authorization');
        if (!authHeader) {
            res.writeHead(401, {
                ...headers,
                'Content-Type': 'application/json',
            });
            return res.end(JSON.stringify({ message: 'Access Denied' }));
        }

        if (!authHeader.startsWith('Bearer ')) {
            res.writeHead(401, {
                ...headers,
                'Content-Type': 'application/json',
            });
            return res.end(JSON.stringify({ message: 'Use Bearer Token !' }));
        }

        const authToken = authHeader.split(' ')[1];

        if (!authToken) {
            res.writeHead(401, {
                ...headers,
                'Content-Type': 'application/json',
            });
            return res.end(JSON.stringify({ message: 'Access Denied' }));
        }
        try {
            const verified = jwt.verify(
                authToken,
                process.env.ACCESS_TOKEN_SECRET,
                { algorithms: ['HS512'] },
            );
            if (!(await User.findOne({ _id: ObjectId(verified._id) }))) {
                throw new Error('Invalid User');
            }
            req.user = verified;
            return verified;
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                res.writeHead(401, {
                    ...headers,
                    'Content-Type': 'application/json',
                });
                return res.end(JSON.stringify(e));
            }
            res.writeHead(400, {
                ...headers,
                'Content-Type': 'application/json',
            });
            return res.end(JSON.stringify({ message: 'Invalid Token' }));
        }
    } catch (e) {
        console.log(e);
        res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};

module.exports = {
    verifyToken,
};
