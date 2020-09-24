function showStats(){
	setFechaHoy();
	var date=getCurrentDatetime();
	//var date="2020-09-21";
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
                var total_participantes=stats.publicadores;
                var total_conversantes=stats.conversadores;
                var total_no_conversantes=total_participantes-total_conversantes;
                chartPudimosHablar.data.datasets[0].data=[total_conversantes,total_no_conversantes];
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