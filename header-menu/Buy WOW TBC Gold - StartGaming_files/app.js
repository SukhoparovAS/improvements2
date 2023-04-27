function time_zone_fn(){
	var d = new Date();
	var loc = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
	var time_zone = ((template.server_time - loc/1000)/60).toFixed(0);
	return time_zone * 60 * 1000;
}
function getTimeStr($time){
	var reply = '';
	if($time <= 60){
		reply = 'hace ' + $time + ' segundos';
	}
	else if($time/60 <= 60){
		reply = 'hace ' + Math.round($time/60) + ' minutos';
	}
	else if($time/(60 * 60) <= 24){
		reply = 'hace ' + Math.round($time/(60 * 60)) + ' horas';
	}
	else{
		reply = 'hace ' + Math.round($time/(60 * 60 * 24)) + ' días';
	}
	return reply;
}
function number_format( number, decimals, dec_point, thousands_sep ) {
	var i, j, kw, kd, km;
	if( isNaN(decimals = Math.abs(decimals)) ){
		decimals = 2;
	}
	if( dec_point == undefined ){
		dec_point = ",";
	}
	if( thousands_sep == undefined ){
		thousands_sep = ".";
	}
	i = parseInt(number = (+number || 0).toFixed(decimals)) + "";
	if( (j = i.length) > 3 ){
		j = j % 3;
	} else{
		j = 0;
	}
	km = (j ? i.substr(0, j) + thousands_sep : "");
	kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
	//kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
	kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
	return km + kw + kd;
}
function in_array(needle, haystack){
    var found = 0;
    for (var i=0, len=haystack.length;i<len;i++) {
        if (haystack[i] == needle) return i;
            found++;
    }
    return -1;
}

var offers_filters = {
	regions: [],
	servers: [],
	service_type: [],
	price: [],
	orderby: '',
	search: [],
	page: 1,
};

if(!$.cookie('alertOfferTime'))
{
	$.removeCookie('alertOffer');
}

setInterval(()=>{
		var date = new Date();
		date.setTime(date.getTime() + 3000);
		$.cookie('alertOfferTime', 1, { expires: date });

	}, 1000
)

CheckOffers();
function CheckOffers()
{
	if(!$.cookie('alertOffer'))
	{
		let purchaseAlert = $('.purchase-alert');
		if(purchaseAlert != undefined)
		{
			jQuery.ajax({
			  url: "/_fast_ajax.php",
			  type: 'POST',
			  dataType: 'json',
			  data: {
				load: 'getLastOffer',
				ajmod: 1,
			  },
			  success: function(data)
			  {
				var img = data['img'];
				var title = data['title'];
				var date = data['date']
				var country = data['country'];
				var url = data['url'];
				
				if(!img)
				{
					img = "https://startgaming.net/wp-content/themes/StartGaming/img/icons/defaultOffer.jpg";
				}
				
				$('.purchase-alert__product-img').prop('src', 'https://startgaming.net/wp-content/themes/StartGaming/img/icons/defaultOffer.jpg');
				$('.purchase-alert__product').text(title);
				$('.purchase-alert__time-and-country').text(date);
				$('.purchase-alert').attr("href", url);
				
				let purchaseAlertCloseBtn = $('.purchase-alert__close-btn')
				function openPurchaseAlert(){
					purchaseAlert.addClass('purchase-alert_show')
				}
				function closePurchaseAlert(){
					purchaseAlert.removeClass('purchase-alert_show');
					
					var date = new Date();
					date.setTime(date.getTime() + (60 * 30 * 1000));
					$.cookie('alertOffer', 1, { expires: date });
				}
				purchaseAlertCloseBtn.click((event)=>{
					event.stopPropagation();
					event.preventDefault();
					closePurchaseAlert()
				})
				////////////// для разработки //////////
				setTimeout(()=>{
						openPurchaseAlert()
					}, 5000
				)
			  },
			  error: function(data)
			  {
				
			  }
			});
		}
	}
}

(function($){
	
	
	$('.js-remove_cart_item').click(function(e){
		e.preventDefault();
		$.ajax({
			type: 'POST',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'remove_cart_item',
					cart_item_key: $(this).attr('cart_item_key'),
				},
			},
			success: function(reply){
				window.location.reload();
			}
		});
	});
	
	
	
	$('.js-add-more-offers').click(function(e){
		e.preventDefault();
		offers_filters.page += 1;
		MoreOffers();
	});
	
	$('.products_filter').click(function(e){
		//console.log(e.target);
		e.preventDefault();
		$('.products_filter').not($(this)).removeClass('open');
		$(this).toggleClass('open');
	});

	$('.ordering_list li').click(function(e){
		e.preventDefault();
		$('.ordering_list li').removeClass('current');
		$(this).addClass('current');
		offers_filters.orderby = $(this).attr('orderby');		
		UpdateOffers();
	});
	
	$('.js-search-offers').submit(function(e){
		e.preventDefault();
		offers_filters.search.push($(this).find('.fv_products_search').val());
		$(this).find('.fv_products_search').val('');
		UpdateSearchList();
		if(offers_filters.search.length) UpdateOffers();
	});
	
	var $search_tags = $('.js-search-tags');
	$search_tags.on('click', '.clear_words', function(e){
		$search_tags.empty();
		offers_filters.search = [];
		UpdateOffers();
	});
	$search_tags.on('click', '.del_word', function(e){
		var index = $(this).attr('index');
		offers_filters.search[index] = '';
		UpdateSearchList();
		UpdateOffers();
	});
	
	$('.js-region-select-all').click(function(e){
		e.preventDefault();
		e.stopPropagation();
		var regions = [];
		if($('.products_filter_inner_item').filter('[region_id]').length == $('.products_filter_inner_item').filter('[region_id]').filter('.active').length){
			$('.products_filter_inner_item').filter('[region_id]').removeClass('active');
			offers_filters.regions = [];
		}
		else{
			$('.products_filter_inner_item').filter('[region_id]').each(function(i, el){
				regions.push($(el).attr('region_id'));
				$(el).addClass('active');
			});
			offers_filters.regions = regions;
		}
		UpdateServers();
		//UpdateOffers();
	});
	
	$('.products_filter_inner_item').filter('[region_id]').click(function(e){
		e.preventDefault();
		e.stopPropagation();
		$(this).toggleClass('active');
		var regions = [];
		$('.products_filter_inner_item').filter('[region_id]').filter('.active').each(function(i, el){
			regions.push($(el).attr('region_id'));
			$(el).addClass('active');
		});
		offers_filters.regions = regions;
		UpdateServers();
		//UpdateOffers();
	});

	$('.label_checkbox_server').click(function(e){
		e.preventDefault();
		e.stopPropagation();
		$('#' + $(this).attr('for')).prop('checked', !$('#' + $(this).attr('for')).get(0).checked);
		var servers = [];
		$('.checkbox_server').filter(':checked').each(function(i, el){
			servers.push($(el).attr('server_id'));
		});
		offers_filters.servers = servers;
		//UpdateOffers();
	});

	$('.label_checkbox_service_type').click(function(e){
		e.preventDefault();
		e.stopPropagation();
		$('#' + $(this).attr('for')).prop('checked', !$('#' + $(this).attr('for')).get(0).checked);
		var service_type = [];
		$('.checkbox_service_type').filter(':checked').each(function(i, el){
			service_type.push($(el).attr('service_type_id'));
		});
		offers_filters.service_type = service_type;
		//UpdateOffers();
	});
	
	$('.products_filter_inner_value').click(function(e){
		e.preventDefault();
		e.stopPropagation();
	}).change(function(){
		offers_filters.price = [
			parseFloat($('.products_filter_inner_value').filter('[price="from"]').val()),
			parseFloat($('.products_filter_inner_value').filter('[price="to"]').val()),
		];
		//UpdateOffers();
	});
	
	$('.js-apply-filter').click(function(e){
		e.preventDefault();
		UpdateOffers();
	});
	$('.js-clear-filter').click(function(e){
		e.preventDefault();
		offers_filters = {
			regions: [],
			servers: [],
			service_type: [],
			price: [],
			orderby: '',
			search: '',
		};
		UpdateOffers();
	});
	
	function UpdateSearchList(){
		var $search_tags = $('.js-search-tags');
		$search_tags.empty();
		$.each(offers_filters.search, function(i, el){
			if(el !== ''){
				$search_tags.append('<li class="item_tags"><div class="list_tags-word">'+ el +'</div><span index="'+ i +'" class="del_word"></span></li>');
			}
		});
		if($search_tags.find('.item_tags').length) $search_tags.append('<li class="clear_words">Clear All</li>');
	}
	
	function UpdateServers(){
		if(offers_filters.regions.length == 0){
			$('.checkbox_server').prop('checked', false);
			$('.products_filter_inner.sersers').find('.filter_checkbox').show();
		}
		else{
			$('.checkbox_server').each(function(i, el){
				if(!offers_filters.regions.includes($(el).attr('from_region_id'))){
					$(el).prop('checked', false).parents('.filter_checkbox').hide();
				}
				else{
					$(el).parents('.filter_checkbox').show();
				}
			});
		}
		var servers = [];
		$('.checkbox_server').filter(':checked').each(function(i, el){
			servers.push($(el).attr('server_id'));
		});
		offers_filters.servers = servers;
	}
	
	function UpdateOffers(){
		$('body').append('<div class="offers-glass"></div>');
		$.ajax({
			type: 'GET',
			url: '',
			data: {
				filters: offers_filters,
			},
			success: function(reply){
				var $temp = $('<div>');
				$temp.html(reply);
				var $sc_products_block = $temp.find('.js-products-list').find('.sc_products_block');
				$('.js-products-list').html($sc_products_block);
				$('.js-add-more-offers').show();
				$('.offers-glass').remove();
			}
		});
	}

	function MoreOffers(){
		$('body').append('<div class="offers-glass"></div>');
		$.ajax({
			type: 'GET',
			url: '',
			data: {
				filters: offers_filters,
			},
			success: function(reply){
				var $temp = $('<div>');
				$temp.html(reply);
				var $sc_products_block = $temp.find('.js-products-list').find('.sc_products_block');
				if($sc_products_block.length == 0) $('.js-add-more-offers').hide();
				$('.js-products-list').append($sc_products_block);
				$('.offers-glass').remove();
			}
		});
	}
	
	
	$('[btnstap]').click(function(e){
		$('[stap]').removeClass('open');
		$('[stap="'+$(this).attr('btnstap')+'"]').addClass('open');
		
		if($(this).attr('btnstap') == 1) $('[labelstap]').removeClass('active');
		$('[labelstap="'+$(this).attr('btnstap')+'"]').addClass('active');
	});
	
	$('.become-seller-form').submit(function(e){
		e.preventDefault();
	});
	
	
	
	
	
	
})(jQuery);

