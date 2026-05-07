(function () {
  const VVHostBridge = {
    frame: null,
    frameReady: false,

    lastChatSyncRaw: '',
    lastChatSyncChatId: '',

    lastContext: {
      type: 'chat',
      command: '',
      chatId: '',
      postId: '',
      senderName: '',
      bridgeName: ''
    },

    init() {
      this.frame = document.getElementById('vvphoneFrame');
      this.bindFrameReady();
      this.bindEvents();
      this.log('宿主页桥接已启动', 'ok');
    },

    bindFrameReady() {
      const refreshFrame = () => {
        this.frame = document.getElementById('vvphoneFrame');
        this.frameReady = !!(this.frame && this.frame.contentWindow);
      };

      refreshFrame();

      if (this.frame) {
        this.frame.addEventListener('load', () => {
          refreshFrame();
          this.log('iframe load 完成', 'ok', {
            frameReady: this.frameReady
          });
        });
      }

      setTimeout(refreshFrame, 50);
      setTimeout(refreshFrame, 300);
      setTimeout(refreshFrame, 1000);
    },

    bindEvents() {
      window.addEventListener('message', async (event) => {
        const data = event.data;
        if (!data || typeof data !== 'object') return;

        const fromFrame = !!(this.frame && event.source === this.frame.contentWindow);
        const fromSelf = event.source === window;

        this.log('收到 message', 'ok', {
          type: data.type || '',
          requestId: data.requestId || '',
          viewId: data.viewId || '',
          chatId: data.chatId || '',
          fromFrame,
          fromSelf
        });

        if (!fromFrame && !fromSelf) {
          return;
        }

        if (data.type === 'VV_EXECUTE_SLASH' || data.type === 'VVPHONE_SLASH') {
          await this.handleSlashRequest(data);
          return;
        }

        if (data.type === 'VVPHONE_RESEND_LAST_CHAT_SYNC') {
          this.log('收到补发请求', 'warn', data);
          this.resendLastChatSync(data.chatId || '', data.viewId || '');
          return;
        }
      });
    },

    async handleSlashRequest(data) {
      const command = data.command || '';
      const requestId = data.requestId || '';
      const viewId = data.viewId || '';

      const parsed = this.parseCommand(command);

      this.lastContext = {
        ...this.lastContext,
        ...parsed,
        command
      };

      this.log('收到 Slash 请求', 'ok', {
        type: data.type,
        command,
        parsed,
        requestId,
        viewId
      });

      const mode = this.getReplyMode();

      if (mode === 'passthrough') {
        this.replyExecuteResult({
          requestId,
          viewId,
          ok: true,
          error: null
        });

        this.log('当前为 passthrough 模式：仅记录命令，不自动回传聊天内容', 'warn');
        return;
      }

      if (mode === 'manual') {
        this.replyExecuteResult({
          requestId,
          viewId,
          ok: true,
          error: null
        });

        this.log('当前为 manual 模式：等待你点击“发送手动回传”', 'warn');
        return;
      }

      try {
        const result = await this.mockExecute(command, parsed);

        this.replyExecuteResult({
          requestId,
          viewId,
          ok: true,
          error: null
        });

        this.handleMockResult(result, parsed, {
          requestId,
          viewId
        });
      } catch (err) {
        console.error('[VVHostBridge] mockExecute error:', err);

        this.replyExecuteResult({
          requestId,
          viewId,
          ok: false,
          error: err?.message || 'mockExecute failed'
        });

        this.log('mockExecute 执行失败', 'err', {
          message: err?.message || String(err)
        });
      }
    },

    replyExecuteResult({ requestId, viewId, ok, error }) {
      const payload = {
        type: 'VV_EXECUTE_RESULT',
        requestId: requestId || '',
        viewId: viewId || '',
        ok: !!ok,
        error: error || null
      };

      this.emitToPhone(payload);

      this.log('已回传 VV_EXECUTE_RESULT', ok ? 'ok' : 'err', payload);
    },

    emitToPhone(payload) {
      let postedToFrame = false;
      let postedToWindow = false;

      try {
        this.frame = document.getElementById('vvphoneFrame') || this.frame;

        if (this.frame && this.frame.contentWindow) {
          this.frame.contentWindow.postMessage(payload, '*');
          postedToFrame = true;
        }
      } catch (e) {
        console.warn('[VVHostBridge] frame.contentWindow.postMessage failed:', e);
      }

      try {
        window.postMessage(payload, '*');
        postedToWindow = true;
      } catch (e) {
        console.warn('[VVHostBridge] window.postMessage failed:', e);
      }

      this.log('emitToPhone', postedToFrame || postedToWindow ? 'ok' : 'err', {
        type: payload?.type || '',
        viewId: payload?.viewId || '',
        chatId: payload?.chatId || '',
        postedToFrame,
        postedToWindow
      });

      return postedToFrame || postedToWindow;
    },

    resendLastChatSync(chatId, viewId) {
      if (!this.lastChatSyncRaw) {
        this.log('没有可补发的 lastChatSyncRaw', 'warn');
        return false;
      }

      if (chatId && this.lastChatSyncChatId && chatId !== this.lastChatSyncChatId) {
        this.log('lastChatSyncRaw chatId 不匹配，取消补发', 'warn', {
          expect: chatId,
          actual: this.lastChatSyncChatId
        });
        return false;
      }

      const payload = {
        type: 'VVPHONE_CHAT_SYNC',
        chatId: this.lastChatSyncChatId || chatId || '',
        raw: this.lastChatSyncRaw,
        viewId: viewId || ''
      };

      const ok = this.emitToPhone(payload);

      this.log(ok ? '已补发 last VVPHONE_CHAT_SYNC' : '补发 last VVPHONE_CHAT_SYNC 失败', ok ? 'ok' : 'err', {
        chatId: payload.chatId,
        viewId: payload.viewId,
        raw: String(this.lastChatSyncRaw || '').slice(0, 500)
      });

      return ok;
    },

    parseCommand(command) {
      const text = String(command || '');

      let type = 'chat';
      if (text.includes('[电话模式]')) type = 'call';
      if (text.includes('[朋友圈互动]')) type = 'feed';

      let bridgeName = '';
      const sendMatch = text.match(/^\/send\s+([^\n|]+)/mi);
      if (sendMatch) {
        bridgeName = sendMatch[1].trim();
      }

      let chatId = '';
      const chatIdMatch = text.match(/聊天ID\s*[:：]\s*([^\n]+)/i);
      if (chatIdMatch) {
        chatId = chatIdMatch[1].trim();
      }

      let postId = '';
      const postIdMatch = text.match(/动态ID\s*[:：]\s*([^\n]+)/i);
      if (postIdMatch) {
        postId = postIdMatch[1].trim();
      }

      return {
        type,
        chatId,
        postId,
        senderName: bridgeName || this.getDefaultSender(),
        bridgeName: bridgeName || this.getDefaultSender()
      };
    },

    normalizeSyncFieldText(text) {
      return String(text == null ? '' : text)
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n/g, '\\n');
    },

    async mockExecute(command, parsed) {
      await this.sleep(500);

      if (parsed.type === 'call') {
        const status = this.getSelectedCallStatus();
        return {
          kind: 'call',
          status,
          text: status === 'accepted'
            ? '我接到了，你说吧。'
            : status === 'rejected'
              ? '现在不方便接。'
              : '刚才没能及时接到。'
        };
      }

      if (parsed.type === 'feed') {
        return {
          kind: 'feed',
          text: this.buildMockFeedReply(command, parsed)
        };
      }

      const raw = this.buildMockChatReply(command, parsed);

      return {
        kind: 'chat',
        raw,
        text: raw
      };
    },

    handleMockResult(result, parsed, meta = {}) {
      const viewId = meta.viewId || '';

      if (result.kind === 'call') {
        this.emitToPhone({
          type: 'VVPHONE_CALL_STATUS',
          chatId: parsed.chatId || '',
          status: result.status,
          viewId
        });

        this.log('已回传 VVPHONE_CALL_STATUS', 'ok', result);
        return;
      }

      if (result.kind === 'feed') {
        this.emitToPhone({
          type: 'VVPHONE_FEED_REPLY',
          postId: parsed.postId || '',
          senderName: parsed.senderName || this.getDefaultSender(),
          text: result.text || '……',
          replyTo: '',
          viewId
        });

        this.log('已回传 VVPHONE_FEED_REPLY', 'ok', result);
        return;
      }

      if (result.kind === 'chat') {
        const raw = result.raw || result.text || '';

        this.lastChatSyncRaw = raw || '';
        this.lastChatSyncChatId = parsed.chatId || '';

        if (raw && raw.includes('[VV_CHAT_SYNC]')) {
          this.emitToPhone({
            type: 'VVPHONE_CHAT_SYNC',
            chatId: parsed.chatId || '',
            raw,
            viewId
          });

          this.log('已回传 VVPHONE_CHAT_SYNC', 'ok', {
            chatId: parsed.chatId || '',
            viewId,
            raw: raw.slice(0, 500)
          });
          return;
        }

        this.emitToPhone({
          type: 'VVPHONE_REPLY',
          chatId: parsed.chatId || '',
          senderName: parsed.senderName || this.getDefaultSender(),
          text: result.text || '……',
          viewId
        });

        this.log('已回传 VVPHONE_REPLY(fallback)', 'ok', result);
        return;
      }

      this.emitToPhone({
        type: 'VVPHONE_REPLY',
        chatId: parsed.chatId || '',
        senderName: parsed.senderName || this.getDefaultSender(),
        text: result.text || '……',
        viewId
      });

      this.log('已回传 VVPHONE_REPLY(default)', 'ok', result);
    },

    buildMockChatReply(command, parsed) {
      const prompt = this.extractPrompt(command);
      const sender = parsed.senderName || this.getDefaultSender();
      const fallbackChatId = parsed.chatId || '';
      const fallbackTarget = parsed.bridgeName || parsed.senderName || this.getDefaultSender();
      const fallbackTime = this.formatNowLabel();

      const eventMatch = String(prompt).match(/\[VV_EVENT\]([\s\S]*?)\[\/VV_EVENT\]/i);
      const eventBody = eventMatch ? eventMatch[1] : '';

      const readField = (name, fallback = '') => {
        const m = String(eventBody).match(new RegExp(`^\\s*${name}=(.*)$`, 'mi'));
        return m ? m[1].trim() : fallback;
      };

      const chatId = readField('chatId', fallbackChatId);
      const target = readField('target', fallbackTarget);
      const time = readField('time', fallbackTime);
      const rawMessage = readField('message', '').replace(/\\n/g, '\n');

      const myAvatarKey = 'current_my_avatar';
      const targetAvatarId = readField('targetAvatarId', 'contact_unknown_avatar');
      const myBubble = readField('myBubble', '#5B86FF');
      const targetBubble = readField('targetBubble', '#F8F8F8');
      const chatBgKey = readField('chatBgKey', 'current_chat_bg');

      const userLines = rawMessage
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      let replyText = '我看到了，我们继续聊吧。';
      let transferAction = '';
      let transferAmount = '';
      let transferNote = '';

      const joined = userLines.join('\n');

      if (joined.includes('[转账]')) {
        replyText = '我收到了，谢谢你。';
        transferAction = 'accept';
      } else if (joined.includes('[图片]')) {
        replyText = '我看到你发来的图片了。';
      } else if (joined.includes('[语音]')) {
        replyText = '我听完了。';
      } else if (joined.includes('[表情]')) {
        replyText = '这个表情我看到了。';
      } else {
        const lastLine = userLines[userLines.length - 1] || '继续聊聊吧';
        replyText = `我看到了，你刚才说的是“${lastLine}”。`;
      }

      const rightMsgs = userLines.map(line => [
        '[消息]',
        'side=right',
        'sender=我',
        `content=${this.normalizeSyncFieldText(line)}`,
        'state=sent',
        '[/消息]'
      ].join('\n')).join('\n\n');

      const leftMsg = [
        '[消息]',
        'side=left',
        `sender=${this.normalizeSyncFieldText(sender)}`,
        `content=${this.normalizeSyncFieldText(replyText)}`,
        'state=sent',
        transferAction ? `transferAction=${this.normalizeSyncFieldText(transferAction)}` : '',
        transferAmount ? `transferAmount=${this.normalizeSyncFieldText(transferAmount)}` : '',
        transferNote ? `transferNote=${this.normalizeSyncFieldText(transferNote)}` : '',
        '[/消息]'
      ].filter(Boolean).join('\n');

      return [
        '[VV_CHAT_SYNC]',
        `chatId=${this.normalizeSyncFieldText(chatId)}`,
        `target=${this.normalizeSyncFieldText(target)}`,
        `time=${this.normalizeSyncFieldText(time)}`,
        `myAvatarKey=${this.normalizeSyncFieldText(myAvatarKey)}`,
        `targetAvatarId=${this.normalizeSyncFieldText(targetAvatarId)}`,
        `myBubble=${this.normalizeSyncFieldText(myBubble)}`,
        `targetBubble=${this.normalizeSyncFieldText(targetBubble)}`,
        `chatBgKey=${this.normalizeSyncFieldText(chatBgKey)}`,
        '',
        rightMsgs,
        '',
        leftMsg,
        '[/VV_CHAT_SYNC]'
      ].join('\n');
    },

    buildMockFeedReply(command, parsed) {
      const sender = parsed.senderName || this.getDefaultSender();
      const prompt = this.extractPrompt(command);
      const lastLine = this.getLastMeaningfulLine(prompt);
      return `${sender}：关于“${lastLine || '这条动态'}”，我也想补一句。`;
    },

    extractPrompt(command) {
      const text = String(command || '');
      const lines = text.split('\n');

      const filtered = lines.filter(line => {
        const t = line.trim();
        if (!t) return false;
        if (t.startsWith('/send ')) return false;
        if (t === '[私聊回复]') return false;
        if (t === '[群聊回复]') return false;
        if (t === '[电话模式]') return false;
        if (t === '[朋友圈互动]') return false;
        if (/^聊天ID\s*[:：]/.test(t)) return false;
        if (/^动态ID\s*[:：]/.test(t)) return false;
        if (t.includes('|/trigger')) return false;
        return true;
      });

      return filtered.join('\n').replace(/\|\/trigger/g, '').trim();
    },

    getLastMeaningfulLine(text) {
      const arr = String(text || '').split('\n').map(s => s.trim()).filter(Boolean);
      return arr.length ? arr[arr.length - 1] : '';
    },

    sendManualReply() {
      const text = document.getElementById('hostManualReply')?.value.trim();
      const manualType = document.getElementById('hostManualType')?.value || 'chat';
      const senderName = this.getDefaultSender();
      const viewId = window.__vv_view_id || '';

      if (!text) {
        alert('请先填写手动回复内容');
        return;
      }

      if (manualType === 'feed') {
        this.emitToPhone({
          type: 'VVPHONE_FEED_REPLY',
          postId: this.lastContext.postId || '',
          senderName,
          text,
          replyTo: '',
          viewId
        });

        this.log('手动回传 VVPHONE_FEED_REPLY', 'ok', {
          postId: this.lastContext.postId || '',
          senderName,
          text
        });
        return;
      }

      if (manualType === 'call') {
        this.emitToPhone({
          type: 'VVPHONE_CALL_REPLY',
          chatId: this.lastContext.chatId || '',
          senderName,
          text,
          viewId
        });

        this.log('手动回传 VVPHONE_CALL_REPLY', 'ok', {
          chatId: this.lastContext.chatId || '',
          senderName,
          text
        });
        return;
      }

      const raw = [
        '[VV_CHAT_SYNC]',
        `chatId=${this.normalizeSyncFieldText(this.lastContext.chatId || '')}`,
        `target=${this.normalizeSyncFieldText(senderName)}`,
        `time=${this.normalizeSyncFieldText(this.formatNowLabel())}`,
        'myAvatarKey=current_my_avatar',
        'targetAvatarId=contact_unknown_avatar',
        'myBubble=#5B86FF',
        'targetBubble=#F8F8F8',
        'chatBgKey=current_chat_bg',
        '[消息]',
        'side=left',
        `sender=${this.normalizeSyncFieldText(senderName)}`,
        `content=${this.normalizeSyncFieldText(text)}`,
        'state=sent',
        '[/消息]',
        '[/VV_CHAT_SYNC]'
      ].join('\n');

      this.lastChatSyncRaw = raw;
      this.lastChatSyncChatId = this.lastContext.chatId || '';

      this.emitToPhone({
        type: 'VVPHONE_CHAT_SYNC',
        chatId: this.lastContext.chatId || '',
        raw,
        viewId
      });

      this.log('手动回传 VVPHONE_CHAT_SYNC', 'ok', {
        chatId: this.lastContext.chatId || '',
        senderName,
        raw: raw.slice(0, 500)
      });
    },

    sendManualCallStatus() {
      const status = this.getSelectedCallStatus();
      const viewId = window.__vv_view_id || '';

      this.emitToPhone({
        type: 'VVPHONE_CALL_STATUS',
        chatId: this.lastContext.chatId || '',
        status,
        viewId
      });

      this.log('手动回传 VVPHONE_CALL_STATUS', 'ok', {
        chatId: this.lastContext.chatId || '',
        status
      });
    },

    testIncomingCall() {
      const senderName = this.getDefaultSender();
      const viewId = window.__vv_view_id || '';

      this.emitToPhone({
        type: 'VVPHONE_INCOMING_CALL',
        senderName,
        bridgeName: senderName,
        viewId
      });

      this.log('已发送测试来电', 'ok', { senderName });
    },

    getReplyMode() {
      return document.getElementById('hostReplyMode')?.value || 'mock';
    },

    getDefaultSender() {
      return document.getElementById('hostDefaultSender')?.value.trim() || '角色';
    },

    getSelectedCallStatus() {
      return document.getElementById('hostCallStatus')?.value || 'accepted';
    },

    formatNowLabel() {
      const d = new Date();
      return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    },

    clearLogs() {
      const box = document.getElementById('hostLogBox');
      if (box) box.innerHTML = '';
    },

    log(title, level = 'ok', payload = null) {
      const box = document.getElementById('hostLogBox');
      if (!box) return;

      const time = new Date().toLocaleTimeString();
      const div = document.createElement('div');
      div.className = 'log-line';

      const safePayload = payload
        ? `<pre style="margin:6px 0 0;white-space:pre-wrap;color:#bdbdbd;">${this.escapeHTML(JSON.stringify(payload, null, 2))}</pre>`
        : '';

      div.innerHTML = `
        <div>
          <span class="tag ${level}">${this.escapeHTML(level.toUpperCase())}</span>
          <strong>${this.escapeHTML(time)}</strong>
        </div>
        <div style="margin-top:6px;">${this.escapeHTML(title)}</div>
        ${safePayload}
      `;

      box.appendChild(div);
      box.scrollTop = box.scrollHeight;
    },

    escapeHTML(str) {
      const amp = String.fromCharCode(38, 97, 109, 112, 59);
      const lt = String.fromCharCode(38, 108, 116, 59);
      const gt = String.fromCharCode(38, 103, 116, 59);
      const quot = String.fromCharCode(38, 113, 117, 111, 116, 59);
      const apos = String.fromCharCode(38, 35, 51, 57, 59);

      return String(str == null ? '' : str)
        .split(String.fromCharCode(38)).join(amp)
        .split(String.fromCharCode(60)).join(lt)
        .split(String.fromCharCode(62)).join(gt)
        .split(String.fromCharCode(34)).join(quot)
        .split(String.fromCharCode(39)).join(apos);
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  };

  window.VVHostBridge = VVHostBridge;
  window.addEventListener('DOMContentLoaded', () => VVHostBridge.init());
})();
