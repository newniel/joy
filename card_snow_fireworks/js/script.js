$(document).ready(function() {

  var $clickMe = $('.click-icon'),
	  $card = $('.card'),
	  $tennis = $('.tennis-ball'),
	  $new = $('.new'),
	  $audioFile = new Audio('./mp3/christmas.mp3');
	  $audioFile2 = new Audio('./mp3/a.mp3');

  var lightswitch = document.getElementById("switch"), on = false;
  lightswitch.addEventListener('click', toggleLights, false);

TweenMax.set('.switchnob', {y: '+=90'})

   $tennis.on('click', function() {
		$('.new').addClass('on');
		$audioFile2.play();
		$audioFile2.loop();
	 });
	$new.on('click', function() {
		$(this).removeClass('on');
		$audioFile2.pause();
        $audioFile2.currentTime = 0;
	 });
	 
  $card.on('click', function() {
		$(this).toggleClass('is-opened');
    $clickMe.toggleClass('is-hidden');
    var played = $(this).hasClass('is-opened');
    if(played){
      $audioFile.play();
      initLetItSnow();
	  $('.xmas').addClass('view');
	  $('.switch').addClass('on');
	  
    }else{
      $audioFile.pause();
      $audioFile.currentTime = 0;
	  $('.xmas.view').removeClass('view');
	  $('.switch.on').removeClass('on');
	  $('.run.on').removeClass('on');
	  if(on){
	    on = false;
		TweenMax.to('.light',.2, {filter:'', opacity: 0.55})
		TweenMax.to('.switchnob',.2, {y: '+=90'})
		$('.cart-page-bottom, .cart-page-inside').removeClass('on');
	  }

	  }
	});


	//lights
	


var tl = new TimelineMax({delay: .5});  

function toggleLights(){
  if(on){
    on = false;
    TweenMax.to('.light',.2, {filter:'', opacity: 0.55})
	TweenMax.to('.switchnob',.2, {y: '+=90'})
	$('.cart-page-bottom, .cart-page-inside').removeClass('on');
	$('.run.on').removeClass('on');
  }else{
    TweenMax.to('.switchnob',.2, {y: '-=90'})
    TweenMax.staggerTo('.light', .5, {filter:'url(\'#glow\')', opacity: 1}, .08)
	on = true;
	$('.cart-page-bottom, .cart-page-inside').addClass('on');
	$('.run').addClass('on');
  }
}

TweenLite.set(".anim-container",{perspective:600})

var total = 30;
var warp = document.getElementById("container"),  w = window.innerWidth , h = window.innerHeight;
 
 for (i=0; i<total; i++){ 
   var Div = document.createElement('div');
   TweenLite.set(Div,{attr:{class:'dot'},x:R(0,w),y:R(-200,-150),z:R(-200,200)});
   warp.appendChild(Div);
   animm(Div);
 }
 
 function animm(elm){   
   TweenMax.to(elm,R(6,15),{y:h+100,ease:Linear.easeNone,repeat:-1,delay:-15});
   TweenMax.to(elm,R(4,8),{x:'+=100',rotationZ:R(0,180),repeat:-1,yoyo:true,ease:Sine.easeInOut});
   TweenMax.to(elm,R(2,8),{rotationX:R(0,360),rotationY:R(0,360),repeat:-1,yoyo:true,ease:Sine.easeInOut,delay:-5});
 };

function R(min,max) {return min+Math.random()*(max-min)};

});



// Init Christmas! \o/
var initLetItSnow = function(){

	(function() {
	    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
	    function(callback) {
	        window.setTimeout(callback, 1000 / 60);
	    };
	    window.requestAnimationFrame = requestAnimationFrame;
	})();

	var flakes = [],
	    canvas = document.getElementById("xmas"),
	    ctx = canvas.getContext("2d"),
	    mX = -100,
	    mY = -100;

	    if( $(window).width() < 999 ){
	    	var flakeCount = 125;
	    } else {
	    	var flakeCount = 450;
	    }

	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;

	function snow() {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);

	    for (var i = 0; i < flakeCount; i++) {
	        var flake = flakes[i],
	            x = mX,
	            y = mY,
	            minDist = 250,
	            x2 = flake.x,
	            y2 = flake.y;

	        var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
	            dx = x2 - x,
	            dy = y2 - y;

	        if (dist < minDist) {
	            var force = minDist / (dist * dist),
	                xcomp = (x - x2) / dist,
	                ycomp = (y - y2) / dist,
	                // deltaV = force / 2;
	                deltaV = force;

	            flake.velX -= deltaV * xcomp;
	            flake.velY -= deltaV * ycomp;

	        } else {
	            flake.velX *= .98;
	            if (flake.velY <= flake.speed) {
	                flake.velY = flake.speed
	            }
	            flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
	        }

	        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
	        flake.y += flake.velY;
	        flake.x += flake.velX;
	            
	        if (flake.y >= canvas.height || flake.y <= 0) {
	            reset(flake);
	        }

	        if (flake.x >= canvas.width || flake.x <= 0) {
	            reset(flake);
	        }

	        ctx.beginPath();
	        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
	        ctx.fill();
	    }
	    requestAnimationFrame(snow);
	};

	function reset(flake) {
	    flake.x = Math.floor(Math.random() * canvas.width);
	    flake.y = 0;
	    flake.size = (Math.random() * 3) + 2;
	    flake.speed = (Math.random() * 1) + 0.5;
	    flake.velY = flake.speed;
	    flake.velX = 0;
	    flake.opacity = (Math.random() * 0.5) + 0.3;
	}

	function init() {
	    for (var i = 0; i < flakeCount; i++) {
	        var x = Math.floor(Math.random() * canvas.width),
	            y = Math.floor(Math.random() * canvas.height),
	            size = (Math.random() * 3) + 4,
	            speed = (Math.random() * 1) + 0.5,
	            opacity = (Math.random() * 0.5) + 0.3;

	        flakes.push({
	            speed: speed,
	            velY: speed,
	            velX: 0,
	            x: x,
	            y: y,
	            size: size,
	            stepSize: (Math.random()) / 160,
	            step: 0,
	            opacity: opacity
	        });
	    }

	    snow();
	};

	canvas.addEventListener("mousemove", function(e) {
	    mX = e.clientX,
	    mY = e.clientY
	});

	window.addEventListener("resize",function(){
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	})

	init();
};