(function($){
	
    $.fn.removeClassWild = function(mask){
        return this.removeClass(function(index, cls){
            var re = mask.replace(/\*/g, '\\S+');
            return (cls.match(new RegExp('\\b' + re + '', 'g')) || []).join(' ');
        });
    };
	
	$('.header__mainmenu-close').click(function(){
		$('.header__mainmenu-list').removeClass('open');
	});

	$('.header__mainmenu-open').click(function(){
		$('.header__mainmenu-list').addClass('open');
	});
	
	if($('.fv-checkout-create-account').length){
		$('.fv-in-toggle-create-account').change(function(){
			$('.fv-checkout-create-account').toggle();
			if($('.fv-checkout-create-account').is(':visible')){
				$('.fv-checkout-create-account').find('[type="password"]').prop('disabled', false).removeAttr('disabled');
			}
			else{
				$('.fv-checkout-create-account').find('[type="password"]').prop('disabled', true).attr('disabled', 'disabled');
			}
		});
	}
	
	
	
	$('.js-sell-with-startgaming').submit(function(e){
		e.preventDefault();
		var   $form = $(this)
			, $user_name = $form.find('[name="user_name"]')
			, $user_email = $form.find('[name="user_email"]')
			, $type_business = $form.find('[name="type_business"]')
			, $stock_process = $form.find('[name="stock_process"]')
			, $official_channel = $form.find('[name="official_channel"]')
			, $count_product = $form.find('[name="count_product"]')
			, $product_items = $form.find('[name="product_items"]')
			, $competitors = $form.find('[name="competitors"]')
			, $why_startgaming = $form.find('[name="why_startgaming"]')
			, error = false
		;
		
		$form.find('input[type=text], input[type=email], textarea').each(function(i, el){
			if($(el).val() == ''){
				$(el).addClass('error');
				error = true;
			}
			else $(el).removeClass('error');
		});
		if(!$official_channel.prop('checked')){
			$official_channel.parent().addClass('error');
			error = true;
		}
		else{
			$official_channel.parent().removeClass('error');
		}
		
		if(!error){
			$.ajax({
				type: 'GET',
				url: template.url_ajax,
				data: {
					action: 'ajax_fn',
					param: {
						action: 'send-form-add-trader',
						user_name: $user_name.val(),
						user_email: $user_email.val(),
						type_business: $type_business.filter(':checked').val(),
						stock_process: $stock_process.val(),
						count_product: $count_product.val(),
						product_items: $product_items.val(),
						competitors: $competitors.val(),
						why_startgaming: $why_startgaming.val(),
					},
				},
				success: function(reply){
					window.location.reload();
				}
			});
		}
		else{
			$("html, body").animate({ scrollTop: $form.find('input.error, textarea.error, .js-official_channel.error').eq(0).position().top }, 600);
		}
		
	});
	
	
	$('.js-subscribe').click(function(e){
		e.preventDefault();
		var $inp = $('.newfooter__subscribe-input');
		if($inp.val() == ''){
			$inp.addClass('error');
		}
		else{
			$inp.removeClass('error');
			$.ajax({
				type: 'GET',
				url: template.url_ajax,
				data: {
					action: 'ajax_fn',
					param: {
						action: 'send-subscribe',
						user_email: $inp.val(),
					},
				},
				success: function(reply){
					console.log(reply);
					$inp.val('');
				}
			});
		}
	});
	
	
	
	
	
	$('.newfaq__tabcontainer-question-top').click(function(e){
		e.preventDefault();
		$(this).parents('.newfaq__tabcontainer-question').toggleClass('open');
	});
	
	$('.newfaq__tab').click(function(){
		$('.newfaq__tab').removeClass('active');
		$(this).addClass('active');
		$('.newfaq__tabcontainer-block').hide().eq($(this).index()).show();
	});//.filter(':first').click();
	
	
	
	var   wW = $(window).width()
		, carouselWidth = 1300
		, carouselHeight = 390
		, frontWidth = 760
		, frontHeight = 390
		, hMargin = 0.2
		, vMargin = 0.4
	;
	
	if(wW < 1024){
		carouselWidth = 390;
		carouselHeight = 200;
		frontWidth = carouselWidth;
		frontHeight = carouselHeight;
	}
	else if(wW < 1200){
		carouselWidth = 600;
		carouselHeight = 257;
		frontWidth = carouselWidth;
		frontHeight = carouselHeight;
	}
	else if(wW < 1366){
		carouselWidth = 640;
		carouselHeight = 328;
		frontWidth = carouselWidth;
		frontHeight = carouselHeight;
	}

	
	$('.carousel').carousel({
		hMargin: hMargin,
		vMargin: vMargin,
		carouselWidth: carouselWidth,
		carouselHeight: carouselHeight,
		frontWidth: frontWidth,
		frontHeight: frontHeight,
		directionNav:true,
		shadow:true,
		buttonNav:'bullets',
		autoplay: false,
	});
	
	
	
	
	
	//$('.footer__logo').click(function(){

	//});
	
	
	
	$('.ordering_list.pt li').click(function(){
		$('.ordering_list.pt li').removeClass('active current');
		$(this).addClass('active current');
		var rel = $(this).attr('rel');
		if(rel == 'all'){
			$('.js-page_games_list .page_games_item').removeClass('hidden');
		}
		else{
			$('.js-page_games_list .page_games_item').addClass('hidden').filter('[pa_genres*="'+ rel +'"]').removeClass('hidden');
		}
	});
	
	$('.themeoption').click(function(){
		$.ajax({
			type: 'GET',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'toggle-theme',
				},
			},
			success: function(reply){
				location.reload();
			}
		});
	});
	
	
	$('.mobmenu').on('click', function(){
		$('.header__top-listmenu').addClass('open');
	});

	$('.header__mainmenu-item.with-children').on('click', function(){
		$('.header__mainmenu-item.with-children.open').not(this).removeClass('open');
		$(this).toggleClass('open');
	});
	
	$(document).click(function(e){
		if($(e.target).parents('.header__mainmenu-item.with-children').length == 0) $('.with-children.open').removeClass('open');
	});
	
	
	
	
	
	
	

	$('.header__top-listmenu-close').on('click', function(){
		$('.header__top-listmenu').removeClass('open');
	});
	
	
	$(document).on('DOMNodeRemoved', function(e){
		if($(e.target).hasClass('up-widget')) window.location.href = '/checkout/';
	});
	
	$('.actions__slider').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		autoplay: true,
		autoplaySpeed: 5000,
		speed: 1000,
		fade: false,
		// cssEase: 'linear',
	});
	
	$('.country__list').empty();
	$('.gtranslate__block .glink').each(function(i, el){
		var temp_str = $(el).attr('onclick');
		temp_str = temp_str.substr(0, temp_str.length - 16);
		temp_str = temp_str.slice(14);
		temp_str = temp_str.replace('|', '-');
		$(el).addClass(temp_str);
		$('.country__list').append('<li class="country__item ' + temp_str + '-flag" rel="'+ temp_str +'"></li>');
	});
	
	/*var cookie_googtrans = $.cookie('googtrans');
	if(cookie_googtrans == undefined) cookie_googtrans = '/en/en';
	
	$('.country__curent').addClass(cookie_googtrans.substr(1).replace('/', '-') + '-flag');
	
	$('body').addClass('fv-lang-' + cookie_googtrans.substr(1).replace('/', '-'));*/
	
	var cookie_googtrans = $.cookie('googtrans');
	if(cookie_googtrans == undefined)
	{
		if(navigator.language.indexOf('zh') !== -1)
		{
			$('.country__curent').addClass('en-zh-CN-flag');
		}
		else if(navigator.language.indexOf('fr') !== -1)
		{
			$('.country__curent').addClass('en-fr-flag');
		}
		else if(navigator.language.indexOf('de') !== -1)
		{
			$('.country__curent').addClass('en-de-flag');
		}
		else if(navigator.language.indexOf('es') !== -1)
		{
			$('.country__curent').addClass('en-es-flag');
		}
		else
		{
			$('.country__curent').addClass('en-en-flag');
		}
	}
	else
	{
		$('.country__curent').addClass(cookie_googtrans.substr(1).replace('/', '-') + '-flag');
	
		$('body').addClass('fv-lang-' + cookie_googtrans.substr(1).replace('/', '-'));
	}
	
	$('.country__list .country__item').click(function(){
		$('.gtranslate__block .glink').filter('.' + $(this).attr('rel')).click();
		$('.country__curent').removeClass().addClass('country__curent').addClass($(this).attr('rel') + '-flag');
		
		$('body').removeClassWild('fv-lang-*').addClass('fv-lang-' + $(this).attr('rel'));
		
	});
	
	setTimeout(function(){
		$('.currency__list').empty();
		$('.widget-woocommerce-currency-switcher .dd-option-value').each(function(i, el){
			$('.currency__list').append('<li class="currency__item ' + $(el).val() + '-icon" rel="'+ $(el).val() +'"></li>');
		});
		var kukas = Cookies.get('currency_globl');
		
		if(kukas == undefined)
		{
			kukas = "USD";
		}
		// $('.currency__curent').removeClass().addClass('currency__curent').addClass($('[name="woocommerce-currency-switcher"]').val() + '-icon');
		
		$('.currency__curent').removeClass().addClass('currency__curent').addClass(kukas + '-icon');
		
		$('.currency__list .currency__item').click(function(){
			Cookies.set('currency_globl', $(this).attr('rel'));
			$.ajax({
				type: 'GET',
				url: '/',
				data: {
					currency: $(this).attr('rel')
				},
				success: function(reply){}
			});
			$('.currency__curent').removeClass().addClass('currency__curent').addClass($(this).attr('rel') + '-icon');
			setTimeout(function(){
				window.location.reload();
			}, 1000);
		});
	}, 2000);

})(jQuery);

(function($){
	
	$('#load_glass').hide();
	
	if($('#js-voice-player').length == 0) return;
	
	$('#js-voice-player').get(0).volume = 0.2;
	$('#js-voice-player').get(0).play();
	
	$('.js-voice-toggle').click(function(){
		if($(this).hasClass('play')){
			$('#js-voice-player').get(0).play();
		}
		else{
			$('#js-voice-player').get(0).pause();
		}
		$(this).toggleClass('play')
	});

})(jQuery);

