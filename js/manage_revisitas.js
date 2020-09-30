function gestionarRevisitas(publicador){
	var currentPublicador=Publicador.getById(publicador);
	document.getElementById("labelPublicadorManageRevisita").innerHTML=currentPublicador.nombre;
	document.getElementById("botonCompartirRevisitas").setAttribute("data-identificador", publicador);
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

function shareRevisitas(){
	var idPublicador=document.getElementById("botonCompartirRevisitas").getAttribute("data-identificador");
	var currentPublicador=Publicador.getById(idPublicador);

	var messageRaw=["Revisitas de "+currentPublicador.nombre];

	var revisitas=Telefono.getRevisitasByPublicador(idPublicador);
	for(var i=0; i<revisitas.length;i++){
		messageRaw.push(revisitas[i].numero);
	}
	var message=messageRaw.join("%0A");
    sendWhatsAppMessage(message);
}