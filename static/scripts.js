// //Функция для получения времени и даты

function updateTime() {
    const now = new Date()
    const timeString = now.toLocaleTimeString('ru-Ru');
    const dateString = now.toLocaleDateString('ru-Ru', {
        weekday: 'long', day: 'numeric', month: 'long',
    });

    document.getElementById('time').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}
setInterval(updateTime, 1000)


// Функция для отображения погоды

const URL = `https://api.openweathermap.org/data/2.5/`
const API_KEY = '784b6aa8319e639080f53150b0d20e4d';
const defaultCity = 'Краснодар';
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const displayWeather = document.getElementById('display-weather');

const displayWeatherData = (data) => {
    const weatherDescription = data.weather[0].description;
    const weatherDescriptionUpper = weatherDescription.toUpperCase();

    displayWeather.innerHTML = `
        <h2>${data.name}</h2>
        <h3>${Math.round(data.main.temp)}°C</h3>
        <h4>${weatherDescriptionUpper}</h4>
    `;
};


// Функция для поиска погоды

const searchWeather = async (city) => {

    const res = await fetch(`${URL}weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`);
    const data = await res.json();

    if (res.status === 404) {
        displayWeather.innerHTML = `<h3>Такой город не найден. Попробуйте ещё раз.</h3>`;
        console.error(`Ошибка: ${data.message}`);
    }
    if (res.ok) {
        displayWeatherData(data);
    } else {
        displayWeather.innerHTML = `<h3>Ошибка сервера. Попробуйте позже снова.</h3>`;
        console.error(`Ошибка: ${data.message}`);
    }
};

// Функция для получения погоды по геолокации
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

const getWeatherByGeolocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const locationUrl = `${URL}weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`;

            try {
                const res = await fetch(locationUrl);
                const data = await res.json();

                if (data.error) {
                    displayWeather.innerHTML = `<h3>Город по геолокации не найден. Используется город по умолчанию.</h3>`;
                    searchWeather(defaultCity);
                } else {
                    displayWeatherData(data); // Отображаем данные о погоде по геолокации
                }
            } catch (error) {
                displayWeather.innerHTML = `<h3>Ошибка при получении геолокации. Используется город по умолчанию.</h3>`;
                searchWeather(defaultCity);
            }
        }, () => {
            displayWeather.innerHTML = `<h3>Геолокация недоступна. Используется город по умолчанию.</h3>`;
            searchWeather(defaultCity);
        });
    } else {
        displayWeather.innerHTML = `<h3>Ваш браузер не поддерживает геолокацию. Используется город по умолчанию.</h3>`;
        searchWeather(defaultCity);
    }
};

// Отображаем погоду для города по умолчанию или по геолокации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedCity = localStorage.getItem('city');

    if (savedCity) {
        searchWeather(savedCity);
    } else {
        getWeatherByGeolocation(); // Используем геолокацию, если город не сохранен
    }
});

// Обработчик кнопки для ввода города
submitBtn.addEventListener('click', () => {
    const city = userInput.value.trim();

    if (city) {
        searchWeather(city); // Запрашиваем погоду для введенного города
        localStorage.setItem('city', city); // Сохраняем город в localStorage
    } else {
        displayWeather.innerHTML = `<h3>Пожалуйста, введите название города.</h3>`;
    }
});

// Обработчик ввода через клавишу Enter
userInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        const city = userInput.value.trim();

        if (city) {
            searchWeather(city); // Запрашиваем погоду для введенного города
            localStorage.setItem('city', city); // Сохраняем город в localStorage
        } else {
            displayWeather.innerHTML = `<h3>Пожалуйста, введите название города.</h3>`;
        }
    }
});

// Функция для смены фона
function changeBackground() {
    const now = new Date();
    const hours = now.getHours();
    let backgroundUrl = '';

    if (hours >= 0 && hours < 6) {
        backgroundUrl = '/static/img/01.jpg';
    } else if (hours >= 6 && hours < 12) {
        backgroundUrl = '/static/img/02.jpg';
    } else if (hours >= 12 && hours < 18) {
        backgroundUrl = '/static/img/03.jpg';
    } else {
        backgroundUrl = 'static/img/04.jpg';
    }

    document.body.style.backgroundImage = `url(${backgroundUrl})`;
}

changeBackground();


// Для блока задач

const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

function addTask() {
    const taskText = taskInput.value.trim();
    const removeTaskBtnText = 'Удалить';
    if (taskText === '') {
        alert('Задача не может быть пустой!');
        return;
    }
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item task-item';
    taskItem.innerHTML = `
        <span><input type="checkbox" class="task-checkbox"/> ${taskText}</span>        
        <button class="delete-task btn btn-danger btn-sm">${removeTaskBtnText}</button>
    `;
    taskList.appendChild(taskItem);

    taskInput.value = '';
}

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

taskList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-task')) {
        event.target.parentElement.remove();
    }
});
