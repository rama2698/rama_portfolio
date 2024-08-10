# utils.py (or any other file where you want to put this function)

from django.core.mail import send_mail
from django.conf import settings

def sendEmail(subject, message, recipient_list):
    print(subject, message, settings.EMAIL_HOST_USER, recipient_list)
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            recipient_list
        )
    except Exception as e:
        print(e)

    print("sent email")
