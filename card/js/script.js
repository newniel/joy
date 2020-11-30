$(document).ready(function() {

  var $clickMe = $('.click-icon'),
      $card = $('.card'),
      $audioFile = new Audio('./mp3/christmas.mp3');

      
  $card.on('click', function() {
		$(this).toggleClass('is-opened');
    $clickMe.toggleClass('is-hidden');
    var played = $(this).hasClass('is-opened');
    if(played){
      $audioFile.play();
    }else{
      $audioFile.pause();
      $audioFile.currentTime = 0;
    }
	});

});