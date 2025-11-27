import Lenis from 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis/+esm';


const _ua = {};
_ua.Mobile = /iPhone|iPod|Android|Windows Phone|BlackBerry|iPad/i.test(navigator.userAgent);
_ua.Tablet = /iPad/i.test(navigator.userAgent) && !/iPhone|iPod/i.test(navigator.userAgent);




const lenis = new Lenis();
const raf = (time) => {
  lenis.raf(time);
  requestAnimationFrame(raf);
};
requestAnimationFrame(raf);

function setRootFontSize() {
  const html = document.documentElement;
  const vw = window.innerWidth;
  html.style.setProperty('--viewPortWidth', `${vw}px`);

  if (vw < 768) {
    html.style.removeProperty('font-size');
    return;
  }

  // 例: 1440pxを基準に100%（16px）としたい場合
  const base = 1440;
  html.style.fontSize = (vw / base * 100) + '%';
}

const updateSlideshowVars = () => {
  const html = document.documentElement;
  const slideshow = document.querySelector(".slideshow");
  const slideshowHeight = slideshow?.getBoundingClientRect().height ?? 0;
  const windowHeight = window.innerHeight;
  html.style.setProperty('--window-height', `${windowHeight}px`);
  html.style.setProperty('--slideshowheight', `${slideshowHeight}px`);
  const startOffset = windowHeight / 4;
  html.style.setProperty("--slideshow-start-offset", `${startOffset}px`);
};

const handleResizeVars = () => {
  setRootFontSize();
  updateSlideshowVars();
};

updateSlideshowVars();
window.addEventListener('resize', handleResizeVars);


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



document.addEventListener('DOMContentLoaded', () => {
  // GSAPと関連プラグインが読み込まれるのを待つ
  const checkGSAP = setInterval(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof SplitText !== 'undefined') {
      clearInterval(checkGSAP);
      initializeTopMessageAnimation();
      introAnimation();
    }
  }, 100);


});



function introAnimation() {
  let splits = new SplitText("p.encopy", { type: "lines" });


  const tl = gsap.timeline();

  tl.fromTo(".image-mask", {
    opacity: 0,
    scale: 0.8,
  }, {
    duration: 2, delay: 1, scale: 1, opacity: 1, ease: "expo.out", onComplete: function () {
      $(".image-mask").addClass("active")
    }
  });

  tl.from(splits.lines, {
    duration: 1.5,
    stagger: 0.25,
    x: -110,
    opacity: 0,
    ease: "power2.out"
  }, "-=1");

  tl.fromTo(".jpcopy p", {
    opacity: 0,
    y: -20,
  }, {
    duration: 2, y: 0, opacity: 1, stagger: {
      each: 0.2,
      from: "end"
    }, ease: "expo.out"
  }
    , "-=1"
  );

  tl.to(splits.lines, {
    duration: 2,
    stagger: 0.2,
    backgroundPositionX: 0,
    ease: "expo.out"
  }, "-=2"); // 前のアニメーションの直後
}

function initializeTopMessageAnimation() {
  if (!_ua.Mobile) { // PCの場合のみ実行
    gsap.registerPlugin(ScrollTrigger, SplitText);
    let split = new SplitText("#concept .in p", { type: "lines" });

    let conceptTrigger;
    let linesInitialized = false;

    const txtiliner = () => {
      split.lines.forEach((target) => {
        gsap.to(target, {
          backgroundPositionX: 0,
          ease: "none",
          scrollTrigger: {
            trigger: target,
            markers: false,
            pinSpacing: true,
            scrub: 1.5,
            start: "top center", // ウィンドウ高さを使って開始位置調整
            end: "bottom bottom"
          }
        });
      });
    };

    const createConceptTrigger = () => {
      if (conceptTrigger) {
        conceptTrigger.kill();
      }

      linesInitialized = false;
      conceptTrigger = ScrollTrigger.create({
        trigger: "#concept",
        start: "top bottom",
        once: true,
        onEnter: () => {
          if (!linesInitialized) {
            txtiliner();
            linesInitialized = true;
          }
        }
      });
    };

    // 初期化（#concept表示時にアニメーション開始）
    createConceptTrigger();

    // リサイズ時の再初期化
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        //ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        split.revert(); // SplitTextをいったん戻す
        split = new SplitText("#concept .in p", { type: "lines" }); // 再生成
        createConceptTrigger();
        ScrollTrigger.refresh(); // ScrollTriggerをリフレッシュ
      }, 250);
    });
  }
}


