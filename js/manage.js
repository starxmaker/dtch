
function eliminarNumero(){

}
 var dataTable;
function openManage(){

	

	populateManageList();
	dataTable = new DataTable("#tablaTelefonos");
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