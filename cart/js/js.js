$('.cart-dropdown-wrapper').css('display', 'block')
updateCartTotalPrice()
const cartItemDeleteBtn = $('.cart-dropdown__delete-btn')
cartItemDeleteBtn.click(function (event){
    const cartItemKey = $(this).attr('cart_item_key')
    $('.cart-dropdown__product').each((function(){
        if ($(this).attr('cart_item_key') == cartItemKey){
            $(this).remove()
        }
    }))
    console.log(cartItemKey);
    updateCartTotalPrice()
})

const clearCartBtn = $('.cart-dropdown__clear')
clearCartBtn.click(()=>{

    $('.cart-dropdown__product').each((function(){
        console.log($(this).attr('cart_item_key'));
        $(this).remove()
    }))
    updateCartTotalPrice()
})



function updateCartTotalPrice(){
    const cartTotalPrice = $('.cart-dropdown__summ').find('bdi')
    let totalSum = 0
    $('.cart-dropdown__product').find('bdi').each(function(){
        totalSum += +$(this).text().replace("$", "");
    })
    cartTotalPrice.text(`${totalSum.toFixed(2)} $`)
}

const dropdown = $('.cart-dropdown-wrapper')


const cart = $('.header__cart')


cart.on( "mouseover", function() {
  dropdown.css('display', 'block')
} );

cart.on( "mouseleave", function() {
  dropdown.css('display', 'none')
} );

dropdown.on( "mouseleave", function() {
  dropdown.css('display', 'none')
} );


dropdown.on( "mouseover", function() {
  dropdown.css('display', 'block')
} );