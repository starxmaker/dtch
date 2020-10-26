function openModalNuevaFuente(){
	document.getElementById("openModalNuevaFuente").click();
}

async function agregarFuente(){

	var nombre=document.getElementById("inputNombreFuente").value;
	var color=document.getElementById("inputColorFuente").value;
	var descripcion=document.getElementById("inputDescripcionFuente").value;
	if (nombre.trim()=="" || color.trim()==""|| descripcion.trim()=="") return false;
	await Fuente.insert(nombre, color,descripcion);
	sendNotification("Fuente agregada");
	document.getElementById("inputNombreFuente").value="";
	document.getElementById("inputColorFuente").value="";
	document.getElementById("inputDescripcionFuente").value="";
	await populateFuentes();
}