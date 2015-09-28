var app = angular.module("app",[],function($interpolateProvider){
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
});

app.controller('crtlValidation',['$scope', '$http','$timeout', function(scope, http ,$timeout){	
	//detafult values
	scope.elections = [];
	scope.organizations = [];
	scope.reset = function(){
		scope.filter = [
					{show:false, search:null, disabled:false, item:0 , filtered:[], current:-1},
					{show:false, search:null, disabled:true, item:1, filtered:[], current:-1}
		];
		scope.items = [
					{name:'election', val:null, class:'', msj:null, msjshow:false, msjreq:'Seleccione una elección', msjexp:null, exp:null},
					{name:'organization', val:null, class:'', msj:null, msjshow:false, msjreq:'Seleccione una Organización', msjexp:null, exp:null},
					{name:'time', val:null, class:'', msj:null, msjshow:false, msjreq:'Ingrese la hora', msjexp:'Ingrese una hora válida', exp:/^(?:2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])$/},
					{name:'code', val:null, class:'', msj:null, msjshow:false, msjreq:'Ingrese el código', msjexp:'Ingrese un código válido', exp:/^[0-9a-f]{64}$/}
		];
		scope.result = {value:'', show:false, class:''};
	}
	scope.reset();

	//get data
	http.get('/elections')
	.success(function(response){
		scope.elections = response;		
	});

	scope.select = function(option,filter){				
		scope.filter[filter].search = option.description;
		var item = scope.filter[filter].item; 
		scope.items[item].val = option.code;
		scope.filter[filter].show = false;
		if (filter == 0){
			angular.forEach(scope.elections, function(election){
				if(election.code == option.code){
					scope.organizations = election.lstOrganization;			
				}
			});
			scope.filter[1].search = null;
			scope.filter[1].disabled = false;
		}
		scope.valInput(item);
	}
	scope.search = function(filter){
		var item = scope.filter[filter].item;
		scope.filter[filter].current = -1;
		if(scope.filter[filter].search ==''){
			scope.filter[filter].search = null;
		}
		scope.filter[filter].show = (scope.filter[filter].search != null && scope.filter[filter].filtered.length > 0 ) ? true : false;
		console.log(scope.filter[filter].filtered);
		scope.items[item].val = null;
		if(filter == 0){
			scope.filter[1].disabled = true;
			scope.filter[1].search =null;
			scope.items[1].val = null;
			scope.organizations = [];
		}
		scope.valInput(item);
	}
	scope.validate = function(){
		scope.result = {value:'', show:false, class:''};
		var election = scope.items[0].val;
		var organization = scope.items[1].val;
		var time = scope.items[2].val;
		var code = scope.items[3].val;

		var codigo = '';
		var msj = 'La información no coincide con su voto emitido';
		var cls = 'resultado_incorrecto';
		var status = true;
		for (var i = 0; i < scope.items.length; i++) {
			scope.valInput(i);
			if(scope.items[i].msj != null){
				status = false;
			}
		}

		if(status){
			codigo = Sha256.hash(election+organization+time);
			if(codigo == code){
				msj = 'Voto válido';
				cls = 'resultado_correcto';
			} 					
			$timeout(function(){
				scope.result.value = msj;
				scope.result.class = cls;
				scope.result.show = true;

			}, 300);
									
			return true;
		}
		return false;
	}

	scope.valInput = function(input){
		var value = scope.items[input].val;
		var exp = scope.items[input].exp;
		scope.items[input].msj = null;
		
		if (value == null || value == ''){
			scope.items[input].msj = scope.items[input].msjreq;
		} 
		else{
			if(exp != null){
				scope.items[input].msj = exp.test(value) ? null : scope.items[input].msjexp;
			}	
		}		
		scope.items[input].msjshow = scope.items[input].msj != null ? true : false;		
	}	

	scope.keydown = function(input,event){
		var index = parseInt(scope.filter[input].current);
		var filtered = scope.filter[input].filtered;

		// up
		if(event.keyCode == 40){
			index++;
			scope.filter[input].current = index > (filtered.length - 1) ? filtered.length - 1 : index;	
		}
		// down
		if(event.keyCode == 38){
			index--;					
			scope.filter[input].current = index < 0 ? 0: index;			
		}
		// enter
		if(event.keyCode == 13){
			var option = filtered[index];
			scope.select(option,input);		
			scope.filter[input].current = -1;							
		}		
	}

}]);
