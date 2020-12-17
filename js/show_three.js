async function openShowThreeModal(){
    var grupo=document.getElementById("selectGrupo").value; //averigua el grupo seleccionado

    var quantity=3;
    var telefonos=await Telefono.getLastCalled(grupo,filtros,quantity);
     if (quantity>telefonos.length){
     	document.getElementById("fldNextTelefono1").innerHTML="Propio";
                document.getElementById("fldNextTelefono2").innerHTML="Propio";
                document.getElementById("fldNextTelefono3").innerHTML="Propio";
     }

    for(var i=0;i<telefonos.length;i++){
    	document.getElementById("fldNextTelefono"+(i+1)).innerHTML=formatNumero(telefonos[i].numero);
    }

   document.getElementById("openModalShowThree").click();

    
}

function shareModal(){
    var telefono1=document.getElementById("fldNextTelefono1").innerHTML;
    var telefono2=document.getElementById("fldNextTelefono2").innerHTML;
    var telefono3=document.getElementById("fldNextTelefono3").innerHTML;
    var message=telefono1+"%0A"+telefono2+"%0A"+telefono3;
    sendWhatsAppMessage(message);
}
