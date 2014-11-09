'use strict';

/*	***********
	COMPETENCES
	***********	*/
	
var competenceModule = angular.module('competence', ['ngResource']);		//'Project' peut être appelé en dépendance pour les controllers


projectModule.factory('Competence', ['$resource',	
	function($resource){	
		return $resource('/competence/:id', {id: '@id'});
}]);												


projectModule.factory('allCompetencesLoader', ['Competence', '$q', 
	function(Competence, $q) {	
		return function(){
			var delay = $q.defer();	
			Competence.query(function(competences){	
				delay.resolve(competences);	
			}, function(){		
				delay.reject("Pas de 'competence' trouvés")	
			});
			return delay.promise
		};
}]);

