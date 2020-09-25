
function deleteTelefono(id){
	if (confirm("¿Está seguro de borrar el número seleccionado?")){


		var telefono=Telefono.getById(id);
		telefono.delete();
		sendNotification("Número eliminado");
	}
}
function openManage(){

	

	populateManageList();
	var options = {
  valueNames: [ 'numero', 'estado', 'publicador', 'direccion'],
  page:10,
  pagination: true
};

// Init list
var numerosList = new List('divTablaTelefonos', options);
	document.getElementById("openModalManage").click();
}

function populateManageList(){
	var telefonos=Telefono.getAll();
	var html="";
	for(var i=0; i<telefonos.length;i++){
		html+=telefonos[i].renderRow();
	}
	document.getElementById("cuerpoTablaTelefono").innerHTML=html;
}