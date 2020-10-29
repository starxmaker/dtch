
async function loadElements(){
  Notiflix.Loading.Arrows('Cargando ambiente');
  let promiseRegistroRapido=new Promise((resolve, reject) =>{
      fetch("./componentes/registro_rapido.html").then(response => { return response.text() }).then(data => {
        document.getElementById("modal_registro_rapido").innerHTML = data;
        resolve()
      });
  })
  let promiseLista=new Promise((resolve, reject) =>{
    fetch("./componentes/lista.html").then(response => { return response.text()})  .then(data => {
      document.getElementById("modal_lista").innerHTML = data;
      resolve()
    });
  })
  let promiseHistorialEspecifico=new Promise((resolve, reject) =>{
    fetch("./componentes/historial_especifico.html").then(response => {return response.text()}).then(data => {
      document.getElementById("modal_historial_especifico").innerHTML = data;
      resolve()
    });
  })
  let promiseAgregarNumeros=new Promise((resolve, reject) =>{
      fetch("./componentes/agregar_numeros.html").then(response => {return response.text()}).then(data => {
        document.getElementById("modal_agregar_numero").innerHTML = data;
        
        resolve()
    });
  })
  let promiseVisor=new Promise((resolve, reject) =>{
      fetch("./componentes/visor.html").then(response => {return response.text()}).then(data => {
      document.getElementById("main").innerHTML = data;
      
      resolve()
    });
  })
  let promiseHistorial=new Promise((resolve, reject) =>{
      fetch("./componentes/historial.html").then(response => {return response.text()}).then(data => {
      document.getElementById("modal_historial").innerHTML = data;
      resolve()
    });
  })
  let promiseStats=new Promise((resolve, reject) =>{
      fetch("./componentes/stats.html").then(response => {return response.text()}).then(data => {
        document.getElementById("modal_stats").innerHTML = data;
       
        resolve()
    });
  })
  let promiseFuente=new Promise((resolve, reject) =>{
     fetch("./componentes/fuente.html").then(response => {return response.text()}).then(data => {
      document.getElementById("modal_fuente").innerHTML = data;
      resolve()
    });
  })
  let promiseFiltros=new Promise((resolve, reject) =>{
   fetch("./componentes/filtros.html").then(response => {return response.text()}).then(data => {
      document.getElementById("modal_filtros").innerHTML = data;
      resolve()
    });
  })
  let promiseManage=new Promise((resolve, reject) =>{
      fetch("./componentes/manage.html").then(response => {return response.text()}).then(data => {
        document.getElementById("modal_manage").innerHTML = data;
        resolve()
    });
  }) 

  let promiseNuevaFuente=new Promise((resolve, reject) =>{
      fetch("./componentes/nueva_fuente.html").then(response => {return response.text()}).then(data => {
        document.getElementById("modal_nueva_fuente").innerHTML = data;
        resolve()
    });
  })
  let promiseShowThree =new Promise((resolve, reject) =>{
      fetch("./componentes/show_three.html").then(response => {return response.text()}).then(data => {
        document.getElementById("modal_show_three").innerHTML = data;
        resolve()
    });
  })
  let  promiseManageFuentes=new Promise((resolve, reject) =>{
     fetch("./componentes/manage_fuentes.html").then(response => {return response.text()}).then(data => {
        document.getElementById("modal_manage_fuentes").innerHTML = data;
        resolve()
    });
  })
  let promiseManagePublicadores=new Promise((resolve, reject) =>{
    fetch("./componentes/manage_publicadores.html").then(response => {return response.text()}).then(data => {
      document.getElementById("modal_manage_publicadores").innerHTML = data;
      resolve()
    });
  })
  let promisePreferencias=new Promise((resolve, reject) =>{
    fetch("./componentes/preferencias.html").then(response => {return response.text()}).then(data => {
      document.getElementById("modal_preferencias").innerHTML = data;
      resolve()
    });
  });

  let promiseConsolaSQL=new Promise((resolve, reject) =>{
    fetch("./componentes/consolaSQL.html").then(response => {return response.text() }).then(data => {
      document.getElementById("modal_consola").innerHTML = data;
      resolve()
    });
  })
  let promiseManageRevisitas=new Promise((resolve, reject) =>{
    fetch("./componentes/manage_revisitas.html").then(response => {return response.text()}).then(data => {
      document.getElementById("modal_manage_revisitas").innerHTML = data;
      resolve()
    });
  })
  let promiseLogin=new Promise((resolve, reject) =>{
    fetch("./componentes/login.html").then(response => {return response.text()}).then(data => {
      document.getElementById("modal_login").innerHTML = data;
      resolve()
    });
  })
  let promises=[promiseRegistroRapido,promiseLista, promiseHistorialEspecifico,promiseAgregarNumeros, promiseVisor, promiseHistorial,promiseStats,promiseFuente,promiseFiltros, promiseManage, promiseNuevaFuente,promiseShowThree,promiseManageFuentes, promiseManagePublicadores, promisePreferencias, promiseConsolaSQL, promiseManageRevisitas, promiseLogin]
  await Promise.all(promises)
  await initDatabase()
  
  
  if (window.localStorage.getItem("DTCH_SERVER") && window.sessionStorage.getItem("csrfToken")){
    const result= await setServerDetails()
    if (!result) openLogin()
  }else{
    openLogin()
  }
  toggleOnline()
  await postLoading()
  
  Notiflix.Loading.Remove()
}

loadElements()

const postLoading= async() =>{
      await afterLoading();
      loadNumeroPropio();
      initAutoComplete();
      loadPreferencias();
      hideFiltroGrupo()
       initCharts();
       await checkAvailableQuantity();
      
      timer = new easytimer.Timer();
      timer.addEventListener('secondsUpdated', function (e) {
         document.getElementById("basicUsage").value=timer.getTimeValues().toString();
      });
      
}

var activeTelefono=Telefono.getBlank();
var allPublicadores=[];

function toggleOnline(){
 if (isOnline){
  Array.from(document.getElementsByClassName("offlineItem")).forEach(item => item.style.display="none")
  Array.from(document.getElementsByClassName("onlineItem")).forEach(item => item.style.display="block")
 }else{
  Array.from(document.getElementsByClassName("onlineItem")).forEach(item => item.style.display="none")
  Array.from(document.getElementsByClassName("offlineItem")).forEach(item => item.style.display="block")
 }
}



function openSource(){
  document.getElementById("openModalFuentes").click();
}

