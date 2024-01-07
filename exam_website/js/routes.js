const api_key = 'd01e7184-0896-49ea-986a-8320b70192fe'

let selectedData = [];


// Функция для получения данных с API
async function fetchData(urn) {
    let url = `${urn}?api_key=${api_key}`
    
    console.log(url)
    try {
        console.log("до url")
        const response = await fetch(url);

        console.log("после url")

        if (!response.ok) {
            throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
        }

        data = await response.json();
        return data
    } catch (error) {
        console.error('Ошибка при получении данных:', error.message);
    }
}


// Функция для сохранения выбранного маршрута в localStorage
function saveSelectedRoute(routeId) {
    localStorage.setItem('selectedRoute', routeId);
}

// Функция для загрузки выбранного маршрута из localStorage
function loadSelectedRoute() {
    return localStorage.getItem('selectedRoute');
}


async function routeTable() {
    const postsData = await fetchData('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
    let currentPage = 1;
    let rows = 10;



    // Функция для заполнения таблицы маршрутов
    function fillRouteTable(arrData, rowPerPage, page) {
        const tableBody = document.getElementById('route-table-body');
        page--;
        
        // Очищаем текущее содержимое таблицы
        tableBody.innerHTML = '';

        const start = rowPerPage * (page);
        const end = start + rowPerPage;
        const paginatedData = arrData.slice(start, end);


        // arrData.forEach((route) => {
        //     // Заполняем список достопримечательностей
        //     fillLandmarkSelect(arrData);
        // });

        
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
    
            // Проверяем длину текста графы "описание"
            if (route.description.length > 127) {
                const truncatedDescription = route.description.substring(0, 127) + '...';
                descriptionCell.textContent = truncatedDescription;
    
                // Добавляем кнопку "раскрыть описание"
                const expandButton = document.createElement('button');
                expandButton.textContent = 'Раскрыть описание';
                expandButton.classList.add('expand-button');
                expandButton.addEventListener('click', () => expandDescription(descriptionCell, route.description));
                descriptionCell.appendChild(expandButton);
            } else {
                descriptionCell.textContent = route.description;
            }

            // Проверяем длину текста графы "объекты"
            if (route.mainObject.length > 127) {
                const truncatedMainObjeect = route.description.substring(0, 127) + '...';
                mainObjectsCell.textContent = truncatedMainObjeect;
    
                // Добавляем кнопку "раскрыть описание"
                const expandButton = document.createElement('button');
                expandButton.textContent = 'Раскрыть описание';
                expandButton.classList.add('expand-button');
                expandButton.addEventListener('click', () => expandDescription(mainObjectsCell, route.mainObject));
                mainObjectsCell.appendChild(expandButton);
            } else {
                mainObjectsCell.textContent = route.mainObject;
            }

    
            chooseButton.textContent = 'Выбрать';
            chooseButton.classList.add('btn', 'btn-primary', 'choose-button');
            chooseButton.addEventListener('click', () => selectRoute(route.id, row));

    
            // Добавляем ячейки в строку
            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(mainObjectsCell);
            chooseButtonCell.appendChild(chooseButton);
            row.appendChild(chooseButtonCell);

            // Добавляем атрибут data-route-id к строке
            row.setAttribute('data-route-id', route.id);
    
            // Добавляем строку в тело таблицы
            tableBody.appendChild(row);
        });
    }

    // Функция для обработки клика на кнопке "раскрыть описание"
    function expandDescription(descriptionCell, fullDescription) {
        descriptionCell.innerHTML = fullDescription;

        // Добавляем кнопку "скрыть описание"
        const collapseButton = document.createElement('button');
        collapseButton.textContent = 'Скрыть описание';
        collapseButton.classList.add('expand-button');
        collapseButton.addEventListener('click', () => collapseDescription(descriptionCell, fullDescription));
        descriptionCell.appendChild(collapseButton);
    }

    // Функция для обработки клика на кнопке "скрыть описание"
    function collapseDescription(descriptionCell, truncatedDescription) {
        // Очищаем содержимое ячейки
        descriptionCell.textContent = truncatedDescription.substring(0, 127) + '...';
    
        // Добавляем кнопку "раскрыть описание"
        const expandButton = document.createElement('button');
        expandButton.textContent = 'Раскрыть описание';
        expandButton.classList.add('expand-button');
        expandButton.addEventListener('click', () => expandDescription(descriptionCell, truncatedDescription));
        descriptionCell.appendChild(expandButton);
    }
    

    // Функция для обновления текста в блоке с названием маршрута
    function updateRouteNameInTitle() {
        const routeNameElement = document.getElementById('route-name-h4');

        if (selectedData.length > 0) {
            routeNameElement.textContent = selectedData[0].name;
        } else {
            routeNameElement.textContent = 'Название маршрута';
        }
    }

    // Функция для обработки выбора маршрута
    function selectRoute(routeId, row) {
        const selectedRoute = data.find(route => route.id === routeId);

        if (selectedRoute) {
            clearSelection();
            row.classList.add('selected');
            selectedData = [selectedRoute];
            const chooseButton = row.querySelector('.choose-button');
            chooseButton.classList.add('selected');
            chooseButton.textContent = 'Выбрано';
            saveSelectedRoute(routeId); // Сохраняем выбранный маршрут в localStorage
            updateRouteNameInTitle();
            // Обновляем таблицу гидов при выборе нового маршрута
            guideTable();
            console.log('Выбранный маршрут:', selectedRoute);
        } else {
            console.error(`Маршрут с id ${routeId} не найден в данных.`);
        }
    }

    

    // Функция для загрузки выбранного маршрута при загрузке страницы
    function loadSelectedRouteOnPageLoad() {
        const selectedRouteId = loadSelectedRoute();
        if (selectedRouteId) {
            // Найти строку маршрута по id и выделить ее
            const selectedRow = document.querySelector(`[data-route-id="${selectedRouteId}"]`);
            if (selectedRow) {
                selectedRow.classList.add('selected');
            }
        }
    }

    // Функция для отмены выбора предыдущего маршрута
    function clearSelection() {
        const selectedRows = document.querySelectorAll('.selected');
        
        // Проверяем, есть ли выбранные строки
        if (selectedRows.length > 0) {
            selectedRows.forEach(selectedRow => {
                selectedRow.classList.remove('selected');
                const chooseButton = selectedRow.querySelector('.choose-button');

                // Проверяем, есть ли кнопка в выбранной строке
                if (chooseButton) {
                    chooseButton.classList.remove('selected');
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
        }
        console.log(`Страница ${currentPage}`);
    }


    // // Функция для заполнения списка достопримечательностей
    // function fillLandmarkSelect(arrData) {
    //     const landmarkSelect = document.getElementById('landmark');

    //     // Очищаем текущее содержимое списка
    //     landmarkSelect.innerHTML = '';

    //     // Добавляем первый вариант "Поиск по достопримечательности"
    //     const defaultOption = document.createElement('option');
    //     defaultOption.value = '';
    //     defaultOption.textContent = 'Поиск по достопримечательности';
    //     landmarkSelect.appendChild(defaultOption);

    //     const allLandmarks = new Set();

    //     arrData.forEach(route => {
    //         const landmarks = route.mainObject.split('- ');
    //         console.log(landmarks)
    //         landmarks.forEach(landmark => {
    //             allLandmarks.add(landmark);
    //         });
    //     });

    //     // console.log(allLandmarks)
    //     const uniqueLandmarks = Array.from(allLandmarks);
        
    //     // Добавляем варианты достопримечательностей в список
    //     arrData.forEach(route => {
    //         const option = document.createElement('option');
    //         option.value = `landmark${route.id - 1}`;
    //         option.textContent = uniqueLandmarks;
    //         landmarkSelect.appendChild(option);
    //     });
    // }

    // Функция для обновления пагинации
    function updatePagination() {
        const paginationList = document.getElementById('pagination-list-routes');
        paginationList.innerHTML = '';
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
        fillRouteTable(filteredRoutes, rows, currentPage);  
        fillPagination(filteredRoutes, rows);
    }

    // Получаем ссылку на элемент select для выбора достопримечательности
    const landmarkSelect = document.getElementById('landmark');
    // Получаем ссылку на текстовое поле
    const searchInput = document.getElementById('route-name');

    // Добавляем событие на изменение значения в select
    landmarkSelect.addEventListener('change', handleSearch);
    // Добавляем событие на изменение значения в текстовом поле
    searchInput.addEventListener('input', handleSearch);
        
    fillRouteTable(postsData, rows, currentPage);
    fillPagination(postsData, rows);
    loadSelectedRouteOnPageLoad();


















// // Функция для получения данных о гидах по маршруту
// async function fetchGuides(routeId) {
//     try {
//         const response = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides?route_id=${routeId}&api_key=${api_key}`);

//         if (!response.ok) {
//             throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
//         }

//         const guidesData = await response.json();
//         return guidesData;
//     } catch (error) {
//         console.error('Ошибка при получении данных о гидах:', error.message);
//         return [];
//     }
// }

//     // Функция для заполнения таблицы гидов
//     async function fillGuidesTable(routeId) {
//         const guidesTableBody = document.getElementById('guides-table').getElementsByTagName('tbody')[0];
        
//         // Очищаем текущее содержимое таблицы
//         guidesTableBody.innerHTML = '';

//         const guidesData = await fetchGuides(routeId);

//         guidesData.forEach((guide, index) => {
//             const row = document.createElement('tr');
//             const photoCell = document.createElement('td');
//             const nameCell = document.createElement('td');
//             const languagesCell = document.createElement('td');
//             const experienceCell = document.createElement('td');
//             const priceCell = document.createElement('td');
//             const chooseButtonCell = document.createElement('td');
//             const chooseButton = document.createElement('button');
    
//             photoCell.innerHTML = `<img src="files/free-icon-avatar-7236095.png" width="50" alt="Фото гида">`;
//             nameCell.textContent = guide.name;
//             languagesCell.textContent = guide.language;
//             experienceCell.textContent = guide.workExperience;
//             priceCell.textContent = guide.pricePerHour;
//             chooseButton.textContent = 'Выбрать';
//             chooseButton.classList.add('btn', 'btn-primary');
//             chooseButton.addEventListener('click', () => selectGuide(guide, routeId));
    
//             row.appendChild(photoCell);
//             row.appendChild(nameCell);
//             row.appendChild(languagesCell);
//             row.appendChild(experienceCell);
//             row.appendChild(priceCell);
//             chooseButtonCell.appendChild(chooseButton);
//             row.appendChild(chooseButtonCell);
    
//             guidesTableBody.appendChild(row);
//         });
//     }

//     // Функция для обработки выбора гида
//     function selectGuide(guideId) {
//         // Ваш код обработки выбора гида
//         console.log('Выбранный гид:', guideId);
//     }

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






    




// Функция для обновления таблицы гидов при выборе маршрута
async function guideTable() {
    const selectedRouteId = loadSelectedRoute();
    let guidesData;
    let currentPage = 1;
    let rows = 5;

    if (selectedRouteId) {
        guidesData = await fetchGuides(selectedRouteId);

        if (guidesData.length > 0) {
            fillGuidesTable(guidesData, rows, currentPage);
            fillGuidesPagination(guidesData, rows, currentPage); // передаем currentPage в функцию fillGuidesPagination
            setupGuidesPaginationEvent(guidesData, rows);
        } else {
            // Обработка случая, когда нет доступных гидов
            console.log("Нет гидов для данного маршрута.")
            return;
        }
    }

    // Функция для заполнения пагинации гидов
    function fillGuidesPagination(guidesData, rowPerPage) {
        const totalPages = Math.ceil(guidesData.length / rowPerPage);
        const paginationList = document.getElementById('pagination-list-guides');
        paginationList.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPaginationButton(i, i);
            paginationList.appendChild(pageButton);
        }

        // Установка активного класса для первой страницы
        const firstPageButton = paginationList.querySelector('li:first-child a');
        if (firstPageButton) {
            firstPageButton.classList.add('active');
        }
    }
    
    
    // Функция для создания элемента кнопки пагинации
    function createPaginationButton(text, page) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.classList.add('page-link');
        link.href = '#guides-table-body'; // Уточните соответствующий ID таблицы гидов
        link.innerHTML = text;

        if (currentPage == page) li.classList.add('active');

        link.addEventListener('click', () => {
            currentPage = page;
            handleGuidesPageClick(guidesData, rows, currentPage);

            // Установка активного класса при переключении страниц
            const currentActiveButton = document.querySelector('#pagination-list-guides .active');
            if (currentActiveButton) {
                currentActiveButton.classList.remove('active');
            }
            li.classList.add('active');
        });

        li.classList.add('page-item');
        li.appendChild(link);
        return li;
    }

    // Функция для обработки нажатия на кнопку пагинации гидов
    function handleGuidesPageClick(guidesData, rowPerPage, newPage) {
        if (newPage >= 1 && newPage <= Math.ceil(guidesData.length / rowPerPage)) {
            currentPage = newPage;
            fillGuidesTable(guidesData, rowPerPage, currentPage);
        }
    }

    // Добавление обработчика события на кнопки пагинации гидов
    function setupGuidesPaginationEvent(guidesData, rowPerPage) {
        const paginationList = document.getElementById('pagination-list-guides');
        
        paginationList.addEventListener('click', (event) => {
            const targetPage = parseInt(event.target.innerHTML);
            handleGuidesPageClick(guidesData, rowPerPage, targetPage);

            // Установка активного класса при переключении страниц
            const currentActiveButton = document.querySelector('#pagination-list-guides .active');
            if (currentActiveButton) {
                currentActiveButton.classList.remove('active');
            }
            event.target.parentNode.classList.add('active');
        });
    }

    // Обновленная функция для заполнения таблицы гидов
    function fillGuidesTable(guidesData, rowPerPage, page) {
        const guidesTableBody = document.getElementById('guides-table').getElementsByTagName('tbody')[0];
        page--;

        guidesTableBody.innerHTML = '';

        const start = rowPerPage * (page);
        const end = start + rowPerPage;
        const paginatedData = guidesData.slice(start, end);

        paginatedData.forEach((guide) => {
            const row = document.createElement('tr');
            const photoCell = document.createElement('td');
            const nameCell = document.createElement('td');
            const languagesCell = document.createElement('td');
            const experienceCell = document.createElement('td');
            const priceCell = document.createElement('td');
            const chooseButtonCell = document.createElement('td');
            const chooseButton = document.createElement('button');

            photoCell.innerHTML = `<img src="files/free-icon-avatar-7236095.png" width="40" alt="Фото гида">`;
            nameCell.textContent = guide.name;
            languagesCell.textContent = guide.language;
            experienceCell.textContent = guide.workExperience;
            priceCell.textContent = guide.pricePerHour;
            chooseButton.textContent = 'Выбрать';
            chooseButton.classList.add('btn', 'btn-primary');
            chooseButton.addEventListener('click', () => selectGuide(guide.id));

            row.appendChild(photoCell);
            row.appendChild(nameCell);
            row.appendChild(languagesCell);
            row.appendChild(experienceCell);
            row.appendChild(priceCell);
            chooseButtonCell.appendChild(chooseButton);
            row.appendChild(chooseButtonCell);

            guidesTableBody.appendChild(row);
        });
    }
}





















routeTable();

guideTable();