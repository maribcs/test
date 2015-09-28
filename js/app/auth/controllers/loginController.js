angular
    .module('alexandraVote')
    .controller('loginController', loginController);

    loginController.$inject = ['$scope','$http'];

function loginController(scope, http){
	scope.voter = {};	
	scope.stepshow = true;
	scope.next = next;
	scope.login = login;
	scope.back = back;		

	function next(){
		var valid = validate(scope.voter.id,'id');
		var message = '';
		if(!valid.res){
			message = valid.type == 0 ? 'Ingrese su documento de identidad' : 'Ingrese un documento de identidad válido';
			alert(message);
			return false;			
		}
		scope.stepshow = false;		
	}

	function login(){
		// validate
		var message = '';
		var validId = validate(scope.voter.id,'id');
		var validCode = validate(scope.voter.code,'code');

		if (!validId.res){
			scope.back();
			return false;
		}

		if(!validCode.res){
			message = validCode.type == 0 ? 'Ingrese su clave' : 'Ingrese una clave válida';
			alert(message);
			return false;
		}
			
		var code = scope.voter.code.substr(scope.voter.code.length -1 );

		if(code != validateCode(scope.voter.code)){
			message = 'La clave ingresada no es válida';	
			alert(message);		
			return false;
		}	
		
		var pin = Sha256.hash(scope.voter.code);
		http({
            url: '/auth/login',
            params: {
                dni: scope.voter.id,
               	code: Sha256.hash(scope.voter.id+pin)
            },
            method: 'POST'
        }).success(function (response) {
            if (response.success) {
                location.href = response.url;
            } 
            else {
            	alert(response.message);
            }            
        }).error(function (response) {
            console.log('Error: ' + response);
        });
	}

	function back(){
		scope.stepshow = true;
		scope.voter.code = '';			
	}	

	function validate(value,field){
		var exp = (field == 'id') ? /^([0-9]{8})*$/ : /^[0-9A-Z]{8}$/;
		var result = {};
		if(value == '' || value == undefined){
			result = {res:false,type:0}
			return result;
		}
		if(!exp.test(value)){
			result = {res:false,type:1}
			return result;
		}		
		result = {res:true,type:null}
		return result;	
	}

	function validateCode(code)
	{   
		code = code.substring(0,code.length-1);	    
	    vid = code.trim();

	    vtotal = 0;
	    for(i = 0 ; i<vid.length ; i++){
	        digit = vid.substr(i, 1);
	        if (!isNumeric(digit))
	        {	
	            digit = vid.substr(i, 1).charCodeAt();	            
	        }
	        vtotal = (vtotal+digit*(i+1))%10;
	    }

	    vnumber = Number(vtotal.toString().substr(-1));
	    charcode = String.fromCharCode(vnumber+65);
	    charcode = charcode == 'O' ? 'Z' : (charcode == 'I' ? 'Y' : charcode);
	    
	    return charcode;
	}

	function isNumeric(n) {
	    return !isNaN(parseFloat(n)) && isFinite(n);
	}
}
