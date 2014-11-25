'user strict';

/*	*********
	CRUD USER
	*********	*/

/*	Controller de la page /user_form	*/
gatheringModule.controller('userFormController', ['$rootScope', '$scope', '$state', 'Auth', 'User', 'themes', 'Theme', 'competences', 'Competence',
	function($rootScope, $scope, $state, Auth, User, themes, Theme, competences, Competence)  {
	$scope.title = "Formulaire";
	$scope.user = new User({
		private:{
			mail : "", 
			password : "", 
			confirmPassword : ""
		},
		public:{
			lastName :"", 
			firstName :"", 
			sex:""
		},
		captcha: {}
	});
	
	// $scope.user = new User({});
	
	//check_password
	$scope.score = "";	//On l'initialise à strong pour ne pas avoir l'input en rouge dés le départ (pas de risque car mpd est required)
	$scope.strength = "";	
	check_password = function(){
		$scope.score = zxcvbn($scope.user.password).score;
  	 if ($scope.score < 2) {
        $scope.strength = "weak";
    }
    if ($scope.score === 2) {
        $scope.strength = "medium";
    }
    if ($scope.score > 2) {
        $scope.strength = "strong";
    }
	};
	$scope.$watch('user.password',check_password);
	
	//Sauvegarder l'utilisateur
	$scope.create = function() {		//Enregistrer l'utilisateur
		console.log('creation user angular controller');
		console.log('user a creer'+$scope.user);
		var userToSave = new User({user:$scope.user});
		userToSave.$save(function(user) {
			$state.go('main.index', {}, {reload:true});
		});
	};
}]);