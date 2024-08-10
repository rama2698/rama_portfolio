const projectCardPrefix = ['mobile', 'tablet'].includes(device) ? 'mb-' : '';
// cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// =============================SKILLS VIEW====================================
//function to create skill object
const setupSkillsData = (imageUrl, skillsCount, index, classId, cubeSize, titleText) => {
    // create scene
    const scene = new THREE.Scene();
    // Create the camera with an adjusted field of view
    const camera = new THREE.PerspectiveCamera(78, 1, 0.1, 1000);
    // Adjust camera distance to fit the cube perfectly within the canvas
    camera.position.z = 1.6;
    // Create the renderer with alpha enabled for transparency
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    // Set size
    renderer.setSize(cubeSize, cubeSize);
    // Set title attribute for tooltip
    renderer.domElement.title = titleText;
    //appending the skill object created
    document.getElementById(classId).appendChild(renderer.domElement);
    // Load the texture
    const textureLoader = new THREE.TextureLoader();

    //loading the texture and rotation
    const texture = textureLoader.load(imageUrl, () => {
        // Create a geometry with size 1.2 to fit the cube within the canvas
        const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        // Create a material with the texture
        const material = new THREE.MeshBasicMaterial({ map: texture});
        // Create a mesh
        const cube = new THREE.Mesh(geometry, material);
        // Add the mesh to the scene
        scene.add(cube);

        // Animation loop function
        function animate() {
            requestAnimationFrame(animate);
            // Rotate the cube
            if(skillsCount % 2 === 0){
                if(skillsCount / 2 > index){
                    cube.rotation.y += 0.009;
                }
                else {
                    cube.rotation.y -= 0.009;
                }
            }
            else {
                if(Math.floor(skillsCount / 2) > index){
                    cube.rotation.y += 0.009;
                }
                else if(Math.floor(skillsCount / 2) < index) {
                    cube.rotation.y -= 0.009;
                }
                else {
                    cube.rotation.x += 0.009;
                }
            }
            // Render the scene
            renderer.render(scene, camera);
        }
        // Start the animation loop
        animate();
    });
};

//iteration for creating skills objects
const loadSkillsIcons = () => {
    Object.keys(skillsObj).forEach(function(skillObj, row) {
        const skillsCount = skillsObj[skillObj].length;
        const device = localStorage.getItem('Device') || 'tablet';
        const newSkillsDiv = document.createElement('div');
        const classId = "rb-skills-col-" + device + '-' + row;
        newSkillsDiv.classList.add('rb-col-100', 'rb-row-flex', 'rb-justify-center', 'rb-skills-col', 'rb-gap-10', 'rb-flex-wrap');
        newSkillsDiv.setAttribute('id', classId);
        const cubeSize = (device === 'mobile') ? 90 : (device === 'tablet') ? 110 : 120;
        document.getElementById("rb-skills-block").appendChild(newSkillsDiv);
        // Iterate through each skill in the row
        skillsObj[skillObj].forEach(function(skill, index) {
            var imageUrl = "api/static/" + skill.imageUrl;
            setupSkillsData(imageUrl, skillsCount, index, classId, cubeSize, skill.title);
            
        });
    });
}

// =================================================================

// ==========================PROJECT VIEW=======================================
// handle project card open close
let lastProjectCardOpen = "rb";
const lastCardId = localStorage.getItem("LastCardOpened");
if(lastCardId && ((['mobile', 'tablet'].includes(device) && lastCardId.includes('mb') || (!['mobile', 'tablet'].includes(device) && !lastCardId.includes('mb'))))) {
    lastProjectCardOpen = lastCardId;
}
else if (lastCardId && (['mobile', 'tablet'].includes(device) && !lastCardId.includes('mb'))) {
    lastProjectCardOpen = '#rb-mb-project-card-' + lastCardId.slice(-1);
}
else if (lastCardId && (!['mobile', 'tablet'].includes(device) && lastCardId.includes('mb'))) {
    lastProjectCardOpen = '#rb-project-card-' + lastCardId.slice(-1);
}
else {
    lastProjectCardOpen = `#rb-${projectCardPrefix}project-card-0`;
}
const handleProjectOpen = (id, initialLoad=false) => {
    if(id !== lastProjectCardOpen || initialLoad) {
        localStorage.setItem('LastCardOpened', id);
        const openedProjectCard = document.querySelector(lastProjectCardOpen);
        
        if(openedProjectCard && !initialLoad) {
            const openedProjectTitle = openedProjectCard.querySelector(`.rb-${projectCardPrefix}project-card-title`);
            const openedProjectCardOverlay = openedProjectCard.querySelector(`.rb-${projectCardPrefix}project-card-overlay`);
            openedProjectCardOverlay.classList.remove(`rb-${projectCardPrefix}project-card-overlay-open`);
            openedProjectCard.classList.remove(`rb-${projectCardPrefix}project-open`);
            openedProjectCard.classList.add(`rb-${projectCardPrefix}project-close`);
            openedProjectTitle.classList.remove(`rb-${projectCardPrefix}project-title-open`);
            openedProjectTitle.classList.add(`rb-${projectCardPrefix}project-title-close`);
        }
        const openNewProjectCard = document.querySelector(id);
        if(openNewProjectCard) {
            const projectTitle = openNewProjectCard.querySelector(`.rb-${projectCardPrefix}project-card-title`);
            const openNewProjectCardOverlay = openNewProjectCard.querySelector(`.rb-${projectCardPrefix}project-card-overlay`);
            openNewProjectCard.classList.add(`rb-${projectCardPrefix}project-open`);
            projectTitle.classList.remove(`rb-${projectCardPrefix}project-title-close`);
            projectTitle.classList.add(`rb-${projectCardPrefix}project-title-open`);
            lastProjectCardOpen = id;
            setTimeout(function() {
                if(!initialLoad) {
                    openedProjectCard.classList.remove(`rb-${projectCardPrefix}project-close`);
                }
                else {
                    lastProjectCardOpen = id;
                }
                openNewProjectCardOverlay.classList.add(`rb-${projectCardPrefix}project-card-overlay-open`);
            }, 2010);
        }
    }
};

