// ─── EduTutor BD — API Helper ───────────────────────────────
const PHP_API = '/edututor-fixed/web/api';
const PY_API   = 'http://localhost:8000/api';

// ─── PHP API (Auth + Progress) ───────────────────────────────
async function phpCall(endpoint, params = {}) {
    const url    = PHP_API + endpoint;
    const method = Object.keys(params).length > 0 ? 'POST' : 'GET';

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify(params) : undefined,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'সার্ভার error');
    return data;
}

// ─── Python API (AI/RAG) ─────────────────────────────────────
async function pyCall(endpoint, body = null) {
    const token   = localStorage.getItem('access_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method: body ? 'POST' : 'GET', headers };
    if (body) options.body = JSON.stringify(body);

    const res  = await fetch(PY_API + endpoint, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'সার্ভার error');
    return data;
}

// ─── Helper functions ─────────────────────────────────────────
function showError(msg) {
    const el = document.getElementById('error-msg');
    if (el) { el.textContent = '❌ ' + msg; el.style.display = 'block'; }
}

function showSuccess(msg) {
    const el = document.getElementById('success-msg');
    if (el) { el.textContent = '✅ ' + msg; el.style.display = 'block'; }
}

function hideMessages() {
    const e = document.getElementById('error-msg');
    const s = document.getElementById('success-msg');
    if (e) e.style.display = 'none';
    if (s) s.style.display = 'none';
}

function setLoading(btnId, loading, text = '') {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled    = loading;
    btn.textContent = loading ? 'অপেক্ষা করুন...' : (text || btn.dataset.text);
}

function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (!token) window.location.href = '/edututor-fixed/web/index.html';
    return token;
}

function logout() {
    localStorage.clear();
    window.location.href = '/edututor-fixed/web/index.html';
}

// ─── Save session to MySQL via PHP ───────────────────────────
async function saveSession(sessionData) {
    const studentId = localStorage.getItem('user_id');
    if (!studentId) return;
    try {
        await phpCall('/progress.php?action=save', {
            student_id:     studentId,
            subject:        sessionData.subject,
            chapter_id:     sessionData.chapter_id,
            question:       sessionData.question,
            student_answer: sessionData.student_answer,
            score:          sessionData.score,
            max_score:      sessionData.max_score,
            percentage:     sessionData.percentage,
        });
    } catch (e) {
        console.log('Session save error:', e);
    }
}
