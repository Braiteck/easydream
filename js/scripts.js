$(function() {
	// Отзывы
	$('.reviews .wheelSlider-container').wheelSlider({
		controls: true
	})


	// Калькулятор
	$('body').on('change', '#product_modal .calc select', function(e) {
		let totalPrice = $productPrice

		$('#product_modal .calc select').each(function() {
			totalPrice = totalPrice + $(this).find('option:selected').data('price')

			$totalPriceEl.text(totalPrice.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + '.'))
			$totalPriceElInput.val(totalPrice.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + '.'))
		})
	})


	// Валидация
	$questionForm = $('.has_question .form').parsley({
		errorClass      : 'error',
		successClass    : 'success',
		inputs          : 'input, textarea, select, select:hidden, input[type=radio]:hidden, input[type=checkbox]:hidden',
		errorsWrapper   : '<div class="error_text"></div>',
		errorTemplate   : '<div></div>',
		errorsContainer : function(field) {
			return field.$element.closest('.field')
		}
	})

	$callbackForm = $('#callback_modal .form').parsley({
		errorClass      : 'error',
		successClass    : 'success',
		inputs          : 'input, textarea, select, select:hidden, input[type=radio]:hidden, input[type=checkbox]:hidden',
		errorsWrapper   : '<div class="error_text"></div>',
		errorTemplate   : '<div></div>',
		errorsContainer : function(field) {
			return field.$element.closest('.field')
		}
	})

	$orderForm = $('#order_modal .form').parsley({
		errorClass      : 'error',
		successClass    : 'success',
		inputs          : 'input, textarea, select, select:hidden, input[type=radio]:hidden, input[type=checkbox]:hidden',
		errorsWrapper   : '<div class="error_text"></div>',
		errorTemplate   : '<div></div>',
		errorsContainer : function(field) {
			return field.$element.closest('.field')
		}
	})


	$('.has_question .form').submit(function(e) {
		e.preventDefault()

		if ($questionForm.isValid()) {
			// Здесь запрос на сервер
			// Если отправка успешна то выполнить этот код.
			$(this).find('.input').val('')

			$.fancybox.close(true)

			$.fancybox.open({
				src   : '#success_modal',
				type  : 'inline',
				touch : false
			})
		}
	})


	$('#callback_modal .form').submit(function(e) {
		e.preventDefault()

		if ($callbackForm.isValid()) {
			// Здесь запрос на сервер
			// Если отправка успешна то выполнить этот код.
			$(this).find('.input').val('')

			$.fancybox.close(true)

			$.fancybox.open({
				src   : '#success_modal',
				type  : 'inline',
				touch : false
			})
		}
	})


	$('#order_modal .form').submit(function(e) {
		e.preventDefault()

		if ($orderForm.isValid()) {
			// Данные о товаре
			let productData = $('#product_modal .calc form').serialize()

			// Здесь запрос на сервер

			// Если отправка успешна то выполнить этот код.
			$(this).find('.input').val('')

			$.fancybox.close(true)

			$.fancybox.open({
				src   : '#success_modal',
				type  : 'inline',
				touch : false
			})
		}
	})
})


$(window).scroll(function() {
	// Шапка
	if ($(window).scrollTop() > 0) {
		$('header').addClass('fixed')
	} else {
		$('header').removeClass('fixed')
	}
})


function initCalc() {
	// Калькулятор
	$totalPriceEl = $('.product_info .price .new span').add('#product_modal .bottom .total_price span')
	$totalPriceElInput = $('#product_modal .calc input[name="total_price"]')
	$productPrice = parseInt($('.product_info .price .new span').text().replace('.', ''))
}