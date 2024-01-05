// d01e7184-0896-49ea-986a-8320b70192fe


// Функция для получения данных с API
async function fetchData() {
    try {
        const response = await fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=d01e7184-0896-49ea-986a-8320b70192fe');

        if (!response.ok) {
            throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
        }

        data = await response.json();
        return data
    } catch (error) {
        console.error('Ошибка при получении данных:', error.message);
    }
}

async function routeTable() {
    const postsData = await fetchData();
    let currentPage = 0;
    let rows = 10;
  
    // Функция для заполнения таблицы маршрутов
    function fillRouteTable(arrData, rowPerPage, page) {
        const tableBody = document.getElementById('route-table-body');
        
        // Очищаем текущее содержимое таблицы
        tableBody.innerHTML = '';

        const start = rowPerPage * (page);
        const end = start + rowPerPage;
        const paginatedData = arrData.slice(start, end);

        
        paginatedData.forEach((route) => {
            // Добавляем строки с данными маршрутов
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const descriptionCell = document.createElement('td');
            const mainObjectsCell = document.createElement('td');
            const chooseButtonCell = document.createElement('td');
            const chooseButton = document.createElement('button');

            // Заполняем ячейки данными маршрута
            nameCell.textContent = route.name;
            descriptionCell.textContent = route.description;
            mainObjectsCell.textContent = route.mainObject;
            chooseButton.textContent = 'Выбрать';
            chooseButton.classList.add('btn', 'btn-primary');
            chooseButton.addEventListener('click', () => selectRoute(route.id - 1)); // Добавляем обработчик события на кнопку

            // Добавляем ячейки в строку
            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(mainObjectsCell);
            chooseButtonCell.appendChild(chooseButton);
            row.appendChild(chooseButtonCell);

            // Добавляем строку в тело таблицы
            tableBody.appendChild(row);
        });

        
        paginatedData.forEach((route) => {
            // Заполняем список достопримечательностей
            fillLandmarkSelect(paginatedData);
        });
    }

  
    // Функция для заполнения пагинации
    function fillPagination(arrData, rowPerPage) {
        const totalPages = Math.ceil(arrData.length / rowPerPage);
        const paginationList = document.getElementById('pagination-list');
        paginationList.innerHTML = '';

        // Добавляем кнопку "Назад"
        const prevButton = createPaginationButton('<span class="arrow-left">➜</span>', currentPage - 1);
        paginationList.appendChild(prevButton);

        // Добавляем кнопки с номерами страниц
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPaginationButton(i, i);
            paginationList.appendChild(pageButton);
        }

        // Добавляем кнопку "Вперед"
        const nextButton = createPaginationButton('➜', currentPage + 1);
        paginationList.appendChild(nextButton);

    }

  
    // Функция для создания элемента кнопки пагинации
    function createPaginationButton(text, page) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.classList.add('page-link');
        link.href = '#route-table-body';
        link.innerHTML = text;
        link.addEventListener('click', () => handlePageClick(postsData, rows, page));
        li.classList.add('page-item');
        li.appendChild(link);
        return li;
    }

    // Функция для обработки нажатия на кнопку пагинации
    function handlePageClick(arrData, rowPerPage, newPage) {
        // Проверка на допустимость номера страницы
        if (newPage >= 1 && newPage <= Math.ceil(arrData.length / rowPerPage)) {
            currentPage = newPage;
            // Перезаполняем таблицу с учетом новой страницы
            fillRouteTable(postsData, rowPerPage, currentPage);
        }
        console.log(`Страница ${currentPage}`);
    }
    
    
    fillRouteTable(postsData, rows, currentPage);
    fillPagination(postsData, rows);
  }
  
routeTable();

// // Функция для заполнения таблицы маршрутов с учетом пагинации
// function fillRouteTable(routes, currentPage) {
//     const tableBody = document.getElementById('route-table-body');
//     // Очищаем текущее содержимое таблицы
//     tableBody.innerHTML = '';

//     // Вычисляем индексы начала и конца записей на текущей странице
//     const startIndex = (currentPage - 1) * recordsPerPage;
//     const endIndex = startIndex + recordsPerPage;

//     // Получаем только записи для текущей страницы
//     const currentPageRoutes = routes.slice(startIndex, endIndex);

//     // Добавляем строки с данными маршрутов
//     currentPageRoutes.forEach(route => {
//         const row = document.createElement('tr');
//         const nameCell = document.createElement('td');
//         const descriptionCell = document.createElement('td');
//         const mainObjectsCell = document.createElement('td');
//         const chooseButtonCell = document.createElement('td');
//         const chooseButton = document.createElement('button');

