// Открыть модальное окно
document.getElementById("open-modal-btn1").addEventListener("click", function() {
    document.getElementById("my-modal").classList.add("open")
})

// Закрыть модальное окно при нажатии на Esc
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        document.getElementById('cancel-confirmation-modal').classList.add('open');
    }
});

// Закрыть модальное окно при клике вне его
document.querySelector("#my-modal .modal__box").addEventListener('click', event => {
    event._isClickWithInModal = true;
});
document.getElementById("my-modal").addEventListener('click', event => {
    if (event._isClickWithInModal) return;
    document.getElementById('cancel-confirmation-modal').classList.add('open');
});

// Дополнительное модальное окно

document.getElementById('cancel-btn').addEventListener('click', function () {
    document.getElementById('cancel-confirmation-modal').classList.add('open');
});

// Нажание на кнопку подтверждения отмены
document.getElementById('close-cancel-btn').addEventListener('click', function () {
    document.getElementById('cancel-confirmation-modal').classList.remove('open');
});

// Нажание на кнопку принятия отмены
document.getElementById('confirm-cancel-btn').addEventListener('click', function () {
    document.getElementById('cancel-confirmation-modal').classList.remove('open');
    document.getElementById("my-modal").classList.remove("open");
});


// Обработчик на кнопку "Просмотреть заявку"
document.getElementById('view-order-btn').addEventListener('click', function() {
    var orderForm = document.getElementById('order-form');
    var routeName = orderForm.elements['routeName'].value;
    var guideName = orderForm.elements['guideName'].value;
    var excursionDate = orderForm.elements['excursionDate'].value;
    var excursionTime = orderForm.elements['excursionTime'].value;
    // Нужно добавить другие данные

    // Нужно добавить текст
    var orderDetailsText = `
        <p><strong>Маршрут:</strong> ${routeName}</p>
        <p><strong>Гид:</strong> ${guideName}</p>
        <p><strong>Дата экскурсии:</strong> ${excursionDate}</p>
        <p><strong>Время начала:</strong> ${excursionTime}</p>
        <!-- Добавьте другие данные по мере необходимости -->
    `;

    document.getElementById('order-details').innerHTML = orderDetailsText;

    document.getElementById('view-order-modal').classList.add('open');
});

// Обработчик на кнопки "Закрыть" в модальном окне просмотра заявки
document.getElementById('close-view-order-btn').addEventListener('click', function() {
    document.getElementById('view-order-modal').classList.remove('open');
});


document.addEventListener('DOMContentLoaded', function () {
        const tableBody = document.getElementById('route-table-body');


        // Ваши переменные для элементов формы
        var excursionDurationSelect = document.getElementById('excursionDuration');
        var groupSizeInput = document.getElementById('groupSize');
        var discountCheckbox = document.getElementById('discountCheckbox');
        var souvenirCheckbox = document.getElementById('souvenirCheckbox');
        var totalCostInput = document.getElementById('totalCost');

        // Обработчики событий
        excursionDurationSelect.addEventListener('change', updateTotalCost);
        groupSizeInput.addEventListener('input', updateTotalCost);
        discountCheckbox.addEventListener('change', updateTotalCost);
        souvenirCheckbox.addEventListener('change', updateTotalCost);

        // Функция для обновления итоговой стоимости
        function updateTotalCost() {
            // Получение выбранных значений
            var duration = parseInt(excursionDurationSelect.value);
            var groupSize = parseInt(groupSizeInput.value);
            var baseCost = calculateBaseCost(duration, groupSize);

            // Применение скидки для школьников и студентов
            if (discountCheckbox.checked) {
                baseCost *= 0.85; // Уменьшение на 15%
            }

            // Добавление стоимости сувениров
            if (souvenirCheckbox.checked) {
                baseCost += groupSize * 500; // 500 рублей за каждого посетителя
            }

            // Отображение итоговой стоимости
            totalCostInput.value = baseCost.toFixed(2);
        }

        // Функция для расчета базовой стоимости
        function calculateBaseCost(duration, groupSize) {
            // Реализуйте свою логику расчета базовой стоимости
            // В этом примере просто умножаем длительность на количество человек в группе
            return duration * groupSize;
        }

    });