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

// Localiza (ou cria) o container onde as mensagens de feedback aparecem
function resolveFeedbackContainer(container) {
    if (container) return container;
    return document.querySelector('.contact-card') ||
           document.querySelector('.form-container') ||
           document.querySelector('form')?.parentElement ||
           document.body;
}

function renderMessage(type, message, container) {
    const host = resolveFeedbackContainer(container);
    const className = type === 'success' ? 'success-message' : 'error-message';

    let el = host.querySelector('.' + className);
    if (!el) {
        el = document.createElement('div');
        el.className = className + ' message';
        el.setAttribute('role', type === 'success' ? 'status' : 'alert');
        host.insertBefore(el, host.firstChild);
    }

    el.textContent = message;
    el.classList.add('show');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => el.classList.remove('show'), 6000);
    return el;
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message, container = null) {
    return renderMessage('success', message, container);
}

// Mostrar mensagem de erro
function showErrorMessage(message, container = null) {
    return renderMessage('error', message, container);
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

// Valida os campos reais do formulário (input/textarea), sem depender de classes
function validateContactFields(form) {
    let firstInvalid = null;
    form.querySelectorAll('input, textarea').forEach(field => {
        if (field.type === 'hidden' || field.name === '_gotcha') return;
        const value = (field.value || '').trim();
        let error = '';

        if (field.hasAttribute('required') && !value) {
            error = 'Este campo é obrigatório.';
        } else if (field.type === 'email' && value && !validateEmail(value)) {
            error = 'Informe um e-mail válido.';
        }

        let hint = field.parentElement.querySelector('.field-hint');
        if (error) {
            if (!hint) {
                hint = document.createElement('span');
                hint.className = 'field-hint';
                field.parentElement.appendChild(hint);
            }
            hint.textContent = error;
            field.setAttribute('aria-invalid', 'true');
            if (!firstInvalid) firstInvalid = field;
        } else if (hint) {
            hint.remove();
            field.removeAttribute('aria-invalid');
        }
    });

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
}

// Fallback: abre o cliente de e-mail já preenchido quando não há endpoint/rede
function mailtoFallback(data) {
    const to = 'titasdarobotica@gmail.com';
    const subject = encodeURIComponent(data.assunto || 'Contato pelo site');
    const body = encodeURIComponent(
        `Nome: ${data.nome}\nE-mail: ${data.email}\n\n${data.mensagem}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

// Formulário de Contato
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const card = contactForm.closest('.contact-card') || contactForm.parentElement;
    const submitBtn = contactForm.querySelector('[type="submit"]');
    const endpoint = contactForm.dataset.endpoint || window.CONTACT_ENDPOINT || '';

    // Limpa a dica de erro assim que o usuário corrige o campo
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => {
            const hint = field.parentElement.querySelector('.field-hint');
            if (hint) hint.remove();
            field.removeAttribute('aria-invalid');
        });
    });

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!validateContactFields(contactForm)) {
            showErrorMessage('Verifique os campos destacados e tente novamente.', card);
            return;
        }

        const data = {
            nome: (contactForm.querySelector('#nome') || {}).value || '',
            email: (contactForm.querySelector('#email') || {}).value || '',
            assunto: (contactForm.querySelector('#assunto') || {}).value || '',
            mensagem: (contactForm.querySelector('#mensagem') || {}).value || ''
        };

        // Honeypot anti-spam (campo _gotcha oculto): se preenchido, finge sucesso
        const gotcha = contactForm.querySelector('[name="_gotcha"]');
        if (gotcha && gotcha.value) {
            showSuccessMessage('Mensagem enviada! Retornaremos em breve.', card);
            contactForm.reset();
            return;
        }

        if (!endpoint) {
            // Sem endpoint configurado: usa o fallback de e-mail
            mailtoFallback(data);
            showSuccessMessage(
                'Abrimos seu aplicativo de e-mail para concluir o envio. ' +
                'Se nada aconteceu, escreva para titasdarobotica@gmail.com.', card
            );
            return;
        }

        const originalLabel = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    nome: data.nome,
                    email: data.email,
                    _replyto: data.email,
                    _subject: `Site Titãs — ${data.assunto || 'Contato'}`,
                    assunto: data.assunto,
                    mensagem: data.mensagem
                })
            });

            if (!response.ok) throw new Error('HTTP ' + response.status);

            showSuccessMessage('Mensagem enviada com sucesso! Retornaremos em breve.', card);
            contactForm.reset();
        } catch (err) {
            console.error('Falha ao enviar formulário de contato:', err);
            mailtoFallback(data);
            showErrorMessage(
                'Não foi possível enviar automaticamente. Abrimos seu e-mail para concluir — ' +
                'ou escreva para titasdarobotica@gmail.com.', card
            );
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            }
        }
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