(function($){
	
	
	setInterval(function(){
		if($('[name="payment_method"]:checked').length > 0){
			$('[name="fv_payment_method_id"]').val($('[name="payment_method"]:checked').eq(0).attr('id'));
		}
	}, 300);
	
	
	
	
	
	$(function(){
		$('.referer-content input').attr('autocomplete', 'off');
		$('.referer-content .filter__tools__date').datepicker({dateFormat: 'yy-mm-dd'});
	});
	
	$('.checkout.woocommerce-checkout').submit(function(){
		if($('#payment_method_xxx').prop('checked')){
			window.location = '/pagar-paypal/';
		}
	});
	
	$('input').attr('autocomplete', 'off');
	
	
	
	// $('.fv-refferaaallll').slick({
		// slidesToShow: 10,
		// slidesToScroll: 1,
		// arrows: true,
		// dots: false,
		// autoplay: true,
		// autoplaySpeed: 3000,
		// responsive: [
			// // {
				// // breakpoint: 1200,
				// // settings: {
					// // slidesToShow: 4,
				// // }
			// // },
			// // {
				// // breakpoint: 1024,
				// // settings: {
					// // slidesToShow: 3,
				// // }
			// // },
			// // {
				// // breakpoint: 768,
				// // settings: {
					// // slidesToShow: 2,
				// // }
			// // },
			// // {
				// // breakpoint: 480,
				// // settings: {
					// // slidesToShow: 1,
				// // }
			// // }
		// ]
	// });
	$('.fv-refferaaallll .goods__product').click(function(e){
		var temp = $(this).attr('href') + $(this).attr('referral_key') + '/';
		$('.js-goods__product-rf-link').val(temp);
		$('.js-goods__product-rf-name').html($(this).attr('title'));
	}).filter(':first').click();
	
	

	$('.card__right-slider').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		autoplay: true,
		autoplaySpeed: 3000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	});
	
	$('.card__right-slider-trader').slick({
		slidesToShow: 4,
		slidesToScroll: 4,
		arrows: false,
		dots: false,
		autoplay: false,
		autoplaySpeed: 3000,
		responsive: [
			{
				breakpoint: 1280,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				}
			},
			{
				breakpoint: 1100,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				}
			},
			{
				breakpoint: 540,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				}
			}
		]
	});
	$('.sellers__btnpn.fprev').click(function(){
		$(".card__right-slider-trader").slick('slickPrev');
	});
	
	$('.sellers__btnpn.fnext').click(function(){
		$(".card__right-slider-trader").slick('slickNext');
	});
	
	
	
	$('.faq__block-item-title').on('click', function(){
			$(this).parent().toggleClass('open');
	});
	
})(jQuery);

