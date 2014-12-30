'user strict';	//Permet une certaine optimisation de l'interprétation du code (et rend les erreurs javascript non sillencieuses)


gatheringModule.controller('connectedUserController', ['$rootScope', 'User', 'users', '$state', 'mails', 'Mail',  function($scope, User, users, $state, mails, Mail) {
	$scope.users = users;
	$scope.user=currentUser;	//Récupère le currentUser du HTML
	$scope.projectsList = $scope.user.public.projects;
	
	//Edit mode
	$scope.editMode = false;
	$scope.doEditMode = function() {$scope.editMode=!$scope.editMode}
	
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
	
	//Validation edition
	$scope.edit = function(){
		console.log("controlleur user profile" + $scope.user);
		
		//On enregistre les compétences dans la BDD
		// for(i=0; i<$scope.user.public.competences.length; i++){
			// if ($scope.competences.indexOf($scope.user.public.competences[i]) == -1)
			// var competenceToSave = new Competence({competence : $scope.user.public.competences[i]});
			// competenceToSave.$save();
		// }
		
		var userToUpdate = new User({user : $scope.user});
		console.log($scope.user);
		userToUpdate.$update({id : $scope.user._id}, function(){
			$scope.editMode = false;
			$state.go('main.connectedUser.profile');
		})
	};
	
	
	
	/*	*******
		MAILBOX
		*******	*/
	
 	$scope.mails = mails;
	$scope.html = '<p> alors ça va ? </p></br><p>Moi ça va</p>';
	$scope.newRecipient = '';	//Nom du destinataire vide
	$scope.mailContent = new Mail ({	//contenu du mail reçu
		userSender : "",
		userRecipient : [],
		title : '',
		content : ''
	})
	$scope.mailForm = new Mail ({	//Mail a envoyé
		userSender : currentUser,	//Récupéré du HTML
		userRecipient : [],
		title : '',
		content : ''
	})

	$scope.showMail = function(mail){$scope.mailContent = mail};
	
	$scope.addUserRecipient = function(registerData){
		console.log("1 - " + $scope.newRecipient);
		if(registerData != ""){	//S'il y a quelque chose d'écrit
			if($scope.mailForm.userRecipient.indexOf(registerData) == -1) {	//Si ce qui est écrit n'est pas déjà dans la liste
				$scope.mailForm.userRecipient.push(registerData);
				$scope.newRecipient = '';
			}
		}
	}
	
	$scope.save = function() {
		$scope.mailForm.$save(function(){
			$scope.mailForm.userRecipient =[];
			$scope.mailForm.title ='';
			$scope.mailForm.content ='';
		});	//On remet tout à zéro
	};
}]);