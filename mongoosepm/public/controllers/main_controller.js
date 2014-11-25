'user strict';	//Permet une certaine optimisation de l'interprétation du code (et rend les erreurs javascript non sillencieuses)

/*	*******************
	LAYOUT/LOGIN/LOGOUT
	*******************	*/

gatheringModule.controller('mainController', ['$rootScope', '$scope', '$location', 'Auth', '$state', 'projects', '$http',
	function($rootScope, $scope, $location, Auth, $state, projects, $http) {
	
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
	
	// $rootScope.$on('$stateChangeStart', function () {
        // $state.reload();
    // });
	
	//Rechargement de la page
	//$state.transitionTo($state.current, $stateParams, { reload: true, inherit: true, notify: true });
	
	// $scope.reload = function(){
		// $state.transitionTo('myState');
	// };
}]);