class Fuente{
	constructor(id,nombre, color, descripcion){
		 	this.id=id;
            this.nombre=nombre;
            this.color=color;
            this.descripcion=descripcion;
	}
	static getById(id){
		var stmt = db.prepare("SELECT * FROM fuentes where id="+id);
  stmt.getAsObject(); // {col1:1, col2:111}
     	var candidate=null;
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        candidate=new Fuente(row.id,row.nombre,row.color,row.descripcion);
        
      }
      stmt.free();
      if (candidate==null) candidate=Fuente.getBlank();
      return candidate;
	}
	static getBlank(){
		return new Fuente(-1,"Fuente Propia","grey","una");
	}
	static getAll(){
		var stmt = db.prepare("SELECT * FROM fuentes");
  stmt.getAsObject(); // {col1:1, col2:111}
      var fuentes=[];
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        var source= new Fuente(row.id,row.nombre,row.color,row.descripcion);
        fuentes.push(source);
      }
      stmt.free();
      return fuentes;
	}
  static insert(nombre, color, descripcion){
    db.run("insert into fuentes (nombre, color, descripcion) values('"+nombre+"','"+color+"','"+descripcion+"')");
  }
  delete(){
    db.run("delete from fuentes where id="+this.id);
  }
	render(isDescripcion){

		var descripcion="";
	if(isDescripcion) descripcion=this.descripcion;
	
	return descripcion+" <span style='color: "+this.color+"'>"+this.nombre+"</span>";

	}
  renderRow(){
    return "<li class='list-group-item list-group-item-action flex-column align-items-start' )'><div class='d-flex w-100 justify-content-between' > <h5 class='nombre'>"+this.nombre+"</h5> <small class='text-muted'>  <i class='fas fa-trash-alt' onclick='deleteFuente("+this.id+")' data-dismiss='modal'></i></small></div></li>";
  }
}