(function($){
	
	var filters_goods = {
		min_price: parseFloat($('#pricebetween_de').val()),
		max_price: parseFloat($('#pricebetween_hasta').val()),
	};
	
	function FilterGetStr(){
		var parаm = [];
		for(key in filters_goods){
			if(typeof filters_goods[key] === 'string' || typeof filters_goods[key] === 'number'){
				parаm.push(key + '=' + filters_goods[key]);
			}
			else if(typeof filters_goods[key] === 'object' && Array.isArray(filters_goods[key]) && filters_goods[key].length > 0){
				parаm.push(key + '=' + filters_goods[key].join(','));
			}
			else if(typeof filters_goods[key] === 'boolean' && filters_goods[key]){
				parаm.push(key + '=' + Number(filters_goods[key]));
			}
		}
		if($('[name=orderby]').val() != '') parаm.push('orderby=' + $('[name=orderby]').val());
		
		return parаm.join('&');
	}
	
	$('#slider-range').slider({
		range: true,
		min: parseFloat($('#slider-range').attr('min_price')),
		max: parseFloat($('#slider-range').attr('max_price')),
		values: [$('#pricebetween_de').val(), $('#pricebetween_hasta').val()],
		slide: function(event, ui){
			filters_goods.min_price = ui.values[0];
			filters_goods.max_price = ui.values[1];
			$('#pricebetween_de').val(template.currency_symbol + ui.values[0]);
			$('#pricebetween_hasta').val(template.currency_symbol + ui.values[1]);
		}
	});
	$('#pricebetween_de').val(template.currency_symbol + $('#slider-range').slider('values', 0));
	$('#pricebetween_hasta').val(template.currency_symbol + $("#slider-range").slider('values', 1));
	
	$('.js-btn-filter-goods').click(function(){
		window.location = window.location.pathname + '?' + FilterGetStr();
	});
	
	$('.filters .filters__title').click(function(){
		$(this).parents('.filters__content').toggleClass('open');
	});
	
	$('#instock').change(function(){
		filters_goods.instock = $(this).prop('checked');
	}).change();
	
	$('.js-filter-genres').find('input:checkbox').change(function(){
		var filter_genres = [];
		$('.js-filter-genres').find('input:checkbox:checked').each(function(i, el){
			filter_genres.push($(el).attr('name'));
		});
		filters_goods.filter_genres = filter_genres;
	}).change();
	$('.js-filter-editor').find('input:checkbox').change(function(){
		var filter_editor = [];
		$('.js-filter-editor').find('input:checkbox:checked').each(function(i, el){
			filter_editor.push($(el).attr('name'));
		});
		filters_goods.filter_editor = filter_editor;
	}).change();
	$('.js-filter-activacion').find('input:checkbox').change(function(){
		var filter_activacion = [];
		$('.js-filter-activacion').find('input:checkbox:checked').each(function(i, el){
			filter_activacion.push($(el).attr('name'));
		});
		filters_goods.filter_activacion = filter_activacion;
	}).change();
	$('.js-filter-desarrollador').find('input:checkbox').change(function(){
		var filter_desarrollador = [];
		$('.js-filter-desarrollador').find('input:checkbox:checked').each(function(i, el){
			filter_desarrollador.push($(el).attr('name'));
		});
		filters_goods.filter_desarrollador = filter_desarrollador;
	}).change();
	
	$('.orderby__list .orderby__item').click(function(){
		$('.orderby__list .orderby__item').removeClass('active');
		$(this).addClass('active');
		$('.js-woocommerce-ordering').find('[name=orderby]').val($(this).attr('orderby'));
		$('.js-woocommerce-ordering').find('.btn-submit').click();
	});
	
	$('.btn_apply_coupon_code').click(function(e){
		e.preventDefault();
		var   $promocode = $(this).parents('.fv_cupun__block')
			, $coupon_code = $('.fv_coupon_code')
		;
		if($coupon_code.val() == ''){
			$coupon_code.addClass('error');
			return false;
		}
		$.ajax({
			type: 'POST',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'add_coupon',
					coupon_code: $coupon_code.val(),
				},
			},
			success: function(reply){
				jQuery(document.body).trigger("update_checkout");
				//window.location.reload();
			}
		});
	});
	
	$('.js-btn-remove-coupon').click(function(){
		var   $discount = $(this).parents('.cart-discount')
			, coupon_code = $discount.attr('coupon_code')
		;
		$.ajax({
			type: 'POST',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'remove_coupon',
					coupon_code: coupon_code,
				},
			},
			success: function(reply){
				window.location.reload();
			}
		});
	});
	
	var cartTotalPrice = 0;
	
	$('.js-quantity-minus').click(function(){
		var   $js_cart_product = $(this).parents('.js-cart-product')
			, $js_quantity = $js_cart_product.find('.js-quantity')
			, $kotirovka = $js_cart_product.find('.js-kotirovka')
			, price = parseFloat($kotirovka.attr('price'))
			, currency = $kotirovka.attr('currency')
			, temp = parseInt($js_quantity.val())
			, min_quantity = parseInt($js_quantity.attr('min')) || 1
		;
		temp = temp - 1;
		if(temp < min_quantity){
			$js_quantity.val(min_quantity);
			temp = min_quantity;
			return;
		}
		else{
			$js_quantity.val(temp);
		}
		
		$kotirovka.html(temp + ' = ' + number_format(price * temp, 6, '.', ',') +' '+ currency);
		
		$js_cart_product.find('.sc_products_right-price').html(jQuery.trim(price*temp).substring(0, 5) + ' ' + currency);
		
		$js_cart_product.find('.ss_right_bottom').find('.ss_right_bottom-left').find('.fv-ss_right_bottom-left-price').html(jQuery.trim(price*temp).substring(0, 5) + ' ' + currency);
		
		var old_price = $('.ss_right_bottom-left-old-price').attr('old_price');
		
		if(old_price != undefined)
		{
			$js_cart_product.find('.ss_right_bottom').find('.ss_right_bottom-left').find('.ss_right_bottom-left-old-price').html(jQuery.trim(old_price*temp).substring(0, 5) + ' ' + currency);
		}
		
		if($('.js-quantity-minus')[0].className == 'basket__product-minus js-quantity-minus')
		{
			price = $js_cart_product.attr('price');
			
			if($js_cart_product.attr('currency') == undefined)
			{
				priceMix = $js_cart_product.find('.basket__product-price').find('.woocommerce-Price-amount amount').prevObject[0].innerText;

				currency = priceMix.match(/\d+((.|,)\d+)(.*)/)[3];
				
				$js_cart_product.attr('currency', currency);
			}
			else
			{
				currency = $js_cart_product.attr('currency');
			}
			
			$js_cart_product.find('.basket__product-prices').html(jQuery.trim(price*temp).substring(0, 5) + ' ' + currency);
			
			/*var cart = document.getElementsByClassName('payment__price js-total-price');
			

				var totalpriceMix = cart[0].innerText;
				if(cartTotalPrice == 0)
				{				
					cartTotalPrice = totalpriceMix.match(/\d+((.|,)\d+)/)[0];
				}
				
				totalcurrency = totalpriceMix.match(/\d+((.|,)\d+)(.*)/)[3];
				
				cartTotalPrice = cartTotalPrice - (price * (temp+1));
				cartTotalPrice = cartTotalPrice + (price * temp);

			cart[0].innerText = jQuery.trim(cartTotalPrice).substring(0, 5) + ' ' + totalcurrency;*/
			
			UpdateQuantityProduct($js_cart_product);
		}
	});
	
	$('.js-quantity-plus').click(function(e){
		var   $js_cart_product = $(this).parents('.js-cart-product')
			, $js_quantity =  $js_cart_product.find('.js-quantity')
			, $kotirovka = $js_cart_product.find('.js-kotirovka')
			, price = parseFloat($kotirovka.attr('price'))
			, currency = $kotirovka.attr('currency')
			, temp = parseInt($js_quantity.val())
		;
		temp = temp + 1;
		$js_quantity.val(temp);
		
		$kotirovka.html(temp + ' = ' + number_format(price * temp, 6, '.', ',') +' '+ currency);
		
		$js_cart_product.find('.sc_products_right-price').html(jQuery.trim(price*temp).substring(0, 5) + ' ' + currency);
		
		$js_cart_product.find('.ss_right_bottom').find('.ss_right_bottom-left').find('.fv-ss_right_bottom-left-price').html(jQuery.trim(price*temp).substring(0, 5) + ' ' + currency);
		
		var old_price = $('.ss_right_bottom-left-old-price').attr('old_price');
		
		if(old_price != undefined)
		{
			$js_cart_product.find('.ss_right_bottom').find('.ss_right_bottom-left').find('.ss_right_bottom-left-old-price').html(jQuery.trim(old_price*temp).substring(0, 5) + ' ' + currency);
		}
		
		if($('.js-quantity-plus')[0].className == 'basket__product-plus js-quantity-plus')
		{
			price = $js_cart_product.attr('price');
			
			if($js_cart_product.attr('currency') == undefined)
			{
				priceMix = $js_cart_product.find('.basket__product-price').find('.woocommerce-Price-amount amount').prevObject[0].innerText;

				currency = priceMix.match(/\d+((.|,)\d+)(.*)/)[3];
				
				$js_cart_product.attr('currency', currency);
			}
			else
			{
				currency = $js_cart_product.attr('currency');
			}
			
			$js_cart_product.find('.basket__product-prices').html(jQuery.trim(price*temp).substring(0, 5) + ' ' + currency);
			
			/*var cart = document.getElementsByClassName('payment__price js-total-price');
			

				var totalpriceMix = cart[0].innerText;
				
				if(cartTotalPrice == 0)
				{
					cartTotalPrice = totalpriceMix.match(/\d+((.|,)\d+)/)[0];
				}
				totalcurrency = totalpriceMix.match(/\d+((.|,)\d+)(.*)/)[3];
				
				cartTotalPrice = cartTotalPrice - (price * (temp-1));
				cartTotalPrice = cartTotalPrice + (price * temp);

			cart[0].innerText = jQuery.trim(cartTotalPrice).substring(0, 5) + ' ' + totalcurrency;*/
			
			UpdateQuantityProduct($js_cart_product);
		}
	});
	
	var cartItems = $('.ss_right_new_info').children();
	var recomendation = $('.description_products-btn');
	if(cartItems && recomendation)
	{
		for(var i = 0; i < recomendation.length; i ++)
		{
			for(x = 0; x < cartItems.length; x ++)
			{
				if($(recomendation[i]).attr('offername') == $(cartItems[x]).attr('cartitemname'))
				{
					$(recomendation[i]).attr('add', 1);
					$(recomendation[i]).css('background-image', 'url(https://startgaming.net/wp-content/themes/StartGaming/theme/css/svg/btntrash.svg)');
					$(recomendation[i]).css('background-color', '#FFFFFF'); 
					$(recomendation[i]).css('border', '1px solid #E8E8E8');
					$(recomendation[i]).html('');
				}
			}
		}
	}
	
	var cartItems = $('.ss_right_new_info_mobile').children();
	var recomendation = $('.description_slide-content-btn');
	if(cartItems && recomendation)
	{
		for(var i = 0; i < recomendation.length; i ++)
		{
			for(x = 0; x < cartItems.length; x ++)
			{
				if($(recomendation[i]).attr('offername') == $(cartItems[x]).attr('cartitemname'))
				{
					$(recomendation[i]).attr('add', 1);
					$(recomendation[i]).css('background-image', 'url(https://startgaming.net/wp-content/themes/StartGaming/theme/css/svg/btntrash.svg)');
					$(recomendation[i]).css('background-color', '#FFFFFF'); 
					$(recomendation[i]).css('border', '1px solid #E8E8E8');
					$(recomendation[i]).html('');
				}
			}
		}
	}
	
	var proditembutton = $('.pcm_left_price-btn');
	if(proditembutton.length > 0)
	{
		for(var i = 0; i < proditembutton.length; i ++)
		{
			if(parseInt($(proditembutton[i]).attr('incart')))
			{
				$(proditembutton[i]).css('background-image', 'url(https://startgaming.net/wp-content/themes/StartGaming/theme/css/svg/btntrash.svg)');
				$(proditembutton[i]).css('background-color', '#FFFFFF'); 
				$(proditembutton[i]).css('border', '1px solid #E8E8E8');
				$(proditembutton[i]).css('background-repeat', 'no-repeat');
				$(proditembutton[i]).css('background-position', 'center');
				$(proditembutton[i]).css('height', '57px');
				$(proditembutton[i]).html('');
			}
		}
	}
    
	/*var proditembutton = $('.pcm_left_price-btn');
	if(proditembutton.length > 0)
	{
		for(var i = 0; i < proditembutton.length; i ++)
		{
			if(!parseInt($(proditembutton[i]).attr('incart')))
			{
				//$(proditembutton[i]).attr('incart', 0);
				$(proditembutton[i]).css('background-image', 'url(https://startgaming.net/wp-content/themes/StartGaming/theme/css/svg/white-cart.svg)');
				$(proditembutton[i]).css('background-color', '#F9B944'); 
				$(proditembutton[i]).css('border', '1px solid #E8E8E8');
				$(proditembutton[i]).css('background-repeat', 'no-repeat');
				$(proditembutton[i]).css('background-position', 'center');
				$(proditembutton[i]).css('height', '44px');
				$(proditembutton[i]).html('');
			}
		}
	}*/
	
	$('.description_slide-content-btn').click(function(e)
	{
		var add = $(this).attr('add');
		var offer_id = $(this).attr('offer_id');
		var price = $(this).attr('price');
		var oldPriceLocal = $(this).attr('oldprice');
		var offfername = $(this).attr('offername');
		var newItem = 0;
		var symbol = document.getElementsByClassName('ss_right_new_title')[0].getAttribute('symbol');
		
		//if(offfername.indexOf('Netflix') != -1 || offfername.indexOf('netflix') != -1)
		if(offfername.indexOf('HBO') != -1 || offfername.indexOf('Hbo') != -1)
		{
			//alert('This item is out of stock');
			//return;
		}
		
		if(!parseInt(add))
		{
			$(this).attr('add', 1);
			$(this).css('background-image', 'url(https://startgaming.net/wp-content/themes/StartGaming/theme/css/svg/btntrash.svg)');
			$(this).css('background-color', '#FFFFFF'); 
			$(this).css('border', '1px solid #E8E8E8');
			$(this).html('');
			var cartItems = $('.ss_right_new_info').children();
			for(var i = 0; i < cartItems.length; i ++)
			{
				if(cartItems[i].getAttribute('cartitemname') == offfername)
				{
					newItem = 1;
					
					break;
				}
			}
			
			if(!newItem)
			{
				$('.ss_right_new_info').append('<div class="ss_right_new_info-line" cartItemName = "' + offfername + '" count= "0" + price="' + price + '" add="1">\
				<div class="ss_right_new_info-title">' + offfername + ' * 1</div>\
				<div class="ss_right_new_info-value"><span class="woocommerce-Price-amount amount"><bdi>' + price + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span></div>\
				</div>');
			}
			
			var cartItems = $('.ss_right_new_info').children();
			
			if(cartItems.length > 0)
			{
				for(var i = 0; i < cartItems.length; i ++)
				{
					if(cartItems[i].getAttribute('cartitemname') == offfername)
					{
						cartItems[i].getElementsByClassName('ss_right_new_info-title')[0].innerHTML = offfername + ' * ' + (parseInt(cartItems[i].getAttribute('count')) + 1);
						cartItems[i].setAttribute('count', parseInt(cartItems[i].getAttribute('count')) + 1);
						
						cartItems[i].getElementsByClassName('ss_right_new_info-value')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + (parseFloat(cartItems[i].getAttribute('price')) * parseInt(cartItems[i].getAttribute('count'))).toFixed(1) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>';
						
						var cartPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-price')[0].getAttribute('price')) + parseFloat(cartItems[i].getAttribute('price'));
						document.getElementsByClassName('ss_right_new_bottom-left-price')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + cartPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
						document.getElementsByClassName('ss_right_new_bottom-left-price')[0].setAttribute('price', cartPrice.toFixed(2));
						
						var oldPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].getAttribute('price')) + parseFloat(oldPriceLocal);
						document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + oldPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
						document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].setAttribute('price', oldPrice.toFixed(2));
						
						document.getElementsByClassName('ss_right_new_bottom-title')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>Save ' + (oldPrice - cartPrice).toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
						
						if((oldPrice - cartPrice) > 0)
						{
							document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].removeAttribute("hidden");
							document.getElementsByClassName('ss_right_new_bottom-title')[0].removeAttribute("hidden");
						}

						break;
					}
				}
			}
			
			$.ajax({
				type: 'POST',
				url: template.url_ajax,
				data: {
					action: 'ajax_fn',
					param: {
						action: 'add_to_cart_offer',
						offer_id: offer_id,
						quantity: 1,
					},
				},
				success: function(reply){					

				}
			});
			
			document.getElementsByClassName('ss_right_new')[0].style.display = "block";
			document.getElementsByClassName('ss_right_new')[1].style.display = "block";
		}
		else
		{
			$(this).attr('add', 0);
			$(this).css('background-image', 'url(https://startgaming.net/wp-content/themes/StartGaming/theme/css/svg/btncart.svg)');
			$(this).css('background-color', '#F9B944');
			$(this).css('border', '0px solid #E8E8E8');
			$(this).html('+');
			
			var cartItems = $('.ss_right_new_info').children();
			for(var i = 0; i < cartItems.length; i ++)
			{
				if(cartItems[i].getAttribute('cartitemname') == offfername)
				{
					var cartPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-price')[0].getAttribute('price')) - parseFloat(cartItems[i].getAttribute('price'));
					document.getElementsByClassName('ss_right_new_bottom-left-price')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + cartPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					document.getElementsByClassName('ss_right_new_bottom-left-price')[0].setAttribute('price', cartPrice.toFixed(2));
					
					var oldPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].getAttribute('price')) - parseFloat(oldPriceLocal);
					document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + oldPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].setAttribute('price', oldPrice.toFixed(2));
					
					document.getElementsByClassName('ss_right_new_bottom-title')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>Save ' + (oldPrice - cartPrice).toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					
					if((oldPrice - cartPrice) > 0)
					{
						document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].removeAttribute("hidden");
						document.getElementsByClassName('ss_right_new_bottom-title')[0].removeAttribute("hidden");
					}
					
					cartItems[i].remove();
					
					break;
				}
			}
			
			if($('.ss_right_new_info').children().length <= 0)
			{
				document.getElementsByClassName('ss_right_new')[0].style.display = "none";
				document.getElementsByClassName('ss_right_new')[1].style.display = "none";
			}
			
			$.ajax({
				type: 'POST',
				url: template.url_ajax,
				data: {
					action: 'ajax_fn',
					param: {
						action: 'remove_cart',
						offer_id: offer_id,
					},
				},
				success: function(reply){					

				}
			});
		}
	});
	
	$('.description_products-btn').click(function(e)
	{
		var add = $(this).attr('add');
		var offer_id = $(this).attr('offer_id');
		var price = $(this).attr('price');
		var oldPriceLocal = $(this).attr('oldprice');
		var offfername = $(this).attr('offername');
		var newItem = 0;
		var symbol = document.getElementsByClassName('ss_right_new_title')[0].getAttribute('symbol');
		
		if(offfername.indexOf('HBO') != -1 || offfername.indexOf('Hbo') != -1)
		{
			//alert('This item is out of stock');
			//return;
		}
		
		if(!parseInt(add))
		{
			$(this).attr('add', 1);
			$(this).css('background-image', 'url(https://startgaming.net/wp-content/themes/StartGaming/theme/css/svg/btntrash.svg)');
			$(this).css('background-color', '#FFFFFF');
			$(this).css('border', '1px solid #E8E8E8');
			$(this).html('');
			var cartItems = $('.ss_right_new_info_mobile').children();
			for(var i = 0; i < cartItems.length; i ++)
			{
				if(cartItems[i].getAttribute('cartitemname') == offfername)
				{
					newItem = 1;
					
					break;
				}
			}
			
			if(!newItem)
			{
				$('.ss_right_new_info_mobile').append('<div class="ss_right_new_info-line" cartItemName = "' + offfername + '" count= "0" + price="' + price + '"  add="1">\
				<div class="ss_right_new_info-title">' + offfername + ' * 1</div>\
				<div class="ss_right_new_info-value"><span class="woocommerce-Price-amount amount"><bdi>' + price + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span></div>\
				</div>');
			}
			
			var cartItems = $('.ss_right_new_info_mobile').children();
			
			if(cartItems.length > 0)
			{
				for(var i = 0; i < cartItems.length; i ++)
				{
					if(cartItems[i].getAttribute('cartitemname') == offfername)
					{
						cartItems[i].getElementsByClassName('ss_right_new_info-title')[0].innerHTML = offfername + ' * ' + (parseInt(cartItems[i].getAttribute('count')) + 1);
						cartItems[i].setAttribute('count', parseInt(cartItems[i].getAttribute('count')) + 1);
						
						cartItems[i].getElementsByClassName('ss_right_new_info-value')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + (parseFloat(cartItems[i].getAttribute('price')) * parseInt(cartItems[i].getAttribute('count'))).toFixed(1) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>';
						
						var cartPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-price_mobile')[0].getAttribute('price')) + parseFloat(cartItems[i].getAttribute('price'));
						document.getElementsByClassName('ss_right_new_bottom-left-price_mobile')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + cartPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
						document.getElementsByClassName('ss_right_new_bottom-left-price_mobile')[0].setAttribute('price', cartPrice.toFixed(2));
						
						var oldPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].getAttribute('price')) + parseFloat(oldPriceLocal);
						document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + oldPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
						document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].setAttribute('price', oldPrice.toFixed(2));
						
						document.getElementsByClassName('ss_right_new_bottom-title_mobile')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>Save ' + (oldPrice - cartPrice).toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
						
						if((oldPrice - cartPrice) > 0)
						{
							document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].removeAttribute("hidden");
							document.getElementsByClassName('ss_right_new_bottom-title_mobile')[0].removeAttribute("hidden");
						}

						break;
					}
				}
			}
			
			$.ajax({
				type: 'POST',
				url: template.url_ajax,
				data: {
					action: 'ajax_fn',
					param: {
						action: 'add_to_cart_offer',
						offer_id: offer_id,
						quantity: 1,
					},
				},
				success: function(reply){					

				}
			});
		}
		else
		{
			$(this).attr('add', 0);
			$(this).css('background-image', 'url(https://startgaming.net/wp-content/themes/StartGaming/theme/css/svg/btncart.svg)');
			$(this).css('background-color', '#F9B944');
			$(this).css('border', '0px solid #E8E8E8');
			$(this).html('+');
			
			var cartItems = $('.ss_right_new_info_mobile').children();
			for(var i = 0; i < cartItems.length; i ++)
			{
				if(cartItems[i].getAttribute('cartitemname') == offfername)
				{
					var cartPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-price_mobile')[0].getAttribute('price')) - parseFloat(cartItems[i].getAttribute('price'));
					document.getElementsByClassName('ss_right_new_bottom-left-price_mobile')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + cartPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					document.getElementsByClassName('ss_right_new_bottom-left-price_mobile')[0].setAttribute('price', cartPrice.toFixed(2));
					
					var oldPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].getAttribute('price')) - parseFloat(oldPriceLocal);
					document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + oldPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].setAttribute('price', oldPrice.toFixed(2));
					
					document.getElementsByClassName('ss_right_new_bottom-title_mobile')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>Save ' + (oldPrice - cartPrice).toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					
					if((oldPrice - cartPrice) > 0)
					{
						document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].removeAttribute("hidden");
						document.getElementsByClassName('ss_right_new_bottom-title_mobile')[0].removeAttribute("hidden");
					}
					
					cartItems[i].remove();
					
					break;
				}
			}
			
			$.ajax({
				type: 'POST',
				url: template.url_ajax,
				data: {
					action: 'ajax_fn',
					param: {
						action: 'remove_cart',
						offer_id: offer_id,
					},
				},
				success: function(reply){					

				}
			});
		}
	});
	
	$('.js-quantity').bind("change keyup input", function(){
		var   $js_cart_product = $(this).parents('.js-cart-product')
		;
		if(this.value.match(/[^0-9]/g)){
			this.value = this.value.replace(/[^0-9]/g, '');
		}
		if(this.value == '' || this.value == 0) this.value = 1;
		
		//UpdateQuantityProduct($js_cart_product);
	});
	
	function UpdateQuantityProduct($product){
		$.ajax({
			type: 'POST',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'set_quantity',
					cart_item_key: $product.attr('cart_item_key'),
					quantity: $product.find('.js-quantity').val()
				},
			},
			success: function(reply){
				if($('body').hasClass('woocommerce-checkout')) window.location.reload();
				$('.js-total-price').html(reply);
			}
		});
	}
	
	
	$('.js-add-to-cart').click(function(){
		var   $js_product_card = $(this).parents('.js-product-card')
			, product_id =  $js_product_card.attr('product_id')
		;
		$.ajax({
			type: 'POST',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'add_to_cart',
					product_id: product_id,
					quantity: 1
				},
			},
			success: function(reply){
				//var is_referer = $.cookie('is_referer');
				//if(is_referer == 'pivigames') $('.glass.form-info-pivigames').addClass('open');
				//else window.location = '/checkout/';
				window.location = '/checkout/';
			}
		});
	});
	
	
	$('.js-buy-trader').click(function(){
		var   $js_product_card = $(this).parents('[trader_id]').eq(0)
			, product_id =  $js_product_card.attr('product_id')
			, trader_id =  $js_product_card.attr('trader_id')
			, quantity =  $js_product_card.find('.js-quantity').val() || 1
		;
		$.ajax({
			type: 'POST',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'buy_trader',
					product_id: product_id,
					trader_id: trader_id,
					quantity: quantity,
				},
			},
			success: function(reply){
				var is_referer = $.cookie('is_referer');
				if(is_referer == 'pivigames') $('.glass.form-info-pivigames').addClass('open');
				else window.location = '/checkout/';
			}
		});
	});
	
	$('.js-bay-offer').click(function(e){
		e.preventDefault();
		var   offer_id = $(this).attr('offer_id')
			, $cart_product = $(this).parents('.js-cart-product')
			, quantity = 1
			, offername = $(this).attr('offername')
		;
		
		//if(offername.indexOf('Netflix') != -1 || offername.indexOf('netflix') != -1)
		if(offername !== undefined)
		{
			if(offername.indexOf('HBO') != -1 || offername.indexOf('Hbo') != -1)
			{
				//alert('This item is out of stock');
				//return;
			}
		}
		
		if($cart_product.length){
			var $quantity = $cart_product.find('.js-quantity');
			if($quantity.length){
				quantity = $quantity.val();
			}
		}
		
		$.ajax({
			type: 'POST',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'add_to_cart_offer',
					offer_id: offer_id,
					quantity: quantity,
				},
			},
			success: function(reply){					
				window.location.href = '/checkout/';
				//console.log(reply);
			}
		});
	});
	
	$('.video_info_content-title').on('click', function(e) {
		$('.video_info_content').toggleClass('open');
	});
	
	$('.pcm_left_price-btn').click(function(e)
	{
		e.preventDefault();
		
		var proditembuttons = $('.pcm_left_price-btn');
		
		if(!parseInt($(proditembuttons[0]).attr('incart')))
		{
			var   offer_id = $(this).attr('offer_id')
				, $cart_product = $(this).parents('.js-cart-product')
				, quantity = 1
			;
			
			//if($('.pcm_left_top_right-name').html().indexOf('Netflix') != -1 || $('.pcm_left_top_right-name').html().indexOf('netflix') != -1)
			if($('.pcm_left_top_right-name').html().indexOf('HBO') != -1 || $('.pcm_left_top_right-name').html().indexOf('Hbo') != -1)
			{
				//alert('This item is out of stock'); //
				//return;
			}
			
			if($cart_product.length){
				var $quantity = $cart_product.find('.js-quantity');
				if($quantity.length){
					quantity = $quantity.val();
				}
			}
			
			$.ajax({
				type: 'POST',
				url: template.url_ajax,
				data: {
					action: 'ajax_fn',
					param: {
						action: 'add_to_cart_offer',
						offer_id: offer_id,
						quantity: quantity,
					},
				},
				success: function(reply){					
					window.location.href = '/checkout/';
				}
			});
		}
		else
		{
			var proditembutton = $('.pcm_left_price-btn');
			var cartItems = $('.ss_right_new_info').children();
			for(var i = 0; i < cartItems.length; i ++)
			{
				if(cartItems[i].getAttribute('offerid') == $(proditembutton[0]).attr('offer_id'))
				{
					var symbol = document.getElementsByClassName('ss_right_new_title')[0].getAttribute('symbol');
					var oldPriceLocal = cartItems[i].getAttribute('fakeprice');
					var count = parseInt(cartItems[i].getAttribute('count'));
					
					var cartPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-price')[0].getAttribute('price')) - parseFloat(cartItems[i].getAttribute('price')) * count;
					document.getElementsByClassName('ss_right_new_bottom-left-price')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + cartPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					document.getElementsByClassName('ss_right_new_bottom-left-price')[0].setAttribute('price', cartPrice.toFixed(2));
					
					var oldPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].getAttribute('price')) - parseFloat(oldPriceLocal);
					document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + oldPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].setAttribute('price', oldPrice.toFixed(2));
					
					document.getElementsByClassName('ss_right_new_bottom-title')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>Save ' + (oldPrice - cartPrice).toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					
					if((oldPrice - cartPrice) > 0)
					{
						document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].removeAttribute("hidden");
						document.getElementsByClassName('ss_right_new_bottom-title')[0].removeAttribute("hidden");
					}
					
					cartItems[i].remove();
					
					if(cartItems.length == 1)
					{
						document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].hidden = true;
						document.getElementsByClassName('ss_right_new_bottom-title')[0].hidden = true;
					}
					
					break;
				}
			}
			
			var proditembutton = $('.pcm_left_price-btn');
			var cartItems = $('.ss_right_new_info_mobile').children();
			for(var i = 0; i < cartItems.length; i ++)
			{
				if(cartItems[i].getAttribute('offerid') == $(proditembutton[0]).attr('offer_id'))
				{
					var symbol = document.getElementsByClassName('ss_right_new_title')[0].getAttribute('symbol');
					var oldPriceLocal = cartItems[i].getAttribute('offerid');
					var count = parseInt(cartItems[i].getAttribute('count'));
					
					var cartPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-price_mobile')[0].getAttribute('price')) - parseFloat(cartItems[i].getAttribute('price')) * count;
					document.getElementsByClassName('ss_right_new_bottom-left-price_mobile')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + cartPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					document.getElementsByClassName('ss_right_new_bottom-left-price_mobile')[0].setAttribute('price', cartPrice.toFixed(2));
					
					var oldPrice = parseFloat(document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].getAttribute('price')) - parseFloat(oldPriceLocal);
					document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>' + oldPrice.toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].setAttribute('price', oldPrice.toFixed(2));
					
					document.getElementsByClassName('ss_right_new_bottom-title_mobile')[0].innerHTML = '<span class="woocommerce-Price-amount amount"><bdi>Save ' + (oldPrice - cartPrice).toFixed(2) + '<span class="woocommerce-Price-currencySymbol">' + symbol + '</span></bdi></span>'
					
					if((oldPrice - cartPrice) > 0)
					{
						document.getElementsByClassName('ss_right_new_bottom-left-old-price_mobile')[0].removeAttribute("hidden");
						document.getElementsByClassName('ss_right_new_bottom-title_mobile')[0].removeAttribute("hidden");
					}
					
					cartItems[i].remove();
					
					if(cartItems.length == 1)
					{
						document.getElementsByClassName('ss_right_new_bottom-left-old-price')[0].hidden = true;
						document.getElementsByClassName('ss_right_new_bottom-title')[0].hidden = true;
					}
					
					break;
				}
			}
			
			var proditembutton = $('.pcm_left_price-btn');
			if(proditembutton.length > 0)
			{
				for(var i = 0; i < proditembutton.length; i ++)
				{
					if(parseInt($(proditembutton[i]).attr('incart')))
					{
						$(proditembutton[i]).attr('incart', 0);
						/*$(proditembutton[i]).css('background-image', 'url(https://startgaming.net/wp-content/themes/StartGaming/theme/css/svg/white-cart.svg)');
						$(proditembutton[i]).css('background-color', '#F9B944'); 
						$(proditembutton[i]).css('border', '1px solid #E8E8E8');
						$(proditembutton[i]).css('background-repeat', 'no-repeat');
						$(proditembutton[i]).css('background-position', 'center');
						$(proditembutton[i]).css('height', '44px');*/
						$(proditembutton[i]).html('buy');
						
						$(proditembutton[i]).css('background-image', 'url(https://startgaming.net/wp-content/themes/StartGaming/theme/css/svg/white-cart.svg)');
						$(proditembutton[i]).css('background-color', 'rgb(249, 185, 68)');
						$(proditembutton[i]).css('border', '1px solid rgb(232, 232, 232)');
						$(proditembutton[i]).css('background-repeat', 'no-repeat');
						$(proditembutton[i]).css('background-position', '20px center');
						$(proditembutton[i]).css('background-size', '20%');
						$(proditembutton[i]).css('height', '57px');
						$(proditembutton[i]).css('font-family', 'MontserratBold');
						$(proditembutton[i]).css('font-size', '20px');
						$(proditembutton[i]).css('text-transform', 'uppercase');
						$(proditembutton[i]).css('letter-spacing', '0.085em');
						$(proditembutton[i]).css('text-align', 'right');
						$(proditembutton[i]).css('padding', '15px 20px');
					}
				}
			}
			
			$.ajax({
				type: 'POST',
				url: template.url_ajax,
				data: {
					action: 'ajax_fn',
					param: {
						action: 'remove_cart',
						offer_id: $(proditembutton[0]).attr('offer_id'),
					},
				},
				success: function(reply){					

				}
			});
		}
	});
	
	$('.ss_right_new_bottom-right-btn').click(function(e){
		e.preventDefault();
		window.location.href = '/checkout/';
	});
	
	$('.ss_right_new_bottom-right-btn-all').click(function(e){
		e.preventDefault();
		window.location.href = '/checkout/';
	});
	
	$('.js-add-discount_kit').click(function(){
		var   product_id = $(this).attr('product_id')
			, $btn = $(this)
			, price = parseFloat($(this).attr('price'))
			, old_price = parseFloat($(this).attr('old_price'))
			, parent_product_id = $(this).attr('parent_product_id')
			, $sellersList = $(this).parents('.sellersList')
			, $discount_kit_cartbtn_price = $('.discount_kit_cartbtn').find('.card__left-price')
			, $discount_kit_cartbtn_oldprice = $('.discount_kit_cartbtn').find('.card__left-oldprice')
		;
		
		if($(this).parents('.sellersList').hasClass('to-cart')){
			$.ajax({
				type: 'POST',
				url: template.url_ajax,
				data: {
					action: 'ajax_fn',
					param: {
						action: 'remove_to_cart',
						product_id: product_id,
					},
				},
				success: function(reply){					
					//window.location.reload();
				}
			});
			
			$sellersList.removeClass('to-cart');
			$btn.html($btn.attr('text_add'));
			
			var temp_price = parseFloat($discount_kit_cartbtn_price.attr('price')) - price;
			$discount_kit_cartbtn_price.attr('price', temp_price);
			
			var temp_price = parseFloat($discount_kit_cartbtn_oldprice.attr('price')) - old_price;
			$discount_kit_cartbtn_oldprice.attr('price', temp_price);
			
			var $currencySymbol = $discount_kit_cartbtn_price.find('.woocommerce-Price-currencySymbol').clone();
			var $currencySymbol_old = $discount_kit_cartbtn_price.find('.woocommerce-Price-currencySymbol').clone();
			
			if(template.current_currency == 'RUB'){
				$discount_kit_cartbtn_price.html(number_format($discount_kit_cartbtn_price.attr('price'), 0, '.', ',')).prepend($currencySymbol);
				$discount_kit_cartbtn_oldprice.html(number_format($discount_kit_cartbtn_oldprice.attr('price'), 0, '.', ',')).prepend($currencySymbol_old);
			}
			else{
				$discount_kit_cartbtn_price.html(number_format($discount_kit_cartbtn_price.attr('price'), 6, '.', '')).append($currencySymbol);
				$discount_kit_cartbtn_oldprice.html(number_format($discount_kit_cartbtn_oldprice.attr('price'), 6, '.', '')).append($currencySymbol_old);
			}
		}
		else{
			$.ajax({
				type: 'POST',
				url: template.url_ajax,
				data: {
					action: 'ajax_fn',
					param: {
						action: 'add_to_cart_discount_kit',
						product_id: product_id,
						parent_product_id: parent_product_id,
						quantity: 1
					},
				},
				success: function(reply){
					//window.location.reload();
				}
			});
			
			$sellersList.addClass('to-cart');
			$btn.html($btn.attr('text_remove'));
			
			var temp_price = parseFloat($discount_kit_cartbtn_price.attr('price')) + price;
			$discount_kit_cartbtn_price.attr('price', temp_price);
			
			var temp_price = parseFloat($discount_kit_cartbtn_oldprice.attr('price')) + old_price;
			$discount_kit_cartbtn_oldprice.attr('price', temp_price);
			
			var $currencySymbol = $discount_kit_cartbtn_price.find('.woocommerce-Price-currencySymbol').clone();
			var $currencySymbol_old = $discount_kit_cartbtn_price.find('.woocommerce-Price-currencySymbol').clone();
			
			if(template.current_currency == 'RUB'){
				$discount_kit_cartbtn_price.html(number_format($discount_kit_cartbtn_price.attr('price'), 0, '.', ',')).prepend($currencySymbol);
				$discount_kit_cartbtn_oldprice.html(number_format($discount_kit_cartbtn_oldprice.attr('price'), 0, '.', ',')).prepend($currencySymbol_old);
			}
			else{
				$discount_kit_cartbtn_price.html(number_format($discount_kit_cartbtn_price.attr('price'), 2, '.', '')).append($currencySymbol);
				$discount_kit_cartbtn_oldprice.html(number_format($discount_kit_cartbtn_oldprice.attr('price'), 2, '.', '')).append($currencySymbol_old);
			}
		}
	});
	
	
	
	
	
	
	$('.card__right-bottom_description__more_btn').click(function(){
		$('.card__right-bottom_description__more').toggleClass('open');
	});
	
	$('.set-stars-rate').rating({
		fx: 'half',
        image: '/wp-content/themes/StartGaming/css/img/stars.png',
        loader: '/wp-content/themes/StartGaming/css/img/ajax-loader.gif',
        minimal: 0.5,
		click: function(val){
			$('#set-stars-rate-result').val(val);
		},
	});
	
	$('.woocommerce-form-login').submit(function(e){
		e.preventDefault();
		var $forms = $(this);
		$.ajax({
			type: 'POST',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'login',
					data: {
						user_login: $forms.find('[name=username]').val(),
						user_password: $forms.find('[name=password]').val(),
						remember: $forms.find('[name=rememberme]').prop('checked'),
					}
				},
			},
			success: function(reply){
				if(reply == 'ok'){
					window.location.reload();
				}
				else{
					$forms.find('input').addClass('error');
					$forms.find('.form-login__error').html(reply);
				}
			}
		});
	});
	$('.woocommerce-form-register').submit(function(e){
		e.preventDefault();
		var $forms = $(this);
		$.ajax({
			type: 'POST',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'register',
					data: {
						user_name: $forms.find('[name=username]').val(),
						user_email: $forms.find('[name=email]').val(),
						user_password: $forms.find('[name=password]').val(),
					}
				},
			},
			success: function(reply){
				if(reply == 'ok'){
					window.location.reload();
				}
				else{
					$forms.find('input').addClass('error');
					$forms.find('.form-register__error').html(reply);
				}
			}
		});
	});
	
	var   $form_push = $('.form-push.active')
		, uid = $form_push.attr('uid')
		, uid_cookie = $.cookie('form-push')
	;
	if($form_push.length && uid !== uid_cookie){
		var $img = $form_push.find('img').eq(0);
		$img.attr('src', $img.attr('async-src'));
		$form_push.addClass('open');
	}
	
	$('.glass').click(function(e){
		if($(e.target).hasClass('glass__close') || $(e.target).hasClass('glass')){
			$(this).removeClass('open');
			if($(this).hasClass('form-push')){
				var uid = $(this).attr('uid');
				$.cookie('form-push', uid, {expires: 7, path: '/'});
			}
		}
	});
	
	
	setTimeout(function(){
		var   $banner_container = $('.banner_container.active')
			, uid = $banner_container.attr('uid')
			, uid_cookie = $.cookie('banner-container')
		;
		if($banner_container.length){
			if(uid !== uid_cookie){
				$banner_container.addClass('open');
			}
			else{
				$banner_container.addClass('open close');
			}
			$('.banner_container__close').click(function(e){
				$('.banner_container').addClass('close');
				$.cookie('banner-container', $('.banner_container').attr('uid'), {expires: 7, path: '/'});
			});
			
			$('.banner_container__arrow').click(function(e){
				$('.banner_container').removeClass('close');
			});
		}
		
	}, 10000);
	
	var  $banner_container_2 = $('.banner_container_2.active');
	var uid_2 = $banner_container_2.attr('uid');
	var uid_cookie_2 = $.cookie('banner-container_2');
	
	if($banner_container_2.length){
		if(uid_2!== uid_cookie_2){
			Cookies.set('banner-container_2', uid_2);
		}
		else{
			$banner_container_2.remove();
		}
		
		/*$('.banner_container__close').click(function(e){
			$('.banner_container').addClass('close');
			$.cookie('banner-container', $('.banner_container').attr('uid'), {expires: 7, path: '/'});
		});
		
		$('.banner_container__arrow').click(function(e){
			$('.banner_container').removeClass('close');
		});*/
	}
	
	
	
	
	
	
})(jQuery);

