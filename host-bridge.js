(function () {
  const VVHostBridge = {
    frame: null,
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
      this.bindEvents();
      this.log('宿主页桥接已启动', 'ok');
    },

    bindEvents() {
      window.addEventListener('message', async (event) => {
        const data = event.data;
        if (!data || typeof data !== 'object') return;

        if (data.type === 'VV_EXECUTE_SLASH' || data.type === 'VVPHONE_SLASH') {
          await this.handleSlashRequest(data);
        }
      });
    },

    async handleSlashRequest(data) {
      const command = data.command || '';
      const requestId = data.requestId || '';
      const viewId = data.viewId || '';

      this.lastContext.command = command;

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
      window.postMessage({
        type: 'VV_EXECUTE_RESULT',
        requestId: requestId || '',
        viewId: viewId || '',
        ok: !!ok,
        error: error || null
      }, '*');
    },

    emitToPhone(payload) {
      try {
        window.postMessage(payload, '*');
      } catch (e) {
        console.warn('[VVHostBridge] window.postMessage failed:', e);
      }

      try {
        if (this.frame && this.frame.contentWindow) {
          this.frame.contentWindow.postMessage(payload, '*');
        }
      } catch (e) {
        console.warn('[VVHostBridge] frame.contentWindow.postMessage failed:', e);
      }
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

      this.emitToPhone({
        type: 'VVPHONE_CHAT_SYNC',
        chatId: this.lastChatSyncChatId || chatId || '',
        raw: this.lastChatSyncRaw,
        viewId: viewId || ''
      });

      this.log('已补发 last VVPHONE_CHAT_SYNC', 'ok', {
        chatId: this.lastChatSyncChatId || chatId || '',
        viewId: viewId || '',
        raw: String(this.lastChatSyncRaw || '').slice(0, 500)
      });

      return true;
    },

    parseCommand(command) {
      const text = String(command || '');

      let type = 'chat';
      if (text.includes('[电话模式]')) type = 'call';
      if (text.includes('[朋友圈互动]')) type = 'feed';

      let bridgeName = '';
      const sendMatch = text.match(/^\/send\s+([^\n|]+)/m);
      if (sendMatch) {
        bridgeName = sendMatch[1].trim();
      }

      let chatId = '';
      const chatIdMatch = text.match(/聊天ID:([^\n]+)/);
      if (chatIdMatch) {
        chatId = chatIdMatch[1].trim();
      }

      let postId = '';
      const postIdMatch = text.match(/动态ID:([^\n]+)/);
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

        if (raw && (raw.includes('[VV_CHAT_SYNC]') || raw.includes('[聊天界面]'))) {
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
      const chatId = parsed.chatId || '';
      const target = parsed.bridgeName || parsed.senderName || this.getDefaultSender();
      const time = this.formatNowLabel();

      const myAvatarKey = 'current_my_avatar';
      const targetAvatarId = 'contact_unknown_avatar';
      const myBubble = 'default';
      const targetBubble = '#F8F8F8';
      const chatBgKey = 'default';

      let replyText = '我看到了，我们继续聊吧。';
      let transferAction = '';
      let transferAmount = '';
      let transferNote = '';

      if (prompt.includes('[转账]')) {
        replyText = '我收到了，谢谢你。';
        transferAction = 'accept';
      } else if (prompt.includes('[图片]')) {
        replyText = '我看到你发来的图片了。';
      } else if (prompt.includes('[语音]')) {
        replyText = '我听完了。';
      } else if (prompt.includes('[表情]')) {
        replyText = '这个表情我看到了。';
      } else {
        const lastLine = this.getLastMeaningfulLine(prompt);
        replyText = `我看到了，你刚才说的是“${lastLine || '继续聊聊吧'}”。`;
      }

      const leftMsg = [
        '[消息]',
        'side=left',
        `sender=${sender}`,
        `content=${replyText}`,
        'state=reply',
        transferAction ? `transferAction=${transferAction}` : '',
        transferAmount ? `transferAmount=${transferAmount}` : '',
        transferNote ? `transferNote=${transferNote}` : '',
        '[/消息]'
      ].filter(Boolean).join('\n');

      return [
        '[聊天界面]',
        `chatId=${chatId}`,
        `target=${target}`,
        `time=${time}`,
        `myAvatarKey=${myAvatarKey}`,
        `targetAvatarId=${targetAvatarId}`,
        `myBubble=${myBubble}`,
        `targetBubble=${targetBubble}`,
        `chatBgKey=${chatBgKey}`,
        leftMsg,
        '[/聊天界面]',
        '[VV_CHAT_SYNC]',
        `chatId=${chatId}`,
        `target=${target}`,
        `time=${time}`,
        `myAvatarKey=${myAvatarKey}`,
        `targetAvatarId=${targetAvatarId}`,
        `myBubble=${myBubble}`,
        `targetBubble=${targetBubble}`,
        `chatBgKey=${chatBgKey}`,
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
        if (t.startsWith('聊天ID:')) return false;
        if (t.startsWith('动态ID:')) return false;
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
      if (!this.frame || !this.frame.contentWindow) {
        this.log('iframe 不存在，无法手动回传', 'err');
        return;
      }

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
        }, '*');

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
        }, '*');

        this.log('手动回传 VVPHONE_CALL_REPLY', 'ok', {
          chatId: this.lastContext.chatId || '',
          senderName,
          text
        });
        return;
      }

      const raw = [
        '[聊天界面]',
        `chatId=${this.lastContext.chatId || ''}`,
        `target=${senderName}`,
        `time=${this.formatNowLabel()}`,
        'myAvatarKey=current_my_avatar',
        'targetAvatarId=contact_unknown_avatar',
        'myBubble=default',
        'targetBubble=#F8F8F8',
        'chatBgKey=default',
        '[消息]',
        'side=left',
        `sender=${senderName}`,
        `content=${text}`,
        'state=reply',
        '[/消息]',
        '[/聊天界面]',
        '[VV_CHAT_SYNC]',
        `chatId=${this.lastContext.chatId || ''}`,
        `target=${senderName}`,
        `time=${this.formatNowLabel()}`,
        'myAvatarKey=current_my_avatar',
        'targetAvatarId=contact_unknown_avatar',
        'myBubble=default',
        'targetBubble=#F8F8F8',
        'chatBgKey=default',
        '[消息]',
        'side=left',
        `sender=${senderName}`,
        `content=${text}`,
        'state=reply',
        '[/消息]',
        '[/VV_CHAT_SYNC]'
      ].join('\n');

      this.emitToPhone({
        type: 'VVPHONE_CHAT_SYNC',
        chatId: parsed.chatId || '',
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
      if (!this.frame || !this.frame.contentWindow) {
        this.log('iframe 不存在，无法回传电话状态', 'err');
        return;
      }

      const status = this.getSelectedCallStatus();
      const viewId = window.__vv_view_id || '';

      this.emitToPhone({
        type: 'VVPHONE_CALL_STATUS',
        chatId: this.lastContext.chatId || '',
        status,
        viewId
      }, '*');

      this.log('手动回传 VVPHONE_CALL_STATUS', 'ok', {
        chatId: this.lastContext.chatId || '',
        status
      });
    },

    testIncomingCall() {
      if (!this.frame || !this.frame.contentWindow) {
        this.log('iframe 不存在，无法测试来电', 'err');
        return;
      }

      const senderName = this.getDefaultSender();
      const viewId = window.__vv_view_id || '';

      this.emitToPhone({
        type: 'VVPHONE_INCOMING_CALL',
        senderName,
        bridgeName: senderName,
        viewId
      }, '*');

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

      return String(str)
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
