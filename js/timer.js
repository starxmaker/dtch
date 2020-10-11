var timer;
var chronometer=0;
var isTimerWorking=false;
function startTimer(){
  chronometer=0;
  timer.start();
  isTimerWorking=true;
  document.getElementById("basicUsage").style.color="blue"; 
  document.getElementById("startButton").style.display="none"; 
   document.getElementById("pauseButton").style.display="block"; 
   document.getElementById("resetButton").style.display="none"; 
}
function stopTimer(){
  timer.pause();
  isTimerWorking=false;
  chronometer=timer.getTotalTimeValues().seconds;
   document.getElementById("basicUsage").style.color="purple"; 
  document.getElementById("startButton").style.display="none"; 
   document.getElementById("pauseButton").style.display="none"; 
   document.getElementById("resetButton").style.display="block"
}
function resetTimer(){
  timer.reset();
  timer.stop();
  isTimerWorking=false;
   document.getElementById("basicUsage").style.color="#BEBEBE"; 
  document.getElementById('basicUsage').value='00:00:00';
   document.getElementById("startButton").style.display="block"; 
   document.getElementById("pauseButton").style.display="none"; 
   document.getElementById("resetButton").style.display="none"
  chronometer=0;
}

function handleTimer(){
  if(isTimerWorking){
    stopTimer()
  }else{
    if(chronometer==0){
      startTimer()
    }else{
      resetTimer()
    }
  }
}