// =================================================================

// ======================EXP VIEW===========================================
// handle experience modal open/close
const openExperienceModal = (experienceId) => {
    const experience = experiences.find(experience => experience.id === experienceId);
    const expModalDiv = document.querySelector('.rb-exp-modal');
    if(experience) {
        if(experience.imageUrl && device != 'mobile'){
            expModalDiv.querySelector('.rb-exp-modal-content').style.background = `url('/api/static/${experience.imageUrl}') no-repeat center center`;
        }
        expModalDiv.querySelector('.rb-exp-modal-content').style.backgroundSize = 'cover';
        expModalDiv.querySelector('.rb-exp-job-title').innerHTML = experience.designation + ' at ' + experience.company;
        expModalDiv.querySelector('.rb-exp-job-duration').innerHTML = experience.duration;
        const skills = experience.skills;
        let skillsBadges = "";
        skills.forEach(skill => {
            skillsBadges += "<span class='rb-skills-badge rb-bg-mid-blue rb-text-lightgoldenrodyellow rb-font-12'>" + skill + "</span>";
        });
        expModalDiv.querySelector('.rb-exp-job-skills-content').innerHTML = skillsBadges;
        expModalDiv.querySelector('.rb-exp-job-desc-content').innerHTML = experience.description;
    }
    expModalDiv.style.display = 'flex';
};
const closeExperienceModal = () => {
    const expModalDiv = document.querySelector('.rb-exp-modal');
    expModalDiv.style.display = 'none';
}

// =========================================================================

