
/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var timeout = require('connect-timeout');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var errorHandler = require('errorhandler');
var session = require('express-session');				//Permet de créer des sessions
var mongoStore = require('connect-mongo')(session);		//Permet de stocker des sessions dans la base de donnée MongoDB
var flash = require('connect-flash');
var passport = require('passport');						//Utile pour l'authentification
var LocalStrategy = require('passport-local').Strategy;	//Utile pour l'authentification
var methodOverride = require('method-override');
var logger = require('morgan');
var responseTime = require('response-time');
var favicon = require('serve-favicon');
var directory = require('serve-index');
var vhost = require('vhost');
var limit = require('raw-body');
var multipart = require('connect-multiparty');
var query = require('qs');
var staticCache = require('connect-static');
var bcrypt = require('bcryptjs');	//Permet de crypter les données

var db = require('./server/model/db'); // regroupe la connection à la bdd et les modèles
var routes = require('./server/routes');
var index = require('./server/routes/index');
var user = require('./server/routes/user');
var project = require('./server/routes/project');
var http = require('http');
var path = require('path');
var app = express();

var userSchema = require('./server/model/userSchema');

/*	***********
	ENVIRONMENT
	***********	*/


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/public/views'));	//Les views sont dans le dossier views
app.set('model', path.join(__dirname, '/server/model'));
app.engine('.html', require('ejs').__express);	//transforme les html en ejs
app.set('view engine', 'html');	//le moteur de visualisation est en html

//Middlewares
app.use(favicon(__dirname + '/public/assets/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());	//Permet de traiter les cookies
app.use(session({
	secret : 'Hello World',
	store : new mongoStore({db:'gathering'})
	}));
app.use(flash());
app.use(passport.initialize());		
app.use(passport.session());
app.use(bodyParser({
	keepExtensions: true,
	uploadDir: './uploads'
})); // permet de récupérer des infos dans le body (formulaire)
app.use('/server/model',express.static(path.join( __dirname, '/server/model' )));
app.use('/public',express.static(path.join( __dirname, 'public' )));
app.use('/uploads',express.static(path.join( __dirname, 'uploads' )));
app.use('/public/zxcvbn', express.static('node_modules/zxcvbn/zxcvbn'));


// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

/*	******
	ROUTES
	******	*/


//Routes/Index.js
//app.get('*', index.index);
app.get('/', index.layout);

app.post('/doLogin', index.doLogin);	//On fait passer le mail et le password par l'authentification puis on se logg
app.post('/doLogout', index.doLogout);	// Action pour se déconnecter
//app.get('/search_project',index.search_project);
//app.get('/search_user',index.search_user);
//app.get('/search_project/:projectId',index.searchProject);



//Routes/project.js
app.get('/project/:id', project.oneProject);	//récupère un projet à partir de son id
app.get('/project', project.allProjects);		//Récupère tous les projets
app.get('/project_gathering',project.project_gathering);
//app.get('/project/byuser/:userid',project.byUser);	//project créé par un utilisateur (/:userid permet d'être utilisé avec req.params)
app.post('/projects_liste', project.doCreateProject);
//app.post('/doSearchProject',project.doSearchProject);
app.get('/project/byId/:projectId', project.byProjectId);	//Afficher les projets par Id dans une liste
app.get('/delete_projects',project.doDeleteAllProjects);



//Routes/user.js
//app.get('/identite_statique',user.identite_statique);
//app.get('/identite_formulaire',user.identite_formulaire);
//app.post('/doCreateUser', user.doCreateUser);	//Action de se créer un compte
app.post('/user', user.doCreateUser);
app.get('/user/:id', user.oneUser);
app.get('/user', user.allUsers);
app.put('/user/:id', user.doUpdateUser);
app.get('/connected', user.currentUser);
//app.post('/doSearchUser',user.doSearchUser);



/*	Redirection automatique et Messages d'erreurs	*/
app.use(function(err, req, res, next) {	//message d'erreur qui utilise la fonction "next"
  console.error(err.stack);
  res.send(500, { message: err.message });
});



/*	******
	SERVER
	******	*/

var server = http.createServer(app).listen(app.get('port'),  //Initialise la variable server à la création du serveur
	function(){
		console.log("Express server listening on port " + app.get('port'));
	});
