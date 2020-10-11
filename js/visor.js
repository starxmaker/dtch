
function handleSelectPicker(index, value){

  let elem=document.getElementsByClassName("filter-option-inner-inner")[index]
  if (elem!=undefined) elem.innerHTML=value
    
}
function loadProfile(profile){


  filtros.respuesta.revisita=false;
      filtros.respuesta.revisitaPublisher=0;
      filtros.respuesta.marca=true;
    filtros.respuesta.ocupado=true;
    filtros.respuesta.receptivo=true;
    filtros.respuesta.sinInteres=true;
    filtros.respuesta.noUtilizado=true;


  let publisher=document.getElementById("inputNombres").value
  if (publisher=="" || publisher=="0"){
    sendNotification("Seleccione un publicador", "error")
    return false;
  }
  filtros.perfil=profile;

    if(profile==0){
      loadNumeroPropio()
    }
    if(profile==1){
      filtros.tipo.fijo=true;
      filtros.tipo.celular=false;
      loadNewNumber();

    }
     if(profile==2){
      filtros.tipo.fijo=false;
      filtros.tipo.celular=true;
      loadNewNumber();
    }
     if(profile==3){
      filtros.tipo.fijo=true;
      filtros.tipo.celular=true;
      loadNewNumber();

    }
    if (profile==4){
      filtros.respuesta.revisita=true;
      filtros.respuesta.revisitaPublisher=publisher;
      filtros.respuesta.marca=false;
    filtros.respuesta.ocupado=false;
    filtros.respuesta.receptivo=false;
    filtros.respuesta.sinInteres=false;
    filtros.respuesta.noUtilizado=false;
      loadNewNumber()
    }
  let publica=Publicador.getById(publisher)
  let namePublisher=publica.nombre
  if (publica.nombre!=undefined) document.getElementById("fldCurrentPublicador").value=namePublisher
  document.getElementById("mainBody").style.display="none"
  document.getElementById("visorBody").style.display="block"
}

function returnToQuickMenu(refresh){

  if (activeTelefono.id!=0 && !activeTelefono.editado){
    if (!confirm("No se ha actualizado el número actual. ¿Seguro que desea volver?")){
      return false;
    }else{
      activeTelefono.editado=true
    }
  }
  
  if (refresh){
    handleSelectPicker(0,"No especificado")
    document.getElementById("inputNombres").value=0
    
  }
  document.getElementById("mainBody").style.display="block"
  document.getElementById("visorBody").style.display="none"
  return true


}
function populateGroupList(){
	if(document.getElementById("selectGrupo")==null) return false;


var sel = document.getElementById('selectGrupo');
for (i = sel.length - 1; i >= 0; i--) {
  if (sel[i].value=="-2" || sel[i].value=="-1") continue;
  sel.remove(i);
}
var tiempoAbierto;

  var html="<label for='inputNumero'>Grupos</label>";
	var grupos=Telefono.getDifferentGroups();
	for(var i=0;i<grupos.length;i++){
		var valor=grupos[i];
		var descripcion="Grupo "+valor;
		if(valor==0){
			descripcion="Otro";
		}
		var template="<option value='"+valor+"'>"+descripcion+"</option>";
		document.getElementById("selectGrupo").innerHTML+=template;

    html+="<div class='form-check'><input type='checkbox' class='form-check-input checksGrupo' id='checkGrupo"+valor+"' data-value='"+valor+"' checked='true'> <label class='form-check-label' for='checkTelefonoCelular'>"+descripcion+"</label></div>";
	}
  if(document.getElementById("divChecksGrupos")!=null) document.getElementById("divChecksGrupos").innerHTML=html;
}

function abiertoSince(){
  document.getElementById("fldAbierto").innerHTML=timeSince(tiempoAbierto);
}

function populatePublicadores(){
  var publicadores=Publicador.getAll();
  allPublicadores=publicadores
  const elem=document.getElementById("inputNombres")
  const elem2=document.getElementById("inputNombresEspera")
   const elem3=document.getElementById("inputNombresQuick")

  if (elem==undefined) return false
  elem.innerHTML="<option value='0' selected='true' disabled>No especificado</option>"

if (elem2==undefined) return false
  elem2.innerHTML="<option value='0' selected='true' disabled>No especificado</option>"
if (elem3==undefined) return false
  elem3.innerHTML="<option value='0' selected='true' disabled>No especificado</option>"

  allPublicadores.map(item=>{
    elem.innerHTML+="<option value='"+item.id+"'>"+item.nombre+"</option>"
    elem2.innerHTML+="<option value='"+item.id+"'>"+item.nombre+"</option>"
     elem3.innerHTML+="<option value='"+item.id+"'>"+item.nombre+"</option>"
  })
}
function loadNewNumber(){
  window.clearInterval();
  document.activeElement.blur();

  document.getElementById("fldTelefono").style.visibility="hidden";
  let grupo=document.getElementById("selectGrupo").value
  telefono=Telefono.getLastCalled(grupo,filtros,1);

  activeTelefono=telefono;
  tiempoAbierto=getCurrentDatetime();
  window.setInterval(function(){
 abiertoSince();
}, 5000);

  renderTelefono();


}
function loadNumeroPropio(){
  window.clearInterval();
  document.activeElement.blur();
  telefono=Telefono.getBlank();
  activeTelefono=telefono;
  tiempoAbierto=getCurrentDatetime();
  window.setInterval(function(){
 abiertoSince();
}, 1000);
  renderTelefono();
}
function loadNumeroById(id){

  window.clearInterval();
  document.activeElement.blur();

  document.getElementById("fldTelefono").style.visibility="hidden";

  telefono=Telefono.getById(id);
  activeTelefono=telefono;
  let currentPublisher=Publicador.getById(telefono.publicador)
  if (currentPublisher.nombre!=undefined ) document.getElementById("fldCurrentPublicador").value=currentPublisher.nombre
    document.getElementById("inputNombres").value=telefono.publicador
  if (currentPublisher.nombre!=undefined ) handleSelectPicker(0, currentPublisher.nombre)
    filtros.perfil=4
  document.getElementById("mainBody").style.display="none"
  document.getElementById("visorBody").style.display="block"

  tiempoAbierto=getCurrentDatetime();
  window.setInterval(function(){
 abiertoSince();
}, 5000);
  renderTelefono();
}

