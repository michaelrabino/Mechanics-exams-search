// Turns the exams array back into the text of exams.js (used by the in-page editor and by the build).
window.serializeExams = function (exams) {
  const J = v => JSON.stringify(v);
  const raw = s => {
    s = String(s == null ? '' : s);
    return (/`|\$\{|\\$/.test(s)) ? J(s) : 'String.raw`' + s + '`';
  };
  const EX = ['id', 'iso', 'semester', 'moed', 'date', 'heDate', 'pdf', 'questions'];
  const Q = ['num', 'part', 'title', 'pts', 'tags', 'fig', 'text', 'items', 'solution'];
  const extra = (o, known) => Object.keys(o).filter(k => !known.includes(k) && k[0] !== '_' && o[k] !== undefined);
  const out = [
    '// ארכיון בחינות — מכניקה 20215',
    '// כל בחינה: id, iso (תאריך למיון), semester, moed, date, heDate, pdf, questions[]',
    '// כל שאלה: num, part, title, tags[], fig (נתיב לאיור, רשימת נתיבים או null), text, items[] {l, t, pts}, solution',
    '// טקסטים: HTML + LaTeX. \\( ... \\) בתוך שורה, \\[ ... \\] בשורה נפרדת.',
    '',
    'window.EXAMS = [];'
  ];
  exams.forEach(e => {
    let s = 'window.EXAMS.push({\n';
    s += `  id: ${J(e.id)}, iso: ${J(e.iso || '')}, semester: ${J(e.semester)}, moed: ${J(e.moed)}, date: ${J(e.date)}, heDate: ${J(e.heDate || '')},\n`;
    s += `  pdf: ${J(e.pdf)},\n`;
    extra(e, EX).forEach(k => { s += `  ${k}: ${J(e[k])},\n`; });
    s += '  questions: [\n';
    s += e.questions.map(q => {
      let t = '  {\n';
      t += `    num: ${J(q.num)}, part: ${J(q.part)}, title: ${J(q.title)}${q.pts != null ? `, pts: ${J(q.pts)}` : ''},\n`;
      t += `    tags: ${J(q.tags || [])},\n`;
      t += `    fig: ${J(q.fig == null ? null : q.fig)},\n`;
      extra(q, Q).forEach(k => { t += `    ${k}: ${J(q[k])},\n`; });
      t += `    text: ${raw(q.text)},\n`;
      t += '    items: [\n' + (q.items || []).map(i =>
        `      {l:${J(i.l)}, t:${raw(i.t)}${i.pts != null && i.pts !== '' ? `, pts:${J(i.pts)}` : ''}}`).join(',\n') + '\n    ],\n';
      t += `    solution: ${raw(q.solution)}\n`;
      return t + '  }';
    }).join(',\n') + '\n  ]\n});';
    out.push(s);
  });
  out.push('window.EXAMS.sort((a,b)=>(b.iso||"").localeCompare(a.iso||""));', '');
  return out.join('\n');
};