//         // Заполняем ячейки данными маршрута
//         nameCell.textContent = route.name;
//         descriptionCell.textContent = route.description;
//         mainObjectsCell.textContent = route.mainObject;
//         chooseButton.textContent = 'Выбрать';
//         chooseButton.classList.add('btn', 'btn-primary');
//         chooseButton.addEventListener('click', () => selectRoute(route.id - 1)); // Добавляем обработчик события на кнопку

//         // Добавляем ячейки в строку
//         row.appendChild(nameCell);
//         row.appendChild(descriptionCell);
//         row.appendChild(mainObjectsCell);
//         chooseButtonCell.appendChild(chooseButton);
//         row.appendChild(chooseButtonCell);

//         // Добавляем строку в тело таблицы
//         tableBody.appendChild(row);
//     });

//     // Обновляем состояние пагинации
//     updatePagination(routes, currentPage);
// }

// Функция для заполнения списка достопримечательностей
function fillLandmarkSelect(routes) {
    const landmarkSelect = document.getElementById('landmark');

    // Очищаем текущее содержимое списка
    landmarkSelect.innerHTML = '';

    // Добавляем первый вариант "Поиск по достопримечательности"
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Поиск по достопримечательности';
    landmarkSelect.appendChild(defaultOption);

    // Получаем все уникальные достопримечательности
    const allLandmarks = Array.from(new Set(routes.map(route => route.mainObject.toLowerCase())));

    // Добавляем варианты достопримечательностей в список
    routes.forEach(route => {
        const option = document.createElement('option');
        option.value = `landmark${route.id - 1}`;
        option.textContent = route.mainObject;
        landmarkSelect.appendChild(option);
    });
}

// Функция для обновления таблицы с учетом фильтрации
function updateTable(filteredData) {
    const tableBody = document.getElementById('route-table-body');
    
    // Очищаем текущее содержимое таблицы
    tableBody.innerHTML = '';

    // Добавляем строки с отфильтрованными данными маршрутов
    filteredData.forEach(route => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const descriptionCell = document.createElement('td');
        const mainObjectsCell = document.createElement('td');
        const chooseButtonCell = document.createElement('td');
        const chooseButton = document.createElement('button');

        // Заполняем ячейки данными маршрута
        nameCell.textContent = route.name;
        descriptionCell.textContent = route.description;
        mainObjectsCell.textContent = route.mainObject;
        chooseButton.textContent = 'Выбрать';
        chooseButton.classList.add('btn', 'btn-primary');
        chooseButton.addEventListener('click', () => selectRoute(route.id - 1)); // Добавляем обработчик события на кнопку

        // Добавляем ячейки в строку
        row.appendChild(nameCell);
        row.appendChild(descriptionCell);
        row.appendChild(mainObjectsCell);
        chooseButtonCell.appendChild(chooseButton);
        row.appendChild(chooseButtonCell);

        // Добавляем строку в тело таблицы
        tableBody.appendChild(row);
    });

    updatePagination(routes, currentPage);
}

// Функция для обработки ввода в текстовое поле поиска
function handleSearch() {
    const input = document.getElementById('route-name');
    const inputValue = input.value.toLowerCase();

    const landmarkSelect = document.getElementById('landmark');
    const selectedLandmark = landmarkSelect.value;

    // Фильтрация данных по названию и достопримечательности
    const filteredRoutes = data.filter(route =>
        route.name.toLowerCase().includes(inputValue) &&
        (selectedLandmark === '' || route.mainObject.toLowerCase().includes(selectedLandmark))
    );

    // Вызываем функцию для обновления таблицы с учетом отфильтрованных данных
    updateTable(filteredRoutes);
    // Обновляем состояние пагинации
    updatePagination(filteredRoutes, currentPage);    
}

// Получаем ссылку на элемент select для выбора достопримечательности
const landmarkSelect = document.getElementById('landmark');
// Получаем ссылку на текстовое поле
const searchInput = document.getElementById('route-name');

// Добавляем событие на изменение значения в select
landmarkSelect.addEventListener('change', handleSearch);
// Добавляем событие на изменение значения в текстовом поле
searchInput.addEventListener('input', handleSearch);


// Функция для обработки выбора маршрута
function selectRoute(routeId) {
    document.getElementById('cancel-confirmation-modal').classList.add('open');
    console.log(`Маршрут с ID ${routeId} выбран`);
}





// Функция для обновления информации о пагинации
function updatePaginationInfo(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationInfo = document.getElementById('pagination-info');
    paginationInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
}







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
        fetchData();

    });