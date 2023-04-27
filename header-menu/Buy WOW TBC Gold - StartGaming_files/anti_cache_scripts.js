var document_load = false;

var initialize_chat = false;

var current_order, current_id;

var sending_mes = false;

var current_seler_id;

var current_seler_name;

var current_order_id;

var current_order_pedidio;

var current_order_product_id;

var current_order_multimedia;

var current_order_paid;

function get_card()
{
	jQuery.ajax({
		url: myajax.url,
		type: 'POST',
		dataType: 'text',
		
		data: {
			action  : 'get_card',
 		    ajmod: 1
		},
		success: function(card)
		{
			var content = document.getElementsByClassName("header__cart-value")[0];
			
			content.innerHTML = card;
		},
		error: function(card)
		{

		}
	});
}

function requestData()
{
	jQuery.ajax({
		url: "/_fast_ajax.php",
		type: 'POST',
		dataType: 'text',
		data: {
			load: 1,
			ajmod: 1,
 		    referer: document.referrer,
 		    disco: $('div.hidden').data('hidden_prducts'),
			content_code: 'product_sales'
		},
		success: function(data)
		{
			document_load = true;
			
			var res = JSON.parse(data);
			
			if(document.getElementsByClassName('hidden')[1])
			{
				if(document.getElementsByClassName('hidden')[1].getAttribute('data-product'))
				{
					get_single_product_price(document.getElementsByClassName('hidden')[1].getAttribute('data-product'));
				}
			}
			
			get_pgoods(res['contentUp']);
			
			get_down(res['contentDown']);
			
			get_card(res['cardUser']);
			
			get_user(res['user']);
		},
		error: function(data)
		{
			
		}
	});
}

function show_pgoods()
{
	var _pgoods = document.getElementsByClassName("topgoods__slider")[0];
		
	if(_pgoods != undefined)
	{
		_pgoods.innerHTML = "";
		
		for(var i = 0; i < 9; i ++)
		{
			_pgoods.insertAdjacentHTML('beforeend', '<a class="topgoods__slide-load"><img class="topgoods__slide-img-load"></a>');
		}
	}
}

function get_pgoods(data)
{	
	var slider = document.getElementsByClassName("topgoods__slider")[0];
	
	if(slider == undefined) return;
	
	slider.innerHTML = "";
	
	slider.insertAdjacentHTML('afterbegin', data);
	
	$('.topgoods__slider').slick({
		slidesToShow: 9,
		slidesToScroll: 1,
		arrows: true,
		dots: false,
		autoplay: false,
		autoplaySpeed: 3000,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 7,
				}
			},
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 5,
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 360,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	});

	$('.topgoods__btnpn.fprev').click(function(){
		$(".topgoods__slider").slick('slickPrev');
	});
	
	$('.topgoods__btnpn.fnext').click(function(){
		$(".topgoods__slider").slick('slickNext');
	});
	
	interval_pgoods();
}

function interval_pgoods()
{
	setInterval(function(){
		jQuery.ajax({
			url: "/_fast_ajax.php",
			type: 'POST',
			dataType: 'text',
			
			data: {
				load: 2,
				ajmod: 1,
				datatime: $('.topgoods__slider').find('[data-slick-index="0"]').attr('datetime')
			},
			success: function(data)
			{
				var reply = JSON.parse(data);
				
				var current_time = new Date(reply.current_time.replace(/ /i, 'T'));
				$.each($('.topgoods__slider')[0].slick.$slides, function(i, el){
					var temp_datetime = new Date($(el).attr('datetime').replace(/ /i, 'T'));
					var timeDiff = Math.abs(current_time.getTime() - temp_datetime.getTime())/1000;
					
					$(el).find('.topgoods__slide-title').html(getTimeStr(timeDiff));
				});
				
				if(reply.slide && reply.slide.length > 0){
					$.each(reply.slide, function(i, el){
						$('.topgoods__slider').slick('slickAdd', el, 0, 'addBefore');
					});
				}
			
			},
			error: function(data)
			{
				
			}
		});
	}, 30000);
}

