from django.db import models

# Create your models here.
class WebsiteContent(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    type = models.CharField(max_length=255)
    info = models.CharField(max_length=255, blank=True, default="")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    imageUrl = models.ImageField(upload_to='2698/', blank=True)
    fileUrl = models.FileField(upload_to='files/', blank=True, default="")

    def __str__(self):
        return self.type + " : " + self.title
    
class Skill(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    priority = models.IntegerField(blank=False, null=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    imageUrl = models.ImageField(upload_to='2698/', blank=False, null=False)

    def __str__(self):
        return str(self.priority) + " : " + self.title
    

class Experience(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    designation = models.CharField(max_length=500)
    company = models.CharField(max_length=500)
    duration = models.CharField(max_length=500)
    skills = models.CharField(max_length=1000, blank=True)
    description = models.TextField(blank=True)
    iconUrl = models.ImageField(upload_to='2698/', blank=True)
    iconSize = models.CharField(max_length=10, blank=True, default="0x0")
    imageUrl = models.ImageField(upload_to='2698/', blank=True)

    def __str__(self):
        return self.designation + " at " + self.company
    

class Project(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, default="")
    imageUrl = models.ImageField(upload_to='2698/', blank=True)
    gitUrl = models.CharField(max_length=500, blank=True, default="")
    liveUrl = models.CharField(max_length=500, blank=True, default="")

    def __str__(self):
        return self.title
    
class ContactResponse(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    message = models.TextField()

    def __str__(self):
        return self.subject + " By " + self.email

