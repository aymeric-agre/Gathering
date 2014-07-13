
/**
 * Module dependencies.
 */

var express = require('express');
var db = require('./model/db'); // regroupe la connection à la bdd et les modèles
var routes = require('./routes');
var index = require('./routes/index');
var user = require('./routes/user');
var project = require('./routes/project');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));	//Les views sont dans le dossier views
app.set('model', path.join(__dirname, 'model'));
app.engine('.html', require('ejs').__express);	//transforme les html en ejs
app.set('view engine', 'html');	//le moteur de visualisation est en html
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.bodyParser({
	keepExtensions: true,
	uploadDir: './uploads'
})); // permet de récupérer des infos dans le body (formulaire)
app.use(app.router);
app.use('/model',express.static(path.join( __dirname, 'model' )));
app.use('/public',express.static(path.join( __dirname, 'public' )));
app.use('/uploads',express.static(path.join( __dirname, 'uploads' )));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Routes/Index.js
app.get('/', index.index);
app.get('/index', index.index);	
app.get('/index_connected',index.index_connected);
app.get('/index_default', index.index_default);
app.post('/doLogin', index.doLogin);			//Action de se connecter
app.get('/doLogout', index.doLogout);	// Action pour se déconnecter
app.get('/search_project', index.search_project);
app.get('/search_user',index.search_user);
app.get('/search_project/:projectId',index.searchProject);



//Routes/project.js
app.get('/project/:id', project.project);	//Ouvrir un de ses projets à partir de son id
app.get('/projects_liste',project.projects_liste);
app.get('/project_gatherer',project.project_gatherer);
app.get('/project_gathering',project.project_gathering);
app.get('/project/byuser/:userid',project.byUser);	//project créé par un utilisateur (/:userid permet d'être utilisé avec req.params)
app.post('/projects_liste', project.doCreateProject);
app.post('/doSearchProject',project.doSearchProject);
app.get('/project/byId/:projectId', project.byProjectId);	//Afficher les projets par Id dans une liste
app.get('/delete_projects',project.doDeleteAllProjects);



//Routes/user.js
app.get('/identite_statique',user.identite_statique);
app.get('/identite_formulaire',user.identite_formulaire);
app.post('/traitement_formulaire', user.doCreateUser);	//Action de se créer un compte
app.get('/user/:id', user.user);
app.post('/doSearchUser',user.doSearchUser);
app.get('/delete_users',user.doDeleteAllUsers);


/*	**********
	SOCKET.IO
	**********	*/

var server = http.createServer(app).listen(app.get('port'),  //Initialise la variable server à la création du serveur
	function(){
		console.log("Express server listening on port " + app.get('port'));
	});

//require('./routes/sockets.js').initialize(server);  			//Permet à la variable Initialize de socket de s'initialiser avec ce serveur 