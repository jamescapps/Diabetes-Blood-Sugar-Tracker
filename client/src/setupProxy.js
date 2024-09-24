const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    // Enables api to be used on Heroku
    app.use(proxy(['/login', '/password', '/users', '/bloodsugar' ], { target: 'http://localhost:5000' }))
}