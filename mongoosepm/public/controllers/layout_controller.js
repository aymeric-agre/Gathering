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
		parent : main,
		resolve : {	themes : function(allThemesLoader){return allThemesLoader();},
					competences : function(allCompetencesLoader) {return allCompetencesLoader();}
					}
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
	
	var user = {
		name : 'main.user',
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
	
		var profile = {
			name : 'main.user.profile',
			//url : '/user/:userId',
			templateUrl : '/public/views/user_profile.html',
			parent : user
			}
		
		var profile_edit = {
			name : 'main.user.edit',
			url : '/edit',
			templateUrl : '/public/views/user_edit.html',
			parent : user
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
		
	var projects_list = {
		name : 'main.projects_list',
		url : '/projects_list/:userId',
		templateUrl : '/public/views/projects_list.html',
		controller: 'projectsListController',
		parent : main,
		resolve : {	
					//On défini l'utilisateur et on cherchera ses projets avec Angular
					thisUser : ['User', '$stateParams', '$q',	function(User, $stateParams, $q) {	
						var delay = $q.defer();
						User.get({id: $stateParams.userId}, function(user) {	//On cherche l'utilisateur avec l'id de l'URL
							delay.resolve(user);		//On renvoie l'utilisateur
						}, function() {					//Sinon
							delay.reject('Cet utilisateur n\'est pas trouvé : ' + $stateParams.userId);	//On envoie une erreur
						});
						{return delay.promise;}	//A la fin on retourne le résultat
					}]
				}
		}		
	
$stateProvider.state(main)
	.state(index)
	.state(search_user)
	.state(search_project)
	.state(user_form)
	.state(user)
		.state(profile)
		.state(profile_edit)
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
}]);

// gatheringModule.directive('uiSref', ['$location', '$state', function($location, $state){
	// return function(scope, element, attrs){
		// scope.$watch('uiSref', function(){
			// if(attrs.uiSref)
			// {
				// element.attr('sref', attrs.uiSref);
				// element.bind('click', function(event){
					// scope.$apply(function(){
						// if($location.path() == attrs.uiSref)
						// {
							// $state.reload();
						// }
					// });
				// });
			// }
		// });
	// }
// }]);