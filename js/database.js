let db, sql_config;
config = {
      locateFile: filename => `/dist/${filename}`
    }
    // The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
    // We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
    initSqlJs(config).then(function(SQL){
    sql_config=SQL;
    if (checkDatabaseExistance()){
    	loadStoredDatabase();
    }else{
    	newDatabase();
    }
    
    
    });
    function newDatabase(){
    	db=new sql_config.Database();
         window.localStorage.setItem("versionDB",null);
    	createDatabase();
    	saveStoredDatabase();
    	afterLoading();
    }

    function createDatabase(){

    	 db.run("CREATE TABLE telefonos (id integer primary key autoincrement,direccion varchar(255),codigo_pais int(11) DEFAULT NULL,codigo_region int(11) DEFAULT NULL,numero varchar(255),grupo int(11) NOT NULL,estado int(11) NOT NULL,ultima_llamada datetime NOT NULL,publicador int(11) NOT NULL,ultima_visualizacion datetime DEFAULT NULL,fuente int(11) DEFAULT '0',tipo int(11) DEFAULT NULL,FOREIGN KEY (publicador) REFERENCES publicadores(id) ON DELETE CASCADE,FOREIGN KEY (fuente) REFERENCES fuentes(id) ON DELETE CASCADE);");
    	 db.run("CREATE TABLE historials (id integer primary key autoincrement,id_numero int(11) NOT NULL,estado int(11) NOT NULL,hora datetime NOT NULL,publicador int(11) NOT NULL,tiempo int(11) DEFAULT '0',tipo int(11) DEFAULT '0',FOREIGN KEY (publicador) REFERENCES publicadores(id) ON DELETE CASCADE, FOREIGN KEY (id_numero) REFERENCES telefonos(id) ON DELETE CASCADE);");
    	 db.run("CREATE TABLE IF NOT EXISTS publicadores (id integer primary key autoincrement, nombre varchar(255), grupo int(11) NOT NULL DEFAULT '0', invitado int(11) DEFAULT '1') ;");
    	db.run("create table fuentes(id integer primary key autoincrement, nombre varchar not null, color varchar not null, descripcion varchar not null);");
    }
    function checkDatabaseExistance(){
    	return window.localStorage.getItem("DB")!=null;

    }
    function loadStoredDatabase(){
    	db=new sql_config.Database(toBinArray(window.localStorage.getItem("DB")));
    	afterLoading();
    }
    function afterLoading(){
    	populateGroupList();
        populatePublicadores();
        populateFuentes();
        showLastSave();
        enableForeignKeys();
    }
    function saveStoredDatabase(){
    	window.localStorage.setItem("DB",toBinString(db.export()));
        window.localStorage.setItem("lastSave",getCurrentDatetime());
        showLastSave();
    }
    function showLastSave(){
        if (document.getElementById("lastSaved")==undefined) return false;
        var momento=lastSave();
        if (momento!="no definida") momento=timeSince(momento);
        document.getElementById("lastSaved").innerHTML=momento;
    }
    function databaseVersion(){
    	var version=window.localStorage.getItem("versionDB");
        if (version==null || version==undefined) version="no definida";
        return version;
    }
    function lastSave(){
        var version=window.localStorage.getItem("lastSave");
        if (version==null || version==undefined) version="sin registros";
        return version;
    }
    function enableForeignKeys(){
        db.run("PRAGMA foreign_keys = ON;")
    }
    function getLastInsertedId(){
        var id=0;
        var stmt = db.prepare("SELECT last_insert_rowid() as id");
  stmt.getAsObject(); // {col1:1, col2:111}
      
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        id=row.id;

        
      }
      stmt.free();
      return id;
    }
    function exportDatabase(){

    	saveStoredDatabase();
    	var arraybuff = db.export();
		var blob = new Blob([arraybuff]);
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.href = window.URL.createObjectURL(blob);
		a.download = "base_de_datos_"+getTodayDate()+".dtch";
		a.onclick = function () {
			setTimeout(function () {
				window.URL.revokeObjectURL(a.href);
			}, 1500);
		};
		a.click();

    }

    function toBinString (arr) {
    var uarr = new Uint8Array(arr);
    var strings = [], chunksize = 0xffff;
    // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
    for (var i=0; i*chunksize < uarr.length; i++){
        strings.push(String.fromCharCode.apply(null, uarr.subarray(i*chunksize, (i+1)*chunksize)));
    }
    return strings.join('');
}

function toBinArray (str) {
    var l = str.length,
            arr = new Uint8Array(l);
    for (var i=0; i<l; i++) arr[i] = str.charCodeAt(i);
    return arr;
}
