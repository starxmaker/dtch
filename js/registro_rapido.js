function registroRapido(){
  document.getElementById("openModalRegistroRapido").click();
}

async function addOneRevisita(){
	var field=document.getElementById("quickRevisitas");
	field.value=parseInt(field.value)+1;
	var publicador=document.getElementById("inputNombresQuick").value;
	if (publicador=="" || publicador==0) return false;
	await Historial.insert(0,7,publicador,0,1);
}
async function addOneEstudio(){
	var field=document.getElementById("quickEstudios");
	field.value=parseInt(field.value)+1;
	var publicador=document.getElementById("inputNombresQuick").value;
	if (publicador=="" || publicador==0) return false;
	await Historial.insert(0,11,publicador,0,1);
}
async function addOneBuzon(){
	var field=document.getElementById("quickBuzon");
	field.value=parseInt(field.value)+1;
	var publicador=document.getElementById("inputNombresQuick").value;
	if (publicador=="" || publicador==0) return false;
	await Historial.insert(0,12,publicador,0,1);
}
async function addOneInteresado(){
	var field=document.getElementById("quickInteresado");
	field.value=parseInt(field.value)+1;
	var publicador=document.getElementById("inputNombresQuick").value;
	if (publicador=="" || publicador==0) return false;
	await Historial.insert(0,2,publicador,0,1);
}
async function addOneLlamada(){
	var field=document.getElementById("quickLlamadas");
	field.value=parseInt(field.value)+1;
	var publicador=document.getElementById("inputNombresQuick").value;
	if (publicador=="" || publicador==0) return false;
	await Historial.insert(0,4,publicador,0,1);
}

function cleanActivity(){
	document.getElementById("quickLlamadas").value="0";
	document.getElementById("quickRevisitas").value="0";
	document.getElementById("quickEstudios").value="0";
	document.getElementById("quickBuzon").value="0";
	document.getElementById("quickInteresado").value="0";
}