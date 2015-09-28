angular
    .module('alexandraVote')
    .controller('voteController', voteController);

    voteController.$inject = ['$scope','$http','$timeout'];

function voteController(scope, http, $timeout){

	scope.cedule = [];
	scope.votes = [];

	scope.velection = true;
	scope.vcandidates = false;
	scope.vconfirm = false;

	scope.checkOption = checkOption;
	scope.chooseOption = chooseOption;
	scope.nextCedule = nextCedule;
	scope.showCandidates = showCandidates;
	scope.backCedule = backCedule;
	scope.acceptCandidates = acceptCandidates;
	scope.changeVote = changeVote;
	scope.current = current;

	var cedules = [];	

	var votes = new Array();
	var vote = new Object();
	vote.ele = 0;
	vote.org = null;
	vote.can = [];

	getCedules();	

	function getCedules(){

		http({
            url: '/alexandra_vote/public/vote/cedules',            
            method: 'GET'
        }).success(function (response) {
            cedules = response;      
            scope.cedule = cedules[vote.ele];     
        }).error(function (response) {
            console.log('Error: ' + response);
        });
	}	

	function chooseOption(option,type){	
		
		switch(parseInt(type)){
			case 1: 
				if (vote.org == option) {
					vote.org = null;					
				} else {
					vote.org = option;
				}
			break;
			case 2:					
				var exists = false;

				for (var i = 0; i < vote.can.length; i++) {
					if (vote.can[i] == option){						
						vote.can.splice(i, 1);
						exists = true;
					}
				}
				if(!exists){
					if(vote.can.length < 2){
						vote.can.push(option);
					}					
				}				
			break;
			default:

			break;
		}
	}

	function checkOption(option, type){
		var result = false;
		switch(parseInt(type)){
			case 1:
				result = option == vote.org ? true : false;
			break;
			case 2:
				for (var i = 0; i < vote.can.length; i++) {
					if (option == vote.can[i]) {
						result = true;
					}
				}
			break;
			default:
			break;
		}
		return result;
	}

	function nextCedule(){

		var tmpvote  = new  Object();
		tmpvote.ele = vote.ele;
		tmpvote.org = vote.org;
		tmpvote.can = vote.can;
		votes[vote.ele] = tmpvote;	

		if(vote.ele < cedules.length - 1){	
			scope.velection = false;					
			vote.ele++;
			
			if(votes[vote.ele] == null){
				vote.org = null;
				vote.can = [];				
			} else {
				setCurrent(vote.ele);
			}			
			
			scope.cedule = cedules[vote.ele];
			$timeout(function () {
				scope.velection = true;
			},100);
			

		} else {
			confirmation();
		}
	}

	function confirmation(){
		scope.velection = false;
		scope.vconfirm = true;

		for (var i = 0; i < votes.length; i++) {
			var tmpvote = new Object;
			var tmp = votes[i];
			tmpvote.election = getElection(tmp.ele);
			tmpvote.organization = tmp.org == null ? {description:'VOTO EN BLANCO'} : getOrganization(tmp.ele,tmp.org);
			tmpvote.candidates = [];

			if(tmp.org != null){
				for (var j = 0; j < tmp.can.length; j++) {
					tmpvote.candidates.push(getCandidate(tmp.ele, tmp.org, tmp.can[j]));
				}
			}
			scope.votes[tmp.ele] = tmpvote;
		};
		console.log(scope.votes);
	}

	function showCandidates(option){
		scope.velection = false;
		scope.vcandidates = true;
		vote.org = option;
		vote.can = [];
		scope.candidates = cedules[vote.ele].organizations[vote.org].candidates;
	}

	function acceptCandidates(){
		scope.vcandidates = false;
		scope.velection = true;
	}
	function backCedule(){
		vote.can = [];
		scope.vcandidates = false;
		scope.velection = true;
	}
	function changeVote(option){		
		scope.vconfirm = false;
		scope.velection = true;	

		scope.cedule = cedules[option]; 		
		setCurrent(option);
		console.log(scope.cedule);
	}	
	function setCurrent(option){
		vote.ele = votes[option].ele;
		vote.org = votes[option].org;
		vote.can = votes[option].can;
	}

	function getElection(election){
		var tmpElection = cedules[election];
		var election = new Object();
		election.description = tmpElection.description;
		election.code = tmpElection.code;
		return election;
	}

	function getOrganization(election, organization){
		var tmpOrganization = cedules[election].organizations[organization];
		var organization = new Object();
		organization.description = tmpOrganization.description;
		organization.code = tmpOrganization.code;
		organization.order = tmpOrganization.order;

		return organization;
	}

	function getCandidate(election, organization, candidate){
		var tmpCandidate = cedules[election].organizations[organization].candidates[candidate];
		var candidate = new Object();
		candidate.description = tmpCandidate.description;
		candidate.code = tmpCandidate.code;
		candidate.order = tmpCandidate.order;
		return candidate;
	}

	function current(){
		return vote.can;
	}
}