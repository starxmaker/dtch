function populateGroupList(){
	if(document.getElementById("selectGrupo")==null) return false;


var sel = document.getElementById('selectGrupo');
for (i = sel.length - 1; i >= 0; i--) {
  if (sel[i].value=="-2" || sel[i].value=="-1") continue;
  sel.remove(i);
}


	var grupos=Telefono.getDifferentGroups();
	for(var i=0;i<grupos.length;i++){
		var valor=grupos[i];
		var descripcion="Grupo "+valor;
		if(valor==0){
			descripcion="Otro";
		}
		var template="<option value='"+valor+"'>"+descripcion+"</option>";
		document.getElementById("selectGrupo").innerHTML+=template;
	}
}

function populatePublicadores(){
  var publicadores=Publicador.getAll();
  var choices=[];
  for (var i=0; i<publicadores.length;i++){
    choices.push(publicadores[i].nombre);
  }
  allPublicadores=choices;
}
function loadNewNumber(){
  document.activeElement.blur();
    grupo=document.getElementById("selectGrupo").value; //obtener grupo seleccionado

  document.getElementById("fldTelefono").style.visibility="hidden";
  telefono=Telefono.getLastCalled(grupo,filtros,1);
  activeTelefono=telefono;
  renderTelefono();


}
function loadNumeroPropio(){
  document.activeElement.blur();
  telefono=Telefono.getBlank();
  activeTelefono=telefono;
  renderTelefono();
}
function loadNumeroById(id){
  document.activeElement.blur();
    grupo=document.getElementById("selectGrupo").value; //obtener grupo seleccionado

  document.getElementById("fldTelefono").style.visibility="hidden";
  telefono=Telefono.getById(id)
  activeTelefono=telefono;
  renderTelefono();
}

function renderTelefono(){
  telefono=activeTelefono;
  if (timer!=null) resetTimer();
  	var isVisualizado="";
                 if (telefono.visualizado_hoy=="true"){
                    isVisualizado=" <b>(número ya se ha visualizado hoy)</b>";
                 }

                toggleRevisitaButtons();

                 //actualización de cada campo
                 var numero=telefono.numero;
                 if (telefono.id!=0) numero=formatNumero(numero);
                 var codigo_region="";
                 if(telefono.codigo_region!="") codigo_region="("+telefono.codigo_region+") ";
                document.getElementById("fldTelefono").innerHTML=codigo_region+numero;
                if (document.getElementById("fldTelefono2")!=null) document.getElementById("fldTelefono2").innerHTML=codigo_region+numero;
                if(activeTelefono.editado){
                  var numeroActual=document.getElementById("fldTelefono").innerHTML;
                  document.getElementById("fldTelefono").innerHTML ="<font color='blue'>"+numeroActual+"</font>";
                }
               
                document.getElementById("fldTelefono").style.visibility="visible"; //hace que el telefono sea visible
                document.getElementById("fldDireccion").innerHTML=telefono.direccion;
                document.getElementById("fldEstado").innerHTML=getRenderedEstados(telefono.estado)+isVisualizado;
                document.getElementById("fldPublicador").innerHTML=telefono.publicador;
                var fuente=Fuente.getById(telefono.fuente);
                document.getElementById("fldFuente").innerHTML= fuente.render(false);
               if ( document.getElementById("fldFuente2")!=null) document.getElementById("fldFuente2").innerHTML= fuente.render(true);

                var currentGrupo=telefono.grupo;
                if(currentGrupo==0)  currentGrupo="Desconocido";
                if(currentGrupo==-1)  currentGrupo="N/A";
                document.getElementById("fldGrupo").innerHTML=currentGrupo;

                if(telefono.estado==2 || telefono.estado==8 || telefono.estado==10 || telefono.estado==7){
                  document.getElementById("inputNombres").value=telefono.publicador;
                }


                //da formato a la fecha

              
                var finaldate;
                if(telefono.ultima_llamada=="0000-00-00 00:00:00"){
                    finaldate="N/A";
                    document.getElementById("fldUltimaLlamada").innerHTML=finaldate;
                }else{
                var t = telefono.ultima_llamada.split(/[- :]/);
                finaldate = t[2]+"/"+t[1]+"/"+t[0]+" a las "+t[3]+":"+t[4];

                if(telefono.llamado_esta_semana=="true"){
                    document.getElementById("fldUltimaLlamada").innerHTML="<font color='blue'><b>"+finaldate+" (menos de una semana)</b></font>";
                }else{
                        document.getElementById("fldUltimaLlamada").innerHTML=finaldate;
                }
                }
                showButtons();
                document.getElementById("btnNext").removeAttribute("disabled"); //habilita el boton siguiente para solicitar nuevo numero
                //resetTimer();
}

