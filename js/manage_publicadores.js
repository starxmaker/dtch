async function gestionarPublicadores(){
	await populateManagePublicadoresList();
	var options = {
  valueNames: [ 'nombre'],
  page:10,
  pagination: true
};

// Init list
var publicadoresList = new List('divTablaPublicadores', options);
	document.getElementById("openModalManagePublicadores").click();
}


async function deletePublicador(id){
	if (confirm("¿Está seguro de borrar el publicador seleccionado?")){


		var publicador=await Publicador.getById(id);
		await publicador.delete();
		sendNotification("Publicador eliminado");
	}
}


async function populateManagePublicadoresList(){
	var publicadores=await Publicador.getAll();
	var html="";
	for(var i=0; i<publicadores.length;i++){
		html+=publicadores[i].renderRow();
	}
	document.getElementById("cuerpoTablaPublicadores").innerHTML=html;
}