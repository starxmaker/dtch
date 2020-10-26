class Historial{
	constructor(id,id_numero,numero, estado, hora, publicador, tiempo,tipo){
	  this.id=id;
    this.id_numero=id_numero;
    this.numero=numero;
    this.estado=estado;
    this.hora=hora;
    this.publicador=publicador;
    this.tiempo=tiempo;
	}

  static async getLastCalls(quantity){
    if (isOnline){
      const results=await getInformation("/historials/getLast")
      let records=[]
      results.forEach(item =>{
        records.push(new Historial(
          item.idHistorial,
          item.id_numero,
          item.numeroTelefono,
          item.estado,
          joinDate(item.hora_year, item.hora_month, item.hora_day, item.hora_hour, item.hora_minute, item.hora_second),
          item.nombrePublicador,
          secondsToTime(item.tiempo),
          item.tipo)
        )
      })
      return records
    }else{
      var query="select t.id, h.id as 'registro', t.direccion, t.numero, t.grupo, h.estado, h.hora, p.nombre as 'publicador' , h.tipo, h.tiempo from  historials h left join publicadores p on h.publicador=p.id left join telefonos t on (h.id_numero=t.id) order by h.id desc limit "+quantity;
      var stmt = db.prepare(query);
      stmt.getAsObject(); // {col1:1, col2:111}
      var records=[];
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        var record= new Historial(row.registro,row.id, row.numero,row.estado,row.hora,row.publicador, secondsToTime(row.tiempo), row.tipo);
        records.push(record);
      }
      stmt.free();
      return records;
    }
  }
	static async getById(id){
    if (isOnline){
      const item=await getInformation("/historials/"+id)
      var record=null
      if (item!=null && item.length>0){
        record =new Historial(
          item[0].idHistorial,
          item[0].id_numero,
          item[0].numeroTelefono,
          item[0].estado,
          joinDate(item[0].hora_year, item[0].hora_month, item[0].hora_day, item[0].hora_hour, item[0].hora_minute, item[0].hora_second),
          item[0].nombrePublicador,
          secondsToTime(item[0].tiempo),
          item[0].tipo)
      }
      return record
     
    }else{
      var stmt = db.prepare("select t.id as id_numero, h.id as 'registro', t.numero, t.grupo, h.estado, h.hora, h.tipo, p.nombre as 'publicador' from historials h left join telefonos t on (h.id_numero=t.id) left join publicadores p on t.publicador=p.id where h.id="+id);
      stmt.getAsObject(); // {col1:1, col2:111}
      var candidate=null;
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        candidate=new Historial(row.registro,row.id,row.numero,row.estado,row.hora,row.publicador, secondsToTime(row.tiempo), row.tipo);  
      }
      stmt.free();
      return candidate;
    }
	}
  static async getByIdNumero(id){
    if (isOnline){
      const results=await getInformation("/historials/telefono/"+id)
      let records=[]
      results.forEach(item =>{
        records.push(new Historial(
          item.idHistorial,
          item.id_numero,
          item.numeroTelefono,
          item.estado,
          joinDate(item.hora_year, item.hora_month, item.hora_day, item.hora_hour, item.hora_minute, item.hora_second),
          item.nombrePublicador,
          secondsToTime(item.tiempo),
          item.tipo)
        )
      })
      return records
    }else{
      var stmt = db.prepare("select t.id as id_numero, h.id as 'registro', t.numero, t.grupo, h.estado, h.hora, h.tipo, p.nombre as 'publicador' from historials h left join telefonos t on (h.id_numero=t.id) left join publicadores p on t.publicador=p.id where t.id="+id);
      stmt.getAsObject(); // {col1:1, col2:111}
      var records=[];
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        records.push(new Historial(row.registro,row.id, row.numero,row.estado,row.hora,row.publicador, secondsToTime(row.tiempo), row.tipo));  
      }
      stmt.free();
      return records;
    }
  }
  static async insert(id_numero, estado, publicador, tiempo, tipo){
    let id, hora
    if(id_numero==0) id_numero=null;
    if(isOnline){
      const data={id_numero: id_numero, estado: estado, publicador:publicador, tiempo:tiempo, tipo:tipo}
      const insertedRecord=await postInformation("/historials", data)
      id=insertedRecord.idHistorial
      hora=joinDate(insertedRecord.hora_year, insertedRecord.hora_month, insertedRecord.hora_day, insertedRecord.hora_hour, insertedRecord.hora_minute, insertedRecord.hora_second)
    }else{
      hora=getCurrentDatetime();
      db.run("insert into historials (id_numero, estado, hora, publicador, tiempo, tipo) values ("+id_numero+","+estado+",'"+hora+"',"+publicador+","+tiempo+", "+tipo+");");
      id=getLastInsertedId();
      saveStoredDatabase();
    }
    
    return new Historial(id, id_numero, estado,0, hora, publicador, tiempo, tipo); 
  }
  async delete(){
    if(isOnline){
      await deleteInformation("/historials/"+this.id)
    }else{
      db.run("delete from historials where id="+this.id);
    }
  }
	render(){
    var fechaH=timeSince(this.hora);
    var estadoH=getRenderedEstados(this.estado);
    var publicadorH=this.publicador;
    if (publicadorH=="-") publicadorH="";
    var numeroH=this.numero
    if (numeroH==null || numeroH=="Propio") numeroH="Llamada independiente";
    var id_telefono=this.id_numero;
    var duracionH=this.tiempo;
    if(duracionH=="00:00") duracionH="";
    return "<a href='#' class='list-group-item list-group-item-action flex-column align-items-start' )'><div class='d-flex w-100 justify-content-between' ><h5 class='mb-1' onclick='loadNumeroById("+id_telefono+")' data-dismiss='modal'>"+numeroH+"</h5><small class='text-muted'>"+fechaH+" <i class='fas fa-trash-alt' onclick='deleteHistoryRecord("+this.id+")' data-dismiss='modal'></i></small></div><p class='mb-1'>"+estadoH+" "+publicadorH+"</p><small class='text-muted'>"+duracionH+"</small>  </a>";
	}
  static async getStats(date){
    if (isOnline){
      const results=await getInformation("/estadisticas/today")
      return results
    }else{
      var query="select (select count(*) from historials where date('"+date+"')=date(hora)) as llamadas, (select count(*) from historials where (estado=2 or estado=6 or estado=1 or estado=3 or estado=7 or estado=8 or estado=10 or estado=11) and date('"+date+"')=date(hora)) as conversaciones,(select count(*) from historials where (estado=2 or estado=6 or estado=7 or estado=10 or estado=11) and date('"+date+"')=date(hora)) as conversaciones_receptivas,(select count(*) from historials where (estado=7 or estado=8 or estado=11) and date('"+date+"')=date(hora)) as revisitas,(select count(*) from historials where estado=2 and date('"+date+"')=date(hora)) as revisitas_obtenidas,(select count(*) from historials where (estado=7 or estado=2) and date('"+date+"')=date(hora)) as total_futuras_revisitas,(select count(*) from historials where (estado=1) and date('"+date+"')=date(hora)) as sin_interes_primera_visita, (select count(*) from historials where (estado=2) and date('"+date+"')=date(hora)) as nueva_revisita_primera_visita, (select count(*) from historials where (estado=3) and date('"+date+"')=date(hora)) as no_llamar_primera_visita, (select count(*) from historials where (estado=6) and date('"+date+"')=date(hora)) as receptivo_primera_visita, (select count(*) from historials where (estado=7) and date('"+date+"')=date(hora)) as revisita_exitosa, (select count(*) from historials where (estado=8) and date('"+date+"')=date(hora)) as no_llamar_revisita, (select count(*) from historials where (estado=10) and date('"+date+"')=date(hora)) as no_casa_revisita, (select COUNT(DISTINCT(publicador)) from historials where DATE(hora)=DATE('"+date+"') and publicador!=0) as publicadores, (select round(SUM(tiempo)/COUNT(tiempo),0) from historials where date('"+date+"')=date(hora) and tiempo!=0) as duracion, (select max(tiempo) from historials where date('"+date+"')=date(hora)) as max_extensa, (select count(distinct(publicador)) from historials where date(hora)=date('"+date+"') and publicador!=0 and (estado=2 or estado=6 or estado=1 or estado=3 or estado=7 or estado=8 or estado=10 or estado=11)) as conversadores, (select count(*) from historials where (estado=11) and date('"+date+"')=date(hora)) as estudios, (select count(*) from historials where (estado=12) and date('"+date+"')=date(hora)) as buzones, (select count(*) from historials where (tipo=1) and date('"+date+"')=date(hora)) as conversaciones_paralelas";
      var stmt = db.prepare(query);
      stmt.getAsObject(); // {col1:1, col2:111}
      var candidate=null;
      while(stmt.step()) { //
        var candidate = stmt.getAsObject();  
      }
      stmt.free();
      return candidate;
    }
    
  }
}

          
    