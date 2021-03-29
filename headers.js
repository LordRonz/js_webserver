const headers= {
    'Content-Security-Policy': "default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
    'Expect-CT': "max-age=86400; enforce",
    'Referrer-Policy': "no-referrer",
    'Strict-Transport-Security': "max-age=31536000; includeSubDomains",
    'X-Content-Type-Options': 'nosniff',
    'X-DNS-Prefetch-Control': 'off',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-XSS-Protection': '1; mode=block',
}

module.exports = {
    headers,
}