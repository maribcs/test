angular
    .module('alexandraVote')
    .directive('virtualKeyBoard', virtualKeyBoard);

function virtualKeyBoard(){
	var directive = {			
		templateUrl: 'js/app/auth/views/virtualKeyBoard.html'
	}
	return directive;		

	function link(scope, element, attrs) {

	}
}