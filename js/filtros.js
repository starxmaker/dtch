var filtros={
  tipo:{
    fijo: true,
    celular:true
  },
  fuente:{
  },
  respuesta:{
    marca: true,
    ocupado:true,
    receptivo:true,
    sinInteres:true,
    noUtilizado:true
  },
  grupo:{
  },
  otros:{
    visualizadoHoy: true,
    llamadoSemana:true
  }
}
function onlyFijos(){
  filtros.tipo.fijo=true;
  filtros.tipo.celular=false;
  sendNotification("Filtro aplicado");
}
function onlyCelulares(){
   filtros.tipo.fijo=false;
  filtros.tipo.celular=true;
  sendNotification("Filtro aplicado");
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
  //checkbox respuesta
  var checkMarca=document.getElementById("checkMarca").checked;
  var checkOcupado=document.getElementById("checkOcupado").checked;
  var checkReceptivo=document.getElementById("checkReceptivo").checked;
  var checkSinInteres=document.getElementById("checkSinInteres").checked;
  var checkNoUtilizado=document.getElementById("checkNoUtilizado").checked;
  //checkbox grupo



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
  //filtros.grupo.grupo0=checkGrupo0;
  
  filtros.otros.visualizadoHoy=checkVisualizado;
  filtros.otros.llamadoSemana=checkLlamado;


}

function arrayToCheck(){
  var checkTelefonoFijo=document.getElementById("checkTelefonoFijo").checked=filtros.tipo.fijo;
  var checkTelefonoCelular=document.getElementById("checkTelefonoCelular").checked=filtros.tipo.celular;

  //checkbox fuente

  

  //checkbox respuesta
  document.getElementById("checkMarca").checked=filtros.respuesta.marca;
  document.getElementById("checkOcupado").checked=filtros.respuesta.ocupado;
  document.getElementById("checkReceptivo").checked=filtros.respuesta.receptivo;
  document.getElementById("checkSinInteres").checked=filtros.respuesta.sinInteres;
  document.getElementById("checkNoUtilizado").checked=filtros.respuesta.noUtilizado;
  //checkbox grupo
  //document.getElementById("checkGrupo0").checked=filtros.grupo.grupo0;



  //checkbox otros

  document.getElementById("checkVisto").checked=filtros.otros.visualizadoHoy;
  document.getElementById("checkLlamado").checked=filtros.otros.llamadoSemana;

}