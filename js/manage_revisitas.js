async function gestionarRevisitas(publicador){
	var currentPublicador=await Publicador.getById(publicador);
	document.getElementById("labelPublicadorManageRevisita").innerHTML=currentPublicador.nombre;
	document.getElementById("botonCompartirRevisitas").setAttribute("data-identificador", publicador);
	await populateManageRevisitasList(publicador);
	var options = {
  valueNames: [ 'numero'],
  page:10,
  pagination: true
};

// Init list
var revisitasList = new List('divTablaRevisitas', options);
	document.getElementById("openModalManageRevisitas").click();
}


async function deleteRevisita(id){
	if (confirm("¿Está seguro de liberar la revisita seleccionada")){
		var telefono=await Telefono.getById(id);
		await telefono.release();

		sendNotification("Revisita Liberada");
		var idPublicador=document.getElementById("botonCompartirRevisitas").getAttribute("data-identificador");
		await populateManageRevisitasList(idPublicador);
	}
}


async function populateManageRevisitasList(publicador){
	var revisitas=await Telefono.getRevisitasByPublicador(publicador);
	var html="";
	for(var i=0; i<revisitas.length;i++){
		html+=revisitas[i].renderRowManageRevisitas();
	}
	document.getElementById("cuerpoTablaRevisitas").innerHTML=html;
}

async function shareRevisitas(){
	var idPublicador=document.getElementById("botonCompartirRevisitas").getAttribute("data-identificador");
	var currentPublicador=await Publicador.getById(idPublicador);

	var messageRaw=["Revisitas de "+currentPublicador.nombre];

	var revisitas=await Telefono.getRevisitasByPublicador(idPublicador);
	for(var i=0; i<revisitas.length;i++){
		messageRaw.push(revisitas[i].numero);
	}
	var message=messageRaw.join("%0A");
    sendWhatsAppMessage(message);
}