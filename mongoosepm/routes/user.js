
/*
 * GET users listing.
 */
exports.list = function(req, res){
  res.send("respond with a resource");
};

/*	********
	REQUIERE
	********	*/
var fs=require("fs");
var userSchema = require('../model/userSchema');
var crypto = require("crypto");
	
	
/*	*********
	FONCTIONS
	*********	*/
/*	Fonction qui regarderait si on est connecté aavant de choisir le layout	*/	
function isLogged() {
	if(req.session.loggedIn === true) {res.render('connected', data);}		//S'il est loggé on rend connected
	else {res.render('default', data);}										//S'il est pas loggé on rend default
};
	
	
/*	***************
	CREER UN COMPTE
	***************	*/

/*	Accès au Formulaire	*/
exports.identite_formulaire = function(req, res){	// Génération du formulaire
	res.render('identite_formulaire', function(err,html){
		var data={
		title: 'Mon Profil',
		body: html
		};
		{res.render('default', data);}
	});
};

/*	Créer un utilisateur	*/
exports.doCreateUser = function(req,res){	// fonction de traitement du formulaire d'inscription
	console.log("TEST " + req.body.mail);
	console.log("TEST " + req.files.thumbnail.path);
	userSchema.User.create({ 				// Création d'un nouvel utilisateur (récupère données et les enregistre)
		mail: req.body.mail,					// Récupération des différentes données
		password: req.body.password,
		userLastName: req.body.userLastName,	
		userFirstName: req.body.userFirstName,
		birthDate: req.body.birthDate,
		country: req.body.country,
		area: req.body.area,
		town: req.body.town,
		phone: req.body.phone,
		competences: req.body.competences,
		interests: req.body.interests,
		sports: req.body.sports,
		leisures: req.body.leisures,
		otherInterests: req.body.otherInterests,
		profession: req.body.profession,
		studies: req.body.studies,
		diplomas: req.body.diplomas,
		otherProfession: req.body.otherProfession
	}, function(err, user){ 					// Sauvegarde de l'utilisateur et des données dans Inscrit
		console.log("TEST2 " + req.files.thumbnail.path);
		if(err){
			console.log(err);
			res.redirect('/identite_formulaire');	// Renvoie au formulaire
		}
		else{
			user.speak();						// méthode pour demander le prénom de l'utilisateur dans la fenêtre de commande
			console.log(user);
			req.session.user = user;			//Enregistre les informations sur l'utilisateur dans un coockie session
			req.session.loggedIn = true;		//Considère la session ouverte
			console.log("TEST3 " + req.files.thumbnail.path);
			fs.readFile(req.files.thumbnail.path, function(err, data){		//lit tout le contenu du fichier
				var imageName = req.files.thumbnail.name;		//recuperation du nom de l'image
				console.log("l'image uploade est " + imageName);
				if(!imageName){
					console.log("Il n'y a pas d'image");
				}
				else{
					var directory = './uploads/users/' + req.body.mail;
					var directoryExists = fs.existsSync(directory);
					if(!directoryExists) fs.mkdirSync(directory);		//creation du repertoire de l'utilisateur, pourra contenir tous ses uploads
					var newPath = './uploads/users/' + req.body.mail + '/' + req.body.mail + '.jpg';		//nvx chemin (pr l'instant ne gere pas les extensions)
					fs.writeFile(newPath,data,function(err){		//ecrit les data dans le fichier newPath
					console.log("L'enregistrement de l'image a fonctionne.");
					});	
				}
			});
			res.redirect('/identite_statique');	//Redirige directement vers la page
		}
		}
	);
};

/*	Accès à son compte	*/
exports.identite_statique = function(req, res) {
	console.log("une requete pour personne");
	res.render('identite_statique', {user: req.session.user}, function(err, html){	//Les données de user sont dans la session
		var data = {
				title: "Mon Profil",
				body: html
			};
			var data_connected = {
			title: "Mon Profil",
			body: html,
			user:req.session.user
			};
			if(req.session.loggedIn === true) {res.render('connected', data_connected);}		//S'il est loggé on rend connected
			else {res.render('default', data);}
		});
};

/*	******************
	MODIFIER UN COMPTE
	******************	*/
	
/*	Modifier un utilisateur	*/
exports.identite_modification = function(req, res){	// fonction de modification -> ne va pas être conservée, on se contentera de faire des updates un peu comme la page projet, à voir comment on mettra ça en oeuvre
};

/*	supprimer un utilisateur	*/
exports.identite_suppression = function(req, res){	// fonction de suppression du compte -> à relier au bouton supprimer mon compte de la page identite
};

/*	*********************
	RECHERCHE UTILISATEUR
	*********************	*/
	
/*	Rechercher un utilisateur à partir de son nom	*/
exports.doSearchUser = function(req, res) {
	console.log("Chercher un utilisateur avec le nom "+req.body.tag);
	if(req.body.tag) {
		userSchema.User.findByName(req.body.tag, function(err, userNom) {
			if(err){
				console.log(err);
				res.redirect('/search_user/?500');
			}else{
				console.log(userNom);
				if(userNom[0] != null){				
					req.users = userNom[0].id;	//On enregiste la liste d'utilisateurs pour l'envoyer dans le res.render 'recherche'
					res.redirect('/user/'+req.users);
				}else{
					res.redirect('/search_user/?404=user');
				}
			}
		});
	}else{
		res.redirect('/search_user');
	}
};

/*	Ouvrir une page à partir de l'id de l'utilisateur	*/
exports.user = function(req,res) {
	console.log("Cherche le projet_id : " + req.params.id);
	if(req.params.id) {		//si on a bien un id en paramêtre dans l'url
		userSchema.User.findById(req.params.id, function(err, userInfo) {	//On cherche le projet avec cet Id
			if(err){
				console.log(err);
				res.redirect('/user?404=user');
			}else{
				console.log(userInfo);
				res.render('identite_statique', {user: userInfo}, function(err,html){	//on renvoie la page projet
					var data={
						title: userInfo.userFirstName + " " + userInfo.userLastName,
						body: html
					};
					var data_connected = {
						title: userInfo.userFirstName + " " + userInfo.userLastName,
						body: html,
						user:req.session.user
					};
					if(req.session.loggedIn === true) {
						res.render('connected', data_connected);	//S'il est loggé on rend connected
					}else{
						res.render('default', data);
					}
				});
			}
		});
	}else{			//Si on a pas d'id en paramêtre
		res.redirect('/');	//on renvoie la page d'accueil
	}
};
/* ******************************* 
   SUPPRIMER TOUS LES UTILISATEURS
   ******************************* */

/* Fonction pour effacer la bdd contenant les utilisateurs */
exports.doDeleteAllUsers = function(req, res){
	userSchema.User.find({}, function(err, gens){
		console.log(gens);
		userSchema.User.remove({}, function(err){
			if(err) return console.error(err);
			console.log("base de donnees utilisateurs effacee");
			userSchema.User.find({}, function(err, insc){
				if(err) return console.error(err);
				console.log(insc);
				setTimeout(function(){res.redirect('index_default');},1000);
			});
		});
	});
};
