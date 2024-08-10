from django.shortcuts import render
from django.urls import reverse
from django.test import Client

def myPortfolio(request):
    client = Client()
    portfolioApiUrl = reverse('getAllPortfolioData')
    portfolioResponse = client.get(portfolioApiUrl, {"device": request.device_type}).json()
    portfolioResponse['device'] = request.device_type
    return render(request, 'portfolio/myPortfolio.html', portfolioResponse)
