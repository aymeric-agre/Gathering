'user strict';	//Permet une certaine optimisation de l'interprétation du code (et rend les erreurs javascript non sillencieuses)


gatheringModule.controller('userController', ['$rootScope', 'thisUser', 'User', '$state',  function($scope, thisUser, User, $state) {
	$scope.user=thisUser;
	$scope.interests=thisUser.interests;
	$scope.groups=thisUser.groups;
	$scope.experiences=thisUser.experience;
	$scope.competencies=thisUser.competencies;
	$scope.projects=thisUser.projects;
	$scope.languages=thisUser.languages;
	
	$scope.sameUser = function() {
		if($scope.user._id == currentUser._id) {return true}
		else {return false}
	}
	
	//Edit mode
	$scope.editMode = false;
	$scope.doEditMode = function() {$scope.editMode=!$scope.editMode}
	
	$scope.edit = function(){
		console.log("coucou c'est moi le controlleur");
		var userToUpdate = new User({user : $scope.user});
		console.log($scope.user);
		userToUpdate.$update({id : $scope.user._id}, function(){
			$scope.editMode = false;
			$state.go('main.user.profile');
		})
	}
}]);