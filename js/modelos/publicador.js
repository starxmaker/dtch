class Publicador{
	constructor(id,nombre, grupo, invitado){
    this.id=id;
    this.nombre=nombre;
    this.grupo=grupo;
    this.invitado=invitado;
	}
  static async getById(id){
    if (isOnline){
      const results=await getInformation("/publicadores/"+id)
      var publicador=null
      if (results!=null) publicador=new Publicador(results.idPublicador, results.nombre, results.grupo, results.invitado)
      return publicador
    }else{
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
  }
	static async getIdByName(nombre){
    if (isOnline){
      const results=await getInformation("/publicadores/nombre/"+nombre)
      var publicador=null
      if (results!=null) publicador=new Publicador(results.idPublicador, results.nombre, results.grupo, results.invitado)
      return publicador

    }else{
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
    
	}

  static async insertNewPublicador(nombre){
    let id
    if(isOnline){
      const newPublicador=await postInformation("/publicadores", {nombre: nombre, invitado:1, grupo:0})
      id=newPublicador.idPublicador
    }else{
      db.run("insert into publicadores (nombre, grupo, invitado) values ('"+nombre+"',0,1);");
      id=getLastInsertedId()
    }
    await populatePublicadores();
    return new Publicador(id,nombre,0,1);
  }
  static async getAll(){
    if (isOnline){
      const results=await getInformation("/publicadores/getAll")
      let publicadores=[]
      results.forEach(item =>{
        publicadores.push(new Publicador(item.idPublicador, item.nombre, item.grupo, item.invitado))
      })
      return publicadores
    }else{
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
    
  }

  async delete(){
    await Telefono.replacePublicador(this.id);
    if (isOnline){
      await deleteInformation("/publicadores/"+this.id)
    }else{
      db.run("delete from publicadores where id="+this.id);
    }
    await populatePublicadores()
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


        