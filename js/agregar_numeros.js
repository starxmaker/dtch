function addNewNumber(){
  document.getElementById("openModalNuevoNumero").click();
  fillCodigosPreferidos();
}

async function populateFuentes(){
  if (document.getElementById("inputFuente")==null) return false;
  var fuentes=await Fuente.getAll();
  var html="";

  var html2="<label for='inputNumero'>Fuentes</label>";
  for(var i=0;i<fuentes.length;i++){
    html+="<option value='"+fuentes[i].id+"'>"+fuentes[i].nombre+"</option>";
     html2+="<div class='form-check'><input type='checkbox' class='form-check-input checksFuentes' id='checkFuente"+fuentes[i].id+"' data-value='"+fuentes[i].id+"' checked='true'> <label class='form-check-label' for='checkTelefonoCelular'>"+fuentes[i].nombre+"</label></div>";
  }
  document.getElementById("inputFuente").innerHTML=html;
  if(document.getElementById("divChecksFuentes")!=null) document.getElementById("divChecksFuentes").innerHTML=html2;
}


function fillCodigosPreferidos(){
var codigoRegionPreferido="";
    if(window.localStorage.getItem("prefferedCodigoRegion")!=null) codigoRegionPreferido=window.localStorage.getItem("prefferedCodigoRegion");
    var codigoPaisPreferido="";
    if(window.localStorage.getItem("prefferedCodigoPais")!=null) codigoPaisPreferido=window.localStorage.getItem("prefferedCodigoPais");
    document.getElementById("inputCodigoPais").value=codigoPaisPreferido;
   document.getElementById("inputCodigoRegion").value=codigoRegionPreferido;
}

async function changeTipoNewNumero(){
  if(document.getElementById("radioCelular").checked){
    document.getElementById("inputCodigoRegion").disabled=true;
    document.getElementById("inputCodigoRegion").value="";
    document.getElementById("inputCodigoRegion").style.visibility="hidden";
      document.getElementById("labelInputCodigoRegion").style.visibility="hidden";
  }else{
    document.getElementById("inputCodigoRegion").disabled=false;
    document.getElementById("inputCodigoRegion").style.visibility="visible";
    document.getElementById("labelInputCodigoRegion").style.visibility="visible";
    fillCodigosPreferidos();
  }
  await checkNumeroExistance();
}

async function checkNumeroExistance(){
  document.getElementById("inputNumeroExist").value="true";
  var nuevoNumero=document.getElementById("inputNumero").value.trim();
  var codigoPais=document.getElementById("inputCodigoPais").value.trim();
   var codigoRegion=document.getElementById("inputCodigoRegion").value.trim();

    document.getElementById("inputNumero").value=nuevoNumero;

    if(codigoPais.trim()=="" || nuevoNumero=="") return false;
    if(document.getElementById("radioFijo").checked){
      if (codigoRegion.trim()=="") return false;
    }
  

  if(document.getElementById("radioFijo").checked && settings.autoformatearFijos){
    if (nuevoNumero.length<settings.extensionFijos){
        return false;
      }else{
        nuevoNumero=nuevoNumero.slice(settings.extensionFijos*-1);
          document.getElementById("inputNumero").value=nuevoNumero;
      }
  }
   if(!document.getElementById("radioFijo").checked && settings.autoformatearCelulares){
    if (nuevoNumero.length<settings.extensionCelulare){
        return false;
      }else{
        nuevoNumero=nuevoNumero.slice(settings.extensionCelulares*-1);
          document.getElementById("inputNumero").value=nuevoNumero;
      }
  }
    
      var numeroToCheck=codigoPais+codigoRegion+nuevoNumero;
  const check=await Telefono.checkExistance(numeroToCheck)
  
  
  
            if(check){
              sendNotification("Número ya existe", "error");   
              document.getElementById("inputNumeroExist").value="true";
            }else{
              sendNotification("Número válido");  
              document.getElementById("inputNumeroExist").value="false";
            }
        
}

async function agregarNumeroDirectorio(){
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
  await Telefono.insert(codigoPais,codigoRegion, nuevoNumero,nuevaDireccion,nuevoGrupo,nuevaFuente, tipo);
          document.getElementById("inputNumeroExist").value="true";
  document.getElementById("inputNumero").value="";
 document.getElementById("inputDireccion").value="";
 document.getElementById("inputNumeroExist").value="true";
            sendNotification("Número agregado al directorio");  
window.localStorage.setItem("prefferedCodigoRegion", codigoRegion);
    window.localStorage.setItem("prefferedCodigoPais", codigoPais);

        await populateGroupList();      
        await checkAvailableQuantity();
}



function formatNumero(numero){

var position = 1;
return [numero.slice(0, position), " ", numero.slice(position)].join('');


}