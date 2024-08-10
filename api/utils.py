# constants
defaultImageUrls = {
    "project": {
        "imageUrl": "2698:img:project-card-bg.jpg"
    },
    "experience": {
        "iconUrl": "2698:img:exp-icon.png",
        "imageUrl": "2698:img:exp-bg.png",
    }
}

def changeImageBasepath(objects, fields, type=None):
    for object in objects:
        for field in fields:
            if(field in object):
                object[field] = object[field].replace('/', ':img:') if object[field] else defaultImageUrls[type][field]
        if type == 'experience':
            iconSizeStr = object['iconSize'].split('x') if object['iconSize'] else [25, 25]
            object['iconWidth'] = iconSizeStr[0]
            object['iconHeight'] = iconSizeStr[1]
            object['skills'] = object['skills'].split(',')
            del object['iconSize']

                
    return objects

projectsDesc = "These projects demonstrate my expertise with practical examples of some of my work, including brief descriptions and links to code repositories and live demos. They showcase my ability to tackle intricate challenges, adapt to various technologies, and efficiently oversee projects."

