@extends('layout')

@section('content')
    	<div class="wrapper">
    	<h2 class="titulo_rojo">Su voto ha sido registrado satisfactoriamente.</h2>
    	<h3 >Para verificar su voto guarde la siguiente informaci&oacute;n</h3>
    	<p  class="titulo_rojo"class="p-time"><strong>Hora: {{ $time }}</strong></p>

       <div class="contenido_centrado">

    	@foreach($votes as $vote)
    	<div class="contenedor_confirmaciones titulo_eleccio">
    	<h3 class="titulo_azul">{{ $vote->election_desc }}</h3>

	    <div class="contenedor_confirma">
	    	<img  class="img_partido_confirmado" src="../../img/simbols/00000048.jpg" >
	    	<br>
	    	<p >Organizacion:</p>
	    	<p class="titulo_azul">{{ $vote->organization_desc }}</p>
	    	<br>
	    	<p>C&oacute;digo:</p>
	    	<p class="titulo_azul">{{ $vote->code }}</p>
	    </div>   </div> 
	    @endforeach
	    <br>
	    <button onClick=" window.location.href='{{ $url }}' " class="botones_Onpe btn_confirm">SALIR</button>
    </div>   
    </div> 
    
    </div>
@endsection