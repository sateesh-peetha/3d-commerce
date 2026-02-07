/**
 * 3D Commerce App - Minimal Runnable Frontend
 * 
 * This is a vanilla JavaScript implementation for simplicity.
 * No build step required - runs directly in browser.
 */

// App State
const state = {
    mode: 'loading', // loading, installer, login, dashboard, admin, store, upload
    step: 1,
    formData: {
        adminEmail: '',
        usageContext: 'personal'
    },
    sessionId: localStorage.getItem('sessionId'),
    adminEmail: null,
    error: null,
    route: window.location.pathname
};

// Handle routing
function handleRoute() {
    const path = window.location.pathname;
    state.route = path;

    // Check if we need authentication for this route
    const protectedRoutes = ['/admin', '/store', '/upload'];
    const needsAuth = protectedRoutes.some(route => path.startsWith(route));

    if (needsAuth && !state.sessionId) {
        // Check session first
        checkSessionAndRender();
        return;
    }

    // Route to appropriate page
    if (path === '/admin' || path.startsWith('/admin')) {
        state.mode = 'admin';
    } else if (path === '/store' || path.startsWith('/store')) {
        state.mode = 'store';
    } else if (path === '/upload' || path.startsWith('/upload')) {
        state.mode = 'upload';
    } else {
        // Default: check installation status
        checkInstallationStatus();
        return;
    }

    render();
}

// Check installation status
async function checkInstallationStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();

        if (data.installed) {
            checkSessionAndRender();
        } else {
            state.mode = 'installer';
            render();
        }
    } catch (error) {
        console.error('Init error:', error);
        state.error = 'Failed to connect to server';
        render();
    }
}

// Check session and render dashboard
async function checkSessionAndRender() {
    if (state.sessionId) {
        const sessionCheck = await fetch('/api/session', {
            headers: { 'X-Session-Id': state.sessionId }
        });
        const sessionData = await sessionCheck.json();

        if (sessionData.valid) {
            state.adminEmail = sessionData.email;
            if (state.route === '/' || state.route === '') {
                state.mode = 'dashboard';
            } else {
                handleRoute();
                return;
            }
        } else {
            state.mode = 'login';
        }
    } else {
        state.mode = 'login';
    }
    render();
}

// Initialize App
async function init() {
    // Listen for route changes
    window.addEventListener('popstate', handleRoute);
    
    // Intercept link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin)) {
            e.preventDefault();
            const path = new URL(link.href).pathname;
            window.history.pushState({}, '', path);
            handleRoute();
        }
    });

    handleRoute();
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
        case 'admin':
            root.innerHTML = renderAdminPanel();
            break;
        case 'store':
            root.innerHTML = renderStore();
            break;
        case 'upload':
            root.innerHTML = renderUpload();
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
        <div class="card" style="max-width: 800px;">
            <div class="dashboard-header">
                <h1 style="margin: 0;">Admin Dashboard</h1>
                <span class="status-badge">✓ Active</span>
            </div>
            
            <div class="success-icon">🎉</div>
            <h2 style="text-align: center; margin-bottom: 8px;">System Ready!</h2>
            <p class="subtitle">Your 3D Commerce platform is configured and running.</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 24px 0;">
                <div class="info-row">
                    <div class="info-label">Admin Email</div>
                    <div class="info-value">${state.adminEmail}</div>
                </div>
                
                <div class="info-row">
                    <div class="info-label">Status</div>
                    <div class="info-value" style="color: #059669;">✓ Installed & Running</div>
                </div>
            </div>

            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <h3 style="font-size: 1.125rem; margin-bottom: 16px; color: #1f2937;">Quick Actions</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
                    <a href="/admin" style="text-decoration: none;">
                        <div style="padding: 16px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; text-align: center; transition: all 0.2s; cursor: pointer;" 
                             onmouseover="this.style.borderColor='#6366f1'; this.style.background='#eef2ff';" 
                             onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';">
                            <div style="font-size: 2rem; margin-bottom: 8px;">📊</div>
                            <div style="font-weight: 600; color: #1f2937;">Admin Panel</div>
                            <div style="font-size: 0.875rem; color: #6b7280; margin-top: 4px;">View full dashboard</div>
                        </div>
                    </a>
                    <a href="/store" style="text-decoration: none;">
                        <div style="padding: 16px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; text-align: center; transition: all 0.2s; cursor: pointer;" 
                             onmouseover="this.style.borderColor='#6366f1'; this.style.background='#eef2ff';" 
                             onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';">
                            <div style="font-size: 2rem; margin-bottom: 8px;">🛍️</div>
                            <div style="font-weight: 600; color: #1f2937;">Store</div>
                            <div style="font-size: 0.875rem; color: #6b7280; margin-top: 4px;">Browse products</div>
                        </div>
                    </a>
                    <a href="/upload" style="text-decoration: none;">
                        <div style="padding: 16px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; text-align: center; transition: all 0.2s; cursor: pointer;" 
                             onmouseover="this.style.borderColor='#6366f1'; this.style.background='#eef2ff';" 
                             onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';">
                            <div style="font-size: 2rem; margin-bottom: 8px;">📤</div>
                            <div style="font-weight: 600; color: #1f2937;">Upload 3D</div>
                            <div style="font-size: 0.875rem; color: #6b7280; margin-top: 4px;">Upload model</div>
                        </div>
                    </a>
                </div>
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

