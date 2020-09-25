function registroRapido(){
  document.getElementById("openModalRegistroRapido").click();
}

function addOneRevisita(){
	var field=document.getElementById("quickRevisitas");
	field.value=parseInt(field.value)+1;
	var publicador=document.getElementById("inputHermanoQuick").value;
	idPublicador=Publicador.getIdByName(publicador);
	Historial.insert(0,7,idPublicador,0,0);
}
function addOneEstudio(){
	var field=document.getElementById("quickEstudios");
	field.value=parseInt(field.value)+1;
	var publicador=document.getElementById("inputHermanoQuick").value;
	idPublicador=Publicador.getIdByName(publicador);
	Historial.insert(0,11,idPublicador,0,0);
}
function addOneBuzon(){
	var field=document.getElementById("quickBuzon");
	field.value=parseInt(field.value)+1;
	var publicador=document.getElementById("inputHermanoQuick").value;
	idPublicador=Publicador.getIdByName(publicador);
	Historial.insert(0,12,idPublicador,0,0);
}

function cleanActivity(){
	document.getElementById("quickRevisitas").value="0";
	document.getElementById("quickEstudios").value="0";
	document.getElementById("quickBuzon").value="0";
}