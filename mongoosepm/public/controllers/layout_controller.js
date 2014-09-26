var gatheringModule = angular.module('gathering', ['ngResource', 'ngRoute', 'ui.router', 'ngAnimate', 'ui.bootstrap', 'project', 'user', 'auth']);

/*	Appel des templates	*/
gatheringModule.config([ '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 
	function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
	
	$locationProvider.html5Mode(true);	//Permet HTML5 PushState (l'appel de la dépendence permet d'éviter les problème quand on compile)
	
		/*	AUTHENTIFICATION	*/
	
	var connexion = connected;


var main = {
	name : 'main',
	templateUrl : '/public/views/slidebar.html',
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
		templateUrl : '/public/views/user_form.html',
		controller :'userFormController',
		parent : main
	}
		
	var search_user = {
		name : 'main.search_user',
		url : '/search_user/',
		templateUrl : '/public/views/search_user.html',
		controller: 'searchUserController',
		parent : main
	}
	
	var search_project = {
		name : 'main.search_project',
		url : '/search_project/',
		templateUrl : '/public/views/search_project.html',
		controller: 'searchProjectController',
		parent : main
	}
		
	var profile = {
		name : 'main.profile',
		url : '/user/:userId',
		templateUrl : '/public/views/user.html',
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
			
			
			
			var projects_list = {
				name : 'main.profile.projects_list',
				url : '/projects_list/',
				templateUrl : '/public/views/projects_list.html',
				controller: 'projectsListController',
				parent : profile,
				resolve : {
					userProjects : function(){return 'userProjects';}
				}
			}
	
	var project_form = {
			name : 'main.project_form',
			url : '/project_form/',
			templateUrl : '/public/views/project_form.html',
			controller: 'projectFormController',
			parent : main
		}
	
	var project = {
		name : 'main.project',
		url : '/project/:projectId',
		templateUrl : '/public/views/project.html',
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
	
	


		
		
$stateProvider.state(main)
	.state(index)
	.state(user_form)
	.state(search_user)
	.state(search_project)
	.state(profile)
		.state(projects_list)
	.state(project)
	.state(project_form);
 
	 
	 
	
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

	


		/*	Intercepteur	*/
	/* $httpProvider.interceptors.push(function($q, $location) {	//On intercepte les appels AJAX pour vérifier s'il y a un souci d'authentification (401)
		return {
			'responseError': function(response) {
				if(response.status === 401 || response.status === 403) {
					$location.path('/login');
				}
				return $q.reject(response);
			}
		};
	}); */
			
		/* 	//	Ancien INTERCEPTEUR	
		$httpProvider.responseInterceptors.push(function($q, $location) {	//On intercepte les appels AJAX pour vérifier s'il y a un souci d'authentification (401)
			return function(promise) {
				return promise.then(
					function(response){return response;}, 	//Succès : on renvoie la reponse
					function(response) {					//Erreur : on vérifie le statut de l'erreur
						if (response.status === 401)		//Si c'est 401
							$location.url('/login');		//On renvoie à la page d'acceuil
						return $q.reject(response);			//On rejète la réponse	
					}
				);
			}
		}); */
			  		
}]);

/*	Tant que le module tourne on écoute les changement de state	*/
/* gatheringModule.run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {
	$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {	//Au moment de changer de state
		var requireLogin = $state.get(toParams).requireLogin;
		
		if(fromState.url === '^') {		//Si le chemin est relatif
			if(Auth.isLoggedIn() === requireLogin) {		//Si l'utilisateur est loggedIn
				$state.go('logged.index');	//On ouvre le state : connected.index
			} else {					//Sinon
				$rootScope.error = null;
				$state.go('public.index');	//On retourne à la page d'accueil
			}
		}
	});
}]); */

gatheringModule.controller('layoutController', ['$scope', 'Auth', function($scope, Auth) {
	$scope.currentUser = Auth.currentUser;		//Permet d'utiliser toutes les fonction de Auth dans le HTML =D
}]);
