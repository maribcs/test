angular
    .module('alexandraVote')
    .controller('keyBoardController', keyBoardController);

keyBoardController.$inject = ['$scope','$timeout'];

function keyBoardController(scope, $timeout) {

	scope.keys = [];	
	scope.input = '';
	scope.voter.code = '';
	scope.keyPress = keyPress;
	scope.clear = clear;
	
	getKeys();

	function keyPress(key){	
		if(scope.input.length > 7){
			return false;
		}			
		scope.voter.code += key;
		scope.input += key;
		
		$timeout(function(){	
			size = scope.input.length;
			scope.input = '';
			for (var i = 0; i < size; i++) {
				scope.input += '*';
			}
		},200);		
	}	

	function clear(){
		scope.voter.code = '';
		scope.input = '';
	}
	
	function getKeys(){		
		var numeric = ["1","2","3","4","5","6","7","8","9"];
		var	alpha = ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","Q","R","S","T","U","V","W","X","Y","Z"];
			
		scope.keys = shuffle(numeric).concat(shuffle(alpha));		
	}

	function shuffle(array){
	    for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
	    return array;
	}	
}