function show_down()
{
	var _product = document.getElementsByClassName("goods__container active")[0];
	
	if(_product != undefined)
	{
		_product.innerHTML = "";
	
		for(var i = 0; i < 10; i ++)
		{
			_product.insertAdjacentHTML('beforeend', '<div class="goods__product-load"><div class="goods__product-info-load"><div class="goods__product-price-load"></div><div class="goods__product-discount-load"></div></div></div>');
		}
	}
}

function get_down(data)
{
	$('.goods__container-tabs .goods__container').html(data);
	
	$('.goods_btns .goods__filter').removeClass('active');
	
	$('.goods_btns .goods__filter').filter(':first').addClass('active');
	
	click_down();
}

function click_down()
{
	$('.goods_btns .goods__filter').click(function()
	{
		show_down();
		
		$('.goods_btns .goods__filter').removeClass('active');
		
		$(this).addClass('active');
			
		jQuery.ajax({
			url: "/_fast_ajax.php",
			type: 'POST',
			dataType: 'text',
			
			data: {
				load: 3,
				ajmod: 1,
				content_code: $(this).attr('rel'),
			},
			success: function(data)
			{
				$('.goods__container-tabs .goods__container').html(data);
			},
			error: function(data)
			{
				
			}
		});
	});
}

function get_card(data)
{
	var _card = document.getElementsByClassName("header__cart-value")[0];
	
	_card.innerHTML = data;
}