(function($){
	
	$('.js-add-payment-transaction').click(function(e){
		e.preventDefault();
		var   $account = $('[name="your-account"]')
			, $summ = $('[name="your-summ"]')
			, error = false
		;
		$account.removeClass('error'); $summ.removeClass('error');
		if($account.val() == ''){ $account.addClass('error'); error = true; }
		if($summ.val() == ''){ $summ.addClass('error'); error = true; }
		
		if(!error){
			$.ajax({
				type: 'GET',
				url: template.url_ajax,
				data: {
					action: 'ajax_fn',
					param: {
						action: "add-payment-transaction",
						account: $account.val(),
						summ: $summ.val(),
						payment_type: $('[payment_type].active').attr('payment_type'),
					},
				},
				success: function(reply){
					//console.log(reply);
					window.location.reload();
				}
			});
		}
	});
	
	
	
	
	
	$('[name="your-summ"]').bind("change keyup input click", function(){
		if(this.value.match(/[^0-9.]/g)){
			this.value = this.value.replace(/[^0-9.]/g, '');
		}
		if(this.value > parseFloat($(this).attr('max'))) this.value = $(this).attr('max');
	});
	
	$('.show-referral-program-help').click(function(e){
		e.preventDefault();
		$('.referral-program-help').show();
		$('.referral-program-cabinet').hide();
	});
	$('.back-referral-program-cabinet').click(function(e){
		e.preventDefault();
		$('.referral-program-help').hide();
		$('.referral-program-cabinet').show();
	});
	
	$('.loginRP__MakingMoneyBlock').click(function(e){
		e.preventDefault();
		$('.loginRP__MakingMoneyBlock').removeClass('active');
		$(this).addClass('active');
		$('.loginRP__MakingMoneyBlock_tab').hide().eq($(this).index()).show();
	}).filter(':first').click();
	
	$('[payment_type]').click(function(e){
		e.preventDefault();
		$('[payment_type]').removeClass('active');
		$(this).addClass('active');
		$('.js-payment_type-label').text($(this).attr('payment_type_title'));
	}).filter(':first').click();
	
	
	
	$('.fv-share-block .contactsContainer__form-input').click(function(e){
		$(this).get(0).select();
		document.execCommand('copy');
	});
	$('.fv-refferaaallll-container-product .contactsContainer__form-input').click(function(e){
		$(this).get(0).select();
		document.execCommand('copy');
	});
	
	$('.js-invite-more-btn').click(function(e){
		e.preventDefault();
		$('.js-invite-more-block').toggle();
	});
	$('.js-earned-more-btn').click(function(e){
		e.preventDefault();
		$('.js-earned-more-block').toggle();
	});
	
	// $('.js-referral_key').change(function(){
		// $.ajax({
			// type: 'GET',
			// url: template.url_ajax,
			// data: {
				// action: 'ajax_fn',
				// param: {
					// action: "update-referral-key",
					// new_key: this.value,
					// old_key: $(this).attr('old_value'),
				// },
			// },
			// success: function(reply){
				// console.log(reply);
			// }
		// });
	// });
	// $('.js-referral_promocode').change(function(){
		// $.ajax({
			// type: 'GET',
			// url: template.url_ajax,
			// data: {
				// action: 'ajax_fn',
				// param: {
					// action: "update-referral-promocode",
					// new_key: this.value,
					// old_key: $(this).attr('old_value'),
				// },
			// },
			// success: function(reply){
				// console.log(reply);
			// }
		// });
	// });
	
	$('.referalFAQ__block').click(function(e){
		e.preventDefault();
		$(this).toggleClass('open');
	});
	
	
	
	
	$('.cr_slider').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: true,
		responsive: [
			{
				breakpoint: 1200,
				settings:{
					slidesToShow: 3
				}
			},
			{
				breakpoint: 1024,
				settings:{
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 640,
				settings:{
					slidesToShow: 1,
				}
			}
		]
	});
	
	$('.moreText').on('click', function() {
		$(this).toggleClass('open');
		$('.ss_left-content-text-container').toggleClass('full');
	});

	$('.mob_menu_btn').on('click', function() {
		//$('.mobile_menu').addClass('open');
	});

	$('.mob_menu_btn_close').on('click', function() {
		$('.mobile_menu').removeClass('open');
	});

	$('.ss_left-report').on('click', function(e){
		e.preventDefault();
		$('.js-glass-report').addClass('open');
	});
	
	$('.js-glass-report .popup_close').on('click', function(e){
		e.preventDefault();
		$('.js-glass-report').removeClass('open');
	});
	
	$('.js-glass-report form').on('submit', function(e){
		e.preventDefault();
		var that = $(this);
		setTimeout(function(){
			$('.js-glass-report .popup_line_text.successful').show();
			that[0].reset();
		}, 500);
	});
	
	$('.js-show-trader-more').on('click', function(e) {
		e.preventDefault();
		$(this).parents('.sc_products_block').toggleClass('show_more');
	});
	
	$('.orders_content-order').on('click', function() {
		$(this).find('.orders_content-order-inner').toggleClass('open');
	});
	
	$('.btn_list_messages').on('click', function() {
		$('.chats').addClass('open');
	});
	
	$('.btn_select_seller').on('click', function() {
		$('.chats').addClass('open');
	});

	$('.btn_back_to_messages').on('click', function() {
		$('.chats').removeClass('open');
		
		//getOrderMessages(current_seler_id);
	});

	$('.btn_list_bay').on('click', function() {
		$('.orders').addClass('open');
		
		//getOrderItemBySalerId(current_seler_id);
	});
	
	$('.btn_select_order').on('click', function() {
		$('.orders').addClass('open');
	});

	$('.btn_back_to_mes').on('click', function() {
		$('.orders').removeClass('open');
	});

	$('.close_chat').on('click', function() {
		$('.wrap_chat').removeClass('open');
 	 $('body').removeClass('wrap_chat_open');
	});

	$('.close_wrap_chat').on('click', function() {
		$('.wrap_chat').removeClass('open');
 	 $('body').removeClass('wrap_chat_open');
	});

	/*$('.header_btn.support').on('click', function(e) {
		e.preventDefault();
		$('.wrap_chat').addClass('open');
	});*/
	
})(jQuery);
	
	
(function($){
	
	if($('.js-roulette').length == 0) return;
	
    $.fn.removeClassWild = function(mask){
        return this.removeClass(function(index, cls){
            var re = mask.replace(/\*/g, '\\S+');
            return (cls.match(new RegExp('\\b' + re + '', 'g')) || []).join(' ');
        });
    };
	
	var   $roulette = $('.js-roulette')
		, $btn_start = $('.js-start-roulette')
		, $btn_get_prize = $('.js-get-prize')
		, $content_btns = $('.js-info-content-btns')
		, $content_prize = $('.js-info-content-prize')
	;
	
	$btn_start.click(function(){
		if($btn_start.hasClass('no-active')) return false;
		$btn_start.addClass('no-active');
		$.ajax({
			type: 'GET',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'start-roulette',
					data: {}
				},
			},
			success: function(reply){
				//console.log(reply);
				if(parseInt(reply) > 0){
					$roulette.removeClassWild('section*').addClass('section' + reply);
					$.ajax({
						type: 'GET',
						url: template.url_ajax,
						data: {
							action: 'ajax_fn',
							param: {
								action: 'get-result-roulette',
								data: {}
							},
						},
						success: function(reply){
							//console.log(reply);
							if(reply){
								$('.ruletka__info-imgpris').html('\
									<img class="prize_info__picture" src="'+ reply.picture +'">\
									<div class="prize_info__title">'+ reply.title +'</div>\
									<div class="prize_info__promo_code">\
										<div class="prize_info__promo_code-title">'+ reply.promo_code.title +'</div>\
										<div class="prize_info__promo_code-title">'+ reply.promo_code.code +'</div>\
									</div>\
								');
							}
							
							setTimeout(function(){
								$content_btns.removeClass('active');
								$content_prize.addClass('active');
								$('.ruletka__info, .wrapcontent').addClass('priz');
							}, 10000);
						}
					});
				}
				
				var curent_date = new Date(new Date().setDate(new Date().getDate() + 1) - 1000);
				$btn_start.countdown({
					until: curent_date,
					compact: true,
					description: '',
					onExpiry: function(){
						$btn_start.countdown('destroy').html($btn_start.attr('title')).removeClass('no-active');
					}
				});

			}
		});
	});
	
	$btn_get_prize.click(function(){
		$content_btns.addClass('active');
		$content_prize.removeClass('active');
		$('.ruletka__info, .wrapcontent').removeClass('priz');
		//$btn_start.countdown('destroy').html($btn_start.attr('title')).removeClass('no-active');
	});
	
	if($btn_start.hasClass('no-active')){
		var time_zone = time_zone_fn();

		$btn_start.countdown({
			until: new Date(new Date($btn_start.attr('lastdate')).getTime() - time_zone),
			compact: true,
			description: '',
			onExpiry: function(){
				$btn_start.countdown('destroy').html($btn_start.attr('title')).removeClass('no-active');
			}
		});
	}
	else{
		$btn_start.html($btn_start.attr('title'));
	}
	
	$('.test-random-roulette').click(function(){
		$.ajax({
			type: 'GET',
			url: template.url_ajax,
			data: {
				action: 'ajax_fn',
				param: {
					action: 'test-random-roulette',
					data: {
						count: 100
					}
				},
			},
			success: function(reply){
				console.log(reply);
			}
		});
	});
	
})(jQuery);

