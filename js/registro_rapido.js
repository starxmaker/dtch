function registroRapido(){
  document.getElementById("openModalRegistroRapido").click();
}

function agregarRegistroRapido(){
  var hermano=document.getElementById("inputHermanoQuick").value;
  var actividad=document.getElementById("inputActividadQuick").value;
  var cantidad=document.getElementById("inputCantidadQuick").value;
  if(hermano.trim()=="" || cantidad.trim()=="" || cantidad<1) return false;
 	var idPublicador=Publicador.getIdByName(hermano);

   Historial.quickEntries(idPublicador, actividad, cantidad);
          document.getElementById("inputActividadQuick").value="7";
  document.getElementById("inputCantidadQuick").value="";
  document.getElementById("inputHermanoQuick").select();
            sendNotification("Registro agregado");        


  

}


