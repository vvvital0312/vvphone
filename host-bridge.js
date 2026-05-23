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

      console.log('[VV_BRIDGE][handleSlashRequest] data =', data);

      const parsed = this.parseCommand(command);

      console.log('[VV_BRIDGE][handleSlashRequest] command =', command);
      console.log('[VV_BRIDGE][handleSlashRequest] parsed =', parsed);
      console.log('[VV_BRIDGE][handleSlashRequest] requestId =', requestId, 'viewId =', viewId);

      this.lastContext = {
        ...this.lastContext,
        ...parsed,
        command
      };

      console.log('[VV_BRIDGE][handleSlashRequest] lastContext =', this.lastContext);

      this.log('收到 Slash 请求', 'ok', {
        type: data.type,
        command,
        parsed,
        requestId,
        viewId
      });

      const mode = this.getReplyMode();
      console.log('[VV_BRIDGE][handleSlashRequest] mode =', mode);

      if (mode === 'passthrough') {
        console.log('[VV_BRIDGE][handleSlashRequest] passthrough mode: replyExecuteResult only');

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
        console.log('[VV_BRIDGE][handleSlashRequest] manual mode: replyExecuteResult only');

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
        console.log('[VV_BRIDGE][handleSlashRequest] about to call mockExecute');

        const result = await this.mockExecute(command, parsed);

        console.log('[VV_BRIDGE][handleSlashRequest] mockExecute result =', result);
        try {
          console.log('[VV_BRIDGE][handleSlashRequest][mockExecute_result_json] =', JSON.stringify(result, null, 2));
        } catch (e) {
          console.warn('[VV_BRIDGE][handleSlashRequest][mockExecute_result_json] stringify failed:', e);
        }

        console.log('[VV_BRIDGE][handleSlashRequest] about to replyExecuteResult ok=true');

        this.replyExecuteResult({
          requestId,
          viewId,
          ok: true,
          error: null
        });

        console.log('[VV_BRIDGE][handleSlashRequest] replyExecuteResult done, about to call handleMockResult');

        this.handleMockResult(result, parsed, {
          requestId,
          viewId
        });

        console.log('[VV_BRIDGE][handleSlashRequest] handleMockResult called');
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

      console.log('[VV_BRIDGE][emitToPhone] payload =', payload);
      try {
        console.log('[VV_BRIDGE][emitToPhone][payload_json] =', JSON.stringify(payload, null, 2));
      } catch (e) {
        console.warn('[VV_BRIDGE][emitToPhone][payload_json] stringify failed:', e);
      }

      try {
        this.frame = document.getElementById('vvphoneFrame') || this.frame;
        console.log('[VV_BRIDGE][emitToPhone] frame =', this.frame);

        if (this.frame && this.frame.contentWindow) {
          this.frame.contentWindow.postMessage(payload, '*');
          postedToFrame = true;
          console.log('[VV_BRIDGE][emitToPhone] posted to frame.contentWindow');
        } else {
          console.log('[VV_BRIDGE][emitToPhone] no frame.contentWindow');
        }
      } catch (e) {
        console.warn('[VVHostBridge] frame.contentWindow.postMessage failed:', e);
      }

      try {
        window.postMessage(payload, '*');
        postedToWindow = true;
        console.log('[VV_BRIDGE][emitToPhone] posted to window');
      } catch (e) {
        console.warn('[VVHostBridge] window.postMessage failed:', e);
      }

      console.log('[VV_BRIDGE][emitToPhone] result =', {
        type: payload?.type || '',
        viewId: payload?.viewId || '',
        chatId: payload?.chatId || '',
        postedToFrame,
        postedToWindow
      });

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
      console.log('[VV_BRIDGE][resendLastChatSync] called with =', {
        chatId,
        viewId,
        lastChatSyncChatId: this.lastChatSyncChatId,
        hasLastChatSyncRaw: !!this.lastChatSyncRaw
      });

      if (!this.lastChatSyncRaw) {
        console.log('[VV_BRIDGE][resendLastChatSync][RETURN] no lastChatSyncRaw');
        this.log('没有可补发的 lastChatSyncRaw', 'warn');
        return false;
      }

      if (chatId && this.lastChatSyncChatId && chatId !== this.lastChatSyncChatId) {
        console.log('[VV_BRIDGE][resendLastChatSync][RETURN] chatId mismatch', {
          expect: chatId,
          actual: this.lastChatSyncChatId
        });
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

      console.log('[VV_BRIDGE][resendLastChatSync] payload =', payload);
      try {
        console.log('[VV_BRIDGE][resendLastChatSync][payload_json] =', JSON.stringify(payload, null, 2));
      } catch (e) {
        console.warn('[VV_BRIDGE][resendLastChatSync][payload_json] stringify failed:', e);
      }

      const ok = this.emitToPhone(payload);

      console.log('[VV_BRIDGE][resendLastChatSync] emit result =', ok);

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
        const sender = parsed.senderName || this.getDefaultSender();
        const chatId = parsed.chatId || '';
        const time = this.formatNowLabel();

        let callPhase = 'accept';
        let replyText = '我接到了，你说吧。';

        if (status === 'rejected') {
          callPhase = 'reject';
          replyText = '';
        } else if (status === 'missed') {
          callPhase = 'miss';
          replyText = '';
        }

        // 尝试从命令中判断是否是通话中的对话（talking阶段）
        const command = String(parsed.command || this.lastContext.command || '');
        if (command.includes('通话阶段:talking')) {
          callPhase = 'reply';
          replyText = '嗯，我听到了，你继续说。';
        } else if (command.includes('通话阶段:incoming')) {
          callPhase = 'reply';
          replyText = '喂，我刚才想找你聊点事。';
        }

        // 构建 VV_CALL_SYNC 格式的 raw
        const callMsgBlock = replyText ? [
          '',
          '[通话]',
          `speaker=${this.normalizeSyncFieldText(sender)}`,
          `content=${this.normalizeSyncFieldText(replyText)}`,
          '[/通话]'
        ].join('\n') : '';

        const raw = [
          '[VV_CALL_SYNC]',
          `chatId=${this.normalizeSyncFieldText(chatId)}`,
          `target=${this.normalizeSyncFieldText(sender)}`,
          `callPhase=${callPhase}`,
          `time=${this.normalizeSyncFieldText(time)}`,
          callMsgBlock,
          '[/VV_CALL_SYNC]'
        ].join('\n');

        return {
          kind: 'call',
          status,
          raw,
          text: replyText
        };
      }

      if (parsed.type === 'feed') {
        const feedRaw = this.buildMockFeedReply(command, parsed);
        return {
          kind: 'feed',
          raw: feedRaw,
          text: feedRaw
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

      console.log('[VV_BRIDGE][handleMockResult] result =', result);
      console.log('[VV_BRIDGE][handleMockResult] parsed =', parsed);
      console.log('[VV_BRIDGE][handleMockResult] meta =', meta);

      try {
        console.log('[VV_BRIDGE][handleMockResult][result_json] =', JSON.stringify(result, null, 2));
      } catch (e) {
        console.warn('[VV_BRIDGE][handleMockResult][result_json] stringify failed:', e);
      }

      if (!result) {
        console.log('[VV_BRIDGE][handleMockResult][RETURN] no result');
        return;
      }

      console.log('[VV_BRIDGE][handleMockResult] kind =', result.kind, 'viewId =', viewId);

      if (result.kind === 'call') {
        console.log('[VV_BRIDGE][handleMockResult] enter call branch');

        const raw = result.raw || result.text || '';

        // 如果AI返回了 [VV_CALL_SYNC] 块，用新格式转发
        if (raw && raw.includes('[VV_CALL_SYNC]')) {
          console.log('[VV_BRIDGE][handleMockResult][call] detected VV_CALL_SYNC block');

          this.emitToPhone({
            type: 'VVPHONE_CALL_SYNC',
            chatId: parsed.chatId || '',
            raw,
            viewId
          });

          this.log('已回传 VVPHONE_CALL_SYNC', 'ok', {
            chatId: parsed.chatId || '',
            raw: raw.slice(0, 500)
          });
          return;
        }

        // 兼容旧格式
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
        console.log('[VV_BRIDGE][handleMockResult] enter feed branch');

        const raw = result.raw || result.text || '';

        console.log('[VV_BRIDGE][handleMockResult][feed] raw =', raw);
        console.log('[VV_BRIDGE][handleMockResult][feed] includes [VV_FEED_SYNC] =', !!(raw && raw.includes('[VV_FEED_SYNC]')));

        if (raw && raw.includes('[VV_FEED_SYNC]')) {
          this.emitToPhone({
            type: 'VVPHONE_FEED_SYNC',
            raw,
            viewId
          });

          this.log('已回传 VVPHONE_FEED_SYNC', 'ok', {
            raw: raw.slice(0, 500)
          });
          return;
        }

        // 兜底：没有结构化块，忽略（不再写死评论）
        console.log('[VV_BRIDGE][handleMockResult][feed] no [VV_FEED_SYNC] block, skipping');
        return;
      }

      if (result.kind === 'chat') {
        console.log('[VV_BRIDGE][handleMockResult] enter chat branch');

        const raw = result.raw || result.text || '';

        console.log('[VV_BRIDGE][handleMockResult][chat] raw =', raw);
        console.log('[VV_BRIDGE][handleMockResult][chat] raw length =', String(raw || '').length);
        console.log('[VV_BRIDGE][handleMockResult][chat] includes [VV_CHAT_SYNC] =', !!(raw && raw.includes('[VV_CHAT_SYNC]')));

        this.lastChatSyncRaw = raw || '';
        this.lastChatSyncChatId = parsed.chatId || '';

        console.log('[VV_BRIDGE][handleMockResult][chat] cached lastChatSyncChatId =', this.lastChatSyncChatId);
        console.log('[VV_BRIDGE][handleMockResult][chat] cached lastChatSyncRaw preview =', String(this.lastChatSyncRaw || '').slice(0, 500));

        // 检测动态同步块
        if (raw && raw.includes('[VV_FEED_SYNC]')) {
          console.log('[VV_BRIDGE][handleMockResult][chat] detected VV_FEED_SYNC');

          this.emitToPhone({
            type: 'VVPHONE_FEED_SYNC',
            raw,
            viewId
          });

          this.log('已回传 VVPHONE_FEED_SYNC (from chat)', 'ok', {
            raw: raw.slice(0, 500)
          });

          if (!raw.includes('[VV_CHAT_SYNC]')) {
            return;
          }
        }

        // 检测通话同步块（AI可能在聊天回复中夹带通话数据）
        if (raw && raw.includes('[VV_CALL_SYNC]')) {
          console.log('[VV_BRIDGE][handleMockResult][chat] detected VV_CALL_SYNC in chat result');

          this.emitToPhone({
            type: 'VVPHONE_CALL_SYNC',
            chatId: parsed.chatId || '',
            raw,
            viewId
          });

          this.log('已回传 VVPHONE_CALL_SYNC (from chat)', 'ok', {
            chatId: parsed.chatId || '',
            raw: raw.slice(0, 500)
          });

          // 如果同时也包含聊天同步，不return，继续往下走
          if (!raw.includes('[VV_CHAT_SYNC]')) {
            return;
          }
        }

        // 检测来电触发块
        if (raw && raw.includes('[VV_INCOMING_CALL]')) {
          console.log('[VV_BRIDGE][handleMockResult][chat] detected VV_INCOMING_CALL');

          this.emitToPhone({
            type: 'VVPHONE_INCOMING_CALL',
            raw,
            viewId
          });

          this.log('已回传 VVPHONE_INCOMING_CALL', 'ok', {
            raw: raw.slice(0, 300)
          });

          // 如果同时也包含聊天同步，不return，继续往下走
          if (!raw.includes('[VV_CHAT_SYNC]')) {
            return;
          }
        }

        if (raw && raw.includes('[VV_CHAT_SYNC]')) {
          console.log('[VV_BRIDGE][handleMockResult][chat] about to emit VVPHONE_CHAT_SYNC');

          const payload = {
            type: 'VVPHONE_CHAT_SYNC',
            chatId: parsed.chatId || '',
            raw,
            viewId
          };

          console.log('[VV_BRIDGE][handleMockResult][chat] payload =', payload);

          this.emitToPhone(payload);

          this.log('已回传 VVPHONE_CHAT_SYNC', 'ok', {
            chatId: parsed.chatId || '',
            viewId,
            raw: raw.slice(0, 500)
          });
          return;
        }

        console.log('[VV_BRIDGE][handleMockResult][chat] no [VV_CHAT_SYNC], fallback to VVPHONE_REPLY');

        const fallbackPayload = {
          type: 'VVPHONE_REPLY',
          chatId: parsed.chatId || '',
          senderName: parsed.senderName || this.getDefaultSender(),
          text: result.text || '……',
          viewId
        };

        console.log('[VV_BRIDGE][handleMockResult][chat] fallback payload =', fallbackPayload);

        this.emitToPhone(fallbackPayload);

        this.log('已回传 VVPHONE_REPLY(fallback)', 'ok', result);
        return;
      }

      console.log('[VV_BRIDGE][handleMockResult] enter default branch');

      const defaultPayload = {
        type: 'VVPHONE_REPLY',
        chatId: parsed.chatId || '',
        senderName: parsed.senderName || this.getDefaultSender(),
        text: result.text || '……',
        viewId
      };

      console.log('[VV_BRIDGE][handleMockResult] default payload =', defaultPayload);

      this.emitToPhone(defaultPayload);

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
      const prompt = this.extractPrompt(command);
      const postIdMatch = String(prompt).match(/postId\s*=\s*(.+)/i);
      const postId = postIdMatch ? postIdMatch[1].trim() : (parsed.postId || '');
      const time = this.formatNowLabel();

      // mock 模式下模拟两个角色互动
      const sender = parsed.senderName || this.getDefaultSender();

      return [
        '[VV_FEED_SYNC]',
        `postId=${postId}`,
        `time=${time}`,
        '',
        '[互动]',
        `from=${this.normalizeSyncFieldText(sender)}`,
        'action=like',
        '[/互动]',
        '',
        '[互动]',
        `from=${this.normalizeSyncFieldText(sender)}`,
        'action=comment',
        `content=看到了，感觉不错呢。`,
        '[/互动]',
        '',
        '[/VV_FEED_SYNC]'
      ].join('\n');
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
        const postId = this.lastContext.postId || '';
        const time = this.formatNowLabel();

        const raw = [
          '[VV_FEED_SYNC]',
          `postId=${this.normalizeSyncFieldText(postId)}`,
          `time=${this.normalizeSyncFieldText(time)}`,
          '',
          '[互动]',
          `from=${this.normalizeSyncFieldText(senderName)}`,
          'action=comment',
          `content=${this.normalizeSyncFieldText(text)}`,
          '[/互动]',
          '',
          '[/VV_FEED_SYNC]'
        ].join('\n');

        this.emitToPhone({
          type: 'VVPHONE_FEED_SYNC',
          raw,
          viewId
        });

        this.log('手动回传 VVPHONE_FEED_SYNC', 'ok', {
          postId,
          senderName,
          raw: raw.slice(0, 500)
        });
        return;
      }

      if (manualType === 'call') {
        const chatId = this.lastContext.chatId || '';
        const time = this.formatNowLabel();

        const raw = [
          '[VV_CALL_SYNC]',
          `chatId=${this.normalizeSyncFieldText(chatId)}`,
          `target=${this.normalizeSyncFieldText(senderName)}`,
          'callPhase=reply',
          `time=${this.normalizeSyncFieldText(time)}`,
          '',
          '[通话]',
          `speaker=${this.normalizeSyncFieldText(senderName)}`,
          `content=${this.normalizeSyncFieldText(text)}`,
          '[/通话]',
          '[/VV_CALL_SYNC]'
        ].join('\n');

        this.emitToPhone({
          type: 'VVPHONE_CALL_SYNC',
          chatId,
          raw,
          viewId
        });

        this.log('手动回传 VVPHONE_CALL_SYNC', 'ok', {
          chatId,
          senderName,
          raw: raw.slice(0, 500)
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

      // 构建一个 VV_INCOMING_CALL 格式的 raw，让 app.js 端能正确解析
      const raw = [
        '[VV_INCOMING_CALL]',
        `caller=${senderName}`,
        `chatId=${this.lastContext.chatId || ''}`,
        '[/VV_INCOMING_CALL]'
      ].join('\n');

      this.emitToPhone({
        type: 'VVPHONE_INCOMING_CALL',
        raw,
        senderName,
        bridgeName: senderName,
        viewId
      });

      this.log('已发送测试来电', 'ok', { senderName, raw });
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
