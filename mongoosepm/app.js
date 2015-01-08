
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
var theme = require('./server/routes/theme');
var competence = require('./server/routes/competence');
var mail = require('./server/routes/mail');
var upload = require('./server/routes/upload');
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
app.use(multipart({uploadDir: './uploads/tmp'}));
app.use(bodyParser({
	keepExtensions: true,
	uploadDir: './uploads/tmp'
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
app.get('/', index.layout);

//Routes/Index.js

app.post('/doLogin', index.doLogin);	//On fait passer le mail et le password par l'authentification puis on se logg
app.post('/doLogout', index.doLogout);	// Action pour se déconnecter
//app.get('/search_project',index.search_project);
//app.get('/search_user',index.search_user);
//app.get('/search_project/:projectId',index.searchProject);



//Routes/project.js
app.get('/project/:id', project.oneProject);	//récupère un projet à partir de son id
app.get('/project', project.allProjects);		//Récupère tous les projets
app.post('/project', project.doCreateProject);
app.put('/project/:id', project.doUpdateProject);
app.get('/isMember/:userId/:projectId', project.isMember);
app.get('/delete_projects',project.doDeleteAllProjects);



//Routes/user.js
app.get('/user', user.allUsers);
app.post('/user', user.doCreateUser);
app.get('/user/:id', user.oneUser);
app.put('/user/:id', user.doUpdateUser);
app.get('/connected', user.currentUser);

//Mailbox
app.get('/mail/:userId', mail.allMails);
app.post('/mail/:userId', mail.sendMail);


//Upload
app.get('/uploadFile', upload.uploadFileGet);
app.post('/uploadFile', upload.uploadFilePost);

//Routes/themes.js
app.get('/theme', theme.allThemes);
app.post('/theme', theme.doSaveTheme);

//Routes/competence.js
app.get('/competence', competence.allCompetences);
app.post('/competence', competence.doSaveCompetence);

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