$(function () {

  $('#recruit_header').load('/header.html?v=2', function () {
    handleDrawer(".draw01", ".drawer01");
    handleDrawer(".draw02", ".drawer02");
    handleDrawer(".draw03", ".drawer03");
    handleDrawer(".draw04", ".drawer04");
    handleDrawer(".draw05", ".drawer05");
    const spMenuButton = document.getElementById("sp_menu");
    if (spMenuButton) {
      spMenuButton.addEventListener("click", () => {
        spMenuButton.classList.toggle("active");
      });
    }
  });
  $('#recruit_footer').load('/footer.html', function () {

    lenis.on('scroll', handleScrollState);
    $(window).on('scroll', handleScrollState);
    handleScrollState();
  });

  $(document).on('click', 'a[href^="#"]', function () {
    if ($(this).hasClass('no-scroll')) return;
    handleAnchorScroll($(this).attr("href"));
    return false;
  });

  let modesp = false;
  const handleModeSp = () => {
    if (modesp == true && $(window).width() > 768) {
      modesp = false;
      $('body').removeClass('type-sp');
      $('#slide-menu .slide-menu-nav-layout h3').removeClass('active');
      $('#slide-menu .slide-menu-nav-layout ul').removeAttr('style');
    } else if (modesp == false && $(window).width() <= 768) {
      modesp = true;
      $('body').addClass('type-sp');
    }
  };

  $(window).on('resize', handleModeSp);
  handleModeSp();

  if (location.hash) {
    var target = $(location.hash);
    if (target.length) {
      let offset = $('body').hasClass('type-sp') ? 100 : 140;
      var position = target.offset().top - offset;
      $("html, body").animate({
        scrollTop: position
      }, 0, "swing");
    }
  }

  $(document).on('click', '#sp-mm .sp-mm-btn', function () {
    $('#slide-menu').stop().slideDown(200);
  });
  $(document).on('click', '#sp-mm-close', function () {
    $('#slide-menu').stop().slideUp(0);
    $('#slide-menu .slide-menu-nav-layout h3').removeClass('active');
    $('#slide-menu .slide-menu-nav-layout ul').removeAttr('style');
  });
  $(document).on('click', '#slide-menu .tab-menu li div', function () {
    let tab = $(this).data('tab');
    $('#slide-menu .tab-menu li div').removeClass('active');
    $(this).addClass('active');
    $('#slide-menu .mark').removeClass('active');
    $('#slide-menu .mark.' + tab).addClass('active');
    $('#slide-menu .slide-menu-nav-layout li').removeClass('none');
    if (tab == 'new') {
      $('#slide-menu .slide-menu-nav-layout li.career').addClass('none');
    } else
      if (tab == 'career') {
        $('#slide-menu .slide-menu-nav-layout li.new').addClass('none');
      }
  });

  $(document).on('click', '#slide-menu .slide-menu-nav-layout h3', function () {
    if ($('body').hasClass('type-sp')) {
      $(this).toggleClass('active').next().stop().slideToggle(200);
    }
  });

  function checkInView() {
    var offset = 80;
    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();

    $('.inview').each(function () {
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

$(document).on("click", ".smenu .block .titles", function () {
  if ($(window).width() < 768) {
    $(this).next("ul").slideToggle();
    $(this).next(".submenus").slideToggle();
    $(this).toggleClass("active");
  };
});


function handleDrawer(drawClass, drawerClass) {
  const $drawer = $(drawerClass);
  const $draw = $(drawClass);

  $draw.on("mouseenter", function () {
    $("#pc_gnav ul li a").removeClass("active");
    $(this).find("a").addClass("active");
    $(".mainoverlay").addClass("is-open");
    $(".drawer_menu").removeClass("is-open");
    $drawer.addClass("is-open");
    $(".header-layout-main").addClass("active");

  });

  $drawer.on("mouseleave", function () {
    $("#pc_gnav ul li a").removeClass("active");
    $draw.find("a").removeClass("active");
    $(".mainoverlay").removeClass("is-open");
    $drawer.removeClass("is-open");
    $(".header-layout-main").removeClass("active");
  });
}
