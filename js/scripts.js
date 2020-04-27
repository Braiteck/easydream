$(function() {
	// Отзывы
	$('.reviews .wheelSlider-container').wheelSlider({
		controls: true
	})


	// Калькулятор
	$('body').on('change', '#product_modal .calc select', function() {
		let totalOldPrice = $productOldPrice
		let totalPrice    = $productPrice

		if($(this).attr('id') === 'material'){
			updateOptions()
		}

		$('#product_modal .calc select').each(function() {
			totalOldPrice = totalOldPrice + $(this).find('option:selected').data('price')
			totalPrice    = totalPrice + $(this).find('option:selected').data('price')

			$totalOldPriceEl.text(totalOldPrice.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + '.'))
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


	// Параллакс эффект
	parallax()
})


$(window).scroll(function() {
	// Шапка
	if ($(window).scrollTop() > 0) {
		$('header').addClass('fixed')
	} else {
		$('header').removeClass('fixed')
	}


	// Параллакс эффект
	parallax()
})


// Калькулятор
function initCalc() {
	$totalOldPriceEl   = $('.product_info .price .old span')
	$totalPriceEl      = $('.product_info .price .new span').add('#product_modal .bottom .total_price span')
	$totalPriceElInput = $('#product_modal .calc input[name="total_price"]')
	$productOldPrice   = parseInt($('.product_info .price .old span').text().replace('.', ''))
	$productPrice      = parseInt($('.product_info .price .new span').text().replace('.', ''))

	updateOptions()
}

function updateOptions(){
	let currentMaterial = $('#material option:selected').data('material')

	$('#product_modal .calc form select:not(#material)').each(function(){
		$(this).find('option').prop('selected', false).prop('disabled', true)
		$(this).find('option[data-material="'+ currentMaterial +'"]').prop('disabled', false)
		$(this).find('option[data-material="any"]').prop('disabled', false)

		$('select').niceSelect('update')
	})
}



// Параллакс эффект
function parallax(){
	$('.parallax.speed1').each(function(){
		let parent = $(this).closest('section')
		let parentOffset = parent.offset()

		$(this).css('transform', 'translate3d(0px, '+ ($(window).scrollTop() - parentOffset.top)/-2 +'px, 0px)')
	})

	$('.parallax.speed2').each(function(){
		let parent = $(this).closest('section')
		let parentOffset = parent.offset()

		$(this).css('transform', 'translate3d(0px, '+ ($(window).scrollTop() - parentOffset.top)/-3 +'px, 0px)')
	})

	$('.parallax.speed3').each(function(){
		let parent = $(this).closest('section')
		let parentOffset = parent.offset()

		$(this).css('transform', 'translate3d(0px, '+ ($(window).scrollTop() - parentOffset.top)/-6 +'px, 0px)')
	})
}