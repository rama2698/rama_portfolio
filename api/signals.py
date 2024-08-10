# signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from api.models import ContactResponse
from api.sendEmail import sendEmail

@receiver(post_save, sender=ContactResponse)
def send_email_notification(sender, instance, created, **kwargs):
    if created:
        subject = f'New {sender.__name__} Record Created'
        message = f'A new {sender.__name__} record has been created.\n\nDetails:\n{instance}'
        recipient_list = ['ramanandbhagat79@gmail.com']  # Replace with the actual recipient email address
        print("sending mail")
        sendEmail(subject, message, recipient_list)