function get_user(data)
{
	var mainmenu = document.getElementsByClassName("header__mainmenu")[0];
			
	var user_load = document.getElementsByClassName("user-load-fv");
	
	if(user_load.length){
		//user_load[0].insertAdjacentHTML('beforeBegin', data);
		user_load[1].insertAdjacentHTML('beforeBegin', data);
	}
	//if(user_load[1] !== undefined) user_load[1].insertAdjacentHTML('beforeBegin', data);
	
	//console.log(user_load);
	
	//if(user_load.length) user_load.remove();

	// var user_load = document.getElementsByClassName("user-load")[0];
	
	// if(user_load !== undefined) user_load.remove();
	
	// if(mainmenu !== undefined) mainmenu.insertAdjacentHTML('beforeend', data);
	
	$('.btn_login').click(function(e){
	 e.preventDefault();
		$('.glass.form-login').addClass('open');
	});
	
	$('.btn_registro').click(function(e){
		e.preventDefault();
		$('.glass.form-register').addClass('open');
	});
	
	$('.header__userblock').on('click', function(){
		$('.header__userblock-fly').toggleClass('open');
	});
	
	$('.pedidos-open-popup').on('click', function(){
		showPedidos();
		getPedidos();
		$('.b-popup').toggleClass('open');
	});
	
	
	$('.close-pedidos').on('click', function(){
		$('.b-popup').toggleClass('open');
	});
	
	$('.header_btn.support').on('click', function(e) {
		if(jQuery('body').hasClass('logged-in'))
		{
			e.preventDefault();
			$('.wrap_chat').addClass('open');
		}
	});
	
	$('.support-btn').on('click', function(e) {
		if(jQuery('body').hasClass('logged-in'))
		{
			e.preventDefault();
			$('.wrap_chat').addClass('open');
			orders_chat_click();
		}
		else
		{
			$('.mob_menu_b').removeClass('open');
			$('.glass.form-login').addClass('open');
			$('.mob_menu_b-glass').removeClass('open');
		}
	});
	
	$('.mmb_list-support').on('click', function(e) {
		$('.mob_menu_b-glass').removeClass('open');
		$('.mob_menu_b').removeClass('open');
		$('.mobile_menu').removeClass('open');
		if(jQuery('body').hasClass('logged-in'))
		{
			e.preventDefault();
			$('.wrap_chat').addClass('open');
       		$('body').addClass('wrap_chat_open');
			
			console.log('#1 1');
			
			orders_chat_click();
			
			getOrderMessages(0);
		
			getOrderItemBySalerId(0);
		}
		else
		{
			$('.mob_menu_b').removeClass('open');
			$('.glass.form-login').addClass('open');
			$('.mob_menu_b-glass').removeClass('open');
		}
	});
	
	$('.mmb_list-menu a').on('click', function(e) {
		e.preventDefault();
		$('.mobile_menu').toggleClass('open');
		$('.mob_menu_b').removeClass('open');
		$('.wrap_chat').removeClass('open');
		$('.mob_menu_b-glass').removeClass('open');
	/*	$('.mob_menu_b-glass').toggleClass('open');
		$('.mob_menu_b').toggleClass('open');
		//$('.login_form').removeClass('open');
		
		$('.glass__close').click();
		$('.close_wrap_chat').click();*/
	});
	
	$('.login_form-close').on('click', function(e) {
		$('.mob_menu_b-glass').removeClass('open');
		$('.login_form').removeClass('open');
	});
	
	$('.login_form-top_login-btn').on('click', function(e) {
		$('.login_form-top_login-btn').removeClass('active');
		$(this).addClass('active');
		$('.login_form-tab').removeClass('open');
		$('.login_form-tab').eq($(this).index()).addClass('open');
	});
	
	$('.mmb_list-profile a').on('click', function(e) {
		$('.mobile_menu').removeClass('open');
 		$('body').removeClass('wrap_chat_open');
		e.preventDefault();
		if(!parseInt($(this).attr('loggin')))
		{
		//	$('.mob_menu_b-glass').addClass('open');
			$('.mob_menu_b').removeClass('open');
			$('.glass.form-login').addClass('open');
			$('.mob_menu_b-glass').removeClass('open');
			//$('.login_form').addClass('open');
		}
		else
		{
			$('.mob_menu_b-glass').toggleClass('open');
			$('.mob_menu_b').toggleClass('open');
			//$('.login_form').removeClass('open');
			
			$('.glass__close').click();
			$('.close_wrap_chat').click();
		}
	});
	
	$('.sc_products_left-btns').on('click', function(e) {
		if(jQuery('body').hasClass('logged-in'))
		{
			e.preventDefault();
			
			$('.wrap_chat').addClass('open');
			console.log('#1 2');
			orders_chat_click($(this).attr('trader_id'));
		}
		else
		{
			$('.glass.form-login').addClass('open');
		}
	});
	
	$('.seller_m_container-chat').on('click', function(e) {
		if(jQuery('body').hasClass('logged-in'))
		{
			e.preventDefault();
			
			$('.wrap_chat').addClass('open');
			console.log('#1 3');
			orders_chat_click($(this).attr('trader_id'));
		}
		else
		{
			$('.glass.form-login').addClass('open');
		}
	});
	
	$('.pct_chat').on('click', function(e) {
		if(jQuery('body').hasClass('logged-in'))
		{
			e.preventDefault();
			
			$('.wrap_chat').addClass('open');
			console.log('#1 4');
			orders_chat_click($(this).attr('trader_id'));
		}
		else
		{
			$('.glass.form-login').addClass('open');
		}
	});
	
	$('.sc_products_left-image_new').on('click', function(e) {
		if($(this).attr('trader_id') != undefined)
		{
			if(jQuery('body').hasClass('logged-in'))
			{
				e.preventDefault();
				
				$('.wrap_chat').addClass('open');
				console.log('#1 5');
				orders_chat_click($(this).attr('trader_id'));
			}
			else
			{
				$('.glass.form-login').addClass('open');
			}
		}
	});
	
	$('.send_seller_message').on('click', function(e) {
		if(jQuery('body').hasClass('logged-in'))
		{
			e.preventDefault();
			
			$('.wrap_chat').addClass('open');
			console.log('#1 6');
			orders_chat_click($(this).attr('trader_id'));
		}
		else
		{
			$('.glass.form-login').addClass('open');
		}
	});
	
	$('.header__mainmenu-item-support').on('click', function(){
		//var order = document.getElementsByClassName("order-number")[0].innerText;
		
	//	if(order)
		//{
		if(!jQuery('body').hasClass('logged-in'))
		{
			$('.glass.form-login').addClass('open');
		}
		else
		{
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
			
			//e.preventDefault();
				$('.wrap_chat').addClass('open');
			console.log('#1 7');
			orders_chat_click();
			
			/*var ticket = document.getElementsByClassName("custom-popup-chat-messages")[0];
	
			ticket.innerHTML = "\
			<div class='custom-popup-chat-messages-msg'>\
				<div class = 'custom-popup-chat-messages-msg-admin-ico'>\
				</div>\
				<div class = 'custom-popup-chat-messages-msg-admin-name'>Moderador</div>\
				<div class = 'custom-popup-chat-messages-msg-time'>\
				</div>\
				<div class = 'custom-popup-chat-messages-msg-text-pole'>\
					<div class = 'custom-popup-chat-messages-msg-text-text'>Seleccione el producto sobre el que tiene una pregunta</div>\
				</div>\
			</div>";*/
		
			//$('.custom-popup').toggleClass('open');
		}
		
		//}
	});
	
	if(window.location.href == "https://startgaming.net/?support=true")
	{
		if(!jQuery('.header__userblock')[0])
		{
 	console.log('#1 2');
			$('.glass.form-login').addClass('open');
		}
		else
		{
 	        $('.wrap_chat').addClass('open');
  	       console.log('#1 8');
			orders_chat_click();
		}
	}
	
	$('.custom-popup-close').on('click', function(){
		$('.custom-popup').toggleClass('open');
		current_order = 0;
		current_id = 0;
	});
}

