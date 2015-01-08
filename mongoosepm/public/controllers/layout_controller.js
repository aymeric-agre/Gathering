var gatheringModule = angular.module('gathering', ['ngResource', 'ngRoute', 'ui.router', 'ngAnimate', 'ui.bootstrap', 'ui.tinymce', 'project', 'user', 'auth', 'mail', 'noCAPTCHA', 'flow', 'ngSanitize', 'ui.select']);	// module upload retiré

/*	Appel des templates	*/
gatheringModule.config([ '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider','noCAPTCHAProvider', 'flowFactoryProvider', 'uiSelectConfig',
	function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, noCAPTCHAProvider, flowFactoryProvider, uiSelectConfig) {
	
	$locationProvider.html5Mode(true);	//Permet HTML5 PushState (l'appel de la dépendence permet d'éviter les problème quand on compile)
	uiSelectConfig.theme = 'bootstrap';	//Détermine le style de angular select -> Bootstrap ici
	
		/*	AUTHENTIFICATION	*/
	
	var connexion = connected;

	var main = {
		name : 'main',
		templateUrl : '/public/views/sidebar.html',
		controller : "mainController",
		data : {},
		resolve : {
				projects: function(allProjectsLoader){return allProjectsLoader();},	
				users: function(allUsersLoader){return allUsersLoader();},
				currentUser : function(Auth){return Auth.isConnected()}	//Permet de modifier les variables currentUser et connected dans le HTML
				}
	}
	
	var index = {
		name : 'main.index',
		url : '/',				
		templateUrl : '/public/views/index.html',
		controller :'indexController',
		parent : main
	}
		
	var user_form = {
		name : 'main.user_form',
		url : '/user_form/',
		templateUrl : '/public/views/user/user_form.html',
		controller :'userFormController',
		parent : main,
		resolve : {	themes : function(allThemesLoader){return allThemesLoader();},
					competences : function(allCompetencesLoader) {return allCompetencesLoader();}
					}
	}
		
	var search_user = {
		name : 'main.search_user',
		url : '/search_user/',
		templateUrl : '/public/views/user/search_user.html',
		controller: 'searchUserController',
		parent : main
	}
	
	var connectedUser = {
		name : 'main.connectedUser',
		url : '/connectedUser',
		templateUrl : '/public/views/user/connectedUser.html',
		controller : 'connectedUserController',
		parent : main,
		resolve : {	connectedUser : function(Auth){return Auth.isConnected()},
					mails : function(allMailsLoader) {return allMailsLoader();}}
		}
	
		var profile_connected = {
			name : 'main.connectedUser.profile',
			url : '/profile',
			templateUrl : '/public/views/user/user_profile.html',
			parent : connectedUser
			}
		
		var profile_edit = {
			name : 'main.connectedUser.edit',
			url : '/edit',
			templateUrl : '/public/views/user/user_edit.html',
			parent : connectedUser
		}	
		
		var projects_list_connected = {
			name : 'main.connectedUser.projects_list',
			url : '/projects_list',
			templateUrl : '/public/views/user/user_projectsList.html',
			parent : connectedUser
		}
		
		var mailbox = {
			name : 'main.connectedUser.mailbox',
			url : '/mailbox',
			templateUrl : '/public/views/user/user_mailbox.html',
			parent : connectedUser
		}
	
	var user = {
		name : 'main.user',
		url : '/user/:userId',
		templateUrl : '/public/views/user/user.html',
		controller : 'userController',
		parent : main,
		resolve : {	
					//On ne peut pas récupérer $stateParams depuis les services
				thisUser : ['User', '$stateParams', '$q',	function(User, $stateParams, $q) {	
						var delay = $q.defer();
						User.get({id: $stateParams.userId}, function(user) {	//On cherche l'utilisateur avec l'id de l'URL
							delay.resolve(user);		//On renvoie l'utilisateur
							console.log(user);
						}, function() {					//Sinon
							delay.reject('Cet utilisateur n\'est pas trouvé : ' + $stateParams.userId);	//On envoie une erreur
						});
						{return delay.promise;}	//A la fin on retourne le résultat
					}]
				}
			}
	
		var profile = {
			name : 'main.user.profile',
			url : '/profile',
			templateUrl : '/public/views/user/user_profile.html',
			parent : user
			}
		
		var projects_list = {
			name : 'main.user.projects_list',
			url : '/projects_list/',
			templateUrl : '/public/views/project/projects_list.html',
			parent : user
		}
	
	
	var project_form = {
			name : 'main.project_form',
			url : '/project_form/',
			templateUrl : '/public/views/project_form.html',
			controller: 'projectFormController',
			parent : main,
			resolve : {	themes : function(allThemesLoader){return allThemesLoader();},
						competences : function(allCompetencesLoader) {return allCompetencesLoader();}
					}
		}
	
	var search_project = {
		name : 'main.search_project',
		url : '/search_project/',
		templateUrl : '/public/views/project/search_project.html',
		controller: 'searchProjectController',
		parent : main
	}
	
	var connectedProject = {
		name : 'main.connectedProject',
		url : '/connectedProject/:projectId',
		templateUrl : '/public/views/project/connectedProject.html',
		controller : 'connectedProjectController',
		parent : main,
		resolve : {	
					thisProject : ['Project', '$stateParams', '$q',	function(Project, $stateParams, $q) {	
						var delay = $q.defer();
						Project.get({id: $stateParams.projectId}, function(project) {	
							delay.resolve(project);	
						}, function() {					
							delay.reject('Ce projet n\'est pas trouvé : ' + $stateParams.projectId);
						});
						{return delay.promise;}	
					}]
				}
	}
		var project_presentation_connected = {
			name : 'main.connectedProject.presentation',
			url : '/presentation',
			templateUrl : '/public/views/project/project_presentation.html',
			parent : connectedProject
		}
		
		var project_edit = {
			name : 'main.connectedProject.edit',
			url : '/edit',
			templateUrl : '/public/views/project/project_edit.html',
			parent : connectedProject
		}

	var project = {
		name : 'main.project',
		url : '/project/:projectId',
		templateUrl : '/public/views/project/project.html',
		controller : 'projectController',
		parent : main,
		resolve : {	
					thisProject : ['Project', '$stateParams', '$q',	function(Project, $stateParams, $q) {	
						var delay = $q.defer();
						Project.get({id: $stateParams.projectId}, function(project) {	
							delay.resolve(project);	
						}, function() {					
							delay.reject('Ce projet n\'est pas trouvé : ' + $stateParams.projectId);
						});
						{return delay.promise;}	
					}]
				}
	}
		var project_presentation = {
			name : 'main.project.presentation',
			url : '/presentation',
			templateUrl : '/public/views/project/project_presentation.html',
			parent : project
		}
	
	
$stateProvider.state(main)
	.state(index)
	.state(search_user)
	.state(search_project)
	
	.state(user_form)
	.state(connectedUser)
		.state(profile_connected)
		.state(profile_edit)
		.state(projects_list_connected)
		.state(mailbox)
	.state(user)
		.state(profile)
		.state(projects_list)
	
	.state(project_form)
	.state(connectedProject)
		.state(project_presentation_connected)
		.state(project_edit)
	.state(project)
		.state(project_presentation); 
	
	$urlRouterProvider.otherwise('/');	//Si on a une autre adresse on renvoie celle là
	 
	// Résouds des probèmes avec les slashs, le code viens de :  https://github.com/angular-ui/ui-router/issues/50
	$urlRouterProvider.rule(function($injector, $location) {
		if($location.protocol() === 'file')
		return;
		var path = $location.path() 
		var search = $location.search()	// Note: Retourne un query object et pas un search string
		var params;
		
		if (path[path.length - 1] === '/') {	// regarde si le chemin fini déjà par '/'
			return;
		}	

		if (Object.keys(search).length === 0) {	//S'il n'y a pas de paramêtre on retourne avec '/'
			return path + '/';
		}

		params = [];	
		angular.forEach(search, function(v, k){	// Sinon on construit un search string et on retour un préfix '/?' 
			params.push(k + '=' + v);
		});
		return path + '/?' + params.join('&');
	});

	//CAPTCHA
	
	//Google API public key
	noCAPTCHAProvider.setSiteKey('6LfU3fwSAAAAAOP1VsSlTtONqsoL1nXFNFmB_YFg');
	
	//options pour Recaptcha.create
	noCAPTCHAProvider.setTheme('light');
}]);