// Admin Panel
function renderAdminPanel() {
    return `
        <div class="card" style="max-width: 900px;">
            <div class="dashboard-header">
                <h1 style="margin: 0;">Admin Panel</h1>
                <a href="/" style="text-decoration: none; color: #6366f1; font-size: 0.875rem;">← Back to Dashboard</a>
            </div>
            
            <div style="margin-top: 24px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
                    <div class="info-row">
                        <div class="info-label">Total Orders</div>
                        <div class="info-value">0</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Active Printers</div>
                        <div class="info-value">0</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Revenue</div>
                        <div class="info-value">$0.00</div>
                    </div>
                </div>

                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-top: 24px;">
                    <h3 style="font-size: 1.125rem; margin-bottom: 12px; color: #1f2937;">Quick Links</h3>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <a href="/admin/orders" style="padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 6px; text-decoration: none; color: #1f2937; font-size: 0.875rem;">Orders</a>
                        <a href="/admin/products" style="padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 6px; text-decoration: none; color: #1f2937; font-size: 0.875rem;">Products</a>
                        <a href="/admin/printers" style="padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 6px; text-decoration: none; color: #1f2937; font-size: 0.875rem;">Printers</a>
                        <a href="/admin/customers" style="padding: 8px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 6px; text-decoration: none; color: #1f2937; font-size: 0.875rem;">Customers</a>
                    </div>
                </div>

                <div style="margin-top: 24px; padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e; font-size: 0.875rem;">
                        <strong>Note:</strong> This is a minimal admin panel. Full features (orders, printers, analytics) require backend API implementation.
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Store Page
function renderStore() {
    return `
        <div class="card" style="max-width: 900px;">
            <div class="dashboard-header">
                <h1 style="margin: 0;">Store</h1>
                <a href="/" style="text-decoration: none; color: #6366f1; font-size: 0.875rem;">← Back to Dashboard</a>
            </div>
            
            <div style="margin-top: 24px;">
                <p class="subtitle">Browse our 3D printable products</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 24px;">
                    <div style="background: #f9fafb; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 12px;">📦</div>
                        <div style="font-weight: 600; margin-bottom: 4px;">Product 1</div>
                        <div style="color: #6b7280; font-size: 0.875rem;">$29.99</div>
                    </div>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 12px;">🎨</div>
                        <div style="font-weight: 600; margin-bottom: 4px;">Product 2</div>
                        <div style="color: #6b7280; font-size: 0.875rem;">$39.99</div>
                    </div>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 12px;">🔧</div>
                        <div style="font-weight: 600; margin-bottom: 4px;">Product 3</div>
                        <div style="color: #6b7280; font-size: 0.875rem;">$49.99</div>
                    </div>
                </div>

                <div style="margin-top: 24px; padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e; font-size: 0.875rem;">
                        <strong>Note:</strong> Product data requires backend API implementation. This is a placeholder view.
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Upload Page
function renderUpload() {
    return `
        <div class="card" style="max-width: 900px;">
            <div class="dashboard-header">
                <h1 style="margin: 0;">Upload 3D Model</h1>
                <a href="/" style="text-decoration: none; color: #6366f1; font-size: 0.875rem;">← Back to Dashboard</a>
            </div>
            
            <div style="margin-top: 24px;">
                <p class="subtitle">Upload your 3D model file to get a price estimate</p>
                
                <div style="margin-top: 32px; padding: 40px; border: 2px dashed #e5e7eb; border-radius: 12px; text-align: center; background: #f9fafb;">
                    <div style="font-size: 4rem; margin-bottom: 16px;">📤</div>
                    <h3 style="margin-bottom: 8px; color: #1f2937;">Drop your file here</h3>
                    <p style="color: #6b7280; margin-bottom: 20px;">or click to browse</p>
                    <button class="btn-primary" style="cursor: pointer;">Choose File</button>
                    <p style="color: #9ca3af; font-size: 0.875rem; margin-top: 16px;">Supported formats: .stl, .obj, .3mf</p>
                </div>

                <div style="margin-top: 24px; padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e; font-size: 0.875rem;">
                        <strong>Note:</strong> File upload functionality requires backend API implementation. This is a placeholder view.
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Start app
init();
