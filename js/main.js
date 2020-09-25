fetch("./componentes/visor.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("main").innerHTML = data;
    afterLoading();
    loadNumeroPropio();
    document.getElementById("dataBaseVersion").innerHTML=databaseVersion();
    initAutoComplete();
    initAutoCompleteNombres();
    checkAvailableQuantity();
    loadPreferencias();
    timer = new easytimer.Timer();

timer.addEventListener('secondsUpdated', function (e) {
   document.getElementById("basicUsage").innerHTML=timer.getTimeValues().toString();
});
  });

fetch("./componentes/historial.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_historial").innerHTML = data;
  });
  fetch("./componentes/stats.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_stats").innerHTML = data;
    initCharts();
  });

    fetch("./componentes/fuente.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_fuente").innerHTML = data;
    
  });
   fetch("./componentes/filtros.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_filtros").innerHTML = data;
    populateGroupList();
    
  });
  fetch("./componentes/registro_rapido.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_registro_rapido").innerHTML = data;
    initAutoCompleteQuick();
    
  });

  fetch("./componentes/agregar_numeros.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_agregar_numero").innerHTML = data;
    populateFuentes();
    
  });

   fetch("./componentes/manage.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_manage").innerHTML = data;
    
  });
    fetch("./componentes/lista.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_lista").innerHTML = data;
    initAutoCompleteEspera();
    
  });
      fetch("./componentes/nueva_fuente.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_nueva_fuente").innerHTML = data;
    initAutoCompleteEspera();
    
  });
       fetch("./componentes/historial_especifico.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_historial_especifico").innerHTML = data;
    
  });
         fetch("./componentes/show_three.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_show_three").innerHTML = data;
    
  });
           fetch("./componentes/manage_fuentes.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_manage_fuentes").innerHTML = data;
    
  });
             fetch("./componentes/manage_publicadores.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_manage_publicadores").innerHTML = data;
    
  });
               fetch("./componentes/preferencias.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_preferencias").innerHTML = data;
    
  });

var activeTelefono=Telefono.getBlank();
var allPublicadores=[];


window.onbeforeunload = function(e) {
  return '¿Desea recargar la página?';
};


function openSource(){
  document.getElementById("openModalFuentes").click();
}