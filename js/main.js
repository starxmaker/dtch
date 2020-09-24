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
    
  });

var activeTelefono=Telefono.getBlank();
var allPublicadores=[];
var keys_enabled=true;

window.onbeforeunload = function(e) {
  return '¿Desea recargar la página? La lista de espera será reiniciada';
};
