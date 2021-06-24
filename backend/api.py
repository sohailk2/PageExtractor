"""A basic (single function) API written using hug"""
import hug
import requests
from hug_middleware_cors import CORSMiddleware

api = hug.API(__name__)
api.http.add_middleware(CORSMiddleware(api))

def cors_support(response, *args, **kwargs):
    response.set_header('Access-Control-Allow-Origin', '*')

@hug.get('/getWebsite')
def getWebsite(cors, url):
    return requests.get(url).text