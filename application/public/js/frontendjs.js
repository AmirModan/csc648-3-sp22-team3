/******************************************************************************
*
* JS File used to handle front-end event changes, may add more
* functions for future implementations
*   
* Author(s): Brian Cheng
*
******************************************************************************/

/* This function allows us to submit search results outside of the form itself */
function submitExternal() {
    let formElement = document.getElementById('search-bar');
    formElement.submit();
}

function setFlashMessageFadeOut(flashMessageElement) {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() => {
            if (currentOpacity < 0.05) {
                clearInterval(timer);
                flashMessageElement.remove();
            }
            currentOpacity = currentOpacity - .05;
            flashMessageElement.style.opacity = currentOpacity;
        }, 50);
    }, 4000);
}

function addFlashFromFrontEnd(message) {
    let flashMessageDiv = document.createElement('div');
    let innerFlashDiv = document.createElement('div');
    let innerTextNode = document.createTextNode(message);
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);
    flashMessageDiv.setAttribute('id', 'flash-message');
    innerFlashDiv.setAttribute('class', 'alert alert-info');
    document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
    setFlashMessageFadeOut(flashMessageDiv);
}

flashElement = document.getElementById('flash-message');
if (flashElement) {
    setFlashMessageFadeOut(flashElement);
}