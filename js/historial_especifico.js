async function loadHistorialEspecifico(){
  if (activeTelefono.id==0) return false;
  
                var registros= await Historial.getByIdNumero(activeTelefono.id);
                var i;
                var html="";
                var numeroH="";
                for (i=0;i<registros.length;i++){
                  
                    var registro=registros[i];
                    var fechaH="";
                if(registro.hora=="0000-00-00 00:00:00"){
                    fechaH="Sin Registro";
                }else{
                var t = registro.hora.split(/[- :]/);
                fechaH = t[2]+"/"+t[1]+"/"+t[0]+" a las "+t[3]+":"+t[4];
                  }
                    var estadoH=getRenderedEstados(registro.estado);
                    var publicadorH=registro.publicador;
                    if (publicadorH=="-") publicadorH="";
                    numeroH=registro.numero;

                     var template="<a href='#' class='list-group-item list-group-item-action flex-column align-items-start')><div class='d-flex w-100 justify-content-between' ><h5 class='mb-1'>"+estadoH+" "+publicadorH+"</h5><small class='text-muted'>"+fechaH+"</small></div></a>";
                     html=html+template;
                }
                document.getElementById("fldNumeroHistorial").innerHTML=activeTelefono.numero;

               
                document.getElementById("listaHistorialEspecifico").innerHTML=html;
                 document.getElementById("openModalHistorialEspecifico").click();
      
}