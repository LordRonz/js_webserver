"use strict";

const Users = require('../models/userModel');
const { getPostData, sanitize, safeParse } = require('../utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { headers } = require('../headers');
const crypto = require('crypto');
const { verifyToken } = require('./verifyToken');
const { ObjectId } = require('mongodb');
require('dotenv').config();

async function createUser(req, res) {
    try {
        const body = await getPostData(req);
        let user = sanitize(safeParse(body));
        if(!user.username || user.username.length === 0) {
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Invalid username!" }));
        }
        if(user.username > 255) {
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Username is too long!" }));
        }
        if(!user.password || user.password.length < 8 || user.password.length > 255) {
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            if(user.password) {
                return res.end(JSON.stringify({ message: "Password must be between 8-255 characters long" }));
            }
            return res.end(JSON.stringify({ message: "Invalid password!" }));
        }
        if(!user.username.match(/\w+$/)) {
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Username must contain only letters, numbers, and underscores" }));
        }
        const userExist = await Users.findUser(user.username);
        if(userExist) {
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Username Taken!" }));
        }
        const salt = bcrypt.genSalt(13);
        const shaPass = crypto.createHmac('sha256', process.env.SHA_SECRET_KEY).update(user.password).digest('hex');
        const hashedPass = await bcrypt.hash(shaPass, await salt);
        user = { ...user, password: hashedPass };
        const newUser = Users.create(user);
        res.writeHead(201, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(await newUser));
    } catch(error) {
        console.log(error);
        res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

async function loginUser(req, res) {
    try {
        const body = await getPostData(req);
        const parsed = sanitize(safeParse(body));
        const username = parsed.username;
        if(!username || !parsed.password) {
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Provide a username and password!' }));
        }
        const user = await Users.findUser(username);
        if(!user) {
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User Not Found' }));
        }
        const shaPass = crypto.createHmac('sha256', process.env.SHA_SECRET_KEY).update(parsed.password).digest('hex');
        const validPass = await bcrypt.compare(shaPass, user.password)
        if(!validPass) {
            res.writeHead(401, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Not Allowed' }));
        }

        const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS512', expiresIn: 60 * 20 });
        res.statusCode = 200;
        res.writeHead(200, { ...headers, 'Content-Type': 'application/json','Authorization': `Bearer ${token}` });
        res.write(JSON.stringify({ message: "Success", token: token }));
        return res.end();
    } catch(error) {
        console.log(error);
        res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

async function changePass(req, res) {
    await verifyToken(req, res);
    if(!req.user) return;
    try {
        const body = await getPostData(req);
        const parsed = sanitize(safeParse(body));
        const oldPass = parsed.oldPassword;
        const newPass = parsed.newPassword;
        const username = parsed.username;
        if(!username || !newPass || !oldPass) {
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Provide username, oldPassword, and newPassword!' }));
        }
        const user = await Users.findUser(username);
        if(!user) {
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User Not Found' }));
        }
        const shaPass = crypto.createHmac('sha256', process.env.SHA_SECRET_KEY).update(oldPass).digest('hex');
        const validPass = await bcrypt.compare(shaPass, user.password)
        if(!validPass) {
            res.writeHead(401, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Not Allowed' }));
        }
        const salt = bcrypt.genSalt(13);
        const shaNewPass = crypto.createHmac('sha256', process.env.SHA_SECRET_KEY).update(newPass).digest('hex');
        const hashedNewPass = await bcrypt.hash(shaNewPass, await salt);
        user.password = hashedNewPass;
        const updatedUser = user.save();
        res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(await updatedUser));
    } catch(error) {
        console.log(error);
        res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

async function deleteUser(req, res) {
    await verifyToken(req, res);
    if(!req.user) return;
    try {
        const body = await getPostData(req);
        const parsed = sanitize(safeParse(body));
        const password = parsed.password;
        const username = parsed.username;
        if(!username || !password) {
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Provide username and password!' }));
        }
        const user = await Users.findUser(username);
        if(!user) {
            res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User Not Found' }));
        }
        const shaPass = crypto.createHmac('sha256', process.env.SHA_SECRET_KEY).update(password).digest('hex');
        const validPass = await bcrypt.compare(shaPass, user.password)
        if(!validPass) {
            res.writeHead(401, { ...headers, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Not Allowed' }));
        }
        const deletedUser = Users.del({ _id: ObjectId(user._id) });
        res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(await deletedUser));
    } catch(error) {
        console.log(error);
        res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

module.exports = {
    createUser,
    loginUser,
    changePass,
    deleteUser,
}