from django.contrib import admin
from api.models import WebsiteContent, Skill, Experience, Project, ContactResponse
# Register your models here.
admin.site.register(WebsiteContent)
admin.site.register(Skill)
admin.site.register(Experience)
admin.site.register(Project)
admin.site.register(ContactResponse)