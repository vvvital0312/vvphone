(function () {
  console.log('[VVHOST][TEST] external js loaded');

  try {
    console.log('[VVHOST][TEST] phoneFrame:', document.getElementById('phoneFrame'));
    console.log('[VVHOST][TEST] parent mes count:', window.parent.document.querySelectorAll('#chat .mes').length);
  } catch (e) {
    console.error('[VVHOST][TEST] failed:', e);
  }
})();
