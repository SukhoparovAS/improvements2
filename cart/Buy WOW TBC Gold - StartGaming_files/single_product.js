var slider_init = false;

function ready_down_single()
{
	if(slider_init == false)
	{
		slider_init = true;
		
		jQuery.ajax({
			url: "/_fast_ajax.php",
			type: 'POST',
			dataType: 'text',
			
			data: {
				load: 4,
				ajmod: 1,
				product: $('div.hidden')[1].getAttribute("data-product"),
				content_code: $(this).attr('rel'),
			},
			success: function(data)
			{
				var show_form = document.getElementsByClassName('innerSlider__slider')[0];		
				
				show_form.innerHTML = "";
				
				show_form.insertAdjacentHTML('afterbegin', data);

				Init_Slider();	
			},
				
			error: function(data)
			{
				
			}
		});
	}
	
}

function get_price_conjuntos()
{
	if(document.getElementsByClassName("sellerCard__line separator") != undefined)
	{
		var elements = document.getElementsByClassName("sellerCard__line separator");
		
		var ids = [];
		
		for(var i = 0; i < elements.length; i ++)
		{
			ids.push(elements[i].children[1].getAttribute('product_id'));
		}
		
		if(ids)
		{
			jQuery.ajax({
				url: "/_fast_ajax.php",
				type: 'POST',
				dataType: 'text',
				
				data: {
					load: 27,
					ajmod: 1,
					products: ids,
				},
				success: function(data)
				{
					var result = JSON.parse(data);
					
					for(var i = 0; i < elements.length; i ++)
					{
						elements[i].getElementsByClassName("sellerCard__price notranslate")[0].innerHTML = result[i];
					}
				},
					
				error: function(data)
				{
					
				}
			});
		}
	}
}

function Init_Slider()
{
	$('.innerSlider__slider').not('.fv-refferaaallll').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		arrows: true,
		dots: false,
		autoplay: true,
		autoplaySpeed: 3000,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 4,
				}
			},
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
}

$( document ).ready(function()
{
	if(document.getElementsByClassName('innerSlider__slider')[0] != undefined && $('div.hidden')[1].getAttribute("data-product") != undefined)
	{
		ready_down_single();
		
		get_price_conjuntos();
	}
});