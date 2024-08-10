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
defaultBorderStyle = {
    "branchColor": "#dee1e4",
    "leafOutlineColor": "#dee1e4",
    "leafColor": "#dee1e4",
    "mainVeinColor": "#dee1e4",
    "sideVeinColor": "#dee1e4"
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

def sanitizeBorderData(topBorder, botBorder):
    obj = {
        "top": {},
        "bot": {},
    }
    if topBorder:
        for style in topBorder:
            styleType = style.split("=")
            obj['top'][styleType[0]] = styleType[1]
    else:
        obj['top'] = defaultBorderStyle
    if botBorder:
        for style in botBorder:
            styleType = style.split("=")
            obj['bot'][styleType[0]] = styleType[1]
    else:
        obj['bot'] = defaultBorderStyle
    return obj

def getBorderStyleData(projectData, expData):
    borderObj = {
        "projectTopBorderStyle": {},
        "projectBotBorderStyle": {},
        "expTopBorderStyle": {},
        "expBotBorderStyle": {}
    }
    if projectData:
        projectBorderStyle = projectData.description.split('&&')
        projectTopBorder = projectBorderStyle[0] if len(projectBorderStyle) > 1 else None
        projectBotBorder = projectBorderStyle[1] if len(projectBorderStyle) >= 2 else None
        projectTopStyle = projectTopBorder.split(",") if projectTopBorder else []
        projectBotStyle = projectBotBorder.split(",") if projectBotBorder else []
        projectStyle = sanitizeBorderData(projectTopStyle, projectBotStyle)
        borderObj["projectTopBorderStyle"] = projectStyle['top']
        borderObj["projectBotBorderStyle"] = projectStyle['bot']
    else:
        borderObj["projectTopBorderStyle"] = defaultBorderStyle
        borderObj["projectBotBorderStyle"] = defaultBorderStyle
    if expData:
        expBorderStyle = expData.description.split('&&')
        expTopBorder = expBorderStyle[0] if len(expBorderStyle) > 1 else None
        expBotBorder = expBorderStyle[1] if len(expBorderStyle) >= 2 else None
        expTopStyle = expTopBorder.split(",") if expTopBorder else []
        expBotStyle = expBotBorder.split(",") if expBotBorder else []
        expStyle = sanitizeBorderData(expTopStyle, expBotStyle)
        borderObj["expTopBorderStyle"] = expStyle['top']
        borderObj["expBotBorderStyle"] = expStyle['bot']
    else:
        borderObj["expTopBorderStyle"] = defaultBorderStyle
        borderObj["expBotBorderStyle"] = defaultBorderStyle

    return borderObj

projectsDesc = "These projects demonstrate my expertise with practical examples of some of my work, including brief descriptions and links to code repositories and live demos. They showcase my ability to tackle intricate challenges, adapt to various technologies, and efficiently oversee projects."

