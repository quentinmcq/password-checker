browser.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.cmd === 'getState') {
            let state = false;
            const passwordChecker = JSON.parse(localStorage.getItem('password_checker'));

            try {
                state = passwordChecker ?? false;
            } catch (e) {
                console.error(e);
            }

            sendResponse({state});
        }
    }
)