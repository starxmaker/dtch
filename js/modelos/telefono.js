class Telefono{
	constructor(id,direccion,codigo_pais, codigo_region, numero,grupo,estado,ultima_llamada,publicador,fuente,visualizado_hoy,llamado_esta_semana, tipo){
		 	this.id=id;
            this.direccion=direccion;
            this.codigo_pais=codigo_pais;
            this.codigo_region=codigo_region;
            this.numero=numero;
            this.grupo=grupo;
            this.estado=estado;
            this.ultima_llamada=ultima_llamada;
            this.publicador=publicador;
            this.fuente=fuente;
            this.visualizado_hoy=visualizado_hoy;
            this.llamado_esta_semana=llamado_esta_semana;
            this.tipo;
            this.editado=false;
            if(id!=0) this.setVisualizacion();
	}
	static getById(id){
		var stmt = db.prepare("select t.id, t.direccion,t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.estado, t.ultima_llamada, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where t.id="+id);
  		stmt.getAsObject(); // {col1:1, col2:111}
      var candidate=null;
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        candidate=new Telefono(row.id,row.direccion,row.codigo_pais, row.codigo_region,row.numero,row.grupo,row.estado,row.ultima_llamada,row.publicador, row.fuente, row.visualizado_hoy,row.llamado_esta_semana, row.tipo);
      }
      if (candidate==null) candidate=Telefono.getBlank();
      stmt.free();
      return candidate;
	}
	static getBlank(){
		return new Telefono(0,"N/A","","","Propio",-1,0,"0000-00-00 00:00:00", "N/A", -1, false, false,-1);
	}
	static replacePublicador(idPublicador){
		db.run("update telefonos set estado=4 where (estado=7 || estado=2 || estado=8 || estado=10 || estado=11) and publicador="+idPublicador);

		db.run("update telefonos set publicador=null where publicador="+idPublicador);
	}

	static getLastCalled(grupo,filtros,cantidad){


var filters=[];
        var filtro_consulta="";

        //tipo
        if (!filtros.tipo.fijo) filters.push("tipo!=0");
        if (!filtros.tipo.celular) filters.push("tipo!=1");

              
        //respuesta
            if (!filtros.respuesta.marca) filters.push("estado!=4");
          if (!filtros.respuesta.ocupado) filters.push("estado!=9");
           if (!filtros.respuesta.receptivo) filters.push("estado!=6");
            if (!filtros.respuesta.sinInteres) filters.push("estado!=1");
            if (!filtros.respuesta.noUtilizado) filters.push("estado!=0");


        //grupo

        //otros
        if (!filtros.otros.visualizadoHoy) filters.push("Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer)>=1");
        if (!filtros.otros.llamadoSemana) filters.push("Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer)>=7");

           if(filters.length>0) filtro_consulta=" AND ("+filters.join(" AND ")+") ";
        


		if(grupo==-1 || grupo==-2){
			var query="select t.id, t.direccion, t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.estado, t.ultima_llamada, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<=1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<=7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where (estado=1 or estado=4 or estado=6 or estado=9 or estado=0 or estado=12) "+filtro_consulta+" order by ultima_llamada asc limit "+cantidad;
		
		}else{
			var query="select t.id, t.direccion, t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.estado, t.ultima_llamada, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<=1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<=7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where (estado=1 or estado=4 or estado=6 or estado=9 or estado=0 or estado=12) "+filtro_consulta+" AND t.grupo="+grupo+" order by ultima_llamada asc limit "+cantidad;
		}
		var stmt=db.prepare(query);
		stmt.getAsObject(); // {col1:1, col2:111}

		if(cantidad>1) var numeros=[];
		var candidate;
      
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        candidate=new Telefono(row.id,row.direccion,row.codigo_pais, row.codigo_region,row.numero,row.grupo,row.estado,row.ultima_llamada,row.publicador, row.fuente, row.visualizado_hoy,row.llamado_esta_semana, row.tipo);
        if(cantidad>1) numeros.push(candidate);
        
      }
      stmt.free();
      if (candidate==null) Telefono.getBlank();
      if(cantidad>1) return numeros;
      return candidate;
	}
	static getDifferentGroups(){
		var grupos=[];
		var stmt=db.prepare("select distinct(grupo) as grupo from telefonos order by 1 asc;");
		 while(stmt.step()) { //
        	var row = stmt.getAsObject();
        	grupos.push(row.grupo);
        }
        stmt.free();
        return grupos;
	}
	static checkExistance(numero){
		var query="select numero from telefonos where codigo_pais || codigo_region || numero='"+numero+"'";
		var stmt=db.prepare(query);
		stmt.getAsObject(); // {col1:1, col2:111}
		var exist=false;
      
      while(stmt.step()) { //
        exist=true;
      }
      stmt.free();
      return exist;
	}
	static insert(codigoPais, codigoRegion,numero,direccion,grupo,fuente, tipo){
		var statement="insert into telefonos (codigo_pais, codigo_region, numero, direccion, grupo, fuente,estado, ultima_llamada, publicador, ultima_visualizacion, tipo) values ("+codigoPais+",'"+codigoRegion+"','"+numero+"','"+direccion+"',"+grupo+","+fuente+",0,'0000-00-00 00:00:00', 0, '0000-00-00 00:00:00',"+tipo+");";
		db.run(statement);
	}
	static query(search){
		var query;
		if (isNaN(search)){
			query="select t.id, t.direccion, t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.estado, t.ultima_llamada, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where p.nombre like '%"+search+"%' and (estado=2 or estado=7 or estado=8 or estado=10 or estado=11) order by t.id asc";
		}else{

		query="select t.id, t.direccion, t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.estado, t.ultima_llamada, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where codigo_pais || codigo_region || numero like '%"+search+"%' order by t.id asc";
		}
		var telefonos=[];
		var stmt=db.prepare(query);
		 while(stmt.step()) { //
        	var row = stmt.getAsObject();
        	
        	var publicador="";
        	if (row.estado==2 || row.estado==7 || row.estado==8 || row.estado==10 || row.estado==11) publicador="("+row.publicador+")";
        	if(row.llamado_esta_semana=="true") row.estado=13;
        	telefonos.push([row.id,row.numero,row.estado, publicador]);
        }
        stmt.free();
        return telefonos;

	}
	static getAll(){
		var query="select t.id, t.direccion, t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.estado, t.ultima_llamada, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where estado!=5 order by t.id asc";
		var telefonos=[];
		var stmt=db.prepare(query);
		 while(stmt.step()) { //
        	var row = stmt.getAsObject();
        	if(row.llamado_esta_semana=="true") row.estado=13;
        	var publicador="";
        	if (row.estado==2 || row.estado==7 || row.estado==8 || row.estado==10 || row.estado==11) publicador="("+row.publicador+")";
        	var currentTelefono=new Telefono(row.id,row.direccion,row.codigo_pais, row.codigo_region,row.numero,row.grupo,row.estado,row.ultima_llamada,row.publicador, row.fuente, row.visualizado_hoy,row.llamado_esta_semana, row.tipo);
        	telefonos.push(currentTelefono);
        }
        stmt.free();
        return telefonos;

	}
	setVisualizacion(){
		db.run("update telefonos set ultima_visualizacion='"+getCurrentDatetime()+"' where id="+this.id);
	}
	delete(){
		db.run("delete from telefonos where id="+this.id);
	}
	updateEstado(newEstado, publicador,tiempo){
		 var isNotEditable=(this.estado==2 || this.estado==3 || this.estado==7 || this.estado==8 || this.estado==10 || this.estado==11) && (newEstado==0 || newEstado==9 || newEstado==4 || newEstado==6 || newEstado==12 || newEstado==this.estado);
		this.editado=true;
		if(!isNotEditable){
		
		this.estado=newEstado;
		this.publicador=publicador;
		}
		var idPublicador=Publicador.getIdByName(this.publicador);



		if(this.id!=0) db.run("update telefonos set estado='"+this.estado+"', publicador="+idPublicador+",  ultima_llamada='"+getCurrentDatetime()+"' where id="+this.id);
		Historial.insert(this.id,newEstado,idPublicador,tiempo,0);
	}
	renderRow(){
		var fuente=Fuente.getById(this.fuente);
		return "<li class='list-group-item list-group-item-action flex-column align-items-start' )'><div class='d-flex w-100 justify-content-between' > <h5 class='numero'>"+this.numero+" ("+getRenderedEstados(this.estado)+")</h5> <small class='text-muted fuente'>"+fuente.nombre+"  <i class='fas fa-trash-alt' onclick='deleteTelefono("+this.id+")' data-dismiss='modal'></i></small></div> <small class='publicador mb-1'>Llamado "+timeSince(this.ultima_llamada).toLowerCase()+" por "+this.publicador+"</small> <br> <small class='direccion text-muted'>"+this.direccion+" (Grupo "+this.grupo+")</small> </li>";
	}
	static checkAvailableNumbers(){
		var query="select count(*) as cantidad from telefonos where estado=0";
		var telefonos=[];
		var stmt=db.prepare(query);
		var quantity=0;
		 while(stmt.step()) { //
        	var row = stmt.getAsObject();
        	
        	quantity=row.cantidad;
        }
        stmt.free();
        return quantity;
	}


}
          