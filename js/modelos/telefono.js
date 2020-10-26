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
        this.tipo=tipo;
        this.editado=false;
        if(id!=0) this.setVisualizacion();
	}
	static async getById(id){
		if (isOnline){
			const response=await getInformation("/telefonos/"+id)
			var telefono=null
			if (response!=null && response.length>0){
				const results=response[0]
			  	telefono=new Telefono(
				  results.idTelefono,
				  results.direccion,
				  results.codigo_pais, 
				  results.codigo_region,
				  results.numero,
				  results.grupo,
				  results.estado,
				  joinDate(results.ultima_llamada_year, results.ultima_llamada_month, results.ultima_llamada_day, results.ultima_llamada_hour, results.ultima_llamada_minute, results.ultima_llamada_second),
				  results.idPublicador,
				  results.fuente,
				  false,
				  results.dias_desde<7,
				  results.tipo);
			}else{
			  telefono=Telefono.getBlank()
			}
			return telefono
		}else{
			var stmt = db.prepare("select t.id, t.direccion,t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.estado, t.publicador as idPublicador, t.ultima_llamada, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where t.id="+id);
			stmt.getAsObject(); // {col1:1, col2:111}
			var candidate=null;
			while(stmt.step()) { //
				var row = stmt.getAsObject();
				candidate=new Telefono(row.id,row.direccion,row.codigo_pais, row.codigo_region,row.numero,row.grupo,row.estado,row.ultima_llamada,row.idPublicador, row.fuente, row.visualizado_hoy,row.llamado_esta_semana, row.tipo);
				}
			if (candidate==null) candidate=Telefono.getBlank();
			stmt.free();
			return candidate;
		}
	}
	static getBlank(){
		return new Telefono(0,"N/A","","","Propio",-1,0,"0000-00-00 00:00:00", "N/A", -1, false, false,-1);
	}
	static async replacePublicador(idPublicador){
		if (isOnline){
			await getInformation("/replacePublicador/"+idPublicador)
		}else{
			db.run("update telefonos set estado=4 where (estado=7 || estado=2 || estado=8 || estado=10 || estado=11) and publicador="+idPublicador);
			db.run("update telefonos set publicador=null where publicador="+idPublicador);
		}
		
	}

	static async getLastCalled(grupo,filtros,cantidad){
		if (isOnline){
			let candidate
			console.log(filtros)
			const nextTelefono=await postInformation("/telefonos/nextNumber", {filtro:filtros, quantity: cantidad})
			if(cantidad>1) var numeros=[];
			if (nextTelefono.length>0){
				nextTelefono.forEach(results =>{
					candidate=new Telefono(
						results.idTelefono,
						results.direccion,
						results.codigo_pais, 
						results.codigo_region,
						results.numero,
						results.grupo,
						results.estado,
						joinDate(results.ultima_llamada_year, results.ultima_llamada_month, results.ultima_llamada_day, results.ultima_llamada_hour, results.ultima_llamada_minute, results.ultima_llamada_second),
						results.idPublicador,
						results.fuente,
						false,
						results.dias_desde<7,
						results.tipo)})
					if(cantidad>1) numeros.push(candidate);

			}else{
				return Telefono.getBlank()
			}
			
			if(cantidad>1) return numeros;
			return candidate

		}else{
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
			if (!filtros.respuesta.revisita){
				filters.push("estado!=7 and estado!=2 and estado!=10 and estado!=11")
			}else{
				filters.push("t.publicador="+filtros.respuesta.revisitaPublisher.value)
			}
			//grupo
			for(var i=0;i<filtros.blockedGrupos.length;i++){
				filters.push("t.grupo!="+filtros.blockedGrupos[i]);
			}
			//fuentes
			for(var i=0;i<filtros.blockedFuentes.length;i++){
				filters.push("fuente!="+filtros.blockedFuentes[i]);
			}
			//otros
			if (!filtros.otros.visualizadoHoy) filters.push("Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer)>=1");
			if (!filtros.otros.llamadoSemana) filters.push("Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer)>=7");
			if(filters.length>0) filtro_consulta=" AND ("+filters.join(" AND ")+") ";
			if(grupo==-1 || grupo==-2){
				var query="select t.id, t.direccion, t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.estado, t.ultima_llamada, t.publicador as idPublicador, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where (estado!=3 and estado!=8 and estado!=5) "+filtro_consulta+" order by ultima_llamada asc limit "+cantidad;
			}else{
				var query="select t.id, t.direccion, t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.estado, t.ultima_llamada, t.publicador as idPublicador, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where (estado!=3 and estado!=8 and estado!=5) "+filtro_consulta+" and t.grupo="+grupo+" order by ultima_llamada asc limit "+cantidad; 
			}
			var stmt=db.prepare(query);
			stmt.getAsObject(); // {col1:1, col2:111}
			if(cantidad>1) var numeros=[];
			var candidate;
			while(stmt.step()) { //
				var row = stmt.getAsObject();
				candidate=new Telefono(row.id,row.direccion,row.codigo_pais, row.codigo_region,row.numero,row.grupo,row.estado,row.ultima_llamada,row.idPublicador, row.fuente, row.visualizado_hoy,row.llamado_esta_semana, row.tipo);
				if(cantidad>1) numeros.push(candidate);
			}
			stmt.free();
			if (candidate==null) candidate=Telefono.getBlank();
			if(cantidad>1) return numeros;
			return candidate;
		}
	}
	static async getDifferentGroups(){
		if (isOnline){
			const grupos= await getInformation("/grupos/getAll")
			return grupos
		}else{
			var grupos=[];
			var stmt=db.prepare("select distinct(grupo) as grupo from telefonos order by 1 asc;");
			while(stmt.step()) { //
				var row = stmt.getAsObject();
				grupos.push(row.grupo);
			}
			stmt.free();
			return grupos;
		}
		
	}
	static async checkExistance(numero){
		if (isOnline){
			const exists= await getInformation("/telefonos/checkExistance/"+numero)
			return exists.exists
		}else{
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
	}
	static async insert(codigoPais, codigoRegion,numero,direccion,grupo,fuente, tipo){
		if (isOnline){
			const nextTelefono=await postInformation("/telefonos", {
				direccion: direccion,
				codigo_pais: codigoPais,
				codigo_region: codigoRegion,
				numero: numero,
				grupo: grupo,
				fuente: fuente,
				tipo: tipo,
				publicador: 0
			})
		}else{
			var statement="insert into telefonos (codigo_pais, codigo_region, numero, direccion, grupo, fuente,estado, ultima_llamada, publicador, ultima_visualizacion, tipo) values ("+codigoPais+",'"+codigoRegion+"','"+numero+"','"+direccion+"',"+grupo+","+fuente+",0,'0000-00-00 00:00:00', null, '0000-00-00 00:00:00',"+tipo+");";
			db.run(statement);
			saveStoredDatabase();
		}
		
	}
	static async query(search){
		if (isOnline){
			const results=await getInformation("/telefonos/query/"+search)
			var telefonos=[]
			results.forEach(item =>{
				var publicador="";
				if (item.estado==2 || item.estado==7 || item.estado==8 || item.estado==10 || item.estado==11) publicador="("+item.nombrePublicador+")";
				let estado=item.estado
				if(item.dias_desde<7) estado=13;
				telefonos.push([item.idTelefono,item.numero,item.estado, publicador]);
			})
			return telefonos
		}else{
			var query;
			if (isNaN(search)){
				query="select t.id, t.direccion, t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.estado, t.publicador as idPublicador,  t.ultima_llamada, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where p.nombre like '%"+search+"%' and (estado=2 or estado=7 or estado=8 or estado=10 or estado=11) order by t.id asc";
			}else{

			query="select t.id, t.direccion, t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.publicador as idPublicador, t.estado, t.ultima_llamada, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where codigo_pais || codigo_region || numero like '%"+search+"%' order by t.id asc";
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
		

	}
	static async getAll(){

		if (isOnline){
			let candidate
			const nextTelefono=await postInformation("/telefonos/getAll")
			var numeros=[];
			if (nextTelefono.length>0){
				nextTelefono.forEach(results=>{
					candidate=new Telefono(
						results.idTelefono,
						results.direccion,
						results.codigo_pais, 
						results.codigo_region,
						results.numero,
						results.grupo,
						results.estado,
						joinDate(results.ultima_llamada_year, results.ultima_llamada_month, results.ultima_llamada_day, results.ultima_llamada_hour, results.ultima_llamada_minute, results.ultima_llamada_second),
						results.idPublicador,
						results.fuente,
						false,
						results.dias_desde<7,
						results.tipo)})
					numeros.push(candidate);

			}
			return numeros;

		}else{

			var query="select t.id, t.direccion, t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.publicador as idPublicador,  t.estado, t.ultima_llamada, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where estado!=5 order by t.id asc";
			var telefonos=[];
			var stmt=db.prepare(query);
			while(stmt.step()) { //
				var row = stmt.getAsObject();
				if(row.llamado_esta_semana=="true") row.estado=13;
				var publicador="";
				if (row.estado==2 || row.estado==7 || row.estado==8 || row.estado==10 || row.estado==11) publicador="("+row.publicador+")";
				var currentTelefono=new Telefono(row.id,row.direccion,row.codigo_pais, row.codigo_region,row.numero,row.grupo,row.estado,row.ultima_llamada,row.idPublicador, row.fuente, row.visualizado_hoy,row.llamado_esta_semana, row.tipo);
				telefonos.push(currentTelefono);
			}
			stmt.free();
			return telefonos;
		}

	}

  static async getRevisitasByPublicador(publicador){
	if (isOnline){
		let candidate
		const nextTelefono=await postInformation("/telefonos/revisitasByPublicador/"+publicador)
		var numeros=[];
		if (nextTelefono.length>0){
			nextTelefono.forEach(results =>{
				candidate=new Telefono(
					results.idTelefono,
					results.direccion,
					results.codigo_pais, 
					results.codigo_region,
					results.numero,
					results.grupo,
					results.estado,
					joinDate(results.ultima_llamada_year, results.ultima_llamada_month, results.ultima_llamada_day, results.ultima_llamada_hour, results.ultima_llamada_minute, results.ultima_llamada_second),
					results.idPublicador,
					results.fuente,
					false,
					results.dias_desde<7,
					results.tipo)})
				numeros.push(candidate);

		}
		return numeros;

	}else{

		var query="select t.id, t.direccion, t.codigo_pais, t.codigo_region, t.numero, t.grupo, t.estado,t.publicador as idPublicador,  t.ultima_llamada, t.tipo, p.nombre as 'publicador', t.fuente, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_visualizacion))) as Integer) from telefonos t2 where t.id=t2.id)<1,'true','false')) as visualizado_hoy, (select iif((select Cast((JulianDay(date('now'))-JulianDay(date(ultima_llamada))) as Integer) from telefonos t2 where t.id=t2.id)<7,'true','false')) as llamado_esta_semana from telefonos t left join publicadores p on t.publicador=p.id where (t.estado=2 or t.estado=7 or t.estado=10 or t.estado=11) and publicador="+publicador;
		var telefonos=[];
		var stmt=db.prepare(query);
		while(stmt.step()) { //
			var row = stmt.getAsObject();
			var currentTelefono=new Telefono(row.id,row.direccion,row.codigo_pais, row.codigo_region,row.numero,row.grupo,row.estado,row.ultima_llamada,row.idPublicador, row.fuente, row.visualizado_hoy,row.llamado_esta_semana, row.tipo);
			telefonos.push(currentTelefono);
		}
		stmt.free();
		return telefonos;
	}

	}
	setVisualizacion(){
		if (!isOnline){
			db.run("update telefonos set ultima_visualizacion='"+getCurrentDatetime()+"' where id="+this.id);
		}
		
	}
	async delete(){
		if (isOnline){
			await deleteInformation("/telefonos/"+this.id)
		}else{
			db.run("delete from telefonos where id="+this.id);
		}
		
	}
  	async release(){
		if (isOnline){
			await getInformation("/telefonos/release/"+this.id)
		}else{
			db.run("update telefonos set estado=4, publicador=null where id="+this.id);
		}
  	}
  	async updateEstado(newEstado, publicador,tiempo){
		if (isOnline){
			await patchInformation("/telefonos", {idTelefono:this.id, newEstado:newEstado, newPublicador: publicador, tiempo:tiempo})
			this.editado=true;
			this.estado=newEstado;
			this.publicador=publicador;
		}else{
			var isNotEditable=(this.estado==2 || this.estado==3 || this.estado==7 || this.estado==8 || this.estado==10 || this.estado==11) && (newEstado==0 || newEstado==9 || newEstado==4 || newEstado==6 || newEstado==12 || newEstado==this.estado);
			this.editado=true;
			if(!isNotEditable){
				this.estado=newEstado;
				this.publicador=publicador;
			}
			var idPublicador=publicador;
			if(this.id!=0) db.run("update telefonos set estado='"+this.estado+"', publicador="+idPublicador+",  ultima_llamada='"+getCurrentDatetime()+"' where id="+this.id);
			await Historial.insert(this.id,newEstado,idPublicador,tiempo,0);
		}
		

	}
	renderRow(){
		return "<li class='list-group-item list-group-item-action flex-column align-items-start' )'><div class='d-flex w-100 justify-content-between' > <h5 class='numero'>"+this.numero+" ("+getRenderedEstados(this.estado)+")</h5> <small class='text-muted fuente'>  <i class='fas fa-trash-alt' onclick='deleteTelefono("+this.id+")' data-dismiss='modal'></i></small></div> <small class='publicador mb-1'>Llamado "+timeSince(this.ultima_llamada).toLowerCase()+" por "+this.publicador+"</small> <br> <small class='direccion text-muted'>"+this.direccion+" (Grupo "+this.grupo+")</small> </li>";
	}
  	renderRowManageRevisitas(){
    	return "<li class='list-group-item list-group-item-action flex-column align-items-start' )'><div class='d-flex w-100 justify-content-between' > <h5 class='numero'>"+this.numero+" ("+getRenderedEstados(this.estado)+")</h5> <small class='text-muted fuente'>  <i class='fas fa-trash-alt' onclick='deleteRevisita("+this.id+")'></i></small></div> <small class='publicador mb-1'>Llamado "+timeSince(this.ultima_llamada).toLowerCase()+" por "+this.publicador+"</small> <br> <small class='direccion text-muted'>"+this.direccion+" (Grupo "+this.grupo+")</small> </li>";
  	}
	static async checkAvailableNumbers(){
		if (isOnline){
			const results=await getInformation("/telefonos/available")
			return results.available
		}else{
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


}
          