function addNewNumber(){
  document.getElementById("openModalNuevoNumero").click();
  fillCodigosPreferidos();
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

function fillCodigosPreferidos(){
var codigoRegionPreferido="";
    if(window.localStorage.getItem("prefferedCodigoRegion")!=null) codigoRegionPreferido=window.localStorage.getItem("prefferedCodigoRegion");
    var codigoPaisPreferido="";
    if(window.localStorage.getItem("prefferedCodigoPais")!=null) codigoPaisPreferido=window.localStorage.getItem("prefferedCodigoPais");
    document.getElementById("inputCodigoPais").value=codigoPaisPreferido;
   document.getElementById("inputCodigoRegion").value=codigoRegionPreferido;
}

function changeTipoNewNumero(){
  if(document.getElementById("radioCelular").checked){
    document.getElementById("inputCodigoRegion").disabled=true;
    document.getElementById("inputCodigoRegion").value="";
  }else{
    document.getElementById("inputCodigoRegion").disabled=false;
    fillCodigosPreferidos();
  }
  checkNumeroExistance();
}

function checkNumeroExistance(){
  document.getElementById("inputNumeroExist").value="true";
  var nuevoNumero=document.getElementById("inputNumero").value.trim();
  var codigoPais=document.getElementById("inputCodigoPais").value.trim();
   var codigoRegion=document.getElementById("inputCodigoRegion").value.trim();

    document.getElementById("inputNumero").value=nuevoNumero;

    if(codigoPais.trim()=="" || nuevoNumero=="") return false;
    if(document.getElementById("radioFijo").checked){
      if (codigoRegion.trim()=="") return false;
    }
  
    
      var numeroToCheck=codigoPais+codigoRegion+nuevoNumero;
 
  
  
  
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
  var codigoPais=document.getElementById("inputCodigoPais").value.trim();
   var codigoRegion=document.getElementById("inputCodigoRegion").value.trim();
  
  var nuevoNumero=document.getElementById("inputNumero").value.trim();
  var tipo=0;
  if(document.getElementById("radioCelular").checked) tipo=1;


  var nuevaDireccion=document.getElementById("inputDireccion").value.trim();
  var nuevoGrupo=document.getElementById("inputGrupo").value;
  var nuevaFuente=document.getElementById("inputFuente").value;
  if(numeroExiste=="true" || nuevoNumero.length==0 || codigoPais.length==0 || nuevaDireccion.length==0 || nuevoGrupo.trim()=="" || nuevaFuente.trim()=="") return false;

  if (tipo==0 && codigoRegion.length==0) return false;
  Telefono.insert(codigoPais,codigoRegion, nuevoNumero,nuevaDireccion,nuevoGrupo,nuevaFuente, tipo);
          document.getElementById("inputNumeroExist").value="true";
  document.getElementById("inputNumero").value="";
 document.getElementById("inputDireccion").value="";
 document.getElementById("inputNumeroExist").value="true";
            sendNotification("Número agregado al directorio");  
window.localStorage.setItem("prefferedCodigoRegion", codigoRegion);
    window.localStorage.setItem("prefferedCodigoPais", codigoPais);

            populateGroupList();      
        
}



function formatNumero(numero){

var position = 1;
return [numero.slice(0, position), " ", numero.slice(position)].join('');


}