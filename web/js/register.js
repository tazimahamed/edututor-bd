// ─── Register ────────────────────────────────────────────────
let selectedRole  = 'student';
const ADMIN_CODE  = 'abc123';  // ✅ Admin secret code

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('register-btn');
  if (btn) btn.dataset.text = 'রেজিস্ট্রেশন করুন';
});

function setRole(role) {
  selectedRole = role;
  document.querySelectorAll('[id^="role-"]').forEach(b => b.classList.remove('active'));
  document.getElementById('role-' + role).classList.add('active');

  // Admin হলে grade আর admin code section দেখাও
  document.getElementById('grade-group').style.display      = role === 'student' ? 'block' : 'none';
  document.getElementById('admin-code-group').style.display = role === 'admin'   ? 'block' : 'none';
}

async function handleRegister() {
  hideMessages();
  const name     = document.getElementById('name').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!name || !email || !password) {
    showError('সব তথ্য পূরণ করুন।');
    return;
  }
  if (password.length < 6) {
    showError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
    return;
  }

  // Admin code check
  if (selectedRole === 'admin') {
    const adminCode = document.getElementById('admin-code').value.trim();
    if (adminCode !== ADMIN_CODE) {
      showError('Admin code সঠিক নয়।');
      return;
    }
  }

  setLoading('register-btn', true);
  try {
    await phpCall('/auth.php?action=signup', {
      name, email, password,
      grade: selectedRole === 'student' ? 'SSC' : 'SSC',
      role:  selectedRole
    });
    showSuccess('অ্যাকাউন্ট তৈরি হয়েছে! লগইন করুন।');
    setTimeout(() => window.location.href = '/edututor-fixed/web/index.html', 2000);
  } catch (err) {
    showError(err.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।');
  } finally {
    setLoading('register-btn', false, 'রেজিস্ট্রেশন করুন');
  }
}
