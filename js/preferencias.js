var settings={
	autoformatearFijos:false,
	autoformatearCelulares:false,
	extensionFijos:0,
	extensionCelulares:0,
	atajos:false,
	filtrarGrupo:false
}
function openPreferencias(){
	setPreferencias();
	document.getElementById("openModalPreferencias").click();
}

function guardarCambiosPreferencias(){
	var autoformatearFijos=document.getElementById("preferenciasCheckAutoformatearFijos").checked;
	var autoformatearCelulares=document.getElementById("preferenciasCheckAutoformatearCelulares").checked;
	var extensionFijos=document.getElementById("preferenciasInputExtensionFijos").value;
	var extensionCelulares=document.getElementById("preferenciasInputExtensionCelulares").value;
	var atajos=document.getElementById("preferenciasCheckAtajos").checked;
	var filtrarGrupo=document.getElementById("preferenciasCheckGrupos").checked;

	settings.autoformatearFijos=autoformatearFijos;
	settings.autoformatearCelulares=autoformatearCelulares;
	settings.extensionFijos=extensionFijos;
	settings.extensionCelulares=extensionCelulares;
	settings.atajos=atajos;
	settings.filtrarGrupo=filtrarGrupo;

	window.localStorage.setItem("settings",JSON.stringify(settings));
	sendNotification("Cambios guardados");
	hideFiltroGrupo()


}

function loadPreferencias(){
	var data=window.localStorage.getItem("settings");
	if (data==null || data==undefined){
		window.localStorage.setItem("settings",JSON.stringify(settings));
	}else{
		settings=JSON.parse(data);
	}
}

function setPreferencias(){
	if (settings.autoformatearFijos) document.getElementById("preferenciasCheckAutoformatearFijos").checked=true;
	if (settings.autoformatearCelulares) document.getElementById("preferenciasCheckAutoformatearCelulares").checked=true;
	document.getElementById("preferenciasInputExtensionFijos").value=settings.extensionFijos;
	document.getElementById("preferenciasInputExtensionCelulares").value=settings.extensionCelulares;
	if (settings.atajos) document.getElementById("preferenciasCheckAtajos").checked=true;
	if (settings.filtrarGrupo) document.getElementById("preferenciasCheckGrupos").checked=true;
}