let db, sql_config, server, isOnline;
config = {
      locateFile: filename => `/dist/${filename}`
    }

    const initDatabase=async() =>{
        const SQL = await initSqlJs(config)
        sql_config=SQL;
        if (checkDatabaseExistance()){
            loadStoredDatabase();
        }else{
            newDatabase();
        }
    }
    function newDatabase(){
    	db=new sql_config.Database();
         window.localStorage.setItem("versionDB",null);
    	createDatabase();
    	saveStoredDatabase();
    }

    const setServerDetails= async()=>{
        server=window.localStorage.getItem("DTCH_SERVER")
        
        const result=await tryConnection()
        if (result){
            isOnline=true
        }else{
            isOnline=false
        }
        return result
    }

    const getInformation=async(route)=>{
        try{
            const response=await axios.get(server+route, {withCredentials: true, headers: {
                'csrfToken': window.sessionStorage.getItem("csrfToken")
              }
            })
            return response.data
        }catch(err){
            Notiflix.Report.Failure('Información','Sin conexión con el servidor. Vuelva a iniciar sesión','OK');
            return false
        }
    }
    const deleteInformation=async(route)=>{
        try{
            const response=await axios.delete(server+route, {withCredentials: true, headers: {
                'csrfToken': window.sessionStorage.getItem("csrfToken")
              }
            })
            return response.status==200
        }catch(err){
            Notiflix.Report.Failure('Información','Sin conexión con el servidor. Vuelva a iniciar sesión','OK');
            return false
        }
    }
    const postInformation=async(route, data)=>{
        try{
            const response=await axios.post(server+route, data, {withCredentials: true, 
                headers: {
                    'csrfToken': window.sessionStorage.getItem("csrfToken")
                  }
                })
            return response.data
        }catch(err){
            Notiflix.Report.Failure('Información','Sin conexión con el servidor. Vuelva a iniciar sesión','OK');
            return false
        }
    }

    const patchInformation=async(route, data)=>{
        try{
            const response=await axios.patch(server+route, data, {withCredentials: true, headers: {
                'csrfToken': window.sessionStorage.getItem("csrfToken")
              }
            })
            return response.data
        }catch(err){
            Notiflix.Report.Failure('Información','Sin conexión con el servidor. Vuelva a iniciar sesión','OK');
            return false
        }
    }

    const tryConnection= async ()=>{
        try{
            const response=await axios.get(server+"/misc/test", {
                withCredentials: true,
                headers: {
                    'csrfToken': window.sessionStorage.getItem("csrfToken")
                  }
                })
              
             return response.status===200
            }catch(err){
                return false
            }
    }

    function createDatabase(){

    	 db.run("CREATE TABLE telefonos (id integer primary key autoincrement,direccion varchar(255),codigo_pais int(11) DEFAULT NULL,codigo_region int(11) DEFAULT NULL,numero varchar(255),grupo int(11) NOT NULL,estado int(11) NOT NULL,ultima_llamada datetime NOT NULL,publicador int(11),ultima_visualizacion datetime DEFAULT NULL,fuente int(11) DEFAULT '0',tipo int(11) DEFAULT NULL,FOREIGN KEY (publicador) REFERENCES publicadores(id),FOREIGN KEY (fuente) REFERENCES fuentes(id) ON DELETE CASCADE);");
    	 db.run("CREATE TABLE historials (id integer primary key autoincrement,id_numero int(11),estado int(11) NOT NULL,hora datetime NOT NULL,publicador int(11) NOT NULL,tiempo int(11) DEFAULT '0',tipo int(11) DEFAULT '0',FOREIGN KEY (publicador) REFERENCES publicadores(id) ON DELETE CASCADE, FOREIGN KEY (id_numero) REFERENCES telefonos(id) ON DELETE CASCADE);");
    	 db.run("CREATE TABLE IF NOT EXISTS publicadores (id integer primary key autoincrement, nombre varchar(255), grupo int(11) NOT NULL DEFAULT '0', invitado int(11) DEFAULT '1') ;");
    	db.run("create table fuentes(id integer primary key autoincrement, nombre varchar not null, color varchar not null, descripcion varchar not null);");
    }
    function checkDatabaseExistance(){
    	return window.localStorage.getItem("DB")!=null;

    }
    function loadStoredDatabase(){
    	db=new sql_config.Database(toBinArray(window.localStorage.getItem("DB")));
    
    }
    const afterLoading = async () => {
    	await populateGroupList();
        await populatePublicadores();
        await populateFuentes();
        if (!isOnline){
            showLastSave();
            enableForeignKeys();
        }
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
    function consoleStatement(statement){
        try {
         db.run(statement);
         }
catch(err) {
  return "<font color='red'>"+err.message+"</font>";
}
         return "Operación realizada";
    }
    function consoleQuery(query){
        var results=[]
        try {
  var stmt = db.prepare(query);
  stmt.getAsObject(); // {col1:1, col2:111}
      
      while(stmt.step()) { //
        results.push(stmt.getAsObject());
        
        
      }
  stmt.free();
}
catch(err) {
  return "<font color='red'>"+err.message+"</font>";
}

         
  return results;
    }

    function performQuery(){
        var query=document.getElementById("inputQuery").value.trim();
        var firstCommand=query.slice(0,6).toUpperCase();
        var output="";
        if (firstCommand=="SELECT"){
            var results=consoleQuery(query);
            if (typeof results==="string"){
                output=results;
            }else{
            for (var i=0; i<results.length;i++){
                for (aProperty in results[i]) {
    // do what needed
    // in case you want just to print it:
    output+=results[i][aProperty]+"|";
}
output+="<br>";
            }
        }
        }else{
            var output=consoleStatement(query);
            
        }
        document.getElementById("queryResults").innerHTML=output;
    }

    function openConsole(){
            document.getElementById("openConsolaSQL").click();
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
