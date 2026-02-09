/**
 * Validação e Manipulação de Formulários
 */

// Validar e-mail
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validar telefone brasileiro
function validatePhone(phone) {
    const re = /^[\d\s\(\)\-\+]+$/;
    return phone.length >= 10 && re.test(phone);
}

// Validar campo obrigatório
function validateRequired(value) {
    return value.trim().length > 0;
}

// Mostrar erro no campo
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.form-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

// Remover erro do campo
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message, container = null) {
    let successDiv = document.querySelector('.success-message');
    
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'success-message message';
        
        if (container) {
            container.insertBefore(successDiv, container.firstChild);
        } else {
            const formContainer = document.querySelector('.form-container');
            if (formContainer) {
                formContainer.insertBefore(successDiv, formContainer.firstChild);
            }
        }
    }
    
    successDiv.textContent = message;
    successDiv.classList.add('show');
    
    // Scroll suave para a mensagem
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    setTimeout(() => {
        successDiv.classList.remove('show');
    }, 5000);
}

// Mostrar mensagem de erro
function showErrorMessage(message, container = null) {
    let errorDiv = document.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message message';
        
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
        } else {
            const formContainer = document.querySelector('.form-container');
            if (formContainer) {
                formContainer.insertBefore(errorDiv, formContainer.firstChild);
            }
        }
    }
    
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

// Validação em tempo real
function initRealtimeValidation(form) {
    const inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.closest('.form-group').classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });
}

// Validar campo individual
function validateField(field) {
    const value = field.value;
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Validar campo obrigatório
    if (required && !validateRequired(value)) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    // Validar e-mail
    if (type === 'email' && value && !validateEmail(value)) {
        showFieldError(field, 'Por favor, insira um e-mail válido');
        return false;
    }
    
    // Validar telefone
    if (type === 'tel' && value && !validatePhone(value)) {
        showFieldError(field, 'Por favor, insira um telefone válido');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

// Validar formulário completo
function validateForm(form) {
    const inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Formulário de Contato
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    initRealtimeValidation(contactForm);
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) {
            showErrorMessage('Por favor, corrija os erros no formulário.');
            return;
        }
        
        const formData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            mensagem: document.getElementById('mensagem').value
        };
        
        // Simular envio (aqui você pode integrar com um backend)
        console.log('Dados do formulário de contato:', formData);
        
        // Mostrar mensagem de sucesso
        showSuccessMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        contactForm.reset();
        
        // Em produção, você faria algo como:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     showSuccessMessage('Mensagem enviada com sucesso!');
        //     contactForm.reset();
        // })
        // .catch(error => {
        //     showErrorMessage('Erro ao enviar mensagem. Tente novamente.');
        // });
    });
}

// Formulário de Newsletter
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    initRealtimeValidation(newsletterForm);
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) {
            showErrorMessage('Por favor, corrija os erros no formulário.');
            return;
        }
        
        const formData = {
            nome: document.getElementById('nomeNewsletter').value,
            email: document.getElementById('emailNewsletter').value,
            telefone: document.getElementById('telefone') ? document.getElementById('telefone').value : ''
        };
        
        console.log('Dados do formulário de newsletter:', formData);
        
        showSuccessMessage('Inscrição realizada com sucesso! Você receberá nossas novidades em breve.');
        newsletterForm.reset();
    });
}

// Inicializar todos os formulários
function initForms() {
    initContactForm();
    initNewsletterForm();
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePhone,
        validateRequired,
        showFieldError,
        clearFieldError,
        showSuccessMessage,
        showErrorMessage,
        initForms
    };
}
