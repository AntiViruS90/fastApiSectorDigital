from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import aiohttp


app = FastAPI()

app.mount('/static', StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

API_KEY = '784b6aa8319e639080f53150b0d20e4d'
DEFAULT_CITY = 'Краснодар'


@app.get("/")
async def home(req: Request):
    return templates.TemplateResponse("index.html", {"request": req})


@app.get("/weather")
async def get_weather(city: str):
    async with aiohttp.ClientSession() as session:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric&lang=ru"
        async with session.get(url) as response:
            data = await response.json()
            return data
