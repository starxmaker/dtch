var map={};
onkeydown = onkeyup =function(e){
  var isInput=e.target.tagName.toUpperCase()=="INPUT" || e.target.tagName.toUpperCase()=="SELECT" ;
  e=e || event;
  map[e.keyCode] =e.type=="keydown";
  if(map[16] && map[90]){
      activarAtajos(); //ESC
      map={};
    }
  if(settings.atajos){

        if(!isInput){
          if (document.getElementById("modalRegistroRapido").classList.contains("show")){
      
                document.getElementById("inputNombresQuick").select();
            }
            if(map[16] && map[72]) $('#modalAtajos').modal(); //SHIFT + H
            if (map[32]){ //Espacio
              e.preventDefault();
                if (isTimerWorking){
                    stopTimer();
                }else{
                    if(chronometer>0){
                      resetTimer();
                    }else{
                      startTimer();
                    }
                }
            }
            if (map[35]){
              e.preventDefault();
            document.getElementById("openModalFuentes").click();
          }
            if (map[16] && map[40]) loadFiltros(); //ABAJO
            if (map[37]){
              if (document.getElementById("modalEstadisticas").classList.contains("show")){
                document.getElementsByClassName("carousel-control-prev")[0].click();
              }
          }
           
            if (map[16] && map[8]) document.getElementById("inputBuscar").select(); //SHIFT + Retroceso
            if (map[16] && map[38]) showStats(); //SHIFT + ARRIBA
           
            if (map[16] && map[82]){
              if (activeTelefono.estado==2 || activeTelefono.id==0){
                revisitaExitosa();
              }else{
                revisita();
              }
            }
            if (map[16] && map[85]){
              if (activeTelefono.estado==2 || activeTelefono.id==0){
                ultimaRevisita();
              }else{
                sendNotification("Operación no permitida");
              }
            }
             if (map[16] && map[68]){
              if (activeTelefono.estado==2 || activeTelefono.id==0){
                revisitaNoEncontrada();
              }else{
                sendNotification("Operación no permitida");
              }
            }
             if (map[16] && map[73]){
             if (activeTelefono.estado!=2 || activeTelefono.id==0){
                revisita();
              }else{
                sendNotification("Operación no permitida");
              }
            }
            if (map[16] && map[70]){
              if (activeTelefono.estado!=2 || activeTelefono.id==0){
                receptivo();
              }else{
                sendNotification("Operación no permitida");
              }
            }
            if (map[16] && map[83]){
              if (activeTelefono.estado!=2 || activeTelefono.id==0){
                sinInteres();
              }else{
                sendNotification("Operación no permitida");
              }
            }
            if (map[16] && map[78]){
             if (activeTelefono.estado!=2 || activeTelefono.id==0){
                noLlamar();
              }else{
                sendNotification("Operación no permitida");
              }
            }
            if (map[16] && map[79]){
              ocupado();
            }
            if (map[16] && map[77]){
              noContesta();
            }
            if (map[16] && map[81]){
              noExiste();
            }
            if (map[16] && map[69]){
              estudio();
            }
            
            if(map[17]){
              loadModalEspera();
            }
            if(map[187]){
              registroRapido();
            }

        }else{
          if (map[19] || map[13]){
            document.activeElement.blur(); //pausa
            if (document.getElementById("modalEspera").classList.contains("show")){
              document.getElementById("inputNombresEspera").select();
            }
          }
        }

    }
}


