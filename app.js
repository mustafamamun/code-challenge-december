/*jslint node: true */
'use strict';
var SwaggerExpress = require('swagger-express-mw'),
    express = require('express'),
    app = express(),
    cors = require('cors'),
    config = {
        appRoot: __dirname // required config
    },
    httpStatus = require('http-status'), // to translate http status codes to text
    yaml = require('js-yaml'), // yaml to json conversion
    fs = require('fs'),
    swaggerJson = yaml.safeLoad(fs.readFileSync(__dirname+'/api/swagger/swagger.yaml', 'utf-8'));
    // passport initialization

module.exports = app; // for testing

app.use(cors()); // enable CORS for Swagger UI's "try this" in our API documentation
app.get('/ui',function(req,res){
      res.sendFile(__dirname + '/index.html');
});
app.use('/css', express.static(__dirname + '/css'));
app.use('/logo.png', express.static(__dirname + '/logo.png'));
SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) {
        throw err;
    }

    // serve the swagger.json to swagger ui
    app.get("/docs/swagger", function(req, res){
        res.send(swaggerJson); //return swagger json
    });

    // serve the swagger ui itself (our API documentation)
    app.use('/docs', express.static(__dirname + '/swagger-ui'));
    swaggerExpress.register(app);
    // error handler to emit errors as a json string
    var port = 10010;
    app.listen(port);
});
