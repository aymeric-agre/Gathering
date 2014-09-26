$stateProvider.state('main')
.state('slidebar')
	.state('slidebar_default')
	.state('slidebar_connected')
.state('page')
	.state('page_default')
		.state('index')
		.state('user_form')
		.state('search_user')
		.state('search_project')
	.state('page_connected')
		.state('profile');
		

var main = {
	abstract : true;
	name : 'main',
	templateUrl : '/public/views/layout.html',
	views : {
			'slidebar' : {},
			'page' : {}
	resolve : {
				projects: function(allProjectsLoader){return allProjectsLoader();},	
				users: function(allUsersLoader){return allUsersLoader();}
				}
}

/*	SLIDEBAR VIEW	*/

var slidebar = {
	name : 'slidebar',
	abstract : true
}

	var slidebar_default = {
		name : 'slidebar_default',
		templateUrl : '/public/views/default.html',
		controller : 'defaultController',
		parent : 'slidebar'
	}

	var slidebar_connected = {
		name : 'slidebar_connected',
		templateUrl :'/public/views/connected.html',
		controller : 'connectedController',
		parent : 'slidebar',
		resolve : connected: checkIsLogged
	}

/*	PAGE VIEW	*/

var page = {
	name : 'page', 
	abstract : true
}
	
	/*	Page non connecté	*/
	var page_default = {
		name : 'page_default',
		abstract : true,
		controller : '/public/views/index.html',
		parent : 'page'
	}
		
		var index = {
			name : 'index',
			url : '/',				
			templateUrl : '/public/views/index.html',
			controller :'indexController',
			parent : 'page_default'
		}
			
		var user_form = {
			name : 'user_form',
			url : '/user_form/',
			templateUrl : '/public/views/user_form.html',
			controller :'userFormController',
			parent : 'page_default'
		}
		
		var search_user = {
			name : 'search_user',
			url : '/search_user/',
			templateUrl : '/public/views/search_user.html',
			controller: 'searchUserController',
			parent : 'page_default'
		}
	
		var search_project = {
			name : 'search_project',
			url : '/search_project/',
			templateUrl : '/public/views/search_project.html',
			controller: 'searchProjectController',
			parent : 'page_default'
		}
		
		var user_profile = {
			name : 'user_profile',
			url : '/user/:userid',
			templateUrl : '/public/views/user.html',
			controller :'userController',
			parent : 'page_default',
			resolve : {	
						user : function(thisUsersLoader) {return thisUsersLoader();}
				}
		}
	
	/*	Page connecté	*/	
	var page_connected = {
		name : 'page_connected',
		abstract : true,
		parent : 'page',
		resolve: connected: checkIsLogged
	}
		
		var profile = {
			name : 'profile',
			url : '/user/:userid',
			templateUrl : '/public/views/user.html',
			controller : '',
			parent : 'page_connected'
		}


