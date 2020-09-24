var timer;
var chronometer=0;
var isTimerWorking=false;
function startTimer(){
  chronometer=0;
  timer.start();
  isTimerWorking=true;
  document.getElementById("basicUsage").style.color="blue"; 
  document.getElementById("startButton").style.visibility="hidden"; 
   document.getElementById("pauseButton").style.visibility="visible"; 
   document.getElementById("resetButton").style.visibility="visible"; 
}
function stopTimer(){
  timer.pause();
  isTimerWorking=false;
  chronometer=timer.getTotalTimeValues().seconds;
   document.getElementById("basicUsage").style.color="purple"; 
  document.getElementById("startButton").style.visibility="hidden"; 
   document.getElementById("pauseButton").style.visibility="hidden"; 
   document.getElementById("resetButton").style.visibility="visible"
}
function resetTimer(){
  timer.reset();
  timer.stop();
  isTimerWorking=false;
   document.getElementById("basicUsage").style.color="#BEBEBE"; 
  document.getElementById('basicUsage').innerHTML='00:00:00';
   document.getElementById("startButton").style.visibility="visible"; 
   document.getElementById("pauseButton").style.visibility="hidden"; 
   document.getElementById("resetButton").style.visibility="hidden"
  chronometer=0;
}