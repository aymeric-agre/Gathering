'user strict';

/*	Page Recherche d'utilisateurs	*/
gatheringModule.controller('searchUserController', ['$scope', 'users', function($scope, users) {
	$scope.users = users;
}]);