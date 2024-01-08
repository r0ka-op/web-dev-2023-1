const api_key = 'd01e7184-0896-49ea-986a-8320b70192fe'

let selectedData = Array(2);
selectedData[0] = JSON.parse(localStorage.getItem('selectedRoute'))[0];


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
                expandButton.textContent = 'Раскрыть текст';
                expandButton.classList.add('expand-button');
                expandButton.addEventListener('click', () => expandDescription(descriptionCell, route.description, route.id));
                descriptionCell.appendChild(expandButton);
            } else {
                descriptionCell.textContent = route.description;
            }

            // Проверяем длину текста графы "объекты"
            if (route.mainObject.length > 127) {
                const truncatedMainObjeect = route.mainObject.substring(0, 127) + '...';
                mainObjectsCell.textContent = truncatedMainObjeect;
    
                // Добавляем кнопку "раскрыть описание"
                const expandButton = document.createElement('button');
                expandButton.textContent = 'Раскрыть текст';
                expandButton.classList.add('expand-button');
                expandButton.addEventListener('click', () => expandDescription(mainObjectsCell, route.mainObject, route.id));
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
            row.classList.add('selected');
            selectedData = [selectedRoute];
            const chooseButton = row.querySelector('.choose-button');
            chooseButton.classList.add('selected');
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
                selectedRow.classList.add('selected');
                updateRouteNameInTitle();
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
            loadSelectedRouteOnPageLoad();
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

        // Фильтрация данных по названию и достопримечательности
        const filteredRoutes = postsData.filter(route =>
            route.name.toLowerCase().includes(inputValue)
        );

        // Вызываем функцию для обновления таблицы с учетом отфильтрованных данных
        fillRouteTable(filteredRoutes, rows, currentPage);
        fillPagination(filteredRoutes, rows);
        loadSelectedRouteOnPageLoad();
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
    const selectedRoute = JSON.parse(localStorage.getItem('selectedRoute'))[0];
    let guidesData;
    let currentPage = 1;
    let rows = 5;

    if (selectedRoute.id) {
        guidesData = await fetchGuides(selectedRoute.id);

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

        fillGuidesTable(guidesData, rowPerPage, currentPage); // Перезаполняем таблицу с учетом новой страницы
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

     // Функция для обработки выбора гида
    function selectGuide(guideId) {
        document.getElementById("my-modal").classList.add("open");
        const routeNameElement = document.getElementById('routeName');
        const guideNameElement = document.getElementById('guideName');
        
        routeNameElement.value = selectedData[0].name;
        routeNameElement.size = selectedData[0].name.length + 5;

        guidesData.forEach(guide => {
            if (guideId == guide.id) {
                guideNameElement.value = guide.name;
                localStorage.setItem('selectedGuide', JSON.stringify([guide]));
                selectedData[1] = guide;
            }
        });
        console.log('Выбранный гид:', guideId);
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
            chooseButton.textContent = 'Оформить заявку';
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



    // Функция для получения уникальных языков из данных о гидах
    function getUniqueLanguages(guidesData) {
        const uniqueLanguages = new Set();

        guidesData.forEach(guide => {
            uniqueLanguages.add(guide.language);
        });

        return Array.from(uniqueLanguages);
    }

    // Функция для заполнения списка языков гидов
    function fillLanguagesSelect(guidesData) {
        const languageSelect = document.getElementById('language');
        const languages = getUniqueLanguages(guidesData);

        // Очищаем текущее содержимое списка
        languageSelect.innerHTML = '';

        // Добавляем первый вариант "--Не выбрано--"
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.selected = true;
        defaultOption.textContent = 'Язык экскурсии';
        languageSelect.appendChild(defaultOption);

        // Добавляем варианты языков в список
        languages.forEach((language, index) => {
            const option = document.createElement('option');
            option.value = `language${index + 1}`;
            option.textContent = language;
            languageSelect.appendChild(option);
        });
    }
     

    // Функция для обработки выбора языка в поиске гидов
    function handleLanguageSearch() {
        const option = document.getElementById('language');
        const optionText = option.textContent.toLowerCase();
        console.log(option)
        console.log(optionText)

        // Фильтрация данных по языку и названию
        const filteredGuides = guidesData.filter(guide =>
            (optionText.includes(guide.name.toLowerCase()))
        );

        // Вызываем функцию для обновления таблицы с учетом отфильтрованных данных
        fillGuidesTable(filteredGuides, rows, currentPage);
        fillGuidesPagination(filteredGuides, rows);
    }


    // Функция для обработки изменения значений в полях стажа
    function handleExperienceSearch() {
        const experienceAtInput = document.getElementById('experience-at');
        const experienceToInput = document.getElementById('experience-to');

        const minExperience = parseInt(experienceAtInput.value) || 0;
        const maxExperience = parseInt(experienceToInput.value) || Infinity;

        console.log(`Минимальный опыт работы: ${minExperience}`);
        console.log(`Максимальный опыт работы: ${maxExperience}`);

        // Проверим, что у нас есть данные гидов
        console.log(guidesData);

        // Фильтрация данных по опыту работы
        const filteredGuides = guidesData.filter(guide =>
            guide.workExperience >= minExperience && guide.workExperience <= maxExperience
        );

        console.log('Отфильтрованные гиды:', filteredGuides);

        // Вызываем функцию для обновления таблицы с учетом отфильтрованных данных
        fillGuidesTable(filteredGuides, rows, currentPage);
        fillGuidesPagination(filteredGuides, rows);
    }

    // Получаем ссылки на элементы ввода стажа
    const experienceAtInput = document.getElementById('experience-at');
    const experienceToInput = document.getElementById('experience-to');

    // Добавляем обработчик события на изменение значений в полях стажа
    experienceAtInput.addEventListener('input', handleExperienceSearch);
    experienceToInput.addEventListener('input', handleExperienceSearch);

    // Добавление обработчика события на изменение значения в выпадающем списке
    const languageSelect = document.getElementById('language');
    languageSelect.addEventListener('change', handleLanguageSearch);

    fillLanguagesSelect(guidesData);

    // document.getElementById("view-order-btn").addEventListener("click", function() {
    //     guidesData.forEach(guide => {
    //         if (guideId == guide.id) {
    //             calculateExcursionCost(guide.pricePerHour, selectedValue);
    //         }
    //     });
        
    // })
}












function calculateExcursionPrice() {
    const hoursSelect = document.getElementById('excursionDuration');
    const selectedOption = hoursSelect.options[hoursSelect.selectedIndex];
    const hoursNumber = selectedOption.value; // Длительность экскурсии в часах

    const guideServiceCost = selectedData[1].pricePerHour; // Стоимость услуг гида за один час


    function calculateIsThisDayOff(excursionDate) {
        const date = new Date(excursionDate);
        const dayOfWeek = date.getDay(); 

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return 1.5; // Праздничные и выходные дни
        } else {
            return 1; // Будний день
        }
    }

    const excursionDateInput = document.getElementById('excursionDate');
    const excursionDate = excursionDateInput.value;
    const isThisDayOff = calculateIsThisDayOff(excursionDate); // Множитель для праздничных и выходных дней


    function calculateTimeBonuses(excursionTime) {
        const time = new Date(`2000-01-01T${excursionTime}`);
        const hours = time.getHours();

        let isItMorning = 0;
        let isItEvening = 0;

        if (hours >= 9 && hours < 12) { isItMorning = 400; }

        if (hours >= 20 && hours < 23) { isItEvening = 1000; }

        return { isItMorning, isItEvening };
    }

    const excursionTimeInput = document.getElementById('excursionTime');
    const excursionTime = excursionTimeInput.value;
    const { isItMorning, isItEvening } = calculateTimeBonuses(excursionTime); // Надбавка за раннее или вечернее время экскурсии


    function calculateVisitorsBonus(groupSize) {
        let numberOfVisitors = 0;

        if (groupSize >= 1 && groupSize <= 5) {
            numberOfVisitors = 0;
        } else if (groupSize > 5 && groupSize <= 10) {
            numberOfVisitors = 1000;
        } else if (groupSize > 10 && groupSize <= 20) {
            numberOfVisitors = 1500;
        }

        return numberOfVisitors;
    }

    const groupSizeInput = document.getElementById('groupSize');
    const groupSize = parseInt(groupSizeInput.value);
    const visitorsBonus = calculateVisitorsBonus(groupSize); // Количество посетителей экскурсии


    const discountCheckbox = document.getElementById('discountCheckbox');
    const souvenirCheckbox = document.getElementById('souvenirCheckbox');

    const hasDiscount = discountCheckbox.checked;
    const hasSouvenirs = souvenirCheckbox.checked;
    const numberOfVisitors = calculateVisitorsBonus(groupSize);

    console.log(guideServiceCost, hoursNumber, isThisDayOff, isItMorning, isItEvening, numberOfVisitors)

    let price = guideServiceCost * hoursNumber * isThisDayOff + isItMorning + isItEvening + numberOfVisitors;

    // Скидка для школьников и студентов
    if (hasDiscount) {
        price *= 0.85;
    }

    // Стоимость тематических сувениров
    if (hasSouvenirs) {
        const souvenirCostPerVisitor = 500;
        price += souvenirCostPerVisitor * groupSize;
    }

    // Обновляем отображение стоимости на странице или используем значение по вашему усмотрению  
    var totalCostInput = document.getElementById('totalCost');
    totalCostInput.value = price;
}







routeTable();

guideTable();




// Обработчики событий
document.getElementById('excursionDate').addEventListener('change', calculateExcursionPrice);
document.getElementById('excursionTime').addEventListener('change', calculateExcursionPrice);
document.getElementById('excursionDuration').addEventListener('change', calculateExcursionPrice);
document.getElementById('groupSize').addEventListener('change', calculateExcursionPrice);
document.getElementById('discountCheckbox').addEventListener('click', calculateExcursionPrice);
document.getElementById('souvenirCheckbox').addEventListener('click', calculateExcursionPrice);





// Функция для отправки POST-запроса
async function sendPostRequest() {
    const orderForm = document.getElementById('order-form');

    orderForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы (отправку)

        // Собираем данные из формы
        const formData = {
            date: document.getElementById('excursionDate').value,
            duration: parseInt(document.getElementById('excursionDuration').value),
            guide_id: selectedData[1].id,
            id: selectedData[0].id + selectedData[1].id,
            optionFirst: document.getElementById('discountCheckbox').checked,
            optionSecond: document.getElementById('souvenirCheckbox').checked,
            persons: parseInt(document.getElementById('groupSize').value),
            price: Math.round(parseFloat(document.getElementById('totalCost').value)),
            route_id: selectedData[0].id,
            student_id: 34,
            time: document.getElementById('excursionTime').value
        };
        console.log(formData);

        // Отправляем POST-запрос
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=${api_key}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                // Обрабатываем результат выполнения операции (data.newItem)
                console.log(data.newItem);

                // Показываем уведомление пользователю
                alert('Заявка успешно отправлена!');
            } else {
                console.error('Ошибка при отправке запроса:', xhr.statusText);
                // Показываем уведомление об ошибке
                alert('Произошла ошибка при отправке запроса. Пожалуйста, попробуйте ещё раз.');
            }
        };
        xhr.onerror = function () {
            console.error('Ошибка при отправке запроса:', xhr.statusText);
            // Показываем уведомление об ошибке
            alert('Произошла ошибка при отправке запроса. Пожалуйста, попробуйте ещё раз.');
        };
        xhr.send(JSON.stringify(formData));
    });
}

// Вызовите функцию при нажатии на кнопку "Отправить"
document.getElementById('view-order-btn').addEventListener('click', sendPostRequest);








