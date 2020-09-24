function getTodayDate(){
	var today = new Date(); var dd = String(today. getDate()). padStart(2, '0');
var mm = String(today. getMonth() + 1). padStart(2, '0'); //January is 0!
var yyyy = today. getFullYear();
today = dd + '-' + mm + '-' + yyyy;
return today;
}
function sendNotification(message, type){
  var background="#00b09b";
  if (type=="notification") background="#00b09b";
  if (type=="warning") background="#f0ad4e";
  if(type=="error") background="#d9534f";
  Toastify({
  text: message,
  duration: 3000, 
  close: true,
  gravity: "bottom", 
  position: 'left',
  backgroundColor: background,
  stopOnFocus: true, // Prevents dismissing of toast on hover
}).showToast();
}

const estados=
	[
["grey", "No Utilizado", "fas fa-question"], 
["yellow", "Contestó", "fas fa-phone-volume"], 
["purple", "Nueva revisita", "fas fa-undo-alt"], 
["red", "No Llamar", "fas fa-ban"], 
["green", "Marca", "fas fa-phone-volume"], 
["black", "No existe", "fas fa-phone-slash"],
["green", "Receptivo", "fas fa-phone-volume"],
["orange", "Revisita", "fas fa-undo-alt"],
["red", "Ultima revisita", "fas fa-undo-alt"],
["brown", "Ocupado", "fas fa-phone-volume"],
["brown", "Revisita no encontrada", "fas fa-undo-alt"],
["cyan", "Estudio", "fas fa-undo-alt"],
["grey", "Buzón", "fas fa-undo-alt"],
["blue", "Ya llamado", "fas fa-clock"]
];

function getRenderedEstados(index){

	return "<font color='"+estados[index][0]+"'><b>"+estados[index][1]+"</b></font>";
}

function getRenderedEstadosIcon(index){
	return "<i class='"+estados[index][2]+"' style='color:"+estados[index][0]+"'></i>";
}


function getCurrentDatetime(){

	var date = new Date(); 
	var year=date.getFullYear()
	var month=date.getMonth()+1;
	if (month<10) month="0"+month;
	var day=date.getDate();
	if (day<10) day="0"+day;
	var hours=date.getHours();
	if(hours<10) hours="0"+hours;
	var minutes=date.getMinutes();
	if (minutes<10) minutes="0"+minutes;
	var seconds=date.getSeconds();
	if(seconds<10) seconds="0"+seconds;
	return year+"-"+month+"-"+day+" "+hours + ":"  + minutes + ":"  + seconds;
}

function secondsToTime(seconds){
// multiply by 1000 because Date() requires miliseconds
var date = new Date(seconds * 1000);
//var hh = date.getUTCHours();
var mm = date.getUTCMinutes();
var ss = date.getSeconds();
// If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
// if (hh > 12) {hh = hh % 12;}
// These lines ensure you have two-digits
//if (hh < 10) {hh = "0"+hh;}
if (mm < 10) {mm = "0"+mm;}
if (ss < 10) {ss = "0"+ss;}
// This formats your string to HH:MM:SS
var t = mm+":"+ss;
return t;
}

var timeSince = function(date) {
  if (typeof date !== 'object') {
    date = new Date(date);
  }

  var seconds = Math.floor((new Date() - date) / 1000);
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'año';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'mes';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'día';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hora";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minuto";
          } else {
            interval = seconds;
            intervalType = "segundo";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }

  return "Hace "+ interval + ' ' + intervalType;
};