from user_agents import parse
import platform

class PlatformDetection:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user_agent_str = request.META.get('HTTP_USER_AGENT', '')
        user_agent = parse(user_agent_str)

        # Determine device type based on parsed user agent
        if user_agent.is_mobile:
            request.device_type = 'mobile'
            
        elif user_agent.is_tablet:
            request.device_type = 'tablet'
        else:
            request.device_type = 'desktop'

        # Example: Accessing OS and Browser details
        request.os_type = user_agent.os.family
        request.browser_info = user_agent.browser.family

        response = self.get_response(request)
        return response
