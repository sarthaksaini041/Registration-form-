document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const fileInput = document.getElementById('paymentScreenshot');
    const fileNameDisplay = document.getElementById('file-name');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    const formContainer = document.getElementById('form-container');
    const successContainer = document.getElementById('success-container');
    const globalError = document.getElementById('global-error');
    const copyUpiBtn = document.getElementById('copy-upi');
    const upiVal = document.getElementById('upi-val');

    // ========================================================
    // DYNAMIC CONFIGURATION LOADER
    // ========================================================
    // ========================================================
    // SECURE DYNAMIC CONFIGURATION LOADER
    // ========================================================
    const getSavedUrl = () => localStorage.getItem('SAVED_GOOGLE_SCRIPT_URL');
    
    const loadConfig = () => {
        const savedUrl = getSavedUrl();
        const hasConfigObject = typeof CONFIG !== 'undefined';

        if (!hasConfigObject && !savedUrl) {
            console.warn('Configuration Missing: Site is running in placeholder mode.');
            return false;
        }

        // Populate UI with Config Values (Priority: config.js > LocalStorage)
        const activeConfig = hasConfigObject ? CONFIG : {};
        
        if (upiVal) upiVal.textContent = activeConfig.UPI_ID || '9027808174@ptaxis';
        
        const price = activeConfig.PRICE_INR || '149';
        const contactName = activeConfig.CONTACT_NAME || 'Rudraksh Pandey';
        const upiId = activeConfig.UPI_ID || '9027808174@ptaxis';

        const upiLink = document.getElementById('upi-link');
        if (upiLink) {
            upiLink.textContent = `Pay ₹${price} via UPI`;
            upiLink.href = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(contactName)}&am=${price}.00&cu=INR`;
        }

        const contactNameEl = document.getElementById('contact-name');
        if (contactNameEl) contactNameEl.textContent = contactName;

        const contactPhoneEl = document.getElementById('contact-phone');
        if (contactPhoneEl) contactPhoneEl.textContent = activeConfig.CONTACT_PHONE || '+91 9027808174';

        const whatsappLinkEl = document.getElementById('whatsapp-link');
        if (whatsappLinkEl) whatsappLinkEl.href = activeConfig.WHATSAPP_LINK || '#';

        return true;
    };

    // Secret Admin Setup Logic
    const adminTrigger = document.getElementById('admin-trigger');
    const adminModal = document.getElementById('admin-modal');
    const adminUrlInput = document.getElementById('admin-url');
    const saveAdminBtn = document.getElementById('save-admin');
    const closeAdminBtn = document.getElementById('close-admin');
    let clickCount = 0;

    if (adminTrigger) {
        adminTrigger.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 3) {
                adminModal.classList.remove('hidden');
                adminUrlInput.value = getSavedUrl() || '';
                clickCount = 0;
            }
            setTimeout(() => { clickCount = 0; }, 2000);
        });
    }

    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => adminModal.classList.add('hidden'));
    }

    if (saveAdminBtn) {
        saveAdminBtn.addEventListener('click', () => {
            const url = adminUrlInput.value.trim();
            if (url) {
                localStorage.setItem('SAVED_GOOGLE_SCRIPT_URL', url);
                alert('Success! Configuration saved to this browser.');
                location.reload();
            } else {
                localStorage.removeItem('SAVED_GOOGLE_SCRIPT_URL');
                alert('Configuration cleared.');
                location.reload();
            }
        });
    }

    const isConfigLoaded = loadConfig();
    const GOOGLE_SCRIPT_URL = (typeof CONFIG !== 'undefined' ? CONFIG.GOOGLE_SCRIPT_URL : '') || getSavedUrl() || '';

    // File Upload Handler for Visual Feedback
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileNameDisplay.textContent = file.name;
            fileNameDisplay.classList.add('has-file');
        } else {
            fileNameDisplay.textContent = 'Choose an image or drag it here';
            fileNameDisplay.classList.remove('has-file');
        }
    });
    
    // Copy UPI functionality
    if (copyUpiBtn) {
        copyUpiBtn.addEventListener('click', () => {
            const textToCopy = upiVal.textContent.trim();
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyUpiBtn.classList.add('copied');
                const originalSvg = copyUpiBtn.innerHTML;
                copyUpiBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
                
                setTimeout(() => {
                    copyUpiBtn.classList.remove('copied');
                    copyUpiBtn.innerHTML = originalSvg;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // Validation Functions
    const validateField = (input, errorMessageId, validationLogic) => {
        const errorElement = document.getElementById(errorMessageId);
        if (!validationLogic(input.value)) {
            input.classList.add('error');
            errorElement.style.display = 'block';
            return false;
        } else {
            input.classList.remove('error');
            errorElement.style.display = 'none';
            return true;
        }
    };

    // Form Submit Handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        globalError.style.display = 'none';

        // Process Validation Rules
        const isNameValid = validateField(form.name, 'name-error', val => val.trim().length > 0);
        const isEmailValid = validateField(form.email, 'email-error', val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
        const isPhoneValid = validateField(form.phone, 'phone-error', val => /^\d{10}$/.test(val));
        const isUniValid = validateField(form.university, 'uni-error', val => val.trim().length > 0);
        const isYearValid = validateField(form.year, 'year-error', val => val !== "");
        const isCourseValid = validateField(form.course, 'course-error', val => val.trim().length > 0);
        const isTxValid = validateField(form.transactionId, 'tx-error', val => val.trim().length > 2);
        
        const fileError = document.getElementById('file-error');
        let isFileValid = false;
        if (fileInput.files.length === 0) {
            fileInput.parentElement.style.borderColor = 'var(--error-color)';
            fileError.style.display = 'block';
        } else {
            fileInput.parentElement.style.borderColor = 'var(--border-color)';
            fileError.style.display = 'none';
            isFileValid = true;
        }

        // Halt if any field is invalid
        if (!(isNameValid && isEmailValid && isPhoneValid && isUniValid && isYearValid && isCourseValid && isTxValid && isFileValid)) {
            return;
        }

        if (!isConfigLoaded) {
            globalError.style.display = 'block';
            globalError.textContent = 'Configuration Missing: This site is live on GitHub but has not been configured with a backend. Please set up config.js as per the README.';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            spinner.style.display = 'none';
            return;
        }

        if (GOOGLE_SCRIPT_URL === 'YOUR_WEB_APP_URL_HERE') {
            globalError.style.display = 'block';
            globalError.textContent = 'Configuration Error: Please update GOOGLE_SCRIPT_URL in script.js';
            return;
        }

        // Set Loading State
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'block';

        try {
            // Read File as Base64 for Image Upload
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onloadend = async () => {
                const base64String = reader.result;
                
                const payload = {
                    name: form.name.value,
                    email: form.email.value,
                    phone: form.phone.value,
                    university: form.university.value,
                    year: form.year.value,
                    course: form.course.value,
                    transactionId: form.transactionId.value,
                    image: base64String, // Includes data URI prefix
                    imageMimeType: file.type
                };

                // Send Payload to Google Apps Script
                try {
                    const response = await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        // 'text/plain' ensures the browser treats it as a simple request 
                        // and prevents CORS preflight OPTIONS request conflicts with GAS
                        headers: {
                            'Content-Type': 'text/plain;charset=utf-8',
                        }
                    });

                    // Decode response from GAS
                    const result = await response.json();

                    if (result.result === 'success') {
                        // Success Transition
                        formContainer.classList.add('hidden');
                        setTimeout(() => {
                            formContainer.style.display = 'none';
                            successContainer.classList.remove('hidden');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 400); // Waits for standard animation to run out
                    } else {
                        throw new Error(result.error || 'Server processing error');
                    }
                } catch (error) {
                    globalError.style.display = 'block';
                    globalError.textContent = 'Submission Failed. Please check your connection and try again.';
                    console.error('Submission Error:', error);
                    resetButtonState();
                }
            };

            // Trigger the execution
            reader.readAsDataURL(file);

        } catch (error) {
            globalError.style.display = 'block';
            globalError.textContent = 'An unexpected error occurred while processing the file.';
            console.error('Unexpected Error:', error);
            resetButtonState();
        }
    });

    const resetButtonState = () => {
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        spinner.style.display = 'none';
    };
});
