from django.shortcuts import render
from django.http import JsonResponse
from api.models import WebsiteContent, Skill, Experience, Project, ContactResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import changeImageBasepath, projectsDesc
import math, json

# Create your views here.
def getAllSkills(request):
    device = request.GET.get('device')
    skillsObject = WebsiteContent.objects.filter(type='skills')
    skillsObjectDict = list(skillsObject.values())
    iteration = math.ceil(skillsObject.count() / 3) if device == 'mobile' else math.ceil(skillsObject.count() / 10) if device == 'desktop' else math.ceil(skillsObject.count() / 5)
    sliceCount = 3 if device == 'mobile' else 10 if device == 'desktop' else 5
    response = {
        'skills': {}
    }
    for i in range(iteration):
        initialIndex = i * sliceCount
        response['skills']['skillsRow-' + str(i+1)] = skillsObjectDict[initialIndex : initialIndex + sliceCount]
    skillsBackgroundObj = WebsiteContent.objects.filter(type='skillsBG')
    skillsBackground = list(skillsBackgroundObj.values())
    response['skillsBackground'] = 'https://storage.googleapis.com/portfolio-2698/' + skillsBackground[0]['imageUrl']

    return JsonResponse(response, safe=False)

def getAllExperience(request):
    experiences = Experience.objects.all().order_by('-id')
    return JsonResponse({"experiences": list(experiences.values())}, safe=False)
    

def getAllProjects(request):
    projects = Project.objects.all().order_by('-id')
    return JsonResponse({"projects": list(projects.values())}, safe=False)

def getAllPortfolioData(request):
    responseData = {
        "settings": {
            "borderStyle": {}
        }
    }
    # border style data
    borderStyleResponse = WebsiteContent.objects.filter(type='borderStyle').first() or ''
    if borderStyleResponse:
        borderStyleData = borderStyleResponse.description.split(',')
        for borderStyle in borderStyleData:
            styleType = borderStyle.split("=")
            responseData['settings']["borderStyle"][styleType[0]] = styleType[1]

    # homepage carousel data
    homepageIntroTextResponse = WebsiteContent.objects.filter(type='homepage').first() or ''
    homepageSocialLinksResponse = WebsiteContent.objects.filter(type='socialLinks')
    homepageSocialLinks = list(homepageSocialLinksResponse.values())
    sanitizedSocialLinks = []
    for link in homepageSocialLinks:
        linkObj = {
            "title": link['title'],
            "url": link['description'],
            "icon": link['info']
        }
        sanitizedSocialLinks.append(linkObj)
    responseData['homepage'] = {
        "introText": homepageIntroTextResponse.description if homepageIntroTextResponse else '',
        "socialLinks": sanitizedSocialLinks
    }
    # overview data
    overviewResponse = WebsiteContent.objects.filter(type='overview').first() or ''
    responseData['overview'] = {
        "overviewDesc": overviewResponse.description if overviewResponse else ''
    }
    # skills data
    device = request.GET.get('device')
    skillsObject = Skill.objects.all().order_by('priority')
    skillsObjectDict = list(skillsObject.values())
    iteration = math.ceil(skillsObject.count() / 4) if device == 'mobile' else math.ceil(skillsObject.count() / 8) if device == 'desktop' else math.ceil(skillsObject.count() / 6)
    sliceCount = 4 if device == 'mobile' else 8 if device == 'desktop' else 6
    skillsResponse = {
        'skillsData': {}
    }
    for i in range(iteration):
        initialIndex = i * sliceCount
        skillsResponse['skillsData']['skillsRow-' + str(i+1)] = changeImageBasepath(skillsObjectDict[initialIndex : initialIndex + sliceCount], ['imageUrl'])
    responseData['skills'] = {
        "skillsData": skillsResponse['skillsData']
    }
    # project data
    projectsResponse = Project.objects.all().order_by('-id')
    projectsDetailResponse = WebsiteContent.objects.filter(type='projects').first() or ""
    projectsData = changeImageBasepath(list(projectsResponse.values()), ['imageUrl'], 'project')
    responseData["projects"] = {
        "projectsDesc": projectsDetailResponse.description if projectsDetailResponse else projectsDesc,
        "projectsData": projectsData
    }
    # experience data
    experiencesResponse = Experience.objects.all().order_by('-id')
    experiencesData = changeImageBasepath(list(experiencesResponse.values()), ['iconUrl', 'imageUrl'], 'experience')
    responseData['experiences'] = {
        "experienceData": experiencesData
    }
    if experiencesData and not responseData["homepage"]["introText"]:
        responseData["homepage"]["introText"] = "Hi, I'm Ramanand Bhagat working as a " + str(experiencesData[0]['designation']) + " at " + str(experiencesData[0]['company'])
    return JsonResponse(responseData)

@csrf_exempt
def sendMail(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            subject = data.get('subject')
            message = data.get('message')
            contactResponse = ContactResponse(name=name, email=email, subject=subject, message=message)
            contactResponse.save()
            return JsonResponse({"message": "sent Successfully!"})
        except:
            return JsonResponse({"Error" : "Something Went Wrong!"})
    return JsonResponse({"Error" : "Something Went Wrong!"})
