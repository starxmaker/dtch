function showStats(){
	setFechaHoy();
	var date=getCurrentDatetime();
	var stats=Historial.getStats(date);
document.getElementById("fldLlamadas").innerHTML=stats.llamadas_realizadas;
                  //conversaciones
                  document.getElementById("fldConversaciones").innerHTML=stats.conversaciones;
                  //hermanos
                  document.getElementById("fldHermanos").innerHTML=stats.publicadores;
                  //revisitas
                   document.getElementById("fldRevisitas").innerHTML=stats.revisitas;
                  //duración 
                  document.getElementById("fldDuracion").innerHTML=secondsToTime(stats.duracion);
                   document.getElementById("fldInteresados").innerHTML=stats.nueva_revisita_primera_visita;
                  //más extensa
                   document.getElementById("fldEstudios").innerHTML=stats.estudios;
                   document.getElementById("fldBuzones").innerHTML=stats.buzones;
                   //conversaciones por publicador
                   if(stats.publicadores>0){
                   document.getElementById("fldConversacionesPorPublicador").innerHTML=Math.round((stats.conversaciones/stats.publicadores) * 10) / 10;
                 }
              //grafico positividad
              var total_conversaciones=stats.conversaciones;
                var receptivas=stats.conversaciones_receptivas;
                var negativas=total_conversaciones-receptivas;
                chartReceptividad.data.datasets[0].data=[receptivas, negativas];
              chartReceptividad.update();
                //grafico pudimos hablar
                var total_en_paralelo=stats.conversaciones_paralelas;
                var total_en_vivo=total_conversaciones-total_en_paralelo;
                chartPudimosHablar.data.datasets[0].data=[total_en_vivo,total_en_paralelo];
                chartPudimosHablar.update();
                //muestra el modal
               document.getElementById("openModalEstadisticas").click();
 
   
  
}
function setFechaHoy(){
  var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
var f=new Date();
document.getElementById("fldHoy").innerHTML=diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();

}