const fs = require('fs');

function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                resolve(body);
            })
        }
        catch(err) {
            reject(err);
        }
    });
}

function getHeader(req, headerName) {
    return new Promise((resolve, reject) => {
        try {
            const header = req.headers[headerName];
            resolve(header);
        }
        catch(err) {
            reject(err);
        }
    });
}

module.exports = {
    getPostData,
    getHeader
};