requestData();

$( document ).ready(function()
{

	//setInterval(RegistreTextarea, 100);
	
	//setInterval(CheckOrderMessage, 30000);
	
	if(document_load == false)
	{
		show_pgoods();
	
		show_down();
	}
	
	
});

function CheckOrderMessage()
{
	if(current_seler_id >= 0 && $('.problem_item')[0] == undefined)
	{
		getOrderMessagesInterval(current_seler_id);
	}
}

function orders_chat_click(target_seller = 0)
{
	if(!initialize_chat)
	{
		$('.chats_users').html('<div class="chats_users_load"></div><div class="chats_users_load"></div><div class="chats_users_load"></div>');

		getOrderData(target_seller);
		
		$('.messages_btn-send').on('click', function(e) {
			
			if(current_order_multimedia == 1)
			{
				if(((Date.now()/1000)-current_order_paid)/86400 > 365)
				{
					sendMessageToUser('Buenas, gracias por contactarnos! Lamentablemente ha pasado mas de 1 año, desde que usted ha realizado la compra de la suscripcion anual. Para poder contactarnos de nuevo, tiene que renovar su suscripcion anual para esta plataforma. Un saludo!', 0);
					
					return true;
				}
			}
			
			SendMessageFromUser($('.messages_message')[0].value);

		});
		
		initialize_chat = true;
	}
}

