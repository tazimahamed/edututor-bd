// ─── Login ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('access_token')) {
    const role = localStorage.getItem('user_role');
    window.location.href = role === 'admin'
      ? '/edututor-fixed/web/admin.html'
      : '/edututor-fixed/web/home.html';
  }
  const btn = document.getElementById('login-btn');
  if (btn) btn.dataset.text = 'লগইন করুন';
});

async function handleLogin() {
  hideMessages();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showError('ইমেইল ও পাসওয়ার্ড দিন।');
    return;
  }

  setLoading('login-btn', true);
  try {
    const data = await phpCall('/auth.php?action=signin', { email, password });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_id',      data.user_id);
    localStorage.setItem('user_name',    data.user_name);
    localStorage.setItem('user_role',    data.role);
    localStorage.setItem('user_grade',   data.grade);

    // ✅ Admin হলে admin dashboard এ যাও
    if (data.role === 'admin') {
      window.location.href = '/edututor-fixed/web/admin.html';
    } else {
      window.location.href = '/edututor-fixed/web/home.html';
    }
  } catch (err) {
    showError(err.message || 'লগইন ব্যর্থ হয়েছে।');
  } finally {
    setLoading('login-btn', false, 'লগইন করুন');
  }
}
