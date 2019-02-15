
/*Función que ejecuta la busqueda de informacion*/
var resultado = document.getElementById('contenido');

function mostrarDatos(ciudad, tipo, precioMin, precioMax){

//alert('Precio '+precioMin);

  var xmlhttp;

  if (window.XMLHttpRequest){
    xmlhttp = new XMLHttpRequest();
  }else{
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
      var datos = JSON.parse(xmlhttp.responseText);
      var mostrar = false; //Esta variable registra si el item se debe bostrar o no

      resultado.innerHTML = "";

      for (var i in datos){
        if (ciudad == "" || datos[i].Ciudad == ciudad){
          if (tipo == "" || datos[i].Tipo == tipo){
            var precio = datos[i].Precio.replace(',','');
            precio = (precio.substring(1,(precio.length)));
            if ((precioMin == 0 && precioMax ==0) || (precio >= precioMin && precio <= precioMax)){
              mostrar = true;
            }
          }
        }

        if (mostrar){
          resultado.innerHTML +=  '<div class="tituloContenido card itemMostrado">'+
                                  '  <img src="img/home.jpg" class="responsive-img" >'+
                                  '  <div class="card-stacked">'+
                                  '    <p>'+
                                  '      <b>Dirección:</b>'+ datos[i].Direccion +'<br>'+
                                  '      <b>Ciudad:</b>'+ datos[i].Ciudad +'<br>'+
                                  '      <b>Teléfono:</b>'+ datos[i].Telefono +'<br>'+
                                  '      <b>Código postal:</b>'+ datos[i].Codigo_Postal +'<br>'+
                                  '      <b>Tipo:</b>'+ datos[i].Tipo +'<br>'+
                                  '      <b>Precio:</b> <span class="precioTexto">'+ datos[i].Precio +'</span> <br>'+
                                  '    </p>'+
                                  '    <div class="card-action">'+
                                  '      <a href="">VER MAS</a>'+
                                  '    </div>'+
                                  '  </div>'+
                                  '</div>';
          mostrar = false;
        }
      }
    }
  }

  xmlhttp.open('GET','data-1.json', true);
  xmlhttp.send();

}
/*
  Creación de una función personalizada para jQuery que detecta cuando se detiene el scroll en la página
*/

$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};

/*
  Función que inicializa el elemento Slider
*/
function inicializarSlider(){
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 200,
    to: 80000,
    prefix: "$"
  });
}
/*
  Función que reproduce el video de fondo al hacer scroll, y deteiene la reproducción al detener el scroll
*/
function playVideoOnScroll(){
  var ultimoScroll = 0,
      intervalRewind;
  var video = document.getElementById('vidFondo');
  $(window)
    .scroll((event)=>{
      var scrollActual = $(window).scrollTop();
      if (scrollActual > ultimoScroll){
       video.play();
     } else {
        //this.rewind(1.0, video, intervalRewind);
        video.play();
     }
     ultimoScroll = scrollActual;
    })
    .scrollEnd(()=>{
      video.pause();
    }, 10)
}

function cargaListas(){
  var xmlhttp;

  if (window.XMLHttpRequest){
    xmlhttp = new XMLHttpRequest();
  }else{
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200){
      var datos = JSON.parse(xmlhttp.responseText);
      var ciudades = new Array();
      var tipos = new Array();

      for (var i in datos){
        var ciudadLista = false;
        var tiposLista = false;
        //Ciclo que carga la lista unica de ciudades
        for (var j in ciudades){
          if (datos[i].Ciudad == ciudades[j]){
            ciudadLista = true;
          }
          if (datos[i].Tipo == tipos[j]){
            tiposLista = true;
          }
          if (tiposLista && ciudadLista){
            break;
          }
        }

        if (ciudadLista == false){
          ciudades[ciudades.length++] = datos[i].Ciudad;
        }
        if (tiposLista == false){
          tipos[tipos.length++] = datos[i].Tipo;
        }
      }
      //Se crea la lista de seleccion de Ciudades
      for (i in ciudades){
        $("#selectCiudad").append('<option value="'+ciudades[i]+'">' + ciudades[i]+'</option>');
      }
      $('#selectCiudad').material_select();

      //Se crea la lista de seleccion de tipos
      for (i in tipos){
        $("#selectTipo").append('<option value="'+tipos[i]+'">' + tipos[i]+'</option>');
      }
      $('#selectTipo').material_select();
    }
  }

  xmlhttp.open('GET','./data-1.json', true);
  xmlhttp.send();

}
//Función que devuelve la posición del ; del rango de montos
function posicionCaracter(cadena, caracter){
  for (var i = 0; i < cadena.length; i++) {
    if (cadena[i]==caracter){
      return i;
    }
  }
}

//Función que atrapa el click del boton mostrar todos

$(function(){
  $("#mostrarTodos").on("click", function(){
    var ciudad = "";
    var tipo = "";
    var precioInf = 0;
    var precioSup = 0;
    mostrarDatos(ciudad, tipo, precioInf, precioSup);
  });

  $('#formulario').submit(function(){
    var ciudad = $('form').find('select[name="ciudad"]').val();
    var tipo = $('form').find('select[name="tipo"]').val();
    var precio = $('form').find('input[name="precio"]').val();
    event.preventDefault();
    $.ajax({
      url: 'buscador.php',
      type: 'POST',
      data: {ciudad: ciudad, tipo: tipo, precio: precio },
      success: function(data){

        var indice = posicionCaracter(precio,';');
        var largoPrecio = precio.length;
        var precioInf = precio.substring(0,indice);
        var precioSup = precio.substring(indice+1,largoPrecio);

        mostrarDatos(ciudad, tipo, precioInf, precioSup);

      }
    }).done (function(data){
//      alert(data);
    })
  });
});

//Llamado a la función que carga la lista de ciudades
$(document).ready(function() {
  cargaListas();

});

inicializarSlider();
playVideoOnScroll();
