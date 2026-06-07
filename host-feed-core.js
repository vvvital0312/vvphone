(function () {
  if (window.__VV_HOST_FEED_CORE_INSTALLED__) {
    console.log('[VVHOST_FEED] core already installed, skip');
    return;
  }
  window.__VV_HOST_FEED_CORE_INSTALLED__ = true;

  const config = window.VV_HOST_CONFIG || {};

  const VVHOST_VERSION = config.version || 'FEED-CALL-INTERCEPT-002';
  const PHONE_ORIGIN = config.phoneOrigin || 'https://vvvital0312.github.io';
  const PHONE_FRAME_ID = config.phoneFrameId || 'phoneFrame';
  const HOST_TYPE = config.hostType || 'feed';

  let lastExpectedChatId = '';
  let lastVVChatSyncRaw = '';
  let lastViewId = '';
  let lastPushedFeedHiddenRaw = '';
  let lastPushedFeedHiddenSig = '';
  let pendingFeedInteraction = null;

  function getFeedHiddenSig(raw) {
    raw = String(raw || '');

    var hiddenMatch = raw.match(
      /(<div class="vv-feed-hidden"[\s\S]*?<\/div>)/g
    );

    return hiddenMatch ? hiddenMatch.join('') : raw;
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

  console.log('[VVHOST_FEED] loaded external core', location.href, 'version:', VVHOST_VERSION);
  console.log('[VVHOST_FEED] config:', {
    HOST_TYPE,
    PHONE_ORIGIN,
    PHONE_FRAME_ID,
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
        console.warn('[VVHOST_FEED] phoneFrame not ready:', PHONE_FRAME_ID);
        return false;
      }

      frame.contentWindow.postMessage(payload, PHONE_ORIGIN);
      console.log('[VVHOST_FEED][postToPhone]', payload.type, payload);
      return true;
    } catch (err) {
      console.warn('[VVHOST_FEED] postToPhone failed:', err);
      return false;
    }
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

  function convertWrongCallSyncToFeedInteractionRaw(rawContent) {
    rawContent = String(rawContent || '');

    if (!pendingFeedInteraction) return rawContent;
    if (!pendingFeedInteraction.postId) return rawContent;

    if (Date.now() > pendingFeedInteraction.expiresAt) {
      console.log('[VVHOST][FEED] pending interaction expired');
      pendingFeedInteraction = null;
      return rawContent;
    }

    if (!rawContent.includes('[VV_CALL_SYNC]') || !rawContent.includes('[/VV_CALL_SYNC]')) {
      return rawContent;
    }

    var callMatch = rawContent.match(/\[VV_CALL_SYNC\]([\s\S]*?)\[\/VV_CALL_SYNC\]/i);
    if (!callMatch) return rawContent;

    var callBlock = String(callMatch[1] || '');

    var speaker = '';
    var content = '';

    var talkMatch = callBlock.match(/\[通话\]([\s\S]*?)(?=\[通话\]|$)/i);

    if (talkMatch) {
      var talkBlock = String(talkMatch[1] || '');

      var speakerM = talkBlock.match(/(?:^|\n)\s*speaker\s*=\s*([^\n\r]+)/i);
      var contentM = talkBlock.match(/(?:^|\n)\s*content\s*=\s*([\s\S]*?)(?=\n\s*(?:speaker|callPhase|chatId|target|time)\s*=|$)/i);

      speaker = speakerM ? String(speakerM[1] || '').trim() : '';
      content = contentM ? String(contentM[1] || '').trim() : '';
    }

    // 兜底：如果没有 [通话] 块，尝试抓 content=
    if (!content) {
      var fallbackContentM = callBlock.match(/(?:^|\n)\s*content\s*=\s*([\s\S]*?)(?=\n\s*(?:speaker|callPhase|chatId|target|time)\s*=|$)/i);
      content = fallbackContentM ? String(fallbackContentM[1] || '').trim() : '';
    }

    if (!speaker) {
      var targetM = callBlock.match(/(?:^|\n)\s*target\s*=\s*([^\n\r]+)/i);
      speaker = targetM ? String(targetM[1] || '').trim() : '';
    }

    if (!speaker) speaker = pendingFeedInteraction.targetName || '角色';
    if (!content) {
      console.warn('[VVHOST][FEED] wrong call sync has no content, cannot convert');
      return rawContent;
    }

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
      replyTo: replyTo,
      content: content
    });

    return converted;
  }

  var VV_CALL_INTERCEPTOR = (function () {
    var isCallActive = false;
    var callTargetName = '';
    var callChatId = '';
    var callStartTime = '';
    var callTranscriptLines = [];
    var callRawBlocks = [];
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
          text.includes('vvvital0312.github.io') ||
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

    function buildTranscriptText() {
      var text = 'call target:' + callTargetName + '\n';
      text += 'chatId:' + callChatId + '\n';
      text += 'call time:' + callStartTime + '\n';
      text += 'status:' + (isCallActive ? 'active' : 'ended') + '\n';
      text += '---\n';

      callTranscriptLines.forEach(function (line) {
        if (line.side === 'right') {
          text += 'user: ' + line.content + '\n';
        } else {
          text += (line.speaker || callTargetName || '对方') + ': ' + line.content + '\n';
        }
      });

      return text;
    }

    function appendCallDataToHostMessage() {
      var ctx = getCtx();
      if (!ctx || !Array.isArray(ctx.chat) || hostMessageIndex < 0) return false;

      var msg = ctx.chat[hostMessageIndex];
      if (!msg) return false;

      var currentMes = String(msg.mes || '');

      // 清掉旧电话 hidden，避免重复膨胀
      currentMes = currentMes.replace(
        /<div class="vv-call-hidden"[\s\S]*?<\/div>/g,
        ''
      );

      currentMes = currentMes.replace(
        /\[VV_CALL_HIDDEN_DATA\][\s\S]*?\[\/VV_CALL_HIDDEN_DATA\]/g,
        ''
      );

      var hiddenText =
        '[VV_CALL_HIDDEN_DATA]\n' +
        'chatId=' + (callChatId || '') + '\n' +
        'target=' + (callTargetName || '') + '\n' +
        'time=' + (callStartTime || '') + '\n\n' +
        '[CALL_TRANSCRIPT]\n' +
        buildTranscriptText().trim() + '\n' +
        '[/CALL_TRANSCRIPT]\n\n';

      if (callRawBlocks.length > 0) {
        hiddenText += callRawBlocks.join('\n\n') + '\n';
      }

      hiddenText += '[/VV_CALL_HIDDEN_DATA]';

      var hiddenBlock =
        '\n<div class="vv-call-hidden" style="display:none">' +
        hiddenText +
        '</div>\n';

      msg.mes = currentMes.trimEnd() + hiddenBlock;

      try {
        if (typeof ctx.saveChat === 'function') {
          ctx.saveChat();
        }
      } catch (e) {}

      console.log('[CALL_INTERCEPT] call data appended to host msg (index:' + hostMessageIndex + ')');
      return true;
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
      callRawBlocks = [];
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

      appendCallDataToHostMessage();

      onCallMessageCallback = null;
      processedMessageIds = {};

      console.log('[CALL_INTERCEPT] call intercept stopped');
    }

    function addUserCallLines(userLines) {
      if (!isCallActive) return;

      if (!Array.isArray(userLines)) userLines = [userLines];

      userLines.forEach(function (line) {
        if (line && line.trim()) {
          callTranscriptLines.push({
            side: 'right',
            speaker: 'user',
            content: line.trim()
          });
        }
      });

      appendCallDataToHostMessage();
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

      // 电话拦截器只处理电话同步
      if (!rawContent.includes('[VV_CALL_SYNC]') || !rawContent.includes('[/VV_CALL_SYNC]')) {
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

      // 保存本轮原始 VV_CALL_SYNC 到一楼 hidden data
      var callBlockMatch = rawContent.match(/\[VV_CALL_SYNC\][\s\S]*?\[\/VV_CALL_SYNC\]/i);
      var callBlock = callBlockMatch ? String(callBlockMatch[0] || '').trim() : rawContent.trim();

      if (callBlock && callRawBlocks.indexOf(callBlock) < 0) {
        callRawBlocks.push(callBlock);
      }

      if (parsed && parsed.messages && parsed.messages.length) {
        parsed.messages.forEach(function (m) {
          var text = String(m.content || m.text || '').trim();
          if (!text) return;

          callTranscriptLines.push({
            side: 'left',
            speaker: m.speaker || parsed.target || callTargetName,
            content: text
          });
        });

        appendCallDataToHostMessage();
      } else {
        appendCallDataToHostMessage();
      }

      if (typeof onCallMessageCallback === 'function') {
        try {
          onCallMessageCallback(parsed);
        } catch (e) {
          console.warn('[CALL_INTERCEPT] onMessage callback failed:', e);
        }
      }

      // 延迟删除，避开酒馆 finalize
      setTimeout(function () {
        safeDeleteCallFloors(messageIndex);
      }, 500);

      setTimeout(function () {
        safeDeleteCallFloors(messageIndex);
      }, 1500);
    }

    async function safeDeleteCallFloors(aiMessageIndex) {
      var ctx = getCtx();
      if (!ctx || !Array.isArray(ctx.chat)) return;

      var root = getRoot();
      var doc = root && root.document ? root.document : document;

      console.log('[CALL_INTERCEPT] start deleting floors, aiIndex:', aiMessageIndex, 'total:', ctx.chat.length);

      var toDelete = [];

      for (var i = ctx.chat.length - 1; i >= 0; i--) {
        var m = ctx.chat[i];
        if (!m) continue;

        if (i === hostMessageIndex) continue;

        var mesText = String(m.mes || '');

        // 删除 AI 回复楼层
        if (!m.is_user) {
          if (
            mesText.includes('[VV_CALL_SYNC]') ||
            mesText.includes('[/VV_CALL_SYNC]')
          ) {
            // 避免误删宿主 hidden 楼层
            if (!mesText.includes('VV_CALL_HIDDEN_DATA') && !mesText.includes('vv-call-hidden')) {
              toDelete.push(i);
              continue;
            }
          }
        }

        // 删除 slash 指令楼层，如果它还可见
        if (m.is_user) {
          if (
            mesText.includes('电话模式') ||
            mesText.includes('VV_CALL') ||
            mesText.includes('VV_EVENT') ||
            mesText.includes('通话阶段') ||
            mesText.includes('callPhase') ||
            mesText.includes('手机电话通话事件') ||
            mesText.includes('/inject id=vv_call')
          ) {
            toDelete.push(i);
            continue;
          }
        }

        // 只看最近几层，避免误删历史
        if (ctx.chat.length - 1 - i > 10) break;
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
          // 先删 DOM
          var selectors = [
            '[mesid="' + delIndex + '"]',
            '.mes[mesid="' + delIndex + '"]',
            '#chat .mes[mesid="' + delIndex + '"]',
            '[data-message-id="' + delIndex + '"]',
            '.mes[data-message-id="' + delIndex + '"]'
          ];

          selectors.forEach(function (selector) {
            try {
              var nodes = doc.querySelectorAll(selector);
              nodes.forEach(function (domEl) {
                if (!domEl) return;
                domEl.style.display = 'none';
                domEl.remove();
                console.log('[CALL_INTERCEPT] DOM removed:', selector);
              });
            } catch (e) {}
          });

          // 再删 chat 数组
          if (ctx.chat[delIndex]) {
            ctx.chat.splice(delIndex, 1);
            console.log('[CALL_INTERCEPT] chat array removed index:', delIndex);
          }
        } catch (e) {
          console.error('[CALL_INTERCEPT] delete floor error:', e);
        }
      }

      // 重新编号 DOM mesid
      try {
        var allMes = doc.querySelectorAll('#chat .mes');
        allMes.forEach(function (el, idx) {
          el.setAttribute('mesid', idx);
        });
      } catch (e) {
        console.warn('[CALL_INTERCEPT] re-index mesid failed:', e);
      }

      // 重新定位宿主楼层
      hostMessageIndex = findHostMessageIndex();
      console.log('[CALL_INTERCEPT] re-located host msg floor:', hostMessageIndex);

      try {
        if (typeof ctx.saveChat === 'function') {
          ctx.saveChat();
        }
      } catch (e) {}

      console.log('[CALL_INTERCEPT] deletion done, remaining floors:', ctx.chat.length);
    }

    function parseCallResponse(raw) {
      var result = {
        callPhase: '',
        chatId: '',
        target: '',
        messages: [],
        raw: raw || ''
      };

      if (!raw) return result;

      var syncMatch = raw.match(/\[VV_CALL_SYNC\]([\s\S]*?)\[\/VV_CALL_SYNC\]/i);

      if (syncMatch) {
        var block = syncMatch[1];

        var phaseMatch = block.match(/(?:^|\n)\s*callPhase\s*=\s*(.+)/i);
        var chatIdMatch = block.match(/(?:^|\n)\s*chatId\s*=\s*(.+)/i);
        var targetMatch = block.match(/(?:^|\n)\s*target\s*=\s*(.+)/i);
        var timeMatch = block.match(/(?:^|\n)\s*time\s*=\s*(.+)/i);

        result.callPhase = phaseMatch ? phaseMatch[1].trim().toLowerCase() : '';
        result.chatId = chatIdMatch ? chatIdMatch[1].trim() : callChatId || '';
        result.target = targetMatch ? targetMatch[1].trim() : callTargetName || '';
        result.time = timeMatch ? timeMatch[1].trim() : '';

        var talkRegex = /\[通话\]([\s\S]*?)(?=\[通话\]|\[\/VV_CALL_SYNC\]|$)/gi;
        var m;

        while ((m = talkRegex.exec(block)) !== null) {
          var talkBlock = String(m[1] || '');

          var speakerM = talkBlock.match(/(?:^|\n)\s*speaker\s*=\s*([^\n\r]+)/i);
          var contentM = talkBlock.match(
            /(?:^|\n)\s*content\s*=\s*([\s\S]*?)(?=\n\s*(?:speaker|callPhase|chatId|target|time)\s*=|\n\s*\[通话\]|\s*$)/i
          );

          var speaker = speakerM ? speakerM[1].trim() : result.target || callTargetName || '对方';
          var content = contentM ? contentM[1].trim() : '';

          if (content) {
            result.messages.push({
              speaker: speaker,
              content: content,
              text: content
            });
          }
        }

        return result;
      }

      // 兜底：普通冒号对话
      var lines = raw.split('\n').filter(function (l) { return l.trim(); });

      lines.forEach(function (line) {
        var colonMatch = line.trim().match(/^(.{1,20})[：:]\s*(.+)$/);
        if (colonMatch) {
          var speaker = colonMatch[1].trim();
          var text = colonMatch[2].trim();

          if (speaker && text && speaker !== '用户' && speaker !== '我' && speaker !== '你') {
            result.messages.push({
              speaker: speaker,
              content: text,
              text: text
            });
          }
        }
      });

      if (result.messages.length > 0) {
        result.callPhase = 'reply';
        result.chatId = callChatId || '';
        result.target = callTargetName || '';
      }

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

  var VV_FEED_INTERCEPTOR = (function () {
    var isActive = false;
    var hostMessageIndex = -1;
    var eventHandler = null;
    var processedMessageIds = {};

    function findHostMessageIndex() {
      var ctx = getCtx();
      if (!ctx) return -1;
      for (var i = ctx.chat.length - 1; i >= 0; i--) {
        var msg = ctx.chat[i];
        if (!msg) continue;
        var text = String(msg.mes || '');
        if (
            text.includes('VV_FEED_HIDDEN_DATA') ||
            text.includes('vv' + '手机') ||
            text.includes('vv' + 'phone') ||
            text.includes('vvvital0312.github.io/' + 'vvphone') ||
            text.includes('vvvital0312.github.io') ||
            text.includes('phone' + 'Frame') ||
            text.includes('VV' + 'HOST')
        ) {
          console.log('[FEED_INTERCEPT] found host msg, index:', i);
          return i;
        }
      }
      for (var j = ctx.chat.length - 1; j >= 0; j--) {
        var m = ctx.chat[j];
        if (m && !m.is_user) {
          console.log('[FEED_INTERCEPT] fallback: using latest AI msg, index:', j);
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

      if (!rawContent.includes('[VV_FEED_SYNC]')) {
        console.warn('[FEED_INTERCEPT] no VV_FEED_SYNC in reply, skipping');
        return;
      }

      // 先转发给手机页。手机端自己也会做去重。
      //postFeedSyncToPhone(rawContent, '');

      try {
        var hostMsg = ctx.chat[hostMessageIndex];

        if (!hostMsg) {
          console.warn('[FEED_INTERCEPT] host message not found, index:', hostMessageIndex);
          await safeDeleteFeedFloor(messageIndex);
          return;
        }

        var currentMes = String(hostMsg.mes || '');

        // 提取第一个 [动态] 块
        var postBlockMatch = rawContent.match(/\[动态\][\s\S]*?\[\/动态\]/);

        // 提取所有 [互动]，并基于当前 hidden data 去重
        var rawInteractionBlocks = rawContent.match(/\[互动\][\s\S]*?\[\/互动\]/g) || [];
        var interactionBlocks = dedupeInteractionBlocksForAppend(currentMes, rawInteractionBlocks);

        // 从 AI 回复里提取 postId
        var postIdMatch =
          rawContent.match(/(?:^|\n)\s*postId\s*=\s*([^\n\r]+)/i) ||
          rawContent.match(/postId\s*=\s*([^\s\n\r]+)/i);

        var targetPostId = postIdMatch ? String(postIdMatch[1] || '').trim() : '';

        // 没有动态块，也没有新的互动块，就不写 hidden data
        if (!postBlockMatch && interactionBlocks.length === 0) {
          console.log('[FEED_INTERCEPT] no new [动态] or [互动] blocks after dedupe');
          await safeDeleteFeedFloor(messageIndex);
          return;
        }

        var changed = false;

        if (targetPostId && currentMes.includes('postId=' + targetPostId)) {
          // 找到对应 postId：插入到这个 postId 所在的 hidden block 末尾
          var parts = currentMes.split('[/VV_FEED_HIDDEN_DATA]');
          var inserted = false;

          for (var p = 0; p < parts.length - 1; p++) {
            if (parts[p].includes('postId=' + targetPostId) && !inserted) {
              var appendText = '';

              if (postBlockMatch) {
                var newPostBlock = postBlockMatch[0];

                var existingDynamicMatch = parts[p].match(/\[动态\][\s\S]*?\[\/动态\]/);
                var existingDynamicBlock = existingDynamicMatch ? existingDynamicMatch[0] : '';

                function readDynamicContent(dynamicBlock) {
                  dynamicBlock = String(dynamicBlock || '');
                  var m = dynamicBlock.match(
                    /(?:^|\n)\s*content\s*=\s*([\s\S]*?)(?=\n\s*(?:photo|images|location|bridgeName|time|from)\s*=|\n\s*\[\/动态\]|$)/i
                  );
                  return m ? String(m[1] || '').trim() : '';
                }

                var oldContent = readDynamicContent(existingDynamicBlock);
                var newContent = readDynamicContent(newPostBlock);

                if (!existingDynamicBlock) {
                  appendText += '\n' + newPostBlock + '\n';
                  console.log('[VVHOST_FEED_FIX] appended new [动态] for postId:', targetPostId);
                } else if (!oldContent && newContent) {
                  parts[p] = parts[p].replace(/\[动态\][\s\S]*?\[\/动态\]/, newPostBlock);
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

              if (appendText.trim()) {
                parts[p] = parts[p] + appendText;
                inserted = true;
                changed = true;
              } else {
                console.log('[VVHOST_FEED_DEDUPE] nothing new to append for postId:', targetPostId);
              }
            }
          }

          currentMes = parts.join('[/VV_FEED_HIDDEN_DATA]');
        } else {
          // 找不到对应 postId：追加到最后一个 hidden block 的闭合标签前
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
              // 极端兜底：如果当前楼层没有 hidden data，就新建一个
              var fallbackPostId = targetPostId || ('feed_' + Date.now());

              currentMes =
                currentMes.trimEnd() +
                '\n<div class="vv-feed-hidden" style="display:none">[VV_FEED_HIDDEN_DATA]\n' +
                'postId=' + fallbackPostId + '\n' +
                fallbackAppendText +
                '\n[/VV_FEED_HIDDEN_DATA]</div>';
            }

            changed = true;
          } else {
            console.log('[VVHOST_FEED_DEDUPE] fallback nothing new to append');
          }
        }

        if (changed) {
          hostMsg.mes = currentMes;

          var saveCtx = getCtx();
          if (saveCtx && typeof saveCtx.saveChat === 'function') {
            try { saveCtx.saveChat(); } catch (e) {}
          }

          console.log('[FEED_INTERCEPT] appended feed sync for postId:', targetPostId);

          // 写入成功后，把完整 hidden raw 发给手机页
          pushFeedHiddenRawToPhone(currentMes, 'feed-intercept-append');

          if (postBlockMatch) {
            postToPhone({
              type: 'VV_OPEN_FEED',
              reason: 'ai_feed_post',
              postId: targetPostId || ''
            });
          }
        } else {
          console.log('[FEED_INTERCEPT] no hidden data changed, skip save/post');
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
  
  console.log('[VVHOST_FEED] VV_CALL_INTERCEPTOR loaded (no-container mode v2)');

  function extractChatIdFromCommand(command) {
    const raw = String(command || '');
    const m =
      raw.match(/(?:^|\n)\s*聊天ID\s*[:：]\s*([^\n\r]+)/i) ||
      raw.match(/(?:^|\n)\s*chatId\s*[=:]\s*([^\n\r]+)/i);
    return m ? String(m[1] || '').trim() : '';
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

  function getSTChat() {
    try {
      var ctx = getCtx();
      if (ctx && Array.isArray(ctx.chat)) return ctx.chat;
    } catch (e) {}

    try {
      var root = getRoot();
      if (root && Array.isArray(root.chat)) return root.chat;
    } catch (e) {}

    return null;
  }

  function pollForAssistantReply(chatId, viewId, timeout) {
    if (VV_CALL_INTERCEPTOR.isActive()) {
      console.log('[VVHOST_FEED] call interceptor active, skip polling');
      return;
    }

    timeout = timeout || 120000;
    const started = Date.now();
    const chatArr = getSTChat();
    const beforeLength = chatArr ? chatArr.length : 0;

    console.log('[VVHOST_FEED] pollForAssistantReply start',
      'chatId=', chatId,
      'beforeLength=', beforeLength
    );

    if (!chatArr) {
      console.warn('[VVHOST_FEED] poll: chat not accessible, abort');
      return;
    }

    const timer = setInterval(function () {
      if (VV_CALL_INTERCEPTOR.isActive()) {
        console.log('[VVHOST_FEED] poll: call started, stop polling');
        clearInterval(timer);
        return;
      }

      try {
        const chat = getSTChat();
        if (!chat) {
          console.warn('[VVHOST_FEED] poll: chat lost');
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

          // ★ 新增调试日志：看看到底扫到了什么
          if (text.includes('[VV_CHAT_SYNC]')) {
            console.log('[VVHOST_FEED] poll: found VV_CHAT_SYNC tag at index=', i,
              'has_close_tag=', text.includes('[/VV_CHAT_SYNC]'),
              'length=', text.length
            );
          }

          const incomingBlock = extractIncomingCallBlock(text);
          if (incomingBlock) {
            console.log('[VVHOST_FEED] poll FOUND incoming call in index=', i);
            postIncomingCallToPhone(incomingBlock, viewId);
          }

          const callBlock = extractValidVVCallSyncBlock(text);
          if (callBlock) {
            console.log('[VVHOST_FEED] poll FOUND call sync in index=', i);
            postCallSyncToPhone(callBlock, chatId, viewId);
            if (!text.includes('[VV_CHAT_SYNC]')) {
              clearInterval(timer);
              return;
            }
          }

          const block = extractValidVVChatSyncBlock(text, chatId);
          if (block) {
            clearInterval(timer);
            console.log('[VVHOST_FEED] poll FOUND chat sync in index=', i);
            postChatSyncToPhone(block, chatId, viewId);
            return;
          }

          const feedBlock = extractValidVVFeedSyncBlock(text);
          if (feedBlock) {
            clearInterval(timer);
            console.log('[VVHOST_FEED] poll FOUND feed sync in index=', i);
            postFeedSyncToPhone(feedBlock, viewId);
            return;
          }
        }

        console.log('[VVHOST_FEED] poll: no sync yet',
          'total=', chat.length,
          'new=', chat.length - beforeLength,
          'scanStart=', scanStart,
          'elapsed=', Date.now() - started
        );
      } catch (err) {
        console.error('[VVHOST_FEED] poll error:', err);
      }

      if (Date.now() - started > timeout) {
        clearInterval(timer);
        console.warn('[VVHOST_FEED] poll timeout after', timeout, 'ms');
      }
    }, 1500);
  }

  async function runTriggerSlash(command) {
    console.log('[VVHOST_FEED] runTriggerSlash called');

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

  console.log('[VVHOST_FEED] VV_RP_COMMAND loaded');

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
          //if (!msg.is_user && text.includes('[VV_AI_FEED_POST]') && text.includes('[/VV_AI_FEED_POST]')) {
            //console.log('[VVHOST][AI_FEED] detected VV_AI_FEED_POST in AI msg at index', i);

            //var aiPostBlock = extractAiFeedPostBlock(text);
            //if (aiPostBlock) {
              //postToPhone({
                //type: 'VV_AI_FEED_POST',
                //payload: aiPostBlock
              //});
              //console.log('[VVHOST][AI_FEED] sent VV_AI_FEED_POST to phone:', aiPostBlock);
            //}
          //}
        }

        lastCheckedIndex = chat.length - 1;

      } catch (err) {
        console.error('[VVHOST][RP_POLL] error:', err);
      }
    }

    setInterval(checkForNewUserMessage, pollInterval);
    console.log('[VVHOST_FEED] user input POLLER registered (interval=' + pollInterval + 'ms)');
  })();

  // ========== AI 主动发动态检测（内容变化检测，不依赖新增楼层）==========
  (function initAiFeedPostDetector() {
    var processedPostIds = {};

    setInterval(function () {
      try {
        var chat = getSTChat();
        if (!chat || chat.length === 0) return;

        // 只扫最近5条AI消息
        for (var i = chat.length - 1; i >= Math.max(0, chat.length - 5); i--) {
          var msg = chat[i];
          if (!msg || msg.is_user) continue;

          var text = String(msg.mes || '');
          if (!text.includes('[VV_AI_FEED_POST]') || !text.includes('[/VV_AI_FEED_POST]')) continue;

          // 提取 postId 用于去重
          var idMatch = text.match(/\[VV_AI_FEED_POST\][\s\S]*?postId\s*=\s*([^\n]+)/i);
          var postId = idMatch ? idMatch[1].trim() : ('idx_' + i + '_' + text.length);

          if (processedPostIds[postId]) continue;

          var payload = extractAiFeedPostBlock(text);

          if (!payload) {
            console.warn('[VVHOST][AI_FEED_DETECTOR] parse payload failed, will retry:', postId);
            continue;
          }

          var ok = appendAiFeedPostToHostHidden(payload, 'ai-feed-detector');

          if (ok) {
            processedPostIds[postId] = true;
            console.log('[VVHOST][AI_FEED_DETECTOR] appended to hidden:', payload.postId, payload.from);
          } else {
            console.warn('[VVHOST][AI_FEED_DETECTOR] append failed, will retry:', payload.postId, payload.from);
          }
        }
      } catch (err) {
        console.error('[VVHOST][AI_FEED_DETECTOR] error:', err);
      }
    }, 1500);

    console.log('[VVHOST_FEED] AI feed post detector started');
  })();

  window.addEventListener('message', async function (event) {
    const data = event.data || {};
    if (!data || !data.type) return;

    console.log('[VVHOST_FEED] got message:', data.type, 'keys:', Object.keys(data));

    try {
      if (data.type === 'VVPHONE_READY') {
        console.log('[VVHOST_FEED] phone ready, sending current feed hidden data...');

        try {
          var readyCtx = getCtx();

          if (!readyCtx || !Array.isArray(readyCtx.chat)) {
            console.warn('[VVHOST_FEED] READY: ctx/chat not available');
            return;
          }

          for (var ri = 0; ri < readyCtx.chat.length; ri++) {
            var readyMes = String(readyCtx.chat[ri].mes || '');

            if (readyMes.includes('VV_FEED_HIDDEN_DATA')) {
              pushFeedHiddenRawToPhone(readyMes, 'phone-ready');
              console.log('[VVHOST_FEED] READY: sent feed hidden raw, length:', readyMes.length);
              break;
            }
          }
        } catch (err) {
          console.warn('[VVHOST_FEED] READY scan error:', err);
        }

        return;
      }

      if (data.type === 'VV_CALL_START') {
        console.log('[VVHOST_FEED] received call start request:', data);
        var started = VV_CALL_INTERCEPTOR.start({
          targetName: data.targetName || data.target || 'unknown',
          chatId: data.chatId || lastExpectedChatId || '',
          storyTime: data.storyTime || '',
          onMessage: function (parsed) {
            console.log('[VVHOST_FEED] call AI reply intercepted:', parsed);
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
        console.log('[VVHOST_FEED] interceptor start result:', started);
        return;
      }

      if (data.type === 'VV_CALL_USER_SPEAK') {
        console.log('[VVHOST_FEED] received user call speech');
        if (VV_CALL_INTERCEPTOR.isActive()) {
          VV_CALL_INTERCEPTOR.addUserLines(data.lines || [data.text || '']);
        }
        return;
      }

      if (data.type === 'VV_CALL_END') {
        console.log('[VVHOST_FEED] received call end request');
        VV_CALL_INTERCEPTOR.end();
        return;
      }

      if (data.type === 'VV_EXECUTE_SLASH') {
        const requestId = data.requestId || null;
        let command = String(data.command || '');
        const viewId = String(data.viewId || '').trim();
        const feedMode = !!data.feedMode;
        const callMode = !!data.callMode;
        const feedMeta = data.feedMeta || null;
        const userInteraction = data.userInteraction || null;

        if (feedMode && userInteraction) {
          pendingFeedInteraction = {
            postId: String(userInteraction.postId || '').trim(),
            from: String(userInteraction.from || '').trim(),
            action: String(userInteraction.action || '').trim(),
            content: String(userInteraction.content || '').trim(),
            replyTo: String(userInteraction.replyTo || '').trim(),
            targetName: String(data.targetName || '').trim(),
            startedAt: Date.now(),
            expiresAt: Date.now() + 120000
          };

          console.log('[VVHOST][FEED] pending interaction set:', pendingFeedInteraction);
        } else if (feedMode && feedMeta) {
          pendingFeedInteraction = null;
        }

        lastExpectedChatId =
          String(data.chatId || '').trim() ||
          extractChatIdFromCommand(command) ||
          lastExpectedChatId ||
          '';

        lastViewId = viewId || lastViewId || '';

        // ── feed 模式：写入初始动态块 / 用户评论 ──
        if (feedMode) {
          // feed/comment 场景绝对不允许电话拦截器继续占用 MESSAGE_RECEIVED
          if (VV_CALL_INTERCEPTOR && VV_CALL_INTERCEPTOR.isActive && VV_CALL_INTERCEPTOR.isActive()) {
            console.warn('[VVHOST_FEED][FEED] call interceptor active before feed, force end');
            VV_CALL_INTERCEPTOR.end();
          }

          // 覆盖可能残留的电话注入，防止模型把朋友圈评论当成电话
          command =
            '/inject id=vv_call role=system depth=0 scan=true [[\n' +
            '当前不是电话场景。当前是朋友圈动态评论互动。\n' +
            '禁止输出 [VV_CALL_SYNC]。\n' +
            '禁止输出 [VV_INCOMING_CALL]。\n' +
            '禁止输出 callPhase。\n' +
            '禁止输出 [通话] 块。\n' +
            '如果需要回复，只能输出 [VV_FEED_SYNC]。\n' +
            ']] |\n' +
            command;

          try {
            var ctx = getCtx();

            if (!ctx || !Array.isArray(ctx.chat)) {
              throw new Error('ctx/chat not available');
            }

            var chat = ctx.chat;

            // 内联查找 host 楼层（替代 findHostMessageIndex）
            var hostIdx = -1;
            for (var i = chat.length - 1; i >= 0; i--) {
              var mes = String(chat[i].mes || '');
              if (
                mes.includes('vv' + '手机') ||
                mes.includes('vvvital0312.github.io') ||
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

              // 写入用户发布的动态初始块
              if (feedMeta) {
                var imagesLine = (feedMeta.images && feedMeta.images.length) ? '\nimages=' + feedMeta.images.join(',') : '';
                var locationLine = feedMeta.location ? '\nlocation=' + feedMeta.location : '';
                var photoLine = feedMeta.photoDesc ? '\nphoto=' + feedMeta.photoDesc : '';

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

              // 写入用户评论/回复
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

                // 用户互动也先做一次去重
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
                }
              }
            }
          } catch (e) {
            console.warn('[VVHOST] feed pre-write error:', e);
          }

          const started = VV_FEED_INTERCEPTOR.start();
          console.log('[VVHOST] feed interceptor started:', started);
        }

        try {
          await runTriggerSlash(command);

          postToPhone({
            type: 'VV_EXECUTE_RESULT',
            requestId, ok: true, error: null,
            chatId: lastExpectedChatId || '',
            viewId: lastViewId || ''
          });

          if (feedMode) {
            console.log('[VVHOST] feed mode, skip polling');
          } else if (callMode || (VV_CALL_INTERCEPTOR && VV_CALL_INTERCEPTOR.isActive && VV_CALL_INTERCEPTOR.isActive())) {
            console.log('[VVHOST] call mode active, skip normal chat polling');
            // 电话由 VV_CALL_INTERCEPTOR 接管，不走普通 VV_CHAT_SYNC
          } else {
            pollForAssistantReply(lastExpectedChatId, lastViewId);
          }
        } catch (err) {
          if (feedMode) VV_FEED_INTERCEPTOR.stop();
          postToPhone({
            type: 'VV_EXECUTE_RESULT',
            requestId, ok: false,
            error: String((err && err.message) || err || 'execute failed'),
            chatId: lastExpectedChatId || '',
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

        if (!handled) {
          console.log('[VVHOST_FEED] VV_RAW_LLM_REPLY has no valid sync block');
        }
        return;
      }

      if (data.type === 'VV_REQUEST_FEED_REFRESH') {
        var ctxFeedRefresh = getCtx();

        if (!ctxFeedRefresh || !Array.isArray(ctxFeedRefresh.chat)) {
          console.warn('[VVHOST_FEED] feed refresh: ctx/chat not available');
          return;
        }

        // 找到含 VV_FEED_HIDDEN_DATA 的楼层
        for (var fr = 0; fr < ctxFeedRefresh.chat.length; fr++) {
          var feedMes = String(ctxFeedRefresh.chat[fr].mes || '');

          if (feedMes.includes('VV_FEED_HIDDEN_DATA')) {
            pushFeedHiddenRawToPhone(feedMes, 'feed-refresh');
            console.log('[VVHOST_FEED] feed refresh sent, length:', feedMes.length);
            break;
          }
        }

        return;
      }

      if (data.type === 'VVPHONE_RESEND_LAST_CHAT_SYNC') {
        const chatId = String(data.chatId || '').trim();
        const viewId = String(data.viewId || '').trim();

        if (!lastVVChatSyncRaw) {
          console.log('[VVHOST_FEED] no cached sync for resend');
          return;
        }

        if (chatId && !lastVVChatSyncRaw.includes('chatId=' + chatId)) {
          console.log('[VVHOST_FEED] cached sync chatId mismatch, skip resend');
          return;
        }

        postChatSyncToPhone(lastVVChatSyncRaw, chatId || lastExpectedChatId || '', viewId || lastViewId || '');
        return;
      }
    } catch (err) {
      console.warn('[VVHOST_FEED] message handler error:', err);
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
          allBlocks.push(block);
        });
      }

      if (!allBlocks.length) return '';

      return allBlocks.join('\n\n');
    }

    setInterval(function () {
      try {
        var currentRaw = collectAllFeedHiddenRaw();

        if (!currentRaw) return;

        var hiddenSig = getFeedHiddenSig(currentRaw);

        if (!hiddenSig) return;

        if (hiddenSig === lastFeedRaw) return;

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

        console.log('[VVHOST][FEED_WATCHER] all hidden data changed, pushing to phone, length=', currentRaw.length);

        pushFeedHiddenRawToPhone(currentRaw, 'feed-watcher-rescan');

        postToPhone({
          type: 'VV_OPEN_FEED',
          reason: 'feed-watcher-rescan'
        });

        postToPhone({
          type: 'VV_NAVIGATE',
          page: 'feed',
          tab: 'feed',
          reason: 'feed-watcher-rescan'
        });

        postToPhone({
          type: 'VV_SWITCH_TAB',
          tab: 'feed',
          page: 'feed',
          reason: 'feed-watcher-rescan'
        });
      } catch (err) {
        console.warn('[VVHOST][FEED_WATCHER] error:', err);
      }
    }, watchInterval);

    console.log('[VVHOST] feed hidden data watcher started, aggregate mode, interval=' + watchInterval + 'ms');
  })();

  function findFeedHostMessageIndex(postId) {
    var ctx = getCtx();
    if (!ctx || !Array.isArray(ctx.chat)) return -1;

    postId = String(postId || '').trim();

    // 1. 优先找已有 hidden data / 手机 host 楼层
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

    // 2. 找不到手机 host 时，找包含当前 AI_FEED_POST 的 AI 楼层
    if (postId) {
      for (var j = ctx.chat.length - 1; j >= 0; j--) {
        var mes2 = String(ctx.chat[j].mes || '');

        if (
          mes2.includes('[VV_AI_FEED_POST]') &&
          mes2.includes('postId=' + postId)
        ) {
          console.log('[VVHOST_FEED][AI_FEED] fallback host is AI_FEED_POST floor:', j);
          return j;
        }
      }
    }

    // 3. 再兜底：找最近一个 AI_FEED_POST 楼层
    for (var k = ctx.chat.length - 1; k >= 0; k--) {
      var mes3 = String(ctx.chat[k].mes || '');

      if (mes3.includes('[VV_AI_FEED_POST]')) {
        console.log('[VVHOST_FEED][AI_FEED] fallback host is latest AI_FEED_POST floor:', k);
        return k;
      }
    }

    return -1;
  }

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
    } else if (payload.photoRaw) {
      photoLine = '\nphoto=' + String(payload.photoRaw || '').trim();
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

  function hasHiddenFeedPost(currentMes, postId) {
    currentMes = String(currentMes || '');
    postId = String(postId || '').trim();
    if (!postId) return false;

    var blocks = currentMes.match(/\[VV_FEED_HIDDEN_DATA\][\s\S]*?\[\/VV_FEED_HIDDEN_DATA\]/g) || [];

    return blocks.some(function (block) {
      return block.includes('postId=' + postId);
    });
  }

  function appendAiFeedPostToHostHidden(payload, reason) {
    payload = payload || {};

    var postId = String(payload.postId || '').trim();
    if (!postId) return false;

    var ctx = getCtx();

    if (!ctx || !Array.isArray(ctx.chat)) {
      console.warn('[VVHOST_FEED][AI_FEED] ctx/chat not available');
      return false;
    }

    var hostIdx = findFeedHostMessageIndex(postId);

    if (hostIdx < 0 || !ctx.chat[hostIdx]) {
      console.warn('[VVHOST_FEED][AI_FEED] host message not found');
      return false;
    }

    var currentMes = String(ctx.chat[hostIdx].mes || '');

    // 注意：不能用 currentMes.includes('postId=' + postId)
    // 因为 AI_FEED_POST 原文里本来就有 postId，会误判。
    if (hasHiddenFeedPost(currentMes, postId)) {
      console.log('[VVHOST_FEED][AI_FEED] duplicated hidden postId, skip write:', postId);
      pushFeedHiddenRawToPhone(currentMes, reason || 'ai-feed-duplicate-push');

      postToPhone({ type: 'VV_OPEN_FEED', reason: reason || 'ai-feed-duplicate-push' });
      postToPhone({ type: 'VV_NAVIGATE', page: 'feed', tab: 'feed', reason: reason || 'ai-feed-duplicate-push' });
      postToPhone({ type: 'VV_SWITCH_TAB', tab: 'feed', page: 'feed', reason: reason || 'ai-feed-duplicate-push' });

      return true;
    }

    var hiddenBlock = buildAiFeedHiddenBlock(payload);

    if (!hiddenBlock) {
      console.warn('[VVHOST_FEED][AI_FEED] empty hidden block');
      return false;
    }

    currentMes = currentMes.trimEnd() + '\n' + hiddenBlock;
    ctx.chat[hostIdx].mes = currentMes;

    try {
      if (typeof ctx.saveChat === 'function') {
        ctx.saveChat();
      }
    } catch (e) {
      console.warn('[VVHOST_FEED][AI_FEED] saveChat failed:', e);
    }

    console.log('[VVHOST_FEED][AI_FEED] written to hidden data:', postId, reason || '', 'hostIdx=', hostIdx);

    pushFeedHiddenRawToPhone(currentMes, reason || 'ai-feed-post');

    postToPhone({ type: 'VV_OPEN_FEED', reason: reason || 'ai-feed-post' });
    postToPhone({ type: 'VV_NAVIGATE', page: 'feed', tab: 'feed', reason: reason || 'ai-feed-post' });
    postToPhone({ type: 'VV_SWITCH_TAB', tab: 'feed', page: 'feed', reason: reason || 'ai-feed-post' });

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
})();