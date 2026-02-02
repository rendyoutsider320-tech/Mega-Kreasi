/**
 * Shared authentication logic for Mega Kreatif
 */

// Toast System
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Form Helpers
function showError(group, errorElement, message) {
    if (message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        group.classList.add('error');
    } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        group.classList.remove('error');
    }
}

// SSO Simulation
async function handleSSOLogin(provider) {
    const buttons = document.querySelectorAll('.btn-sso');
    const targetBtn = Array.from(buttons).find(btn => btn.innerText.includes(provider));
    const originalContent = targetBtn.innerHTML;

    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'wait';
    });

    targetBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menghubungkan...`;
    targetBtn.style.opacity = '1';

    return new Promise((resolve) => {
        setTimeout(() => {
            if (provider === 'Yahoo') {
                showToast(`Tidak dapat terhubung ke ${provider}.`, 'error');
                resetSSO();
                resolve(false);
            } else {
                showToast(`Berhasil masuk dengan ${provider}`, 'success');
                localStorage.setItem('user_session', JSON.stringify({
                    email: `user_${provider.toLowerCase()}@example.com`,
                    name: `${provider} User`,
                    method: provider,
                    token: 'oauth-' + Date.now()
                }));
                setTimeout(() => window.location.href = 'nusalokal_mockup.html', 1000);
                resolve(true);
            }
        }, 1500);
    });

    function resetSSO() {
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });
        targetBtn.innerHTML = originalContent;
    }
}

// Registration Storage Helper
function getRegisteredUsers() {
    return JSON.parse(localStorage.getItem('registered_users') || '[]');
}

function saveUser(user) {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem('registered_users', JSON.stringify(users));
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('SW registered'))
            .catch(err => console.log('SW failed', err));
    });
}
