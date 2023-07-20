const discountPush = $('.discount-push')
const activateBtn = discountPush.find('.discount-push__btn')
const timer2 = $('.discount-push-timer')
const discountText = $('.discount-push__text')
discountPush.removeClass('hidden')
let startTime = 10 * 60 * 60 //время обратного отсчета в время в секундах
let activateTime = Cookies.get('saler_timer');
let serverTime = document.getElementById("server_time").innerHTML;

if (activateTime){
    startTime  = startTime -  (serverTime - activateTime)
}



function startTimer1() {
    var x = setInterval(function () {

        // Получаем текущее время
        var now = new Date().getTime();

        // Вычисляем время, оставшееся до конечной даты
        var distance = countDownDate - now;
        if (distance > 0) {
             // Вычисляем часы, минуты и секунды
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Обновляем отображение таймера
            timer2.find('.d-timer-hours').text(hours < 10 ? "0" + hours : hours)
            timer2.find(".d-timer-minutes").text(minutes < 10 ? "0" + minutes : minutes)
            timer2.find(".d-timer-seconds").text(seconds < 10 ? "0" + seconds : seconds)
        } else {
            clearInterval(x)
        }
       
    }, 1000)
}

function activateDiscount() {
    discountPush.addClass('discount-push_activate')
    discountText.text('discount activated')
    timer2.removeClass('hidden')
    startTimer1()
}
/* function diactivateDiscount(){
    discountPush.removeClass('discount-push_activate')
    discountText.text('discount')
    timer2.addClass('hidden')
} */

// Устанавливаем время обратного отсчета в микросекундах 
var countDownDate = new Date().getTime() + (startTime * 1000);
if (activateTime && startTime > 0){
    countDownDate = new Date().getTime() + (startTime * 1000);
    activateDiscount()
} else {
    startTime = 10 * 60 * 60
    countDownDate = new Date().getTime() + (startTime * 1000);
}

activateBtn.click(()=>{
    activateDiscount()
    //твоя функция
})