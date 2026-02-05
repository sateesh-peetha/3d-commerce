/**
 * 3D Commerce App - Minimal Runnable Frontend
 * 
 * This is a vanilla JavaScript implementation for simplicity.
 * No build step required - runs directly in browser.
 */

// App State
const state = {
    mode: 'loading', // loading, installer, login, dashboard
    step: 1,
    formData: {
        adminEmail: '',
        usageContext: 'personal'
    },
    sessionId: localStorage.getItem('sessionId'),
    adminEmail: null,
    error: null
};

// Initialize App
async function init() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();

        if (data.installed) {
            // Check if we have a valid session
            if (state.sessionId) {
                const sessionCheck = await fetch('/api/session', {
                    headers: { 'X-Session-Id': state.sessionId }
                });
                const sessionData = await sessionCheck.json();

                if (sessionData.valid) {
                    state.mode = 'dashboard';
                    state.adminEmail = sessionData.email;
                } else {
                    state.mode = 'login';
                    state.adminEmail = data.adminEmail;
                }
            } else {
                state.mode = 'login';
                state.adminEmail = data.adminEmail;
            }
        } else {
            state.mode = 'installer';
        }

        render();
    } catch (error) {
        console.error('Init error:', error);
        state.error = 'Failed to connect to server';
        render();
    }
}

// Render based on current state
function render() {
    const root = document.getElementById('root');

    switch (state.mode) {
        case 'loading':
            root.innerHTML = renderLoading();
            break;
        case 'installer':
            root.innerHTML = renderInstaller();
            break;
        case 'login':
            root.innerHTML = renderLogin();
            break;
        case 'dashboard':
            root.innerHTML = renderDashboard();
            break;
        default:
            root.innerHTML = renderLoading();
    }
}

