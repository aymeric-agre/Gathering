'user strict';	//Permet une certaine optimisation de l'interprétation du code (et rend les erreurs javascript non sillencieuses)

/*	*******************
	LAYOUT/LOGIN/LOGOUT
	*******************	*/

gatheringModule.controller('mainController', ['$rootScope', '$scope', '$state', '$location','User', 'Auth', 'projects', '$http',
	function($rootScope, $scope, $state, $location, Auth, User, projects, $http) {
	
	$scope.currentUser = currentUser;//Récupère l'utilisateur depuis le HTML
	$scope.connected = connected;	//Récupère true ou false depuis le HTML
	$scope.projects = projects;
	$scope.isCollapsed = true;
	$scope.infosConnection = {mail:"", password:""};
	
	$scope.opened = false;
	
	$scope.login = function(infosConnection) {
		console.log("Je me connecte");
		console.log(infosConnection);
		Auth.doLogin(infosConnection,		//On récupère les infos des ng-model et on envoie la fonction login de Auth 
			function(err) {
				$rootScope.error = "Failed to login";
				$state.go('main.index', {}, {reload:true});
			}
		);		
	};	
	
	$scope.logout = function() {
		Auth.doLogout(function(){
		$state.go('main.index', {}, {reload:true});
		});
	};		
	
	$scope.searchProject = function() {
		console.log('on cherche un project');
		$state.go('main.search_project');
	};
	
	$scope.searchUser = function() {
		console.log('on cherche un utilisateur');
		$state.go('main.search_user');
	};

	//initialisation user
	// $scope.user = new User({
		// private:{
			// mail : "", 
			// password : "", 
			// confirmPassword : ""
		// },
		// public:{
			// lastName :"", 
			// firstName :"", 
			// sex:""
		// },
		// captcha: {}
	// });
	
	//check_password
	$scope.score = "";	//On l'initialise à strong pour ne pas avoir l'input en rouge dés le départ (pas de risque car mpd est required)
	$scope.strength = "";	
	check_password = function(){
		$scope.score = zxcvbn($scope.user.private.password).score;
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
	$scope.$watch('user.private.password',check_password);
	
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