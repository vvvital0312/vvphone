(function () {
  if (window.__VV_HOST_CHAT_CORE_INSTALLED__) {
    console.log('[VVHOST_CHAT] core already installed, skip');
    return;
  }

  window.__VV_HOST_CHAT_CORE_INSTALLED__ = true;

  const config = window.VV_HOST_CONFIG || {};

  const VVHOST_CHAT_VERSION = config.version || 'CHAT-CALL-SAME-FLOOR-005';
  const PHONE_ORIGIN = config.phoneOrigin || 'https://vvvital0312.github.io';
  const PHONE_FRAME_ID = config.phoneFrameId || 'phoneFrame';
  const HOST_TYPE = config.hostType || 'chat';

  const CURRENT_CHAT_ID = String(config.currentChatId || '').trim();
  const CURRENT_TARGET = String(config.currentTarget || '').trim();

  let lastVVChatSyncRaw = '';
  let lastViewId = '';

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

    if (viewId) lastViewId = viewId;

    return postToPhone({
      type: 'VVPHONE_CHAT_SYNC',
      raw: syncBlock,
      chatId: chatId || CURRENT_CHAT_ID || '',
      viewId: viewId || lastViewId || '',
      msgIndex: msgIndex !== undefined ? msgIndex : -1
    });
  }

  function postCallSyncToPhone(raw, chatId, viewId) {
    if (!raw) return false;

    return postToPhone({
      type: 'VVPHONE_CALL_SYNC',
      raw: raw,
      chatId: chatId || CURRENT_CHAT_ID || '',
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
          text.includes('[VV_CHAT_SYNC]') ||
          text.includes('[/VV_CHAT_SYNC]') ||
          text.includes('VV_CALL_HIDDEN_DATA') ||
          text.includes('vv' + '手机') ||
          text.includes('vv' + 'phone') ||
          text.includes('vvvital0312.github.io/' + 'vvphone') ||
          text.includes('phone' + 'Frame') ||
          text.includes('VV' + 'HOST')
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

  function pollForAssistantReply(chatId, viewId, timeout) {
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
      'beforeLength=', beforeLength
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

          if (!msg || !msg.is_user) continue;

          var text = String(msg.mes || '');

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
          chatId: data.chatId || CURRENT_CHAT_ID || '',
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
        const chatId =
          String(data.chatId || '').trim() ||
          extractChatIdFromCommand(command) ||
          CURRENT_CHAT_ID ||
          '';

        const callMode = !!data.callMode;

        lastViewId = viewId || lastViewId || '';

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
          chatId: chatId,
          viewId: viewId
        });

        if (ok) {
          if (callMode || VV_CALL_INTERCEPTOR.isActive()) {
            console.log('[VVHOST_CHAT] call mode active, skip normal chat polling');
          } else {
            pollForAssistantReply(chatId, viewId);
          }
        }

        return;
      }

      if (data.type === 'VV_RAW_LLM_REPLY') {
        const rawText = String(data.raw || '');
        const chatIdFromData = String(data.chatId || '').trim();
        const viewId = String(data.viewId || '').trim();
        const expectedChatId = chatIdFromData || CURRENT_CHAT_ID || '';

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
          console.log('[VVHOST_CHAT] VV_RAW_LLM_REPLY has no valid sync block');
        }

        return;
      }

      if (data.type === 'VVPHONE_RESEND_LAST_CHAT_SYNC') {
        const chatId = String(data.chatId || '').trim();
        const viewId = String(data.viewId || '').trim();

        if (lastVVChatSyncRaw) {
          postChatSyncToPhone(lastVVChatSyncRaw, chatId || CURRENT_CHAT_ID, viewId || lastViewId || '');
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
})();
