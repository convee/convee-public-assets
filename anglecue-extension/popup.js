const state = { page: null };
const $ = (id) => document.getElementById(id);

function setStatus(message, error = false) {
  $('status').textContent = message;
  $('status').style.color = error ? '#a63d32' : '#2c6b55';
}

async function capturePage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error('No active tab');
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const text = (value) => (value || '').replace(/\\s+/g, ' ').trim().slice(0, 240);
        const price = document.querySelector('[itemprop="price"], [data-price], meta[property="product:price:amount"]');
        return {
          title: text(document.title),
          url: location.href.split('#')[0],
          heading: text(document.querySelector('h1')?.textContent),
          price: text(price?.getAttribute('content') || price?.textContent)
        };
      }
    });
    state.page = result.result;
    $('page').textContent = `${state.page.title || state.page.url}${state.page.price ? ` · ${state.page.price}` : ''}`;
    setStatus('Page captured locally.');
  } catch (error) {
    setStatus('This page could not be captured. Try a regular web page.', true);
  }
}

async function saveNote() {
  if (!state.page) {
    setStatus('Capture a page first.', true);
    return;
  }
  const entry = {
    ...state.page,
    reason: $('reason').value,
    note: $('note').value.trim(),
    capturedAt: new Date().toISOString()
  };
  const stored = await chrome.storage.local.get({ notes: [] });
  const notes = [entry, ...stored.notes].slice(0, 50);
  await chrome.storage.local.set({ notes });
  $('note').value = '';
  setStatus(`Saved locally. ${notes.length} note${notes.length === 1 ? '' : 's'} stored.`);
}

async function exportNotes() {
  const { notes = [] } = await chrome.storage.local.get({ notes: [] });
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'anglecue-page-notes.json';
  link.click();
  URL.revokeObjectURL(url);
  setStatus(`${notes.length} note${notes.length === 1 ? '' : 's'} exported.`);
}

$('capture').addEventListener('click', capturePage);
$('save').addEventListener('click', saveNote);
$('export').addEventListener('click', exportNotes);
