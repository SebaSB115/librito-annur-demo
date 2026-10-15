import { answer, greeting, newSession } from './src/chat.mjs';

const nodes = {
  messages: document.querySelector('#messages'),
  suggestions: document.querySelector('#suggestions'),
  form: document.querySelector('#chat-form'),
  input: document.querySelector('#message-input'),
  send: document.querySelector('#send-button'),
  reset: document.querySelector('#reset-button'),
  panel: document.querySelector('#chat-panel'),
  launcher: document.querySelector('#chat-launcher'),
  close: document.querySelector('#chat-close'),
  dialog: document.querySelector('#product-dialog'),
};

let state = newSession();
let busy = false;

function element(tag, className, value) {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (value !== undefined) item.textContent = value;
  return item;
}

function addText(value, sender = 'assistant') {
  const row = element('div', `message-row ${sender}`);
  if (sender === 'assistant') {
    const avatar = element('span', 'mini-avatar');
    avatar.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 18c-3-2-5.6-2.4-9-2V5c3.4-.5 6 .1 9 2v11Zm0 0c3-2 5.6-2.4 9-2V5c-3.4-.5-6 .1-9 2v11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 7v11" stroke="currentColor" stroke-width="1.4"/></svg>';
    row.append(avatar);
  }
  row.append(element('div', 'message-bubble', value));
  nodes.messages.append(row);
  nodes.messages.scrollTop = nodes.messages.scrollHeight;
  return row;
}

function addProduct(data) {
  if (!data) return;
  const row = element('div', 'product-row');
  const button = element('button', 'product-card');
  button.type = 'button';
  button.setAttribute('aria-label', `Ver ficha ilustrativa: ${data.title}`);
  const cover = element('span', `product-cover ${data.cover}`);
  cover.append(element('span', 'cover-book', data.title));
  const copy = element('span', 'product-copy');
  copy.append(element('small', '', data.eyebrow));
  copy.append(element('strong', '', data.title));
  copy.append(element('em', '', 'Conocer este libro ↗'));
  button.append(cover, copy);
  button.addEventListener('click', () => openProduct(data));
  row.append(button);
  nodes.messages.append(row);
  nodes.messages.scrollTop = nodes.messages.scrollHeight;
}

function showSuggestions(items = []) {
  nodes.suggestions.replaceChildren();
  for (const label of items) {
    const button = element('button', 'suggestion', label);
    button.type = 'button';
    button.addEventListener('click', () => sendMessage(label));
    nodes.suggestions.append(button);
  }
}

function showReply(reply) {
  for (const message of reply.messages || []) {
    if (message.type === 'text') addText(message.text);
    if (message.type === 'product') addProduct(message.product);
  }
  showSuggestions(reply.suggestions);
  requestAnimationFrame(() => {
    nodes.messages.scrollTop = nodes.messages.scrollHeight;
  });
}

async function sendMessage(value) {
  const valueText = value.trim();
  if (!valueText || busy || valueText.length > 500) return;
  busy = true;
  nodes.send.disabled = true;
  nodes.input.value = '';
  showSuggestions();
  addText(valueText, 'user');
  try {
    showReply(answer(state, valueText));
  } catch (error) {
    addText(`No pude responder ahora: ${error.message}. Inténtalo de nuevo.`);
  } finally {
    busy = false;
    nodes.send.disabled = false;
    nodes.input.focus();
  }
}

function resetConversation() {
  if (busy) return;
  state = newSession();
  nodes.messages.replaceChildren();
  nodes.input.value = '';
  showReply(greeting());
}

function openProduct(data) {
  document.querySelector('#dialog-title').textContent = data.title;
  document.querySelector('#dialog-description').textContent = data.description;
  document.querySelector('#dialog-cover-title').textContent = data.title;
  document.querySelector('#dialog-cover').className = `dialog-cover ${data.cover}`;
  nodes.dialog.showModal();
}

function setChatOpen(open, moveFocus = false) {
  nodes.panel.hidden = !open;
  document.body.classList.toggle('chat-open', open);
  nodes.launcher.setAttribute('aria-expanded', String(open));
  nodes.launcher.setAttribute('aria-label', open ? 'Cerrar chat con Librito' : 'Abrir chat con Librito');
  if (moveFocus) (open ? nodes.input : nodes.launcher).focus();
}

nodes.form.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessage(nodes.input.value);
});
nodes.input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    nodes.form.requestSubmit();
  }
});
nodes.reset.addEventListener('click', resetConversation);
nodes.launcher.addEventListener('click', () => setChatOpen(nodes.panel.hidden, true));
nodes.close.addEventListener('click', () => setChatOpen(false, true));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !nodes.panel.hidden && !nodes.dialog.open) setChatOpen(false, true);
});
document.querySelector('#dialog-close').addEventListener('click', () => nodes.dialog.close());
document.querySelector('#dialog-action').addEventListener('click', () => {
  nodes.dialog.close();
  nodes.input.focus();
});

resetConversation();
