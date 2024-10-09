from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import aiohttp


app = FastAPI()

app.mount('/static', StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

API_KEY = 'd873d1e39c8e2d597fe431b3ab9aadea'
DEFAULT_CITY = 'Краснодар'


@app.get("/")
async def home(req: Request):
    return templates.TemplateResponse("index.html", {"request": req})


@app.get("/weather")
async def get_weather(city: str):
    async with aiohttp.ClientSession() as session:
        url = f"https://api.weatherstack.com/current?access_key={API_KEY}&query={city}"
        async with session.get(url) as response:
            data = await response.json()
            return data

# def fetch_weather(city: str):
#     url = f"https://api.weatherstack.com/current?access_key={API_KEY}&query={city}"
#     responce = requests.get(url)
#     data = responce.json()
#
#     if 'error' in data:
#         raise HTTPException(status_code=404, detail="Город не найден")
#
#     return {
#         "city": data['location']['name'],
#         "temperature": data['current']['temperature'],
#         "weather_description": data['current']['weather_descriptions'][0],
#         "weather_icon": data['current']['weather_icons'][0]
#     }
#
#
# @app.get("/weather/")
# async def get_weather(city: str = None):
#     if city:
#         return fetch_weather(city)
#     else:
#         fetch_weather(DEFAULT_CITY)
#
#
# @app.post("geolocation")
# async def get_weather_by_geolocation(request: Request):
#     try:
#         data = await request.json()
#         latitude = data.get("latitude")
#         longitude = data.get("longitude")
#
#         if not latitude or not longitude:
#             raise HTTPException(status_code=400, detail="Неверные координаты")
#
#         url = f"https://api.weatherstack.com/current?access_key={API_KEY}&query={latitude}, {longitude}"
#         response = requests.get(url)
#         weather_data = response.json()
#
#         if 'error' in weather_data:
#             raise HTTPException(status_code=404, detail="Локация не найдена")
#
#         return {
#             "city": weather_data['location']['name'],
#             "temperature": weather_data['current']['temperature'],
#             "weather_description": weather_data['current']['weather_descriptions'][0],
#             "weather_icon": weather_data['current']['weather_icons'][0]
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
#
# @app.get("/")
# async def root():
#     return {"message": "Welcome to the weather API"}
