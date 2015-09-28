angular
    .module('alexandraVote')
    .controller('votaController', votaController);

    votaController.$inject = ['$scope','$http','$timeout'];

function votaController(scope, http, $timeout){
	scope.cedule = {};
	scope.index = 0;	
	scope.vprefer = false;
	scope.vcedule = true;
	scope.vconfirm = false;
	scope.candidates = [];
	scope.votes = [];
	scope.nextCedule = nextCedule;
	scope.showCandidates = showCandidates;
	scope.chooseOrg = chooseOrg;
	scope.changeVote = changeVote;
	scope.selected = null;
	scope.can = null;
	scope.backCedule = backCedule;	
	scope.chooseCandidate = chooseCandidate;
	scope.org = {};
	scope.isCheckedCan = isCheckedCan;
	scope.isCheckedOrg = isCheckedOrg;
	scope.candid = [];
	scope.aceptSelection = aceptSelection;
	scope.svotes = [];

	getCedules();

	var cedules = [];	
	var current = 0;
	var currentb = {};

	var arrvotes = [];

	function initialize(){		
		currentb.election = null;
		currentb.organization = null;
		currentb.candidates = [];
		scope.candid = [];
	}

	function getCedules(){
		
		http({
            url: '/alexandra_vote/public/vote/cedules',            
            method: 'GET'
        }).success(function (response) {
            cedules = response; 
            scope.cedule = cedules[0];   
            for (var i = 0; i < cedules.length; i++) {
				var vote = new Object();
				vote.orgCode = '';
				vote.orgDescription = 'VOTO EN BLANCO';
				vote.eleCode = cedules[i].code;
				vote.eleDescription = cedules[i].description;
				scope.votes.push(vote);
			}    
			currentb.election = 0; 
        }).error(function (response) {
            console.log('Error: ' + response);
        });
	}	

	function nextCedule(){	
		currentb.election = current;	
		current = current + 1;	
			
		if(current <= cedules.length - 1){
			scope.vcedule = true;
			scope.cedule = cedules[current];			
			arrvotes.push(new Object(currentb));
			
		} else {			
			scope.svotes = arrvotes;			
			scope.vconfirm = true;
			scope.vcedule = false;
		}
		scope.selected = null;	
		console.log(currentb);
		console.log(arrvotes);	
		initialize();
	}	

	function showCandidates(option){
		scope.vprefer = true;	
		scope.vcedule = false;

		scope.candidates = cedules[current].organizations[option].candidates;
		scope.org = cedules[current].organizations[option].description;
		
		if(option != currentb.organization){
			currentb.candidates = [];
		}
		//
		currentb.organization = option;
		
		scope.votes[current].orgCode = cedules[current].organizations[option].code;
		scope.votes[current].orgDescription = cedules[current].organizations[option].description;
	}

	function chooseOrg(option){
		scope.votes[current].orgCode = cedules[current].organizations[option].code;
		scope.votes[current].orgDescription = cedules[current].organizations[option].description;
		scope.votes[current].current = current;
		scope.votes[current].org = option;	
		scope.selected = option;
		currentb.organization = option;
	}

	function changeVote(option){
		var vote = scope.votes[option];
		console.log(vote);
	}

	function backCedule(){
		scope.vcedule = true;
		scope.vprefer = false;
		currentb.candidates = [];
		scope.candid = [];
	}

	function aceptSelection(){
		scope.vcedule = true;
		scope.vprefer = false;
		scope.cand = [];
	}

	function chooseCandidate(option){
		scope.can = option;
		checked = null;
		stored = currentb.candidates;

		for (var i = 0; i < stored.length; i++) {
			if(stored[i] == option){
				checked = i;
			}			
		}
		//console.log('checked: '+checked);

		if (checked != null){			
			currentb.candidates.splice(checked, 1);
		} else {
			if(currentb.candidates.length < 2){
				currentb.candidates.push(option);						
			}
		}
		var arr = [];
		for (var i = 0; i < currentb.candidates.length; i++) {
			cand = cedules[current].organizations[currentb.organization].candidates[currentb.candidates[i]].order;			
			arr.push(cand);			
		};
		scope.candid = arr;

		
	}
	

	function isCheckedCan(option){
		checked = false;
		stored = currentb.candidates;
		for (var i = 0; i < stored.length; i++) {
			if(stored[i] == option){
				checked = true;
			}			
		}
		return checked;
	}

	function isCheckedOrg(option){
		checked = false;		
		stored = currentb.organization;
		if (stored == option){
			checked = true;
		}
		return checked;
	}

	function chageVote(){

	}

	

}