function getOrderData(target_seller)
{
	$('.custom-popup-products-list').html('<div class="chat_ticket_product_item_load"></div><div class="chat_ticket_product_item_load"></div><div class="chat_ticket_product_item_load"></div>');
	
	jQuery.ajax({
		url: "/_fast_ajax.php",
		type: 'POST',
		dataType: 'text',
		data: {
			load: 20,
			ajmod: 1,
			target_seller: target_seller,
		},
		success: function(data)
		{	
			$('.chats_users').html(data);
			
			$('.chats_info-value').html($('.chats_users').children().length);

			$('.chats_user').click(function(){
				
				if($(this).attr('id') != undefined)
				{
					current_seler_id = $(this).attr('id');
				
					current_seler_name = $(this).attr('name');
					
					var sellers = $('.chats_users').children();
                    
                    $('.btn_select_seller').addClass('selected');
                    
                    $('.btn_select_order').removeClass('selected');
                    
                    $('.btn_back_to_messages').click();
                    
					for(var i = 0; i < sellers.length; i ++)
					{
						if($(sellers[i]).attr('id') == current_seler_id || $(sellers[i]).attr('name') == current_seler_name)
						{
							$(sellers[i]).css('background-color', '#444953');
							
							getOrderMessages($(sellers[i]).attr('id'));
							
							getOrderItemBySalerId($(sellers[i]).attr('id'));
							
							$('.messages_top-name').html($(sellers[i]).attr('name'));
							
							$(".main_chat_support_avatar");
							
							document.getElementById("main_chat_support_avatar").src = document.getElementById('chat_support_avatar_' + $(sellers[i]).attr('id')).src;
						}
						else
						{
							$(sellers[i]).css("background-color", "");
						}	
					}
				}
			});
			
			var click_seller = 0;
			
			var sellers = $('.chats_users').children();
			
			for(var i = 0; i < sellers.length; i ++)
			{
				if($(sellers[i]).attr('target_seller') == 1)
				{	
					$('.chats_users').children()[i].click();
					
					click_seller = 1;
					
					break;
				}
			}
			
			if(click_seller == 0)
			{
				$('.chats_users').children()[0].click();
			}
			
 	        //$('.chats_users').children()[0].click();	
 		
			/*$('.chats_users').html(data);

			$('.chats_user').click(function(){
				if($(this).attr('chec') === undefined || false == $(this).attr('chec'))
				{
					$(this).attr('chec', true);
					$(this).css('background-color', '#444953');

					getOrderMessages($(this).attr('id'));
					
					getOrderItemBySalerName($(this).attr('name'));
				}
				else
				{
					$(this).attr('chec', false);
					$(this).css('background', 'transparent');
				}
			});*/
			
			/*$('.custom-popup-products-list').html(data);
			
			$('.chat_ticket_product_item').click(function()
			{
				var products = $('.chat_ticket_product_item');
				
				for(var i = 0; i < products.length; i++)
				{
					products[i].style.border = "0px double black";
				}
				
				this.style.border = "1px double black";
				
				this.style.borderColor = "#95D1FF";
				
				current_order = $(this).attr('order');
				
				current_id = $(this).attr('id');
				
				$('.custom-popup-chat-messages').html("Loading...");
				
				getOrderMessages($(this).attr('order'), $(this).attr('id'));
			
			});
			
			$('.chat_ticket_product_item-product-info-button').on('click', function()
			{
				var item = $(this).parent()[0].getElementsByClassName("chat_ticket_product_item-product-info")[0];
				
				if (item.style.display == 'none')
				{
					item.style.display = "block";
				}
				else
				{
					item.style.display = "none";
				}
			});*/
		},
		error: function(data)
		{
			
		}
	});
}

function getOrderMessages(saler)
{	
	jQuery.ajax({
		url: "/_fast_ajax.php",
		type: 'POST',
		dataType: 'text',
		data: {
			load: 21,
			ajmod: 1,
			saler: saler,
			
		},
		success: function(data)
		{
console.log(saler);			
		console.log(data);
			$('.messages_content-inner').html(data);
			
			var messages = $('.messages_content-inner').children();

			for(var i = 0; i < messages.length; i ++)
			{
				if($(messages[i]).attr('confirm_accounts') == 1)
				{
					//$('.messages_content-inner').append('<a href="#" class="btn-confirm-order">Confirm Receipt</a>');
					
					break;
				}
			}
			
			var scrolls = document.getElementsByClassName("messages_content")[0];
			scrolls.scrollTop = scrolls.scrollHeight;
			
			/*$('.btn-confirm-order').click(function(){
				$('.btn-confirm-order').remove();
				jQuery.ajax({
				url: "/_fast_ajax.php",
				type: 'POST',
				dataType: 'text',
				data: {
					load: 29,
					ajmod: 1,
					saler: current_seler_id,
					
				},
				success: function(data)
				{	
					getOrderMessages(current_seler_id);
					
					var scrolls = document.getElementsByClassName("messages_content")[0];
					scrolls.scrollTop = scrolls.scrollHeight;
				},
				error: function(data)
				{
					
				}
			});
			});*/
		},
		error: function(data)
		{
			
		}
	});
}

