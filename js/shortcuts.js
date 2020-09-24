var map={};
onkeydown = onkeyup =function(e){
  var isInput=e.target.tagName.toUpperCase()=="INPUT" || e.target.tagName.toUpperCase()=="SELECT" ;
  e=e || event;
  map[e.keyCode] =e.type=="keydown";
  if(map[16] && map[90]){
      activarAtajos(); //ESC
      map={};
    }
  if(keys_enabled){
        if(!isInput){
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
              }else{
            loadHistory(); //Izquierda
          }
          }
            if (map[39]) { //derecha
              if (document.getElementById("modalEstadisticas").classList.contains("show")){
                document.getElementsByClassName("carousel-control-next")[0].click();
              }else{
              if (document.getElementById("fldTelefono").style.visibility=="hidden"){
                  document.getElementById("selectGrupo").value=-1;
                  loadNewNumber();
              }else{
                omitir();
              }
            }
          }
            if (map[45]) document.getElementById("inputNombres").select(); //SHIFT + ENTER
            if (map[16] && map[8]) document.getElementById("inputBuscar").select(); //SHIFT + Retroceso
            if (map[16] && map[38]) showStats(); //SHIFT + ARRIBA
            if (map[16] && map[49]){ //shift + numero
              document.getElementById("selectGrupo").value=1;
              loadNewNumber();
            }
            if (map[16] && map[50]){
              document.getElementById("selectGrupo").value=2;
              loadNewNumber();
            }
            if (map[16] && map[51]){
              document.getElementById("selectGrupo").value=3;
              loadNewNumber();
            }
            if (map[16] && map[52]){
              document.getElementById("selectGrupo").value=4;
              loadNewNumber();
            }
            if (map[16] && map[53]){
              document.getElementById("selectGrupo").value=5;
              loadNewNumber();
            }
            if (map[16] && map[54]){
              document.getElementById("selectGrupo").value=6;
              loadNewNumber();
            }
            if (map[16] && map[55]){
              document.getElementById("selectGrupo").value=7;
              loadNewNumber();
            }
            if (map[16] && map[56]){
              document.getElementById("selectGrupo").value=8;
              loadNewNumber();
            }
            if (map[16] && map[57]){
              document.getElementById("selectGrupo").value=-1;
              loadNewNumber();
            }
            if (map[16] && map[48]){
              document.getElementById("selectGrupo").value=0;
              loadNewNumber();
            }
            if (map[16] && map[80]){
              loadNumeroPropio();
            }
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
             if (activeTelefono.estado==2 || activeTelefono.id==0){
                revisita();
              }else{
                sendNotification("Operación no permitida");
              }
            }
            if (map[16] && map[70]){
              if (activeTelefono.estado==2 || activeTelefono.id==0){
                receptivo();
              }else{
                sendNotification("Operación no permitida");
              }
            }
            if (map[16] && map[83]){
              if (activeTelefono.estado==2 || activeTelefono.id==0){
                sinInteres();
              }else{
                sendNotification("Operación no permitida");
              }
            }
            if (map[16] && map[78]){
             if (activeTelefono.estado==2 || activeTelefono.id==0){
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
            if (map[16] && map[65]){
              if (filtros.otros.codigoArea){
                  filtros.otros.codigoArea=false;
                  sendNotification("No mostrar códigos de área");
                  loadNewNumber();
                }else{
                  filtros.otros.codigoArea=true;
                  sendNotification("Mostrar código de área");
                  loadNewNumber();
                }
            }
            if (map[46]){
              if (filtros.tipo.celular && filtros.tipo.fijo){
                  filtros.tipo.celular=false;
                  filtros.tipo.fijo=true;
                  sendNotification("Filtro activado: sólo teléfonos fijos");
                  loadNewNumber();
                }else{
                  if (!filtros.tipo.celular){
                    filtros.tipo.celular=true;
                    filtros.tipo.fijo=false;
                    sendNotification("Filtro activado: sólo teléfonos celulares");
                  loadNewNumber();
                  }else{
                  filtros.tipo.celular=false;
                  filtros.tipo.fijo=true;
                  sendNotification("Filtro activado: sólo teléfonos fijos");
                  loadNewNumber();
                }
                }
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
              document.getElementById("buttonAgregarEspera").click();
              document.getElementById("inputNombresEspera").select();
            }
          }
        }

    }
}

