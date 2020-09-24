function addNewNumber(){
  document.getElementById("openModalNuevoNumero").click();
}

function populateFuentes(){
  if (document.getElementById("inputFuente")==null) return false;
  var fuentes=Fuente.getAll();
  var html="";
  for(var i=0;i<fuentes.length;i++){
    html+="<option value='"+fuentes[i].id+"'>"+fuentes[i].nombre+"</option>";
  }
  document.getElementById("inputFuente").innerHTML=html;
}

function checkNumeroExistance(){
  document.getElementById("inputNumeroExist").value="true";
  var nuevoNumero=document.getElementById("inputNumero").value.trim();
  var codigoArea=document.getElementById("inputCodigoArea").value.trim();

 

  if(nuevoNumero.length<9){
    if(nuevoNumero.length<7){
      sendNotification("Número con formato incorrecto", "error");
      return false;
    }
    nuevoNumero=nuevoNumero.slice(-7);
  }else{
    nuevoNumero=nuevoNumero.slice(-9);
  }
    document.getElementById("inputNumero").value=nuevoNumero;
  
    
      var numeroToCheck=formatNumero(codigoArea,nuevoNumero);
 
  
  
  
            if(Telefono.checkExistance(numeroToCheck)){
              sendNotification("Número ya existe", "error");   
              document.getElementById("inputNumeroExist").value="true";
            }else{
              sendNotification("Número válido");  
              document.getElementById("inputNumeroExist").value="false";
            }
        
}

function agregarNumeroDirectorio(){
  var numeroExiste=document.getElementById("inputNumeroExist").value;
  var codigoArea=document.getElementById("inputCodigoArea").value.trim();
  
  var nuevoNumero=document.getElementById("inputNumero").value.trim();

  var numeroToAdd= formatNumero(codigoArea,nuevoNumero);

  var nuevaDireccion=document.getElementById("inputDireccion").value.trim();
  var nuevoGrupo=document.getElementById("inputGrupo").value;
  var nuevaFuente=document.getElementById("inputFuente").value;
  if(numeroExiste=="true" || numeroToAdd.length==0 || nuevaDireccion.length==0 || nuevoGrupo.trim()=="" || nuevaFuente.trim()=="") return false;
  Telefono.insert(numeroToAdd,nuevaDireccion,nuevoGrupo,nuevaFuente);
          document.getElementById("inputNumeroExist").value="true";
  document.getElementById("inputNumero").value="";
 document.getElementById("inputDireccion").value="";
 document.getElementById("inputNumeroExist").value="true";
            sendNotification("Número agregado al directorio");  
            populateGroupList();      
        
}



function formatNumero(numero){

var position = 1;
return [numero.slice(0, position), " ", numero.slice(position)].join('');


}