function getOrderMessagesInterval(saler)
{
	jQuery.ajax({
		url: "/_fast_ajax.php",
		type: 'POST',
		dataType: 'text',
		data: {
			load: 21,
			ajmod: 1,
			saler: saler,
			
		},
		success: function(data)
		{	
			$('.messages_content-inner').html(data); //messages_content-inner
			
			var messages = $('.messages_content-inner').children();

			for(var i = 0; i < messages.length; i ++)
			{
				if($(messages[i]).attr('confirm_accounts') == 1)
				{
					//$('.messages_content-inner').append('<a href="#" class="btn-confirm-order">Confirm Receipt</a>');
					
					break;
				}
			}
			
			var scrolls = document.getElementsByClassName("messages_content")[0];
			scrolls.scrollTop = scrolls.scrollHeight;
			
			/*$('.btn-confirm-order').click(function(){
				$('.btn-confirm-order').remove();
				jQuery.ajax({
				url: "/_fast_ajax.php",
				type: 'POST',
				dataType: 'text',
				data: {
					load: 29,
					ajmod: 1,
					saler: current_seler_id,
					
				},
				success: function(data)
				{	
					getOrderMessages(current_seler_id);
					
					var scrolls = document.getElementsByClassName("messages_content")[0];
					scrolls.scrollTop = scrolls.scrollHeight;
				},
				error: function(data)
				{
					
				}
			});
			});*/
		},
		error: function(data)
		{
			
		}
	});
}

function getOrderItemBySalerId(saler_id)
{
	$('.orders_content').html('<div class="orders_content-order_load"></div><div class="orders_content-order_load"></div><div class="orders_content-order_load"></div>');
	
	current_seler_name = 0;

	current_order_id = 0;

   current_order_pedidio = 0;

   current_order_product_id = 0;

	jQuery.ajax({
		url: "/_fast_ajax.php",
		type: 'POST',
		dataType: 'text',
		data: {
			load: 28,
			ajmod: 1,
			saler_id: saler_id,
			
		},
		success: function(data)
		{	
			//console.log('getOrderItemBySalerId' + saler_id);
			//console.log(data);
			$('.orders_content').html(data);
			
			$('.orders_info-value').html($('.orders_content').children().length);

			$('.orders_content-order').click(function(){
 		
  	            $('.btn_select_order').addClass('selected');
   	           
    	        $('.btn_back_to_mes').click();
				
				$('.problem_container').remove();
				
				current_order_id = $(this).attr('id');
				
				current_order_pedidio = $(this).attr('pedidio');
				
				current_order_product_id = $(this).attr('product_id');
				
				current_order_multimedia = $(this).attr('multimedia');

				current_order_paid = $(this).attr('paid');
				
				var orders = $('.orders_content').children();

				for(var i = 0; i < orders.length; i ++)
				{
					if($(orders[i]).attr('id') == current_order_id)
					{
						$(orders[i]).css('background-color', '#b0bacd');
					}
					else
					{
						$(orders[i]).css("background-color", "#E3EAF1");
					}	
				}
				
				if($(this).attr('sender') == 0 && $('.problem_item')[0] == undefined)
				{
					//$(this).attr('sender') = 1;
					
					$( ".messages_content-inner" ).append( '<div class="problem_container">\
						<div class="problem_title">Choose the problem:</div>\
						<ul class="problem_list">\
							<li class="problem_item" problem_item_id="1">\
								<a href="#" class="problem_link">Product problem</a>\
							</li>\
							<li class="problem_item" problem_item_id="2">\
								<a href="#" class="problem_link">Product not received</a>\
							</li>\
							<li class="problem_item" problem_item_id="3">\
								<a href="#" class="problem_link">Other</a>\
							</li>\
							<li class="problem_item" problem_item_id="4">\
								<a href="#" class="problem_link">Payment failure</a>\
							</li>\
						</ul>\
					</div>' );
					
					$('.problem_item').click(function(){
						switch($(this).attr('problem_item_id'))
						{
							case '1':
							{
								SendMessageFromUser('Product problem');
								
								getOrderMessages(current_seler_id);
								
								$(this).attr('sender', 1);
								
								break;
							}
							case '2':
							{
								SendMessageFromUser('Product not received');
								
								getOrderMessages(current_seler_id);
								
								$(this).attr('sender', 1);
								
								break;
							}
							case '3':
							{
								SendMessageFromUser('Other');
								
								getOrderMessages(current_seler_id);
								
								$(this).attr('sender', 1);
								
								break;
							}
							case '4':
							{
								SendMessageFromUser('Payment failure');
								
								getOrderMessages(current_seler_id);
								
								$(this).attr('sender', 1);
								
								break;
							}
						}
					});
					
					var scrolls = document.getElementsByClassName("messages_content")[0];
					scrolls.scrollTop = scrolls.scrollHeight;
					
					var orders = $('.orders_content').children();

					for(var i = 0; i < orders.length; i ++)
					{
						if($(orders[i]).attr('id') == current_order_id)
						{
							$(orders[i]).attr('sender', 1);
						}	
					}
				}
			});
		},
		error: function(data)
		{
			
		}
	});
}

