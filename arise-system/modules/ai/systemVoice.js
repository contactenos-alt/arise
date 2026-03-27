/**
 * Thin adapter for system voice messaging.
 * Later, replace emit() internals with OpenAI API calls.
 */
export function createSystemVoice(feedEl) {
  const max = 30;

  function emit(text, tone = 'info') {
    const line = document.createElement('p');
    line.dataset.tone = tone;
    line.textContent = `> ${new Date().toLocaleTimeString()} — ${text}`;
    feedEl.prepend(line);
    while (feedEl.children.length > max) {
      feedEl.removeChild(feedEl.lastChild);
    }
  }

  return { emit };
}
