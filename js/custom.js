var shuffleme = (function( $ ) {
  'use strict';
  var $grid = $('#grid'), //locate what we want to sort 
      $filterOptions = $('.portfolio-sorting li'),  //locate the filter categories
      $sizer = $grid.find('.shuffle_sizer'),    //sizer stores the size of the items

  init = function() {

    // None of these need to be executed synchronously
    setTimeout(function() {
      listen();
      setupFilters();
    }, 100);

    // instantiate the plugin
    $grid.shuffle({
      itemSelector: '[class*="col-"]',
      sizer: $sizer    
    });
  },

      

  // Set up button clicks
  setupFilters = function() {
    var $btns = $filterOptions.children();
    $btns.on('click', function(e) {
      e.preventDefault();
      var $this = $(this),
          isActive = $this.hasClass( 'active' ),
          group = isActive ? 'all' : $this.data('group');

      // Hide current label, show current label in title
      if ( !isActive ) {
        $('.portfolio-sorting li a').removeClass('active');
      }

      $this.toggleClass('active');

      // Filter elements
      $grid.shuffle( 'shuffle', group );
    });

    $btns = null;
  },

  // Re layout shuffle when images load. This is only needed
  // below 768 pixels because the .picture-item height is auto and therefore
  // the height of the picture-item is dependent on the image
  // I recommend using imagesloaded to determine when an image is loaded
  // but that doesn't support IE7
  listen = function() {
    var debouncedLayout = $.throttle( 300, function() {
      $grid.shuffle('update');
    });

    // Get all images inside shuffle
    $grid.find('img').each(function() {
      var proxyImage;

      // Image already loaded
      if ( this.complete && this.naturalWidth !== undefined ) {
        return;
      }

      // If none of the checks above matched, simulate loading on detached element.
      proxyImage = new Image();
      $( proxyImage ).on('load', function() {
        $(this).off('load');
        debouncedLayout();
      });

      proxyImage.src = this.src;
    });

    // Because this method doesn't seem to be perfect.
    setTimeout(function() {
      debouncedLayout();
    }, 500);
  };      

  return {
    init: init
  };
}( jQuery ));

$(document).ready(function()
{
  shuffleme.init(); //filter portfolio
});

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// SLOW SCROLL
/////////////////////////////////////////////////////////////////////////////


$(document).ready(function() {

  $('header a[href^="#"]').click(function(){
    var el = $(this).attr('href');
    $('body').animate({
      scrollTop: $(el).offset().top}, 2000);
    return false;
  });
});

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// SELECT element
/////////////////////////////////////////////////////////////////////////////

$(".hover-img").click(function(){

  if ( $(this).hasClass("show-img") ) {
    $(this).removeClass( "show-img" );
    removeFromCart($(this).data("title"));
  }
  else {
    $(this).addClass( "show-img" );
    addToCart($(this).data("title"), $(this).data("full-title"), $(this).data("price"), $(this).data("img"));
  }

  showORhideInfo();

});

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// ADD to cart
/////////////////////////////////////////////////////////////////////////////

function addToCart(title, fullTitle, price, img){

  var li = "<li data-title='" + title + "' data-full-title='" + fullTitle + "' data-price='" + price + "'>";
    var img = "<img src='" + img + "' class='img-in-cart'>";
    var name = "<h2 class='title-in-cart'>" + fullTitle + "</h2>";
    var quantity = "<h2 class='quantity-in-cart'><button class='plus' onclick='plusItem(\"" + title + "\")'>+</button><div class='quantity'> 1 </div><button class='minus' onclick='minusItem(\"" + title + "\")'>-</button></h2>";
    var price = "<h2 class='price-in-cart'>" + price + " USD</h2>";
    var button = "<button onclick='removeFromCart(\"" + title + "\")' class='remove'>x</button></li>";
  var liEnd = "<li>";

  showORhideInfo();

  $( li + img + name + quantity + price + button + liEnd ).appendTo($(".list-cart")).hide().fadeIn(3000);

}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// SHOW or HIDE info block
/////////////////////////////////////////////////////////////////////////////

function showORhideInfo(){

  if ( $("*").hasClass("img-in-cart") ) {
    $('.cart .info').fadeOut();
    $('.cart .text-right').fadeIn();
  }
  else {
    $('.cart .info').fadeIn();
    $('.cart .text-right').fadeOut();
  }

}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// REMOVE from cart
/////////////////////////////////////////////////////////////////////////////

function removeFromCart(title){

  $('.cart [data-title=' + title + ']').fadeOut('slow', function(){ $('.cart [data-title=' + title + ']').remove(); });
  $('[data-title=' + title + ']').removeClass( "show-img" );

  setTimeout('showORhideInfo()', 1000);

}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// PLUS item
/////////////////////////////////////////////////////////////////////////////



function plusItem(title){
  var item =  $('[data-title=' + title + ']').find('.quantity').text();
  item++;
  $('[data-title=' + title + ']').find('.quantity').text(item);
}

function minusItem(title){
  var item =  $('[data-title=' + title + ']').find('.quantity').text();
  item--;
  if(item > 0){
    $('[data-title=' + title + ']').find('.quantity').text(item);
  }

}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// SEND order
/////////////////////////////////////////////////////////////////////////////


function sendOrder(){
  if($(".cart li").length > 1)
    $('.cart li').each(function(i,elem) {
      if ( $(this).data("title") ) {
        console.log(
            "data " + $(this).data("title") +
            " fullTitle " + $(this).data("full-title") +
            " price " + $(this).data("price") +
            " phone " + $('.phone').val()
        );
        if($('.phone').val().length > 9){
          console.log("OK");
          $('.popup-box-cart').fadeIn(2000).fadeOut(2000);
        }
        else {
          $('.phone').addClass("error");

          // первый аргумент - функция
          function second_passed() {
            $('*').removeClass("error");
          }
          setTimeout(second_passed, 3000)
        }
      }
    });
}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// CollBack
/////////////////////////////////////////////////////////////////////////////

function collBackIn(){
  $('.modal-bg,.modal-mes-box').fadeIn();
}
function collBackOut(popup){
  $('.modal-bg,.modal-mes-box').fadeOut();
  if (popup == true){
    $('.popup-box').fadeIn(2000).fadeOut(2000);
  }
}