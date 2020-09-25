function gestionarPublicadores(){
	populateManagePublicadoresList();
	var options = {
  valueNames: [ 'nombre'],
  page:10,
  pagination: true
};

// Init list
var publicadoresList = new List('divTablaPublicadores', options);
	document.getElementById("openModalManagePublicadores").click();
}


function deletePublicador(id){
	if (confirm("¿Está seguro de borrar el publicador seleccionado?")){


		var publicador=Publicador.getById(id);
		publicador.delete();
		sendNotification("Publicador eliminado");
	}
}


function populateManagePublicadoresList(){
	var publicadores=Publicador.getAll();
	var html="";
	for(var i=0; i<publicadores.length;i++){
		html+=publicadores[i].renderRow();
	}
	document.getElementById("cuerpoTablaPublicadores").innerHTML=html;
}