const generatePassword = passwordLength => {
    let chars = '';
    let password = '';

    const passwordLetter = document.getElementById('password-letter');
    const passwordNumber = document.getElementById('password-number');

    if (passwordLetter.checked) {
        chars += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }

    if (passwordNumber.checked) {
        chars += '012345678';
    }

    if (!passwordLetter.checked && !passwordNumber.checked) {
        chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    }


    for (let i = 0; i <= passwordLength; i++) {
        const randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }

    return password;
}

const passwordRegenerateClickHandler = () => {
    const generatorInput = document.getElementById('password-generator-input');
    const lengthInput = document.getElementById('password-length');
    const lengthText = document.getElementById('password-length-text');

    const passwordNumber = document.getElementById('password-number');
    const passwordLetter = document.getElementById('password-letter');

    generatorInput.value = generatePassword(lengthInput.value);

    try {
        localStorage.setItem('password_length', JSON.stringify(lengthInput.value));
        localStorage.setItem('password_number', passwordNumber.checked);
        localStorage.setItem('password_letter', passwordLetter.checked);
    } catch (e) {
        console.error(e);
    }

    lengthText.innerHTML = lengthInput.value;
}

window.onload = () => {
    const checkSwitcher = document.getElementById('password-check');
    const lengthInput = document.getElementById('password-length');
    const regenerateButton = document.getElementById('password-regenerate');
    const passwordLetter = document.getElementById('password-letter');
    const passwordNumber = document.getElementById('password-number');

    const saveCheckerState = JSON.parse(localStorage.getItem('password_checker'));
    const savePasswordLength = JSON.parse(localStorage.getItem('password_length'));
    const savePasswordNumber = JSON.parse(localStorage.getItem('password_number'));
    const savePasswordLetter = JSON.parse(localStorage.getItem('password_letter'));

    // Save the state of values when clicking outside the interface
    checkSwitcher.checked = saveCheckerState ?? false;
    passwordNumber.checked = savePasswordNumber ?? false;
    passwordLetter.checked = savePasswordLetter ?? false;
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
    });

    // Generate a new password each time we refresh the page
    passwordRegenerateClickHandler();

    // Regenerate a new password on click
    regenerateButton.addEventListener('click', passwordRegenerateClickHandler);

    // Create new password each time we move the slider
    lengthInput.addEventListener('input', passwordRegenerateClickHandler);

    passwordNumber.addEventListener('click', passwordRegenerateClickHandler);
    passwordLetter.addEventListener('click', passwordRegenerateClickHandler);
}