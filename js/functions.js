$(function() {
	// Проверка браузера
	if (!supportsCssVars()) {
		$('body').addClass('lock')
		$('.supports_error').addClass('show')
	}


	// Ленивая загрузка
	setTimeout(function() {
		observer = lozad('.lozad', {
			rootMargin: '200px 0px',
			threshold: 0,
			loaded: function(el) {
				el.classList.add('loaded')
			}
		})

		observer.observe()
	}, 200)


	// Установка ширины стандартного скроллбара
	$(':root').css('--scroll_width', widthScroll() + 'px')


	// Маска ввода
	$('input[type=tel]').inputmask('+7 (999) 999-99-99')


	// Плавная прокрутка к якорю
	$('body').on('click', '.scroll_link', function(e) {
		e.preventDefault()

		let href      = $(this).data('anchor')
		let addOffset = 150

		if ($(this).data('offset')) {
			addOffset = $(this).data('offset')
		}

		$('html, body').stop().animate({
			scrollTop: $(href).offset().top - addOffset
		}, 1000)
	})


	// Аккордион
	$('body').on('click', '.accordion .item .title', function(e) {
		e.preventDefault()

		let parent = $(this).closest('.item')
		let accordion = $(this).closest('.accordion')

		if (parent.hasClass('active')) {
			parent.removeClass('active')
			parent.find('.data').slideUp(300)
		} else {
			accordion.find('.item').removeClass('active')
			accordion.find('.data').slideUp(300)

			parent.addClass('active')
			parent.find('.data').slideDown(300)
		}
	})


	// Fancybox
	$.fancybox.defaults.hash             = false
	$.fancybox.defaults.backFocus        = false
	$.fancybox.defaults.autoFocus        = false
	$.fancybox.defaults.animationEffect  = 'zoom'
	$.fancybox.defaults.transitionEffect = 'slide'
	$.fancybox.defaults.speed            = 500
	$.fancybox.defaults.gutter           = 40
	$.fancybox.defaults.i18n             = {
		'en': {
			CLOSE       : "Закрыть",
			NEXT        : "Следующий",
			PREV        : "Предыдущий",
			ERROR       : "Запрошенный контент не может быть загружен.<br /> Пожалуйста, повторите попытку позже.",
			PLAY_START  : "Запустить слайдшоу",
			PLAY_STOP   : "Остановить слайдшоу",
			FULL_SCREEN : "На весь экран",
			THUMBS      : "Миниатюры",
			DOWNLOAD    : "Скачать",
			SHARE       : "Поделиться",
			ZOOM        : "Увеличить"
		}
	}

	// Всплывающие окна
	$('body').on('click', '.modal_link', function(e) {
		e.preventDefault()

		$.fancybox.open({
			src   : $(this).data('content'),
			type  : 'inline',
			touch : false
		})
	})

	// Увеличение картинки
	$('.fancy_img').fancybox({
		mobile : {
			clickSlide : "close"
		}
	})

	$().fancybox({
		keyboard: false,
		infobar: false,
		arrows : false,
      	touch : false,
		selector : '[data-type="ajax"]',
		afterLoad : function( instance, current ) {
			$('.fancybox-container:not(#fancybox-container-'+ instance.id +')').remove()

			observer.observe()

			// Кастомный скролл
			if ($(window).width() > 1250) {
				$('.fancybox-content .custom_scroll_wrap').each(function() {
					$(this).mCustomScrollbar({
						setHeight: $(this).innerHeight(),
						axis: 'y',
						scrollInertia: 200
					})
				})
			}
		}
	})


	// Моб. версия
	if ($(window).width() < 360) {
		$('meta[name=viewport]').attr('content', 'width=360px, user-scalable=no')
	} else {
		$('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1')
	}


	// Моб. меню
	$('.mob_header .mob_menu_link').click(function(e) {
		e.preventDefault()

		$(this).addClass('active')
		//$('body').addClass('lock')
		$('header').addClass('show')
		$('.overlay').fadeIn(300)
	})

	$('header .close, .overlay').click(function(e) {
		e.preventDefault()

		$('.mob_header .mob_menu_link').removeClass('active')
		//$('body').removeClass('lock')
		$('header').removeClass('show')
		$('.overlay').fadeOut(300)
	})
})



// Вспомогательные функции
function setHeight(className) {
	let maxheight = 0

	className.each(function() {
		let elHeight = $(this).outerHeight()

		if (elHeight > maxheight) {
			maxheight = elHeight
		}
	})

	className.outerHeight(maxheight)
}


function is_touch_device() {
	return !!('ontouchstart' in window)
}


function widthScroll() {
	let div = document.createElement('div')
	div.style.overflowY = 'scroll'
	div.style.width = '50px'
	div.style.height = '50px'
	div.style.visibility = 'hidden'
	document.body.appendChild(div)

	let scrollWidth = div.offsetWidth - div.clientWidth
	document.body.removeChild(div)

	return scrollWidth
}


var supportsCssVars = function() {
	var s = document.createElement('style'),
		support

	s.innerHTML = ":root { --tmp-var: bold; }"
	document.head.appendChild(s)
	support = !!(window.CSS && window.CSS.supports && window.CSS.supports('font-weight', 'var(--tmp-var)'))
	s.parentNode.removeChild(s)

	return support
}