if(window.location.pathname == '/terms-of-service/')
{
	if(Cookies.get("country_code") == 'ES')
	{
		$('.catalog__content').html($('.catalog__content').html().replace('and Salatech Finance OÜ, a limited liability company incorporated and existing under the laws of the Republic of Estonia, legal entity code 16514913, contact email support@startgaming.net, domiciled at Harju maakond, Tallinn, Kesklinna linnaosa, Narva mnt 7-636, 10117, the Republic of Estonia (“StartGaming “)',''));
	}
}

if(document.getElementsByClassName("wc_payment_method payment_method_payop10")[0] != undefined)
{
  document.getElementsByClassName("wc_payment_method payment_method_payop10")[0].remove();
}

if(document.getElementsByClassName('woocommerce-form__input woocommerce-form__input-checkbox input-checkbox') != undefined)
{
  document.getElementsByClassName('woocommerce-form__input woocommerce-form__input-checkbox input-checkbox')[0].click();
}

jQuery(document.body).on('updated_checkout', function(){

   // document.getElementsByClassName('woocommerce-form__input woocommerce-form__input-checkbox input-checkbox')[0].click();
    
    document.getElementById("wc-stripe-cc-form").children[0].innerHTML = 'Visa or Mastercard (Powered by Stripe)<br><br><br>' + document.getElementById("wc-stripe-cc-form").children[0].innerHTML;
    
	$('.payment_method_payop').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
	
	$('.payment_method_payop3').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
	$('.payment_method_payop4').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
	$('.payment_method_payop5').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
	$('.payment_method_payop6').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
	$('.payment_method_payop7').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
	$('.payment_method_payop8').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
	$('.payment_method_payop9').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
	$('.payment_method_payop11').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
	$('.payment_method_enot').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
 
    $('.payment_method_paypalych').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
 
    $('.payment_method_unitpay').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
	
	$('.payment_method_coinbase').click(function()
	{
		document.getElementById("stripe-payment-data").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("stripe-payment-data").firstChild);
	});
 
	$('.payment_method_stripe').click(function()
	{
		document.getElementById("payment").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("payment").children[2]);
	});
     
    /*var product_names = document.getElementsByClassName("product-name");

    for(var i = 0; i < product_names.length; i ++)
    {
	    if(document.getElementsByClassName("product-name")[i].innerText.indexOf('Netflix') > -1)
	    {
		    var count = document.getElementsByClassName("product-name")[i].innerText.match(/× (.*)/)[1];
		
		    document.getElementsByClassName("product-name")[i].innerHTML = 'Suscripcion <strong class="product-quantity">× ' + count + '</strong>';
	    }
    }*/
	
	var paymentMethods = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children;
	for(var i = 0; i < paymentMethods.length; i ++)
	{
		if(paymentMethods[i].className != 'wc_payment_method payment_method_stripe' && paymentMethods[i].className != 'wc_payment_method payment_method_coinbase')
		{
			//paymentMethods[i].style.display = 'none';
		}
	}

	var product_names = document.getElementsByClassName("product-name");

    for(var i = 0; i < product_names.length; i ++)
    {
	    if(document.getElementsByClassName("product-name")[i].innerText.indexOf('StartGaming – Ofertas y Chollos de Juegos, Cuentas y Claves 80%') > -1)
	    {
		    var count = document.getElementsByClassName("product-name")[i].innerText.match(/× (.*)/)[1];
		
		    document.getElementsByClassName("product-name")[i].innerHTML = 'Wallet Topup <strong class="product-quantity">× ' + count + '</strong>';
	    }
    }
    
    document.getElementsByClassName("wc_payment_method payment_method_payop10")[0].remove();
	
	var country = parseInt($('.woocommerce-checkout-review-order').attr('country'));
	//var country = true;
	
	// Переставляем палпалыча на первое место
	/*if(country)
	{
		var payPalych = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].getElementsByClassName('wc_payment_method payment_method_paypalych')
		$( payPalych ).insertBefore(document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children[0]);
		
		$('[name="payment_method"]')[0].checked = true;
	}
	else
	{
		$('[name="payment_method"]')[0].checked = true;
	
		document.getElementById("payment").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("payment").children[2]);
	}*/
	if(country)
	{
		/*var paymentMethods = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children;
		paymentMethods.forEach(element => {
			if(element.className != 'wc_payment_method payment_method_paypalych' && element.className != 'wc_payment_method payment_method_coinbase')
			{
				element.style.display = 'none';
			}
		});*/
		
		var paymentMethods = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children;
		for(var i = 0; i < paymentMethods.length; i ++)
		{
			if(paymentMethods[i].className != 'wc_payment_method payment_method_paypalych' && paymentMethods[i].className != 'wc_payment_method payment_method_coinbase')
			{
				paymentMethods[i].style.display = 'none';
			}
		}
		
		var payMeth = $('[name="payment_method"]');
		for(var i = 0; i < payMeth.length; i ++)
		{
			if(payMeth[i].id == 'payment_method_paypalych')
			{
				$('[name="payment_method"]')[i].checked = true;
				break;
			}
		}
	}
	else
	{
		//Тут меняем отображение
		$('[name="payment_method"]')[2].checked = true; // 0 - paypalis 2- stripe
		for(var i = 0; i < paymentMethods.length; i ++)
		{
			/*if(paymentMethods[i].className != 'wc_payment_method payment_method_stripe' && paymentMethods[i].className != 'wc_payment_method payment_method_coinbase')
			{
				paymentMethods[i].style.display = 'none';
			}*/
			/*if(paymentMethods[i].className == 'wc_payment_method payment_method_stripe') //payment_method_paypalych
			{
				paymentMethods[i].style.display = 'none';
			}*/
			/*if(paymentMethods[i].className != 'wc_payment_method payment_method_paypalych' && paymentMethods[i].className != 'wc_payment_method payment_method_coinbase')
			{
				paymentMethods[i].style.display = 'none';
			}*/
		}
		//TUT STRIPE
		document.getElementById("payment").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("payment").children[2]);
		
		//var stripe = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].getElementsByClassName('wc_payment_method payment_method_stripe')
		//$( stripe ).insertBefore(document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children[0]);
		
		var paypalych = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].getElementsByClassName('wc_payment_method payment_method_paypalych')
		$( paypalych ).insertBefore(document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children[0]);
	}
	
	/*var paymentMethods = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children;
	paymentMethods.forEach(element => {
	if(element.className == 'wc_payment_method payment_method_stripe')
		{
			element.style.display = 'none';
		}
	});*/
	
	var paymentMethods = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children;
	for(var i = 0; i < paymentMethods.length; i ++)
	{//TUT STRIPE PAYOP
		if(paymentMethods[i].className != 'wc_payment_method payment_method_stripe' && paymentMethods[i].className != 'wc_payment_method payment_method_paypalych' && paymentMethods[i].className != 'wc_payment_method payment_method_coinbase')
		{
			paymentMethods[i].style.display = 'none';
		}
	}
});

