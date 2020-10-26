function loadModalEspera(){
	refreshListaEspera();   
	document.getElementById("openModalEspera").click();

}



var listaEspera=[];
var hermanosHistory=[];



function checkParticipacion(name){
  return hermanosHistory.indexOf(name)!=-1;
}



function refreshListaEspera(){
   var i;
                var html="";
                for (i=0;i<listaEspera.length;i++){
                    var registro=listaEspera[i];
                    var currentNumber=i+1;

                     var template="<a href='#' class='list-group-item list-group-item-action flex-column align-items-start' )'><div class='d-flex w-100 justify-content-between' data-index='"+i+"'><h5 class='mb-1' onclick='modifyCurrentName("+i+");' data-dismiss='modal'><span class='currentNumber'>#"+currentNumber+"</span> "+registro+"</h5><small class='text-muted'><i class='fas fa-trash-alt' onclick='deleteEspera("+i+", false)'></i></small></div></a>";
                     html=html+template;
                }

               
                document.getElementById("listaEspera").innerHTML=html;
                var list=document.getElementById("listaEspera");
                var ordenable=new Sortable(list, {
    animation: 150,
    ghostClass: 'blue-background-class',
    dataIdAttr: 'data-index',
    onEnd: function(/**Event*/evt) {
      moveIndex(evt.oldIndex,evt.newIndex);
  }
});
}



async function modifyCurrentName(index){
  if (returnToQuickMenu(true)){
  var nombre=listaEspera[index];
  deleteEspera(index,true);

 
  let publisher=awaitPublicador.getIdByName(nombre)
  choicesNombreMain.setChoiceByValue(publisher)
  hermanosHistory.push(nombre);
  document.getElementById("openModalEspera").click();
}
  

}
function moveIndex(index,newIndex){
  listaEspera=array_move(listaEspera,index,newIndex);
  refreshListaEspera();
  
}

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};


async function agregarNombre(publisherID){
  if (publisherID==0 || publisherID=="") return false
  let publisher= await Publicador.getById(publisherID)
  updateListaEspera(publisher.nombre);
  refreshListaEspera();
  sendNotification(publisher.nombre+" agregado a la lista de espera");

}

function updateListaEspera(nombre){
  if(listaEspera.indexOf(nombre)!=-1) return false;
  if(checkParticipacion(nombre)){
    listaEspera.push(nombre);
  }else{
    var nobodyParticipated=true;
     for(var i=0; i<listaEspera.length; i++){
       if (checkParticipacion(listaEspera[i])){
        listaEspera.insert(i,nombre);
        nobodyParticipated=false;
        break;
       }
     }
     if(nobodyParticipated){
        listaEspera.push(nombre);
     }
  }
}

function deleteEspera(index,again){
  var nombre=listaEspera[index];
  listaEspera.splice(index,1);
  
  if(again){
      listaEspera.push(nombre);
  }
  refreshListaEspera();
}