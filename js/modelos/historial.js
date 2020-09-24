class Historial{
	constructor(id,id_numero, estado, hora, publicador, tiempo,tipo){
		 	this.id=id;
            this.id_numero=id_numero;
            this.estado=estado;
            this.hora=hora;
            this.publicador=publicador;
            this.tiempo=tiempo;
	}

  static getLastCalls(quantity){
    var query="select t.id, h.id as 'registro', t.direccion, t.numero, t.grupo, h.estado, h.hora, p.nombre as 'publicador' , h.tipo, h.tiempo from  historials h left join publicadores p on h.publicador=p.id left join telefonos t on (h.id_numero=t.id) order by h.id desc limit "+quantity;
    var stmt = db.prepare(query);
    stmt.getAsObject(); // {col1:1, col2:111}
      var records=[];
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        var record= new Historial(row.registro,row.id,row.estado,row.hora,row.publicador, secondsToTime(row.tiempo), row.tipo);
        records.push(record);
      }
      stmt.free();
      return records;
  }
	static getById(id){
		var stmt = db.prepare("select t.id as id_numero, h.id as 'registro', t.numero, t.grupo, h.estado, h.hora, h.tipo, p.nombre as 'publicador' from historials h left join telefonos t on (h.id_numero=t.id) left join publicadores p on t.publicador=p.id where h.id="+id);
  stmt.getAsObject(); // {col1:1, col2:111}
     	var candidate=null;
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        candidate=new Historial(row.registro,row.id,row.estado,row.hora,row.publicador, secondsToTime(row.tiempo), row.tipo);
        
      }
      stmt.free();
      return candidate;
	}
  static quickEntries(publicador, actividad, cantidad){
       var hora=getCurrentDatetime();
    for(var i=0; i<cantidad; i++){
 
    db.run("insert into historials (id_numero, estado, hora, publicador, tiempo, tipo) values (0,"+actividad+",'"+hora+"',"+publicador+",0,1);");
    }
  }  
static insert(id_numero, estado, publicador, tiempo){
    var hora=getCurrentDatetime();
    db.run("insert into historials (id_numero, estado, hora, publicador, tiempo, tipo) values ("+id_numero+","+estado+",'"+hora+"',"+publicador+","+tiempo+", 0);");
    var id=getLastInsertedId();
    return new Historial(id, id_numero, estado, hora, publicador, tiempo, 0);  
  }
  delete(){
     db.run("delete from historials where id="+this.id);
  }
	render(){
    var telefono=Telefono.getById(this.id_numero);

                    var fechaH=timeSince(this.hora);
                    var estadoH=getRenderedEstados(this.estado);
                    var publicadorH=this.publicador;
                    if (publicadorH=="-") publicadorH="";
                    var numeroH=telefono.numero;
                    if (numeroH==null || numeroH=="Propio") numeroH="Llamada independiente";
                    var grupoH=telefono.grupo;
                    if(grupoH==null){
                      grupoH="Llamada independiente";
                    }else{
                      if(grupoH==0){
                        grupoH="Desconocido";
                      }else{
                      grupoH="Grupo "+grupoH;
                      }
                    }
                    var id_telefono=this.id_numero;
                    var direccionH=telefono.direccion;
                    if (direccionH==null) direccionH="N/A";
                    var duracionH=this.tiempo;
                    if(duracionH=="00:00") duracionH="";

                    return "<a href='#' class='list-group-item list-group-item-action flex-column align-items-start' )'><div class='d-flex w-100 justify-content-between' ><h5 class='mb-1' onclick='loadNumeroById("+id_telefono+")' data-dismiss='modal'>"+numeroH+"</h5><small class='text-muted'>"+fechaH+" <i class='fas fa-trash-alt' onclick='deleteHistoryRecord("+this.id+")' data-dismiss='modal'></i></small></div><p class='mb-1'>"+estadoH+" "+publicadorH+"</p><small class='text-muted'>"+grupoH+" - "+direccionH+" - "+duracionH+"</small>  </a>";
                    
   

	}
  static getStats(date){
    var query="select (select count(*) from historials where date('"+date+"')=date(hora)) as llamadas_realizadas, (select count(*) from historials where (estado=2 or estado=6 or estado=1 or estado=3 or estado=7 or estado=8 or estado=10 or estado=11) and date('"+date+"')=date(hora)) as conversaciones,(select count(*) from historials where (estado=2 or estado=6 or estado=7 or estado=11) and date('"+date+"')=date(hora)) as conversaciones_receptivas,(select count(*) from historials where (estado=7 or estado=8 or estado=11) and date('"+date+"')=date(hora)) as revisitas,(select count(*) from historials where estado=2 and date('"+date+"')=date(hora)) as revisitas_obtenidas,(select count(*) from historials where (estado=7 or estado=2) and date('"+date+"')=date(hora)) as total_futuras_revisitas,(select count(*) from historials where (estado=1) and date('"+date+"')=date(hora)) as sin_interes_primera_visita, (select count(*) from historials where (estado=2) and date('"+date+"')=date(hora)) as nueva_revisita_primera_visita, (select count(*) from historials where (estado=3) and date('"+date+"')=date(hora)) as no_llamar_primera_visita, (select count(*) from historials where (estado=6) and date('"+date+"')=date(hora)) as receptivo_primera_visita, (select count(*) from historials where (estado=7) and date('"+date+"')=date(hora)) as revisita_exitosa, (select count(*) from historials where (estado=8) and date('"+date+"')=date(hora)) as no_llamar_revisita, (select count(*) from historials where (estado=10) and date('"+date+"')=date(hora)) as no_casa_revisita, (select COUNT(DISTINCT(publicador)) from historials where DATE(hora)=DATE('"+date+"') and publicador!=0) as publicadores, (select round(SUM(tiempo)/COUNT(tiempo),0) from historials where date('"+date+"')=date(hora) and tiempo!=0) as duracion, (select max(tiempo) from historials where date('"+date+"')=date(hora)) as max_extensa, (select count(distinct(publicador)) from historials where date(hora)=date('"+date+"') and publicador!=0 and (estado=2 or estado=6 or estado=1 or estado=3 or estado=7 or estado=8 or estado=10 or estado=11)) as conversadores, (select count(*) from historials where (estado=11) and date('"+date+"')=date(hora)) as estudios";
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

          
    