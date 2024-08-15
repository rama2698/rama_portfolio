from django.shortcuts import render
from django.urls import reverse
from django.test import Client

def myPortfolio(request):
    client = Client()
    portfolioApiUrl = reverse('getAllPortfolioData')
    headers = {
        'Accept': 'application/json, text/html; charset=utf-8',
        'Content-Type': 'application/json'
    }
    portfolioResponse = client.get(portfolioApiUrl+"?device="+request.device_type, headers=headers).json()
    portfolioResponse['device'] = request.device_type
    return render(request, 'portfolio/myPortfolio.html', portfolioResponse)