function addPublicador(context){
  var person = prompt("Ingrese el nombre del nuevo publicador");

if (person != null) {
  let result=Publicador.getIdByName(person.trim())
  if (result==0){
    let newPublicador=Publicador.insertNewPublicador(person)

    populatePublicadores()
    $('#inputNombres').selectpicker('refresh');
    $('#inputNombresEspera').selectpicker('refresh');
    if(context=="visor"){
    document.getElementById("inputNombres").value=newPublicador.id
    handleSelectPicker(0,newPublicador.nombre)
    }
  if (context=="espera"){
    document.getElementById("inputNombresEspera").value=newPublicador.id
    handleSelectPicker(1,newPublicador.nombre)
  }
  if (context=="registro"){
    document.getElementById("inputNombresQuick").value=newPublicador.id
    handleSelectPicker(2,newPublicador.nombre)
  }

    sendNotification("Publicador agregado")
  }else{
    sendNotification("Publicador ya está registrado", "error")
  }
}
}
function renderTelefono(){
  telefono=activeTelefono;
  if (timer!=null) resetTimer();

                toggleRevisitaButtons();

                 //actualización de cada campo
                 var numero=telefono.numero;
                 if (telefono.id!=0) numero=formatNumero(numero);
                 var codigo_region="";
                 if(telefono.tipo==0) codigo_region="("+telefono.codigo_region+") ";
                document.getElementById("fldTelefono").innerHTML=codigo_region+numero;
                if (document.getElementById("fldTelefono2")!=null) document.getElementById("fldTelefono2").innerHTML=codigo_region+numero;
                if(activeTelefono.editado){
                  var numeroActual=document.getElementById("fldTelefono").innerHTML;
                  document.getElementById("fldTelefono").innerHTML ="<font color='blue'>"+numeroActual+"</font>";
                }
               
                document.getElementById("fldTelefono").style.visibility="visible"; //hace que el telefono sea visible
                if (document.getElementById("fldDireccion")!=null) document.getElementById("fldDireccion").innerHTML=telefono.direccion;
                var fuente=Fuente.getById(telefono.fuente);
                document.getElementById("fldFuente").value = fuente.nombre
                 document.getElementById("fldFuente").style.color=fuente.color
               if ( document.getElementById("fldFuente2")!=null) document.getElementById("fldFuente2").innerHTML= fuente.render(true);

                var currentGrupo=telefono.grupo;
                if(currentGrupo==0)  currentGrupo="Desconocido";
                if(currentGrupo==-1)  currentGrupo="N/A";
                if ( document.getElementById("fldGrupo")!=null) document.getElementById("fldGrupo").innerHTML=currentGrupo;

                let currentTipo="Propio"
                if (filtros.perfil==1) currentTipo="Sólo fijos"
                  if (filtros.perfil==2) currentTipo="Sólo celulares"
                    if (filtros.perfil==3) currentTipo="Fijos y celulares"
                      if (filtros.perfil==4) currentTipo="Guardados"

                document.getElementById("fldTipoCurrent").value=currentTipo
        
                 
                


                //da formato a la fecha

              
                var finaldate;
                if(telefono.ultima_llamada=="0000-00-00 00:00:00"){
                    finaldate="N/A";
                    document.getElementById("fldUltimaLlamada").value=estados[telefono.estado][1]+" (Desconocido)";
                    document.getElementById("fldUltimaLlamada").style.color=estados[telefono.estado][0]
                }else{
                var t = telefono.ultima_llamada.split(/[- :]/);
                finaldate = t[2]+"/"+t[1]+"/"+t[0];

                if(telefono.llamado_esta_semana=="true"){
                    document.getElementById("fldUltimaLlamada").value=estados[telefono.estado][1]+" ("+finaldate+") (menos de una semana)";
                    document.getElementById("fldUltimaLlamada").style.color="blue"
                }else{
                        document.getElementById("fldUltimaLlamada").value=estados[telefono.estado][1]+" ("+finaldate+")";
                        document.getElementById("fldUltimaLlamada").style.color=estados[telefono.estado][0]
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
      document.getElementById("btnNext").setAttribute("disabled", "true"); //deshabilita temporalmente el boton siguiente
    if(!activeTelefono.editado){
      noContesta();

    }
    loadProfile(filtros.perfil)
    
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
function openMoreInfo(){
  if (document.getElementById("divMoreInfo").style.display=="none"){
    document.getElementById("divMoreInfo").style.display="block";
  }else{
    document.getElementById("divMoreInfo").style.display="none";
  }
}