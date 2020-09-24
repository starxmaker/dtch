class Telefono{
	constructor(id,direccion,numero,grupo,estado,ultima_llamada,publicador,fuente,visualizado_hoy,llamado_esta_semana){
		 	this.id=id;
            this.direccion=direccion;
            this.numero=numero;
            this.grupo=grupo;
            this.estado=estado;
            this.ultima_llamada=ultima_llamada;
            this.publicador=publicador;
            this.fuente=fuente;
            this.visualizado_hoy=visualizado_hoy;
            this.llamado_esta_semana=llamado_esta_semana;
            this.editado=false;
            if(id!=0) this.setVisualizacion();
	}
	static getById(id){
		var stmt = db.prepare("select t.id, t.direccion, t.numero, t.grupo, t.estado, t.ultima_llamada, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t inner join publicadores p on t.publicador=p.id where t.id="+id);
  		stmt.getAsObject(); // {col1:1, col2:111}
      var candidate=null;
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        candidate=new Telefono(row.id,row.direccion,row.numero,row.grupo,row.estado,row.ultima_llamada,row.publicador, row.fuente, row.visualizado_hoy,row.llamado_esta_semana);
      }
      if (candidate==null) candidate=Telefono.getBlank();
      stmt.free();
      return candidate;
	}
	static getBlank(){
		return new Telefono(0,"N/A","Propio",-1,0,"0000-00-00 00:00:00", "N/A", -1, false, false);
	}

	static getLastCalled(grupo,filtros,cantidad){
		if(grupo==-1 || grupo==-2){
			var query="select t.id, t.direccion, t.numero, t.grupo, t.estado, t.ultima_llamada, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t inner join publicadores p on t.publicador=p.id where (estado=1 or estado=4 or estado=6 or estado=9 or estado=0) order by ultima_llamada asc limit 1";
		
		}else{
			var query="select t.id, t.direccion, t.numero, t.grupo, t.estado, t.ultima_llamada, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t inner join publicadores p on t.publicador=p.id where (estado=1 or estado=4 or estado=6 or estado=9 or estado=0) AND t.grupo="+grupo+" order by ultima_llamada asc limit 1";
		}
		var stmt=db.prepare(query);
		stmt.getAsObject(); // {col1:1, col2:111}
		var candidate;
      
      while(stmt.step()) { //
        var row = stmt.getAsObject();
        candidate=new Telefono(row.id,row.direccion,row.numero,row.grupo,row.estado,row.ultima_llamada,row.publicador, row.fuente, row.visualizado_hoy,row.llamado_esta_semana);
        
      }
      stmt.free();
      if (candidate==null) Telefono.getBlank();
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
	static query(search){
		var query;
		if (isNaN(search)){
			query="select t.id, t.direccion, t.numero, t.grupo, t.estado, t.ultima_llamada, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t inner join publicadores p on t.publicador=p.id where p.nombre like '%"+search+"%' and (estado=2 or estado=7 or estado=8 or estado=10 or estado=11) order by t.id asc";
		}else{

		query="select t.id, t.direccion, t.numero, t.grupo, t.estado, t.ultima_llamada, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t inner join publicadores p on t.publicador=p.id where replace(replace(replace(replace(t.numero,' ',''),'(',''),')',''),'+','') like '%"+search+"%' order by t.id asc";
		}
		var telefonos=[];
		var stmt=db.prepare(query);
		 while(stmt.step()) { //
        	var row = stmt.getAsObject();
        	if(row.llamado_esta_semana=="true") row.estado=13;
        	var numero=";"
        	if(row.numero.length==13) numero=row.numero.substr(7);
        	if(row.numero.length==14) numero=row.numero.substr(6);
        	var publicador="";
        	if (row.estado==2 || row.estado==7 || row.estado==8 || row.estado==10 || row.estado==11) publicador="("+row.publicador+")";
        	telefonos.push([row.id,numero,row.estado, publicador]);
        }
        stmt.free();
        return telefonos;

	}
	setVisualizacion(){
		db.run("update telefonos set ultima_visualizacion='"+getCurrentDatetime()+"' where id="+this.id);
	}
	updateEstado(newEstado, publicador,tiempo){
		
		this.editado=true;
		this.estado=newEstado;
		this.publicador=publicador;
		var idPublicador=Publicador.getIdByName(publicador);


		if(this.id!=0) db.run("update telefonos set estado='"+newEstado+"', publicador="+idPublicador+",  ultima_llamada='"+getCurrentDatetime()+"' where id="+this.id);
		Historial.insert(this.id,newEstado,idPublicador,tiempo);
	}


}
          