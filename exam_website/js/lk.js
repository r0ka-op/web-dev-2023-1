const api_key = 'd01e7184-0896-49ea-986a-8320b70192fe'


// Функция для получения жанных о заказах
async function fetchData() {
    try {
        const response = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=${api_key}`);

        if (!response.ok) {
            throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
            showErrorNotification(response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error.message);
    }
}

// Функция для выполнения получения данных о маршруте
async function fetchRoute(routeId) {
    const routeUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}?api_key=${api_key}`;

    try {
        const response = await fetch(routeUrl);

        if (!response.ok) {
            throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
            showErrorNotification(response.statusText);
        }

        const routeData = await response.json();
        return routeData;
    } catch (error) {
        console.error('Ошибка при получении данных о маршруте:', error.message);
    }
}



// Функция для получения данных о гидах по выбранному маршруту
async function fetchGuides(routeId) {
    try {
        const response = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=${api_key}`);

        if (!response.ok) {
            throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
        }

        const guidesData = await response.json();
        return guidesData;
    } catch (error) {
        console.error('Ошибка при получении данных о гидах:', error.message);
        return [];
    }
}



// Функция для отображения уведомления об успешном удалении
function showDeleteSuccessNotification() {
    const successAlert = document.getElementById('delete-success-alert');
    successAlert.classList.remove('fade');
    successAlert.classList.add('show');

    // Скрыть уведомление через 3 секунды
    setTimeout(() => {
        successAlert.classList.add('fade');
        successAlert.classList.remove('show');
    }, 5000);
}

// Функция для отображения уведомления об успешном редактировании
function showEditSuccessNotification() {
    const successAlert = document.getElementById('edit-success-alert');
    successAlert.classList.remove('fade');
    successAlert.classList.add('show');

    setTimeout(() => {
        successAlert.classList.add('fade');
        successAlert.classList.remove('show');
    }, 5000);
}

// Функция для отображения уведомления об ошибке
function showErrorNotification(message) {
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorAlert.classList.remove('fade');
    errorAlert.classList.add('show');

    setTimeout(() => {
        errorAlert.classList.add('fade');
        errorAlert.classList.remove('show');
    }, 5000);
}




async function OrdersTable() {
    const postsData = await fetchData('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
    let currentPage = 1;
    let rows = 10;

    async function showModalDetails(order, routeName) {
        try {
            const guidesData = await fetchGuides(order.route_id);
        
            const guide = guidesData[0];
            // Заполняем поля формы данными из объекта `order`, `routeName` и `guide`
            document.getElementById('routeName').value = routeName;
            document.getElementById('guideName').value = guide.name;
            document.getElementById('excursionDate').value = order.date;
            document.getElementById('excursionTime').value = order.time;
            document.getElementById('excursionDuration').value = order.duration;
            document.getElementById('groupSize').value = order.persons;
            document.getElementById('totalCost').value = order.price;

            // Устанавливаем состояние чекбоксов
            document.getElementById('discountCheckbox').checked = order.optionFirst;
            document.getElementById('souvenirCheckbox').checked = order.optionSecond;

            // Делаем поля только для чтения
            const formFields = document.querySelectorAll('#order-form input, #order-form select');
            formFields.forEach(field => {
                field.setAttribute('readonly', true);
            });

            // Отображаем модальное окно
            $('#order-details-modal').modal('show');
        } catch (error) {
            console.error('Ошибка при получении данных о гидах:', error.message);
        }
        console.log("Просмотр:", order);
    }
    




    // Функция для отображения модального окна редактирования
    function showModalEdit(order) {
        console.log("Редактирование:", order);
    }





    // Функция для отображения модального окна подтверждения удаления
    function showModalDelete(order) {
        const confirmCancelBtn = document.getElementById('confirm-cancel-btn');

        confirmCancelBtn.addEventListener('click', async () => {
            const deleteUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${order.id}?api_key=${api_key}`;
            try {
                const response = await fetch(deleteUrl, { method: 'DELETE' });

                if (!response.ok) {
                    throw new Error(`Ошибка при удалении заявки: ${response.status} ${response.statusText}`);
                    showErrorNotification(response.statusText);
                }

                console.log('Заявка успешно удалена');
                showDeleteSuccessNotification();
                refreshTable();
            } catch (error) {
                console.error('Ошибка при удалении заявки:', error.message);
            }
        });
            console.log("Удаление:", order);
        }



    async function fillOrdersTable(data) {
        const tableBody = document.getElementById('orders-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

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
            cellNumber.textContent = route.id;
            cellRoute.textContent = route ? route.name : 'Н/Д';
            cellDate.textContent = order.date;
            cellPrice.textContent = order.price;

            // Добавляем кнопки "Подробнее", "Редактировать" и "Удалить"
            const detailsButton = document.createElement('button');
            detailsButton.classList.add('btn', 'btn-primary', 'me-2');
            detailsButton.setAttribute('data-bs-toggle', 'modal');
            detailsButton.setAttribute('data-bs-target', '#view-order-modal');
            detailsButton.textContent = 'Подробнее';
            detailsButton.addEventListener('click', () => showModalDetails(order, route.name));
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


    // Функция для обновления таблицы
    async function refreshTable() {
        const postsData = await fetchData('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
        fillOrdersTable(postsData);
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

   
        
    fillOrdersTable(postsData);
    // fillPagination(postsData, rows);
}
  




OrdersTable();




