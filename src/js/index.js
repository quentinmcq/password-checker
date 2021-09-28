const generatePassword = len => {
    let password = ''
    let character = ''

    while (len > password.length) {
        if (password.indexOf(character = String.fromCharCode(Math.floor(Math.random() * 94) + 33), Math.floor(password.length / 94) * 94) < 0) {
            password += character
        }
    }

    return password
}

const passwordRegenerateClickHandler = () => {
    const generatorInput = document.getElementById('password-generator-input')
    const lengthInput = document.getElementById('password-length')
    const lengthText = document.getElementById('password-length-text')

    generatorInput.value = generatePassword(lengthInput.value)

    try {
        localStorage.setItem('password_length', JSON.stringify(lengthInput.value))
    } catch (e) {
        console.error(e)
    }

    lengthText.innerHTML = lengthInput.value
}

window.onload = () => {
    const checkSwitcher = document.getElementById('password-check');
    const lengthInput = document.getElementById('password-length');
    const regenerateButton = document.getElementById('password-regenerate');

    const saveCheckerState = JSON.parse(localStorage.getItem('password_checker'));
    const savePasswordLength = JSON.parse(localStorage.getItem('password_length'));

    /**
     * Save the state of the switcher in the local storage
     * Save the choice length value for the password
     */
    checkSwitcher.checked = saveCheckerState ?? false
    lengthInput.value = savePasswordLength ?? 16;

    // On switcher change, we save the checker state in the local storage
    checkSwitcher.addEventListener('change', e => {
        // True or false
        const state = e.target.checked;

        try {
            localStorage.setItem('password_checker', JSON.stringify(state));
        } catch (e) {
            console.error(e);
        }

        // Send and save the checker state (in the case we refresh the page)
        browser.tabs.query({currentWindow: true, active: true}, tabs => {
            browser.tabs.sendMessage(tabs[0].id, {cmd: "setState", state});
        })
    })

    // Generate a new password each time we refresh the page
    passwordRegenerateClickHandler();

    // Regenerate a new password on click
    regenerateButton.addEventListener('click', passwordRegenerateClickHandler)

    // Create new password each time we move the slider
    lengthInput.addEventListener('input', passwordRegenerateClickHandler)
}