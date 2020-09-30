function gestionarRevisitas(publicador){
	populateManageRevisitasList(publicador);
	var options = {
  valueNames: [ 'numero'],
  page:10,
  pagination: true
};

// Init list
var revisitasList = new List('divTablaRevisitas', options);
	document.getElementById("openModalManageRevisitas").click();
}


function deleteRevisita(id){
	if (confirm("¿Está seguro de liberar la revisita seleccionada")){
		var telefono=Telefono.getById(id);
		telefono.release();

		sendNotification("Revisita Liberada");
	}
}


function populateManageRevisitasList(publicador){
	var revisitas=Telefono.getRevisitasByPublicador(publicador);
	var html="";
	for(var i=0; i<revisitas.length;i++){
		html+=revisitas[i].renderRowManageRevisitas();
	}
	document.getElementById("cuerpoTablaRevisitas").innerHTML=html;
}