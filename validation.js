var app=angular.module('app',[]);
app.config(function($routeProvider, $controllerProvider,$compileProvider){
 app.registerCtrl = $controllerProvider.register;
 app.compileProvider    = $compileProvider.directive;
		$routeProvider
		.when('/employeeTimeSheet',{
			controller:'MainCtrl',
			templateUrl:'/partials/employeeTimeSheet.html'
		})
		.when('/employeeLogin',{
			controller:'MainCtrl',
			templateUrl:'/partials/employeeDashboard.html'
		})
		.otherwise({redirectTo:'/employeeLogin'});

});
app.controller('MainCtrl',function($scope,$http,$window){
	$scope.loginForm=function(){
		alert($scope.username);
		$http.post('/login',{'name': $scope.username}).
		success(function(data) {
			alert(data);
			$window.location = data;
		}).
		error(function(data) {
			 alert(data);
		});
	}
});

app.factory('newfactory',function($http,$q){
	var factory={};
	factory.getCustoC=function(str,cntrl,scopeee){
		if(str === 'dd'){
			createMsgEle('Not this again!!!',cntrl,scope);
		}
		else{
				var deferred = $q.defer();
				$http.post('/abc',{'name': str}).
				success(function(data) {
					deferred.resolve(data);
				}).
				error(function(data) {
					 deferred.reject(data);
				});
				return deferred.promise;
		}
	};	
	return factory;
});

app.directive('ngFocus',function(newfactory) {
  var FOCUS_CLASS = "ng-focused";
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
	
      ctrl.$focused = false;console.log(ctrl);
	  element.bind('keypress', function(evt) {
		if ($('#divPop').length > 0) {
		  $('#divPop').fadeOut(300, function(){ $(this).remove();});
		}
		ctrl.$setValidity('but', false);
	  }).bind('blur', function(evt) {
        element.removeClass(FOCUS_CLASS);
		//console.log(ctrl);
		/*If input box is empty*/
		if(!ctrl.$viewValue && ctrl.$name.toString() === 'username'){
			createMsgEle('Please fill in name',ctrl,scope);
		}
		else
		{
			var typeElement= ctrl.$name.toString();
			var flag=1;
			switch(typeElement)
			{
				case "username":newfactory.getCustoC(ctrl.$viewValue,ctrl,scope).then(
					function(data){
									if(!scope.$$phase){
						scope.$apply(function(s){
								ctrl.$setValidity('but', false);
						});}
					else{
							var msg;
							if(data === 'nouser'){
								flag=1;
								msg='There is no user on this Id.';
								ctrl.$setValidity('but', false);
							}
							if(data === 'emailAddress'){
								flag=1;
								msg='Not a Valid Email Id.';
								ctrl.$setValidity('but', false);
							}
							if(data === 'userExist'){
								flag=0;
								ctrl.$setValidity('but', true);
							}
							if(flag == 1){
								var divElement='<div id="divPop" data-alert class="alert-box" style="z-index:500;position:absolute;display:none;">'+msg+'<a href="#" class="close">&times;</a> </div>';
								jQuery('body').append(divElement);
								$("#"+ctrl.$name).popupDiv("#divPop");		
							}
						}					
					}
				 );
					break;
				default:ctrl.$setValidity('but', false);alert('There is something wrong!!');					
			}
		}		
      });
    }
  }
});

/*function to construct message an create element*/
function createMsgEle(msg,ctrl,scope){
		var divElement='<div id="divPop" data-alert class="alert-box" style="z-index:500;position:absolute;display:none;">'+msg+'<a href="#" class="close">&times;</a> </div>';
		jQuery('body').append(divElement);
		ctrl.$setValidity('but', false);
		$("#"+ctrl.$name).focus();
		$("#"+ctrl.$name).popupDiv("#divPop");
        //scope.$apply(function() {ctrl.$focused = false;});
}
jQuery.fn.popupDiv = function (divToPop) {
    var pos=$('#errorIndex').offset();console.log(pos);
    var h=$(this).height();
    var w=$(this).width();
    $(divToPop).css({ left: pos.left + w - 12, top: pos.top });
	$(divToPop).fadeIn(300, function(){ $(this).show();});
	$(divToPop).fadeOut(5200, function(){ $(this).remove();});
};
