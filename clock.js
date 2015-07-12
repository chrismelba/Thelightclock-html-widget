var width; 
var height;
var needRedraw = false;
var key_left = false;
var key_right = false;
var key_up = false;
var drawRadius;
var innerRadius;
var curTime;
var lastSeconds = -1;
var TwoPI = 2 * Math.PI;
var pixelcount = 120;
var INTERVAL = TwoPI / pixelcount;
var ctx;// = $("#canvas")[0].getContext('2d');

var brightGreen = new HSVColour(120, 100, 100);
var brightRed = new RGBColour(255, 50, 0);
var clock = [];


function show(ctx, x, y) {
  ctx.save();
  
  ctx.translate (x, y);
  /* Make 0 degress = midnight */
  ctx.rotate (-Math.PI/2);

  for (var i = 0; i < pixelcount; i++) {
    var a = i * INTERVAL;
    var end = a + INTERVAL + (Math.PI / 100);
    
    ctx.beginPath ();
     ctx.fillStyle = clock[i];
     ctx.arc (0, 0, drawRadius, i, end);
     ctx.arc (0, 0, innerRadius, end, i, true);
     ctx.fill();
  };
  ctx.restore();
}


function draw(ctx, x, y, col1, col2, hours, mins)
{

  ctx.restore();

  
  ctx.translate (x, y);
  /* Make 0 degress = midnight */
  ctx.rotate (-Math.PI/2);

  //var secs = curTime.getSeconds() + curTime.getMilliseconds() / 1000;


  //var angles = [hours * TwoPI / 12, mins * TwoPI / 60, secs * TwoPI / 60];
  
  //var secs = curTime.getSeconds();

  var angles = [hours * TwoPI / 12, mins * TwoPI / 60];//, secs * TwoPI / 60];


  // draw hours and minutes
  // Calculate offset between hours and minutes
  var minutes_offset = angles[1] - angles[0];
  if (minutes_offset < 0)
    minutes_offset = minutes_offset + 2 * Math.PI;
    // 2. We need 2 aux colours for blending:
  //    the value of the 'hours' colour at the minutes mark/angle
  var hoursColAtMins = mixRGB (white, col1, 1.0 - (minutes_offset / TwoPI));
  //    the value of the 'minutes' colour at the hours mark/angle
  var minsColAtHour = mixRGB (white, col2, (minutes_offset / TwoPI));
  //debug ("Minutes offset = " + minutes_offset + " = " + (minutes_offset / TwoPI));
  ctx.save();
  // 1. rotate canvas to start at 'hours'
  ctx.rotate (angles[0]);


 // debug ("<p>hoursColAtMins " + hoursColAtMins + " minsColAtHour " + minsColAtHour);
  // 2. draw 'hours' + tail end of 'minutes' colour round to where minutes starts/
  drawArc (ctx, minsColAtHour, mixCMYK (hoursColAtMins, col2), 0, minutes_offset);
  // 3. draw 'minutes' colour + tail of 'hours' colour' back round to 'hours'
  drawArc (ctx, hoursColAtMins, mixCMYK (minsColAtHour, col1), minutes_offset, TwoPI);

  //drawArc (ctx, white, minsColour, minutes_offset, 2 * Math.PI + minutes_offset);
  //drawArc (ctx, white, hoursColAtMins, 0, TwoPI);
  //drawArc (ctx, minsColAtHour, minsColour, 0, TwoPI);
  ctx.restore();

  // draw seconds


  ctx.beginPath ();
  ctx.strokeStyle = "#aaaaaa";
  ctx.lineWidth = 1.0;
  ctx.arc (0, 0, innerRadius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.restore();
  ctx.fillStyle = "yellow";
  ctx.font = "bold 16px Calibri";
  ctx.textAlign="center"; 
  ctx.fillText("Hours", width/6, height/2);

  ctx.restore();
  ctx.fillStyle = "green";
  ctx.font = "bold 16px Calibri";
  ctx.textAlign="center"; 
  ctx.fillText("Time", width/2, height/2);  

  ctx.restore();
  ctx.fillStyle = "blue";
  ctx.font = "bold 16px Calibri";
  ctx.textAlign="center"; 
  ctx.fillText("Minutes", 5*width/6, height/2);

      ctx.restore();
    ctx.beginPath();
    ctx.strokeStyle = "transparent";
    
    var grdRadial = ctx.createRadialGradient(x, y,drawRadius *1.05 , x, y, innerRadius);
    grdRadial.addColorStop(1, "rgba(253, 253, 253, 1)");
    grdRadial.addColorStop(0.673, "rgba(253, 253, 253, 1)");
    grdRadial.addColorStop(0.527, "rgba(253, 253, 253, 0)");
    grdRadial.addColorStop(0.473, "rgba(253, 253, 253, 0.1)");
    grdRadial.addColorStop(0.423, "rgba(253, 253, 253, 0)");
    grdRadial.addColorStop(0.424, "rgba(253, 253, 253, 0.8)");
    grdRadial.addColorStop(0.3, "rgba(253, 253, 253, 0.6)");
    grdRadial.addColorStop(0.22, "rgba(253, 253, 253, 0.5)");
    grdRadial.addColorStop(0, "rgba(253, 253, 253, 1)");
    
    //ctx.fillRect(10, 10, 150, 100);
    ctx.arc(x, y, drawRadius*1.001,0,2*Math.PI);
    ctx.fillStyle = grdRadial;
    ctx.fill();



}

function parsergb(input) {
  m = input.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if( m) {
        return [m[1],m[2],m[3]];
    }

  }
function tick()
{
  //hoursColour = parsergb(document.getElementById("hourcolourpicker").value);
  //debug
  //console.log(document.getElementById("hourcolourpicker").value);
  if (key_left) {
  }
  else if (key_right) {
  }
  if (key_up) {
  }
  /* Check the time */
  curTime = new Date();
  var newTime = curTime.getSeconds();
  newTime = newTime + 0.1 * parseInt (curTime.getMilliseconds / 100);

  if (newTime != lastSeconds) {
    lastSeconds = curTime.getSeconds();
    needRedraw = true;
  }
  if (needRedraw) {
    needRedraw = false;
    if (document.getElementById("currentradio").checked) {
    var mins = curTime.getMinutes() + (curTime.getSeconds() / 60);
    var hours = curTime.getHours() % 12 + (mins / 60);
    };

    if (document.getElementById("fastradio").checked) {
    var mins = curTime.getSeconds() % 10 * 6 + curTime.getMilliseconds()/1000*6;
    var hours = curTime.getSeconds()/10 + (6*(curTime.getMinutes()%2)); 
    }
    
    if (document.getElementById("manualradio").checked) {
    var mins = document.getElementById('minutestextbox').value % 60;
    var hours = document.getElementById('hourstextbox').value % 12 + (mins / 60); 
    }



    ctx.clearRect(0,0,width,height);
    //draw(ctx, width/6, height/2,hoursColour,white, hours, mins);
    show(ctx, width/6, height/2);
    //draw(ctx, width/2, height/2,hoursColour,minsColour, hours, mins);
    //draw(ctx, 5*width/6, height/2, white,minsColour , hours, mins);

    if (document.getElementById("manualradio").checked == false) {
        document.getElementById('minutestextbox').value = pad(Math.floor(mins));
        document.getElementById('hourstextbox').value = middayIsTwelve(Math.floor(hours));
    }
    document.getElementById('bothtextbox').value = middayIsTwelve(Math.floor(hours)) + ":" + pad(Math.floor(mins));
    




  }
}

function manualmode() {
  document.getElementById("manualradio").checked = true;
}

function pad(n) {
  return (n < 10) ? ("0" + n) : n;
}

function middayIsTwelve(n) {
   var x;
    x = n;
    if (n == 0) {x = 12};
    if (n == 12) {x = 0};
    return x;
}

//$(function(){
jQuery(document).ready(function($){


 if (document.getElementById("canvas")) {
  // jQuery("#hourcolourpicker").spectrum({
  //   preferredFormat: "rgb",
  //   color: toRGB(hoursColour),
  //   move: function(colour){c=colour.toRgb(); hoursColour=[c.r,c.g,c.b];},
  //   change: function(colour){c=colour.toRgb(); hoursColour=[c.r,c.g,c.b];}
  // });


  ctx = $("#canvas")[0].getContext('2d');

  for (var i = 120 - 1; i >= 0; i--) {
    clock[i] = brightGreen.getCSSHexadecimalRGB();
  };
  alert(brightRed.getHSL().h);


  // Make it visually fill the positioned parent
  canvas.style.width ='100%';
  canvas.style.height='100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.width/3;

  width = document.getElementById("canvas").width;
  height = (width/3)+10;
  needRedraw = true;



  /* setup */
  drawRadius = width / 6 * 0.95;
  innerRadius = drawRadius * 0.48;
  setInterval(tick, 100);
 }
})



