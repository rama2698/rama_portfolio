from django.urls import path
from . import views

urlpatterns = [
    path('skills/all', views.getAllSkills, name='getAllSkills'),
    path('experience/all', views.getAllExperience, name='getAllExperience'),
    path('projects/all', views.getAllProjects, name='getAllProject'),
    path('get/portfolio-data', views.getAllPortfolioData, name='getAllPortfolioData'),
    path('send-mail', views.sendMail, name='sendMail'),
]