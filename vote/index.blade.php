@extends('layout')


<script> 
    /******************************************/
    /*****JAVASCRIPT PARA CUENTA REGRESIVA*****/
    /******************************************/

   var timeLimit = 5; //tiempo en minutos
   var conteo = new Date(timeLimit * 60000);

   function inicializar(){
      document.getElementById('cuenta').childNodes[0].nodeValue = 
                  conteo.getMinutes() + ":" + conteo.getSeconds();

       document.getElementById('cuentaScroll').childNodes[0].nodeValue = 
                  conteo.getMinutes() + ":" + conteo.getSeconds();
    }
/*****JAVASCRIPT PARA CUENTA REGRESIVA*****/
   function cuenta(){
      intervaloRegresivo = setInterval("regresiva()", 1000);
   }


   function cuentaScroll(){ ****CRIPT PARA CUENTA REGRESIVA EN EFECTO SCROLL****
      intervaloRegresivo = setInterval("regresiva()", 1000);
   }

   function regresiva(){
      if(conteo.getTime() > 0){
         conteo.setTime(conteo.getTime() - 1000);
      }else{
         clearInterval(intervaloRegresivo);
         alert("Su tiempo a Culminado");
      }

      document.getElementById('cuenta').childNodes[0].nodeValue = 
                  conteo.getMinutes() + ":" + conteo.getSeconds();

       document.getElementById('cuentaScroll').childNodes[0].nodeValue = 
                  conteo.getMinutes() + ":" + conteo.getSeconds();
   }
   onload = inicializar;
</script>

@section('nav')
    <div id="nav2" class="nav2-scroll animacion_elementos"  onload="cuentaScroll()" style="display: none" >
       <span ng-bind="cedule.description"></span><section class="relox-scroll"><span id="cuentaScroll">0 </span></section>
    </div>
    <nav>
        <div class="menu_principal">
            <section class="opciones-votante animacion_elementos">
                <section class="contenedor-cuenta">
                    <div class="circulo-hora">
                        <img src="../../img/cuenta-regresiva.gif" class="relox">
                    </div>
                    <span id="cuenta">0 </span> 
                </section>
                <section class="contenedor-DNI animacion_elementos invisible-responsibe id_deni">
                    <div class="circulo-DNI">DNI</div> <span>72364245</span>
                    <ul >
                        <li> <a href="#"> Ayuda</a></li>
                        <li><a href="{{ url('/auth/logout') }}"> Salir</a></li>
                    </ul>
                </section>
            </section>
            <?php $cont = 0 ?>
            @foreach ($lstCedula as $cedule)
            <h4 class="boton_menu_text {{ $cont == 0? 'active' : '' }}">{{ $cedule->description }}</h4>
            <?php $cont++ ?>
            @endforeach
            <h4 rel="ced"  class=" boton_cofirmacion boton_menu_text ">CONFIRMACIÓN</h4>                 
        </div>
    </nav>
@endsection

@section('content') 
<div ng-app="alexandraVote" ng-controller="voteController"> 
    <div class="animation-cedule" ng-if="velection">
        <h2 class="titulo_rojo" ng-bind="cedule.description"></h2> 
        <p class="texto_voto">Haga clic en el recuadro del símbolo de su preferencia. Al hacer un clic usted realizará un voto a favor del partido político a que pertenece el símbolo. </p>
        <br>       
        <table class="cedule_table">
            <tr>
                <th>Organización Política</th>                
                <th ng-class=" cedule.prefer == 0 ? 'witth_tabla_presidente' : 'columna_tres_cuadros'" align="center">Símbolo  </th>
            </tr>               
            <tr ng-repeat="organization in cedule.organizations">
                <td>
                    <span class="agrupol_desc" ng-bind="organization.description"></span>
                </td>                
                <td class="witth_tabla_presidente" ng-if="cedule.prefer == 0">
                    <div class="row_cedule">
                        <img class="img-presidente" src="{{ $path . '00000023.jpg' }}" />
                        <img class="img-presidente" src="{{ $path . '00000023.jpg' }}" />
                        <div class="radio_vote img-presidente" ng-click="chooseOption($index,1)" ng-class="checkOption($index,1)? 'radio_vote_check' : ''"></div>
                    </div>
                </td>
                <td ng-if="cedule.prefer == 1">
                    <div class="row_cedule">
                        <img src="{{ $path . '00000023.jpg' }}" />
                        <div class="radio_vote" ng-click="showCandidates($index)" ng-class="checkOption($index,1)? 'radio_vote_check' : '' "></div>
                        <div class="contenedor_numeros">
                            <span class="persona_seleccionada" ng-bind="checkOption($index,1)? organization.candidates[current()[0]].order : ''"></span>
                            <span class="persona_seleccionada" ng-bind="checkOption($index,1)? organization.candidates[current()[1]].order : ''"></span>
                        </div>
                    </div>
                </td>
            </tr>         
        </table>
        <div class="alnineador-right">
            <button type="button" class="botones_Onpe" ng-click="nextCedule()">CONTINUAR</button>  
        </div>
    </div>
    <div class="animation-cedule" ng-if="vcandidates">
        <div>
            <div  class="div-tabla ">
                <img src="{{ $path . '00000027.jpg' }}" width="85">
                <span class="agrupol_desc" ng-bind="org"></span>
                <span  class="boton_regresar" ng-click="backCedule()"> REGRESAR</span>
            </div>              
            <div class="div-tab-blanco">
                <div class="contenedor-partido" ng-repeat="candidate in candidates">
                    <div class="row_cedule">
                        <div class="radio_vote" ng-click="chooseOption($index,2)" ng-class="checkOption($index,2)? 'radio_vote_check' : '' "></div>
                        <span class="personas_postul" ng-bind="candidate.order"></span>
                        <span class="agrupol_desc" ng-bind="candidate.description"></span>
                    </div>
                </div>
            </div>
        </div>      
        <br>        
        <div class="alnineador-right">
            <button type="button" class="botones_Onpe" ng-click="backCedule()">REGRESAR</button>
            <button type="button" class="botones_Onpe" ng-click="acceptCandidates()">ACEPTAR</button>
        </div>
    </div>     
    <div id="ConfirmacionElecciones" ng-if="vconfirm">
        <p>Su voto a sido a favor de:</p>
        <section  class="mostrar_por_confirmar" ng-repeat="vote in votes">
            <span class="nombre_de_eleccio" ng-bind="vote.election.description"></span>
            <article class="muestra_por_confirmar">
                <img src="{{ $path . '00000023.jpg' }}" alt="" title="" >
                <p ng-bind="vote.organization.description"></p>
                <a href="" class="cambiar_voto" ng-click="changeVote($index)"> Cambiar Voto</a>
            </article>
        </section>
        <br>
        <button type="button" class="botones_Onpe"  onClick=" window.location.href='http://vote.alexandra.dev/vote/confirm' ">CONFIRMAR</button>
    </div>
</div>   

<script> 
$( document ).scroll(function() {
    var height = $(this).scrollTop();
    if (height > 70) {
   $('#nav2').show();
    }
    else {
        $('#nav2').hide();


    }
});
</script>
<script src="{{ asset('/js/app/app.module.js') }}"></script>
<script src="{{ asset('/js/app/app.config.js') }}"></script>    
<script src="{{ asset('/js/app/vote/controllers/voteController.js') }}"></script> 

@endsection 