const { ObjectId } = require('mongoose').Types;

const getPostData = (req) =>
    new Promise((resolve, reject) => {
        try {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                resolve(body);
            });
        } catch (err) {
            reject(err);
        }
    });

const getHeader = (req, headerName) =>
    new Promise((resolve, reject) => {
        try {
            const header = req.headers[`${headerName}`];
            resolve(header);
        } catch (err) {
            reject(err);
        }
    });

const sanitize = (v) => {
    if (v instanceof Object) {
        Object.keys(v).forEach((key) => {
            if (/^\$/.test(key)) {
                delete v[`${key}`];
            } else {
                sanitize(v[`${key}`]);
            }
        });
    }
    return v;
};

const internals = {
    suspectRx: /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/,
};

const scan = (obj, options = {}) => {
    let next = [obj];

    while (next.length) {
        const nodes = next;
        next = [];
        for (let i = 0; i < nodes.length; ++i) {
            if (
                Object.prototype.hasOwnProperty.call(nodes[`${i}`], '__proto__')
            ) {
                // Avoid calling node.hasOwnProperty directly
                if (options.protoAction !== 'remove') {
                    throw new SyntaxError(
                        'Object contains forbidden prototype property',
                    );
                }

                delete nodes[`${i}`].__proto__;
            }
            if (nodes[`${i}`] instanceof Object) {
                for (const key in nodes[`${i}`]) {
                    if (
                        Object.prototype.isPrototypeOf.call(nodes[`${i}`], key)
                    ) {
                        const value = nodes[`${i}`][`${key}`];
                        if (value && typeof value === 'object') {
                            next.push(nodes[`${i}`][`${key}`]);
                        }
                    }
                }
            }
        }
    }
};

const parse = (text, ...args) => {
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

    if (!obj || typeof obj !== 'object') {
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

const safeParse = (text, reviver) => {
    try {
        return parse(text, reviver);
    } catch (ignoreError) {
        return null;
    }
};

const checkId = (id) => {
    try {
        ObjectId(id);
        return true;
    } catch (e) {
        return false;
    }
};

module.exports = {
    getPostData,
    getHeader,
    sanitize,
    parse,
    scan,
    safeParse,
    checkId,
};