// Loading Screen
function renderLoading() {
    return `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
}

// Installer Wizard
function renderInstaller() {
    const steps = [
        renderWelcome,
        renderAdminSetup,
        renderUsageContext,
        renderReview,
        renderInstalling
    ];

    return `
        <div class="card">
            ${renderProgress()}
            ${steps[state.step - 1]()}
        </div>
    `;
}

function renderProgress() {
    const dots = [1, 2, 3, 4, 5].map(i => {
        let cls = 'progress-dot';
        if (i < state.step) cls += ' done';
        if (i === state.step) cls += ' active';
        return `<div class="${cls}"></div>`;
    }).join('');

    return `
        <div class="progress">${dots}</div>
        <div class="step-label">Step ${state.step} of 5</div>
    `;
}

// Step 1: Welcome
function renderWelcome() {
    return `
        <h1>Welcome! 👋</h1>
        <p class="subtitle">
            You're about to set up your 3D Commerce platform. 
            This will only take a few minutes.
        </p>
        
        <div class="help-box">
            <strong>What you'll need:</strong><br>
            • An email address for your admin account<br>
            • About 2-3 minutes of your time
        </div>
        
        <p style="text-align: center; color: #9ca3af; font-size: 0.875rem; margin-top: 16px;">
            ✨ You can change any setting later.
        </p>
        
        <div class="buttons" style="justify-content: center;">
            <button class="btn-primary" onclick="nextStep()">Let's Get Started →</button>
        </div>
    `;
}

// Step 2: Admin Account
function renderAdminSetup() {
    return `
        <h1>Create Admin Account</h1>
        <p class="subtitle">
            This is the main account that controls your platform.
        </p>
        
        ${state.error ? `<div class="error">${state.error}</div>` : ''}
        
        <div class="form-group">
            <label for="email">Your Email Address</label>
            <input type="email" id="email" placeholder="you@example.com" 
                   value="${state.formData.adminEmail}"
                   oninput="updateFormData('adminEmail', this.value)">
        </div>
        
        <div class="help-box">
            <strong>Why do we need this?</strong><br>
            This email will be used to log in and manage your platform.
            No password needed - we'll verify your email.
        </div>
        
        <div class="buttons">
            <button class="btn-secondary" onclick="prevStep()">← Back</button>
            <button class="btn-primary" onclick="nextStep()">Continue →</button>
        </div>
    `;
}

// Step 3: Usage Context
function renderUsageContext() {
    const options = [
        { value: 'personal', icon: '🏠', title: 'Personal / Hobby', desc: 'Just for me or friends' },
        { value: 'small_business', icon: '🏪', title: 'Small Business', desc: 'Selling to customers' },
        { value: 'company', icon: '🏢', title: 'Company', desc: 'Large scale operations' }
    ];

    return `
        <h1>How Will You Use This?</h1>
        <p class="subtitle">
            This helps us set up sensible defaults for you.
        </p>
        
        <div class="options">
            ${options.map(opt => `
                <div class="option ${state.formData.usageContext === opt.value ? 'selected' : ''}"
                     onclick="updateFormData('usageContext', '${opt.value}')">
                    <span class="option-icon">${opt.icon}</span>
                    <div>
                        <div class="option-title">${opt.title}</div>
                        <div class="option-desc">${opt.desc}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="buttons">
            <button class="btn-secondary" onclick="prevStep()">← Back</button>
            <button class="btn-primary" onclick="nextStep()">Continue →</button>
        </div>
    `;
}

// Step 4: Review
function renderReview() {
    const contextLabels = {
        personal: 'Personal / Hobby',
        small_business: 'Small Business',
        company: 'Company'
    };

    return `
        <h1>Review Your Setup</h1>
        <p class="subtitle">
            Here's what we'll configure. Everything look good?
        </p>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <div class="review-item">
                <span class="review-label">Admin Email</span>
                <span class="review-value">${state.formData.adminEmail || 'Not set'}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Usage</span>
                <span class="review-value">${contextLabels[state.formData.usageContext]}</span>
            </div>
            <div class="review-item" style="border-bottom: none;">
                <span class="review-label">Login Method</span>
                <span class="review-value">Email</span>
            </div>
        </div>
        
        <div class="buttons">
            <button class="btn-secondary" onclick="prevStep()">← Edit</button>
            <button class="btn-primary" onclick="completeSetup()">✓ Complete Setup</button>
        </div>
    `;
}

// Step 5: Installing
function renderInstalling() {
    return `
        <div class="success-icon">⚙️</div>
        <h1>Setting Up...</h1>
        <p class="subtitle">
            Please wait while we configure your platform.
        </p>
        <div style="text-align: center; margin-top: 20px;">
            <div class="spinner" style="border-color: #e5e7eb; border-top-color: #6366f1;"></div>
        </div>
    `;
}

// Login Screen
function renderLogin() {
    return `
        <div class="card">
            <h1>Welcome Back 👋</h1>
            <p class="subtitle">
                Enter your admin email to continue.
            </p>
            
            ${state.error ? `<div class="error">${state.error}</div>` : ''}
            
            <div class="form-group">
                <label for="loginEmail">Admin Email</label>
                <input type="email" id="loginEmail" placeholder="you@example.com">
            </div>
            
            <div class="buttons" style="justify-content: center;">
                <button class="btn-primary" onclick="login()">Log In →</button>
            </div>
        </div>
    `;
}

// Dashboard
function renderDashboard() {
    return `
        <div class="card" style="max-width: 550px;">
            <div class="dashboard-header">
                <h1 style="margin: 0;">Dashboard</h1>
                <span class="status-badge">✓ Active</span>
            </div>
            
            <div class="success-icon">🎉</div>
            <h2 style="text-align: center; margin-bottom: 8px;">System Ready!</h2>
            <p class="subtitle">Your 3D Commerce platform is configured and running.</p>
            
            <div class="info-row">
                <div class="info-label">Admin Email</div>
                <div class="info-value">${state.adminEmail}</div>
            </div>
            
            <div class="info-row">
                <div class="info-label">Status</div>
                <div class="info-value" style="color: #059669;">✓ Installed & Running</div>
            </div>
            
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 12px;">
                    Need to start over? This will erase your configuration.
                </p>
                <div class="buttons">
                    <button class="btn-secondary" onclick="logout()">Log Out</button>
                    <button class="btn-danger" onclick="resetSetup()">Re-run Setup</button>
                </div>
            </div>
        </div>
    `;
}

// Actions
function updateFormData(key, value) {
    state.formData[key] = value;
    state.error = null;
    render();
}

function nextStep() {
    // Validation for step 2
    if (state.step === 2) {
        if (!state.formData.adminEmail || !state.formData.adminEmail.includes('@')) {
            state.error = 'Please enter a valid email address';
            render();
            return;
        }
    }

    state.error = null;
    state.step++;
    render();
}

function prevStep() {
    state.error = null;
    state.step--;
    render();
}

async function completeSetup() {
    state.step = 5;
    render();

    try {
        const response = await fetch('/api/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state.formData)
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('sessionId', data.sessionId);
            state.sessionId = data.sessionId;
            state.adminEmail = state.formData.adminEmail;
            state.mode = 'dashboard';
            render();
        } else {
            state.error = data.error || 'Setup failed';
            state.step = 2;
            render();
        }
    } catch (error) {
        state.error = 'Failed to save configuration';
        state.step = 2;
        render();
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('sessionId', data.sessionId);
            state.sessionId = data.sessionId;
            state.adminEmail = email;
            state.mode = 'dashboard';
            state.error = null;
            render();
        } else {
            state.error = data.error || 'Invalid email';
            render();
        }
    } catch (error) {
        state.error = 'Login failed';
        render();
    }
}

function logout() {
    localStorage.removeItem('sessionId');
    state.sessionId = null;
    state.mode = 'login';
    render();
}

async function resetSetup() {
    if (!confirm('Are you sure? This will erase all configuration.')) {
        return;
    }

    try {
        await fetch('/api/reset', { method: 'POST' });
        localStorage.removeItem('sessionId');
        state.sessionId = null;
        state.step = 1;
        state.formData = { adminEmail: '', usageContext: 'personal' };
        state.mode = 'installer';
        render();
    } catch (error) {
        alert('Failed to reset');
    }
}

// Start app
init();
