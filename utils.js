"use strict";

function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', () => {
                resolve(body);
            })
        } catch(err) {
            reject(err);
        }
    });
};

function getHeader(req, headerName) {
    return new Promise((resolve, reject) => {
        try {
            const header = req.headers[headerName];
            resolve(header);
        } catch(err) {
            reject(err);
        }
    });
};

function sanitize(v) {
    if (v instanceof Object) {
        for (var key in v) {
            if (/^\$/.test(key)) {
                delete v[key];
            } else {
                sanitize(v[key]);
            }
        }
    }
    return v;
};

const internals = {
    suspectRx: /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*\:/
};

function parse(text, ...args) {
    const firstOptions = typeof args[0] === 'object' && args[0];
    const reviver = args.length > 1 || !firstOptions ? args[0] : undefined;
    const options = (args.length > 1 && args[1]) || firstOptions || {};

    // Parse normally, allowing exceptions

    const obj = JSON.parse(text, reviver);

    // options.protoAction: 'error' (default) / 'remove' / 'ignore'

    if (options.protoAction === 'ignore') {
        return obj;
    }

    // Ignore null and non-objects

    if (!obj ||
        typeof obj !== 'object') {

        return obj;
    }

    // Check original string for potential exploit

    if (!text.match(internals.suspectRx)) {
        return obj;
    }

    // Scan result for proto keys

    scan(obj, options);

    return obj;
};

function scan(obj, options = {}) {

    let next = [obj];

    while (next.length) {
        const nodes = next;
        next = [];

        for (const node of nodes) {
            if (Object.prototype.hasOwnProperty.call(node, '__proto__')) {      // Avoid calling node.hasOwnProperty directly
                if (options.protoAction !== 'remove') {
                    throw new SyntaxError('Object contains forbidden prototype property');
                }

                delete node.__proto__;
            }

            for (const key in node) {
                const value = node[key];
                if (value &&
                    typeof value === 'object') {

                    next.push(node[key]);
                }
            }
        }
    }
};

function safeParse(text, reviver) {
    try {
        return parse(text, reviver);
    }
    catch (ignoreError) {
        return null;
    }
};

module.exports = {
    getPostData,
    getHeader,
    sanitize,
    parse,
    scan,
    safeParse,
};