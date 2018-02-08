var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var formidable = require('formidable'); 
var http = require('http');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();
var port = process.env.PORT || 8081;


var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
  res.write('<input type="file" name="filetoupload"><br>');
  res.write('<input type="submit">');
  res.write('</form>');
  return res.end();
}).listen(8080); 


app.use(function(request, result, next) {
    result.header("Access-Control-Allow-Origin", "http://localhost");
    result.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    result.header('Access-Control-Allow-Credentials', 'true');
    result.header('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE')
next();
});

// ORM bdd
const Sequelize = require('sequelize');
const sequelize = new Sequelize('AOS', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

router.route('/user/:idUser/photos')
    .get(function(req, res) {
        sequelize.query('SELECT * FROM pictures WHERE id IN (SELECT idTopic FROM topicuser WHERE idUser ='+req.params.idUser+')',
            { type: sequelize.QueryTypes.SELECT})
            .then(result => {
                res.json(result);
            });
});


//Requêtes d'authentification 
router.route('/logout')
    .post(function(request,result){
        db.User.findOne({
            where: {token: request.body.token}
        }).then(function(){
            db.User.update({
                token: ''
            }, { where: {token: request.body.token}
            });
            result.json({ token: '' });
        });
});

router.route('/login')
    .post(function(request,result){
        db.User.findOne({
            where: {login: request.body.login, password: request.body.password},
        }).then(function(){
            var token = jwt.sign({login: request.body.login, password: request.body.password}, 'shhhh');
                db.User.update({
                token: token
            }, { where: {login: request.body.login, password: request.body.password}
            });
            result.json({ token: token });
        });

    });