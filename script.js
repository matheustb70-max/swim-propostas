(() => {
  'use strict';
  const data = window.SWIM_PROPOSAL;
  if (!data) return;
  const $ = selector => document.querySelector(selector);
  const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 }).format(value);
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const html = (selector, content) => { $(selector).innerHTML = content; };
  document.querySelectorAll('[data-text]').forEach(element => {
    const value = element.dataset.text.split('.').reduce((result, key) => result?.[key], data);
    if (value !== undefined) element.textContent = value;
  });
  document.title = `SWIM × ${data.client.shortName} — Proposta criativa`;
  $('meta[name="description"]').content = data.hero.description;
  $('#year').textContent = data.proposal.issuedOn.split('/')[2];
  $('#footer-site').href = data.brand.site;
  $('#demo-label').hidden = !data.demo;
  $('#investment-demo').hidden = !data.demo;

  html('#outcomes', data.context.outcomes.map((item, i) => `<article class="outcome reveal"><span class="outcome-number">0${i + 1} /</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></article>`).join(''));
  html('#disciplines', data.studio.disciplines.map(text => `<span>${esc(text)}</span>`).join(''));
  html('#steps', data.process.steps.map((item, i) => `<li class="step" data-step="${i + 1}"><div class="step-header"><span class="step-num">${String(i + 1).padStart(2, '0')} /</span><span>${esc(item.period)}</span></div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></li>`).join(''));
  $('.step-total').textContent = `/ ${String(data.process.steps.length).padStart(2, '0')}`;
  html('#projects', data.portfolio.projects.map((item, i) => `<article class="project reveal"><button type="button" class="project-button" data-project="${i}" aria-label="Ampliar projeto ${esc(item.title)}"><div class="project-image"><img src="${esc(item.image)}" alt="${esc(item.alt)}" loading="lazy" width="800" height="500"><span class="project-arrow" aria-hidden="true">↗</span></div><div class="project-caption"><h3>${esc(item.title)}</h3><span class="project-category">${esc(item.category)}</span></div></button></article>`).join(''));
  html('#deliverables', data.scope.deliverables.map(item => `<li><span class="check" aria-hidden="true">✓</span><div><h4>${esc(item.title)}</h4><p>${esc(item.text)}</p></div></li>`).join(''));
  html('#exclusions', data.scope.exclusions.map(text => `<li>${esc(text)}</li>`).join(''));
  html('#faq-list', data.faq.items.map(item => `<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join(''));

  const quote = data.investment;
  const totals = { split: quote.total, cash: quote.total - quote.cashDiscount, card: quote.cardTotal };
  const firstPayment = Math.round(quote.total * 50) / 100;
  const finalPayment = Math.round((quote.total - firstPayment) * 100) / 100;
  const cardPayment = Math.round(quote.cardTotal / quote.cardInstallments * 100) / 100;
  const lastCardPayment = Math.round((quote.cardTotal - cardPayment * (quote.cardInstallments - 1)) * 100) / 100;
  const differentLastCardPayment = cardPayment !== lastCardPayment;
  $('#total-price').textContent = money(quote.total);
  const amounts = { split: firstPayment === finalPayment ? `2 × ${money(firstPayment)}` : `${money(firstPayment)} + ${money(finalPayment)}`, cash: money(totals.cash), card: `${quote.cardInstallments} × ${money(cardPayment)}` };
  const notes = { split: `Total: ${money(quote.total)} · sem acréscimo`, cash: `Economia de ${money(quote.cashDiscount)}`, card: `Total: ${money(quote.cardTotal)} · acréscimo de ${money(quote.cardTotal - quote.total)}${differentLastCardPayment ? ` · última parcela ajustada para ${money(lastCardPayment)}` : ''}` };
  html('#payments', quote.payments.map((item, i) => `<label class="payment-choice"><input type="radio" name="payment" value="${esc(item.id)}" ${i === 0 ? 'checked' : ''}><span class="payment-badge">${esc(item.id === 'card' ? `Em ${quote.cardInstallments} parcelas` : item.badge)}</span><span class="payment-name">${esc(item.label)}</span><strong class="payment-amount">${esc(amounts[item.id])}</strong><span class="payment-detail">${esc(item.description)}</span><span class="payment-total">${esc(notes[item.id])}</span></label>`).join(''));
  function updatePayment() {
    const id = $('input[name="payment"]:checked').value;
    const choice = quote.payments.find(item => item.id === id);
    const detail = id === 'split' ? `${money(firstPayment)} na contratação + ${money(finalPayment)} antes da publicação.` : id === 'cash' ? `${money(totals.cash)} na contratação, com ${money(quote.cashDiscount)} de desconto.` : `${quote.cardInstallments} parcelas de ${money(cardPayment)}${differentLastCardPayment ? `, com a última ajustada para ${money(lastCardPayment)}` : ''}. Total de ${money(quote.cardTotal)}.`;
    html('#selected-payment', `<span class="dot" aria-hidden="true"></span><span><strong>${esc(choice.label)}:</strong> ${esc(detail)}</span>`);
    const message = data.demo
      ? `Olá, Swim! Estou vendo o modelo demonstrativo de proposta para ${data.client.shortName} e gostaria de conversar sobre ele.`
      : `Olá, Swim! Vi a proposta ${data.proposal.number} para ${data.client.name} e gostaria de conversar sobre o projeto. Minha preferência de pagamento é ${choice.label.toLowerCase()} (${money(totals[id])}).`;
    const link = `https://wa.me/${data.brand.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    ['#faq-contact', '#closing-contact'].forEach(selector => { $(selector).href = link; });
    $('#contract-payment').textContent = choice.label;
    $('#contract-total').textContent = money(totals[id]);
    $('#contract-payment-detail').textContent = detail;
  }
  document.querySelectorAll('input[name="payment"]').forEach(input => input.addEventListener('change', updatePayment));
  updatePayment();

  const contractDialog = $('#contract-dialog');
  const signingButton = $('#contract-sign');
  let signingUrl = null;
  // Apenas links de assinatura do Autentique. Nenhuma chave de API no navegador.
  function getSigningUrl() {
    const selected = $('input[name="payment"]:checked').value;
    const value = data.contract?.signingUrls?.[selected];
    if (!value || data.demo) return null;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && (url.hostname === 'autentique.com.br' || url.hostname.endsWith('.autentique.com.br')) && url.pathname !== '/' ? url.href : null;
    } catch { return null; }
  }
  html('#contract-deliverables', data.scope.deliverables.map(item => `<li><strong>${esc(item.title)}</strong><span>${esc(item.text)}</span></li>`).join(''));
  $('#contract-exclusions').textContent = data.scope.exclusions.join(' ');
  function updateSigningButton() {
    signingButton.disabled = !signingUrl || !$('#contract-reviewed').checked;
  }
  $('#contract-cta').addEventListener('click', () => {
    updatePayment();
    signingUrl = getSigningUrl();
    $('#contract-reviewed').checked = false;
    $('#contract-status').textContent = signingUrl ? 'O contrato será aberto no Autentique para leitura e assinatura.' : data.contract.unavailableMessage;
    $('#contract-status').classList.toggle('ready', Boolean(signingUrl));
    updateSigningButton();
    contractDialog.showModal();
  });
  $('#contract-reviewed').addEventListener('change', updateSigningButton);
  signingButton.addEventListener('click', () => {
    if (!signingUrl || !$('#contract-reviewed').checked) return;
    // Ir ao documento não é tratado como assinatura concluída.
    window.location.assign(signingUrl);
  });
  $('.contract-close').addEventListener('click', () => contractDialog.close());
  $('.contract-back').addEventListener('click', () => contractDialog.close());

  const dialog = $('#project-dialog');
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const project = data.portfolio.projects[Number(button.dataset.project)];
    $('#dialog-image').src = project.image;
    $('#dialog-image').alt = project.alt;
    $('#dialog-title').textContent = project.title;
    $('#dialog-description').textContent = project.description;
    dialog.showModal();
  }));
  $('#project-dialog .dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

  let previousDetails = [];
  window.addEventListener('beforeprint', () => {
    previousDetails = [...document.querySelectorAll('details')].map(element => ({ element, open: element.open }));
    previousDetails.forEach(({ element }) => { element.open = true; });
  });
  window.addEventListener('afterprint', () => previousDetails.forEach(({ element, open }) => { element.open = open; }));
  $('#print-button').addEventListener('click', () => window.print());

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
  let queued = false;
  function updateScroll() {
    queued = false;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    $('.reading-progress span').style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0})`;
    let active = $('.step');
    document.querySelectorAll('.step').forEach(step => {
      if (step.getBoundingClientRect().top < window.innerHeight * .55) active = step;
    });
    if (active) {
      $('#current-step').textContent = active.dataset.step.padStart(2, '0');
      document.querySelectorAll('.step').forEach(step => step.classList.toggle('active', step === active));
    }
  }
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();
})();
