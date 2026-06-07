(function () {
  if (window.__VV_HOST_CHAT_CORE_INSTALLED__) {
    console.log('[VVHOST_CHAT] core already installed, skip');
    return;
  }

  window.__VV_HOST_CHAT_CORE_INSTALLED__ = true;

  const config = window.VV_HOST_CONFIG || {};

  const VVHOST_CHAT_VERSION = config.version || 'CHAT-ALL-IN-ONE-006';
  const PHONE_ORIGIN = config.phoneOrigin || 'https://vvvital0312.github.io';
  const PHONE_FRAME_ID = config.phoneFrameId || 'phoneFrame';
  const HOST_TYPE = config.hostType || 'chat';

  const CURRENT_CHAT_ID = String(config.currentChatId || '').trim();
  const CURRENT_TARGET = String(config.currentTarget || '').trim();

  let lastExpectedChatId = CURRENT_CHAT_ID || '';
  let lastVVChatSyncRaw = '';
  let lastViewId = '';
  let lastExpectedDiaryId = '';
  let lastExpectedDiaryAuthorId = '';
  let lastVVDiarySyncRaw = '';

  console.log('[VVHOST_CHAT VERSION]', VVHOST_CHAT_VERSION);
  console.log('[VVHOST_CHAT] loaded external core', location.href);
  console.log('[VVHOST_CHAT] config:', {
    HOST_TYPE,
    PHONE_ORIGIN,
    PHONE_FRAME_ID,
    CURRENT_CHAT_ID,
    CURRENT_TARGET,
    hasPhoneFrame: !!document.getElementById(PHONE_FRAME_ID)
  });

  function getRoot() {
    try {
      if (window.parent && window.parent !== window) return window.parent;
    } catch (e) {}

    try {
      if (window.top && window.top !== window) return window.top;
    } catch (e) {}

    return window;
  }

  function getCtx() {
    var root = getRoot();

    try {
      if (root && root.SillyTavern && typeof root.SillyTavern.getContext === 'function') {
        return root.SillyTavern.getContext();
      }
    } catch (e) {}

    try {
      if (root && typeof root.getContext === 'function') {
        return root.getContext();
      }
    } catch (e) {}

    try {
      if (window.SillyTavern && typeof window.SillyTavern.getContext === 'function') {
        return window.SillyTavern.getContext();
      }
    } catch (e) {}

    try {
      if (typeof window.getContext === 'function') {
        return window.getContext();
      }
    } catch (e) {}

    return null;
  }

  function getPhoneFrame() {
    return document.getElementById(PHONE_FRAME_ID);
  }

  function postToPhone(payload) {
    try {
      const frame = getPhoneFrame();

      if (!frame || !frame.contentWindow) {
        console.warn('[VVHOST_CHAT] phoneFrame not ready:', PHONE_FRAME_ID);
        return false;
      }

      frame.contentWindow.postMessage(payload, PHONE_ORIGIN);
      console.log('[VVHOST_CHAT][postToPhone]', payload.type, payload);
      return true;
    } catch (err) {
      console.warn('[VVHOST_CHAT] postToPhone failed:', err);
      return false;
    }
  }

  function getSTChat() {
    try {
      const ctx = getCtx();
      if (ctx && Array.isArray(ctx.chat)) return ctx.chat;
    } catch (e) {}

    try {
      const root = getRoot();
      if (root && Array.isArray(root.chat)) return root.chat;
    } catch (e) {}

    return null;
  }

  function normalizeFeedTextForKey(text) {
    return String(text || '')
      .replace(/\s+/g, ' ')
      .replace(/[，。！？、,.!?；;：:]/g, '')
      .trim();
  }

  function getFeedField(block, key) {
    block = String(block || '');
    key = String(key || '');

    var re = new RegExp(
      '(?:^|\\n)\\s*' + key + '\\s*=\\s*([\\s\\S]*?)(?=\\n[a-zA-Z\\u4e00-\\u9fa5]+\\s*=|\\n\\[\\/|\\[\\/|$)',
      'i'
    );

    var m = block.match(re);
    return m ? String(m[1] || '').trim() : '';
  }

  function buildInteractionKey(block) {
    var from = getFeedField(block, 'from');
    var action = getFeedField(block, 'action').toLowerCase();
    var content = getFeedField(block, 'content');
    var replyTo = getFeedField(block, 'replyTo');

    return [
      normalizeFeedTextForKey(action),
      normalizeFeedTextForKey(from),
      normalizeFeedTextForKey(content),
      normalizeFeedTextForKey(replyTo)
    ].join('|');
  }

  function getExistingInteractionKeyMap(feedHiddenText) {
    var map = {};
    var raw = String(feedHiddenText || '');
    var blocks = raw.match(/\[互动\][\s\S]*?\[\/互动\]/g) || [];

    blocks.forEach(function (block) {
      var key = buildInteractionKey(block);
      if (key && key !== '|||') {
        map[key] = true;
      }
    });

    return map;
  }

  function dedupeInteractionBlocksForAppend(currentMes, interactionBlocks) {
    var existingMap = getExistingInteractionKeyMap(currentMes);
    var localMap = {};
    var result = [];

    (interactionBlocks || []).forEach(function (block) {
      var key = buildInteractionKey(block);

      if (!key || key === '|||') return;

      if (existingMap[key]) {
        console.log('[VVHOST_FEED_DEDUPE] skip existing interaction:', key);
        return;
      }

      if (localMap[key]) {
        console.log('[VVHOST_FEED_DEDUPE] skip duplicated in same reply:', key);
        return;
      }

      localMap[key] = true;
      result.push(block);
    });

    return result;
  }

  function findHostMessageIndexByMarkers() {
    var ctx = getCtx();

    if (!ctx || !Array.isArray(ctx.chat)) return -1;

    for (var i = ctx.chat.length - 1; i >= 0; i--) {
      var msg = ctx.chat[i];
      if (!msg) continue;

      var text = String(msg.mes || '');

      if (
        text.includes('[VV_CHAT_SYNC]') ||
        text.includes('[/VV_CHAT_SYNC]') ||
        text.includes('VV_CALL_HIDDEN_DATA') ||
        text.includes('VV_FEED_HIDDEN_DATA') ||
        text.includes('VV_ANNOTATION_SYNC') ||
        text.includes('vv' + '手机') ||
        text.includes('vv' + 'phone') ||
        text.includes('vvvital0312.github.io/' + 'vvphone') ||
        text.includes('vvvital0312.github.io/') ||
        text.includes('phone' + 'Frame') ||
        text.includes('VV' + 'HOST')
      ) {
        console.log('[VVHOST_CHAT] found host msg, index:', i, 'snippet:', text.substring(0, 80));
        return i;
      }
    }

    for (var j = ctx.chat.length - 1; j >= 0; j--) {
      var m = ctx.chat[j];

      if (m && !m.is_user) {
        console.log('[VVHOST_CHAT] fallback: using latest AI msg, index:', j);
        return j;
      }
    }

    return -1;
  }

  function extractChatIdFromCommand(command) {
    const raw = String(command || '');

    const m =
      raw.match(/(?:^|\n)\s*聊天ID\s*[:：]\s*([^\n\r]+)/i) ||
      raw.match(/(?:^|\n)\s*chatId\s*[=:]\s*([^\n\r]+)/i);

    return m ? String(m[1] || '').trim() : '';
  }

  function extractDiaryIdFromCommand(command) {
    const raw = String(command || '');

    const m =
      raw.match(/(?:^|\n)\s*diaryId\s*[=:]\s*([^\n\r]+)/i) ||
      raw.match(/(?:^|\n)\s*日记ID\s*[=:：]\s*([^\n\r]+)/i);

    return m ? String(m[1] || '').trim() : '';
  }

  function extractDiaryAuthorIdFromCommand(command) {
    const raw = String(command || '');

    const m =
      raw.match(/(?:^|\n)\s*authorId\s*[=:]\s*([^\n\r]+)/i) ||
      raw.match(/(?:^|\n)\s*作者ID\s*[=:：]\s*([^\n\r]+)/i);

    return m ? String(m[1] || '').trim() : '';
  }

  function isDiaryCommand(command) {
    const raw = String(command || '');

    return (
      raw.includes('[VV_DIARY_SYNC]') ||
      /写一篇日记/.test(raw) ||
      /写日记/.test(raw)
    );
  }

  function extractValidVVChatSyncBlock(text, expectedChatId) {
    const raw = String(text || '');

    if (!raw) return '';
    if (!raw.includes('[VV_CHAT_SYNC]')) return '';
    if (!raw.includes('[/VV_CHAT_SYNC]')) return '';

    const match = raw.match(/\[VV_CHAT_SYNC\][\s\S]*?\[\/VV_CHAT_SYNC\]/i);
    if (!match) return '';

    let block = String(match[0] || '').trim();

    if (expectedChatId) {
      const ok =
        block.includes('chatId=' + expectedChatId) ||
        block.includes('chatId: ' + expectedChatId) ||
        block.includes('聊天ID:' + expectedChatId) ||
        block.includes('聊天ID：' + expectedChatId);

      if (!ok) {
        console.warn('[VVHOST_CHAT] chatId mismatch, force fix to:', expectedChatId);

        if (/^(\s*chatId\s*=\s*)(.*)$/im.test(block)) {
          block = block.replace(
            /^(\s*chatId\s*=\s*)(.*)$/im,
            '$1' + expectedChatId
          );
        } else {
          block = block.replace(
            /\[VV_CHAT_SYNC\]/i,
            '[VV_CHAT_SYNC]\nchatId=' + expectedChatId
          );
        }
      }
    }

    if (!/side\s*[=:]\s*left/i.test(block)) return '';
    if (!/content\s*[=:]/i.test(block)) return '';

    return block;
  }

  function extractValidVVDiarySyncBlock(text, expectedDiaryId, expectedAuthorId) {
    const raw = String(text || '');

    if (!raw.includes('[VV_DIARY_SYNC]')) return '';
    if (!raw.includes('[/VV_DIARY_SYNC]')) return '';

    const match = raw.match(/\[VV_DIARY_SYNC\][\s\S]*?\[\/VV_DIARY_SYNC\]/i);
    if (!match) return '';

    const block = String(match[0] || '').trim();

    if (expectedDiaryId) {
      const ok =
        block.includes('diaryId=' + expectedDiaryId) ||
        block.includes('diaryId: ' + expectedDiaryId) ||
        block.includes('日记ID=' + expectedDiaryId) ||
        block.includes('日记ID：' + expectedDiaryId);

      if (!ok) {
        console.warn('[VVHOST_CHAT][DIARY] diaryId mismatch, expected=', expectedDiaryId);
        return '';
      }
    }

    if (expectedAuthorId) {
      const ok =
        block.includes('authorId=' + expectedAuthorId) ||
        block.includes('authorId: ' + expectedAuthorId) ||
        block.includes('作者ID=' + expectedAuthorId) ||
        block.includes('作者ID：' + expectedAuthorId);

      if (!ok) {
        console.warn('[VVHOST_CHAT][DIARY] authorId mismatch but ignored', {
          expected: expectedAuthorId
        });
      }
    }

    if (!/title\s*[=:：]/i.test(block)) {
      console.warn('[VVHOST_CHAT][DIARY] missing title');
      return '';
    }

    if (!/weather\s*[=:：]/i.test(block)) {
      console.warn('[VVHOST_CHAT][DIARY] missing weather');
      return '';
    }

    if (!/paragraph\s*[=:：]/i.test(block)) {
      console.warn('[VVHOST_CHAT][DIARY] missing paragraph');
      return '';
    }

    return block;
  }

  function extractValidVVAnnotationSyncBlock(text) {
    const raw = String(text || '');

    if (!raw.includes('[VV_ANNOTATION_SYNC]')) return '';
    if (!raw.includes('[/VV_ANNOTATION_SYNC]')) return '';

    const match = raw.match(/\[VV_ANNOTATION_SYNC\][\s\S]*?\[\/VV_ANNOTATION_SYNC\]/i);
    if (!match) return '';

    const block = String(match[0] || '').trim();

    if (!/diaryId\s*[=:]/i.test(block)) return '';
    if (!/annotationId\s*[=:]/i.test(block)) return '';

    return block;
  }

  function extractValidVVFeedSyncBlock(text) {
    const raw = String(text || '');

    if (!raw.includes('[VV_FEED_SYNC]')) return '';
    if (!raw.includes('[/VV_FEED_SYNC]')) return '';

    const match = raw.match(/\[VV_FEED_SYNC\][\s\S]*?\[\/VV_FEED_SYNC\]/i);
    return match ? String(match[0]).trim() : '';
  }

  function extractValidVVCallSyncBlock(text) {
    const raw = String(text || '');

    if (!raw.includes('[VV_CALL_SYNC]')) return '';
    if (!raw.includes('[/VV_CALL_SYNC]')) return '';

    const match = raw.match(/\[VV_CALL_SYNC\][\s\S]*?\[\/VV_CALL_SYNC\]/i);
    return match ? String(match[0]).trim() : '';
  }

  function extractIncomingCallBlock(text) {
    const raw = String(text || '');

    if (!raw.includes('[VV_INCOMING_CALL]')) return '';
    if (!raw.includes('[/VV_INCOMING_CALL]')) return '';

    const match = raw.match(/\[VV_INCOMING_CALL\][\s\S]*?\[\/VV_INCOMING_CALL\]/i);
    return match ? String(match[0]).trim() : '';
  }

  function postChatSyncToPhone(syncBlock, chatId, viewId, msgIndex) {
    if (!syncBlock) return false;

    lastVVChatSyncRaw = syncBlock;
    if (chatId) lastExpectedChatId = chatId;
    if (viewId) lastViewId = viewId;

    return postToPhone({
      type: 'VVPHONE_CHAT_SYNC',
      raw: syncBlock,
      chatId: chatId || lastExpectedChatId || CURRENT_CHAT_ID || '',
      viewId: viewId || lastViewId || '',
      msgIndex: msgIndex !== undefined ? msgIndex : -1
    });
  }

  function postCallSyncToPhone(raw, chatId, viewId) {
    if (!raw) return false;

    return postToPhone({
      type: 'VVPHONE_CALL_SYNC',
      raw: raw,
      chatId: chatId || lastExpectedChatId || CURRENT_CHAT_ID || '',
      viewId: viewId || lastViewId || ''
    });
  }

  function postIncomingCallToPhone(raw, viewId) {
    if (!raw) return false;

    return postToPhone({
      type: 'VVPHONE_INCOMING_CALL',
      raw: raw,
      viewId: viewId || lastViewId || ''
    });
  }

  function postFeedSyncToPhone(block, viewId) {
    if (!block) return false;

    return postToPhone({
      type: 'VVPHONE_FEED_SYNC',
      raw: block,
      viewId: viewId || lastViewId || ''
    });
  }

  function postDiarySyncToPhone(raw, diaryId, authorId, viewId) {
    if (!raw) return false;

    const rawText = String(raw || '');

    const diaryIdMatch =
      rawText.match(/(?:^|\n)\s*diaryId\s*[=:：]\s*([^\n\r]+)/i) ||
      rawText.match(/(?:^|\n)\s*日记ID\s*[=:：]\s*([^\n\r]+)/i);

    const authorIdMatch =
      rawText.match(/(?:^|\n)\s*authorId\s*[=:：]\s*([^\n\r]+)/i) ||
      rawText.match(/(?:^|\n)\s*作者ID\s*[=:：]\s*([^\n\r]+)/i);

    const realDiaryId = diaryIdMatch ? String(diaryIdMatch[1] || '').trim() : diaryId;
    const realAuthorId = authorIdMatch ? String(authorIdMatch[1] || '').trim() : authorId;

    lastVVDiarySyncRaw = raw;

    if (realDiaryId) lastExpectedDiaryId = realDiaryId;
    if (realAuthorId) lastExpectedDiaryAuthorId = realAuthorId;
    if (viewId) lastViewId = viewId;

    return postToPhone({
      type: 'VVPHONE_DIARY_SYNC',
      raw: raw,
      diaryId: realDiaryId || lastExpectedDiaryId || '',
      authorId: realAuthorId || lastExpectedDiaryAuthorId || '',
      viewId: viewId || lastViewId || ''
    });
  }

  function postAnnotationSyncToPhone(raw, diaryId, annotationId, viewId) {
    if (!raw) return false;

    return postToPhone({
      type: 'VVPHONE_ANNOTATION_SYNC',
      raw: raw,
      diaryId: diaryId || '',
      annotationId: annotationId || '',
      viewId: viewId || lastViewId || ''
    });
  }

  var VV_CALL_INTERCEPTOR = (function () {
    var isCallActive = false;
    var callTargetName = '';
    var callChatId = '';
    var callStartTime = '';
    var callTranscriptLines = [];
    var eventHandler = null;
    var onCallMessageCallback = null;
    var processedMessageIds = {};
    var hostMessageIndex = -1;

    function findHostMessageIndex() {
      return findHostMessageIndexByMarkers();
    }

    function appendCallDataToHostMessage(newContent) {
      var ctx = getCtx();

      if (!ctx || hostMessageIndex < 0) return;

      var msg = ctx.chat[hostMessageIndex];
      if (!msg) return;

      var currentMes = String(msg.mes || '');

      currentMes = currentMes.replace(
        /\[VV_CALL_HIDDEN_DATA\][\s\S]*?\[\/VV_CALL_HIDDEN_DATA\]/g,
        ''
      );

      currentMes = currentMes.replace(
        /<div class="vv-call-hidden"[\s\S]*?<\/div>/g,
        ''
      );

      var hiddenBlock =
        '\n<div class="vv-call-hidden" style="display:none">[VV_CALL_HIDDEN_DATA]\n' +
        String(newContent || '') +
        '\n[/VV_CALL_HIDDEN_DATA]</div>\n';

      msg.mes = currentMes.trimEnd() + hiddenBlock;

      if (typeof ctx.saveChat === 'function') {
        try {
          ctx.saveChat();
        } catch (e) {}
      }

      console.log('[CALL_INTERCEPT] call data appended to host msg (index:' + hostMessageIndex + ')');
    }

    function buildTranscriptText() {
      var text = '';

      text += 'call target:' + callTargetName + '\n';
      text += 'call chatId:' + callChatId + '\n';
      text += 'call time:' + callStartTime + '\n';
      text += 'status:' + (isCallActive ? 'active' : 'ended') + '\n';
      text += '---\n';

      callTranscriptLines.forEach(function (line) {
        if (line.side === 'right') {
          text += 'user: ' + line.content + '\n';
        } else {
          text += line.speaker + ': ' + line.content + '\n';
        }
      });

      return text;
    }

    function startCallIntercept(options) {
      if (isCallActive) {
        console.warn('[CALL_INTERCEPT] already in call');
        return false;
      }

      var ctx = getCtx();

      if (!ctx) {
        console.error('[CALL_INTERCEPT] cannot get ST context');
        return false;
      }

      callTargetName = options.targetName || options.target || '对方';
      callChatId = options.chatId || CURRENT_CHAT_ID || '';
      callStartTime = options.storyTime || '';
      onCallMessageCallback = options.onMessage || null;
      callTranscriptLines = [];
      processedMessageIds = {};

      hostMessageIndex = findHostMessageIndex();

      if (hostMessageIndex < 0) {
        console.error('[CALL_INTERCEPT] host msg not found');
        return false;
      }

      console.log('[CALL_INTERCEPT] host msg index:', hostMessageIndex);

      eventHandler = function (messageIndex) {
        handleInterceptedMessage(messageIndex);
      };

      try {
        ctx.eventSource.on(ctx.eventTypes.MESSAGE_RECEIVED, eventHandler);
      } catch (e) {
        console.error('[CALL_INTERCEPT] event bind failed:', e);
        return false;
      }

      isCallActive = true;

      appendCallDataToHostMessage(buildTranscriptText());

      console.log('[CALL_INTERCEPT] call intercept started', {
        target: callTargetName,
        chatId: callChatId,
        hostIndex: hostMessageIndex
      });

      return true;
    }

    function endCallIntercept() {
      if (!isCallActive) return;

      var ctx = getCtx();

      if (ctx && eventHandler) {
        try {
          ctx.eventSource.removeListener(ctx.eventTypes.MESSAGE_RECEIVED, eventHandler);
        } catch (e) {
          try {
            ctx.eventSource.off(ctx.eventTypes.MESSAGE_RECEIVED, eventHandler);
          } catch (e2) {}
        }
      }

      eventHandler = null;
      isCallActive = false;

      appendCallDataToHostMessage(buildTranscriptText());

      onCallMessageCallback = null;
      processedMessageIds = {};

      console.log('[CALL_INTERCEPT] call intercept stopped');
    }

    function addUserCallLines(userLines) {
      if (!isCallActive) return;

      if (!Array.isArray(userLines)) userLines = [userLines];

      userLines.forEach(function (line) {
        line = String(line || '').trim();

        if (line) {
          callTranscriptLines.push({
            side: 'right',
            speaker: 'user',
            content: line
          });
        }
      });

      appendCallDataToHostMessage(buildTranscriptText());
    }

    async function handleInterceptedMessage(messageIndex) {
      var ctx = getCtx();

      if (!ctx || !isCallActive) return;

      var msg = ctx.chat[messageIndex];

      if (!msg || msg.is_user) return;

      if (messageIndex === hostMessageIndex) {
        console.log('[CALL_INTERCEPT] skip host message');
        return;
      }

      var msgKey = messageIndex + '_' + String(msg.mes || '').length;

      if (processedMessageIds[msgKey]) {
        console.log('[CALL_INTERCEPT] skip processed message:', msgKey);
        return;
      }

      processedMessageIds[msgKey] = true;

      var rawContent = String(msg.mes || '');

      console.log('[CALL_INTERCEPT] intercept AI response, index:', messageIndex, 'length:', rawContent.length);
      console.log('[CALL_INTERCEPT] content preview:', rawContent.substring(0, 160));

      if (!rawContent.includes('[VV_CALL_SYNC]') && !rawContent.includes('[/VV_CALL_SYNC]')) {
        console.warn('[CALL_INTERCEPT] intercepted AI response has no VV_CALL_SYNC, skip delete');
        return;
      }

      var parsed = parseCallResponse(rawContent);

      if (parsed.messages && parsed.messages.length > 0) {
        parsed.messages.forEach(function (m) {
          callTranscriptLines.push({
            side: 'left',
            speaker: m.speaker || callTargetName,
            content: m.content
          });
        });

        console.log('[CALL_INTERCEPT] add', parsed.messages.length, 'call messages to transcript');
      }

      appendCallDataToHostMessage(buildTranscriptText());

      if (typeof onCallMessageCallback === 'function') {
        try {
          onCallMessageCallback({
            raw: rawContent,
            callPhase: parsed.callPhase,
            messages: parsed.messages,
            target: parsed.target || callTargetName,
            chatId: parsed.chatId || callChatId
          });
        } catch (e) {
          console.error('[CALL_INTERCEPT] callback error:', e);
        }
      }

      await safeDeleteCallFloors(messageIndex);
    }

    async function safeDeleteCallFloors(aiMessageIndex) {
      var ctx = getCtx();

      if (!ctx || !Array.isArray(ctx.chat)) return;

      var root = getRoot();

      console.log('[CALL_INTERCEPT] start delete call floors, aiIndex:', aiMessageIndex, 'total:', ctx.chat.length);

      var toDelete = [];

      for (var i = ctx.chat.length - 1; i >= 0; i--) {
        var m = ctx.chat[i];

        if (!m) continue;

        if (i === hostMessageIndex) continue;

        if (!m.is_user) {
          var mesText = String(m.mes || m.message || '');

          if (
            mesText.includes('[VV_CALL_SYNC]') ||
            mesText.includes('[/VV_CALL_SYNC]')
          ) {
            toDelete.push(i);
            continue;
          }
        }

        if (m.is_user) {
          var userText = String(m.mes || m.message || '');

          if (
            userText.includes('电话模式') ||
            userText.includes('VV_CALL') ||
            userText.includes('VV_EVENT') ||
            userText.includes('通话阶段') ||
            userText.includes('callPhase') ||
            userText.includes('手机电话通话事件') ||
            userText.includes('用户正在拨打电话') ||
            userText.includes('正在和用户打电话')
          ) {
            toDelete.push(i);
            continue;
          }
        }

        if (ctx.chat.length - 1 - i > 10) break;
      }

      console.log('[CALL_INTERCEPT] delete call floors:', toDelete);

      if (toDelete.length === 0) {
        console.warn('[CALL_INTERCEPT] no call floors to delete');
        return;
      }

      toDelete.sort(function (a, b) {
        return b - a;
      });

      for (var j = 0; j < toDelete.length; j++) {
        var delIndex = toDelete[j];

        try {
          var domEl = root.document.querySelector('[mesid="' + delIndex + '"]');

          if (domEl) {
            domEl.style.display = 'none';
            domEl.remove();
            console.log('[CALL_INTERCEPT] DOM deleted, mesid:', delIndex);
          }

          if (ctx.chat[delIndex]) {
            ctx.chat.splice(delIndex, 1);
            console.log('[CALL_INTERCEPT] chat array deleted index:', delIndex);
          }
        } catch (e) {
          console.error('[CALL_INTERCEPT] delete error:', e);
        }
      }

      try {
        var allMes = root.document.querySelectorAll('#chat .mes');

        allMes.forEach(function (el, idx) {
          el.setAttribute('mesid', idx);
        });
      } catch (e) {
        console.warn('[CALL_INTERCEPT] renumber mesid error:', e);
      }

      hostMessageIndex = findHostMessageIndex();

      console.log('[CALL_INTERCEPT] host message index updated:', hostMessageIndex);

      if (typeof ctx.saveChat === 'function') {
        try {
          ctx.saveChat();
        } catch (e) {}
      }

      console.log('[CALL_INTERCEPT] delete completed, remaining floors:', ctx.chat.length);
    }

    function parseCallResponse(raw) {
      var result = {
        callPhase: '',
        chatId: '',
        target: '',
        messages: []
      };

      raw = String(raw || '');

      if (!raw) return result;

      var syncMatch = raw.match(/\[VV_CALL_SYNC\]([\s\S]*?)\[\/VV_CALL_SYNC\]/i);

      if (syncMatch) {
        var block = syncMatch[1];

        var phaseMatch = block.match(/(?:^|\n)\s*callPhase\s*=\s*([^\n\r]+)/i);
        var chatIdMatch = block.match(/(?:^|\n)\s*chatId\s*=\s*([^\n\r]+)/i);
        var targetMatch = block.match(/(?:^|\n)\s*target\s*=\s*([^\n\r]+)/i);

        result.callPhase = phaseMatch ? phaseMatch[1].trim().toLowerCase() : '';
        result.chatId = chatIdMatch ? chatIdMatch[1].trim() : '';
        result.target = targetMatch ? targetMatch[1].trim() : '';

        var talkMatches = block.match(/\[通话\][\s\S]*?(?=\[通话\]|\[\/VV_CALL_SYNC\]|$)/g);

        if (talkMatches) {
          talkMatches.forEach(function (talkBlock) {
            var speakerM = talkBlock.match(/(?:^|\n)\s*speaker\s*=\s*([^\n\r]+)/i);
            var contentM = talkBlock.match(/(?:^|\n)\s*content\s*=\s*([\s\S]*?)(?=\n\s*speaker\s*=|\n\s*\[通话\]|\n\s*\[\/VV_CALL_SYNC\]|$)/i);

            if (contentM) {
              var speaker = speakerM ? speakerM[1].trim() : result.target || callTargetName;
              var content = String(contentM[1] || '').trim();

              if (content) {
                result.messages.push({
                  speaker: speaker,
                  content: content
                });
              }
            }
          });
        }

        return result;
      }

      var lines = raw.split('\n').filter(function (l) {
        return l.trim();
      });

      lines.forEach(function (line) {
        var colonMatch = line.trim().match(/^(.{1,20})[：:]\s*(.+)$/);

        if (colonMatch) {
          var speaker = colonMatch[1].trim();
          var text = colonMatch[2].trim();

          if (speaker && text && speaker !== '用户' && speaker !== '我' && speaker !== '你') {
            result.messages.push({
              speaker: speaker,
              content: text
            });
          }
        }
      });

      if (result.messages.length > 0) result.callPhase = 'reply';

      return result;
    }

    return {
      start: startCallIntercept,
      end: endCallIntercept,
      addUserLines: addUserCallLines,
      isActive: function () {
        return isCallActive;
      },
      getTranscript: function () {
        return callTranscriptLines.slice();
      },
      getHostIndex: function () {
        return hostMessageIndex;
      },
      parseResponse: parseCallResponse
    };
  })();

  console.log('[VVHOST_CHAT] VV_CALL_INTERCEPTOR loaded');

  var VV_FEED_INTERCEPTOR = (function () {
    var isActive = false;
    var hostMessageIndex = -1;
    var eventHandler = null;
    var processedMessageIds = {};

    function findHostMessageIndex() {
      return findHostMessageIndexByMarkers();
    }

    function start(options) {
      if (isActive) {
        console.warn('[FEED_INTERCEPT] already active');
        return false;
      }

      var ctx = getCtx();

      if (!ctx) {
        console.error('[FEED_INTERCEPT] cannot get ST context');
        return false;
      }

      processedMessageIds = {};
      hostMessageIndex = findHostMessageIndex();

      if (hostMessageIndex < 0) {
        console.error('[FEED_INTERCEPT] no host msg floor found');
        return false;
      }

      console.log('[FEED_INTERCEPT] started, host index:', hostMessageIndex);

      eventHandler = function (messageIndex) {
        handleInterceptedMessage(messageIndex);
      };

      try {
        ctx.eventSource.on(ctx.eventTypes.MESSAGE_RECEIVED, eventHandler);
      } catch (e) {
        console.error('[FEED_INTERCEPT] bind event failed:', e);
        return false;
      }

      isActive = true;
      return true;
    }

    function stop() {
      if (!isActive) return;

      var ctx = getCtx();

      if (ctx && eventHandler) {
        try {
          ctx.eventSource.removeListener(ctx.eventTypes.MESSAGE_RECEIVED, eventHandler);
        } catch (e) {
          try {
            ctx.eventSource.off(ctx.eventTypes.MESSAGE_RECEIVED, eventHandler);
          } catch (e2) {}
        }
      }

      eventHandler = null;
      isActive = false;
      processedMessageIds = {};

      console.log('[FEED_INTERCEPT] stopped');
    }

    async function handleInterceptedMessage(messageIndex) {
      var ctx = getCtx();

      if (!ctx || !isActive) return;

      var msg = ctx.chat[messageIndex];

      if (!msg || msg.is_user) return;

      if (messageIndex === hostMessageIndex) {
        console.log('[FEED_INTERCEPT] skipping host msg floor');
        return;
      }

      var msgKey = messageIndex + '_' + String(msg.mes || '').length;

      if (processedMessageIds[msgKey]) {
        console.log('[FEED_INTERCEPT] already processed:', msgKey);
        return;
      }

      processedMessageIds[msgKey] = true;

      var rawContent = String(msg.mes || '');
      console.log('[FEED_INTERCEPT] intercepted AI reply, index:', messageIndex);

      stop();

      if (!rawContent.includes('[VV_FEED_SYNC]')) {
        console.warn('[FEED_INTERCEPT] no VV_FEED_SYNC in reply, skipping');
        return;
      }

      //postFeedSyncToPhone(rawContent, '');

      try {
        var hostMsg = ctx.chat[hostMessageIndex];

        if (!hostMsg) {
          console.warn('[FEED_INTERCEPT] host message not found, index:', hostMessageIndex);
          await safeDeleteFeedFloor(messageIndex);
          return;
        }

        var currentMes = String(hostMsg.mes || '');

        var postBlockMatch = rawContent.match(/\[动态\][\s\S]*?\[\/动态\]/);
        var rawInteractionBlocks = rawContent.match(/\[互动\][\s\S]*?\[\/互动\]/g) || [];
        var interactionBlocks = dedupeInteractionBlocksForAppend(currentMes, rawInteractionBlocks);

        var postIdMatch =
          rawContent.match(/(?:^|\n)\s*postId\s*=\s*([^\n\r]+)/i) ||
          rawContent.match(/postId\s*=\s*([^\s\n\r]+)/i);

        var targetPostId = postIdMatch ? String(postIdMatch[1] || '').trim() : '';

        if (!postBlockMatch && interactionBlocks.length === 0) {
          console.log('[FEED_INTERCEPT] no new [动态] or [互动] blocks after dedupe');
          await safeDeleteFeedFloor(messageIndex);
          return;
        }

        var changed = false;

        if (targetPostId && currentMes.includes('postId=' + targetPostId)) {
          var parts = currentMes.split('[/VV_FEED_HIDDEN_DATA]');
          var inserted = false;

          for (var p = 0; p < parts.length - 1; p++) {
            if (parts[p].includes('postId=' + targetPostId) && !inserted) {
              var appendText = '';

              if (postBlockMatch) {
                var alreadyHasPost =
                  parts[p].includes('postId=' + targetPostId) &&
                  parts[p].includes('[动态]');

                if (!alreadyHasPost) {
                  appendText += '\n' + postBlockMatch[0] + '\n';
                } else {
                  console.log('[VVHOST_FEED_DEDUPE] skip duplicated [动态] for postId:', targetPostId);
                }
              }

              if (interactionBlocks.length > 0) {
                appendText += '\n' + interactionBlocks.join('\n') + '\n';
              }

              if (appendText.trim()) {
                parts[p] = parts[p] + appendText;
                inserted = true;
                changed = true;
              }
            }
          }

          currentMes = parts.join('[/VV_FEED_HIDDEN_DATA]');
        } else {
          var fallbackAppendText = '';

          if (postBlockMatch) {
            var rawPostIdMatch = postBlockMatch[0].match(/postId\s*=\s*([^\n\r]+)/i);
            var rawPostId = rawPostIdMatch ? String(rawPostIdMatch[1] || '').trim() : '';
            var alreadyHasRawPost = rawPostId && currentMes.includes('postId=' + rawPostId);

            if (!alreadyHasRawPost) {
              fallbackAppendText += '\n' + postBlockMatch[0] + '\n';
            } else {
              console.log('[VVHOST_FEED_DEDUPE] skip duplicated fallback [动态] for postId:', rawPostId);
            }
          }

          if (interactionBlocks.length > 0) {
            fallbackAppendText += '\n' + interactionBlocks.join('\n') + '\n';
          }

          if (fallbackAppendText.trim()) {
            if (currentMes.includes('[/VV_FEED_HIDDEN_DATA]')) {
              currentMes = currentMes.replace(
                /\[\/VV_FEED_HIDDEN_DATA\](?![\s\S]*\[\/VV_FEED_HIDDEN_DATA\])/,
                fallbackAppendText + '\n[/VV_FEED_HIDDEN_DATA]'
              );
            } else {
              var fallbackPostId = targetPostId || ('feed_' + Date.now());

              currentMes =
                currentMes.trimEnd() +
                '\n<div class="vv-feed-hidden" style="display:none">[VV_FEED_HIDDEN_DATA]\n' +
                'postId=' + fallbackPostId + '\n' +
                fallbackAppendText +
                '\n[/VV_FEED_HIDDEN_DATA]</div>';
            }

            changed = true;
          }
        }

        if (changed) {
          hostMsg.mes = currentMes;

          var saveCtx = getCtx();

          if (saveCtx && typeof saveCtx.saveChat === 'function') {
            try {
              saveCtx.saveChat();
            } catch (e) {}
          }

          console.log('[FEED_INTERCEPT] appended feed sync for postId:', targetPostId);

          pushFeedHiddenRawToPhone(currentMes, 'feed-intercept-append');
        } else {
          console.log('[FEED_INTERCEPT] no hidden data changed, skip save/post');
        }
      } catch (e) {
        console.error('[FEED_INTERCEPT] append to host failed:', e);
      }

      await safeDeleteFeedFloor(messageIndex);
    }

    async function safeDeleteFeedFloor(aiMessageIndex) {
      var ctx = getCtx();

      if (!ctx || !Array.isArray(ctx.chat)) return;

      var root = getRoot();
      var toDelete = [];

      for (var i = ctx.chat.length - 1; i >= 0; i--) {
        var m = ctx.chat[i];

        if (!m) continue;
        if (i === hostMessageIndex) continue;

        if (!m.is_user) {
          var text = String(m.mes || m.message || '');

          if (text.includes('[VV_FEED_SYNC]') || text.includes('[/VV_FEED_SYNC]')) {
            toDelete.push(i);
            continue;
          }
        }

        if (m.is_user) {
          var userText = String(m.mes || m.message || '');

          if (
            userText.includes('朋友圈动态发布') ||
            userText.includes('VV_FEED_SYNC') ||
            userText.includes('vv_feed')
          ) {
            toDelete.push(i);
            continue;
          }
        }

        if (ctx.chat.length - 1 - i > 10) break;
      }

      console.log('[FEED_INTERCEPT] floors to delete:', toDelete);

      toDelete.sort(function (a, b) {
        return b - a;
      });

      for (var j = 0; j < toDelete.length; j++) {
        var delIndex = toDelete[j];

        try {
          var domEl = root.document.querySelector('[mesid="' + delIndex + '"]');

          if (domEl) {
            domEl.style.display = 'none';
            domEl.remove();
          }

          if (ctx.chat[delIndex]) {
            ctx.chat.splice(delIndex, 1);
          }

          console.log('[FEED_INTERCEPT] deleted floor:', delIndex);
        } catch (e) {
          console.error('[FEED_INTERCEPT] delete error:', e);
        }
      }

      try {
        var allMes = root.document.querySelectorAll('#chat .mes');

        allMes.forEach(function (el, idx) {
          el.setAttribute('mesid', idx);
        });
      } catch (e) {
        console.warn('[FEED_INTERCEPT] re-index mesid failed:', e);
      }

      if (typeof ctx.saveChat === 'function') {
        try {
          ctx.saveChat();
        } catch (e) {}
      }

      console.log('[FEED_INTERCEPT] deletion done');
    }

    return {
      start: start,
      stop: stop,
      isActive: function () {
        return isActive;
      }
    };
  })();

  async function safeDeleteDiaryFloors(aiMessageIndex) {
    var ctx = getCtx();

    if (!ctx || !Array.isArray(ctx.chat)) return;

    var root = getRoot();

    console.log('[DIARY_INTERCEPT] start deleting floors, aiIndex:', aiMessageIndex, 'total:', ctx.chat.length);

    var toDelete = [];

    for (var i = ctx.chat.length - 1; i >= 0; i--) {
      var m = ctx.chat[i];

      if (!m) continue;

      var text = String(m.mes || m.message || '');

      if (!m.is_user) {
        if (
          text.includes('[VV_DIARY_SYNC]') ||
          text.includes('[/VV_DIARY_SYNC]')
        ) {
          toDelete.push(i);
          continue;
        }
      }

      if (m.is_user) {
        if (
          text.includes('VV_DIARY_SYNC') ||
          text.includes('diaryId=') ||
          text.includes('authorId=') ||
          text.includes('写一篇日记') ||
          text.includes('写日记')
        ) {
          toDelete.push(i);
          continue;
        }
      }

      if (ctx.chat.length - 1 - i > 10) break;
    }

    console.log('[DIARY_INTERCEPT] floors to delete:', toDelete);

    if (!toDelete.length) return;

    toDelete.sort(function (a, b) {
      return b - a;
    });

    for (var j = 0; j < toDelete.length; j++) {
      var delIndex = toDelete[j];

      try {
        var domEl = root.document.querySelector('[mesid="' + delIndex + '"]');

        if (domEl) {
          domEl.style.display = 'none';
          domEl.remove();
          console.log('[DIARY_INTERCEPT] DOM removed, mesid:', delIndex);
        }

        if (ctx.chat[delIndex]) {
          ctx.chat.splice(delIndex, 1);
          console.log('[DIARY_INTERCEPT] chat array removed index:', delIndex);
        }
      } catch (e) {
        console.error('[DIARY_INTERCEPT] delete floor error:', e);
      }
    }

    try {
      var allMes = root.document.querySelectorAll('#chat .mes');

      allMes.forEach(function (el, idx) {
        el.setAttribute('mesid', idx);
      });
    } catch (e) {
      console.warn('[DIARY_INTERCEPT] re-index mesid failed:', e);
    }

    if (typeof ctx.saveChat === 'function') {
      try {
        ctx.saveChat();
      } catch (e) {}
    }

    console.log('[DIARY_INTERCEPT] deletion done, remaining floors:', ctx.chat.length);
  }

  async function appendAnnotationReplyToHostMessage(annotationSyncBlock) {
    const ctx = getCtx();

    if (!ctx || !Array.isArray(ctx.chat)) return;

    try {
      let hostIdx = findHostMessageIndexByMarkers();

      if (hostIdx < 0) {
        console.warn('[ANNOTATION] no host floor found');
        return;
      }

      let currentMes = String(ctx.chat[hostIdx].mes || '');

      const diaryId =
        (annotationSyncBlock.match(/diaryId\s*[=:]\s*([^\s\n]+)/i) || [])[1] || '';
      const annotationId =
        (annotationSyncBlock.match(/annotationId\s*[=:]\s*([^\s\n]+)/i) || [])[1] || '';

      if (!diaryId || !annotationId) {
        console.warn('[ANNOTATION] missing id');
        return;
      }

      const hiddenBlock =
        '\n<div class="vv-annotation-hidden" style="display:none">\n' +
        annotationSyncBlock.trim() +
        '\n</div>\n';

      currentMes = currentMes.trimEnd() + '\n' + hiddenBlock;
      ctx.chat[hostIdx].mes = currentMes;

      const deleteIndexes = [];

      for (let i = ctx.chat.length - 1; i > hostIdx; i--) {
        const text = String(ctx.chat[i].mes || '');
        const isAnnotationUserFloor =
          text.includes('type=annotation') || text.includes('annotationId=');
        const isAiAnnotationFloor = text.includes('[VV_ANNOTATION_SYNC]');

        if (isAnnotationUserFloor || isAiAnnotationFloor) {
          deleteIndexes.push(i);
        }
      }

      deleteIndexes
        .sort(function (a, b) {
          return b - a;
        })
        .forEach(function (idx) {
          ctx.chat.splice(idx, 1);

          try {
            const pdoc = getRoot().document;
            const el = pdoc.querySelector('#chat .mes[mesid="' + idx + '"]');

            if (el) el.remove();
          } catch (e) {}
        });

      try {
        ctx.saveChat();
      } catch (e) {}

      console.log('[ANNOTATION] reply appended + floors cleaned for', annotationId);

      postToPhone({
        type: 'VV_ANNOTATION_HIDDEN_RAW',
        raw: currentMes,
        diaryId: diaryId,
        annotationId: annotationId
      });
    } catch (e) {
      console.error('[ANNOTATION] append failed:', e);
    }
  }

  function pollForAssistantReply(chatId, viewId, timeout, mode) {
    mode = mode || '';

    if (VV_CALL_INTERCEPTOR.isActive()) {
      console.log('[VVHOST_CHAT] call interceptor active, skip polling');
      return;
    }

    timeout = timeout || 120000;

    const started = Date.now();
    const chatArr = getSTChat();
    const beforeLength = chatArr ? chatArr.length : 0;

    console.log(
      '[VVHOST_CHAT] pollForAssistantReply start',
      'chatId=', chatId,
      'beforeLength=', beforeLength,
      'mode=', mode
    );

    if (!chatArr) {
      console.warn('[VVHOST_CHAT] poll: chat not accessible, abort');
      return;
    }

    const timer = setInterval(function () {
      if (VV_CALL_INTERCEPTOR.isActive()) {
        console.log('[VVHOST_CHAT] poll: call started, stop polling');
        clearInterval(timer);
        return;
      }

      try {
        const chat = getSTChat();

        if (!chat) {
          console.warn('[VVHOST_CHAT] poll: chat lost');
          clearInterval(timer);
          return;
        }

        const scanStart = Math.max(0, beforeLength - 1);

        for (let i = chat.length - 1; i >= scanStart; i--) {
          const msg = chat[i];

          if (!msg) continue;
          if (msg.is_user) continue;

          const text = String(msg.mes || msg.message || '');

          if (text.includes('[VV_CHAT_SYNC]')) {
            console.log(
              '[VVHOST_CHAT] poll: found VV_CHAT_SYNC tag at index=',
              i,
              'has_close_tag=',
              text.includes('[/VV_CHAT_SYNC]'),
              'length=',
              text.length
            );
          }

          if (text.includes('[VV_DIARY_SYNC]')) {
            console.log(
              '[VVHOST_CHAT] poll: found VV_DIARY_SYNC tag at index=',
              i,
              'has_close_tag=',
              text.includes('[/VV_DIARY_SYNC]'),
              'length=',
              text.length
            );
          }

          const annotationBlock = extractValidVVAnnotationSyncBlock(text);

          if (annotationBlock) {
            clearInterval(timer);

            console.log('[VVHOST_CHAT] poll FOUND annotation sync at index=', i);

            const dIdMatch = annotationBlock.match(/diaryId\s*[=:]\s*([^\s\n]+)/i);
            const aIdMatch = annotationBlock.match(/annotationId\s*[=:]\s*([^\s\n]+)/i);

            const realDiaryId = dIdMatch ? dIdMatch[1].trim() : '';
            const realAnnotationId = aIdMatch ? aIdMatch[1].trim() : '';

            postAnnotationSyncToPhone(annotationBlock, realDiaryId, realAnnotationId, viewId);
            appendAnnotationReplyToHostMessage(annotationBlock);

            return;
          }

          const diaryBlock = extractValidVVDiarySyncBlock(
            text,
            lastExpectedDiaryId || '',
            lastExpectedDiaryAuthorId || ''
          );

          if (diaryBlock) {
            clearInterval(timer);

            console.log('[VVHOST_CHAT] poll FOUND diary sync in index=', i);

            postDiarySyncToPhone(
              diaryBlock,
              lastExpectedDiaryId || '',
              lastExpectedDiaryAuthorId || '',
              viewId
            );

            safeDeleteDiaryFloors(i);

            return;
          }

          if (mode === 'diary') {
            if (
              text.includes('[VV_CALL_SYNC]') ||
              text.includes('[VV_CHAT_SYNC]') ||
              text.includes('[VV_FEED_SYNC]')
            ) {
              console.warn('[VVHOST_CHAT][DIARY] non-diary sync ignored in diary mode, index=', i);
            }

            continue;
          }

          const incomingBlock = extractIncomingCallBlock(text);

          if (incomingBlock) {
            console.log('[VVHOST_CHAT] poll FOUND incoming call in index=', i);
            postIncomingCallToPhone(incomingBlock, viewId);
          }

          const callBlock = extractValidVVCallSyncBlock(text);

          if (callBlock) {
            console.log('[VVHOST_CHAT] poll FOUND call sync in index=', i);
            postCallSyncToPhone(callBlock, chatId, viewId);

            if (!text.includes('[VV_CHAT_SYNC]')) {
              clearInterval(timer);
              return;
            }
          }

          const block = extractValidVVChatSyncBlock(text, chatId);

          if (block) {
            clearInterval(timer);

            var m = block.match(/chatId=([^\s\n]+)/);
            var realChatId = (m ? m[1].trim() : null) || chatId || CURRENT_CHAT_ID;

            console.log('[VVHOST_CHAT] poll FOUND chat sync in index=', i, 'realChatId=', realChatId);

            postChatSyncToPhone(block, realChatId, viewId, i);

            return;
          }

          const feedBlock = extractValidVVFeedSyncBlock(text);

          if (feedBlock) {
            clearInterval(timer);

            console.log('[VVHOST_CHAT] poll FOUND feed sync in index=', i);

            postFeedSyncToPhone(feedBlock, viewId);

            return;
          }
        }

        console.log(
          '[VVHOST_CHAT] poll: no sync yet',
          'total=', chat.length,
          'new=', chat.length - beforeLength,
          'scanStart=', scanStart,
          'elapsed=', Date.now() - started
        );
      } catch (err) {
        console.error('[VVHOST_CHAT] poll error:', err);
      }

      if (Date.now() - started > timeout) {
        clearInterval(timer);
        console.warn('[VVHOST_CHAT] poll timeout after', timeout, 'ms');
      }
    }, 1500);
  }

  async function runTriggerSlash(command) {
    const root = getRoot();

    if (!root || !root.document) {
      throw new Error('parent/top document unavailable');
    }

    try {
      const ctx = root && root.SillyTavern && root.SillyTavern.getContext
        ? root.SillyTavern.getContext()
        : null;

      if (ctx && typeof ctx.executeSlashCommands === 'function') {
        await ctx.executeSlashCommands(command);
        return true;
      }
    } catch (e) {
      console.warn('[VVHOST_CHAT] executeSlashCommands failed, fallback to input:', e);
    }

    try {
      if (typeof root.triggerSlash === 'function') {
        await root.triggerSlash(command);
        return true;
      }
    } catch (e) {
      console.warn('[VVHOST_CHAT] triggerSlash failed, fallback to input:', e);
    }

    const doc = root.document;

    const inputSelectors = [
      'textarea',
      '#send_textarea',
      '#sendTextarea',
      '.send_textarea',
      '.chat-input textarea',
      '.st-chat-input textarea',
      '[data-testid="chat-input"] textarea',
      '[contenteditable="true"]'
    ];

    const buttonSelectors = [
      '#send_but',
      '#send-button',
      '.send-button',
      '.st-send-button',
      'button[type="submit"]',
      'button[title*="Send"]',
      'button[aria-label*="Send"]'
    ];

    function isVisible(el) {
      if (!el) return false;

      const style = root.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      return (
        style &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        rect.width > 0 &&
        rect.height > 0
      );
    }

    function findFirstVisible(selectors) {
      for (const selector of selectors) {
        const list = Array.from(doc.querySelectorAll(selector));
        const hit = list.find(isVisible);

        if (hit) return hit;
      }

      return null;
    }

    function setNativeValue(el, value) {
      const proto =
        el.tagName === 'TEXTAREA' || el.tagName === 'INPUT'
          ? root.HTMLTextAreaElement && root.HTMLTextAreaElement.prototype
            ? root.HTMLTextAreaElement.prototype
            : HTMLTextAreaElement.prototype
          : root.HTMLElement && root.HTMLElement.prototype
            ? root.HTMLElement.prototype
            : HTMLElement.prototype;

      const valueSetter =
        Object.getOwnPropertyDescriptor(proto, 'value') &&
        Object.getOwnPropertyDescriptor(proto, 'value').set;

      const protoSetter =
        Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el) || {}, 'value') &&
        Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el) || {}, 'value').set;

      if (el.isContentEditable) {
        el.focus();
        el.textContent = value;
      } else if (valueSetter) {
        valueSetter.call(el, value);
      } else if (protoSetter) {
        protoSetter.call(el, value);
      } else {
        el.value = value;
      }
    }

    const inputEl = findFirstVisible(inputSelectors);

    if (!inputEl) {
      throw new Error('chat input not found');
    }

    inputEl.focus();

    if (inputEl.isContentEditable) {
      inputEl.textContent = command;
    } else {
      setNativeValue(inputEl, command);
    }

    inputEl.dispatchEvent(new root.Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new root.Event('change', { bubbles: true }));

    await new Promise(function (resolve) {
      setTimeout(resolve, 80);
    });

    let sent = false;

    const sendBtn = findFirstVisible(buttonSelectors);

    if (sendBtn) {
      sendBtn.click();
      sent = true;
    }

    if (!sent) {
      inputEl.dispatchEvent(new root.KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13
      }));

      inputEl.dispatchEvent(new root.KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13
      }));

      sent = true;
    }

    await new Promise(function (resolve) {
      setTimeout(resolve, 120);
    });

    return !!sent;
  }

  async function triggerGenerationAfterSend() {
    const root = getRoot();

    if (!root) return false;

    try {
      if (typeof root.Generate === 'function') {
        console.log('[VVHOST_CHAT][GEN] using root.Generate()');
        await root.Generate();
        return true;
      }
    } catch (e) {
      console.warn('[VVHOST_CHAT][GEN] root.Generate failed:', e);
    }

    try {
      if (typeof root.generate === 'function') {
        console.log('[VVHOST_CHAT][GEN] using root.generate()');
        await root.generate();
        return true;
      }
    } catch (e) {
      console.warn('[VVHOST_CHAT][GEN] root.generate failed:', e);
    }

    try {
      const doc = root.document;

      const selectors = [
        '#send_but',
        '#send-button',
        '.send-button',
        '.st-send-button',
        'button[title*="Send"]',
        'button[aria-label*="Send"]',
        '#option_regenerate',
        '#option_continue'
      ];

      for (const selector of selectors) {
        const btn = doc.querySelector(selector);

        if (!btn) continue;

        const style = root.getComputedStyle(btn);
        const rect = btn.getBoundingClientRect();

        if (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          rect.width > 0 &&
          rect.height > 0
        ) {
          console.log('[VVHOST_CHAT][GEN] clicking button:', selector);
          btn.click();
          return true;
        }
      }
    } catch (e) {
      console.warn('[VVHOST_CHAT][GEN] button trigger failed:', e);
    }

    console.warn('[VVHOST_CHAT][GEN] no generation trigger available');
    return false;
  }

  var VV_RP_COMMAND = (function () {
    function parseMessageCommand(text) {
      if (!text) return null;

      var match = text.match(/给(.+?)发消息\s*[：:]\s*(.+)/);

      if (!match) return null;

      var targetName = match[1].trim();
      var msgPart = match[2];
      var messages = [];

      var quoteRegex = /[""「]([^""」]+)[""」]/g;
      var m;

      while ((m = quoteRegex.exec(msgPart)) !== null) {
        if (m[1].trim()) messages.push(m[1].trim());
      }

      if (messages.length === 0) {
        var plain = msgPart.replace(/[""「」""]/g, '').trim();

        if (plain) messages.push(plain);
      }

      if (messages.length === 0) return null;

      return {
        type: 'sendMessage',
        targetName: targetName,
        messages: messages
      };
    }

    function parseCallCommand(text) {
      if (!text) return null;

      var match = text.match(/给(.+?)打电话/);

      if (!match) return null;

      return {
        type: 'makeCall',
        targetName: match[1].trim()
      };
    }

    function parse(text) {
      if (!text) return null;

      var msgCmd = parseMessageCommand(text);

      if (msgCmd) return msgCmd;

      var callCmd = parseCallCommand(text);

      if (callCmd) return callCmd;

      return null;
    }

    return {
      parse: parse,
      parseMessageCommand: parseMessageCommand,
      parseCallCommand: parseCallCommand
    };
  })();

  console.log('[VVHOST_CHAT] VV_RP_COMMAND loaded');

  function extractAiFeedPostBlock(text) {
    var match = String(text || '').match(/\[VV_AI_FEED_POST\]([\s\S]*?)\[\/VV_AI_FEED_POST\]/i);

    if (!match) return null;

    var block = match[1];

    function getField(key) {
      var m = block.match(new RegExp(key + '\\s*=\\s*([^\\n]+)', 'i'));
      return m ? m[1].trim() : '';
    }

    var from = getField('from');
    var bridgeName = getField('bridgeName') || from;
    var postId = getField('postId') || ('f' + Date.now());
    var time = getField('time');
    var content = getField('content');
    var photoRaw = getField('photo');

    if (!from || !content) return null;

    var photos = [];

    if (photoRaw) {
      var photoMatches = Array.from(photoRaw.matchAll(/\[图\d+:(.*?)\]/g));

      photos = photoMatches.map(function (m) {
        return {
          simulated: true,
          desc: m[1].trim()
        };
      });
    }

    return {
      from: from,
      bridgeName: bridgeName,
      postId: postId,
      time: time,
      content: content,
      photos: photos
    };
  }

  (function initUserInputPoller() {
    var lastCheckedIndex = -1;
    var pollInterval = 1000;

    function checkForNewUserMessage() {
      try {
        var chat = getSTChat();

        if (!chat || chat.length === 0) {
          lastCheckedIndex = -1;
          return;
        }

        if (lastCheckedIndex === -1) {
          lastCheckedIndex = chat.length - 1;
          console.log('[VVHOST_CHAT][RP_POLL] initialized, lastCheckedIndex=', lastCheckedIndex);
          return;
        }

        if (chat.length - 1 <= lastCheckedIndex) return;

        for (var i = lastCheckedIndex + 1; i < chat.length; i++) {
          var msg = chat[i];

          if (!msg) continue;

          var text = String(msg.mes || '');

          if (msg.is_user) {
            console.log('[VVHOST_CHAT][RP_POLL] new user msg at index', i, ':', JSON.stringify(text.slice(0, 200)));

            var command = VV_RP_COMMAND.parse(text);

            if (!command) {
              console.log('[VVHOST_CHAT][RP_POLL] no command detected');
              continue;
            }

            console.log('[VVHOST_CHAT][RP_CMD] command detected:', command);

            if (command.type === 'sendMessage') {
              postToPhone({
                type: 'VV_RP_SEND_MESSAGE',
                targetName: command.targetName,
                messages: command.messages
              });

              console.log('[VVHOST_CHAT][RP_CMD] sent VV_RP_SEND_MESSAGE to phone');
            } else if (command.type === 'makeCall') {
              postToPhone({
                type: 'VV_RP_MAKE_CALL',
                targetName: command.targetName
              });

              console.log('[VVHOST_CHAT][RP_CMD] sent VV_RP_MAKE_CALL to phone');
            }

            continue;
          }

          if (!msg.is_user && text.includes('[VV_AI_FEED_POST]') && text.includes('[/VV_AI_FEED_POST]')) {
            console.log('[VVHOST_CHAT][AI_FEED] detected VV_AI_FEED_POST in AI msg at index', i);

            var aiPostBlock = extractAiFeedPostBlock(text);

            if (aiPostBlock) {
              postToPhone({
                type: 'VV_AI_FEED_POST',
                payload: aiPostBlock
              });

              console.log('[VVHOST_CHAT][AI_FEED] sent VV_AI_FEED_POST to phone:', aiPostBlock);
            }
          }
        }

        lastCheckedIndex = chat.length - 1;
      } catch (err) {
        console.error('[VVHOST_CHAT][RP_POLL] error:', err);
      }
    }

    setInterval(checkForNewUserMessage, pollInterval);

    console.log('[VVHOST_CHAT] user input POLLER registered (interval=' + pollInterval + 'ms)');
  })();

  window.addEventListener('message', async function (event) {
    const data = event.data || {};

    if (!data || !data.type) return;

    console.log('[VVHOST_CHAT] got message:', data.type, 'keys:', Object.keys(data));

    try {
      if (data.type === 'VVPHONE_READY') {
        console.log('[VVHOST_CHAT] phone ready, scanning current floor for sync block...');

        try {
          var chat = getSTChat();

          if (chat && chat.length > 0) {
            for (var i = chat.length - 1; i >= 0; i--) {
              var msg = chat[i];

              if (!msg || msg.is_user) continue;

              var text = String(msg.mes || msg.message || '');
              var syncBlock = extractValidVVChatSyncBlock(text, null);

              if (syncBlock) {
                var blockChatIdMatch = syncBlock.match(/chatId=([^\s\n]+)/);
                var blockChatId = blockChatIdMatch ? blockChatIdMatch[1].trim() : CURRENT_CHAT_ID;

                console.log('[VVHOST_CHAT] INIT: found sync block at index=', i, 'blockChatId=', blockChatId);

                postChatSyncToPhone(syncBlock, blockChatId, lastViewId || '', i);

                break;
              }

              if (chat.length - 1 - i >= 3) break;
            }
          }
        } catch (err) {
          console.warn('[VVHOST_CHAT] INIT scan error:', err);
        }

        return;
      }

      if (data.type === 'VV_CALL_START') {
        console.log('[VVHOST_CHAT] received call start request:', data);

        var started = VV_CALL_INTERCEPTOR.start({
          targetName: data.targetName || data.target || CURRENT_TARGET || '对方',
          chatId: data.chatId || lastExpectedChatId || CURRENT_CHAT_ID || '',
          storyTime: data.storyTime || '',
          onMessage: function (parsed) {
            console.log('[VVHOST_CHAT] call AI reply intercepted:', parsed);

            postToPhone({
              type: 'VV_CALL_AI_REPLY',
              callPhase: parsed.callPhase,
              messages: parsed.messages,
              target: parsed.target,
              chatId: parsed.chatId,
              raw: parsed.raw
            });
          }
        });

        console.log('[VVHOST_CHAT] interceptor start result:', started);

        return;
      }

      if (data.type === 'VV_CALL_USER_SPEAK') {
        console.log('[VVHOST_CHAT] received user call speech');

        if (VV_CALL_INTERCEPTOR.isActive()) {
          VV_CALL_INTERCEPTOR.addUserLines(data.lines || [data.text || '']);
        }

        return;
      }

      if (data.type === 'VV_CALL_END') {
        console.log('[VVHOST_CHAT] received call end request');

        VV_CALL_INTERCEPTOR.end();

        return;
      }

      if (data.type === 'VV_EXECUTE_SLASH') {
        const requestId = data.requestId || null;
        const command = String(data.command || '');
        const viewId = String(data.viewId || '').trim();

        const feedMode = !!data.feedMode;
        const callMode = !!data.callMode;
        const annotationMode = !!data.annotationMode;

        const feedMeta = data.feedMeta || null;
        const userInteraction = data.userInteraction || null;

        const diaryMode = isDiaryCommand(command);
        const commandHasTrigger = /\/trigger\b/.test(command);

        const chatId =
          String(data.chatId || '').trim() ||
          extractChatIdFromCommand(command) ||
          lastExpectedChatId ||
          CURRENT_CHAT_ID ||
          '';

        lastExpectedChatId = chatId || lastExpectedChatId || '';
        lastViewId = viewId || lastViewId || '';

        if (diaryMode) {
          lastExpectedDiaryId = extractDiaryIdFromCommand(command);
          lastExpectedDiaryAuthorId = extractDiaryAuthorIdFromCommand(command);

          console.log('[VVHOST_CHAT][DIARY] diaryMode detected', {
            diaryId: lastExpectedDiaryId,
            authorId: lastExpectedDiaryAuthorId
          });
        }

        if (feedMode) {
          try {
            var ctx = getCtx();

            if (!ctx || !Array.isArray(ctx.chat)) throw new Error('ctx/chat not available');

            var chatArr = ctx.chat;
            var hostIdx = findHostMessageIndexByMarkers();

            if (hostIdx >= 0 && chatArr[hostIdx]) {
              var currentMes = String(chatArr[hostIdx].mes || '');

              if (feedMeta) {
                var imagesLine = feedMeta.images && feedMeta.images.length ? '\nimages=' + feedMeta.images.join(',') : '';
                var locationLine = feedMeta.location ? '\nlocation=' + feedMeta.location : '';
                var photoLine = feedMeta.photoDesc ? '\nphoto=' + feedMeta.photoDesc : '';

                var postIdTag = 'postId=' + feedMeta.postId;
                var hasExisting = currentMes.includes(postIdTag);

                if (!hasExisting) {
                  var initBlock =
                    '\n<div class="vv-feed-hidden" style="display:none">[VV_FEED_HIDDEN_DATA]\n' +
                    'postId=' + feedMeta.postId +
                    '\n\n[动态]\n' +
                    'from=' + feedMeta.author + '\n' +
                    'time=' + feedMeta.time + '\n' +
                    'content=' + feedMeta.content +
                    imagesLine +
                    photoLine +
                    locationLine +
                    '\n[/动态]\n\n[/VV_FEED_HIDDEN_DATA]</div>';

                  currentMes = currentMes.trimEnd() + initBlock;
                }

                chatArr[hostIdx].mes = currentMes;

                try {
                  ctx.saveChat();
                } catch (e) {}

                console.log('[VVHOST_CHAT] feed initial block written for', feedMeta.postId);
              }

              if (userInteraction) {
                currentMes = String(chatArr[hostIdx].mes || '');

                var replyLine = userInteraction.replyTo ? '\nreplyTo=' + userInteraction.replyTo : '';

                var userBlock =
                  '\n[互动]\n' +
                  'from=' + userInteraction.from + '\n' +
                  'time=' + userInteraction.time + '\n' +
                  'action=' + userInteraction.action + '\n' +
                  'content=' + userInteraction.content +
                  replyLine + '\n' +
                  '[/互动]\n';

                var targetTag = 'postId=' + userInteraction.postId;
                var dedupedUserBlocks = dedupeInteractionBlocksForAppend(currentMes, [userBlock]);

                if (dedupedUserBlocks.length === 0) {
                  console.log('[VVHOST_FEED_DEDUPE] skip duplicated user interaction for', userInteraction.postId);
                } else if (currentMes.includes(targetTag)) {
                  var parts = currentMes.split('[/VV_FEED_HIDDEN_DATA]');
                  var inserted = false;

                  for (var p = 0; p < parts.length - 1; p++) {
                    if (parts[p].includes(targetTag) && !inserted) {
                      parts[p] = parts[p] + dedupedUserBlocks[0];
                      inserted = true;
                    }
                  }

                  currentMes = parts.join('[/VV_FEED_HIDDEN_DATA]');

                  chatArr[hostIdx].mes = currentMes;

                  try {
                    ctx.saveChat();
                  } catch (e) {}

                  console.log('[VVHOST_CHAT] user interaction appended for', userInteraction.postId);
                } else {
                  console.warn('[VVHOST_CHAT] target feed post not found for user interaction:', userInteraction.postId);
                }
              }
            }
          } catch (e) {
            console.warn('[VVHOST_CHAT] feed pre-write error:', e);
          }

          const startedFeed = VV_FEED_INTERCEPTOR.start();
          console.log('[VVHOST_CHAT] feed interceptor started:', startedFeed);
        }

        let ok = false;
        let error = null;

        try {
          await runTriggerSlash(command);
          ok = true;
        } catch (err) {
          error = String((err && err.message) || err || 'execute failed');
        }

        postToPhone({
          type: 'VV_EXECUTE_RESULT',
          requestId: requestId,
          ok: ok,
          error: error,
          chatId: lastExpectedChatId || '',
          diaryId: lastExpectedDiaryId || '',
          authorId: lastExpectedDiaryAuthorId || '',
          viewId: lastViewId || ''
        });

        if (ok) {
          if (feedMode) {
            console.log('[VVHOST_CHAT] feed mode, skip polling');
          } else if (callMode || VV_CALL_INTERCEPTOR.isActive()) {
            console.log('[VVHOST_CHAT] call mode active, skip normal chat polling');
          } else if (diaryMode) {
            console.log('[VVHOST_CHAT][DIARY] diary mode');

            if (!commandHasTrigger) {
              setTimeout(function () {
                triggerGenerationAfterSend();
              }, 800);
            } else {
              console.log('[VVHOST_CHAT][DIARY] command already has /trigger, skip extra generation');
            }

            pollForAssistantReply(lastExpectedChatId, lastViewId, 120000, 'diary');
          } else if (annotationMode) {
            console.log('[VVHOST_CHAT][ANNOTATION] annotation mode');

            if (!commandHasTrigger) {
              setTimeout(function () {
                triggerGenerationAfterSend();
              }, 800);
            } else {
              console.log('[VVHOST_CHAT][ANNOTATION] command already has /trigger, skip extra generation');
            }

            pollForAssistantReply(lastExpectedChatId, lastViewId, 120000, 'annotation');
          } else {
            pollForAssistantReply(lastExpectedChatId, lastViewId);
          }
        } else {
          if (feedMode) VV_FEED_INTERCEPTOR.stop();
        }

        return;
      }

      if (data.type === 'VV_RAW_LLM_REPLY') {
        const rawText = String(data.raw || '');
        const chatIdFromData = String(data.chatId || '').trim();
        const viewId = String(data.viewId || '').trim();
        const expectedChatId = chatIdFromData || lastExpectedChatId || CURRENT_CHAT_ID || '';

        const diaryIdFromData = String(data.diaryId || '').trim();
        const authorIdFromData = String(data.authorId || '').trim();

        const expectedDiaryId = diaryIdFromData || lastExpectedDiaryId || '';
        const expectedDiaryAuthorId = authorIdFromData || lastExpectedDiaryAuthorId || '';

        let handled = false;

        const incomingBlock = extractIncomingCallBlock(rawText);

        if (incomingBlock) {
          postIncomingCallToPhone(incomingBlock, viewId);
          handled = true;
        }

        const callBlock = extractValidVVCallSyncBlock(rawText);

        if (callBlock) {
          postCallSyncToPhone(callBlock, expectedChatId, viewId);
          handled = true;
        }

        const chatBlock = extractValidVVChatSyncBlock(rawText, expectedChatId);

        if (chatBlock) {
          postChatSyncToPhone(chatBlock, expectedChatId, viewId);
          handled = true;
        }

        const diaryBlock = extractValidVVDiarySyncBlock(rawText, expectedDiaryId, expectedDiaryAuthorId);
        if (diaryBlock) {
          postDiarySyncToPhone(diaryBlock, expectedDiaryId, expectedDiaryAuthorId, viewId);
          handled = true;
        }

        const feedBlock = extractValidVVFeedSyncBlock(rawText);
        if (feedBlock) {
          // 这里只作为兜底。正常 feedMode 仍由 VV_FEED_INTERCEPTOR 写入 hidden raw。
          postFeedSyncToPhone(feedBlock, viewId);
          handled = true;
        }

        if (!handled) {
          console.log('[VVHOST][SUMMON] VV_RAW_LLM_REPLY has no valid sync block');
        }
        return;

        const annotationBlock = extractValidVVAnnotationSyncBlock(rawText);

        if (annotationBlock) {
          const dIdMatch = annotationBlock.match(/diaryId\s*[=:]\s*([^\s\n]+)/i);
          const aIdMatch = annotationBlock.match(/annotationId\s*[=:]\s*([^\s\n]+)/i);

          const realDiaryId = dIdMatch ? dIdMatch[1].trim() : '';
          const realAnnotationId = aIdMatch ? aIdMatch[1].trim() : '';

          postAnnotationSyncToPhone(annotationBlock, realDiaryId, realAnnotationId, viewId);
          handled = true;
        }
      }

      if (data.type === 'VV_REQUEST_FEED_REFRESH') {
        var ctxF = getCtx();

        if (!ctxF || !Array.isArray(ctxF.chat)) {
          console.warn('[VVHOST_CHAT] feed refresh: ctx/chat not available');
          return;
        }

        for (var fi = 0; fi < ctxF.chat.length; fi++) {
          if (ctxF.chat[fi].mes && String(ctxF.chat[fi].mes).includes('VV_FEED_HIDDEN_DATA')) {
            pushFeedHiddenRawToPhone(ctxF.chat[fi].mes, 'feed-refresh');
            console.log('[VVHOST_CHAT] feed refresh sent, length:', String(ctxF.chat[fi].mes).length);
            break;
          }
        }

        return;
      }

      if (data.type === 'VVPHONE_RESEND_LAST_CHAT_SYNC') {
        const chatId = String(data.chatId || '').trim();
        const viewId = String(data.viewId || '').trim();

        if (lastVVChatSyncRaw) {
          postChatSyncToPhone(lastVVChatSyncRaw, chatId || lastExpectedChatId || CURRENT_CHAT_ID, viewId || lastViewId || '');
        } else {
          console.log('[VVHOST_CHAT] no cached chat sync for resend');
        }

        return;
      }

      if (data.type === 'VV_RP_CONTEXT' && data.chatId && data.targetName) {
        console.log('[VVHOST_CHAT][RP_CTX] received context:', data.chatId, data.targetName);

        var injectText =
          '/inject role=system [VV_RP_CONTEXT]\n' +
          '你本轮必须严格遵守：\n' +
          'chatId=' + data.chatId + '\n' +
          'target=' + data.targetName + '\n' +
          '在 [VV_CHAT_SYNC] 块中，chatId 和 target 字段必须与上面完全一致，一字不差，禁止使用任何其他值。\n' +
          '[/VV_RP_CONTEXT]';

        try {
          var ctx = getCtx();

          if (ctx && typeof ctx.executeSlashCommandsWithOptions === 'function') {
            ctx.executeSlashCommandsWithOptions(injectText).then(function () {
              console.log('[VVHOST_CHAT][RP_CTX] inject done, starting poll');
              pollForAssistantReply(data.chatId, lastViewId || '', 120000);
            }).catch(function (err) {
              console.error('[VVHOST_CHAT][RP_CTX] inject failed:', err);
              pollForAssistantReply(data.chatId, lastViewId || '', 120000);
            });
          } else if (ctx && typeof ctx.executeSlashCommands === 'function') {
            Promise.resolve(ctx.executeSlashCommands(injectText)).then(function () {
              console.log('[VVHOST_CHAT][RP_CTX] inject done by executeSlashCommands, starting poll');
              pollForAssistantReply(data.chatId, lastViewId || '', 120000);
            }).catch(function (err) {
              console.error('[VVHOST_CHAT][RP_CTX] inject failed by executeSlashCommands:', err);
              pollForAssistantReply(data.chatId, lastViewId || '', 120000);
            });
          } else {
            console.warn('[VVHOST_CHAT][RP_CTX] no slash executor, poll without inject');
            pollForAssistantReply(data.chatId, lastViewId || '', 120000);
          }
        } catch (err) {
          console.error('[VVHOST_CHAT][RP_CTX] error:', err);
          pollForAssistantReply(data.chatId, lastViewId || '', 120000);
        }

        return;
      }
    } catch (err) {
      console.warn('[VVHOST_CHAT] message handler error:', err);
    }
  }, false);

  (function initFeedHiddenDataWatcher() {
    var lastFeedRaw = '';
    var watchInterval = 2000;

    function findFeedHostMessage() {
      var ctx = getCtx();

      if (!ctx || !Array.isArray(ctx.chat)) return null;

      for (var i = 0; i < ctx.chat.length; i++) {
        var mes = String(ctx.chat[i].mes || '');

        if (mes.includes('VV_FEED_HIDDEN_DATA')) {
          return mes;
        }
      }

      return null;
    }

    setInterval(function () {
      try {
        var currentRaw = findFeedHostMessage();

        if (!currentRaw) return;

        var hiddenSig = getFeedHiddenSig(currentRaw);

        if (!hiddenSig) return;

        if (hiddenSig === lastFeedRaw) return;

        // 如果这份 hidden raw 刚刚已经由 feed-interceptor 主动推过，
        // watcher 不要再补发一次，否则手机会收到重复 VV_FEED_HIDDEN_RAW。
        if (
          currentRaw === lastPushedFeedHiddenRaw ||
          hiddenSig === lastPushedFeedHiddenSig
        ) {
          lastFeedRaw = hiddenSig;
          console.log('[VVHOST][FEED_WATCHER] skip duplicated pushed hidden raw');
          return;
        }

        lastFeedRaw = hiddenSig;

        console.log('[VVHOST][FEED_WATCHER] hidden data changed, pushing to phone, length=', currentRaw.length);

        pushFeedHiddenRawToPhone(currentRaw, 'feed-watcher');
      } catch (err) {
        console.warn('[VVHOST][FEED_WATCHER] error:', err);
      }
    }, watchInterval);

    console.log('[VVHOST] feed hidden data watcher started');
  })();
})();