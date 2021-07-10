from django.http.response import JsonResponse, HttpResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt

import json
import requests

from urllib.parse import urlparse
from bs4 import BeautifulSoup as Soup

from classifiers.svm import classify as svmClassify

from classifiers.general import updateLabel_mongo

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

def ping(request):
    return JsonResponse({'result': 'OK'})

@csrf_exempt
def getWebsite(request):
    # https://webdesign.tutsplus.com/articles/quick-tip-set-relative-urls-with-the-base-tag--cms-21399
    body_unicode = request.body
    body = json.loads(body_unicode)

    # page = requests.get(body["url"]).text

    url = body["url"]

    # get soup 
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'}
    #this header is specific to me, but it will work for anyone. some websites will block the GET request if this header is not present
    website = requests.get(url, headers=headers).content.decode()
    soup = Soup(website, features="lxml")
    
    page = downloadRawHTML(soup, url)
    conceptTerms = getConceptTerms(soup)
   
    return JsonResponse({"rawHTML": page, "conceptTerms": conceptTerms})

def downloadRawHTML(soup, url):
    # dynamic website code from Aziz: 
    
    head = soup.find('head')
    base = soup.new_tag('base')
    base_url ='http://'+ urlparse(url).netloc
    base['href'] = base_url
    head.insert(1, base)
    contents = str(soup)
    return contents

def getConceptTerms(soup):
    for script in soup(["script", "style", "button"]):                   
        script.decompose()  

    elems = soup.body.findAll(text=True, recursive=True) 

    # clean
    cleaned = []
    for elem in elems:
        elem = elem.strip()

        if elem != '\n' and elem != '':
            classifed = classifyConceptTerm(elem)
            cleaned.append((elem, classifed))
        
    return cleaned

def classifyConceptTerm(concept_term):
    return svmClassify(concept_term)


@csrf_exempt
def updateLabel(request):
    body_unicode = request.body
    body = json.loads(body_unicode)

    text = body["text"]
    label = body["label"]

    updateLabel_mongo(text, label)

    # todo, error catching and stuff
    return HttpResponse(status=200)