function sendMessageToUser(_text, who = 0)
{
	var user_or_admin;
	
	if(who)
	{
		$('.messages_content-inner').append("\<div class='messages_ask'>\
			<div class='messages_ask_user'><img src='" + document.getElementById("main_chat_user_avatar").src  + "'></div>\
			<div class='messages_ask_line'>\
				<div class='messages_ask_line-info'>\
					<div class='messages_ask_line-info_mail'>" + $('.chats_info-mail')[0].innerHTML + "</div>\
				</div>\
				<div class='messages_ask_line-message'>" + _text + "</div>\
			</div>\
		</div>");
	}
	else
	{
		$('.messages_content-inner').append("\<div class='messages_answer'>\
		<div class='messages_answer_line'>\
		<div class='messages_answer_line-info'>\
		<div class='messages_answer_line-info_mail'>" +  $('.messages_top-name')[0].innerHTML + "</div>\
		</div>\
		<div class='messages_answer_line-message'>" + _text + "</div>\
		</div>\
		<div class='messages_answer_user'>\
		<img src='" + document.getElementById("main_chat_support_avatar").src + "'>\
		</div>\
		</div>");
	}
	
	var scrolls = document.getElementsByClassName("messages_content")[0];
	scrolls.scrollTop = scrolls.scrollHeight;
}

function clickButton(object)
{
	var product = 0;
	
	var products = $('.chat_ticket_product_item');
				
	for(var i = 0; i < products.length; i++)
	{
		if(products[i].style.border == "1px double rgb(149, 209, 255)")
		{
			product = 1;
			
			break;
		}
	}
	
	if(product > 0)
	{			
		switch(object.className)
		{
			case "custom-popup-chat-chatbox-button_1":
			{
				SendMessageFromUser("No funciona el producto");
				
				break;
			}
			case "custom-popup-chat-chatbox-button_2":
			{
				SendMessageFromUser("No me ha llegado el producto");
				
				break;
			}
			case "custom-popup-chat-chatbox-button_3":
			{
				SendMessageFromUser("Fallo del pago");
				
				break;
			}
			case "custom-popup-chat-chatbox-button_4":
			{
				SendMessageFromUser("Otro problema");
				
				break;
			}
		}
	}
	else
	{
		sendMessageToUser("Seleccione el producto sobre el que tiene una pregunta");
	}
}

