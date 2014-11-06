var formModule = angular.module('Form', []);

/*	Donner accès à un fichier (photo par exemple) dans le controller	*/
formModule.directive('fileModel', ['$parse', function ($parse) {		//o crée une directive appelé file-model
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

/*	Upload le fichier	*/
formModule.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,		//Permet de laisser le fichier intact
            headers: {'Content-Type': undefined}	//Le navigateur met le content-type en multipar/form-data automatiquement plutôt qu'en json
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);
