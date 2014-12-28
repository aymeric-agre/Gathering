'user strict';	//Permet une certaine optimisation de l'interprétation du code (et rend les erreurs javascript non sillencieuses)


gatheringModule.controller('userController', ['$rootScope', 'thisUser', 'User', '$state',  function($scope, thisUser, User, $state) {
	$scope.user=thisUser;
	delete $scope.user.$promise;
	delete $scope.user.$resolved;
	
	//datepicker
	$scope.open = function($event){
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;	//Ouvre le calendrier
	};
	$scope.dateOptions = {
		formatYear: 'YY',
		startingDay: 1
	};
	
	//Compétences et centre d'intérêt
	// $scope.themes = themes;
	// $scope.user.public.interests = [];
	// $scope.competences = competences;
	// $scope.user.public.competences = [];
	// $scope.register = {newCompetenceToAdd : ''};
	
	//Add
	// $scope.addTheme = function(registerData) {
		// if(registerData != ""){
			// console.log('On ajoute ' + registerData);
			// $scope.user.public.interests.push(registerData);
			// $scope.register.newThemeToAdd = '';
		// }
	// };
	// $scope.addCompetence = function(registerData){
		// if(registerData != ""){
			// console.log('On ajoute ' + registerData);
			// $scope.user.public.competences.push(registerData);
			// $scope.register.newCompetenceToAdd = '';
		// }
	// };	
	
	//Remove
	// $scope.removeTheme = function(theme) {
		// var index = $scope.user.public.interests.indexOf(theme);
		// if(index>-1) {
			// $scope.user.interests.splice(index,1);
		// }
	// };
	
	// $scope.removeCompetence = function(competence) {
		// var index = $scope.user.public.competences.indexOf(competence);
		// if(index>-1) {
			// $scope.user.competences.splice(index,1);
		// }
	// };
	
}]);