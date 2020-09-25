function gestionarFuentes(){
	populateManageFuentesList();
	var options = {
  valueNames: [ 'numero', 'estado', 'publicador', 'direccion'],
  page:10,
  pagination: true
};

// Init list
var fuentesList = new List('divTablaFuentes', options);
	document.getElementById("openModalManageFuentes").click();
}


function deleteFuente(id){
	if (confirm("¿Está seguro de borrar la fuente seleccionada?")){


		var fuente=Fuente.getById(id);
		fuente.delete();
		sendNotification("Fuente eliminada");
	}
}


function populateManageFuentesList(){
	var fuentes=Fuente.getAll();
	var html="";
	for(var i=0; i<fuentes.length;i++){
		html+=fuentes[i].renderRow();
	}
	document.getElementById("cuerpoTablaFuentes").innerHTML=html;
}