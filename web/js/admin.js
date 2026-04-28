// ─── Admin Dashboard ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Admin check
  const role = localStorage.getItem('user_role');
  if (role !== 'admin') {
    window.location.href = '/edututor-fixed/web/index.html';
    return;
  }

  document.getElementById('admin-name').textContent = localStorage.getItem('user_name') || 'Admin';

  try {
    const data = await phpCall('/admin.php?action=dashboard');

    document.getElementById('total-students').textContent = data.total_students || '০';
    document.getElementById('total-sessions').textContent = data.total_sessions || '০';
    document.getElementById('overall-avg').textContent    = (data.overall_avg || 0) + '%';

    const list = document.getElementById('student-list');
    list.innerHTML = '';

    if (data.students && data.students.length > 0) {
      data.students.forEach(student => {
        const avgScore = student.avg_score || 0;
        const status   = avgScore >= 70 ? '✅ ভালো'
                       : avgScore >= 50 ? '⚠️ মাঝারি'
                       : '❌ দুর্বল';

        list.innerHTML += `
          <div class="subject-progress-item" style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <h4 style="margin:0">${student.name}</h4>
              <span style="font-size:13px;color:#888">${student.email}</span>
            </div>
            <div style="display:flex;gap:16px;font-size:13px;color:#888;margin-bottom:8px">
              <span>📚 ${student.total_sessions || 0} সেশন</span>
              <span>📊 গড়: ${avgScore}%</span>
              <span>${status}</span>
              <span>🎓 ${student.grade || 'SSC'}</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width:${avgScore}%"></div>
            </div>
            <div style="display:flex;gap:8px;margin-top:8px;font-size:12px;color:#888">
              <span>⚛️ পদার্থ: ${student.physics_avg || 0}%</span>
              <span>🧪 রসায়ন: ${student.chemistry_avg || 0}%</span>
              <span>📐 গণিত: ${student.math_avg || 0}%</span>
            </div>
          </div>`;
      });
    } else {
      list.innerHTML = '<p style="color:#888;text-align:center">এখনো কোনো শিক্ষার্থী নেই।</p>';
    }

    document.getElementById('loading-admin').style.display  = 'none';
    document.getElementById('admin-content').style.display  = 'block';

  } catch (err) {
    document.getElementById('loading-admin').innerHTML = '<p>লোড করা যায়নি: ' + err.message + '</p>';
  }
});
