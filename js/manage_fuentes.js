function gestionarFuentes(){
	populateManageFuentesList();
	var options = {
  valueNames: [ 'nombre'],
  page:10,
  pagination: true
};

// Init list
var fuentesList = new List('divTablaFuentes', options);
	document.getElementById("openModalManageFuentes").click();
}


async function deleteFuente(id){
	if (confirm("¿Está seguro de borrar la fuente seleccionada?")){


		var fuente=await Fuente.getById(id);
		await fuente.delete();
		sendNotification("Fuente eliminada");
	}
}


async function populateManageFuentesList(){
	var fuentes=await Fuente.getAll();
	var html="";
	for(var i=0; i<fuentes.length;i++){
		 html+=fuentes[i].renderRow();
	}
	document.getElementById("cuerpoTablaFuentes").innerHTML=html;
}