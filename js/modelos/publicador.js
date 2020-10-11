class Publicador{
	constructor(id,nombre, grupo, invitado){
		 	this.id=id;
            this.nombre=nombre;
            this.grupo=grupo;
            this.invitado=invitado;
	}
  static getById(id){
    var stmt = db.prepare("select * from publicadores where id="+id);
  stmt.getAsObject(); // {col1:1, col2:111}
      var candidate=null;
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        candidate=new Publicador(row.id,row.nombre,row.grupo,row.invitado);
        
      }
      stmt.free();
      return candidate;
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
      if (candidate==null) return 0
      return candidate.id;
	}

  static insertNewPublicador(nombre){

    db.run("insert into publicadores (nombre, grupo, invitado) values ('"+nombre+"',0,1);");
    populatePublicadores();
    return new Publicador(getLastInsertedId(),nombre,0,1);
  }
  static getAll(){
    var stmt = db.prepare("SELECT * FROM publicadores order by nombre");
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
    delete(){
    Telefono.replacePublicador(this.id);
    db.run("delete from publicadores where id="+this.id);
  }
  render(isDescripcion){

    var descripcion="";
  if(isDescripcion) descripcion=this.descripcion;
  
  return descripcion+" <span style='color: "+this.color+"'>"+this.nombre+"</span>";

  }
  renderRow(){
    return "<li class='list-group-item list-group-item-action flex-column align-items-start' )'><div class='d-flex w-100 justify-content-between' > <h5 class='nombre'>"+this.nombre+"</h5> <small class='text-muted'> <i class='far fa-address-book' onclick='gestionarRevisitas("+this.id+")'  data-dismiss='modal'></i> <i class='fas fa-trash-alt' onclick='deletePublicador("+this.id+")' data-dismiss='modal'></i></small></div></li>";
  }
}


        