// scroll to width of viewport
const openDropdownMenu = () => {
    const dropdownContent = document.querySelector('.rb-dropdown-content');
    if(dropdownContent) {
        dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
    }
};
const scrollToViewport = (elementId) => {
    const target = document.getElementById(elementId);
    const offset = 74;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = targetPosition - offset;
    if(['mobile', 'tablet'].includes(device)) {
        const dropdownMenu = document.querySelector('.rb-dropdown-content');
        if(dropdownMenu) {
            dropdownMenu.style.display = "none";
        }
    }
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

// =========================on load function to check viewport========================================
// onload event
document.addEventListener('DOMContentLoaded', () => {
    // load skills icon
    loadSkillsIcons();

    // homepage container
    const homepageDiv = document.querySelector('.rb-homepage-container');
    const homepageNameDiv = homepageDiv.querySelector('.rb-vertical-text-name-transform') || null;
    const spanNameContents = homepageNameDiv ? homepageNameDiv.querySelectorAll('span') : [];
    const homepageSurnameDiv = homepageDiv.querySelector('.rb-vertical-text-surname-transform') || null;
    const spanSurnameContents = homepageSurnameDiv ? homepageSurnameDiv.querySelectorAll('span') : [];
    const homepageTextBackend = homepageDiv.querySelector('.rb-homepage-text-backend');
    const spanBackendContents = homepageTextBackend.querySelectorAll('span');
    const homepageTextFrontend = homepageDiv.querySelector('.rb-homepage-text-frontend');
    const spanFrontendContents = homepageTextFrontend.querySelectorAll('span');
    const homepageOutlinedTextFrontend = homepageDiv.querySelector('.rb-homepage-outlined-text-frontend');
    const spanOutlinedFrontendContents = homepageOutlinedTextFrontend.querySelectorAll('span');
    const homepageTextDeveloper = homepageDiv.querySelector('.rb-homepage-text-developer');
    const spanDeveloperContents = homepageTextDeveloper.querySelectorAll('span');
    const homepageTextFullstack = homepageDiv.querySelector('.rb-homepage-text-fullstack');
    const spanFullstackContents = homepageTextFullstack.querySelectorAll('span');
    const homepageOutlinedTextFullstack = homepageDiv.querySelector('.rb-homepage-outlined-text-fullstack');
    const spanOutlinedFullstackContents = homepageOutlinedTextFullstack.querySelectorAll('span');
    const homepageIntroTextDiv = document.querySelector('.rb-intro-text');
    const blinkText = document.querySelector('.rb-blinking-cursor');
    const pageHeader = document.querySelector('.rb-page-header');
    let openedHomepageDiv = false;
    let openedHomepageIntroDiv = false;
    let scrolledHeader = false;

    // typewriter
    let typewriter = null;
    let typewriterText = "";
    let j = 0;
    function typeWriter() {
        if (j < typewriterText.length) {
            typewriter.textContent = typewriterText.substring(0, j + 1);
            j++;
            setTimeout(typeWriter, 200);
        }
        else {
            setTimeout (() => {
                if (blinkText) {
                    blinkText.style.display = 'none';
                }
            }, 500);
        }
    } 
    const startTyping = (element, text, delay) => {
        setTimeout(() => {
            j = 0;
            typewriter = element;
            typewriterText = text;
            typeWriter();
        }, delay);
    };

    // overview div
    const overviewTextDiv = document.querySelector('.rb-overview-text');
    const overviewPositionDiv = document.querySelector('.rb-overview-positions');
    const overviewPositionCards = document.getElementsByClassName('rb-position-card');
    let openedOverviewText = false, openedOverviewPositions = false;

    // skills div
    const skillsDiv = document.querySelector('.rb-skills-container');
    const skillsColumn = skillsDiv.querySelectorAll('.rb-skills-col');
    let openedSkillsDiv = false;       
    
    // contact form div
    const contactFormHeader = document.querySelector('.rb-contact-form-header');
    const contactForm = document.querySelector('.rb-contact-form-transition');
    let openedContactDiv = false;
    let openedContactHeader = false;

    //experienc List div
    const experience = document.querySelector(`.rb-${projectCardPrefix}exp-container`);
    const experiencesDiv = experience.getElementsByClassName('rb-exp-block-transition');
    const experiencesBorderDiv = experience.getElementsByClassName('rb-exp-career-border');
    const expBotHorBranch = document.querySelector(`.rb-exp-bot-hor-branch-wave`);
    const expBotVerBranch = document.querySelector(`.rb-exp-bot-ver-branch-wave`);
    const expBotHorBranchLeaf = document.querySelectorAll('.rb-exp-bot-hor-leaf');
    const expBotVerBranchLeaf = document.querySelectorAll('.rb-exp-bot-ver-leaf');
    const expTopHorBranch = document.querySelector(`.rb-exp-top-hor-branch-wave`);
    const expTopVerBranch = document.querySelector(`.rb-exp-top-ver-branch-wave`);
    const expTopHorBranchLeaf = document.querySelectorAll('.rb-exp-top-hor-leaf');
    const expTopVerBranchLeaf = document.querySelectorAll('.rb-exp-top-ver-leaf');
    let openedexperiencesDiv = false;

    //project div
    const projectDiv = document.querySelector(`.rb-${projectCardPrefix}project-container`);
    const projectDivDesc = projectDiv.querySelector(`.rb-${projectCardPrefix}project-header-desc`);
    const projectCardDiv = projectDiv.querySelector(`.rb-${projectCardPrefix}project-card-container`);
    const projectCards = projectDiv.getElementsByClassName(`rb-${projectCardPrefix}project-card`);
    const projectBotHorBranch = projectDiv.querySelector(`.rb-project-bot-hor-branch-wave`);
    const projectBotVerBranch = projectDiv.querySelector(`.rb-project-bot-ver-branch-wave`);
    const projectBotHorBranchLeaf = projectDiv.querySelectorAll('.rb-project-bot-hor-leaf');
    const projectBotVerBranchLeaf = projectDiv.querySelectorAll('.rb-project-bot-ver-leaf');
    const projectTopHorBranch = projectDiv.querySelector(`.rb-project-top-hor-branch-wave`);
    const projectTopVerBranch = projectDiv.querySelector(`.rb-project-top-ver-branch-wave`);
    const projectTopHorBranchLeaf = projectDiv.querySelectorAll('.rb-project-top-hor-leaf');
    const projectTopVerBranchLeaf = projectDiv.querySelectorAll('.rb-project-top-ver-leaf');
    let openedProjectDescDiv = false;
    let openedProjectCardDiv = false;
    let projectCardTimeoutId = null;

    // adding styles for border animation
    let style = document.createElement('style');
    style.type = 'text/css';

    // Add CSS rules to the style element
    style.innerHTML = `
        .rb-exp-container {
            height: ${(experiencesDiv.length-1) * 170 + 110}px;
        }
        .rb-mb-project-card-container {
            height: ${projectCards.length * 100 + 350}px;
        }
        .rb-exp-career-border.rb-draw-border {
            animation: rb-draw-border-animation ${experiencesDiv.length * 2}s forwards;
            animation-timing-function: ease-in-out; 
        }
        @keyframes rb-draw-border-animation {
            from {
                height: 0px;
                opacity: 1;
            }
            to {
                height: ${(experiencesDiv.length-1) * 170 + 110}px;
                opacity: 1;
            }
        }
        @keyframes rb-removeborder-animation {
            from {
                height: ${experiencesDiv.length * 180}px;
                opacity: 1;
            }
            to {
                height: 0px;
                opacity: 0;
            }
        }
    `;

    // Append the style element to the head of the document
    document.head.appendChild(style);

    function checkVisibility() {
        // transparent header
        if (window.scrollY >= 75) {
            if(!scrolledHeader) {
                if(pageHeader) {
                    pageHeader.style.background = 'rgba(52, 58, 64, 0.95)';
                    scrolledHeader = true;
                }
            }
        }
        else {
            if(scrolledHeader) {
                if(pageHeader) {
                    pageHeader.style.background = 'rgb(52, 58, 64)';
                    scrolledHeader = false;
                }
            }
        }
        // homepage rect
        const homepageDivRect = homepageDiv.getBoundingClientRect();
        const homepageIntroTextRect = homepageIntroTextDiv.getBoundingClientRect();

        // overview rect
        const overviewTextRect = overviewTextDiv.getBoundingClientRect();
        const overviewPositionsRect = overviewPositionDiv.getBoundingClientRect();
        
        // skills rect
        const skillsDivRect = skillsDiv ? skillsDiv.getBoundingClientRect() : null;

        // contact form rect
        const contactFormHeaderRect = contactFormHeader.getBoundingClientRect();
        const contactFormRect = contactForm.getBoundingClientRect();

        // experience rect
        const experienceRect = experience.getBoundingClientRect();

        //project rect
        const projectDivDescRect = projectDivDesc.getBoundingClientRect();
        const projectCardDivRect = projectCardDiv.getBoundingClientRect();

        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

        // homepage div
        if (!(homepageDivRect.bottom < 0 || homepageDivRect.top - viewHeight >= 0)) {
            if(!openedHomepageDiv) {
                if(homepageTextBackend) {
                    spanBackendContents.forEach((spanContent) => {
                        spanContent.classList.add('rb-char-bg-pop-up');
                    });
                }
                if(homepageTextFrontend) {
                    spanFrontendContents.forEach((spanContent) => {
                        spanContent.classList.add('rb-char-bg-pop-up');
                    });
                }
                if(homepageOutlinedTextFrontend) {
                    spanOutlinedFrontendContents.forEach((spanContent) => {
                        spanContent.classList.add('rb-char-bg-pop-up');
                    });
                }
                if(homepageTextDeveloper) {
                    spanDeveloperContents.forEach((spanContent) => {
                        spanContent.classList.add('rb-char-bg-pop-up');
                    });
                }
                if(homepageTextFullstack) {
                    spanFullstackContents.forEach((spanContent) => {
                        spanContent.classList.add('rb-char-bg-pop-up');
                    });
                }
                if(homepageOutlinedTextFullstack) {
                    spanOutlinedFullstackContents.forEach((spanContent) => {
                        spanContent.classList.add('rb-char-bg-pop-up');
                    });
                }
                if(homepageNameDiv) {
                    spanNameContents.forEach((spanContent) => {
                        spanContent.classList.add('rb-char-pop-up');
                    });
                }
                if(homepageSurnameDiv) {
                    setTimeout(() => {
                        spanSurnameContents.forEach((spanContent) => {
                            spanContent.classList.add('rb-char-pop-up');
                        });
                    }, 3500);
                }
                openedHomepageDiv = true;
            }
        } else if(homepageDivRect.bottom < 0 || homepageDivRect.top - viewHeight >= 0) {
            if(openedHomepageDiv) {
                if(homepageTextBackend) {
                    spanBackendContents.forEach((spanContent) => {
                        spanContent.classList.remove('rb-char-bg-pop-up');
                    });
                }
                if(homepageTextFrontend) {
                    spanFrontendContents.forEach((spanContent) => {
                        spanContent.classList.remove('rb-char-bg-pop-up');
                    });
                }
                if(homepageOutlinedTextFrontend) {
                    spanOutlinedFrontendContents.forEach((spanContent) => {
                        spanContent.classList.remove('rb-char-bg-pop-up');
                    });
                }
                if(homepageTextDeveloper) {
                    spanDeveloperContents.forEach((spanContent) => {
                        spanContent.classList.remove('rb-char-bg-pop-up');
                    });
                }
                if(homepageTextFullstack) {
                    spanFullstackContents.forEach((spanContent) => {
                        spanContent.classList.remove('rb-char-bg-pop-up');
                    });
                }
                if(homepageOutlinedTextFullstack) {
                    spanOutlinedFullstackContents.forEach((spanContent) => {
                        spanContent.classList.remove('rb-char-bg-pop-up');
                    });
                }
                if(homepageNameDiv) {
                    spanNameContents.forEach((spanContent) => {
                        spanContent.classList.remove('rb-char-pop-up');
                    });
                }
                if(homepageSurnameDiv) {
                    spanSurnameContents.forEach((spanContent) => {
                        spanContent.classList.remove('rb-char-pop-up');
                    });
                }
                openedHomepageDiv = false;
            }
        }

        // homepage intro text
        if (!(homepageIntroTextRect.bottom < 0 || homepageIntroTextRect.top - viewHeight >= 0)) {
            if(! openedHomepageIntroDiv) {
                if(blinkText) {
                    blinkText.style.display = "inline-block";
                }
                if(homepageIntroTextDiv) {
                    startTyping(homepageIntroTextDiv, homepageIntroText, 500);
                }
                openedHomepageIntroDiv = true;
            }
        }

        // overview text
        if (!(overviewTextRect.bottom < 0 || overviewTextRect.top - viewHeight >= 0)) {
            if(! openedOverviewText) {
                if(overviewTextDiv) {
                    overviewTextDiv.classList.add('rb-pop-up');
                }
                openedOverviewText = true;
            }
        }
        else if(overviewTextRect.bottom < 0 || overviewTextRect.top - viewHeight >= 0) {
            if(openedOverviewText) {
                if(overviewTextDiv) {
                    overviewTextDiv.classList.remove('rb-pop-up');
                }
                openedOverviewText = false;
            }
        }

        // overview positions
        if (!(overviewPositionsRect.bottom < 0 || overviewPositionsRect.top - viewHeight >= 0)) {
            if(! openedOverviewPositions) {
                if(overviewPositionDiv) {
                    for (let i = 0; i < overviewPositionCards.length; i++) {
                        let position = overviewPositionCards[i];
                        position.classList.add(`rb-project-slide-in`);
                        position.style.cssText += `animation-delay: ${i}s;`;
                    }
                }
                openedOverviewPositions = true;
            }
        }
        else if(overviewPositionsRect.bottom < 0 || overviewPositionsRect.top - viewHeight >= 0) {
            if(openedOverviewPositions) {
                if(overviewPositionDiv) {
                    for (let i = 0; i < overviewPositionCards.length; i++) {
                        let position = overviewPositionCards[i];
                        position.classList.remove(`rb-project-slide-in`);
                    }
                }
                openedOverviewPositions = false;
            }
        }

        // skills div
        if (!(skillsDivRect.bottom < 0 || skillsDivRect.top - viewHeight >= 0)) {
            if(!openedSkillsDiv) {
                let skillsDelay = 0;
                skillsColumn.forEach((skillsCol) => {
                    mySkills = skillsCol.querySelectorAll('canvas');
                    mySkills.forEach((skill) => {
                        skill.classList.add('rb-skill-pop-up');
                        skill.style.animationDelay = `${skillsDelay}s`;
                        skillsDelay += 0.3;
                    });
                });
                openedSkillsDiv = true;
            }
        } else if(skillsDivRect.bottom < 0 || skillsDivRect.top - viewHeight >= 0) {
            if(openedSkillsDiv) {
                skillsColumn.forEach((skillsCol) => {
                    mySkills = skillsCol.querySelectorAll('canvas');
                    mySkills.forEach((skill) => {
                        skill.classList.remove('rb-skill-pop-up');
                    });
                });
                openedSkillsDiv = false;
            }
        }

        //contact form header
        if (!(contactFormHeaderRect.bottom < 0 || contactFormHeaderRect.top - viewHeight >= 0)) {
            if(!openedContactHeader) {
                contactFormHeader.classList.add('rb-pop-up');
                openedContactHeader = true;
            }
        } else if(contactFormHeaderRect.bottom < 0 || contactFormHeaderRect.top - viewHeight >= 0) {
            if(openedContactHeader) {
                contactFormHeader.classList.remove('rb-pop-up');
                openedContactHeader = false;
            }
        }

        // contact form
        if (!(contactFormRect.bottom < 0 || contactFormRect.top - viewHeight >= 0)) {
            if(!openedContactDiv) {
                contactForm.classList.add('rb-pop-up');
                openedContactDiv = true;
            }
        } else if(contactFormRect.bottom < 0 || contactFormRect.top - viewHeight >= 0) {
            if(openedContactDiv) {
                contactForm.classList.remove('rb-pop-up');
                openedContactDiv = false;
            }
        }

        // Experience card container
        if (!(experienceRect.bottom < 0 || experienceRect.top - viewHeight >= 0)) {
            if(!openedexperiencesDiv) {
                if(expBotHorBranch) {
                    expBotHorBranch.classList.add('rb-draw-branch');
                    for(let i = 0; i < expBotHorBranchLeaf.length; i++) {
                        let branchLeaf = expBotHorBranchLeaf[i];
                        branchLeaf.classList.add("rb-leaf-pop-up");
                        branchLeaf.style.animationDelay = `${i*0.11}s`;
                    }
                }
                if(expTopHorBranch) {
                    expTopHorBranch.classList.add('rb-draw-branch');
                    for(let i = 0; i < expTopHorBranchLeaf.length; i++) {
                        let branchLeaf = expTopHorBranchLeaf[i];
                        branchLeaf.classList.add("rb-leaf-pop-up");
                        branchLeaf.style.animationDelay = `${i*0.11}s`;
                    }
                }
                setTimeout(() => {
                    if(expBotVerBranch) {
                        expBotVerBranch.classList.add('rb-draw-branch');
                        for(let i = 0; i < expBotVerBranchLeaf.length; i++) {
                            let branchLeaf = expBotVerBranchLeaf[i];
                            branchLeaf.classList.add("rb-leaf-pop-up");
                            branchLeaf.style.animationDelay = `${i*0.11}s`;
                        }
                    }
                    if(expTopVerBranch) {
                        expTopVerBranch.classList.add('rb-draw-branch');
                        for(let i = 0; i < expTopVerBranchLeaf.length; i++) {
                            let branchLeaf = expTopVerBranchLeaf[i];
                            branchLeaf.classList.add("rb-leaf-pop-up");
                            branchLeaf.style.animationDelay = `${i*0.11}s`;
                        }
                    }
                }, 750);

                setTimeout(() => {
                    if(experiencesBorderDiv && !['mobile', 'tablet'].includes(device)) {
                        experiencesBorderDiv[0].classList.add('rb-draw-border');
                    }
                    for (let i = 0; i < experiencesDiv.length; i++) {
                        let expDiv = experiencesDiv[i];
                        let careerIcon = expDiv.querySelector('.rb-career-icon');
                        let triIcon = expDiv.querySelector('.rb-exp-tri-icon');
                        expDiv.classList.add(`rb-${projectCardPrefix}slide-in`);
                        expDiv.style.cssText += `animation-delay: ${i}s;`;
                        if(careerIcon) {
                            careerIcon.classList.add('rb-pop-up');
                            careerIcon.style.cssText = `animation-delay: ${i+2}s;`;
                        }
                        if(triIcon) {
                            triIcon.classList.add('rb-pop-up');
                            triIcon.style.cssText = `animation-delay: ${i+3}s;`;
                        }
                    }
                }, 1000);
                openedexperiencesDiv = true;
            }
        } else if(experienceRect.bottom < 0 || experienceRect.top - viewHeight >= 0) {
            if(openedexperiencesDiv) {
                if(experiencesBorderDiv && !['mobile', 'tablet'].includes(device)) {
                    experiencesBorderDiv[0].classList.remove('rb-draw-border');
                }
                for (let i = 0; i < experiencesDiv.length; i++) {
                    let expDiv = experiencesDiv[i];
                    expDiv.classList.remove(`rb-${projectCardPrefix}slide-in`);
                    let careerIcon = expDiv.querySelector('.rb-career-icon');
                    let triIcon = expDiv.querySelector('.rb-exp-tri-icon');
                    if (careerIcon) {
                        careerIcon.classList.remove('rb-pop-up');
                    }
                    if (triIcon) {
                        triIcon.classList.remove('rb-pop-up');
                    }
                }
                if(expBotHorBranch) {
                    expBotHorBranch.classList.remove('rb-draw-branch');
                }
                if(expBotVerBranch) {
                    expBotVerBranch.classList.remove('rb-draw-branch');
                }
                for(let i = 0; i < expBotHorBranchLeaf.length; i++) {
                    let branchLeaf = expBotHorBranchLeaf[i];
                    branchLeaf.classList.remove("rb-leaf-pop-up");
                }
                for(let i = 0; i < expBotVerBranchLeaf.length; i++) {
                    let branchLeaf = expBotVerBranchLeaf[i];
                    branchLeaf.classList.remove("rb-leaf-pop-up");
                }
                if(expTopHorBranch) {
                    expTopHorBranch.classList.remove('rb-draw-branch');
                }
                if(expTopVerBranch) {
                    expTopVerBranch.classList.remove('rb-draw-branch');
                }
                for(let i = 0; i < expTopHorBranchLeaf.length; i++) {
                    let branchLeaf = expTopHorBranchLeaf[i];
                    branchLeaf.classList.remove("rb-leaf-pop-up");
                }
                for(let i = 0; i < expTopVerBranchLeaf.length; i++) {
                    let branchLeaf = expTopVerBranchLeaf[i];
                    branchLeaf.classList.remove("rb-leaf-pop-up");
                }
                openedexperiencesDiv = false;
            }
        }

        // project desc description
        if (!(projectDivDescRect.bottom < 0 || projectDivDescRect.top - viewHeight >= 0)) {
            if(! openedProjectDescDiv) {
                if(projectDivDesc) {
                    projectDivDesc.classList.add('rb-pop-up');
                }
                openedProjectDescDiv = true;
            }
        }
        else if(projectDivDescRect.bottom < 0 || projectDivDescRect.top - viewHeight >= 0) {
            if(openedProjectDescDiv) {
                if(projectDivDesc) {
                    projectDivDesc.classList.remove('rb-pop-up');
                }
                openedProjectDescDiv = false;
            }
        }

        // project cards container
        if (!(projectCardDivRect.bottom < 0 || projectCardDivRect.top - viewHeight >= 0)) {
            if(! openedProjectCardDiv) {
                if(projectBotHorBranch) {
                    projectBotHorBranch.classList.add('rb-draw-branch');
                    for(let i = 0; i < projectBotHorBranchLeaf.length; i++) {
                        let branchLeaf = projectBotHorBranchLeaf[i];
                        branchLeaf.classList.add("rb-leaf-pop-up");
                        branchLeaf.style.animationDelay = `${i*0.11}s`;
                    }
                }
                if(projectTopHorBranch) {
                    projectTopHorBranch.classList.add('rb-draw-branch');
                    for(let i = 0; i < projectTopHorBranchLeaf.length; i++) {
                        let branchLeaf = projectTopHorBranchLeaf[i];
                        branchLeaf.classList.add("rb-leaf-pop-up");
                        branchLeaf.style.animationDelay = `${i*0.11}s`;
                    }
                }
                setTimeout(() => {
                    if(projectBotVerBranch) {
                        projectBotVerBranch.classList.add('rb-draw-branch');
                        for(let i = 0; i < projectBotVerBranchLeaf.length; i++) {
                            let branchLeaf = projectBotVerBranchLeaf[i];
                            branchLeaf.classList.add("rb-leaf-pop-up");
                            branchLeaf.style.animationDelay = `${i*0.1}s`;
                        }
                    }
                    if(projectTopVerBranch) {
                        projectTopVerBranch.classList.add('rb-draw-branch');
                        for(let i = 0; i < projectTopVerBranchLeaf.length; i++) {
                            let branchLeaf = projectTopVerBranchLeaf[i];
                            branchLeaf.classList.add("rb-leaf-pop-up");
                            branchLeaf.style.animationDelay = `${i*0.1}s`;
                        }
                    }
                }, 750);
                const lastProject = document.querySelector(lastProjectCardOpen);
                if(lastProject) {
                    lastProject.classList.remove(`rb-${projectCardPrefix}project-open`, `rb-${projectCardPrefix}project-close`);
                    lastProject.querySelector(`.rb-${projectCardPrefix}project-card-title`).classList.remove(`rb-${projectCardPrefix}project-title-open`);
                    lastProject.querySelector(`.rb-${projectCardPrefix}project-card-overlay`).classList.remove(`rb-${projectCardPrefix}project-card-overlay-open`);
                }
                for(let i = 0; i < projectCards.length; i++) {
                    let projectCard = projectCards[i];
                    projectCard.classList.remove('rb-project-slide-in', `rb-project-card-slided`);
                    projectCard.classList.add('rb-project-slide-in');
                    projectCard.style.cssText += `animation-delay: ${i+1.9}s;`;
                    projectCard.classList.remove('rb-project-slide-out');
                }
                projectCardTimeoutId = setTimeout(function() {
                    for(let i = 0; i < projectCards.length; i++) {
                        projectCards[i].classList.add('rb-project-card-slided');
                        projectCards[i].style.removeProperty('animation-delay');
                        projectCards[i].classList.remove('rb-project-slide-in');
                    }
                    if(lastProjectCardOpen == 'rb'){
                        handleProjectOpen(`#rb-${projectCardPrefix}project-card-0`, true);
                    }
                    else {
                        handleProjectOpen(lastProjectCardOpen, true);
                    }
                }, projectCards.length * 2000);
                openedProjectCardDiv = true;
            }
            
        } else if(projectCardDivRect.bottom < 0 || projectCardDivRect.top - viewHeight >= 0) {
            clearTimeout(projectCardTimeoutId);
            for(let i = 0; i < projectCards.length; i++) {
                let projectCard = projectCards[i];
                projectCard.classList.remove('rb-project-slide-in', `rb-project-card-slided`);
                projectCard.querySelector(`.rb-${projectCardPrefix}project-card-title`).classList.remove(`rb-${projectCardPrefix}project-title-open`);
                projectCard.querySelector(`.rb-${projectCardPrefix}project-card-overlay`).classList.remove(`rb-${projectCardPrefix}project-card-overlay-open`);

            }
            const lastProject = document.querySelector(lastProjectCardOpen);
            if(lastProject) {
                lastProject.classList.remove(`rb-${projectCardPrefix}project-open`, `rb-${projectCardPrefix}project-close`);
                lastProject.querySelector(`.rb-${projectCardPrefix}project-card-title`).classList.remove(`rb-${projectCardPrefix}project-title-open`);
                lastProject.querySelector(`.rb-${projectCardPrefix}project-card-overlay`).classList.remove(`rb-${projectCardPrefix}project-card-overlay-open`);
            }
            if(projectBotHorBranch) {
                projectBotHorBranch.classList.remove('rb-draw-branch');
            }
            if(projectBotVerBranch) {
                projectBotVerBranch.classList.remove('rb-draw-branch');
            }
            for(let i = 0; i < projectBotHorBranchLeaf.length; i++) {
                let branchLeaf = projectBotHorBranchLeaf[i];
                branchLeaf.classList.remove("rb-leaf-pop-up");
            }
            for(let i = 0; i < projectBotVerBranchLeaf.length; i++) {
                let branchLeaf = projectBotVerBranchLeaf[i];
                branchLeaf.classList.remove("rb-leaf-pop-up");
            }
            if(projectTopHorBranch) {
                projectTopHorBranch.classList.remove('rb-draw-branch');
            }
            if(projectTopVerBranch) {
                projectTopVerBranch.classList.remove('rb-draw-branch');
            }
            for(let i = 0; i < projectTopHorBranchLeaf.length; i++) {
                let branchLeaf = projectTopHorBranchLeaf[i];
                branchLeaf.classList.remove("rb-leaf-pop-up");
            }
            for(let i = 0; i < projectTopVerBranchLeaf.length; i++) {
                let branchLeaf = projectTopVerBranchLeaf[i];
                branchLeaf.classList.remove("rb-leaf-pop-up");
            }
            openedProjectCardDiv = false;
        }
    }

    document.addEventListener('scroll', checkVisibility);

    // Run the function once to check the initial position
    checkVisibility();

    // contact form
    document.getElementById('rb-form-send-mail').addEventListener('submit', function(event) {
        // Prevent form from submitting normally
        event.preventDefault();
        const messageContent = document.querySelector('.rb-msg');
    
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const body = message + "\n\nRegards,\n" + name + "\n" + email
        
        // Construction the mailto link
        const mailtoLink = 'mailto:ramanandbhagat79@gmail.com'
            + '?subject=' + encodeURIComponent(subject)
            + '&body=' + encodeURIComponent(body);
        
        // API URL
        const apiUrl = '/api/send-mail';
    
        // Data to send in API call
        var data = {
            name: name,
            email: email,
            subject: subject,
            message: message
        };
    
        // Make the API call
        fetch('/api/send-mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/html, utf-8',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            messageContent.classList.remove('rb-text-red', 'rb-text-success');
            messageContent.classList.add('rb-text-success');
            messageContent.innerHTML = "Message Sent Successfully!";
            document.getElementById('name').value = "";
            document.getElementById('email').value = "";
            document.getElementById('subject').value = "";
            document.getElementById('message').value = "";
            setTimeout(() => {
                messageContent.innerHTML = "";
            }, 2000);
        })
        .catch((error) => {
            messageContent.classList.remove('rb-text-success', 'tb-text-red');
            messageContent.classList.add('rb-text-red');
            messageContent.innerHTML = "Something went wrong! Please Try Again.";
            setTimeout(() => {
                messageContent.innerHTML = "";
            }, 2000);
        });
    });
});

// =================================================================
