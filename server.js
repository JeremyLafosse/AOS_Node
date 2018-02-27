var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var http = require('http');
//const fileUpload = require('express-fileupload');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();
var port = process.env.PORT || 8081;


app.use(function(request, result, next) {
    result.header("Access-Control-Allow-Origin", "http://localhost");
    result.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    result.header('Access-Control-Allow-Credentials', 'true');
    result.header('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE');
next();
});

// ORM bdd
const Sequelize = require('sequelize');
const sequelize = new Sequelize('AOS', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

router.route('/user')
    .post(function(req,res){
        sequelize.query('SELECT * FROM user WHERE token = "'+req.body.token+'" LIMIT 1;')       
        .then(result => {
                res.json(result[0][0]);
            });
    });



// Non fonctionnel pour le moment
router.route('/user/:userid/photos')
    .get(function(req, res) {
        sequelize.query('SELECT * FROM photos WHERE userid = "'+req.param.userid+'"',
            { type: sequelize.QueryTypes.SELECT})
            .then(result => {
                res.json(result);
            });
});


//Requêtes d'authentification 
router.route('/logout/:userid')
    .delete(function(request,result){
        sequelize.query('SELECT * from user WHERE user='+request.param.userid)
.then(function(){
                sequelize.query('UPDATE user SET token = NULL WHERE user='+request.param.userid);
       
        });
});

router.route('/login')
    .post(function(request,result){
        sequelize.query('SELECT * FROM user WHERE login = " '+request.body.name+' " AND password = " '+request.body.password+' " ')       
        .then(function(){
            var token = jwt.sign({login: request.body.name, password: request.body.password}, 'shhhh');    
                sequelize.query('UPDATE user SET token = "'+token+'" WHERE login ="'+request.body.name+'" AND password = "'+request.body.password+'"');
            result.json({ token: token });
        });
    });
    
router.route('/register')
    .put(function(request,result){
        sequelize.query('INSERT INTO user VALUES (,"","'+request.body.name+'", " '+request.body.password+' ")')       
        .then(result => {
            var token = jwt.sign({login: request.body.name, password: request.body.password}, 'shhhh');    
                sequelize.query('UPDATE user SET token = "'+token+'" WHERE login ="'+request.body.name+'" AND password = "'+request.body.password+'"');
            result.json({ token: token });
        });
    });
  
    
    // Requête à ajouter pour l'inscription mais manuelle pour l'instant : router.route('/signup')
    
    
    // Non fonctionnel pour le moment
    //router.route('/user/:userid/photos/:photoid')
    //.delete(function(req, res) {
    //    sequelize.query("DELETE * FROM photo WHERE photoid = "+req.params.photoid+" AND userid = "+req.params.userid",
    //        { type: sequelize.QueryTypes.SELECT});
//});

app.use('', router);
var server = app.listen(port);