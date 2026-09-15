// === [ INITIALIZATION ] ======================================================

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/blaise/sw.js"));
}

document.addEventListener('DOMContentLoaded', () => {
    const form             = document.querySelector('main form');
    const dialog           = document.querySelector('dialog');
    const billingContainer = document.querySelector('#billing-sections-container');
    const track            = document.querySelector('.page__ribbon');
    const gradient         = document.querySelector('.effect__gradient');

    // === [ RIBBON ] ==========================================================

    if (track) {
        track.innerHTML += track.innerHTML;
        track.style.animationDelay = `-${(Math.random() * 90).toFixed(2)}s`;
    }

    // === [ GRADIENT ] ========================================================

if (gradient) {
    const updateGradient = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress  = docHeight > 0 ? scrollTop / docHeight : 0;
        gradient.style.setProperty('--scroll-offset', `${progress * 400}px`);
    };

    updateGradient();
    window.addEventListener('scroll', updateGradient);
}

    // === [ BILLING SECTION ] =================================================

    function showBillingSection() {
        billingContainer.classList.remove('max-h-0', 'invisible', 'opacity-0');
        billingContainer.classList.add('max-h-[1000px]');
    }

    function hideBillingSection() {
        billingContainer.classList.remove('max-h-[1000px]');
        billingContainer.classList.add('max-h-0', 'invisible', 'opacity-0');
    }

    // === [ CLICK ACTIONS ] ===================================================

    document.addEventListener('click', (event) => {
        const target = event.target.closest('[data-action]');
        if (!target) return;

        if (target.dataset.action === 'dialog-open') dialog?.showModal();
        if (target.dataset.action === 'dialog-close') dialog?.close();
        if (target.dataset.action === 'select-hosting-cloud') showBillingSection();
        if (target.dataset.action === 'select-hosting-self') hideBillingSection();
        if (target.dataset.action === 'copy-latest-build-to-clipboard') {
            const code = target.closest('.card')?.querySelector('code')?.textContent;
            if (code) navigator.clipboard.writeText(code);
        }
    });

    // === [ LIVE FIELD VALIDATION ] ===========================================

    if (form) {
        const touchedFields = new Set();

        const revalidate = (event) => {
            if (!form.contains(event.target)) return;
            const activeField = event.target.name || event.target.id;
            if (!activeField) return;

            touchedFields.add(activeField);

            const fieldsToUpdate = [activeField];
            if (activeField === 'password' && touchedFields.has('password-confirmation')) {
                fieldsToUpdate.push('password-confirmation');
            }

            validateSignup(getSignupData(form), fieldsToUpdate);
        };

        document.addEventListener('input', revalidate);
        document.addEventListener('blur', revalidate, true);

        // === [ FORM SUBMISSION ] =============================================

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const signupData = getSignupData(form);
            const fieldState = validateSignup(signupData);
            const hasErrors  = Object.values(fieldState).some(errors => errors.length > 0);

            if (!hasErrors) {
                dialog?.showModal();
                form.reset();
                hideBillingSection();
            }
        });
    }
});

// === [ FORM DATA ] ===========================================================

function getSignupData(form) {
    const formData = new FormData(form);
    const fields   = Object.fromEntries(formData.entries());

    fields.timezone   = form.querySelector('#timezone')?.value;
    fields.hosting    = form.querySelector('input[name="hosting"]:checked')?.value ?? '';
    fields.billing    = form.querySelector('input[name="billing"]:checked')?.value ?? '';
    fields.newsletter = form.querySelector('#newsletter')?.checked;
    fields.terms      = form.querySelector('#terms')?.checked;

    return fields;
}

// === [ FORM VALIDATION ] =====================================================

