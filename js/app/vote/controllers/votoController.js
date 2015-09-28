angular
    .module('alexandraVote')
    .controller('votoController', votoController);

    votoController.$inject = ['$scope','$http'];

function votoController(scope, http){

	scope.activeCedule = [];
	scope.nextCedule = nextCedule;
	// scope.check = check;
	scope.confirm = false;
	scope.toConfirm = toConfirm
	scope.candidate = false;
	scope.cedules = [];

	scope.viewCandidate = viewCandidate;
	
	initialize();

	var lastcedule;
	getCedules();

	function initialize(){
		var cedule = new Array();
		cedule[0] = {status:true};
		scope.cedule = cedule;
	}

	function nextCedule(cedule){
		console.log(scope.cedule);

		for (var i = 0; i < scope.cedule.length; i++) {
			cedarr = {status: cedule == i ? true : false};
			scope.cedule[i] = cedarr;	
			scope.cedule[cedule] = cedarr;		
		}		
		scope.confirm = false;
	}

	function backCedule(){

		for (var i = 0; i < scope.cedule.length; i++) {
			cedarr = {status: lastcedule == i ? true : false};
			scope.cedule[i] = cedarr;	
			scope.cedule[cedule] = cedarr;		
		}
	}

	function toConfirm(){
		for (var i = 0; i < scope.cedule.length; i++) {
			cedarr = {status: false};
			scope.cedule[i] = cedarr;			
		}
		scope.confirm = true;
	}

	function viewCandidate(){
		scope.candidate = true;
		for (var i = 0; i < scope.cedule.length; i++) {
			cedarr = {status: false};
			scope.cedule[i] = cedarr;			
		}
		console.log('ok');

	}

	function getCedules(){
		
		http({
            url: '/vote/cedules',            
            method: 'GET'
        }).success(function (response) {
            scope.cedules = response;          
        }).error(function (response) {
            console.log('Error: ' + response);
        });
	}

	// scope.next = nexCedule;
	// scope.votes = [];

	// var vote = new Object();

	// function getCedula(){

	// }

	// function nextCedule(){

	// }

	// function preferVote(organization, election, candidate){		
		
	// }	
}