(function () {
  if (window.__VV_HOST_SUMMON_CORE_INSTALLED__) {
    console.log('[VVHOST][SUMMON] core already installed, skip');
    return;
  }
  window.__VV_HOST_SUMMON_CORE_INSTALLED__ = true;

  const config = window.VV_HOST_CONFIG || {};

  const VVHOST_VERSION = config.version || 'SUMMON-CALL-INTERCEPT-001';
  const PHONE_ORIGIN = config.phoneOrigin || 'https://vvvital0312.github.io';
  const PHONE_FRAME_ID = config.phoneFrameId || 'phoneFrame';
  const HOST_TYPE = config.hostType || 'summon';

  const phoneFrame = document.getElementById(PHONE_FRAME_ID);

  let lastExpectedChatId = '';
  let lastVVChatSyncRaw = '';
  let lastViewId = '';
  let lastExpectedDiaryId = '';
  let lastExpectedDiaryAuthorId = '';
  let lastVVDiarySyncRaw = '';
  let lastPushedFeedHiddenRaw = '';
  let lastPushedFeedHiddenSig = '';
  let pendingFeedInteraction = null;
  const processedAiFeedPostIds = {};
  const pendingFeedPostIds = {};

  function getFeedHiddenSig(raw) {
    raw = String(raw || '');

    var hiddenMatch = raw.match(
      /(<div class="vv-feed-hidden"[\s\S]*?<\/div>)/g
    );

    return hiddenMatch ? hiddenMatch.join('') : raw;
  }

  function extractFeedPostIdsFromRaw(raw) {
    raw = String(raw || '');

    var ids = [];
    var blocks = raw.match(/\[VV_FEED_HIDDEN_DATA\][\s\S]*?\[\/VV_FEED_HIDDEN_DATA\]/g) || [];

    blocks.forEach(function (block) {
      var m = block.match(/(?:^|\n)\s*postId\s*=\s*([^\n\r]+)/i);
      var id = m ? String(m[1] || '').trim() : '';

      // 防御旧解析污染：postId 后面如果混进 [动态]，强制截断。
      id = id
        .split(/\s+/)[0]
        .replace(/\[动态\].*$/i, '')
        .trim();

      if (id && ids.indexOf(id) < 0) {
        ids.push(id);
      }
    });

    return ids;
  }

  function rawContainsPendingFeedPost(raw) {
    var ids = extractFeedPostIdsFromRaw(raw);

    for (var i = 0; i < ids.length; i++) {
      if (pendingFeedPostIds[ids[i]]) {
        return true;
      }
    }

    return false;
  }

  function pushFeedHiddenRawToPhone(raw, reason) {
    raw = String(raw || '');
    if (!raw) return false;

    var sig = getFeedHiddenSig(raw);

    lastPushedFeedHiddenRaw = raw;
    lastPushedFeedHiddenSig = sig;

    console.log('[VVHOST][FEED_PUSH] push hidden raw to phone, reason=', reason || '', 'length=', raw.length);

    return postToPhone({
      type: 'VV_FEED_HIDDEN_RAW',
      raw: raw
    });
  }

  console.log('[VVHOST][SUMMON] loaded external core', location.href, 'version:', VVHOST_VERSION);
  console.log('[VVHOST][SUMMON] config:', {
    HOST_TYPE,
    PHONE_ORIGIN,
    PHONE_FRAME_ID,
    hasPhoneFrame: !!phoneFrame
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
        console.warn('[VVHOST][SUMMON] phoneFrame not ready:', PHONE_FRAME_ID);
        return false;
      }

      frame.contentWindow.postMessage(payload, PHONE_ORIGIN);
      console.log('[VVHOST][SUMMON][postToPhone]', payload.type, payload);
      return true;
    } catch (err) {
      console.warn('[VVHOST][SUMMON] postToPhone failed:', err);
      return false;
    }
  }

  function openFeedPageOnPhone(reason) {
    reason = reason || '';

    console.log('[VVHOST][FEED] request phone open feed page, reason=', reason);

    postToPhone({
      type: 'VV_OPEN_FEED',
      reason: reason
    });

    postToPhone({
      type: 'VV_NAVIGATE',
      page: 'feed',
      tab: 'feed',
      reason: reason
    });

    postToPhone({
      type: 'VV_SWITCH_TAB',
      tab: 'feed',
      page: 'feed',
      reason: reason
    });
  }

  function normalizeFeedTextForKey(text) {
    return String(text || '')
      .replace(/\s+/g, ' ')
      .replace(/[，。！？、,.!?；;：:]/g, '')
      .trim();
  }

  function normalizeFeedImageRefs(input) {
    var arr = [];

    if (Array.isArray(input)) {
      arr = input;
    } else if (typeof input === 'string') {
      arr = input.split(',');
    }

    return arr
      .map(function (x) {
        return String(x || '').trim();
      })
      .filter(function (x) {
        return !!x && x !== 'undefined' && x !== 'null';
      });
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
      var ctx = getCtx();
      if (!ctx || !Array.isArray(ctx.chat)) return -1;

      for (var i = ctx.chat.length - 1; i >= 0; i--) {
        var msg = ctx.chat[i];
        if (!msg) continue;

        var text = String(msg.mes || '');

        if (
          text.includes('vv' + '手机') ||
          text.includes('vv' + 'phone') ||
          text.includes('vvvital0312.github.io/' + 'vvphone') ||
          text.includes('phone' + 'Frame') ||
          text.includes('VV' + 'HOST') ||
          text.includes('VV_CALL_HIDDEN' + '_DATA') ||
          text.includes('VV_FEED_HIDDEN_DATA')
        ) {
          console.log('[CALL_INTERCEPT] found host msg, index:', i, 'snippet:', text.substring(0, 80));
          return i;
        }
      }

      for (var j = ctx.chat.length - 1; j >= 0; j--) {
        var m = ctx.chat[j];

        if (m && !m.is_user) {
          console.log('[CALL_INTERCEPT] fallback: using latest AI msg, index:', j);
          return j;
        }
      }

      return -1;
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
        '\n<div class="vv-call-hidden" style="display:none"></div>\n';

      msg.mes = currentMes.trimEnd() + hiddenBlock;

      if (typeof ctx.saveChat === 'function') {
        try {
          ctx.saveChat();
        } catch (e) {}
      }

      console.log('[CALL_INTERCEPT] call data appended to host msg (index:' + hostMessageIndex + ')');
    }

    function buildTranscriptText() {
      var text = 'call target:' + callTargetName + '\n';
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

      callTargetName = options.targetName || 'unknown';
      callChatId = options.chatId || '';
      callStartTime = options.storyTime || '';
      onCallMessageCallback = options.onMessage || null;
      callTranscriptLines = [];
      processedMessageIds = {};

      hostMessageIndex = findHostMessageIndex();
      if (hostMessageIndex < 0) {
        console.error('[CALL_INTERCEPT] no available msg floor found');
        return false;
      }
      console.log('[CALL_INTERCEPT] host msg index:', hostMessageIndex);

      eventHandler = function (messageIndex) {
        handleInterceptedMessage(messageIndex);
      };
      ctx.eventSource.on(ctx.eventTypes.MESSAGE_RECEIVED, eventHandler);
      isCallActive = true;

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
        ctx.eventSource.removeListener(ctx.eventTypes.MESSAGE_RECEIVED, eventHandler);
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
        if (line && line.trim()) {
          callTranscriptLines.push({ side: 'right', speaker: 'user', content: line.trim() });
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
        console.log('[CALL_INTERCEPT] skipping host msg floor');
        return;
      }

      var rawContent = String(msg.mes || '');

      // 电话拦截器只处理电话同步，绝对不要处理 feed/comment/diary/chat。
      if (!rawContent.includes('[VV_CALL_SYNC]') && !rawContent.includes('[/VV_CALL_SYNC]')) {
        console.log('[CALL_INTERCEPT] non-call AI reply ignored');
        return;
      }

      var msgKey = messageIndex + '_' + rawContent.length;
      if (processedMessageIds[msgKey]) {
        console.log('[CALL_INTERCEPT] already processed:', msgKey);
        return;
      }

      processedMessageIds[msgKey] = true;

      console.log('[CALL_INTERCEPT] intercepted call AI reply, index:', messageIndex);

      var parsed = parseCallResponse(rawContent);
      parsed.raw = rawContent;

      if (parsed && parsed.messages && parsed.messages.length) {
        parsed.messages.forEach(function (m) {
          callTranscriptLines.push({
            side: 'left',
            speaker: m.speaker || parsed.target || callTargetName,
            content: m.content || ''
          });
        });

        appendCallDataToHostMessage(buildTranscriptText());
      }

      if (typeof onCallMessageCallback === 'function') {
        try {
          onCallMessageCallback(parsed);
        } catch (e) {
          console.warn('[CALL_INTERCEPT] onMessage callback failed:', e);
        }
      }

      await safeDeleteCallFloors(messageIndex);
    }

    async function safeDeleteCallFloors(aiMessageIndex) {
      var ctx = getCtx();
      if (!ctx) return;
      var root = getRoot();

      console.log('[CALL_INTERCEPT] start deleting floors, aiIndex:', aiMessageIndex, 'total:', ctx.chat.length);

      var toDelete = [];

      for (var i = ctx.chat.length - 1; i >= 0; i--) {
        var m = ctx.chat[i];
        if (!m) continue;

        if (i === hostMessageIndex) continue;

        if (!m.is_user) {
          var mesText = String(m.mes || '');
          if (mesText.includes('[VV_CALL_SYNC]') || mesText.includes('[/VV_CALL_SYNC]')) {
            toDelete.push(i);
            continue;
          }
        }

        if (m.is_user) {
          var userText = String(m.mes || '');
          if (userText.includes('电话模式') || userText.includes('VV_CALL') ||
              userText.includes('VV_EVENT') || userText.includes('通话阶段') ||
              userText.includes('callPhase') || userText.includes('手机电话通话事件')) {
            toDelete.push(i);
            continue;
          }
        }

        if (ctx.chat.length - 1 - i > 8) break;
      }

      console.log('[CALL_INTERCEPT] floors to delete:', toDelete);

      if (toDelete.length === 0) {
        console.warn('[CALL_INTERCEPT] no floors to delete');
        return;
      }

      toDelete.sort(function (a, b) { return b - a; });

      for (var j = 0; j < toDelete.length; j++) {
        var delIndex = toDelete[j];
        try {
          var domEl = root.document.querySelector('[mesid="' + delIndex + '"]');
          if (domEl) {
            domEl.style.display = 'none';
            domEl.remove();
            console.log('[CALL_INTERCEPT] DOM removed, mesid:', delIndex);
          }

          if (ctx.chat[delIndex]) {
            ctx.chat.splice(delIndex, 1);
            console.log('[CALL_INTERCEPT] chat array removed index:', delIndex);
          }
        } catch (e) {
          console.error('[CALL_INTERCEPT] delete floor error:', e);
        }
      }

      try {
        var allMes = root.document.querySelectorAll('#chat .mes');
        allMes.forEach(function (el, idx) {
          el.setAttribute('mesid', idx);
        });
      } catch (e) {
        console.warn('[CALL_INTERCEPT] re-index mesid failed:', e);
      }

      hostMessageIndex = findHostMessageIndex();
      console.log('[CALL_INTERCEPT] re-located host msg floor:', hostMessageIndex);

      if (typeof ctx.saveChat === 'function') {
        try { ctx.saveChat(); } catch (e) {}
      }

      console.log('[CALL_INTERCEPT] deletion done, remaining floors:', ctx.chat.length);
    }

    function parseCallResponse(raw) {
      var result = { callPhase: '', chatId: '', target: '', messages: [] };
      if (!raw) return result;

      var syncMatch = raw.match(/\[VV_CALL_SYNC\]([\s\S]*?)\[\/VV_CALL_SYNC\]/);
      if (syncMatch) {
        var block = syncMatch[1];
        var phaseMatch = block.match(/callPhase\s*=\s*(.+)/i);
        var chatIdMatch = block.match(/chatId\s*=\s*(.+)/i);
        var targetMatch = block.match(/target\s*=\s*(.+)/i);

        result.callPhase = phaseMatch ? phaseMatch[1].trim().toLowerCase() : '';
        result.chatId = chatIdMatch ? chatIdMatch[1].trim() : '';
        result.target = targetMatch ? targetMatch[1].trim() : '';

        var talkMatches = block.match(/\[通话\]([\s\S]*?)(?=\[通话\]|\[\/VV_CALL_SYNC\]|$)/g);
        if (talkMatches) {
          talkMatches.forEach(function (talkBlock) {
            var speakerM = talkBlock.match(/speaker\s*=\s*(.+)/i);
            var contentM = talkBlock.match(/content\s*=\s*([\s\S]*?)(?=speaker\s*=|$)/i);
            if (contentM) {
              var speaker = speakerM ? speakerM[1].trim() : result.target || callTargetName;
              var content = contentM[1].trim();
              if (content) result.messages.push({ speaker: speaker, content: content });
            }
          });
        }
        return result;
      }

      var lines = raw.split('\n').filter(function (l) { return l.trim(); });
      lines.forEach(function (line) {
        var colonMatch = line.trim().match(/^(.{1,20})[：:]\s*(.+)$/);
        if (colonMatch) {
          var speaker = colonMatch[1].trim();
          var text = colonMatch[2].trim();
          if (speaker && text && speaker !== '用户' && speaker !== '我' && speaker !== '你') {
            result.messages.push({ speaker: speaker, content: text });
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
      isActive: function () { return isCallActive; },
      getTranscript: function () { return callTranscriptLines.slice(); },
      getHostIndex: function () { return hostMessageIndex; },
      parseResponse: parseCallResponse
    };
  })();

  function convertWrongAiFeedPostToInteractionRaw(rawContent) {
    rawContent = String(rawContent || '');

    if (!pendingFeedInteraction) return rawContent;
    if (!pendingFeedInteraction.postId) return rawContent;
    if (Date.now() > pendingFeedInteraction.expiresAt) {
      console.log('[VVHOST][FEED] pending interaction expired');
      pendingFeedInteraction = null;
      return rawContent;
    }

    if (!rawContent.includes('[VV_AI_FEED_POST]') || !rawContent.includes('[/VV_AI_FEED_POST]')) {
      return rawContent;
    }

    var payload = extractAiFeedPostBlock(rawContent);
    if (!payload || !payload.content) return rawContent;

    var from = String(payload.from || payload.bridgeName || '').trim();
    var content = String(payload.content || '').trim();

    if (!from || !content) return rawContent;

    var replyTo = pendingFeedInteraction.from || '';

    var converted =
      '[VV_FEED_SYNC]\n' +
      'postId=' + pendingFeedInteraction.postId + '\n\n' +
      '[互动]\n' +
      'from=' + from + '\n' +
      'action=comment\n' +
      'content=' + content + '\n' +
      (replyTo ? 'replyTo=' + replyTo + '\n' : '') +
      '[/互动]\n' +
      '[/VV_FEED_SYNC]';

    console.log('[VVHOST][FEED] converted wrong VV_AI_FEED_POST to interaction:', {
      postId: pendingFeedInteraction.postId,
      from: from,
      replyTo: replyTo,
      content: content
    });

    return converted;
  }

  function convertWrongCallSyncToFeedInteractionRaw(rawContent) {
    rawContent = String(rawContent || '');

    // 没有电话同步块就原样返回
    if (!rawContent.includes('[VV_CALL_SYNC]') && !rawContent.includes('[/VV_CALL_SYNC]')) {
      return rawContent;
    }

    // 没有 pendingFeedInteraction 时，不知道要转给哪条动态，原样返回
    if (!pendingFeedInteraction || !pendingFeedInteraction.postId) {
      console.warn('[VVHOST][FEED] got wrong VV_CALL_SYNC in feed mode, but no pendingFeedInteraction');
      return rawContent;
    }

    if (Date.now() > pendingFeedInteraction.expiresAt) {
      console.warn('[VVHOST][FEED] pendingFeedInteraction expired, cannot convert call sync');
      pendingFeedInteraction = null;
      return rawContent;
    }

    var blockMatch = rawContent.match(/\[VV_CALL_SYNC\]([\s\S]*?)\[\/VV_CALL_SYNC\]/i);
    var block = blockMatch ? String(blockMatch[1] || '') : rawContent;

    var speaker = '';
    var content = '';

    var speakerMatch = block.match(/(?:^|\n)\s*speaker\s*=\s*([^\n\r]+)/i);
    if (speakerMatch) {
      speaker = String(speakerMatch[1] || '').trim();
    }

    var contentMatch = block.match(/(?:^|\n)\s*content\s*=\s*([\s\S]*?)(?=\n\s*(?:speaker|callPhase|chatId|target|time)\s*=|\n\s*\[通话\]|\s*$)/i);
    if (contentMatch) {
      content = String(contentMatch[1] || '').trim();
    }

    if (!speaker) {
      var targetMatch = block.match(/(?:^|\n)\s*target\s*=\s*([^\n\r]+)/i);
      speaker = targetMatch ? String(targetMatch[1] || '').trim() : '';
    }

    if (!content) {
      var lineMatch = block.match(/(?:^|\n)\s*(?:content|内容)\s*[=:：]\s*([^\n\r]+)/i);
      content = lineMatch ? String(lineMatch[1] || '').trim() : '';
    }

    if (!speaker) speaker = pendingFeedInteraction.from || '西西';
    if (!content) content = '我看到啦。';

    var replyTo = pendingFeedInteraction.from || '';

    var converted =
      '[VV_FEED_SYNC]\n' +
      'postId=' + pendingFeedInteraction.postId + '\n\n' +
      '[互动]\n' +
      'from=' + speaker + '\n' +
      'action=comment\n' +
      'content=' + content + '\n' +
      (replyTo ? 'replyTo=' + replyTo + '\n' : '') +
      '[/互动]\n' +
      '[/VV_FEED_SYNC]';

    console.log('[VVHOST][FEED] converted wrong VV_CALL_SYNC to feed interaction:', {
      postId: pendingFeedInteraction.postId,
      from: speaker,
      content: content,
      replyTo: replyTo
    });

    return converted;
  }

  var VV_FEED_INTERCEPTOR = (function () {
    var isActive = false;
    var hostMessageIndex = -1;
    var eventHandler = null;
    var processedMessageIds = {};

    function findHostMessageIndex() {
      var ctx = getCtx();
      if (!ctx || !Array.isArray(ctx.chat)) return -1;

      for (var i = ctx.chat.length - 1; i >= 0; i--) {
        var msg = ctx.chat[i];
        if (!msg) continue;

        var text = String(msg.mes || '');

        if (
          text.includes('vv' + '手机') ||
          text.includes('vv' + 'phone') ||
          text.includes('vvvital0312.github.io/' + 'vvphone') ||
          text.includes('phone' + 'Frame') ||
          text.includes('VV' + 'HOST') ||
          text.includes('VV_CALL_HIDDEN' + '_DATA') ||
          text.includes('VV_FEED_HIDDEN_DATA')
        ) {
          console.log('[CALL_INTERCEPT] found host msg, index:', i, 'snippet:', text.substring(0, 80));
          return i;
        }
      }

      for (var j = ctx.chat.length - 1; j >= 0; j--) {
        var m = ctx.chat[j];

        if (m && !m.is_user) {
          console.log('[CALL_INTERCEPT] fallback: using latest AI msg, index:', j);
          return j;
        }
      }

      return -1;
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
      ctx.eventSource.on(ctx.eventTypes.MESSAGE_RECEIVED, eventHandler);
      isActive = true;
      return true;
    }

    function stop() {
      if (!isActive) return;
      var ctx = getCtx();
      if (ctx && eventHandler) {
        ctx.eventSource.removeListener(ctx.eventTypes.MESSAGE_RECEIVED, eventHandler);
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

      // feed 场景下，如果模型错误输出了电话同步，尝试转成朋友圈互动。
      // 注意：这里必须防炸，否则会导致 pendingFeedPostIds 永远不清、同层不回一楼。
      try {
        if (typeof convertWrongCallSyncToFeedInteractionRaw === 'function') {
          rawContent = convertWrongCallSyncToFeedInteractionRaw(rawContent);
        }
      } catch (e) {
        console.warn('[VVHOST][FEED] convertWrongCallSyncToFeedInteractionRaw failed:', e);
      }

      try {
        if (typeof convertWrongAiFeedPostToInteractionRaw === 'function') {
          rawContent = convertWrongAiFeedPostToInteractionRaw(rawContent);
        }
      } catch (e) {
        console.warn('[VVHOST][FEED] convertWrongAiFeedPostToInteractionRaw failed:', e);
      }

      if (!rawContent.includes('[VV_FEED_SYNC]')) {
        console.warn('[FEED_INTERCEPT] no VV_FEED_SYNC in reply, skipping');

        // 即使模型输出错了，也删除这次临时楼层，避免污染聊天楼层
        await safeDeleteFeedFloor(messageIndex);
        return;
      }

      // 转发给手机页
      //postFeedSyncToPhone(rawContent, '');

      // 提取 [互动] 块，追加到对应 postId 的 hidden data 里
      try {
        var hostMsg = ctx.chat[hostMessageIndex];
        if (hostMsg) {
          var currentMes = String(hostMsg.mes || '');

          // 提取 [动态]
          var postBlockMatch = rawContent.match(/\[动态\][\s\S]*?\[\/动态\]/);

          // 提取所有 [互动]，并基于当前 hidden data 去重
          var rawInteractionBlocks = rawContent.match(/\[互动\][\s\S]*?\[\/互动\]/g) || [];
          var interactionBlocks = dedupeInteractionBlocksForAppend(currentMes, rawInteractionBlocks);

          if (postBlockMatch || interactionBlocks.length > 0) {
            var changed = false;
            // 从 AI 回复里提取 postId
            var postIdMatch = rawContent.match(/postId=([^\s\n]+)/);
            var targetPostId = postIdMatch ? postIdMatch[1] : '';

            if (targetPostId && currentMes.includes('postId=' + targetPostId)) {
              // 在对应 postId 块的 [/VV_FEED_HIDDEN_DATA] 前插入
              var parts = currentMes.split('[/VV_FEED_HIDDEN_DATA]');
              var inserted = false;
              for (var p = 0; p < parts.length - 1; p++) {
                if (parts[p].includes('postId=' + targetPostId) && !inserted) {
                  var appendText = '';

                  if (postBlockMatch) {
                    var existingDynamicMatch = parts[p].match(/\[动态\][\s\S]*?\[\/动态\]/);
                    var existingDynamicBlock = existingDynamicMatch ? existingDynamicMatch[0] : '';

                    var existingContentMatch = existingDynamicBlock.match(/(?:^|\n)\s*content\s*=\s*([\s\S]*?)(?=\n\s*(?:photo|images|location|bridgeName|time|from)\s*=|\n\s*\[\/动态\]|$)/i);
                    var existingContent = existingContentMatch ? String(existingContentMatch[1] || '').trim() : '';

                    var newContentMatch = postBlockMatch[0].match(/(?:^|\n)\s*content\s*=\s*([\s\S]*?)(?=\n\s*(?:photo|images|location|bridgeName|time|from)\s*=|\n\s*\[\/动态\]|$)/i);
                    var newContent = newContentMatch ? String(newContentMatch[1] || '').trim() : '';

                    if (!existingDynamicBlock) {
                      appendText += '\n' + postBlockMatch[0] + '\n';
                    } else if (!existingContent && newContent) {
                      // 已有的是空壳动态，用 AI 返回的真实动态替换
                      parts[p] = parts[p].replace(/\[动态\][\s\S]*?\[\/动态\]/, postBlockMatch[0]);
                      inserted = true;
                      changed = true;
                      console.log('[VVHOST_FEED_FIX] replaced empty [动态] for postId:', targetPostId);
                    } else {
                      console.log('[VVHOST_FEED_DEDUPE] skip duplicated non-empty [动态] for postId:', targetPostId);
                    }
                  }

                  if (interactionBlocks.length > 0) {
                    appendText += '\n' + interactionBlocks.join('\n') + '\n';
                  }

                  parts[p] = parts[p] + appendText;
                  inserted = true;
                }
              }
              currentMes = parts.join('[/VV_FEED_HIDDEN_DATA]');
            } else {
              // 找不到对应 postId，追加到最后一个 hidden block 的闭合标签前
              var appendText = '';

              if (postBlockMatch) {
                appendText += '\n' + postBlockMatch[0] + '\n';
              }

              if (interactionBlocks.length > 0) {
                appendText += '\n' + interactionBlocks.join('\n') + '\n';
              }

              currentMes = currentMes.replace(
                /\[\/VV_FEED_HIDDEN_DATA\](?![\s\S]*\[\/VV_FEED_HIDDEN_DATA\])/,
                appendText + '\n[/VV_FEED_HIDDEN_DATA]'
              );
            }

            hostMsg.mes = currentMes;

            var saveCtx = getCtx();
            if (saveCtx && typeof saveCtx.saveChat === 'function') {
              try { saveCtx.saveChat(); } catch (e) {}
            }

            console.log('[FEED_INTERCEPT] appended feed sync for postId:', targetPostId);

            pendingFeedInteraction = null;

            if (targetPostId && pendingFeedPostIds[targetPostId]) {
              delete pendingFeedPostIds[targetPostId];
              console.log('[VVHOST][FEED] pending feed post cleared:', targetPostId);
            }

            // 写入成功后，把完整 raw 发给手机页
            pushFeedHiddenRawToPhone(currentMes, 'feed-intercept-append');
            openFeedPageOnPhone('feed-intercept-append'); 
          } else {
            console.log('[FEED_INTERCEPT] no [互动] blocks found in AI reply');
          }
        }
      } catch (e) {
        console.error('[FEED_INTERCEPT] append to host failed:', e);
      }

      // 删除 AI 新开的楼层
      await safeDeleteFeedFloor(messageIndex);
    }

    async function safeDeleteFeedFloor(aiMessageIndex) {
      var ctx = getCtx();
      if (!ctx) return;
      var root = getRoot();

      var toDelete = [];

      for (var i = ctx.chat.length - 1; i >= 0; i--) {
        var m = ctx.chat[i];
        if (!m) continue;
        if (i === hostMessageIndex) continue;

        if (!m.is_user) {
          var text = String(m.mes || '');
          if (text.includes('[VV_FEED_SYNC]') || text.includes('[/VV_FEED_SYNC]')) {
            toDelete.push(i);
            continue;
          }
        }

        if (m.is_user) {
          var userText = String(m.mes || '');
          if (userText.includes('朋友圈动态发布') ||
              userText.includes('VV_FEED_SYNC') ||
              userText.includes('vv_feed')) {
            toDelete.push(i);
            continue;
          }
        }

        if (ctx.chat.length - 1 - i > 8) break;
      }

      console.log('[FEED_INTERCEPT] floors to delete:', toDelete);

      toDelete.sort(function (a, b) { return b - a; });

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
        try { ctx.saveChat(); } catch (e) {}
      }

      console.log('[FEED_INTERCEPT] deletion done');
    }

    return {
      start: start,
      stop: stop,
      isActive: function () { return isActive; }
    };
  })();
  
  console.log('[VVHOST][SUMMON] VV_CALL_INTERCEPTOR loaded (no-container mode v2)');

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

    const block = String(match[0] || '').trim();

    // ★ 修复：expectedChatId 为空时跳过 chatId 校验（RP命令场景）
    if (expectedChatId) {
      const ok =
        block.includes('chatId=' + expectedChatId) ||
        block.includes('chatId: ' + expectedChatId) ||
        block.includes('聊天ID:' + expectedChatId) ||
        block.includes('聊天ID：' + expectedChatId);
      if (!ok) return '';
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

    // diaryId 是本轮唯一标识，必须校验
    if (expectedDiaryId) {
      const ok =
        block.includes('diaryId=' + expectedDiaryId) ||
        block.includes('diaryId: ' + expectedDiaryId) ||
        block.includes('日记ID=' + expectedDiaryId) ||
        block.includes('日记ID：' + expectedDiaryId);

      if (!ok) {
        console.warn('[VVHOST][DIARY] diaryId mismatch, expected=', expectedDiaryId);
        return '';
      }
    }

    // authorId 只做警告，不再阻止同步
    if (expectedAuthorId) {
      const ok =
        block.includes('authorId=' + expectedAuthorId) ||
        block.includes('authorId: ' + expectedAuthorId) ||
        block.includes('作者ID=' + expectedAuthorId) ||
        block.includes('作者ID：' + expectedAuthorId);

      if (!ok) {
        console.warn('[VVHOST][DIARY] authorId mismatch but ignored', {
          expected: expectedAuthorId
        });
      }
    }

    if (!/title\s*[=:：]/i.test(block)) {
      console.warn('[VVHOST][DIARY] missing title');
      return '';
    }

    if (!/weather\s*[=:：]/i.test(block)) {
      console.warn('[VVHOST][DIARY] missing weather');
      return '';
    }

    if (!/paragraph\s*[=:：]/i.test(block)) {
      console.warn('[VVHOST][DIARY] missing paragraph');
      return '';
    }

    return block;
  }

  function extractValidVVAnnotationSyncBlock(text) {
    const raw = String(text || '');
    if (!raw.includes('[VV_ANNOTATION_SYNC]')) return null;
    if (!raw.includes('[/VV_ANNOTATION_SYNC]')) return null;

    const match = raw.match(/\[VV_ANNOTATION_SYNC\][\s\S]*?\[\/VV_ANNOTATION_SYNC\]/i);
    if (!match) return null;

    const block = match[0].trim();

    // 必须包含 diaryId 和 annotationId
    if (!/diaryId\s*[=:]/i.test(block)) return null;
    if (!/annotationId\s*[=:]/i.test(block)) return null;

    return block;
  }

  function extractValidVVFeedSyncBlock(text) {
    if (!text || !text.includes('[VV_FEED_SYNC]')) return null;
    if (!text.includes('[/VV_FEED_SYNC]')) return null;
    const m = text.match(/\[VV_FEED_SYNC\][\s\S]*?\[\/VV_FEED_SYNC\]/);
    return m ? m[0] : null;
  }

  function postFeedSyncToPhone(block, viewId) {
    if (!block) return false;

    return postToPhone({
      type: 'VVPHONE_FEED_SYNC',
      raw: block,
      viewId: viewId || ''
    });
  }

  function escapeVVRegExp(str) {
    return String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function findFeedHostMessageIndex() {
    var ctx = getCtx();
    if (!ctx || !Array.isArray(ctx.chat)) return -1;

    for (var i = ctx.chat.length - 1; i >= 0; i--) {
      var mes = String(ctx.chat[i].mes || '');

      if (
        mes.includes('VV_FEED_HIDDEN_DATA') ||
        mes.includes('vv' + '手机') ||
        mes.includes('vv' + 'phone') ||
        mes.includes('phone' + 'Frame') ||
        mes.includes('VV' + 'HOST')
      ) {
        return i;
      }
    }

    return -1;
  }

  function buildFeedInteractionBlockFromMutation(data) {
    data = data || {};

    var action = String(data.action || '');
    var from = String(data.from || '').trim();
    var content = String(data.content || '').trim();
    var replyTo = String(data.replyTo || '').trim();

    var now = new Date();
    var timeStr =
      (now.getMonth() + 1) + '月' +
      now.getDate() + '日 ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0');

    if (!from) return '';

    if (action === 'add-like') {
      return (
        '\n[互动]\n' +
        'from=' + from + '\n' +
        'time=' + timeStr + '\n' +
        'action=like\n' +
        'content=\n' +
        '[/互动]\n'
      );
    }

    if (action === 'add-comment') {
      if (!content) return '';

      return (
        '\n[互动]\n' +
        'from=' + from + '\n' +
        'time=' + timeStr + '\n' +
        'action=comment\n' +
        'content=' + content + '\n' +
        (replyTo ? 'replyTo=' + replyTo + '\n' : '') +
        '[/互动]\n'
      );
    }

    return '';
  }

  function buildFeedInteractionKeyFromMutation(data) {
    data = data || {};

    var action = String(data.action || '').trim();
    var from = String(data.from || '').trim();
    var content = String(data.content || '').trim();
    var replyTo = String(data.replyTo || '').trim();

    if (data.comment) {
      from = String(data.comment.from || from || '').trim();
      content = String(data.comment.text || data.comment.content || content || '').trim();
      replyTo = String(data.comment.replyTo || replyTo || '').trim();
    }

    if (action === 'remove-like' || action === 'add-like') {
      return [
        normalizeFeedTextForKey('like'),
        normalizeFeedTextForKey(from),
        '',
        ''
      ].join('|');
    }

    if (action === 'delete-comment' || action === 'add-comment') {
      return [
        normalizeFeedTextForKey('comment'),
        normalizeFeedTextForKey(from),
        normalizeFeedTextForKey(content),
        normalizeFeedTextForKey(replyTo)
      ].join('|');
    }

    return '';
  }

  function mutateOneFeedHiddenBlock(blockText, postId, mutator) {
    blockText = String(blockText || '');
    postId = String(postId || '').trim();

    if (!postId) return blockText;
    if (!blockText.includes('postId=' + postId)) return blockText;

    return mutator(blockText);
  }

  function mutateFeedHiddenDataInMessage(currentMes, postId, mutator) {
    currentMes = String(currentMes || '');
    postId = String(postId || '').trim();

    if (!postId) return {
      text: currentMes,
      changed: false
    };

    var changed = false;

    // 优先处理 div 包裹的 hidden block
    var divRe = /<div class="vv-feed-hidden"[^>]*>[\s\S]*?\[VV_FEED_HIDDEN_DATA\][\s\S]*?\[\/VV_FEED_HIDDEN_DATA\][\s\S]*?<\/div>/g;

    var replaced = currentMes.replace(divRe, function (block) {
      if (!block.includes('postId=' + postId)) return block;

      var next = mutateOneFeedHiddenBlock(block, postId, mutator);

      if (next !== block) changed = true;

      return next;
    });

    if (changed) {
      return {
        text: replaced,
        changed: true
      };
    }

    // 兜底：处理没有 div 包裹的纯 VV_FEED_HIDDEN_DATA
    var pureRe = /\[VV_FEED_HIDDEN_DATA\][\s\S]*?\[\/VV_FEED_HIDDEN_DATA\]/g;

    replaced = currentMes.replace(pureRe, function (block) {
      if (!block.includes('postId=' + postId)) return block;

      var next = mutateOneFeedHiddenBlock(block, postId, mutator);

      if (next !== block) changed = true;

      return next;
    });

    return {
      text: replaced,
      changed: changed
    };
  }

  function handleFeedLocalMutation(data) {
    data = data || {};

    var action = String(data.action || '').trim();
    var postId = String(data.postId || '').trim();

    if (!action || !postId) {
      console.warn('[VVHOST][FEED_MUTATION] missing action/postId', data);
      return false;
    }

    var ctx = getCtx();

    if (!ctx || !Array.isArray(ctx.chat)) {
      console.warn('[VVHOST][FEED_MUTATION] ctx/chat not available');
      return false;
    }

    var hostIdx = findFeedHostMessageIndex();

    if (hostIdx < 0 || !ctx.chat[hostIdx]) {
      console.warn('[VVHOST][FEED_MUTATION] host message not found');
      return false;
    }

    var currentMes = String(ctx.chat[hostIdx].mes || '');
    var nextMes = currentMes;
    var changed = false;

    console.log('[VVHOST][FEED_MUTATION] received:', {
      action: action,
      postId: postId,
      from: data.from,
      content: data.content,
      replyTo: data.replyTo
    });

    if (action === 'delete-post') {
      var divRe = /<div class="vv-feed-hidden"[^>]*>[\s\S]*?\[VV_FEED_HIDDEN_DATA\][\s\S]*?\[\/VV_FEED_HIDDEN_DATA\][\s\S]*?<\/div>/g;

      nextMes = currentMes.replace(divRe, function (block) {
        if (block.includes('postId=' + postId)) {
          changed = true;
          return '';
        }

        return block;
      });

      // 兜底：如果不是 div 包裹
      if (!changed) {
        var pureRe = /\[VV_FEED_HIDDEN_DATA\][\s\S]*?\[\/VV_FEED_HIDDEN_DATA\]/g;

        nextMes = currentMes.replace(pureRe, function (block) {
          if (block.includes('postId=' + postId)) {
            changed = true;
            return '';
          }

          return block;
        });
      }
    }

    if (action === 'add-like' || action === 'add-comment') {
      var interactionBlock = buildFeedInteractionBlockFromMutation(data);

      if (!interactionBlock) {
        console.warn('[VVHOST][FEED_MUTATION] empty interaction block');
        return false;
      }

      var deduped = dedupeInteractionBlocksForAppend(currentMes, [interactionBlock]);

      if (deduped.length === 0) {
        console.log('[VVHOST][FEED_MUTATION] duplicated interaction, skip append');
        return false;
      }

      var resultAdd = mutateFeedHiddenDataInMessage(currentMes, postId, function (block) {
        return block.replace(
          /\[\/VV_FEED_HIDDEN_DATA\]/,
          '\n' + deduped[0] + '\n[/VV_FEED_HIDDEN_DATA]'
        );
      });

      nextMes = resultAdd.text;
      changed = resultAdd.changed;
    }

    if (action === 'remove-like' || action === 'delete-comment') {
      var targetKey = buildFeedInteractionKeyFromMutation(data);

      if (!targetKey) {
        console.warn('[VVHOST][FEED_MUTATION] empty target key for remove');
        return false;
      }

      var resultRemove = mutateFeedHiddenDataInMessage(currentMes, postId, function (block) {
        var before = block;

        var after = block.replace(/\[互动\][\s\S]*?\[\/互动\]/g, function (ib) {
          var key = buildInteractionKey(ib);

          if (key === targetKey) {
            console.log('[VVHOST][FEED_MUTATION] remove interaction:', targetKey);
            return '';
          }

          return ib;
        });

        return after;
      });

      nextMes = resultRemove.text;
      changed = resultRemove.changed && nextMes !== currentMes;
    }

    if (!changed || nextMes === currentMes) {
      console.log('[VVHOST][FEED_MUTATION] no change');
      return false;
    }

    ctx.chat[hostIdx].mes = nextMes;

    try {
      if (typeof ctx.saveChat === 'function') {
        ctx.saveChat();
      }
    } catch (e) {
      console.warn('[VVHOST][FEED_MUTATION] saveChat failed:', e);
    }

    console.log('[VVHOST][FEED_MUTATION] host hidden data updated:', action, postId);

    pushFeedHiddenRawToPhone(nextMes, 'feed-local-mutation');

    return true;
  }

  function extractValidVVCallSyncBlock(text) {
    const raw = String(text || '');
    if (!raw.includes('[VV_CALL_SYNC]') || !raw.includes('[/VV_CALL_SYNC]')) return '';
    const match = raw.match(/\[VV_CALL_SYNC\][\s\S]*?\[\/VV_CALL_SYNC\]/i);
    return match ? String(match[0]).trim() : '';
  }

  function extractIncomingCallBlock(text) {
    const raw = String(text || '');
    if (!raw.includes('[VV_INCOMING_CALL]') || !raw.includes('[/VV_INCOMING_CALL]')) return '';
    const match = raw.match(/\[VV_INCOMING_CALL\][\s\S]*?\[\/VV_INCOMING_CALL\]/i);
    return match ? String(match[0]).trim() : '';
  }

  function postCallSyncToPhone(raw, chatId, viewId) {
    if (!raw) return false;
    return postToPhone({
      type: 'VVPHONE_CALL_SYNC',
      raw: raw,
      chatId: chatId || lastExpectedChatId || '',
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

  function postChatSyncToPhone(raw, chatId, viewId) {
    if (!raw) return false;
    lastVVChatSyncRaw = raw;
    if (chatId) lastExpectedChatId = chatId;
    if (viewId) lastViewId = viewId;

    return postToPhone({
      type: 'VVPHONE_CHAT_SYNC',
      raw: raw,
      chatId: chatId || lastExpectedChatId || '',
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

  function getSTChat() {
    var root = getRoot();
    try {
      var ctx = root?.SillyTavern?.getContext?.();
      if (ctx && Array.isArray(ctx.chat)) return ctx.chat;
    } catch (e) {}
    try {
      if (Array.isArray(root?.chat)) return root.chat;
    } catch (e) {}
    return null;
  }

  async function safeDeleteDiaryFloors(aiMessageIndex) {
    var ctx = getCtx();
    if (!ctx) return;

    var root = getRoot();

    console.log('[DIARY_INTERCEPT] start deleting floors, aiIndex:', aiMessageIndex, 'total:', ctx.chat.length);

    var toDelete = [];

    for (var i = ctx.chat.length - 1; i >= 0; i--) {
      var m = ctx.chat[i];
      if (!m) continue;

      var text = String(m.mes || m.message || '');

      // 删除 AI 返回的日记同步楼层
      if (!m.is_user) {
        if (
          text.includes('[VV_DIARY_SYNC]') ||
          text.includes('[/VV_DIARY_SYNC]')
        ) {
          toDelete.push(i);
          continue;
        }
      }

      // 删除用户发出的日记请求楼层
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

      // 只扫最近几层，避免误删历史
      if (ctx.chat.length - 1 - i > 10) break;
    }

    console.log('[DIARY_INTERCEPT] floors to delete:', toDelete);

    if (!toDelete.length) return;

    toDelete.sort(function (a, b) { return b - a; });

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
      try { ctx.saveChat(); } catch (e) {}
    }

    console.log('[DIARY_INTERCEPT] deletion done, remaining floors:', ctx.chat.length);
  }

  async function appendAnnotationReplyToHostMessage(annotationSyncBlock) {
    const ctx = getCtx();
    if (!ctx) return;

    try {
      let hostIdx = -1;
      for (let i = ctx.chat.length - 1; i >= 0; i--) {
        const mesText = String(ctx.chat[i].mes || '');
        if (mesText.includes('vv手机') || mesText.includes('vvphone')) {
          hostIdx = i;
          break;
        }
      }

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

      // ★ 关键改动：splice 数组的同时，把对应 DOM 节点也精准移除
      //   只删末尾楼层，不会影响前面楼层的 mesid 索引，也不会重载手机 iframe
      deleteIndexes
        .sort((a, b) => b - a)
        .forEach(idx => {
          ctx.chat.splice(idx, 1);
          try {
            const pdoc = window.parent.document;
            const el = pdoc.querySelector('#chat .mes[mesid="' + idx + '"]');
            if (el) el.remove();
          } catch (e) {}
        });

      try {
        ctx.saveChat();
      } catch (e) {}

      console.log(
        '[ANNOTATION] reply appended + floors cleaned (DOM removed) for',
        annotationId
      );

      postToPhone({
        type: 'VV_ANNOTATION_HIDDEN_RAW',
        raw: currentMes,
        diaryId,
        annotationId
      });

    } catch (e) {
      console.error('[ANNOTATION] append failed:', e);
    }
  }

  function pollForAssistantReply(chatId, viewId, timeout, mode) {
    mode = mode || '';

    if (VV_CALL_INTERCEPTOR.isActive()) {
      console.log('[VVHOST][SUMMON] call interceptor active, skip polling');
      return;
    }

    timeout = timeout || 120000;
    const started = Date.now();
    const chatArr = getSTChat();
    const beforeLength = chatArr ? chatArr.length : 0;

    console.log('[VVHOST][SUMMON] pollForAssistantReply start',
      'chatId=', chatId,
      'beforeLength=', beforeLength
    );

    if (!chatArr) {
      console.warn('[VVHOST][SUMMON] poll: chat not accessible, abort');
      return;
    }

    const timer = setInterval(function () {
      if (VV_CALL_INTERCEPTOR.isActive()) {
        console.log('[VVHOST][SUMMON] poll: call started, stop polling');
        clearInterval(timer);
        return;
      }

      try {
        const chat = getSTChat();
        if (!chat) {
          console.warn('[VVHOST][SUMMON] poll: chat lost');
          clearInterval(timer);
          return;
        }

        // ★ 修复：扫描范围从 max(0, beforeLength-1) 开始
        // 因为酒馆流式生成时 chat.length 会先增后减（临时消息合并）
        // 原来用 beforeLength 作起点会漏掉最后一条被覆盖的消息
        const scanStart = Math.max(0, beforeLength - 1);

        for (let i = chat.length - 1; i >= scanStart; i--) {
          const msg = chat[i];
          if (!msg) continue;
          if (msg.is_user) continue;

          const text = String(msg.mes || msg.message || '');
          console.log(
            '[VVHOST][RAW ASSISTANT]',
            text
          );

          const annotationBlock = extractValidVVAnnotationSyncBlock(text);
          if (annotationBlock) {
            clearInterval(timer);
            console.log('[VVHOST][SUMMON] poll FOUND annotation sync at index=', i);

            const dIdMatch = annotationBlock.match(/diaryId\s*[=:]\s*([^\s\n]+)/i);
            const aIdMatch = annotationBlock.match(/annotationId\s*[=:]\s*([^\s\n]+)/i);

            const realDiaryId = dIdMatch ? dIdMatch[1].trim() : '';
            const realAnnotationId = aIdMatch ? aIdMatch[1].trim() : '';

            postAnnotationSyncToPhone(annotationBlock, realDiaryId, realAnnotationId, viewId);
            appendAnnotationReplyToHostMessage(annotationBlock);
            return;
          }                            

          if (text.includes('[VV_DIARY_SYNC]')) {
            console.log('[VVHOST][SUMMON] poll: found VV_DIARY_SYNC tag at index=', i,
              'has_close_tag=', text.includes('[/VV_DIARY_SYNC]'),
              'length=', text.length
            );
          }

          // ★ 新增调试日志：看看到底扫到了什么
          if (text.includes('[VV_CHAT_SYNC]')) {
            console.log('[VVHOST][SUMMON] poll: found VV_CHAT_SYNC tag at index=', i,
              'has_close_tag=', text.includes('[/VV_CHAT_SYNC]'),
              'length=', text.length
            );
          }

          const diaryBlock = extractValidVVDiarySyncBlock(
            text,
            lastExpectedDiaryId || '',
            lastExpectedDiaryAuthorId || ''
          );

          if (diaryBlock) {
            clearInterval(timer);

            console.log('[VVHOST][SUMMON] poll FOUND diary sync in index=', i);

            postDiarySyncToPhone(
              diaryBlock,
              lastExpectedDiaryId || '',
              lastExpectedDiaryAuthorId || '',
              viewId
            );

            safeDeleteDiaryFloors(i);

            return;
          }

          // 日记模式下，只认 VV_DIARY_SYNC，其他同步块全部忽略
          if (mode === 'diary') {
            if (
              text.includes('[VV_CALL_SYNC]') ||
              text.includes('[VV_CHAT_SYNC]') ||
              text.includes('[VV_FEED_SYNC]')
            ) {
              console.warn('[VVHOST][DIARY] non-diary sync ignored in diary mode, index=', i);
            }
            continue;
          } 

          const incomingBlock = extractIncomingCallBlock(text);
          if (incomingBlock) {
            console.log('[VVHOST][SUMMON] poll FOUND incoming call in index=', i);
            postIncomingCallToPhone(incomingBlock, viewId);
          }

          const callBlock = extractValidVVCallSyncBlock(text);
          if (callBlock) {
            console.log('[VVHOST][SUMMON] poll FOUND call sync in index=', i);
            postCallSyncToPhone(callBlock, chatId, viewId);
            if (!text.includes('[VV_CHAT_SYNC]')) {
              clearInterval(timer);
              return;
            }
          }

          const block = extractValidVVChatSyncBlock(text, chatId);
          if (block) {
            clearInterval(timer);
            console.log('[VVHOST][SUMMON] poll FOUND chat sync in index=', i);
            postChatSyncToPhone(block, chatId, viewId);
            return;
          }           

          const feedBlock = extractValidVVFeedSyncBlock(text);
          if (feedBlock) {
            clearInterval(timer);
            console.log('[VVHOST][SUMMON] poll FOUND feed sync in index=', i);

            // feed 数据统一由 VV_FEED_INTERCEPTOR / hidden raw 写入手机。
            // 这里不要直接 postFeedSyncToPhone，避免双来源重复。
            openFeedPageOnPhone('poll-feed-sync');

            return;
          }
        }

        console.log('[VVHOST][SUMMON] poll: no sync yet',
          'total=', chat.length,
          'new=', chat.length - beforeLength,
          'scanStart=', scanStart,
          'elapsed=', Date.now() - started
        );
      } catch (err) {
        console.error('[VVHOST][SUMMON] poll error:', err);
      }

      if (Date.now() - started > timeout) {
        clearInterval(timer);
        console.warn('[VVHOST][SUMMON] poll timeout after', timeout, 'ms');
      }
    }, 1500);
  }

  async function runTriggerSlash(command) {
    console.log('[VVHOST][SUMMON] runTriggerSlash called');

    const root = getRoot();
    if (!root || !root.document) throw new Error('parent/top document unavailable');

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
      return style && style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
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
          ? root.HTMLTextAreaElement?.prototype || HTMLTextAreaElement.prototype
          : root.HTMLElement?.prototype || HTMLElement.prototype;

      const valueSetter =
        Object.getOwnPropertyDescriptor(proto, 'value')?.set ||
        Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el) || {}, 'value')?.set;

      if (el.isContentEditable) {
        el.focus();
        el.textContent = value;
      } else if (valueSetter) {
        valueSetter.call(el, value);
      } else {
        el.value = value;
      }
    }

    const inputEl = findFirstVisible(inputSelectors);
    if (!inputEl) throw new Error('chat input not found');

    inputEl.focus();

    if (inputEl.isContentEditable) {
      inputEl.textContent = command;
    } else {
      setNativeValue(inputEl, command);
    }

    inputEl.dispatchEvent(new root.Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new root.Event('change', { bubbles: true }));

    await new Promise(resolve => setTimeout(resolve, 80));

    let sent = false;
    const sendBtn = findFirstVisible(buttonSelectors);

    if (sendBtn) {
      sendBtn.click();
      sent = true;
    }

    if (!sent) {
      inputEl.dispatchEvent(new root.KeyboardEvent('keydown', {
        bubbles: true, cancelable: true,
        key: 'Enter', code: 'Enter', which: 13, keyCode: 13
      }));
      inputEl.dispatchEvent(new root.KeyboardEvent('keyup', {
        bubbles: true, cancelable: true,
        key: 'Enter', code: 'Enter', which: 13, keyCode: 13
      }));
      sent = true;
    }

    await new Promise(resolve => setTimeout(resolve, 120));
    return !!sent;
  }

  async function triggerGenerationAfterSend() {
    const root = getRoot();
    if (!root) return false;

    try {
      if (typeof root.Generate === 'function') {
        console.log('[VVHOST][GEN] using root.Generate()');
        await root.Generate();
        return true;
      }
    } catch (e) {
      console.warn('[VVHOST][GEN] root.Generate failed:', e);
    }

    try {
      if (typeof root.generate === 'function') {
        console.log('[VVHOST][GEN] using root.generate()');
        await root.generate();
        return true;
      }
    } catch (e) {
      console.warn('[VVHOST][GEN] root.generate failed:', e);
    }

    try {
      const doc = root.document;
      const selectors = [
        '#option_continue',
        '#option_regenerate',
        '#send_but',
        '#send-button',
        '.send-button',
        '.st-send-button',
        'button[title*="Send"]',
        'button[aria-label*="Send"]',
        'button[title*="发送"]',
        'button[aria-label*="发送"]',
        'button[title*="Generate"]',
        'button[aria-label*="Generate"]',
        'button[title*="生成"]',
        'button[aria-label*="生成"]'
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
          console.log('[VVHOST][GEN] clicking button:', selector);
          btn.click();
          return true;
        }
      }
    } catch (e) {
      console.warn('[VVHOST][GEN] button trigger failed:', e);
    }

    console.warn('[VVHOST][GEN] no generation trigger available');
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

  console.log('[VVHOST][SUMMON] VV_RP_COMMAND loaded');

  (function initUserInputPoller() {
    var lastCheckedIndex = -1;
    var pollInterval = 1000; // 每秒检查一次

    function checkForNewUserMessage() {
      try {
        var chat = getSTChat();
        if (!chat || chat.length === 0) {
          lastCheckedIndex = -1;
          return;
        }

        // 初始化：跳过已有消息
        if (lastCheckedIndex === -1) {
          lastCheckedIndex = chat.length - 1;
          console.log('[VVHOST][RP_POLL] initialized, lastCheckedIndex=', lastCheckedIndex);
          return;
        }

        // 检查是否有新消息
        if (chat.length - 1 <= lastCheckedIndex) return;

        // 处理所有新消息
        for (var i = lastCheckedIndex + 1; i < chat.length; i++) {
          var msg = chat[i];
          if (!msg) continue;

          var text = String(msg.mes || '');

          // ── 用户消息：RP 指令检测 ──
          if (msg.is_user) {
            console.log('[VVHOST][RP_POLL] new user msg at index', i, ':', JSON.stringify(text.slice(0, 200)));

            var command = VV_RP_COMMAND.parse(text);
            if (!command) {
              console.log('[VVHOST][RP_POLL] no command detected');
              continue;
            }

            console.log('[VVHOST][RP_CMD] command detected:', command);

            if (command.type === 'sendMessage') {
              postToPhone({
                type: 'VV_RP_SEND_MESSAGE',
                targetName: command.targetName,
                messages: command.messages
              });
              console.log('[VVHOST][RP_CMD] sent VV_RP_SEND_MESSAGE to phone');

              setTimeout(function () {
                console.log('[VVHOST][RP_CMD] starting pollForAssistantReply for RP message');
                pollForAssistantReply(null, lastViewId || '', 120000);
              }, 1500);

            } else if (command.type === 'makeCall') {
              postToPhone({
                type: 'VV_RP_MAKE_CALL',
                targetName: command.targetName
              });
              console.log('[VVHOST][RP_CMD] sent VV_RP_MAKE_CALL to phone');
            }

            continue;
          }

          // ── AI 消息：检测主动发动态 ──
          if (!msg.is_user && text.includes('[VV_AI_FEED_POST]') && text.includes('[/VV_AI_FEED_POST]')) {
            console.log('[VVHOST][AI_FEED] detected VV_AI_FEED_POST in AI msg at index', i);

            var aiPostBlock = extractAiFeedPostBlock(text);

            if (aiPostBlock) {
              var aiPostId = String(aiPostBlock.postId || '').trim() || ('idx_' + i + '_' + text.length);

              if (processedAiFeedPostIds[aiPostId]) {
                console.log('[VVHOST][AI_FEED] duplicated postId, skip:', aiPostId);
                continue;
              }

              var ok = appendAiFeedPostToHostHidden(aiPostBlock, 'ai-feed-poller');

              if (ok) {
                processedAiFeedPostIds[aiPostId] = true;
                console.log('[VVHOST][AI_FEED] appended AI feed post to hidden:', aiPostBlock);
              } else {
                console.warn('[VVHOST][AI_FEED] append failed, will retry:', aiPostBlock);
              }
            }
          }
        }

        lastCheckedIndex = chat.length - 1;

      } catch (err) {
        console.error('[VVHOST][RP_POLL] error:', err);
      }
    }

    setInterval(checkForNewUserMessage, pollInterval);
    console.log('[VVHOST][SUMMON] user input POLLER registered (interval=' + pollInterval + 'ms)');
  })();

  window.addEventListener('message', async function (event) {
    const data = event.data || {};
    if (!data || !data.type) return;

    console.log('[VVHOST][SUMMON] got message:', data.type, 'keys:', Object.keys(data));

    try {
      if (data.type === 'VV_FEED_LOCAL_MUTATION') {
        handleFeedLocalMutation(data);
        return;
      }

      if (data.type === 'VVPHONE_READY') {
        console.log('[VVHOST][SUMMON] phone ready, scanning current floor for sync block...');
        try {
          var chat = getSTChat();
          if (chat && chat.length > 0) {
            for (var i = chat.length - 1; i >= 0; i--) {
              var msg = chat[i];
              if (!msg || msg.is_user) continue;
              var text = String(msg.mes || msg.message || '');
              var syncBlock = extractValidVVChatSyncBlock(text, lastExpectedChatId || '');
              if (syncBlock) {
                console.log('[VVHOST_CHAT] INIT: found sync block at index=', i, ', posting to phone');
                postChatSyncToPhone(syncBlock, lastExpectedChatId || '', lastViewId || '');
                break;
              }
              if (chat.length - 1 - i >= 3) break;
            }
          }
        } catch (err) {
          console.warn('[VVHOST][SUMMON] INIT scan error:', err);
        }
        return;
      }

      if (data.type === 'VV_CALL_START') {
        console.log('[VVHOST][SUMMON] received call start request:', data);
        var started = VV_CALL_INTERCEPTOR.start({
          targetName: data.targetName || data.target || 'unknown',
          chatId: data.chatId || lastExpectedChatId || '',
          storyTime: data.storyTime || '',
          onMessage: function (parsed) {
            console.log('[VVHOST][SUMMON] call AI reply intercepted:', parsed);
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
        console.log('[VVHOST][SUMMON] interceptor start result:', started);
        return;
      }

      if (data.type === 'VV_CALL_USER_SPEAK') {
        console.log('[VVHOST][SUMMON] received user call speech');
        if (VV_CALL_INTERCEPTOR.isActive()) {
          VV_CALL_INTERCEPTOR.addUserLines(data.lines || [data.text || '']);
        }
        return;
      }

      if (data.type === 'VV_CALL_END') {
        console.log('[VVHOST][SUMMON] received call end request');
        VV_CALL_INTERCEPTOR.end();
        return;
      }

      if (data.type === 'VV_EXECUTE_SLASH') {
        const requestId = data.requestId || null;
        const command = String(data.command || '');
        console.log('[VVHOST][ANNOTATION COMMAND]', command);

        const viewId = String(data.viewId || '').trim();
        const feedMode = !!data.feedMode;
        const callMode = !!data.callMode;
        const annotationMode = !!data.annotationMode;

        const feedMeta = data.feedMeta || null;
        const userInteraction = data.userInteraction || null;

        if (feedMode && userInteraction) {
          pendingFeedInteraction = {
            postId: String(userInteraction.postId || '').trim(),
            from: String(userInteraction.from || '').trim(),
            action: String(userInteraction.action || '').trim(),
            content: String(userInteraction.content || '').trim(),
            replyTo: String(userInteraction.replyTo || '').trim(),
            startedAt: Date.now(),
            expiresAt: Date.now() + 120000
          };

          console.log('[VVHOST][FEED] pending interaction set:', pendingFeedInteraction);
        } else if (feedMode && feedMeta) {
          pendingFeedInteraction = null;
        }

        const diaryMode = isDiaryCommand(command);
        console.log('[VVHOST][MODE CHECK]', { diaryMode, annotationMode });

        // ★ 修复一：命令里是否已自带 /trigger
        const commandHasTrigger = /\/trigger\b/.test(command);
        console.log('[VVHOST][TRIGGER CHECK] commandHasTrigger=', commandHasTrigger);

        lastExpectedChatId =
          String(data.chatId || '').trim() ||
          extractChatIdFromCommand(command) ||
          lastExpectedChatId ||
          '';

        lastViewId = viewId || lastViewId || '';

        if (diaryMode) {
          lastExpectedDiaryId = extractDiaryIdFromCommand(command);
          lastExpectedDiaryAuthorId = extractDiaryAuthorIdFromCommand(command);
          console.log('[VVHOST][DIARY] diaryMode detected', {
            diaryId: lastExpectedDiaryId,
            authorId: lastExpectedDiaryAuthorId
          });
        }
        // ★ 修复二：原来这里的 else { pollForAssistantReply(...) } 已删除
        //   （那是命令还没发就提前起的多余 poll，导致双 poll）

        // ── feed 模式：写入初始动态块 / 用户评论 ──
        if (feedMode) {
          // feed/comment 场景绝对不允许电话拦截器继续占用 MESSAGE_RECEIVED
          if (VV_CALL_INTERCEPTOR && VV_CALL_INTERCEPTOR.isActive && VV_CALL_INTERCEPTOR.isActive()) {
            console.warn('[VVHOST][FEED] call interceptor active before feed, force end');
            VV_CALL_INTERCEPTOR.end();
          }

          try {
            var ctx = getCtx();
            if (!ctx || !Array.isArray(ctx.chat)) throw new Error('ctx/chat not available');
            var chat = ctx.chat;

            var hostIdx = -1;
            for (var i = chat.length - 1; i >= 0; i--) {
              var mes = String(chat[i].mes || '');
              if (
                mes.includes('vv' + '手机') ||
                mes.includes('vvvital0312.github.io/') ||
                mes.includes('phone' + 'Frame') ||
                mes.includes('VV' + 'HOST') ||
                mes.includes('VV_FEED_HIDDEN_DATA')
              ) {
                hostIdx = i;
                break;
              }
            }

            if (hostIdx >= 0 && chat[hostIdx]) {
              var currentMes = String(chat[hostIdx].mes || '');

              if (feedMeta) {
                var pendingPostId = String(feedMeta.postId || '').trim();

                if (pendingPostId) {
                  pendingFeedPostIds[pendingPostId] = {
                    startedAt: Date.now(),
                    expiresAt: Date.now() + 120000
                  };

                  console.log('[VVHOST][FEED] pending feed post set:', pendingPostId);
                }

                var imageRefs = normalizeFeedImageRefs(
                  feedMeta.images ||
                  feedMeta.imageRefs ||
                  feedMeta.photos ||
                  feedMeta.mediaRefs ||
                  []
                );

                var imagesLine = imageRefs.length ? '\nimages=' + imageRefs.join(',') : '';
                var locationLine = feedMeta.location ? '\nlocation=' + feedMeta.location : '';

                // 如果有真实 images，就不要再写 photo=[图1:图片] 这种纯描述占位。
                // photo 更适合 AI 发动态时的“模拟图片描述”。
                var photoLine = '';

                if (!imageRefs.length && feedMeta.photoDesc) {
                  photoLine = '\nphoto=' + feedMeta.photoDesc;
                }

                var postIdTag = 'postId=' + feedMeta.postId;
                var hasExisting = currentMes.includes(postIdTag);

                if (!hasExisting) {
                  var feedContent = String(feedMeta.content || '').trim();

                  var initBlock = '';

                  // 普通用户发动态：有 content，正常写完整 [动态]
                  if (feedContent) {
                    initBlock =
                      '\n<div class="vv-feed-hidden" style="display:none">[VV_FEED_HIDDEN_DATA]\n' +
                      'postId=' + feedMeta.postId + '\n\n' +
                      '[动态]\n' +
                      'from=' + feedMeta.author + '\n' +
                      'time=' + feedMeta.time + '\n' +
                      'content=' + feedContent +
                      imagesLine + photoLine + locationLine + '\n' +
                      '[/动态]\n\n' +
                      '[/VV_FEED_HIDDEN_DATA]</div>';
                  } else {
                    // AI 主动发动态：此时 content 还没生成，不要写空 [动态]
                    // 只写一个空容器，等 AI 回复里的 [动态] 再补进去
                    initBlock =
                      '\n<div class="vv-feed-hidden" style="display:none">[VV_FEED_HIDDEN_DATA]\n' +
                      'postId=' + feedMeta.postId + '\n\n' +
                      '[/VV_FEED_HIDDEN_DATA]</div>';
                  }

                  currentMes = currentMes.trimEnd() + initBlock;
                }

                chat[hostIdx].mes = currentMes;
                try { ctx.saveChat(); } catch (e) {}
                console.log('[VVHOST] feed initial block written for', feedMeta.postId);
              }

              if (userInteraction) {
                currentMes = String(chat[hostIdx].mes || '');

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

                // 用户互动也先做去重
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

                  chat[hostIdx].mes = currentMes;
                  try { ctx.saveChat(); } catch (e) {}

                  console.log('[VVHOST] user interaction appended for', userInteraction.postId);
                } else {
                  console.warn('[VVHOST] target feed post not found for user interaction:', userInteraction.postId);
                }
              }
            }
          } catch (e) {
            console.warn('[VVHOST] feed pre-write error:', e);
          }

          const startedFeed = VV_FEED_INTERCEPTOR.start();
          console.log('[VVHOST] feed interceptor started:', startedFeed);
        }

        try {
          await runTriggerSlash(command);

          postToPhone({
            type: 'VV_EXECUTE_RESULT',
            requestId,
            ok: true,
            error: null,
            chatId: lastExpectedChatId || '',
            diaryId: lastExpectedDiaryId || '',
            authorId: lastExpectedDiaryAuthorId || '',
            viewId: lastViewId || ''
          });

          if (feedMode) {
            console.log('[VVHOST] feed mode, interceptor handles reply, skip normal polling');

            // feed 模式必须在 /send 后主动触发生成，否则需要手动重 roll。
            // 如果 command 已经自带 /trigger，就不要重复触发，避免双生成。
            if (!commandHasTrigger) {
              setTimeout(function () {
                console.log('[VVHOST][FEED] trigger generation after feed /send');
                triggerGenerationAfterSend();
              }, 800);
            } else {
              console.log('[VVHOST][FEED] command already has /trigger, skip extra generation');
            }

          } else if (callMode || (VV_CALL_INTERCEPTOR && VV_CALL_INTERCEPTOR.isActive && VV_CALL_INTERCEPTOR.isActive())) {
            console.log('[VVHOST][SUMMON] call mode active, skip normal chat polling');
            // 电话由 VV_CALL_INTERCEPTOR 接管，不走普通 VV_CHAT_SYNC

          } else if (diaryMode) {
            console.log('[VVHOST][DIARY] diary mode');
            // ★ 命令自带 /trigger 就不再补生成，避免双流掉字
            if (!commandHasTrigger) {
              setTimeout(function () { triggerGenerationAfterSend(); }, 800);
            } else {
              console.log('[VVHOST][DIARY] command already has /trigger, skip extra generation');
            }
            pollForAssistantReply(lastExpectedChatId, lastViewId, 120000, 'diary');

          } else if (annotationMode) {
            console.log('[VVHOST][ANNOTATION] annotation mode');
            // ★ 命令自带 /trigger 就不再补生成，避免双流掉字
            if (!commandHasTrigger) {
              setTimeout(function () { triggerGenerationAfterSend(); }, 800);
            } else {
              console.log('[VVHOST][ANNOTATION] command already has /trigger, skip extra generation');
            }
            pollForAssistantReply(lastExpectedChatId, lastViewId, 120000, 'annotation');

          } else {
            pollForAssistantReply(lastExpectedChatId, lastViewId);
          }
        } catch (err) {
          if (feedMode) VV_FEED_INTERCEPTOR.stop();
          postToPhone({
            type: 'VV_EXECUTE_RESULT',
            requestId,
            ok: false,
            error: String((err && err.message) || err || 'execute failed'),
            chatId: lastExpectedChatId || '',
            diaryId: lastExpectedDiaryId || '',
            authorId: lastExpectedDiaryAuthorId || '',
            viewId: lastViewId || ''
          });
        }
        return;
      }

      if (data.type === 'VV_RAW_LLM_REPLY') {
        const rawText = String(data.raw || '');
        const chatIdFromData = String(data.chatId || '').trim();
        const viewId = String(data.viewId || '').trim();
        const expectedChatId = chatIdFromData || lastExpectedChatId || '';

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
          // 正常 feedMode 由 VV_FEED_INTERCEPTOR 写入 hidden raw。
          // 这里只作为提示打开 feed 页面，不再直接把 VVPHONE_FEED_SYNC 发给手机，避免双来源重复。
          openFeedPageOnPhone('raw-llm-feed-sync');
          handled = true;
        }

        if (!handled) {
          console.log('[VVHOST][SUMMON] VV_RAW_LLM_REPLY has no valid sync block');
        }
        return;
      }

      if (data.type === 'VV_REQUEST_FEED_REFRESH') {
        var ctxF = getCtx();

        if (!ctxF || !Array.isArray(ctxF.chat)) {
          console.warn('[VVHOST] feed refresh: ctx/chat not available');
          return;
        }

        for (var fi = 0; fi < ctxF.chat.length; fi++) {
          if (ctxF.chat[fi].mes && ctxF.chat[fi].mes.includes('VV_FEED_HIDDEN_DATA')) {
            pushFeedHiddenRawToPhone(ctxF.chat[fi].mes, 'feed-refresh');
            console.log('[VVHOST] feed refresh sent, length:', ctxF.chat[fi].mes.length);
            break;
          }
        }

        return;
      }

      if (data.type === 'VVPHONE_RESEND_LAST_CHAT_SYNC') {
        const chatId = String(data.chatId || '').trim();
        const viewId = String(data.viewId || '').trim();

        if (!lastVVChatSyncRaw) {
          console.log('[VVHOST][SUMMON] no cached sync for resend');
          return;
        }

        if (chatId && !lastVVChatSyncRaw.includes('chatId=' + chatId)) {
          console.log('[VVHOST][SUMMON] cached sync chatId mismatch, skip resend');
          return;
        }

        postChatSyncToPhone(lastVVChatSyncRaw, chatId || lastExpectedChatId || '', viewId || lastViewId || '');
        return;
      }
    } catch (err) {
      console.warn('[VVHOST][SUMMON] message handler error:', err);
    }
  }, false);


  // ========== 监听所有楼层 hidden data 变化，自动推给手机页 ==========
  (function initFeedHiddenDataWatcher() {
    var lastFeedRaw = '';
    var watchInterval = 5000;

    function collectAllFeedHiddenRaw() {
      var ctx = getCtx();

      if (!ctx || !Array.isArray(ctx.chat)) return '';

      var allBlocks = [];
      var seen = {};

      for (var i = 0; i < ctx.chat.length; i++) {
        var mes = String(ctx.chat[i].mes || '');

        if (
          !mes.includes('[VV_FEED_HIDDEN_DATA]') ||
          !mes.includes('[/VV_FEED_HIDDEN_DATA]')
        ) {
          continue;
        }

        var blocks = mes.match(/\[VV_FEED_HIDDEN_DATA\][\s\S]*?\[\/VV_FEED_HIDDEN_DATA\]/g) || [];

        blocks.forEach(function (block) {
          block = String(block || '').trim();
          if (!block) return;

          // 用 postId 优先去重，避免同一条动态在多个楼层重复出现。
          var postIdMatch = block.match(/(?:^|\n)\s*postId\s*=\s*([^\n\r]+)/i);
          var postId = postIdMatch ? String(postIdMatch[1] || '').trim() : '';

          var key = postId ? ('postId:' + postId) : ('raw:' + block);

          // 如果同 postId 出现多次，用后扫到的覆盖前面的。
          // 这样后面的更新版本可以替换前面的旧版本。
          if (seen[key] !== undefined) {
            allBlocks[seen[key]] = block;
          } else {
            seen[key] = allBlocks.length;
            allBlocks.push(block);
          }
        });
      }

      if (!allBlocks.length) return '';

      return allBlocks.join('\n\n');
    }

    setInterval(function () {
      try {
        var now = Date.now();

        Object.keys(pendingFeedPostIds).forEach(function (id) {
          var item = pendingFeedPostIds[id];

          if (!item || item.expiresAt < now) {
            delete pendingFeedPostIds[id];
            console.log('[VVHOST][FEED] pending feed post expired:', id);
          }
        });

        var currentRaw = collectAllFeedHiddenRaw();

        if (!currentRaw) return;

        var hiddenSig = getFeedHiddenSig(currentRaw);

        if (!hiddenSig) return;

        if (hiddenSig === lastFeedRaw) return;

        // 如果某条用户新动态正在等待 AI 互动回复，watcher 不要提前把半成品动态推给手机。
        // 否则手机会先渲染一条“无 AI 回复”的动态，稍后又收到完整版本。
        if (rawContainsPendingFeedPost(currentRaw)) {
          console.log('[VVHOST][FEED_WATCHER] skip pending feed post raw before AI reply');
          return;
        }

        // 如果这份 hidden raw 刚刚已经由 feed-interceptor / append 主动推过，
        // watcher 不要再补发一次。
        if (
          currentRaw === lastPushedFeedHiddenRaw ||
          hiddenSig === lastPushedFeedHiddenSig
        ) {
          lastFeedRaw = hiddenSig;
          console.log('[VVHOST][FEED_WATCHER] skip duplicated pushed hidden raw');
          return;
        }

        lastFeedRaw = hiddenSig;

        console.log(
          '[VVHOST][FEED_WATCHER] all hidden data changed, pushing to phone, length=',
          currentRaw.length
        );

        pushFeedHiddenRawToPhone(currentRaw, 'feed-watcher-rescan');

        // 顺便请求手机切到动态页。手机端如果不需要，会自己忽略。
        openFeedPageOnPhone('feed-watcher-rescan');
      } catch (err) {
        console.warn('[VVHOST][FEED_WATCHER] error:', err);
      }
    }, watchInterval);

    console.log('[VVHOST] feed hidden data watcher started, aggregate mode, interval=' + watchInterval + 'ms');
  })();

  function buildAiFeedHiddenBlock(payload) {
    if (!payload) return '';

    var postId = String(payload.postId || ('f' + Date.now())).trim();
    var from = String(payload.from || '').trim();
    var bridgeName = String(payload.bridgeName || from || '').trim();
    var time = String(payload.time || '').trim();
    var content = String(payload.content || '').trim();

    if (!from || !content) return '';

    var photoLine = '';

    if (Array.isArray(payload.photos) && payload.photos.length) {
      var photoText = payload.photos.map(function (p, idx) {
        return '[图' + (idx + 1) + ':' + String((p && p.desc) || '图片').trim() + ']';
      }).join('');
      photoLine = '\nphoto=' + photoText;
    }

    return (
      '\n<div class="vv-feed-hidden" style="display:none">[VV_FEED_HIDDEN_DATA]\n' +
      'postId=' + postId + '\n\n' +
      '[动态]\n' +
      'from=' + from + '\n' +
      'bridgeName=' + bridgeName + '\n' +
      'time=' + time + '\n' +
      'content=' + content +
      photoLine + '\n' +
      '[/动态]\n\n' +
      '[/VV_FEED_HIDDEN_DATA]</div>\n'
    );
  }

  function appendAiFeedPostToHostHidden(payload, reason) {
    payload = payload || {};

    var postId = String(payload.postId || '').trim();
    if (!postId) return false;

    var ctx = getCtx();

    if (!ctx || !Array.isArray(ctx.chat)) {
      console.warn('[VVHOST][AI_FEED] ctx/chat not available');
      return false;
    }

    var hostIdx = findFeedHostMessageIndex();

    if (hostIdx < 0 || !ctx.chat[hostIdx]) {
      console.warn('[VVHOST][AI_FEED] host message not found');
      return false;
    }

    var currentMes = String(ctx.chat[hostIdx].mes || '');

    if (hasHiddenFeedPost(currentMes, postId)) {
      console.log('[VVHOST][AI_FEED] duplicated hidden postId, skip write:', postId);
      pushFeedHiddenRawToPhone(currentMes, reason || 'ai-feed-duplicate-push');
      openFeedPageOnPhone(reason || 'ai-feed-duplicate-push');
      return true;
    }

    var hiddenBlock = buildAiFeedHiddenBlock(payload);

    if (!hiddenBlock) {
      console.warn('[VVHOST][AI_FEED] empty hidden block');
      return false;
    }

    currentMes = currentMes.trimEnd() + '\n' + hiddenBlock;

    ctx.chat[hostIdx].mes = currentMes;

    try {
      if (typeof ctx.saveChat === 'function') {
        ctx.saveChat();
      }
    } catch (e) {
      console.warn('[VVHOST][AI_FEED] saveChat failed:', e);
    }

    console.log('[VVHOST][AI_FEED] written to hidden data:', postId, reason || '');

    pushFeedHiddenRawToPhone(currentMes, reason || 'ai-feed-post');

    openFeedPageOnPhone(reason || 'ai-feed-post');

    return true;
  }

  function extractAiFeedPostBlock(text) {
    var raw = String(text || '');

    var match = raw.match(/\[VV_AI_FEED_POST\]([\s\S]*?)\[\/VV_AI_FEED_POST\]/i);
    if (!match) return null;

    var block = String(match[1] || '');

    function getField(key) {
      key = String(key || '');

      // 支持：
      // key=value
      // value 可以跨行，直到下一个 字段= 或结束
      var re = new RegExp(
        '(?:^|\\n)\\s*' + key + '\\s*=\\s*([\\s\\S]*?)(?=\\n\\s*(?:from|bridgeName|postId|time|content|photo|images|location)\\s*=|$)',
        'i'
      );

      var m = block.match(re);
      return m ? String(m[1] || '').trim() : '';
    }

    var from = getField('from');
    var bridgeName = getField('bridgeName') || from;
    var postId = getField('postId') || ('f' + Date.now());
    var time = getField('time');
    var content = getField('content');
    var photoRaw = getField('photo');

    // 兜底：如果 content 被解析空，但原文里有 content=，用单行兜底再抓一次
    if (!content) {
      var cm = block.match(/(?:^|\n)\s*content\s*=\s*([^\n\r]*)/i);
      if (cm) content = String(cm[1] || '').trim();
    }

    // 再兜底：如果 content 仍然空，不要让它写入空动态
    if (!from || !content) {
      console.warn('[VVHOST][AI_FEED] invalid AI feed post, missing from/content:', {
        from: from,
        postId: postId,
        content: content,
        block: block
      });
      return null;
    }

    var photos = [];

    if (photoRaw) {
      var photoMatches = Array.from(photoRaw.matchAll(/\[图\d+:(.*?)\]/g));
      photos = photoMatches.map(function (m) {
        return {
          simulated: true,
          desc: String(m[1] || '').trim()
        };
      });
    }

    return {
      from: from,
      bridgeName: bridgeName,
      postId: postId,
      time: time,
      content: content,
      photos: photos,
      photoRaw: photoRaw
    };
  }

  function hasHiddenFeedPost(currentMes, postId) {
    currentMes = String(currentMes || '');
    postId = String(postId || '').trim();
    if (!postId) return false;

    var blocks = currentMes.match(/\[VV_FEED_HIDDEN_DATA\][\s\S]*?\[\/VV_FEED_HIDDEN_DATA\]/g) || [];

    return blocks.some(function (block) {
      return block.includes('postId=' + postId);
    });
  }
})();