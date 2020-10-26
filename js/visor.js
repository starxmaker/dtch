
function loadProfile(profile){


  filtros.respuesta.revisita=false;
      filtros.respuesta.revisitaPublisher=0;
      filtros.respuesta.marca=true;
    filtros.respuesta.ocupado=true;
    filtros.respuesta.receptivo=true;
    filtros.respuesta.sinInteres=true;
    filtros.respuesta.noUtilizado=true;


  var publisher=choicesNombreMain.getValue()
  if (profile==4 && (publisher.value=="" || publisher.value=="0")){
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
    choicesNombreVisor.setChoiceByValue(publisher.value)
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
    choicesNombreMain.setChoiceByValue(0)
    choicesNombreVisor.setChoiceByValue(0)
    
  }
  document.getElementById("mainBody").style.display="block"
  document.getElementById("visorBody").style.display="none"
  return true


}
async function populateGroupList(){
	if(document.getElementById("selectGrupo")==null) return false;


var sel = document.getElementById('selectGrupo');
for (i = sel.length - 1; i >= 0; i--) {
  if (sel[i].value=="-2" || sel[i].value=="-1") continue;
  sel.remove(i);
}
var tiempoAbierto;

  var html="<label for='inputNumero'>Grupos</label>";
	var grupos=await Telefono.getDifferentGroups();
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

const populatePublicadores= async() =>{
   allPublicadores=[{
    value:0,
    label:"No especificado",
    selected:true,
    disabled:true
   }]
  var publicadores=await Publicador.getAll();
  

  publicadores.map(item=>{
    let currentItem={
    value:item.id,
    label:item.nombre,
    selected:false,
    disabled:false
   }
    allPublicadores.push(currentItem)
  })
 
  initChoices()
}
async function loadNewNumber(){
  window.clearInterval();
  document.activeElement.blur();

  document.getElementById("fldTelefono").style.visibility="hidden";
  let grupo=document.getElementById("selectGrupo").value
  telefono=await Telefono.getLastCalled(grupo,filtros,1);

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
async function loadNumeroById(id){

   if (activeTelefono.id!=0 && !activeTelefono.editado){
    if (!confirm("No se ha actualizado el número actual. ¿Seguro que desea continuar?")){
      return false;
    }else{
      activeTelefono.editado=true
    }
  }


  window.clearInterval();
  document.activeElement.blur();

  document.getElementById("fldTelefono").style.visibility="hidden";

  telefono=await Telefono.getById(id);
  activeTelefono=telefono;
  choicesNombreMain.setChoiceByValue(telefono.publicador)
    choicesNombreVisor.setChoiceByValue(telefono.publicador)
    filtros.perfil=4
  document.getElementById("mainBody").style.display="none"
  document.getElementById("visorBody").style.display="block"

  tiempoAbierto=getCurrentDatetime();
  window.setInterval(function(){
 abiertoSince();
}, 5000);
  renderTelefono();
}

const addPublicador= async() =>{
  var person = prompt("Ingrese el nombre del nuevo publicador");

if (person != null) {
  let result=await Publicador.getIdByName(person.trim())
  if (result==0 || result == null){
    let newPublicador=await Publicador.insertNewPublicador(person)

    await populatePublicadores()
    

    sendNotification("Publicador agregado")
  }else{
    sendNotification("Publicador ya está registrado", "error")
  }
}
}
async function renderTelefono(){
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
                var fuente=await Fuente.getById(telefono.fuente);
                document.getElementById("fldFuente").value = fuente.nombre
                 document.getElementById("fldFuente").style.color=fuente.color
               if ( document.getElementById("fldFuente2")!=null) document.getElementById("fldFuente2").innerHTML= fuente.render(true);

                var currentGrupo=telefono.grupo;
                if(currentGrupo==0)  currentGrupo="Desconocido";
                if(currentGrupo==-1)  currentGrupo="N/A";
                if ( document.getElementById("fldGrupo")!=null) document.getElementById("fldGrupo").innerHTML=currentGrupo;


                document.getElementById("fldTipoCurrent").value=filtros.perfil
        
                 
                


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

async function actualizarEstado(estado){
  var publicador = document.getElementById("inputNombres").value;
  if (publicador==0 || publicador==""){
    sendNotification("Seleccione un publicador", "error")
    return false;
  }
  var tiempo=chronometer;
    await activeTelefono.updateEstado(estado, publicador,tiempo);
    await checkAvailableQuantity();
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
async function noContesta(){
    var estado=4;
    await actualizarEstado(estado);
    
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

async function siguiente(){
      document.getElementById("btnNext").setAttribute("disabled", "true"); //deshabilita temporalmente el boton siguiente
    if(!activeTelefono.editado){
      await noContesta();

    }
    loadProfile(filtros.perfil)
    
}

async function loadHistory(){
  var registros= await Historial.getLastCalls(50);
  var html="";
  for (var i=0; i<registros.length;i++){
                  html+=registros[i].render();
                }
                
                

               
                document.getElementById("listaHistorialGeneral").innerHTML=html;
                 document.getElementById("openModalHistorial").click();
        


}


async function deleteHistoryRecord(id){
  var record=await Historial.getById(id);
  await record.delete();
}

async function checkAvailableQuantity(){
  var cantidad=await Telefono.checkAvailableNumbers();
  document.getElementById("availableQuantity2").innerHTML=cantidad;
}
function openMoreInfo(){
  if (document.getElementById("divMoreInfo").style.display=="none"){
    document.getElementById("divMoreInfo").style.display="block";
  }else{
    document.getElementById("divMoreInfo").style.display="none";
  }
}

function initChoices(){
  let opps={
    position:"bottom",
    choices: allPublicadores,
    noResultsText: 'Sin resultados',
    noChoicesText: 'Sin elementos',
    itemSelectText: 'Pulse para seleccionar',
  }

  if(choicesNombreMain!=undefined){
    choicesNombreMain.destroy()
    choicesNombreLista.destroy()
    choicesNombreRegistro.destroy()
    choicesNombreVisor.destroy()
  }
     var element = document.querySelector('#inputNombres');
      choicesNombreMain = new Choices(element,opps);
     var element2 = document.querySelector('#inputNombresEspera');
      choicesNombreLista = new Choices(element2,opps);
      var element3= document.querySelector("#inputNombresQuick")
      choicesNombreRegistro=new Choices(element3,opps)
      var element4=document.querySelector("#inputNombresVisor")
      choicesNombreVisor=new Choices(element4, opps)



element2.addEventListener(
  'change',
  function(event) {
    agregarNombre(event.detail.value)
    //choicesNombreLista.setChoiceByValue(0)
  },
  false,
);
element3.addEventListener(
  'change',
  function(event){
    cleanActivity()
  }, false)
element4.addEventListener(
  'change',
  function(event){

    choicesNombreMain.setChoiceByValue(event.detail.value)
  }, false)


    
}
let choicesNombreMain, choicesNombreVisor, choicesNombreLista, choicesNombreRegistro

function hideFiltroGrupo(){
  if(!settings.filtrarGrupo){
   document.getElementById("divFldGrupo").style.display="none"
}else{
   document.getElementById("divFldGrupo").style.display="block"
}
}

function changeTipoCurrent(){
  if (activeTelefono.id!=0 && !activeTelefono.editado){
    if (!confirm("No se ha actualizado el número actual. ¿Seguro que desea volver?")){
      return false;
    }else{
      activeTelefono.editado=true
    }
  }




      let prof=document.getElementById("fldTipoCurrent").value
      let publish=document.getElementById("inputNombres").value
      if(prof==4 && (publish==0 || publish=="")){
        document.getElementById("fldTipoCurrent").value=0
        sendNotification("Seleccione un publicador", "error")
      }else{
  loadProfile(prof)
}
  
}