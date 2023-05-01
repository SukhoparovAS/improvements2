var slider_init = false;

function ready_load_card()
{
	if(slider_init == false)
	{
		slider_init = true;
		
		jQuery.ajax({
			url: "/_fast_ajax.php",
			type: 'POST',
			dataType: 'text',
			
			data: {
				load: 5,
				ajmod: 1,
			},
			success: function(data)
			{
				if(document.getElementsByClassName('checkout-basket__container')[0] != undefined)
				{
					$('.checkout-basket__container').innerHTML = "";
					$('.checkout-basket__container').html(data);
				}
				else
				{
					$('.basket__container').innerHTML = "";
					$('.basket__container').html(data);
				}
			},
				
			error: function(data)
			{
				
			}
		});
	}
	
}

$( document ).ready(function()
{
	if(document.getElementsByClassName('checkout-basket__container')[0] != undefined || document.getElementsByClassName('basket__container')[0] != undefined)
	{
		ready_load_card();
	}
});