function validateSignup(data, fieldsToUpdate = null) {
    const fieldState = {};

    for (const key in data) {
        const value = data[key] ?? '';
        fieldState[key] = [];

        if (key === 'email') {
            if (!value.trim()) fieldState[key].push('Entrez une adresse e-mail');
            if (!isEmail(value)) fieldState[key].push('Utilisez un format valide (exemple : nom@domaine.com)');
            if (/[^a-zA-Z0-9.@_-]/.test(value)) fieldState[key].push('Retirez les caractères non autorisés');
            if (/\s/.test(value)) fieldState[key].push('Retirez les espaces');
        }

        if (key === 'password') {
            if (!value.trim()) fieldState[key].push('Entrez un mot de passe');
            if (value.length < 8 || value.length > 64) fieldState[key].push('Utilisez entre 8 et 64 caractères');
            if (!/\d/.test(value)) fieldState[key].push('Ajoutez au moins un chiffre');
            if (!/[a-z]/.test(value)) fieldState[key].push('Ajoutez au moins une minuscule');
            if (!/[A-Z]/.test(value)) fieldState[key].push('Ajoutez au moins une majuscule');
            if (!/[!@#$%^&*()_+\-=[\]{}|;:'",.<>?/~`\\]/.test(value)) fieldState[key].push('Ajoutez au moins un caractère spécial');
            if (/\s/.test(value)) fieldState[key].push('Retirez les espaces');
        }

        if (key === 'password-confirmation') {
            if (!value.trim()) fieldState[key].push('Confirmez votre mot de passe');
            else if (value !== data.password) fieldState[key].push('Entrez le même mot de passe');
        }

        if (key === 'first-name' || key === 'last-name') {
            if (value) {
                if (value.length < 2 || value.length > 64) fieldState[key].push('Utilisez entre 2 et 64 caractères');
                if (/[^a-zA-Z\-'.\s]/.test(value)) fieldState[key].push('Retirez les caractères non autorisés');
            }
        }

        if (key === 'birth-date') {
            const input        = document.querySelector(`[name="${key}"]`);
            const isIncomplete = input?.validity?.badInput;

            if (value) {
                if (!isValidDate(value)) {
                    fieldState[key].push('Entrez une date valide');
                } else {
                    const age = calculateAge(value);
                    if (age < 18 || age > 120) fieldState[key].push('Date de naissance invalide (18 à 120 ans)');
                }
            } else if (isIncomplete) {
                fieldState[key].push('Entrez une date valide');
            }
        }

        if (key === 'hosting' || key === 'billing') {
            if (!value.trim()) fieldState[key].push('Faites une sélection');
        }

        if (key === 'card-name') {
            if (!value.trim()) fieldState[key].push('Entrez le nom du titulaire');
            if (value.length < 2 || value.length > 64) fieldState[key].push('Utilisez entre 2 et 64 caractères');
            if (/[^a-zA-Z\-'.\s]/.test(value)) fieldState[key].push('Retirez les caractères non autorisés');
        }

        if (key === 'card-number') {
            const digitsOnly = value.replace(/\s/g, '');
            if (!value.trim()) fieldState[key].push('Entrez un numéro de carte');
            if (digitsOnly.length < 14 || digitsOnly.length > 20) fieldState[key].push('Utilisez entre 14 et 20 chiffres');
            if (/[^0-9\s]/.test(value)) fieldState[key].push('Entrez uniquement des chiffres');
        }

        if (key === 'card-expiry-month') {
            if (!value.trim()) fieldState[key].push('Entrez le mois');
            if (!/^\d{2}$/.test(value)) fieldState[key].push('Utilisez deux chiffres (exemple : 05)');
        }

        if (key === 'card-expiry-year') {
            if (!value.trim()) fieldState[key].push("Entrez l'année");
            if (!/^\d{4}$/.test(value)) fieldState[key].push("Utilisez quatre chiffres (exemple : 2028)");
        }

        if (key === 'card-cvc') {
            if (!value.trim()) fieldState[key].push('Entrez le CVC');
            if (!/^\d{3,4}$/.test(value)) fieldState[key].push('Utilisez 3 ou 4 chiffres');
        }

        if (key === 'terms') {
            if (value !== true) fieldState[key].push("Cochez les conditions d'utilisation");
        }
    }

    if (data.hosting === 'self') {
        fieldState.billing = [];
        fieldState['card-name'] = [];
        fieldState['card-number'] = [];
        fieldState['card-expiry-month'] = [];
        fieldState['card-expiry-year'] = [];
        fieldState['card-cvc'] = [];
    }

    for (const field in fieldState) {
        if (fieldsToUpdate && !fieldsToUpdate.includes(field)) continue;
        const element = document.querySelector(`[data-error="${field}"]`);
        if (element) element.textContent = fieldState[field].join('\n');
    }

    return fieldState;
}

// === [ VALIDATION HELPERS ] ==================================================

function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function calculateAge(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const hadBirthdayThisYear = today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hadBirthdayThisYear) age--;
    return age;
}