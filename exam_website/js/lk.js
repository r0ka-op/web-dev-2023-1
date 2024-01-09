const api_key = 'd01e7184-0896-49ea-986a-8320b70192fe'


// Функция для выполнения HTTP-запроса
async function fetchData() {
    try {
        const response = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=${api_key}`);

        if (!response.ok) {
            throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error.message);
    }
}

// Функция для выполнения HTTP-запроса данных о маршруте
async function fetchRoute(routeId) {
    const routeUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}?api_key=${api_key}`;

    try {
        const response = await fetch(routeUrl);

        if (!response.ok) {
            throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
        }

        const routeData = await response.json();
        return routeData;
    } catch (error) {
        console.error('Ошибка при получении данных о маршруте:', error.message);
    }
}


async function OrdersTable() {
    const postsData = await fetchData('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
    let currentPage = 1;
    let rows = 10;

    // Функция для отображения модального окна с подробной информацией
    function showModalDetails(order) {
        // Здесь добавьте код для создания и отображения модального окна
        // Используйте данные из объекта `order` для отображения подробной информации
        console.log("Подробная информация:", order);
    }

    // Функция для отображения модального окна редактирования
    function showModalEdit(order) {
        // Здесь добавьте код для создания и отображения модального окна редактирования
        // Используйте данные из объекта `order` для предзаполнения формы редактирования
        console.log("Редактирование:", order);
    }

    // Функция для отображения модального окна подтверждения удаления
    function showModalDelete(order) {
        // Здесь добавьте код для создания и отображения модального окна подтверждения удаления
        // Используйте данные из объекта `order` для отображения информации о заявке
        console.log("Удаление:", order);
    }

    async function fillOrdersTable(data) {
        const tableBody = document.getElementById('orders-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Очищаем текущее содержимое таблицы

        // Ожидаем выполнения всех асинхронных запросов и получаем массив результатов
        const routeDataArray = await Promise.all(data.map(order => fetchRoute(order.route_id)));

        routeDataArray.forEach((route, index) => {
            const order = data[index];
            const row = tableBody.insertRow(); // Создаем новую строку в таблице
            const cellNumber = row.insertCell(0);
            const cellRoute = row.insertCell(1);
            const cellDate = row.insertCell(2);
            const cellPrice = row.insertCell(3);
            const cellActions = row.insertCell(4);

            // Заполняем ячейки данными
            cellNumber.textContent = index + 1;
            cellRoute.textContent = route ? route.name : 'Н/Д';
            cellDate.textContent = order.date;
            cellPrice.textContent = order.price;

            // Добавляем кнопки "Подробнее", "Редактировать" и "Удалить"
            const detailsButton = document.createElement('button');
            detailsButton.classList.add('btn', 'btn-primary', 'me-2');
            detailsButton.textContent = 'Подробнее';
            detailsButton.addEventListener('click', () => showModalDetails(order));
            cellActions.appendChild(detailsButton);

            const editButton = document.createElement('button');
            editButton.classList.add('btn', 'btn-warning', 'me-2');
            editButton.textContent = 'Редактировать';
            editButton.addEventListener('click', () => showModalEdit(order));
            cellActions.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('type', 'button');
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#cancel-confirmation-modal');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => showModalDelete(order));
            cellActions.appendChild(deleteButton);
        });
    }




    // Функция для обработки клика на кнопке "раскрыть описание"
    function expandDescription(descriptionCell, fullDescription, routeId) {
        descriptionCell.innerHTML = fullDescription;

        // Добавляем кнопку "скрыть описание"
        const collapseButton = document.createElement('button');
        collapseButton.textContent = 'Скрыть текст';
        collapseButton.classList.add('expand-button');
        collapseButton.addEventListener('click', () => collapseDescription(descriptionCell, fullDescription, routeId));
        descriptionCell.appendChild(collapseButton);

        // Прокручиваем к строке с заданным routeId
        const selectedRow = document.querySelector(`[data-route-id="${routeId}"]`);
        if (selectedRow) {
            selectedRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Функция для обработки клика на кнопке "скрыть описание"
    function collapseDescription(descriptionCell, truncatedDescription, routeId) {
        // Очищаем содержимое ячейки
        descriptionCell.textContent = truncatedDescription.substring(0, 127) + '...';
    
        // Добавляем кнопку "раскрыть описание"
        const expandButton = document.createElement('button');
        expandButton.textContent = 'Раскрыть тест';
        expandButton.classList.add('expand-button');
        expandButton.addEventListener('click', () => expandDescription(descriptionCell, truncatedDescription, routeId));
        descriptionCell.appendChild(expandButton);
    }
    

    // Функция для обновления текста в блоке с названием маршрута
    function updateRouteNameInTitle() {
        const routeNameElement = document.getElementById('route-name-h4');

        if (JSON.parse(localStorage.getItem('selectedRoute'))[0].name.length > 0) {
            routeNameElement.textContent = JSON.parse(localStorage.getItem('selectedRoute'))[0].name;
        } else {
            routeNameElement.textContent = 'Название маршрута';
        }
    }

    // Функция для обработки выбора маршрута
    function selectRoute(routeId, row) {
        const selectedRoute = data.find(route => route.id === routeId);

        if (selectedRoute) {
            clearSelection();
            row.classList.add('table-primary');
            selectedData = [selectedRoute];
            const chooseButton = row.querySelector('.choose-button');
            chooseButton.classList.add('selectedBtn');
            chooseButton.textContent = 'Выбрано';
            localStorage.setItem('selectedRoute', JSON.stringify(selectedData)); // Сохраняем выбранный маршрут в localStorage
            updateRouteNameInTitle();
            // Обновляем таблицу гидов при выборе нового маршрута
            guideTable();
            loadSelectedRouteOnPageLoad();
            console.log('Выбранный маршрут:', selectedRoute);
        } else {
            console.error(`Маршрут с id ${routeId} не найден в данных.`);
        }
    }

    

    // Функция для загрузки выбранного маршрута при загрузке страницы
    function loadSelectedRouteOnPageLoad() {
        const selectedRoute = JSON.parse(localStorage.getItem('selectedRoute'))[0];
        if (selectedRoute.id) {
            // Найти строку маршрута по id и выделить ее
            const selectedRow = document.querySelector(`[data-route-id="${selectedRoute.id}"]`);
            if (selectedRow) {
                selectedRow.classList.add('table-primary');
                updateRouteNameInTitle();
            }
        }
    }

    // Функция для отмены выбора предыдущего маршрута
    function clearSelection() {
        const selectedRows = document.querySelectorAll('.table-primary');
        
        // Проверяем, есть ли выбранные строки
        if (selectedRows.length > 0) {
            selectedRows.forEach(selectedRow => {
                selectedRow.classList.remove('table-primary');
                const chooseButton = selectedRow.querySelector('.choose-button');

                // Проверяем, есть ли кнопка в выбранной строке
                if (chooseButton) {
                    chooseButton.classList.remove('selectedBtn');
                    chooseButton.textContent = 'Выбрать';
                }
            });
            selectedData = [];
        }
    }
    


    // Функция для заполнения пагинации
    function fillPagination(arrData, rowPerPage) {
        const totalPages = Math.ceil(arrData.length / rowPerPage);
        const paginationList = document.getElementById('pagination-list-routes');
        paginationList.innerHTML = '';

        // Добавляем кнопки с номерами страниц
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPaginationButton(i, i);
            paginationList.appendChild(pageButton);
        }
    }

  
    // Функция для создания элемента кнопки пагинации
    function createPaginationButton(text, page) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.classList.add('page-link');
        link.href = '#route-table-body';
        link.innerHTML = text;

        if (currentPage == page) li.classList.add("active")

        link.addEventListener('click', () => {
            currentPage = page;
            handlePageClick(postsData, rows, currentPage);
            
            let currentItemLi = document.querySelector("li.active");
            currentItemLi.classList.remove("active");

            li.classList.add("active");
        });
            
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
            loadSelectedRouteOnPageLoad();
        }
        console.log(`Страница ${currentPage}`);
    }

    // Функция для обновления пагинации
    function updatePagination() {
        const paginationList = document.getElementById('pagination-list-routes');
        paginationList.innerHTML = '';
    }

    // Функция для обработки ввода в текстовое поле поиска
    function handleSearch() {
        const input = document.getElementById('route-name');
        const inputValue = input.value.toLowerCase();

        // Фильтрация данных по названию и достопримечательности
        const filteredRoutes = postsData.filter(route =>
            route.name.toLowerCase().includes(inputValue)
        );

        // Вызываем функцию для обновления таблицы с учетом отфильтрованных данных
        fillRouteTable(filteredRoutes, rows, currentPage);
        fillPagination(filteredRoutes, rows);
        loadSelectedRouteOnPageLoad();
    }
        
    fillOrdersTable(postsData);
    // fillPagination(postsData, rows);
}
  




OrdersTable();




