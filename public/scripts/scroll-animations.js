$(function($) {
    var doAnimations = function() {
      
      var offset = $(window).scrollTop() + $(window).height(),
          $animatables = $('.animatable')
      if ($animatables.length == 0) {
        $(window).off('scroll', doAnimations)
      }
        $animatables.each(function(i) {
        var $animatable = $(this)
        const showingOffset = window.screen.height / 10 // increase to show sooner at scroll
        if (($animatable.offset().top + showingOffset) < offset) {
            $animatable.removeClass('animatable').addClass('animated')
        }
      })
      }
      $(window).on('scroll', doAnimations)
      $(window).trigger('scroll')
  });