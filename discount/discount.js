const discountPush = $('.discount-push')
const activateBtn = discountPush.find('.discount-push__btn')
const timer = $('.discount-push-timer')
const discountText = $('.discount-push__text')

const startTime = 10 //время обратного отсчета в время в часах

// Устанавливаем время обратного отсчета в микросекундах 
var countDownDate = new Date().getTime() + (startTime * 60 * 60 * 1000);

function startTimer() {
    var x = setInterval(function () {

        // Получаем текущее время
        var now = new Date().getTime();

        // Вычисляем время, оставшееся до конечной даты
        var distance = countDownDate - now;

        // Вычисляем часы, минуты и секунды
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Обновляем отображение таймера
        $(".timer-hours").text(hours < 10 ? "0" + hours : hours)
        $(".timer-minutes").text(minutes < 10 ? "0" + minutes : minutes)
        $(".timer-seconds").text(seconds < 10 ? "0" + seconds : seconds)
    }, 1000)
}

function activateDiscount() {
    discountPush.addClass('discount-push_activate')
    discountText.text('discount activated')
    timer.removeClass('hidden')
    startTimer()
}


activateBtn.click(activateDiscount)