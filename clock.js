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

function toRGB (comps)
{
  return "rgb(" + comps[0].toString() + "," + comps[1].toString() +
         "," + comps[2].toString() + ")";
}

function mixRGB (col1, col2, alpha)
{
  if (alpha == undefined)
    alpha = 0.5;

  var inv_alpha = 1.0 - alpha;
  return [ Math.min (255, parseInt(col1[0] * alpha + col2[0] * inv_alpha)),
           Math.min (255, parseInt(col1[1] * alpha + col2[1] * inv_alpha)),
           Math.min (255, parseInt(col1[2] * alpha + col2[2] * inv_alpha)) ];
}

// hours, minutes, seconds
var hoursColour = [ 255, 255, 0 ]; /* yellow */
//var minsColour =  [ 255, 240, 0 ];
var minsColour =  [ 0, 240, 255 ];
var secsColour =  [ 255, 255, 255 ];

var white = [ 255, 255, 255 ];

function drawArc (ctx, startCol, endCol, startAngle, endAngle)
{
  //debug ("<p>Arc " + startAngle + " to " + endAngle + " col " + startCol + " to " + endCol);

  for (a = startAngle; a < endAngle; a += INTERVAL) {
     var mix = 1.0 - (a - startAngle) / (endAngle - startAngle);
     var col = toRGB (mixRGB (startCol, endCol, mix));
     var end = Math.min (a + INTERVAL + (Math.PI / 100), endAngle);

     ctx.beginPath ();
     ctx.fillStyle = col;
     ctx.arc (0, 0, drawRadius, a, end);
     ctx.arc (0, 0, innerRadius, end, a, true);
     ctx.fill();
  }
}

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

function handleKeyPress(event)
{
  if (event.keyCode in { 37:'', 39:'' }) {
      return stopEvent(event);
  }
  return true;
}

function handleKey(event,dir)
{
  switch (event.keyCode) {
    case 37: key_left = dir;
      return stopEvent(event);
    case 38: key_up = dir;
      return stopEvent(event);
    case 39: key_right = dir;
      return stopEvent(event);
  }
  return true;
}

function handleKeyDown(event)
{
  return handleKey(event,true);
}

function handleKeyUp(event)
{
  return handleKey(event,false);
}

function stopEvent(event) {
  if (event.preventDefault) event.preventDefault();
  if (event.stopPropagation) event.stopPropagation();
  return false;
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

function debug(text)
{
  var c = document.getElementById('console');
  c.innerHTML += text;
}


function rgbToCMYK(rgb)
{
  /* Special case all black */
  if (rgb[0] == 0 && rgb[1] == 0 &&
      rgb[2] == 0) {
    return [0, 0, 0, 255];
  }
  var c; var m;
  var y; var k;

  /* Track K as the min of CMY as we go */
  k = c = 255 - rgb[0];
  m = 255 - rgb[1];
  if (m < k)
    k = m;
  y = 255 - rgb[2];
  if (y < k)
    k = y;

  /* Scale CMY to fill the full 0..255 range */
  c = (c - k) * 255 / (255 - k);
  m = (m - k) * 255 / (255 - k);
  y = (y - k) * 255 / (255 - k);

  return [ c, m, y, k ];
}

function cmykToRGB(cmyk)
{
  var c; var m;
  var y; var k;

  /* Special case grey shades with pure K */
  if (cmyk[0] == 0 && cmyk[1] == 0 &&
      cmyk[2] == 0) {
    var rgb = [];
    rgb[0] = 255 - cmyk[3];
    rgb[1] = rgb[0];
    rgb[2] = rgb[0];
    return rgb;
  }

  k = 255 - cmyk[3];
  c = cmyk[0] * k / 255;
  m = cmyk[1] * k / 255;
  y = cmyk[2] * k / 255;
  k = cmyk[3];

  c = (c+k > 255) ? 255 : (c+k);
  m = (m+k > 255) ? 255 : (m+k);
  y = (y+k > 255) ? 255 : (y+k);

  return [ parseInt (255 - c), parseInt (255 - m), parseInt (255 - y) ];
}

function mixCMYK (col1, col2)
{
  var cmyk1 = rgbToCMYK (col1);
  var cmyk2 = rgbToCMYK (col2);
  var i;
  var tmp = [];
  var min_cmy = 65535;
  var out = [];

  /* Blend CMYK by addition, then
   * normalise CMY into K */
  for (i = 0; i < 3; i++) {
    tmp[i]  = (cmyk1[i] + cmyk2[i]);// / 2;
    if (tmp[i] < min_cmy)
      min_cmy = tmp[i];
  }

  for (i = 0; i < 3; i++) {
    if (tmp[i] - min_cmy > 255)
      out[i] = 255;
    else
      out[i] = tmp[i] - min_cmy;
  }

  tmp[3]  = (cmyk1[3] + cmyk2[3]);// / 2;
  if (tmp[3] + min_cmy > 255)
    out[3] = 255;
  else
    out[3] = tmp[3] + min_cmy;

  return cmykToRGB (out);
}