var country = parseInt($('.woocommerce-checkout-review-order').attr('country'));
//var country = true;
if(country)
{
	/*var paymentMethods = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children;
	paymentMethods.forEach(element => {
		if(element.className != 'wc_payment_method payment_method_paypalych' && element.className != 'wc_payment_method payment_method_coinbase')
		{
			element.style.display = 'none';
		}
	});*/
	
	var paymentMethods = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children;
	for(var i = 0; i < paymentMethods.length; i ++)
	{
		if(paymentMethods[i].className != 'wc_payment_method payment_method_paypalych' && paymentMethods[i].className != 'wc_payment_method payment_method_coinbase')
		{
			paymentMethods[i].style.display = 'none';
		}
	}
	
	var payMeth = $('[name="payment_method"]');
	for(var i = 0; i < payMeth.length; i ++)
	{
		if(payMeth[i].id == 'payment_method_paypalych')
		{
			$('[name="payment_method"]')[i].checked = true;
			break;
		}
	}
}
else
{
	$('[name="payment_method"]')[0].checked = true; // 0 - paypalis

	//document.getElementById("payment").insertBefore(document.getElementById("wc-stripe-cc-form"), document.getElementById("payment").children[2]);
	
	//var stripe = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].getElementsByClassName('wc_payment_method payment_method_stripe')
	//$( stripe ).insertBefore(document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children[0]);
	//var paypalych = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].getElementsByClassName('wc_payment_method payment_method_paypalych')
	//$( paypalych ).insertBefore(document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children[0]);
}

var paymentMethods = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children;
paymentMethods.forEach(element => {
	if(element.className == 'wc_payment_method payment_method_stripe')
	{
		//element.style.display = 'none';
	}
});

var paymentMethods = document.getElementsByClassName('wc_payment_methods payment_methods methods')[0].children;
for(var i = 0; i < paymentMethods.length; i ++)
{
	if(paymentMethods[i].className != 'wc_payment_method payment_method_stripe' && paymentMethods[i].className != 'wc_payment_method payment_method_coinbase')
	{
		paymentMethods[i].style.display = 'none';
	}
}