function toggleRevisitaButtons(){
  if(activeTelefono.id==0){
    var botonesRevisita=document.getElementsByClassName("revisitaButtons");
                    for (var i=0; i<botonesRevisita.length;i++){
                      botonesRevisita[i].style.display="block";
                    }
                    botonesRevisita[4].style.display="none";
                    var botonesPrimeraVisita=document.getElementsByClassName("primeraVisita");
                     for (var i=0; i<botonesPrimeraVisita.length;i++){
                      botonesPrimeraVisita[i].style.display="block";
                    }
    return true;
  }
  if(activeTelefono.estado==2 || activeTelefono.estado==8 || activeTelefono.estado==10 || activeTelefono.estado==7 || activeTelefono.estado==11){
                    var botonesRevisita=document.getElementsByClassName("revisitaButtons");
                    for (var i=0; i<botonesRevisita.length;i++){
                      botonesRevisita[i].style.display="block";
                    }
                    var botonesPrimeraVisita=document.getElementsByClassName("primeraVisita");
                     for (var i=0; i<botonesPrimeraVisita.length;i++){
                      botonesPrimeraVisita[i].style.display="none";
                    }
                 }else{
                     var botonesRevisita=document.getElementsByClassName("revisitaButtons");
                    for (var i=0; i<botonesRevisita.length;i++){
                      botonesRevisita[i].style.display="none";
                    }
                    var botonesPrimeraVisita=document.getElementsByClassName("primeraVisita");
                     for (var i=0; i<botonesPrimeraVisita.length;i++){
                      botonesPrimeraVisita[i].style.display="block";
                    }
                 }
}
function showButtons(){
    var botones=document.getElementsByTagName("button");
    var i;
    for (i=0; i<botones.length;i++){

        botones[i].style.visibility="visible";
    }
     var startDOM=document.getElementsByClassName("hiddenAtStart");
      var i;
    for (i=0; i<startDOM.length;i++){

        startDOM[i].style.visibility="visible";
    }
}

function actualizarEstado(estado){
  var publicador = document.getElementById("inputNombres").value;
  var tiempo=chronometer;
    activeTelefono.updateEstado(estado, publicador,tiempo);
    checkAvailableQuantity();
    renderTelefono();
}

//funciones de cada boton
function revisita(){
    var estado=2;
    actualizarEstado(estado);
}
function sinInteres(){
  var estado=1;
  actualizarEstado(estado);
}
function receptivo(){
  var estado=6;
  actualizarEstado(estado);
}
function noLlamar(){
  var estado=3;
  actualizarEstado(estado);
}
function noContesta(){
    var estado=4;
    actualizarEstado(estado);
    
}
function ocupado(){
  var estado=9;
  actualizarEstado(estado);
  
}
function noExiste(){
  var estado=5
  actualizarEstado(estado);
}

function revisitaExitosa(){
  var estado=7;
  actualizarEstado(estado);

}
function ultimaRevisita(){
  var estado=8;
  actualizarEstado(estado);

}
function revisitaNoEncontrada(){
  var estado=10;
  actualizarEstado(estado);
}
function estudio(){
  var estado=11;
  actualizarEstado(estado);

}
function buzon(){
  var estado=12;
  actualizarEstado(estado);

}
function liberarRevisita(){
  var estado=1;
  actualizarEstado(estado);

}

function siguiente(){
  if(activeTelefono.id==0){
    loadNewNumber();
    return false;
  } 
      document.getElementById("btnNext").setAttribute("disabled", "true"); //deshabilita temporalmente el boton siguiente
    if(!activeTelefono.editado){
      noContesta();

    }
    loadNewNumber();
    
}

function loadHistory(){
  

  
                var registros= Historial.getLastCalls(50);
                var html="";

                for (var i=0; i<registros.length;i++){
                  html+=registros[i].render();
                }
                
                

               
                document.getElementById("listaHistorialGeneral").innerHTML=html;
                 document.getElementById("openModalHistorial").click();
        


}


function deleteHistoryRecord(id){
  var record=Historial.getById(id);
  record.delete();
}

function checkAvailableQuantity(){
  var cantidad=Telefono.checkAvailableNumbers();
  document.getElementById("availableQuantity").innerHTML=cantidad;
}