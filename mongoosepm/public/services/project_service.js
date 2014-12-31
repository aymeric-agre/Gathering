'use strict';

/*	********
	PROJECTS
	********	*/
	
var projectModule = angular.module('project', ['ngResource']);		//'Project' peut être appelé en dépendance pour les controllers

/*	Permet de créer et utliser l'object project	*/
projectModule.factory('Project', ['$resource',	//on appelle la dépendance à $resource
	function($resource){	//On lance une fonction sur les $resource
		return $resource('/project/:id', {id: '@id'},	// return $resource permet de passer 'project' en argument des controllers et utiliser le CRUD
		{
			'update': { method:'PUT' }
		});
}]);												// "/project/:id" permet d'accéder à ces projets via leur id.
													// @id indique que l'id est utilisé comme paramètre pour identifier un projet

/*	Permet de charger tous les projets	*/
projectModule.factory('allProjectsLoader', ['Project', '$q', //On appelle les dépendances (on peut utiliser project maintenant)
	function(Project, $q) {	//On lance une fonction sur project
		return function(){
			var delay = $q.defer();	//delay est alors une promise : fonction asynchrone.
			Project.query(function(projects){	//on cherche des projects sur le server
				delay.resolve(projects);	//On renvoie les projets si on en trouve (resolve)
			}, function(){		//Sinon
				delay.reject("Pas de projets trouvés")	//On renvoie une erreur (reject)
			});
			return delay.promise	//A la fin on retourne le résultat de la promise delay : une liste de projets.
		};
}]);

/*	Permet de charger un projet	*/
projectModule.factory('thisProjectLoader', ['Project', '$route', '$q',	function(Project, $route, $q) {	
		return function() {
			var delay = $q.defer();
			Project.get({id: $route.current.params.projectId}, function(project) {	//On cherche le projet avec l'id de l'URL
				delay.resolve(project);		//On renvoie le projet
			}, function() {					//Sinon
				delay.reject('Ce projet n\'est pas trouvé : ' +$route.current.params.projectId);	//On envoie une erreur
			});
			return delay.promise	//A la fin on retourne le résultat
		};
}]);





