var filtros={
  tipo:{
    fijo: true,
    celular:true
  },
  blockedFuentes:[],
  respuesta:{
    marca: true,
    ocupado:true,
    receptivo:true,
    sinInteres:true,
    noUtilizado:true
  },
  blockedGrupos:[],
  otros:{
    visualizadoHoy: true,
    llamadoSemana:true
  }
}
function onlyFijos(){
  filtros.tipo.fijo=true;
  filtros.tipo.celular=false;
  sendNotification("Filtro aplicado");
  loadNewNumber();
}
function onlyCelulares(){
   filtros.tipo.fijo=false;
  filtros.tipo.celular=true;
  sendNotification("Filtro aplicado");
  loadNewNumber();
}

function loadFiltros(){
  arrayToCheck();
  document.getElementById("openModalFiltros").click();
}
function guardarFiltros(){
  checksToArray();
  sendNotification("Filtros guardados");
  grupo=document.getElementById("selectGrupo").value;
  loadNewNumber();
}
function checksToArray(){
  //checkbox tipo
  var checkTelefonoFijo=document.getElementById("checkTelefonoFijo").checked;
  var checkTelefonoCelular=document.getElementById("checkTelefonoCelular").checked;

  //checkbox fuente

   var blockedFuentes=[];
  var checksFuentes=document.getElementsByClassName("checksFuentes");
  for(var i=0; i<checksFuentes.length;i++){
    var current=checksFuentes[i];
    if (!current.checked){
      var value=current.getAttribute("data-value");
      blockedFuentes.push(value);
    }

  }

  //checkbox respuesta
  var checkMarca=document.getElementById("checkMarca").checked;
  var checkOcupado=document.getElementById("checkOcupado").checked;
  var checkReceptivo=document.getElementById("checkReceptivo").checked;
  var checkSinInteres=document.getElementById("checkSinInteres").checked;
  var checkNoUtilizado=document.getElementById("checkNoUtilizado").checked;
  //checkbox grupo
  var blockedGrupos=[];
  var checksGrupos=document.getElementsByClassName("checksGrupo");
  for(var i=0; i<checksGrupos.length;i++){
    var current=checksGrupos[i];
    if (!current.checked){
      var value=current.getAttribute("data-value");
      blockedGrupos.push(value);
    }

  }

  //checkbox otros

  var checkVisualizado=document.getElementById("checkVisto").checked;
  var checkLlamado=document.getElementById("checkLlamado").checked;


  filtros.tipo.fijo=checkTelefonoFijo;
  filtros.tipo.celular=checkTelefonoCelular;
  
  filtros.respuesta.marca=checkMarca;
  filtros.respuesta.ocupado=checkOcupado;
  filtros.respuesta.receptivo=checkReceptivo;
  filtros.respuesta.sinInteres=checkSinInteres;
  filtros.respuesta.noUtilizado=checkNoUtilizado;
  filtros.blockedGrupos=blockedGrupos;
    filtros.blockedFuentes=blockedFuentes;
  
  filtros.otros.visualizadoHoy=checkVisualizado;
  filtros.otros.llamadoSemana=checkLlamado;


}

function arrayToCheck(){
  var checkTelefonoFijo=document.getElementById("checkTelefonoFijo").checked=filtros.tipo.fijo;
  var checkTelefonoCelular=document.getElementById("checkTelefonoCelular").checked=filtros.tipo.celular;

  //checkbox fuente
var checksFuentes=document.getElementsByClassName("checksFuentes");
  for(var i=0; i<checksFuentes.length;i++){
    var current=checksFuentes[i];
    current.checked=true;

  }


  for (var i=0; i<filtros.blockedFuentes.length;i++){
    var value=filtros.blockedFuentes[i];
    document.getElementById("checkFuente"+value).checked=false;
  }
  

  //checkbox respuesta
  document.getElementById("checkMarca").checked=filtros.respuesta.marca;
  document.getElementById("checkOcupado").checked=filtros.respuesta.ocupado;
  document.getElementById("checkReceptivo").checked=filtros.respuesta.receptivo;
  document.getElementById("checkSinInteres").checked=filtros.respuesta.sinInteres;
  document.getElementById("checkNoUtilizado").checked=filtros.respuesta.noUtilizado;
  //checkbox grupo

var checksGrupos=document.getElementsByClassName("checksGrupo");
  for(var i=0; i<checksGrupos.length;i++){
    var current=checksGrupos[i];
    current.checked=true;

  }


  for (var i=0; i<filtros.blockedGrupos.length;i++){
    var value=filtros.blockedGrupos[i];
    document.getElementById("checkGrupo"+value).checked=false;
  }
  //document.getElementById("checkGrupo0").checked=filtros.grupo.grupo0;



  //checkbox otros

  document.getElementById("checkVisto").checked=filtros.otros.visualizadoHoy;
  document.getElementById("checkLlamado").checked=filtros.otros.llamadoSemana;

}