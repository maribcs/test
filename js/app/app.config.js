angular
	.module('alexandraVote')
	.config(configure);

configure.$inject = ['$interpolateProvider'];

function configure($interpolateProvider){
	// 
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
}