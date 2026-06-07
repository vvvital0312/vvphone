(function () {
  'use strict';

  if (window.__VV_HOST_SUMMON_CORE_INSTALLED__) {
    console.log('[VVHOST][SUMMON] already installed, skip');
    return;
  }

  window.__VV_HOST_SUMMON_CORE_INSTALLED__ = true;

  var VV_HOST_CONFIG = window.VV_HOST_CONFIG || {};
  var HOST_TYPE = VV_HOST_CONFIG.hostType || 'summon';
  var PHONE_FRAME_ID = VV_HOST_CONFIG.phoneFrameId || 'phoneFrame';
  var PHONE_ORIGIN = VV_HOST_CONFIG.phoneOrigin || 'https://vvvital0312.github.io';
  var VERSION = VV_HOST_CONFIG.version || 'SUMMON-CALL-INTERCEPT-003';

  var DEBUG = true;

  var lastExpectedChatId = '';
  var lastVVChatSyncRaw = '';
  var lastViewId = '';

  var lastExpectedDiaryId = '';
  var lastExpectedDiaryAuthorId = '';
  var lastVVDiarySyncRaw = '';

  var lastExpectedFeedPostId = '';
  var lastFeedSyncRaw = '';

  var lastPushedFeedHiddenRaw = '';
  var lastPushedFeedHiddenSig = '';

  var activePoll = null;
  var activeFeedIntercept = null;

  function log() {
    if (!DEBUG) return;
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[VVHOST][SUMMON]');
    console.log.apply(console, args);
  }

  function warn() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[VVHOST][SUMMON]');
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

  function escapeRegExp(s) {
    return safeString(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
        mes.indexOf('vvphone') !== -1 ||
        mes.indexOf('phoneFrame') !== -1 ||
        mes.indexOf('VV_FEED_HIDDEN_DATA') !== -1 ||
        mes.indexOf('VV_DIARY_SYNC') !== -1 ||
        mes.indexOf('VV_ANNOTATION_SYNC') !== -1
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

    log('[DELETE] floors to delete:', indices);

    for (var i = 0; i < indices.length; i++) {
      var idx = indices[i];

      try {
        var ctx = getCtx();

        if (ctx && typeof ctx.deleteMessage === 'function') {
          await ctx.deleteMessage(idx);
          log('[DELETE] deleted by ctx.deleteMessage:', idx);
          continue;
        }

        if (typeof deleteMessage === 'function') {
          await deleteMessage(idx);
          log('[DELETE] deleted by deleteMessage:', idx);
          continue;
        }

        if (window.parent && typeof window.parent.deleteMessage === 'function') {
          await window.parent.deleteMessage(idx);
          log('[DELETE] deleted by parent.deleteMessage:', idx);
          continue;
        }

        if (Array.isArray(chat) && chat[idx]) {
          chat.splice(idx, 1);
          log('[DELETE] deleted by splice:', idx);
        }
      } catch (err) {
        warn('[DELETE] failed:', idx, err);
      }
    }

    await saveChatIfPossible();
    return true;
  }

  function getTopField(block, key) {
    block = safeString(block);
    key = safeString(key);

    var re = new RegExp('^' + escapeRegExp(key) + '\\s*=\\s*([^\\n\\r]*)', 'm');
    var m = block.match(re);

    return m ? m[1].trim() : '';
  }

  function extractBlock(rawText, tag) {
    rawText = safeString(rawText);
    tag = safeString(tag);

    var re = new RegExp('\\[' + escapeRegExp(tag) + '\\]([\\s\\S]*?)\\[\\/' + escapeRegExp(tag) + '\\]', 'g');
    var match = re.exec(rawText);

    if (!match) return '';

    return '[' + tag + ']' + match[1] + '[/' + tag + ']';
  }

  function extractAllBlocks(rawText, tag) {
    rawText = safeString(rawText);
    tag = safeString(tag);

    var arr = [];
    var re = new RegExp('\\[' + escapeRegExp(tag) + '\\]([\\s\\S]*?)\\[\\/' + escapeRegExp(tag) + '\\]', 'g');
    var match;

    while ((match = re.exec(rawText))) {
      arr.push('[' + tag + ']' + match[1] + '[/' + tag + ']');
    }

    return arr;
  }

  function extractValidVVChatSyncBlock(rawText, expectedChatId) {
    var blocks = extractAllBlocks(rawText, 'VV_CHAT_SYNC');

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      var chatId = getTopField(block, 'chatId');

      if (expectedChatId && chatId && chatId !== expectedChatId) continue;

      if (block.indexOf('[消息]') !== -1) return block;
    }

    return '';
  }

  function extractValidVVCallSyncBlock(rawText) {
    var block = extractBlock(rawText, 'VV_CALL_SYNC');
    if (!block) return '';
    if (block.indexOf('callPhase=') === -1) return '';
    return block;
  }

  function extractValidVVDiarySyncBlock(rawText, expectedDiaryId, expectedAuthorId) {
    var blocks = extractAllBlocks(rawText, 'VV_DIARY_SYNC');

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      var diaryId = getTopField(block, 'diaryId');
      var authorId = getTopField(block, 'authorId');

      if (expectedDiaryId && diaryId && diaryId !== expectedDiaryId) continue;

      if (expectedAuthorId && authorId && authorId !== expectedAuthorId) {
        // 日记链路之前已经放宽过，这里不强拦，只打日志
        log('[DIARY] authorId mismatch but accepted:', authorId, expectedAuthorId);
      }

      return block;
    }

    return '';
  }

  function extractValidVVAnnotationSyncBlock(rawText) {
    var block = extractBlock(rawText, 'VV_ANNOTATION_SYNC');
    if (!block) return '';
    return block;
  }

  function extractValidVVFeedSyncBlock(rawText, expectedPostId) {
    var blocks = extractAllBlocks(rawText, 'VV_FEED_SYNC');

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      var postId = getTopField(block, 'postId');

      if (expectedPostId && postId && postId !== expectedPostId) continue;

      if (block.indexOf('[互动]') !== -1) return block;
    }

    return '';
  }

  function postChatSyncToPhone(raw, chatId, viewId) {
    if (!raw) return false;

    lastVVChatSyncRaw = raw;

    return postToPhone({
      type: 'VVPHONE_CHAT_SYNC',
      raw: raw,
      chatId: chatId || getTopField(raw, 'chatId') || '',
      viewId: viewId || lastViewId || ''
    });
  }

  function postCallSyncToPhone(raw, viewId) {
    if (!raw) return false;

    return postToPhone({
      type: 'VVPHONE_CALL_SYNC',
      raw: raw,
      viewId: viewId || lastViewId || ''
    });
  }

  function postDiarySyncToPhone(raw, diaryId, authorId, viewId) {
    if (!raw) return false;

    lastVVDiarySyncRaw = raw;

    return postToPhone({
      type: 'VVPHONE_DIARY_SYNC',
      raw: raw,
      diaryId: diaryId || getTopField(raw, 'diaryId') || '',
      authorId: authorId || getTopField(raw, 'authorId') || '',
      viewId: viewId || lastViewId || ''
    });
  }

  function postAnnotationSyncToPhone(raw, viewId) {
    if (!raw) return false;

    return postToPhone({
      type: 'VVPHONE_ANNOTATION_SYNC',
      raw: raw,
      viewId: viewId || lastViewId || ''
    });
  }

  function postFeedSyncToPhone(raw, viewId) {
    if (!raw) return false;

    lastFeedSyncRaw = raw;

    return postToPhone({
      type: 'VVPHONE_FEED_SYNC',
      raw: raw,
      viewId: viewId || lastViewId || ''
    });
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
      log('[FEED] initial block already exists for', postId);
      return true;
    }

    var block = buildInitialFeedHiddenBlockFromCommand(command);

    if (!block) return false;

    var nextRaw = hostRaw + '\n' + block;

    await updateHostMessageRaw(nextRaw);

    log('[FEED] initial block written for', postId);

    pushFeedHiddenRawToPhone(nextRaw, 'feed-initial-written');

    return true;
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
      var bid = getTopField(block, 'postId');

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

    var postId = getTopField(feedSyncBlock, 'postId');
    var time = getTopField(feedSyncBlock, 'time');
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

    var postId = getTopField(feedSyncBlock, 'postId');

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
        raw.indexOf('系统指令') !== -1 ||
        raw.indexOf('VV_EVENT') !== -1 ||
        raw.indexOf('VV_FEED_SYNC') !== -1 ||
        raw.indexOf('VV_DIARY_SYNC') !== -1 ||
        raw.indexOf('VV_ANNOTATION_SYNC') !== -1 ||
        short.indexOf(cmdShort.slice(0, 60)) !== -1
      ) {
        return i;
      }
    }

    return -1;
  }

  function findLatestAssistantReplyIndex(startIndex, mode, expected) {
    var chat = getChat();

    for (var i = chat.length - 1; i >= 0; i--) {
      if (typeof startIndex === 'number' && i <= startIndex) continue;

      var raw = getMessageText(chat[i]);

      if (!raw) continue;

      if (mode === 'chat') {
        if (extractValidVVChatSyncBlock(raw, expected.chatId)) return i;
      } else if (mode === 'call') {
        if (extractValidVVCallSyncBlock(raw)) return i;
      } else if (mode === 'diary') {
        if (extractValidVVDiarySyncBlock(raw, expected.diaryId, expected.authorId)) return i;
      } else if (mode === 'annotation') {
        if (extractValidVVAnnotationSyncBlock(raw)) return i;
      } else if (mode === 'feed') {
        if (extractValidVVFeedSyncBlock(raw, expected.postId)) return i;
      } else {
        if (
          extractBlock(raw, 'VV_CHAT_SYNC') ||
          extractBlock(raw, 'VV_CALL_SYNC') ||
          extractBlock(raw, 'VV_DIARY_SYNC') ||
          extractBlock(raw, 'VV_ANNOTATION_SYNC') ||
          extractBlock(raw, 'VV_FEED_SYNC')
        ) {
          return i;
        }
      }
    }

    return -1;
  }

  async function executeSlashCommand(command) {
    command = safeString(command);

    if (!command) {
      return {
        ok: false,
        error: 'empty command'
      };
    }

    log('[COMMAND]', command);

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

  function detectMode(payload, command) {
    payload = payload || {};
    command = safeString(command);

    if (payload.feedMode || payload.postId || command.indexOf('VV_FEED_SYNC') !== -1 || command.indexOf('朋友圈动态') !== -1 || extractPostIdFromText(command)) {
      return 'feed';
    }

    if (payload.diaryMode || payload.diaryId || command.indexOf('VV_DIARY_SYNC') !== -1 || command.indexOf('AI写日记') !== -1) {
      return 'diary';
    }

    if (payload.annotationMode || payload.annotationId || command.indexOf('VV_ANNOTATION_SYNC') !== -1 || command.indexOf('标注') !== -1) {
      return 'annotation';
    }

    if (payload.callMode || command.indexOf('VV_CALL_SYNC') !== -1 || command.indexOf('type=call') !== -1 || command.indexOf('通话阶段') !== -1) {
      return 'call';
    }

    if (payload.chatMode || payload.chatId || command.indexOf('VV_CHAT_SYNC') !== -1 || command.indexOf('聊天ID') !== -1) {
      return 'chat';
    }

    return 'chat';
  }

  async function pollForAssistantReply(options) {
    options = options || {};

    var mode = options.mode || 'chat';
    var startIndex = typeof options.startIndex === 'number' ? options.startIndex : getChat().length - 1;
    var requestIndex = typeof options.requestIndex === 'number' ? options.requestIndex : -1;
    var viewId = options.viewId || '';
    var expected = options.expected || {};
    var timeoutMs = options.timeoutMs || 90000;
    var intervalMs = options.intervalMs || 1000;
    var startedAt = Date.now();

    activePoll = {
      mode: mode,
      startedAt: startedAt
    };

    log('[POLL] started mode=', mode, 'startIndex=', startIndex, 'requestIndex=', requestIndex);

    while (Date.now() - startedAt < timeoutMs) {
      var replyIndex = findLatestAssistantReplyIndex(startIndex, mode, expected);

      if (replyIndex >= 0) {
        var chat = getChat();
        var rawText = getMessageText(chat[replyIndex]);

        log('[POLL] intercepted reply index=', replyIndex, 'mode=', mode);

        var handled = false;

        if (mode === 'feed') {
          var feedBlock = extractValidVVFeedSyncBlock(rawText, expected.postId);

          if (feedBlock) {
            await appendFeedSyncToHostHiddenData(feedBlock);
            handled = true;
          }
        } else if (mode === 'diary') {
          var diaryBlock = extractValidVVDiarySyncBlock(rawText, expected.diaryId, expected.authorId);

          if (diaryBlock) {
            postDiarySyncToPhone(diaryBlock, expected.diaryId, expected.authorId, viewId);
            handled = true;
          }
        } else if (mode === 'annotation') {
          var annotationBlock = extractValidVVAnnotationSyncBlock(rawText);

          if (annotationBlock) {
            postAnnotationSyncToPhone(annotationBlock, viewId);
            handled = true;
          }
        } else if (mode === 'call') {
          var callBlock = extractValidVVCallSyncBlock(rawText);

          if (callBlock) {
            postCallSyncToPhone(callBlock, viewId);
            handled = true;
          }
        } else {
          var chatBlock = extractValidVVChatSyncBlock(rawText, expected.chatId);

          if (chatBlock) {
            postChatSyncToPhone(chatBlock, expected.chatId, viewId);
            handled = true;
          }
        }

        if (handled) {
          var del = [];

          if (replyIndex >= 0) del.push(replyIndex);
          if (requestIndex >= 0) del.push(requestIndex);

          await deleteChatFloors(del);

          activePoll = null;
          activeFeedIntercept = null;

          return {
            ok: true,
            mode: mode,
            replyIndex: replyIndex
          };
        }
      }

      await sleep(intervalMs);
    }

    activePoll = null;
    activeFeedIntercept = null;

    warn('[POLL] timeout mode=', mode);

    return {
      ok: false,
      mode: mode,
      error: 'timeout'
    };
  }

  async function runTriggerSlash(payload) {
    payload = payload || {};

    var command = safeString(payload.command || payload.slash || payload.text || '');
    var viewId = safeString(payload.viewId || payload.requestId || '');
    var chatId = safeString(payload.chatId || '');
    var diaryId = safeString(payload.diaryId || '');
    var authorId = safeString(payload.authorId || payload.diaryAuthorId || '');
    var postId = safeString(payload.postId || extractPostIdFromText(command));
    var mode = detectMode(payload, command);

    lastViewId = viewId;

    if (chatId) lastExpectedChatId = chatId;
    if (diaryId) lastExpectedDiaryId = diaryId;
    if (authorId) lastExpectedDiaryAuthorId = authorId;
    if (postId) lastExpectedFeedPostId = postId;

    log('[MODE CHECK]', {
      hostType: HOST_TYPE,
      mode: mode,
      chatId: chatId,
      diaryId: diaryId,
      authorId: authorId,
      postId: postId,
      viewId: viewId
    });

    var chatBefore = getChat();
    var startIndex = chatBefore.length - 1;

    if (mode === 'feed' && postId) {
      await ensureInitialFeedBlockWritten(command);
    }

    var execResult = await executeSlashCommand(command);

    postToPhone({
      type: 'VV_EXECUTE_RESULT',
      ok: !!execResult.ok,
      result: execResult.result || null,
      error: execResult.error || '',
      viewId: viewId,
      chatId: chatId,
      diaryId: diaryId,
      authorId: authorId,
      postId: postId,
      mode: mode
    });

    if (!execResult.ok) {
      warn('[runTriggerSlash] slash execute failed:', execResult.error);
      return execResult;
    }

    var requestIndex = findSlashRequestFloorIndex(command, startIndex);

    if (mode === 'feed') {
      activeFeedIntercept = {
        postId: postId,
        startedAt: Date.now()
      };
    }

    pollForAssistantReply({
      mode: mode,
      startIndex: startIndex,
      requestIndex: requestIndex,
      viewId: viewId,
      expected: {
        chatId: chatId || lastExpectedChatId,
        diaryId: diaryId || lastExpectedDiaryId,
        authorId: authorId || lastExpectedDiaryAuthorId,
        postId: postId || lastExpectedFeedPostId
      },
      timeoutMs: 90000,
      intervalMs: 1000
    });

    return {
      ok: true,
      mode: mode
    };
  }

  function handleRawLLMReply(payload) {
    payload = payload || {};

    var rawText = safeString(payload.raw || payload.text || payload.message || '');
    var viewId = safeString(payload.viewId || lastViewId || '');
    var expectedChatId = safeString(payload.chatId || lastExpectedChatId || '');
    var expectedDiaryId = safeString(payload.diaryId || lastExpectedDiaryId || '');
    var expectedDiaryAuthorId = safeString(payload.authorId || payload.diaryAuthorId || lastExpectedDiaryAuthorId || '');
    var expectedPostId = safeString(payload.postId || lastExpectedFeedPostId || '');

    if (!rawText) return false;

    var handled = false;

    var callBlock = extractValidVVCallSyncBlock(rawText);
    if (callBlock) {
      postCallSyncToPhone(callBlock, viewId);
      handled = true;
    }

    var chatBlock = extractValidVVChatSyncBlock(rawText, expectedChatId);
    if (chatBlock) {
      postChatSyncToPhone(chatBlock, expectedChatId, viewId);
      handled = true;
    }

    var diaryBlock = extractValidVVDiarySyncBlock(rawText, expectedDiaryId, expectedDiaryAuthorId);
    if (diaryBlock) {
      postDiarySyncToPhone(diaryBlock, expectedDiaryId, expectedDiaryAuthorId, viewId);
      handled = true;
    }

    var annotationBlock = extractValidVVAnnotationSyncBlock(rawText);
    if (annotationBlock) {
      postAnnotationSyncToPhone(annotationBlock, viewId);
      handled = true;
    }

    var feedBlock = extractValidVVFeedSyncBlock(rawText, expectedPostId);
    if (feedBlock) {
      appendFeedSyncToHostHiddenData(feedBlock);
      handled = true;
    }

    if (!handled) {
      log('VV_RAW_LLM_REPLY has no valid sync block');
    }

    return handled;
  }

  function scanCurrentFloorForSyncBlocks() {
    var chat = getChat();

    if (!Array.isArray(chat) || !chat.length) return;

    for (var i = 0; i < chat.length; i++) {
      var raw = getMessageText(chat[i]);

      if (!raw) continue;

      if (raw.indexOf('VV_FEED_HIDDEN_DATA') !== -1) {
        pushFeedHiddenRawToPhone(raw, 'phone-ready-scan-feed-hidden');
      }

      var chatBlock = extractValidVVChatSyncBlock(raw, lastExpectedChatId);
      if (chatBlock) {
        postChatSyncToPhone(chatBlock, lastExpectedChatId, lastViewId);
      }

      var diaryBlock = extractValidVVDiarySyncBlock(raw, lastExpectedDiaryId, lastExpectedDiaryAuthorId);
      if (diaryBlock) {
        postDiarySyncToPhone(diaryBlock, lastExpectedDiaryId, lastExpectedDiaryAuthorId, lastViewId);
      }

      var annotationBlock = extractValidVVAnnotationSyncBlock(raw);
      if (annotationBlock) {
        postAnnotationSyncToPhone(annotationBlock, lastViewId);
      }

      var callBlock = extractValidVVCallSyncBlock(raw);
      if (callBlock) {
        postCallSyncToPhone(callBlock, lastViewId);
      }
    }
  }

  function handlePhoneReady() {
    log('phone ready, scanning current floor for sync blocks...');

    scanCurrentFloorForSyncBlocks();

    postToPhone({
      type: 'VV_HOST_READY',
      hostType: HOST_TYPE,
      version: VERSION
    });
  }

  function handleRequestFeedBranch() {
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

  function handleResendLastChatSync(payload) {
    payload = payload || {};

    if (lastVVChatSyncRaw) {
      postChatSyncToPhone(lastVVChatSyncRaw, payload.chatId || lastExpectedChatId, payload.viewId || lastViewId);
    }
  }

  function handleResendLastDiarySync(payload) {
    payload = payload || {};

    if (lastVVDiarySyncRaw) {
      postDiarySyncToPhone(
        lastVVDiarySyncRaw,
        payload.diaryId || lastExpectedDiaryId,
        payload.authorId || lastExpectedDiaryAuthorId,
        payload.viewId || lastViewId
      );
    }
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

      if (type === 'VV_RESEND_LAST_CHAT_SYNC') {
        handleResendLastChatSync(data);
        return;
      }

      if (type === 'VV_RESEND_LAST_DIARY_SYNC') {
        handleResendLastDiarySync(data);
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
        if (activeFeedIntercept) {
          return;
        }

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

  function exposeDebugApi() {
    window.VV_SUMMON_HOST = {
      version: VERSION,
      getCtx: getCtx,
      getChat: getChat,
      postToPhone: postToPhone,
      runTriggerSlash: runTriggerSlash,
      handleRawLLMReply: handleRawLLMReply,
      findHostMessageIndex: findHostMessageIndex,
      getHostMessageRaw: getHostMessageRaw,
      pushFeedHiddenRawToPhone: pushFeedHiddenRawToPhone,
      appendFeedSyncToHostHiddenData: appendFeedSyncToHostHiddenData,
      extractValidVVChatSyncBlock: extractValidVVChatSyncBlock,
      extractValidVVCallSyncBlock: extractValidVVCallSyncBlock,
      extractValidVVDiarySyncBlock: extractValidVVDiarySyncBlock,
      extractValidVVAnnotationSyncBlock: extractValidVVAnnotationSyncBlock,
      extractValidVVFeedSyncBlock: extractValidVVFeedSyncBlock
    };
  }

  function init() {
    log('loaded version:', VERSION);
    log('config:', VV_HOST_CONFIG);

    bindMessageListener();
    startFeedHiddenDataWatcher();
    initAiFeedPostDetector();
    exposeDebugApi();

    log('host-summon-core loaded');
  }

  init();
})();