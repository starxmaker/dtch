class Publicador{
	constructor(id,nombre, grupo, invitado){
		 	this.id=id;
            this.nombre=nombre;
            this.grupo=grupo;
            this.invitado=invitado;
	}
	static getIdByName(nombre){
    if (nombre.trim()==""|| nombre=="No Especificado") return 0;
		var stmt = db.prepare("select * from publicadores where nombre='"+nombre+"'");
  stmt.getAsObject(); // {col1:1, col2:111}
     	var candidate=null;
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        candidate=new Publicador(row.id,row.nombre,row.grupo,row.invitado);
        
      }
      stmt.free();
      if (candidate==null) candidate=Publicador.insertNewPublicador(nombre);
      return candidate.id;
	}

  static insertNewPublicador(nombre){

    db.run("insert into publicadores (nombre, grupo, invitado) values ('"+nombre+"',0,1);");
    return new Publicador(getLastInsertedId(),nombre,0,1);
  }
  static getAll(){
    var stmt = db.prepare("SELECT * FROM publicadores");
  stmt.getAsObject(); // {col1:1, col2:111}
      var publicadores=[];
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        var source= new Publicador(row.id,row.nombre,row.grupo,row.invitado);
        publicadores.push(source);
      }
      stmt.free();
      return publicadores;
  }
}


        