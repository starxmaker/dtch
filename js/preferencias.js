var settings={
	autoformatearFijos:false,
	autoformatearCelulares:false,
	extensionFijos:0,
	extensionCelulares:0
}
function openPreferencias(){
	document.getElementById("openModalPreferencias").click();
}

function guardarCambiosPreferencias(){
	var autoformatearFijos=document.getElementById("preferenciasCheckAutoformatearFijos").checked;
	var autoformatearCelulares=document.getElementById("preferenciasCheckAutoformatearCelulares").checked;
	var extensionFijos=document.getElementById("preferenciasInputExtensionFijos").value;
	var extensionCelulares=document.getElementById("preferenciasInputExtensionCelulares").value;

	settings.autoformatearFijos=autoformatearFijos;
	settings.autoformatearCelulares=autoformatearCelulares;
	settings.extensionFijos=extensionFijos;
	settings.extensionCelulares=extensionCelulares;

	window.localStorage.setItem("settings",JSON.stringify(settings));
	sendNotification("Cambios guardados");


}

function loadPreferencias(){
	var data=window.localStorage.getItem("settings");
	if (data==null || data==undefined){
		window.localStorage.setItem("settings",JSON.stringify(settings));
	}else{
		settings=JSON.parse(data);
	}
}