function SendMessageFromUser(_text)
{
	var sending = 0;
	
	if(_text)
	{
		if(_text.length < 5 || _text.length > 3000)
		{
			sendMessageToUser("El mensaje puede contener de 5 a 3000 caracteres");
		}
		else
		{					
			if(current_order_pedidio && current_order_id && current_order_product_id && current_seler_id && !sending_mes)
			{
				sendMessageToUser(_text, 1);
			
				sending_mes = true;
				
				$('.messages_message')[0].value = "";
				
				jQuery.ajax({
					url: "/_fast_ajax.php",
					type: 'POST',
					dataType: 'text',
					data: {
						load: 22,
						ajmod: 1,
						order: current_order_pedidio,//pedidio
						id: current_order_id,//ид заказа
						product_id: current_order_product_id,//product_id
						saler: current_seler_id, // Продавец
						text_message: _text
					},
					success: function(data)
					{	
 				        if(data)
						{
							sendMessageToUser('Buenas, gracias por contactarnos! Lamentablemente ha pasado mas de 1 año, desde que usted ha realizado la compra de la suscripcion anual. Para poder contactarnos de nuevo, tiene que renovar su suscripcion anual para esta plataforma. Un saludo!', 0);
						}
						sending_mes = false;
					},
					error: function(data)
					{
						sending_mes = false;
					}
				});
			}
			else
			{
				sendMessageToUser("No has seleccionado un producto");
			}
		}	
	}
	else
	{
		sendMessageToUser("Por favor ingrese su mensaje")
	}
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

function RegistreTextarea()
{
	jQuery("textarea").each(function () {
	  this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
	
	  this.style.height = "auto";
	  this.style.height = (this.scrollHeight) + "px";
	});
}

function nl2br (str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function get_single_product_price(id)
{
	jQuery.ajax({
		url: "/_fast_ajax.php",
		type: 'POST',
		dataType: 'text',
		data: {
			load: 26,
			ajmod: 1,
			id: id
		},
		success: function(data)
		{
			var price = JSON.parse(data);
			if(document.getElementsByClassName("ss_right_bottom-left-price").length)
				document.getElementsByClassName("ss_right_bottom-left-price")[0].innerHTML = price.get_sale_price;
			if(document.getElementsByClassName("ss_right_bottom-left-old-price").length)
				document.getElementsByClassName("ss_right_bottom-left-old-price")[0].innerHTML = price.get_regular_price;
			
			if(document.getElementsByClassName("card__left-price").length > 1)
			{
				document.getElementsByClassName("ss_right_bottom-left-price")[1].innerHTML = price.get_sale_price;
			
				document.getElementsByClassName("ss_right_bottom-left-old-price")[1].innerHTML = price.get_regular_price;
			}
		},
		error: function(data)
		{
		}
			
	});
}

function ready()
{
    if($(".ss_left-top")[0] != undefined)
	{
		if(window.innerWidth < 1023)
		{
			$(".ss_left-top").appendTo(".single_seller");
			$(".single-product-trader-video").appendTo(".single_seller");
		}
	}
 
    $('.description_slider').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: true,
		responsive: [
			{
				breakpoint: 1201,
				settings:{
					slidesToShow: 3
				}
			},
			{
				breakpoint: 1025,
				settings:{
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 900,
				settings:{
					slidesToShow: 1,
				}
			}
		]
	});
	
	var removeMessaje = $('.woocommerce-message');

	if(removeMessaje.length > 0)
	{
		for(var i = 0; i < removeMessaje.length; i ++)
		{
			//removeMessaje[i].remove();
		}
	}
}

document.addEventListener("DOMContentLoaded", ready);
