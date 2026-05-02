(function () {
  const VVHostBridge = {
    frame: null,
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

        if (data.type === 'VVPHONE_SLASH') {
          this.log('收到 VVPHONE_SLASH', 'ok', data);

          try {
            await this.handleSlashRequest(data);

            event.source?.postMessage({
              type: 'VV_EXECUTE_RESULT',
              requestId: data.requestId || '',
              viewId: data.viewId || '',
              ok: true,
              error: null
            }, '*');

            this.log('已回传 VV_EXECUTE_RESULT', 'ok', {
              requestId: data.requestId || '',
              viewId: data.viewId || ''
            });
          } catch (err) {
            event.source?.postMessage({
              type: 'VV_EXECUTE_RESULT',
              requestId: data.requestId || '',
              viewId: data.viewId || '',
              ok: false,
              error: String(err?.message || err || 'unknown_error')
            }, '*');

            this.log('回传 VV_EXECUTE_RESULT 失败', 'err', err);
          }
        }
      });
    },

    async handleSlashRequest(data) {
      const command = data.command || '';
      this.lastContext.command = command;

      const parsed = this.parseCommand(command);
      this.lastContext = {
        ...this.lastContext,
        ...parsed,
        command
      };

      this.log('收到 VVPHONE_SLASH', 'ok', {
        command,
        parsed
      });

      const mode = this.getReplyMode();

      // 这里是未来你真正接 ST 的地方
      // 目前先做模拟、手动、透传三种模式

      if (mode === 'passthrough') {
        this.log('当前为 passthrough 模式：仅记录命令，不自动回传', 'warn');
        return;
      }

      if (mode === 'manual') {
        this.log('当前为 manual 模式：等待你点击“发送手动回传”', 'warn');
        return;
      }

      // mock 模式
      const result = await this.mockExecute(command, parsed);
      this.handleMockResult(result, parsed);
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
      const chatIdMatch = text.match(/聊天ID=([^\n]+)/);
      if (chatIdMatch) {
        chatId = chatIdMatch[1].trim();
      }

      let postId = '';
      const postIdMatch = text.match(/动态ID=([^\n]+)/);
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

      return {
        kind: 'chat',
        text: this.buildMockChatReply(command, parsed)
      };
    },

    handleMockResult(result, parsed) {
      if (!this.frame || !this.frame.contentWindow) {
        this.log('iframe 不存在，无法回传', 'err');
        return;
      }

      if (result.kind === 'call') {
        this.frame.contentWindow.postMessage({
          type: 'VVPHONE_CALL_STATUS',
          chatId: parsed.chatId || '',
          status: result.status
        }, '*');

        this.log('已回传 VVPHONE_CALL_STATUS', 'ok', result);
        return;
      }

      if (result.kind === 'feed') {
        this.frame.contentWindow.postMessage({
          type: 'VVPHONE_FEED_REPLY',
          postId: parsed.postId || '',
          senderName: parsed.senderName || this.getDefaultSender(),
          text: result.text || '……',
          replyTo: ''
        }, '*');

        this.log('已回传 VVPHONE_FEED_REPLY', 'ok', result);
        return;
      }

      this.frame.contentWindow.postMessage({
        type: 'VVPHONE_REPLY',
        chatId: parsed.chatId || '',
        senderName: parsed.senderName || this.getDefaultSender(),
        text: result.text || '……'
      }, '*');

      this.log('已回传 VVPHONE_REPLY', 'ok', result);
    },

    buildMockChatReply(command, parsed) {
      const prompt = this.extractPrompt(command);
      const sender = parsed.senderName || this.getDefaultSender();

      if (prompt.includes('[转账]')) {
        return `${sender}：我收到了。`;
      }
      if (prompt.includes('[图片]')) {
        return `${sender}：我看到你发来的图片了。`;
      }
      if (prompt.includes('[语音]')) {
        return `${sender}：我听完了。`;
      }
      if (prompt.includes('[表情]')) {
        return `${sender}：这个表情我看到了。`;
      }

      const lastLine = this.getLastMeaningfulLine(prompt);
      return `${sender}：我看到了，你刚才说的是“${lastLine || '继续聊聊吧'}”。`;
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
        if (t.startsWith('聊天ID=')) return false;
        if (t.startsWith('动态ID=')) return false;
        if (t === '/trigger') return false;
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

      if (!text) {
        alert('请先填写手动回复内容');
        return;
      }

      if (manualType === 'feed') {
        this.frame.contentWindow.postMessage({
          type: 'VVPHONE_FEED_REPLY',
          postId: this.lastContext.postId || '',
          senderName,
          text,
          replyTo: ''
        }, '*');

        this.log('手动回传 VVPHONE_FEED_REPLY', 'ok', {
          postId: this.lastContext.postId || '',
          senderName,
          text
        });
        return;
      }

      if (manualType === 'call') {
        this.frame.contentWindow.postMessage({
          type: 'VVPHONE_CALL_REPLY',
          chatId: this.lastContext.chatId || '',
          senderName,
          text
        }, '*');

        this.log('手动回传 VVPHONE_CALL_REPLY', 'ok', {
          chatId: this.lastContext.chatId || '',
          senderName,
          text
        });
        return;
      }

      this.frame.contentWindow.postMessage({
        type: 'VVPHONE_REPLY',
        chatId: this.lastContext.chatId || '',
        senderName,
        text
      }, '*');

      this.log('手动回传 VVPHONE_REPLY', 'ok', {
        chatId: this.lastContext.chatId || '',
        senderName,
        text
      });
    },

    sendManualCallStatus() {
      if (!this.frame || !this.frame.contentWindow) {
        this.log('iframe 不存在，无法回传电话状态', 'err');
        return;
      }

      const status = this.getSelectedCallStatus();
      this.frame.contentWindow.postMessage({
        type: 'VVPHONE_CALL_STATUS',
        chatId: this.lastContext.chatId || '',
        status
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

      this.frame.contentWindow.postMessage({
        type: 'VVPHONE_INCOMING_CALL',
        senderName,
        bridgeName: senderName
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
