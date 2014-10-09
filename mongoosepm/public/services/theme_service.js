'use strict';

/*	******
	THEMES
	******	*/
	
var themeModule = angular.module('theme', ['ngResource']);		//'Project' peut être appelé en dépendance pour les controllers


projectModule.factory('Theme', ['$resource',	
	function($resource){	
		return $resource('/theme/:id', {id: '@id'});
}]);												


projectModule.factory('allThemesLoader', ['Theme', '$q', 
	function(Theme, $q) {	
		return function(){
			var delay = $q.defer();	
			Theme.query(function(themes){	
				delay.resolve(themes);	
			}, function(){		
				delay.reject("Pas de 'theme' trouvés")	
			});
			return delay.promise
		};
}]);

