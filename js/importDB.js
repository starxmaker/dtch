let dropArea;

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}


function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
  var f = files[0];
  var r = new FileReader();
  r.onload = function() {
    var Uints = new Uint8Array(r.result);
    db = new sql_config.Database(Uints);

      window.localStorage.setItem("versionDB",getTodayDate());
    saveStoredDatabase();
    afterLoading();

    document.getElementById("modal_import_close").click();
    
  }
  r.readAsArrayBuffer(f);
}
function pruebaDB(){
  var stmt = db.prepare("SELECT * FROM telefonos where id=1");
  stmt.getAsObject(); // {col1:1, col2:111}
      
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        console.log(row);
        
      }
  stmt.free();
}





fetch("./componentes/modal_open.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.getElementById("modal_open").innerHTML= data;
    dropArea = document.getElementById('drop-area')
  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})
  
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

dropArea.addEventListener('drop', handleDrop, false)


  

      



});


