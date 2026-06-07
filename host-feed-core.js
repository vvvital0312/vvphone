(function () {
  'use strict';

  if (window.__VV_HOST_FEED_CORE_INSTALLED__) {
    console.log('[VVHOST_FEED] already installed, skip');
    return;
  }

  window.__VV_HOST_FEED_CORE_INSTALLED__ = true;

  var VV_HOST_CONFIG = window.VV_HOST_CONFIG || {};
  var HOST_TYPE = VV_HOST_CONFIG.hostType || 'feed';
  var PHONE_FRAME_ID = VV_HOST_CONFIG.phoneFrameId || 'phoneFrame';
  var PHONE_ORIGIN = VV_HOST_CONFIG.phoneOrigin || 'https://vvvital0312.github.io';
  var DEFAULT_VIEW = VV_HOST_CONFIG.defaultView || 'feed';
  var VERSION = VV_HOST_CONFIG.version || 'FEED-CALL-INTERCEPT-003';

  var DEBUG = true;

  var lastExpectedFeedPostId = '';
  var lastFeedSyncRaw = '';
  var lastViewId = '';
  var lastPushedFeedHiddenRaw = '';
  var lastPushedFeedHiddenSig = '';

  var activeFeedIntercept = null;
  var rpPollInitialized = false;
  var rpPollLastCheckedIndex = -1;

  function log() {
    if (!DEBUG) return;
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[VVHOST_FEED]');
    console.log.apply(console, args);
  }

  function warn() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[VVHOST_FEED]');
    console.warn.apply(console, args);
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function safeString(v) {
    if (v === null || v === undefined) return '';
    return String(v);
  }

  function getPhoneFrame() {
    return document.getElementById(PHONE_FRAME_ID);
  }

  function postToPhone(payload) {
    try {
      var frame = getPhoneFrame();

      if (!frame || !frame.contentWindow) {
        warn('[postToPhone] phone frame not found');
        return false;
      }

      frame.contentWindow.postMessage(payload, PHONE_ORIGIN);
      log('[postToPhone]', payload && payload.type, payload || {});
      return true;
    } catch (err) {
      warn('[postToPhone] failed:', err);
      return false;
    }
  }

  function getCtx() {
    try {
      if (typeof SillyTavern !== 'undefined' && SillyTavern.getContext) {
        return SillyTavern.getContext();
      }
    } catch (e) {}

    try {
      if (window.parent && window.parent.SillyTavern && window.parent.SillyTavern.getContext) {
        return window.parent.SillyTavern.getContext();
      }
    } catch (e) {}

    try {
      if (window.top && window.top.SillyTavern && window.top.SillyTavern.getContext) {
        return window.top.SillyTavern.getContext();
      }
    } catch (e) {}

    try {
      if (window.TavernHelper && window.TavernHelper.getContext) {
        return window.TavernHelper.getContext();
      }
    } catch (e) {}

    try {
      if (window.parent && window.parent.TavernHelper && window.parent.TavernHelper.getContext) {
        return window.parent.TavernHelper.getContext();
      }
    } catch (e) {}

    try {
      if (window.top && window.top.TavernHelper && window.top.TavernHelper.getContext) {
        return window.top.TavernHelper.getContext();
      }
    } catch (e) {}

    return null;
  }

  function getChat() {
    var ctx = getCtx();
    if (!ctx || !Array.isArray(ctx.chat)) return [];
    return ctx.chat;
  }

  function getMessageText(m) {
    if (!m) return '';
    if (typeof m.mes === 'string') return m.mes;
    if (typeof m.message === 'string') return m.message;
    if (typeof m.text === 'string') return m.text;
    return '';
  }

  function setMessageText(m, text) {
    if (!m) return;
    if ('mes' in m) {
      m.mes = text;
    } else if ('message' in m) {
      m.message = text;
    } else if ('text' in m) {
      m.text = text;
    } else {
      m.mes = text;
    }
  }

  async function saveChatIfPossible() {
    try {
      var ctx = getCtx();

      if (ctx && typeof ctx.saveChat === 'function') {
        await ctx.saveChat();
        return true;
      }

      if (typeof saveChatConditional === 'function') {
        await saveChatConditional();
        return true;
      }

      if (window.parent && typeof window.parent.saveChatConditional === 'function') {
        await window.parent.saveChatConditional();
        return true;
      }

      if (window.top && typeof window.top.saveChatConditional === 'function') {
        await window.top.saveChatConditional();
        return true;
      }
    } catch (err) {
      warn('[saveChatIfPossible] failed:', err);
    }

    return false;
  }

  function findHostMessageIndex() {
    var chat = getChat();

    for (var i = 0; i < chat.length; i++) {
      var mes = getMessageText(chat[i]);

      if (
        mes.indexOf('vv手机') !== -1 ||
        mes.indexOf('vvPhone') !== -1 ||
        mes.indexOf('VV_FEED_HIDDEN_DATA') !== -1 ||
        mes.indexOf('phoneFrame') !== -1 ||
        mes.indexOf('vvphone') !== -1
      ) {
        return i;
      }
    }

    return -1;
  }

  function getHostMessageRaw() {
    var chat = getChat();
    var idx = findHostMessageIndex();

    if (idx < 0 || !chat[idx]) return '';

    return getMessageText(chat[idx]);
  }

  async function updateHostMessageRaw(newRaw) {
    var chat = getChat();
    var idx = findHostMessageIndex();

    if (idx < 0 || !chat[idx]) {
      warn('[updateHostMessageRaw] host message not found');
      return false;
    }

    setMessageText(chat[idx], newRaw);
    await saveChatIfPossible();
    return true;
  }

  function getFeedHiddenSig(raw) {
    raw = safeString(raw);

    var hiddenMatch = raw.match(/(<div class="vv-feed-hidden"[\s\S]*?<\/div>)/g);

    return hiddenMatch ? hiddenMatch.join('') : raw;
  }

  function pushFeedHiddenRawToPhone(raw, reason) {
    raw = safeString(raw);

    if (!raw) return false;

    var sig = getFeedHiddenSig(raw);

    lastPushedFeedHiddenRaw = raw;
    lastPushedFeedHiddenSig = sig;

    log('[FEED_PUSH] push hidden raw to phone, reason=', reason || '', 'length=', raw.length);

    return postToPhone({
      type: 'VV_FEED_HIDDEN_RAW',
      raw: raw
    });
  }

  function htmlEscape(s) {
    return safeString(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function htmlUnescape(s) {
    return safeString(s)
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }

  function extractPostIdFromText(text) {
    text = safeString(text);

    var m =
      text.match(/postId\s*=\s*([^\n\r]+)/) ||
      text.match(/postId[:：]\s*([^\n\r]+)/) ||
      text.match(/动态ID[:：]\s*([^\n\r]+)/);

    return m ? m[1].trim() : '';
  }

  function extractFieldFromCommand(text, label) {
    text = safeString(text);

    var re = new RegExp(label + '\\s*[：:]\\s*([^\\n\\r]+)');
    var m = text.match(re);

    return m ? m[1].trim() : '';
  }

  function extractFeedContentFromCommand(text) {
    text = safeString(text);

    var m = text.match(/内容[：:]\s*([\s\S]*?)\npostId\s*=/);

    if (m) return m[1].trim();

    m = text.match(/内容[：:]\s*([^\n\r]+)/);

    return m ? m[1].trim() : '';
  }

  function buildInitialFeedHiddenBlockFromCommand(command) {
    command = safeString(command);

    var postId = extractPostIdFromText(command);
    if (!postId) return '';

    var time = extractFieldFromCommand(command, '时间') || '';
    var author = extractFieldFromCommand(command, '发布者') || '我';
    var content = extractFeedContentFromCommand(command);

    var raw = '';
    raw += '<div class="vv-feed-hidden" style="display:none">';
    raw += '[VV_FEED_HIDDEN_DATA]\n';
    raw += 'postId=' + postId + '\n';
    raw += 'time=' + time + '\n';
    raw += 'author=' + author + '\n';
    raw += 'authorId=me\n';
    raw += 'content=' + content + '\n';
    raw += '[/VV_FEED_HIDDEN_DATA]';
    raw += '</div>';

    return raw;
  }

  async function ensureInitialFeedBlockWritten(command) {
    command = safeString(command);

    var postId = extractPostIdFromText(command);

    if (!postId) return false;

    var hostRaw = getHostMessageRaw();

    if (!hostRaw) {
      warn('[ensureInitialFeedBlockWritten] no host raw');
      return false;
    }

    if (
      hostRaw.indexOf('VV_FEED_HIDDEN_DATA') !== -1 &&
      hostRaw.indexOf('postId=' + postId) !== -1
    ) {
      log('feed initial block already exists for', postId);
      return true;
    }

    var block = buildInitialFeedHiddenBlockFromCommand(command);

    if (!block) return false;

    var nextRaw = hostRaw + '\n' + block;

    await updateHostMessageRaw(nextRaw);

    log('feed initial block written for', postId);

    pushFeedHiddenRawToPhone(nextRaw, 'feed-initial-written');

    return true;
  }

  function extractValidVVFeedSyncBlock(rawText, expectedPostId) {
    rawText = safeString(rawText);

    var re = /\[VV_FEED_SYNC\]([\s\S]*?)\[\/VV_FEED_SYNC\]/g;
    var match;

    while ((match = re.exec(rawText))) {
      var block = '[VV_FEED_SYNC]' + match[1] + '[/VV_FEED_SYNC]';
      var postId = getFeedTopField(block, 'postId');

      if (expectedPostId && postId && postId !== expectedPostId) {
        continue;
      }

      if (block.indexOf('[互动]') !== -1) {
        return block;
      }
    }

    return '';
  }

  function getFeedTopField(block, key) {
    block = safeString(block);
    key = safeString(key);

    var re = new RegExp('^' + escapeRegExp(key) + '\\s*=\\s*([^\\n\\r]*)', 'm');
    var m = block.match(re);

    return m ? m[1].trim() : '';
  }

  function escapeRegExp(s) {
    return safeString(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function getFeedField(block, key) {
    block = safeString(block);
    key = safeString(key);

    var lines = block.split(/\r?\n/);
    var target = key + '=';
    var result = '';
    var collecting = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      if (line.indexOf(target) === 0) {
        result = line.slice(target.length);
        collecting = true;
        continue;
      }

      if (collecting) {
        if (/^[a-zA-Z0-9_\u4e00-\u9fa5]+\s*=/.test(line)) {
          break;
        }

        if (line.indexOf('[/互动]') === 0) {
          break;
        }

        result += '\n' + line;
      }
    }

    return result.trim();
  }

  function parseFeedInteractions(feedSyncBlock) {
    feedSyncBlock = safeString(feedSyncBlock);

    var arr = [];
    var re = /\[互动\]([\s\S]*?)\[\/互动\]/g;
    var match;

    while ((match = re.exec(feedSyncBlock))) {
      var raw = match[1] || '';

      var from = getFeedField(raw, 'from');
      var action = getFeedField(raw, 'action');
      var content = getFeedField(raw, 'content');

      if (!from || !action) continue;

      action = action.trim();

      if (action !== 'like' && action !== 'comment') continue;

      if (action === 'comment' && !content) continue;

      arr.push({
        from: from,
        action: action,
        content: content
      });
    }

    return arr;
  }

  function buildInteractionKey(postId, it) {
    return [
      safeString(postId).trim(),
      safeString(it && it.from).trim(),
      safeString(it && it.action).trim(),
      safeString(it && it.content).replace(/\s+/g, ' ').trim()
    ].join('|');
  }

  function collectExistingInteractionKeys(hostRaw, postId) {
    hostRaw = safeString(hostRaw);
    postId = safeString(postId);

    var keys = {};
    var feedSyncRe = /\[VV_FEED_SYNC\]([\s\S]*?)\[\/VV_FEED_SYNC\]/g;
    var match;

    while ((match = feedSyncRe.exec(hostRaw))) {
      var block = '[VV_FEED_SYNC]' + match[1] + '[/VV_FEED_SYNC]';
      var bid = getFeedTopField(block, 'postId');

      if (postId && bid && bid !== postId) continue;

      var interactions = parseFeedInteractions(block);

      interactions.forEach(function (it) {
        keys[buildInteractionKey(bid || postId, it)] = true;
      });
    }

    return keys;
  }

  function rebuildFeedSyncBlockWithUniqueInteractions(feedSyncBlock, hostRaw) {
    feedSyncBlock = safeString(feedSyncBlock);
    hostRaw = safeString(hostRaw);

    var postId = getFeedTopField(feedSyncBlock, 'postId');
    var time = getFeedTopField(feedSyncBlock, 'time');
    var interactions = parseFeedInteractions(feedSyncBlock);
    var existed = collectExistingInteractionKeys(hostRaw, postId);

    var unique = [];

    interactions.forEach(function (it) {
      var key = buildInteractionKey(postId, it);

      if (existed[key]) {
        log('[FEED_DEDUPE] skip existed interaction:', key);
        return;
      }

      if (unique.some(function (u) {
        return buildInteractionKey(postId, u) === key;
      })) {
        log('[FEED_DEDUPE] skip duplicated in same block:', key);
        return;
      }

      unique.push(it);
    });

    if (!unique.length) return '';

    var out = '';
    out += '[VV_FEED_SYNC]\n';
    out += 'postId=' + postId + '\n';
    out += 'time=' + time + '\n\n';

    unique.forEach(function (it) {
      out += '[互动]\n';
      out += 'from=' + it.from + '\n';
      out += 'action=' + it.action + '\n';

      if (it.action === 'comment') {
        out += 'content=' + it.content + '\n';
      }

      out += '[/互动]\n\n';
    });

    out += '[/VV_FEED_SYNC]';

    return out;
  }

  async function appendFeedSyncToHostHiddenData(feedSyncBlock) {
    feedSyncBlock = safeString(feedSyncBlock);

    if (!feedSyncBlock) return false;

    var postId = getFeedTopField(feedSyncBlock, 'postId');

    if (!postId) {
      warn('[appendFeedSyncToHostHiddenData] no postId');
      return false;
    }

    var hostRaw = getHostMessageRaw();

    if (!hostRaw) {
      warn('[appendFeedSyncToHostHiddenData] no host raw');
      return false;
    }

    var uniqueBlock = rebuildFeedSyncBlockWithUniqueInteractions(feedSyncBlock, hostRaw);

    if (!uniqueBlock) {
      log('[appendFeedSyncToHostHiddenData] no new interactions, skip append');
      pushFeedHiddenRawToPhone(hostRaw, 'feed-no-new-interactions');
      return true;
    }

    var hiddenDivRe = /(<div class="vv-feed-hidden"[^>]*>)([\s\S]*?)(<\/div>)/;
    var nextRaw = '';

    if (hiddenDivRe.test(hostRaw)) {
      nextRaw = hostRaw.replace(hiddenDivRe, function (all, open, inner, close) {
        return open + inner.trim() + '\n\n' + uniqueBlock + close;
      });
    } else {
      var wrapper = '';
      wrapper += '<div class="vv-feed-hidden" style="display:none">';
      wrapper += uniqueBlock;
      wrapper += '</div>';

      nextRaw = hostRaw + '\n' + wrapper;
    }

    await updateHostMessageRaw(nextRaw);

    log('[FEED_INTERCEPT] appended feed sync for postId:', postId);

    pushFeedHiddenRawToPhone(nextRaw, 'feed-intercept-append');

    return true;
  }

  function findLatestAssistantFeedReplyIndex(startIndex, expectedPostId) {
    var chat = getChat();

    for (var i = chat.length - 1; i >= 0; i--) {
      if (typeof startIndex === 'number' && i <= startIndex) continue;

      var msg = chat[i] || {};
      var raw = getMessageText(msg);

      if (!raw || raw.indexOf('[VV_FEED_SYNC]') === -1) continue;

      var block = extractValidVVFeedSyncBlock(raw, expectedPostId);

      if (block) {
        return i;
      }
    }

    return -1;
  }

  async function deleteChatFloors(indices) {
    var chat = getChat();

    indices = (indices || [])
      .filter(function (n) {
        return typeof n === 'number' && n >= 0;
      })
      .sort(function (a, b) {
        return b - a;
      });

    if (!indices.length) return false;

    log('[FEED_INTERCEPT] floors to delete:', indices);

    for (var i = 0; i < indices.length; i++) {
      var idx = indices[i];

      try {
        var ctx = getCtx();

        if (ctx && typeof ctx.deleteMessage === 'function') {
          await ctx.deleteMessage(idx);
          log('[FEED_INTERCEPT] deleted floor by ctx.deleteMessage:', idx);
          continue;
        }

        if (typeof deleteMessage === 'function') {
          await deleteMessage(idx);
          log('[FEED_INTERCEPT] deleted floor by deleteMessage:', idx);
          continue;
        }

        if (window.parent && typeof window.parent.deleteMessage === 'function') {
          await window.parent.deleteMessage(idx);
          log('[FEED_INTERCEPT] deleted floor by parent.deleteMessage:', idx);
          continue;
        }

        if (Array.isArray(chat) && chat[idx]) {
          chat.splice(idx, 1);
          log('[FEED_INTERCEPT] deleted floor by splice:', idx);
        }
      } catch (err) {
        warn('[FEED_INTERCEPT] delete floor failed:', idx, err);
      }
    }

    await saveChatIfPossible();

    log('[FEED_INTERCEPT] deletion done');

    return true;
  }

  async function pollForFeedReply(options) {
    options = options || {};

    var expectedPostId = options.postId || '';
    var startIndex = typeof options.startIndex === 'number' ? options.startIndex : getChat().length - 1;
    var requestIndex = typeof options.requestIndex === 'number' ? options.requestIndex : -1;
    var timeoutMs = options.timeoutMs || 90000;
    var intervalMs = options.intervalMs || 1000;
    var startedAt = Date.now();

    log('[FEED_INTERCEPT] started, host index:', findHostMessageIndex());

    while (Date.now() - startedAt < timeoutMs) {
      var replyIndex = findLatestAssistantFeedReplyIndex(startIndex, expectedPostId);

      if (replyIndex >= 0) {
        var chat = getChat();
        var raw = getMessageText(chat[replyIndex]);
        var block = extractValidVVFeedSyncBlock(raw, expectedPostId);

        if (block) {
          log('[FEED_INTERCEPT] intercepted AI reply, index:', replyIndex);

          await appendFeedSyncToHostHiddenData(block);

          log('[FEED_INTERCEPT] stopped');

          var del = [];

          if (replyIndex >= 0) del.push(replyIndex);
          if (requestIndex >= 0) del.push(requestIndex);

          await deleteChatFloors(del);

          activeFeedIntercept = null;

          return {
            ok: true,
            raw: block,
            replyIndex: replyIndex
          };
        }
      }

      await sleep(intervalMs);
    }

    activeFeedIntercept = null;

    warn('[FEED_INTERCEPT] timeout, no valid VV_FEED_SYNC');

    return {
      ok: false,
      error: 'timeout'
    };
  }

  async function executeSlashCommand(command) {
    command = safeString(command);

    if (!command) {
      return {
        ok: false,
        error: 'empty command'
      };
    }

    log('[ANNOTATION COMMAND]', command);

    try {
      if (typeof executeSlashCommands === 'function') {
        var r1 = await executeSlashCommands(command);
        return {
          ok: true,
          result: r1
        };
      }
    } catch (err1) {
      warn('[executeSlashCommand] executeSlashCommands failed:', err1);
    }

    try {
      if (window.parent && typeof window.parent.executeSlashCommands === 'function') {
        var r2 = await window.parent.executeSlashCommands(command);
        return {
          ok: true,
          result: r2
        };
      }
    } catch (err2) {
      warn('[executeSlashCommand] parent.executeSlashCommands failed:', err2);
    }

    try {
      if (window.top && typeof window.top.executeSlashCommands === 'function') {
        var r3 = await window.top.executeSlashCommands(command);
        return {
          ok: true,
          result: r3
        };
      }
    } catch (err3) {
      warn('[executeSlashCommand] top.executeSlashCommands failed:', err3);
    }

    try {
      if (typeof triggerSlash === 'function') {
        var r4 = await triggerSlash(command);
        return {
          ok: true,
          result: r4
        };
      }
    } catch (err4) {
      warn('[executeSlashCommand] triggerSlash failed:', err4);
    }

    return {
      ok: false,
      error: 'executeSlashCommands not found'
    };
  }

  async function runTriggerSlash(payload) {
    payload = payload || {};

    var command = safeString(payload.command || payload.slash || payload.text || '');
    var viewId = safeString(payload.viewId || payload.requestId || '');
    var postId = safeString(payload.postId || extractPostIdFromText(command));
    var feedMode = !!payload.feedMode || command.indexOf('[VV_FEED_SYNC]') !== -1 || command.indexOf('朋友圈动态') !== -1 || !!postId;

    lastViewId = viewId;
    lastExpectedFeedPostId = postId;

    log('[MODE CHECK]', {
      hostType: HOST_TYPE,
      feedMode: feedMode,
      postId: postId,
      viewId: viewId
    });

    var chatBefore = getChat();
    var startIndex = chatBefore.length - 1;

    if (feedMode && postId) {
      await ensureInitialFeedBlockWritten(command);
    }

    var execResult = await executeSlashCommand(command);

    postToPhone({
      type: 'VV_EXECUTE_RESULT',
      ok: !!execResult.ok,
      result: execResult.result || null,
      error: execResult.error || '',
      viewId: viewId,
      postId: postId
    });

    if (!execResult.ok) {
      warn('[runTriggerSlash] slash execute failed:', execResult.error);
      return execResult;
    }

    if (feedMode) {
      log('feed mode, skip polling');
      var requestIndex = findSlashRequestFloorIndex(command, startIndex);

      activeFeedIntercept = {
        postId: postId,
        startedAt: Date.now()
      };

      pollForFeedReply({
        postId: postId,
        startIndex: startIndex,
        requestIndex: requestIndex,
        timeoutMs: 90000,
        intervalMs: 1000
      });

      return {
        ok: true,
        feedMode: true
      };
    }

    return {
      ok: true
    };
  }

  function normalizeForCompare(s) {
    return safeString(s).replace(/\s+/g, ' ').trim();
  }

  function findSlashRequestFloorIndex(command, startIndex) {
    var chat = getChat();
    var cmdShort = normalizeForCompare(command).slice(0, 120);

    for (var i = chat.length - 1; i >= 0; i--) {
      if (typeof startIndex === 'number' && i <= startIndex) continue;

      var msg = chat[i] || {};
      var raw = getMessageText(msg);
      var short = normalizeForCompare(raw).slice(0, 120);

      if (
        raw.indexOf('系统指令·朋友圈动态') !== -1 ||
        raw.indexOf('VV_FEED_SYNC') !== -1 ||
        short.indexOf(cmdShort.slice(0, 60)) !== -1
      ) {
        return i;
      }
    }

    return -1;
  }

  function findFeedHostMessage() {
    var chat = getChat();

    for (var i = 0; i < chat.length; i++) {
      var mes = getMessageText(chat[i]);

      if (mes.indexOf('VV_FEED_HIDDEN_DATA') !== -1) {
        return mes;
      }
    }

    return '';
  }

  function scanCurrentFloorForFeedHiddenRaw() {
    var raw = findFeedHostMessage();

    if (!raw) return false;

    log('[INIT] found feed hidden raw, posting to phone');

    pushFeedHiddenRawToPhone(raw, 'phone-ready-scan');

    return true;
  }

  function startFeedHiddenDataWatcher() {
    var lastFeedRaw = '';
    var watchInterval = 2000;

    setInterval(function () {
      try {
        var currentRaw = findFeedHostMessage();

        if (!currentRaw) return;

        var hiddenSig = getFeedHiddenSig(currentRaw);

        if (!hiddenSig) return;

        if (hiddenSig === lastFeedRaw) return;

        if (
          currentRaw === lastPushedFeedHiddenRaw ||
          hiddenSig === lastPushedFeedHiddenSig
        ) {
          lastFeedRaw = hiddenSig;
          log('[FEED_WATCHER] skip duplicated pushed hidden raw');
          return;
        }

        lastFeedRaw = hiddenSig;

        log('[FEED_WATCHER] hidden data changed, pushing to phone, length=', currentRaw.length);

        pushFeedHiddenRawToPhone(currentRaw, 'feed-watcher');
      } catch (err) {
        warn('[FEED_WATCHER] error:', err);
      }
    }, watchInterval);

    log('feed hidden data watcher started');
  }

  function initRPPoller() {
    if (rpPollInitialized) return;

    rpPollInitialized = true;

    var chat = getChat();

    rpPollLastCheckedIndex = chat.length - 1;

    log('[RP_POLL] initialized, lastCheckedIndex=', rpPollLastCheckedIndex);

    setInterval(function () {
      try {
        if (activeFeedIntercept) {
          log('[RP_POLL] feed intercept active, skip');
          return;
        }

        var chatNow = getChat();

        if (!Array.isArray(chatNow) || !chatNow.length) return;

        if (rpPollLastCheckedIndex < 0) {
          rpPollLastCheckedIndex = chatNow.length - 1;
          return;
        }

        if (chatNow.length <= rpPollLastCheckedIndex + 1) return;

        for (var i = rpPollLastCheckedIndex + 1; i < chatNow.length; i++) {
          var mes = getMessageText(chatNow[i]);

          if (!mes) continue;

          if (mes.indexOf('/send') !== -1 || mes.indexOf('/trigger') !== -1) {
            log('[RP_POLL] command-like new msg at index', i);
          }
        }

        rpPollLastCheckedIndex = chatNow.length - 1;
      } catch (err) {
        warn('[RP_POLL] error:', err);
      }
    }, 1000);
  }

  function handleRawLLMReply(payload) {
    payload = payload || {};

    var rawText = safeString(payload.raw || payload.text || payload.message || '');
    var viewId = safeString(payload.viewId || lastViewId || '');
    var expectedPostId = safeString(payload.postId || lastExpectedFeedPostId || '');

    if (!rawText) return false;

    var feedBlock = extractValidVVFeedSyncBlock(rawText, expectedPostId);

    if (feedBlock) {
      appendFeedSyncToHostHiddenData(feedBlock);
      return true;
    }

    log('VV_RAW_LLM_REPLY has no valid VV_FEED_SYNC block');
    return false;
  }

  function handleRequestFeedBranch(payload) {
    payload = payload || {};

    var raw = findFeedHostMessage();

    if (raw) {
      pushFeedHiddenRawToPhone(raw, 'request-feed-branch');
      return;
    }

    postToPhone({
      type: 'VV_FEED_HIDDEN_RAW',
      raw: ''
    });
  }

  function handlePhoneReady() {
    log('phone ready, scanning current floor for sync block...');

    scanCurrentFloorForFeedHiddenRaw();

    postToPhone({
      type: 'VV_HOST_READY',
      hostType: HOST_TYPE,
      defaultView: DEFAULT_VIEW,
      version: VERSION
    });
  }

  function bindMessageListener() {
    window.addEventListener('message', function (event) {
      var data = event.data || {};
      var type = data.type || '';

      if (!type) return;

      log('got message:', type, 'keys:', Object.keys(data));

      if (type === 'REQUEST_PARENT_TITLE') {
        postToPhone({
          type: 'PARENT_TITLE',
          title: document.title || ''
        });
        return;
      }

      if (type === 'VVPHONE_READY') {
        handlePhoneReady();
        return;
      }

      if (type === 'VV_EXECUTE_SLASH') {
        runTriggerSlash(data);
        return;
      }

      if (type === 'VV_RAW_LLM_REPLY') {
        handleRawLLMReply(data);
        return;
      }

      if (type === 'VV_REQUEST_FEED_BRANCH') {
        handleRequestFeedBranch(data);
        return;
      }

      if (type === 'TH_UPDATE_VIEWPORT_HEIGHT') {
        return;
      }
    });
  }

  function initAiFeedPostDetector() {
    var lastCheckedLen = 0;

    setInterval(function () {
      try {
        var chat = getChat();

        if (!Array.isArray(chat) || !chat.length) return;

        if (lastCheckedLen === 0) {
          lastCheckedLen = chat.length;
          return;
        }

        if (chat.length <= lastCheckedLen) return;

        for (var i = lastCheckedLen; i < chat.length; i++) {
          var raw = getMessageText(chat[i]);

          if (!raw) continue;

          var block = extractValidVVFeedSyncBlock(raw, lastExpectedFeedPostId);

          if (block) {
            log('[AI_FEED_DETECTOR] found VV_FEED_SYNC at index:', i);

            appendFeedSyncToHostHiddenData(block).then(function () {
              deleteChatFloors([i]);
            });
          }
        }

        lastCheckedLen = chat.length;
      } catch (err) {
        warn('[AI_FEED_DETECTOR] error:', err);
      }
    }, 1500);

    log('AI feed post detector started');
  }

  function initUserInputPoller() {
    log('user input POLLER registered (interval=1000ms)');
  }

  function exposeDebugApi() {
    window.VV_FEED_HOST = {
      version: VERSION,
      getCtx: getCtx,
      getChat: getChat,
      postToPhone: postToPhone,
      pushFeedHiddenRawToPhone: pushFeedHiddenRawToPhone,
      findHostMessageIndex: findHostMessageIndex,
      getHostMessageRaw: getHostMessageRaw,
      extractValidVVFeedSyncBlock: extractValidVVFeedSyncBlock,
      appendFeedSyncToHostHiddenData: appendFeedSyncToHostHiddenData,
      runTriggerSlash: runTriggerSlash
    };
  }

  function init() {
    log('loaded version:', VERSION);
    log('config:', VV_HOST_CONFIG);

    bindMessageListener();
    startFeedHiddenDataWatcher();
    initRPPoller();
    initAiFeedPostDetector();
    initUserInputPoller();
    exposeDebugApi();

    log('host-feed-core loaded');
  }

  init();
})();