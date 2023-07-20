function applySale()
{
  Cookies.set('saler_timer', document.getElementById("server_time").innerHTML);
  
  const a = $('.cart-new-wrap').find('bdi')
  a.each(el => {
    let temp = $(a[el]).text()
    let currency = '$'
    if (temp.includes('€')){
        currency = '€'
    }
    temp = temp.replace('$', '')
    temp = temp.replace('€', '')
    temp = temp.replace(',', '.')
    temp = +temp * 0.9
    let displayPrice = ''
    if (currency == '€'){
        displayPrice = `${currency} ${temp.toFixed(2)}`
    } else {
        displayPrice = `${temp.toFixed(2)} ${currency}`
    }
    if(!$(a[el]).parent().parent().hasClass('pcm_left_price-v-old'))
    $(a[el]).text(displayPrice)
  })
  
  const x = $('.js-products-list').find('bdi')
  x.each(el => {
    let currency = '$'
    if (temp.includes('€')){
        currency = '€'
    }
    let temp = $(x[el]).text()
    temp = temp.replace('$', '')
    temp = temp.replace('€', '')
    temp = temp.replace(',', '.')
    temp = +temp * 0.9
    let displayPrice = ''
    if (currency == '€'){
        displayPrice = `${currency} ${temp.toFixed(2)}`
    } else {
        displayPrice = `${temp.toFixed(2)} ${currency}`
    }
    $(x[el]).text(displayPrice)
  })

  const b = $('.js-kotirovka')
  b.each(el => {
    $(b[el]).attr('price', $(b[el]).attr('price') * 0.9)
  })
  
  updateCard();
}