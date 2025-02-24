document.addEventListener('DOMContentLoaded', () => {
    let currentStep = parseInt(localStorage.getItem('currentStep')) || 1;
    const totalSteps = 5;
    const formData = JSON.parse(localStorage.getItem('formData')) || {
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        blog: '',
        twitter: '',
        facebook: '',
        instagram: '',
        institution: '',
        degree: '',
        gradYear: '',
    };

    // Get DOM elements
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const stepContents = document.querySelectorAll('.step-content');
    const thankYouPopup = document.getElementById('thankYouPopup');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Initialize form with saved data
    initializeFormWithSavedData();

    // Initialize event listeners
    prevBtn.addEventListener('click', goToPreviousStep);
    nextBtn.addEventListener('click', goToNextStep);
    downloadBtn?.addEventListener('click', downloadSummary);
    resetBtn?.addEventListener('click', resetForm);
    initializeInputs();

    // Show initial step
    showStep(currentStep);

    function initializeFormWithSavedData() {
        Object.keys(formData).forEach(field => {
            const input = document.querySelector(`[name="${field}"]`);
            if (input && formData[field]) {
                input.value = formData[field];
            }
        });
    }

    function initializeInputs() {
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                formData[e.target.name] = e.target.value;
                localStorage.setItem('formData', JSON.stringify(formData));
                clearErrors();
            });
        });
    }

    function updateStepIndicators() {
        stepIndicators.forEach((indicator, index) => {
            const step = index + 1;
            indicator.classList.remove('active', 'completed');
            if (step === currentStep) {
                indicator.classList.add('active');
            } else if (step < currentStep) {
                indicator.classList.add('completed');
            }
        });
    }

    function showStep(step) {
        stepContents.forEach((content, index) => {
            content.classList.toggle('hidden', index + 1 !== step);
        });
        prevBtn.classList.toggle('hidden', step === 1);
        nextBtn.textContent = step === totalSteps ? 'Confirm' : 'Next Step';
        updateStepIndicators();

        if (step === totalSteps) {
            updateSummary();
        }

        // Save current step to localStorage
        localStorage.setItem('currentStep', step);
    }

    function goToPreviousStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    }

    function goToNextStep() {
        if (validateCurrentStep()) {
            if (currentStep === totalSteps) {
                handleSubmit();
            } else {
                currentStep++;
                showStep(currentStep);
            }
        }
    }

    function validateCurrentStep() {
        clearErrors();
        let isValid = true;

        // Only validate required fields in step 1
        if (currentStep === 1) {
            const requiredFields = ['name', 'email', 'phone'];
            requiredFields.forEach(field => {
                if (!formData[field]) {
                    showError(field, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                    isValid = false;
                }
            });

            if (formData.email && !validateEmail(formData.email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }else if(formData.phone && !validatePhone(formData.phone)){
                    showError('phone', 'Please enter a valid phone number');
                    isValid = false;
            }
        }

        return isValid;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validatePhone(phone) {
        return /^\+?[0-9]\d{5,14}$/.test(phone);
    }

    function showError(field, message) {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
            const errorDiv = input.nextElementSibling;
            input.classList.add('error');
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }

    function clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        const inputs = document.querySelectorAll('input, textarea');
        errors.forEach(error => error.classList.add('hidden'));
        inputs.forEach(input => input.classList.remove('error'));
    }

    function updateSummary() {
        // Update personal info
        document.getElementById('summary-name').textContent = formData.name || 'Not provided';
        document.getElementById('summary-email').textContent = formData.email || 'Not provided';
        document.getElementById('summary-phone').textContent = formData.phone || 'Not provided';

        // Update professional links
        document.getElementById('summary-linkedin').textContent = formData.linkedin || 'Not provided';
        document.getElementById('summary-github').textContent = formData.github || 'Not provided';
        document.getElementById('summary-blog').textContent = formData.blog || 'Not provided';

        // Update social media
        document.getElementById('summary-twitter').textContent = formData.twitter || 'Not provided';
        document.getElementById('summary-facebook').textContent = formData.facebook || 'Not provided';
        document.getElementById('summary-instagram').textContent = formData.instagram || 'Not provided';

        // Update education
        document.getElementById('summary-institution').textContent = formData.institution || 'Not provided';
        document.getElementById('summary-degree').textContent = formData.degree || 'Not provided';
        document.getElementById('summary-gradYear').textContent = formData.gradYear || 'Not provided';
    }

    function handleSubmit() {
        // Disable the confirm button
        const confirmButton = document.getElementById('nextBtn');
        confirmButton.disabled = true;
        confirmButton.classList.add('opacity-50', 'cursor-not-allowed');
        const confirmButtons = document.getElementById('prevBtn');
        confirmButtons.disabled = true;
        confirmButtons.classList.add('opacity-50', 'cursor-not-allowed');

        // Show thank you popup
        thankYouPopup.classList.remove('hidden');
        thankYouPopup.classList.add('show');

        // Hide popup after 3 seconds and return to summary
        setTimeout(() => {
            thankYouPopup.classList.remove('show');
            setTimeout(() => {
                thankYouPopup.classList.add('hidden');
                // Keep the button disabled
            }, 300);
        }, 1000);
    }

    function downloadSummary() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const summaryText = `
        Personal Information Summary

        Personal Information:
        Name: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}

        Professional Links:
        LinkedIn: ${formData.linkedin || 'Not provided'}
        GitHub: ${formData.github || 'Not provided'}
        Blog: ${formData.blog || 'Not provided'}

        Social Media:
        Twitter: ${formData.twitter || 'Not provided'}
        Facebook: ${formData.facebook || 'Not provided'}
        Instagram: ${formData.instagram || 'Not provided'}

        Educational Background:
        Institution: ${formData.institution || 'Not provided'}
        Degree: ${formData.degree || 'Not provided'}
        Graduation Year: ${formData.gradYear || 'Not provided'}
        `;

        doc.text(summaryText, 10, 10); // Add text to the PDF
        doc.save("bio-data.pdf"); // Download as PDF
    }

    function resetForm() {
        // Clear form data
        formData.name = '';
        formData.email = '';
        formData.phone = '';
        formData.linkedin = '';
        formData.github = '';
        formData.blog = '';
        formData.twitter = '';
        formData.facebook = '';
        formData.instagram = '';
        formData.institution = '';
        formData.degree = '';
        formData.gradYear = '';
        formData.interest = [];

        // Clear localStorage
        localStorage.clear();

        // Reset UI
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input[type="number"], textarea')
            .forEach(input => input.value = '');

        // Re-enable the confirm button
        const confirmButton = document.getElementById('nextBtn');
        confirmButton.disabled = false;
        confirmButton.classList.remove('opacity-50', 'cursor-not-allowed');
        const confirmButtons = document.getElementById('prevBtn');
        confirmButtons.disabled = false;
        confirmButtons.classList.remove('opacity-50', 'cursor-not-allowed');


        // Go to first step
        currentStep = 1;
        showStep(currentStep);
    }
});

// document.getElementById('phone').addEventListener('input', function () {
//     const phoneInput = this.value.trim();
//     const errorDiv = this.nextElementSibling;

//     // Regular expression for E.164 international phone number format
//     const phoneRegex = /^\+?[1-9]\d{1,14}$/; 

//     if (!phoneRegex.test(phoneInput)) {
//         this.classList.add('border-red-500'); // Highlight error
//         errorDiv.textContent = "Enter a valid international phone number (e.g., +1234567890123)";
//         errorDiv.classList.remove('hidden');
//     } else {
//         this.classList.remove('border-red-500'); // Remove error highlight
//         errorDiv.textContent = "";
//         errorDiv.classList.add('hidden');
//     }
// });