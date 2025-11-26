import Lenis from 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis/+esm';

const lenis = new Lenis();
const raf = (time) => {
  lenis.raf(time);
  requestAnimationFrame(raf);
};
requestAnimationFrame(raf);

const setRootFontSize = () => {
  const MIN_WIDTH = 320;
  const MAX_WIDTH = 1600;
  const MIN_FONT_SIZE = 14;
  const MAX_FONT_SIZE = 18;

  const width = Math.min(Math.max(window.innerWidth, MIN_WIDTH), MAX_WIDTH);
  const ratio = (width - MIN_WIDTH) / (MAX_WIDTH - MIN_WIDTH);
  const fontSize = MIN_FONT_SIZE + (MAX_FONT_SIZE - MIN_FONT_SIZE) * ratio;

  document.documentElement.style.fontSize = `${fontSize}px`;
};

let rootFontResizeTimer;
const handleRootFontResize = () => {
  clearTimeout(rootFontResizeTimer);
  rootFontResizeTimer = setTimeout(setRootFontSize, 80);
};

setRootFontSize();
window.addEventListener('resize', handleRootFontResize);
window.addEventListener('orientationchange', setRootFontSize);

const handleScrollState = () => {
  if ($(window).scrollTop() > 300) {
    $('#pagetop').fadeIn();
    $('body').addClass('scroll-in');
  } else {
    $('#pagetop').fadeOut();
    $('body').removeClass('scroll-in');
  }
};

const handleAnchorScroll = (href) => {
  var target = $(href == '#' || href == '' ? 'html' : href);
  var position = target.offset().top - $('#recruit_header').outerHeight();
  var speed = 300;
  $("html, body").animate({
    scrollTop: position
  }, speed, "swing");
};

const syncScrollEvents = () => {
  handleScrollState();
};

$(function(){

  $('#recruit_header').load('/header.html?v=2', function(){
    handleDrawer(".draw01", ".drawer01");
    handleDrawer(".draw02", ".drawer02");
    handleDrawer(".draw03", ".drawer03");
    handleDrawer(".draw04", ".drawer04");
    handleDrawer(".draw05", ".drawer05");
  });
  $('#recruit_footer').load('/footer.html', function(){

    lenis.on('scroll', handleScrollState);
    $(window).on('scroll', handleScrollState);
    handleScrollState();

  });
  
  $(document).on('click', 'a[href^="#"]', function () {
    if($(this).hasClass('no-scroll')) return;
    handleAnchorScroll($(this).attr("href"));
    return false;
  });    

  let modesp = false;
  $(window).on('resize', function(){
    if(modesp == true && $(window).width() > 768){
      modesp = false;
      $('body').removeClass('type-sp');
      $('#slide-menu .slide-menu-nav-layout h3').removeClass('active');
      $('#slide-menu .slide-menu-nav-layout ul').removeAttr('style');
    }else if(modesp == false && $(window).width() <= 768){
      modesp = true;
      $('body').addClass('type-sp');
    }
  });

  if(modesp == true && $(window).width() > 768){
    modesp = false;
    $('body').removeClass('type-sp');
  }else if(modesp == false && $(window).width() <= 768){
    modesp = true;
    $('body').addClass('type-sp');
  }

  if(location.hash){
    var target = $(location.hash);
    if(target.length){
      let offset = $('body').hasClass('type-sp') ? 100 : 140;
      var position = target.offset().top - offset;
      $("html, body").animate({
        scrollTop: position
      }, 0, "swing");
    }
  }

  $(document).on('click', '#sp-mm .sp-mm-btn', function(){
    $('#slide-menu').stop().slideDown(200);
  });
  $(document).on('click', '#sp-mm-close', function(){
    $('#slide-menu').stop().slideUp(0);
    $('#slide-menu .slide-menu-nav-layout h3').removeClass('active');
    $('#slide-menu .slide-menu-nav-layout ul').removeAttr('style');
  });
  $(document).on('click', '#slide-menu .tab-menu li div', function(){
    let tab = $(this).data('tab');
    $('#slide-menu .tab-menu li div').removeClass('active');
    $(this).addClass('active');
    $('#slide-menu .mark').removeClass('active');
    $('#slide-menu .mark.'+tab).addClass('active');
    $('#slide-menu .slide-menu-nav-layout li').removeClass('none');
    if(tab == 'new'){
      $('#slide-menu .slide-menu-nav-layout li.career').addClass('none');
    }else
    if(tab == 'career'){
      $('#slide-menu .slide-menu-nav-layout li.new').addClass('none');
    }
  });

  $(document).on('click', '#slide-menu .slide-menu-nav-layout h3', function(){
    if($('body').hasClass('type-sp')){
      $(this).toggleClass('active').next().stop().slideToggle(200);
    }
  });

  $(document).ready(function() {
    function checkInView() {
        var offset = 80;
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
  
        $('.inview').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
  
            if ((elementBottom >= scrollTop + offset) && (elementTop <= scrollTop + windowHeight - offset)) {
                $(this).addClass('active');
            }
        });
    }
  
    lenis.on('scroll', checkInView);
    $(window).on('scroll', checkInView);
  
    checkInView();
  });

});

$(document).on("click", ".smenu .block .titles", function(){
  if($(window).width() < 768){
   $(this).next("ul").slideToggle();
   $(this).next(".submenus").slideToggle();
   $(this).toggleClass("active");
 };
});


function handleDrawer(drawClass, drawerClass) {
  const $drawer = $(drawerClass);
  const $draw = $(drawClass);
  
  $draw.on("mouseenter", function() {
    $("#pc_gnav ul li a").removeClass("active");
    $(this).find("a").addClass("active");
    $(".mainoverlay").addClass("is-open");
    $(".drawer_menu").removeClass("is-open");
    $drawer.addClass("is-open");
    $(".header-layout-main").addClass("active");
    
  });

  $drawer.on("mouseleave", function() {
    $("#pc_gnav ul li a").removeClass("active");
    $draw.find("a").removeClass("active");
    $(".mainoverlay").removeClass("is-open");
    $drawer.removeClass("is-open");
    $(".header-layout-main").removeClass("active");
  });
}
