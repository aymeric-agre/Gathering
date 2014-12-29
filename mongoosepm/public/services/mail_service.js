'use strict';

/*	*******
	MAILBOX
	*******	*/
	
var mailboxModule = angular.module('mail', ['ngResource']);

mailboxModule.factory('Mail', ['$resource',
	function($resource){
		return $resource('/mail/:userId/:id', {userId : currentUser._id, id: '@id'},	
		{
			'update': { method:'PUT' }
		});
}]);	

/*	Permet de charger tous les mails	*/
mailboxModule.factory('allMailsLoader', ['Mail', '$q', 
	function(Mailbox, $q) {	
		return function(){
			var delay = $q.defer();
			Mailbox.query(function(mails){
				delay.resolve(mails);
			}, function(){		
				delay.reject("Pas de mails trouvés")
			});
			return delay.promise
		};
}]);
