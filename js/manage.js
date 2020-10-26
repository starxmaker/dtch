
async function deleteTelefono(id){
	if (confirm("¿Está seguro de borrar el número seleccionado?")){


		var telefono=await Telefono.getById(id);
		await telefono.delete();
		sendNotification("Número eliminado");
	}
}
async function openManage(){

	

	await populateManageList();
	var options = {
  valueNames: [ 'numero', 'estado', 'publicador', 'direccion'],
  page:10,
  pagination: true
};

// Init list
var numerosList = new List('divTablaTelefonos', options);
	document.getElementById("openModalManage").click();
}

async function populateManageList(){
	var telefonos=await Telefono.getAll();
	var html="";
	for(var i=0; i<telefonos.length;i++){
		html+=telefonos[i].renderRow();
	}
	document.getElementById("cuerpoTablaTelefono").innerHTML=html;
}