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
	$scope.infosConnection = {mail:"", password: ""};
	
	$scope.opened = false;
	
	$scope.login = function(infosConnection) {
		console.log("Je me connecte");
		Auth.doLogin(infosConnection,		//On récupère les infos des ng-model et on envoie la fonction login de Auth 
		function(err) {
			$rootScope.error = "Failed to login";
			$state.go('main.index', {}, {reload:true});
		});
		
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
}]);

/*	*********
	CRUD USER
	*********	*/

/*	Controller de la page /user_form	*/
gatheringModule.controller('userFormController', ['$rootScope', '$scope', '$state', 'Auth', 'User', function($rootScope, $scope, $state, Auth, User)  {
	$scope.title = "Formulaire";
	$scope.user = {mail : "", password : "", confirmPassword : "", userLastName :"", userFirstName :"", country :"" };
	$scope.statuts = {name: "Étudiant"}, {name: "Doctorant"}, {name: "Enseignant"} ;
	
	//Navigation
	$scope.etapes = ['Informations personnelles', 'Competences', 'Formation', 'Projets'];
	$scope.selection = $scope.etapes[0];
	$scope.selectionClass = function(currentSelection, etape) {
		if(currentSelection === etape) {return 'selected';}
	};
	$scope.next = function(currentSelection){
		switch(currentSelection){ 
			case 'Informations personnelles' : $scope.selection = 'Competences'; break;			
			case 'Competences' : $scope.selection = 'Formation'; break;			
			case 'Formation' : $scope.selection = 'Projets'; break;			
		}
		return $scope.selection;
	};
	$scope.prev = function(currentSelection){
		switch(currentSelection){ 
			case 'Projets' : $scope.selection = 'Formation'; break;			
			case 'Formation' : $scope.selection = 'Competences'; break;			
			case 'Competences' : $scope.selection = 'Informations personnelles'; break;			
		}
		return $scope.selection;
	};
	
	
	//check_password
	
	$scope.score = "";
	$scope.strength = "";
	check_password = function(){
		$scope.score = zxcvbn($scope.user.password).score;
  	 if ($scope.score < 2) {
        $scope.strength = "weak";
    }
    if ($scope.score === 2) {
        $scope.strength = "so-so";
    }
    if ($scope.score > 2) {
        $scope.strength = "strong";
    }
	};
	$scope.$watch('user.password',check_password);
	
	
	//datepicker
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;	//Permet d'ouvrir le calendrier
	};
	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};
	
	//Compétences et centre d'intérêt
	$scope.competences= [];
	$scope.add = function(competence) {
		$scope.competences.push(competence);
	};
	$scope.remove = function(competence) {
		var index = $scope.competences.indexOf(competence);
		if(index>-1) {
			$scope.competences.splice(index,1);
		}
	};
		
	
	
	//Sauvegarder l'utilisateur
	$scope.create = function(newUser){	//Préparation des données JSON pour les envoyer au serveur si le form est valide (selon Angular
			var user = new User();
			user.mail = newUser.mail;
			user.password = newUser.password;
			user.confirmPassword = newUser.confirmPassword;
			user.userLastName =	newUser.userLastName;
			user.userFirstName = newUser.userFirstName;
			user.country = newUser.country;
			console.log(user);
			
			user.$save(function(){//Fait un post à /user/
				$state.go('main.index', {}, {reload:true});
			});	
			
	};
}]);


/*	Controller de la page user/:id	*/
gatheringModule.controller('userController', ['$scope', '$location', 'user', function($scope, $location, user){	//user désigne l'utilisateur de la page
	$scope.title= user.userFirstName;
	$scope.user = user;	//On défini le "user" des templates ($scope) comme étant celui de la dépendance
}]);

/*	Controller de la page /user_edit/:id	*/
gatheringModule.controller('userEditController', ['$scope', '$location', 'user', function($scope, $location, user) {
	$scope.user = user;
	
	$scope.save = function() {							//Enregistrer l'utilisateur
		$scope.user.$save(function(user) {		//On enregitre l'utilisateur
			$location.path('/user/' + user.id);	//Puis on redirige vers la page
		});
	};
	
	$scope.remove = function() {						//Supprimer l'utilisateur
		delete $scope.user;							//On supprime l'utilisateur
		$location.path('/');							//Puis on redirige vers la page d'accueil
	};
}]);


/*	Page Recherche d'utilisateurs	*/
gatheringModule.controller('searchUserController', ['$scope', 'users', function($scope, users) {
	$scope.users = users;
}]);


gatheringModule.controller('userController', ['$rootScope', 'thisUser',  function($scope,thisUser) {
	console.log(thisUser);
	$scope.user=thisUser;
}]);


	



//Ajout et suppression de cases pour le forumlaire
/*
gatheringModule.controller('addUserInformation', ['$scope', 'fileUpload', function($scope, fileUpload){
	
	$scope.fileUpload = function() {
		var file = $scope.user.photo;
		var uploadUrl = '/user_form';
		fileUpload.uploadFileToUrl(file, uploadUrl);
	};
}]);
*/
