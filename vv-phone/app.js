let currentUploadImage = '';
let currentActiveContactId = '';
let currentChatId = '';
let currentChatType = 'direct';
let currentContactTab = 'direct';
let currentCallId = '';
let currentIncomingCallId = '';
let currentMessageAction = null;
let currentStickerImportMode = 'file';
let currentSendImageData = '';
let currentFeedImages = [];

let contactList = [];
let groupList = [];
let feedPosts = [];
let messages = {};
let callLogs = {};
let chatSettings = {};
let stickerPacks = [];
let relationshipSettings = {};
let appProfile = {
  myName: '我',
  myAvatar: '',
  feedCover: ''
};

let composerDraft = {
  quote: null,
  attachments: []
};

let pendingReplyTargets = {};

const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSI2IiBmaWxsPSIjMDdjMTYwIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIxOCIgcj0iNiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMTIgMzRDMTIgMjcuMzcyMyAxNy4zNzIzIDIyIDI0IDIyQzMwLjYyNzcgMjIgMzYgMjcuMzcyMyAzNiAzNEgxMloiIGZpbGw9IndoaXRlIi8+PC9zdmc+';

const STORAGE_DEBUG = true;
const STORAGE_SOFT_LIMIT = 4.5 * 1024 * 1024;
const STORAGE_IMAGE_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIHJ4PSIxNiIgZmlsbD0iI2YxZjFmMSIvPjxwYXRoIGQ9Ik00MCAxMTBMMTYwIDUwVjE0MEgyMFY5MEw0MCAxMTBaIiBmaWxsPSIjZGRkIi8+PGNpcmNsZSBjeD0iNTgiIGN5PSI1OCIgcj0iMTIiIGZpbGw9IiNjY2MiLz48L3N2Zz4=';

const IDB_DB_NAME = 'vv_phone_assets_db';
const IDB_DB_VERSION = 1;
const IDB_STORE_NAME = 'assets';
const IDB_REF_PREFIX = 'idb:';
const assetObjectUrlCache = new Map();

const VV_BRIDGE_CONFIG = {
  enabled: true,
  debug: true,
  chatMode: 'local+slash',
  callMode: 'local+slash',
  feedMode: 'local+slash',

  buildReplyCommand: function (params) {
    const bridgeName = params.bridgeName;
    const chatId = params.chatId;
    const chatType = params.chatType;
    const promptText = params.promptText;
    const scope = chatType === 'group' ? '[群聊回复]' : '[私聊回复]';
    return '/send ' + bridgeName + '\n' + scope + '\n聊天ID:' + chatId + '\n' + promptText + '|/trigger';
  },

  buildCallCommand: function (params) {
    const bridgeName = params.bridgeName;
    const promptText = params.promptText;
    return '/send ' + bridgeName + '\n[电话模式]\n' + promptText + '|/trigger';
  },

  buildFeedCommentCommand: function (params) {
    const bridgeName = params.bridgeName;
    const postId = params.postId;
    const promptText = params.promptText;
    return '/send ' + bridgeName + '\n[朋友圈互动]\n动态ID:' + postId + '\n' + promptText + '|/trigger';
  }
};

function safeJSONParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[Storage] JSON 解析失败，已使用默认值', err);
    return fallback;
  }
}

function getApproxSize(str) {
  try {
    return new Blob([str]).size;
  } catch (err) {
    return (str || '').length * 2;
  }
}

function logStorageSize(label, value) {
  if (!STORAGE_DEBUG) return;
  const size = getApproxSize(typeof value === 'string' ? value : JSON.stringify(value));
  console.log('[Storage] ' + label + ': ' + (size / 1024).toFixed(1) + ' KB');
}

function isDataImage(str) {
  return typeof str === 'string' && str.indexOf('data:image/') === 0;
}

function isIDBRef(value) {
  return typeof value === 'string' && value.indexOf(IDB_REF_PREFIX) === 0;
}

function createAssetRef(id) {
  return IDB_REF_PREFIX + id;
}

function extractAssetId(ref) {
  return isIDBRef(ref) ? ref.slice(IDB_REF_PREFIX.length) : '';
}

function keepUrlOrSmallDataImage(str, maxLen, fallback) {
  if (fallback === undefined) fallback = '';
  if (!str) return fallback;
  if (!isDataImage(str)) return str;
  return str.length <= maxLen ? str : fallback;
}

function dataURLToBlob(dataUrl) {
  const arr = String(dataUrl).split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1] || '');
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

function compressImage(dataUrl, maxWidth, quality) {
  if (maxWidth === undefined) maxWidth = 1000;
  if (quality === undefined) quality = 0.72;

  return new Promise(function (resolve) {
    if (!dataUrl || String(dataUrl).indexOf('data:image/') !== 0) {
      resolve(dataUrl || '');
      return;
    }

    const img = new Image();
    img.onload = function () {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const hasAlpha = /^data:image\/png|^data:image\/webp/i.test(dataUrl);
      if (hasAlpha) resolve(canvas.toDataURL('image/png'));
      else resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = function () {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}

function openAssetsDB() {
  return new Promise(function (resolve, reject) {
    const req = indexedDB.open(IDB_DB_NAME, IDB_DB_VERSION);

    req.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id' });
      }
    };

    req.onsuccess = function () {
      resolve(req.result);
    };

    req.onerror = function () {
      reject(req.error);
    };
  });
}

async function idbPutAsset(record) {
  const db = await openAssetsDB();
  return new Promise(function (resolve, reject) {
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(IDB_STORE_NAME);
    const req = store.put(record);
    req.onsuccess = function () {
      resolve(record.id);
    };
    req.onerror = function () {
      reject(req.error);
    };
  });
}

async function idbGetAsset(id) {
  const db = await openAssetsDB();
  return new Promise(function (resolve, reject) {
    const tx = db.transaction(IDB_STORE_NAME, 'readonly');
    const store = tx.objectStore(IDB_STORE_NAME);
    const req = store.get(id);
    req.onsuccess = function () {
      resolve(req.result || null);
    };
    req.onerror = function () {
      reject(req.error);
    };
  });
}

async function idbDeleteAsset(id) {
  const db = await openAssetsDB();
  return new Promise(function (resolve, reject) {
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(IDB_STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = function () {
      resolve(true);
    };
    req.onerror = function () {
      reject(req.error);
    };
  });
}

async function idbGetAllAssetIds() {
  const db = await openAssetsDB();
  return new Promise(function (resolve, reject) {
    const tx = db.transaction(IDB_STORE_NAME, 'readonly');
    const store = tx.objectStore(IDB_STORE_NAME);

    if (typeof store.getAllKeys === 'function') {
      const req = store.getAllKeys();
      req.onsuccess = function () {
        resolve(req.result || []);
      };
      req.onerror = function () {
        reject(req.error);
      };
      return;
    }

    const ids = [];
    const req = store.openCursor();
    req.onsuccess = function (e) {
      const cursor = e.target.result;
      if (cursor) {
        ids.push(cursor.key);
        cursor.continue();
      } else {
        resolve(ids);
      }
    };
    req.onerror = function () {
      reject(req.error);
    };
  });
}

async function persistImageToIDB(dataUrl, meta) {
  if (meta === undefined) meta = {};
  if (!dataUrl) return '';
  if (isIDBRef(dataUrl)) return dataUrl;
  if (!isDataImage(dataUrl)) return dataUrl;

  const blob = dataURLToBlob(dataUrl);
  const id = 'asset_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);

  await idbPutAsset({
    id: id,
    blob: blob,
    mime: blob.type || 'image/jpeg',
    createdAt: Date.now(),
    meta: meta || {}
  });

  return createAssetRef(id);
}

async function resolveImageRefToUrl(ref) {
  if (!ref) return '';
  if (!isIDBRef(ref)) return ref;

  if (assetObjectUrlCache.has(ref)) {
    return assetObjectUrlCache.get(ref);
  }

  const id = extractAssetId(ref);
  const record = await idbGetAsset(id);
  if (!record || !record.blob) return STORAGE_IMAGE_PLACEHOLDER;

  const objectUrl = URL.createObjectURL(record.blob);
  assetObjectUrlCache.set(ref, objectUrl);
  return objectUrl;
}

function releaseAllAssetObjectUrls() {
  assetObjectUrlCache.forEach(url => {
    try { URL.revokeObjectURL(url); } catch (err) {}
  });
  assetObjectUrlCache.clear();
}

function buildMediaSrcAttrs(ref) {
  const safe = escapeHTML(ref || '');
  return `data-media-ref="${safe}" src="${STORAGE_IMAGE_PLACEHOLDER}"`;
}

async function hydrateMediaRefs(root = document) {
  const nodes = root.querySelectorAll('[data-media-ref]');
  for (const el of nodes) {
    const ref = el.getAttribute('data-media-ref') || '';
    const realSrc = await resolveImageRefToUrl(ref);
    if (realSrc) el.setAttribute('src', realSrc);
  }

  const bgNodes = root.querySelectorAll('[data-bg-ref]');
  for (const el of bgNodes) {
    const ref = el.getAttribute('data-bg-ref') || '';
    const realSrc = await resolveImageRefToUrl(ref);
    if (realSrc) el.style.backgroundImage = `url(${realSrc})`;
  }
}

function collectImageRefsFromState() {
  const refs = new Set();
  const tryAdd = value => {
    if (isIDBRef(value)) refs.add(value);
  };

  if (appProfile) {
    tryAdd(appProfile.myAvatar);
    tryAdd(appProfile.feedCover);
  }

  Object.values(chatSettings || {}).forEach(item => {
    if (!item) return;
    tryAdd(item.background);
    tryAdd(item.myAvatar);
    tryAdd(item.theirAvatar);
  });

  Object.values(messages || {}).forEach(list => {
    (list || []).forEach(msg => {
      tryAdd(msg.src);
    });
  });

  (feedPosts || []).forEach(post => {
    tryAdd(post.authorAvatar);
    (post.images || []).forEach(tryAdd);
  });

  (stickerPacks || []).forEach(item => {
    tryAdd(item.src);
  });

  const phoneIcons = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});
  Object.values(phoneIcons).forEach(tryAdd);

  return refs;
}

async function cleanupUnusedIDBAssets() {
  try {
    const usedRefs = collectImageRefsFromState();
    const usedIds = new Set([...usedRefs].map(extractAssetId).filter(Boolean));
    const allIds = await idbGetAllAssetIds();

    for (const id of allIds) {
      if (!usedIds.has(id)) await idbDeleteAsset(id);
    }
  } catch (err) {
    console.warn('[IDB] 清理未使用资源失败', err);
  }
}

async function convertLegacyImagesToIDB() {
  let changed = false;

  async function convert(value, meta = {}) {
    if (!value) return value;
    if (isIDBRef(value)) return value;
    if (!isDataImage(value)) return value;
    const next = await persistImageToIDB(value, meta);
    if (next !== value) changed = true;
    return next;
  }

  if (appProfile) {
    appProfile.myAvatar = await convert(appProfile.myAvatar, { area: 'appProfile.myAvatar' });
    appProfile.feedCover = await convert(appProfile.feedCover, { area: 'appProfile.feedCover' });
  }

  for (const id of Object.keys(chatSettings || {})) {
    const item = chatSettings[id];
    if (!item) continue;
    item.background = await convert(item.background, { area: 'chatSettings.background', chatId: id });
    item.myAvatar = await convert(item.myAvatar, { area: 'chatSettings.myAvatar', chatId: id });
    item.theirAvatar = await convert(item.theirAvatar, { area: 'chatSettings.theirAvatar', chatId: id });
  }

  for (const chatId of Object.keys(messages || {})) {
    const list = messages[chatId] || [];
    for (const msg of list) {
      if (msg.type === 'image' || msg.type === 'sticker') {
        msg.src = await convert(msg.src, { area: 'messages.src', chatId, type: msg.type });
      }
    }
  }

  for (const post of (feedPosts || [])) {
    post.authorAvatar = await convert(post.authorAvatar, { area: 'feed.authorAvatar', postId: post.id });
    if (Array.isArray(post.images)) {
      for (let i = 0; i < post.images.length; i++) {
        post.images[i] = await convert(post.images[i], { area: 'feed.images', postId: post.id, index: i });
      }
    }
  }

  for (const item of (stickerPacks || [])) {
    item.src = await convert(item.src, { area: 'sticker.src', stickerId: item.id });
  }

  const phoneIcons = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});
  let phoneIconsChanged = false;
  for (const key of Object.keys(phoneIcons)) {
    const next = await convert(phoneIcons[key], { area: 'phone_icons', key });
    if (next !== phoneIcons[key]) {
      phoneIcons[key] = next;
      phoneIconsChanged = true;
    }
  }
  if (phoneIconsChanged) {
    safeSetItemJSON('st_phone_icons', phoneIcons);
    changed = true;
  }

  if (changed) {
    console.warn('[IDB] 已将旧 dataURL 图片迁移到 IndexedDB');
    saveAll();
  }

  return changed;
}

function safeSetItemRaw(key, raw) {
  try {
    localStorage.setItem(key, raw);
    logStorageSize(key, raw);
    return true;
  } catch (err) {
    if (err && err.name === 'QuotaExceededError') {
      console.warn(`[Storage] ${key} 写入失败：超出 localStorage 配额`);
      return false;
    }
    throw err;
  }
}

function safeSetItemJSON(key, value) {
  return safeSetItemRaw(key, JSON.stringify(value));
}

function trimMessagesForStorage(mode = 'normal') {
  const maxPerChat = mode === 'aggressive' ? 40 : 80;
  let changed = false;

  Object.keys(messages || {}).forEach(chatId => {
    const list = Array.isArray(messages[chatId]) ? messages[chatId] : [];
    if (list.length > maxPerChat) {
      messages[chatId] = list.slice(-maxPerChat);
      changed = true;
    }

    messages[chatId] = (messages[chatId] || []).map(msg => {
      const next = { ...msg };

      if (next.type === 'image') {
        next.src = keepUrlOrSmallDataImage(next.src, mode === 'aggressive' ? 120000 : 220000, STORAGE_IMAGE_PLACEHOLDER);
      }

      if (next.type === 'sticker') {
        next.src = keepUrlOrSmallDataImage(next.src, mode === 'aggressive' ? 80000 : 140000, STORAGE_IMAGE_PLACEHOLDER);
      }

      return next;
    });
  });

  return changed;
}

function cleanupLargeState(mode = 'normal') {
  let changed = false;

  const avatarLimit = mode === 'aggressive' ? 60000 : 120000;
  const bgLimit = mode === 'aggressive' ? 120000 : 260000;
  const feedImgLimit = mode === 'aggressive' ? 100000 : 180000;
  const stickerLimit = mode === 'aggressive' ? 80000 : 140000;

  if (appProfile) {
    const oldAvatar = appProfile.myAvatar;
    const oldCover = appProfile.feedCover;

    appProfile.myAvatar = keepUrlOrSmallDataImage(appProfile.myAvatar, avatarLimit, '');
    appProfile.feedCover = keepUrlOrSmallDataImage(appProfile.feedCover, bgLimit, '');

    if (oldAvatar !== appProfile.myAvatar || oldCover !== appProfile.feedCover) changed = true;
  }

  Object.keys(chatSettings || {}).forEach(id => {
    const item = chatSettings[id];
    if (!item) return;

    const oldBg = item.background;
    const oldMy = item.myAvatar;
    const oldTheir = item.theirAvatar;

    item.background = keepUrlOrSmallDataImage(item.background, bgLimit, '');
    item.myAvatar = keepUrlOrSmallDataImage(item.myAvatar, avatarLimit, appProfile.myAvatar || DEFAULT_AVATAR);
    item.theirAvatar = keepUrlOrSmallDataImage(item.theirAvatar, avatarLimit, DEFAULT_AVATAR);

    if (oldBg !== item.background || oldMy !== item.myAvatar || oldTheir !== item.theirAvatar) changed = true;
  });

  if (Array.isArray(stickerPacks)) {
    stickerPacks = stickerPacks.map(item => {
      const old = item.src;
      const next = {
        ...item,
        src: keepUrlOrSmallDataImage(item.src, stickerLimit, STORAGE_IMAGE_PLACEHOLDER)
      };
      if (old !== next.src) changed = true;
      return next;
    });
  }

  if (Array.isArray(feedPosts)) {
    feedPosts = feedPosts.map(post => {
      const next = { ...post };
      next.authorAvatar = keepUrlOrSmallDataImage(next.authorAvatar, avatarLimit, DEFAULT_AVATAR);
      next.images = (next.images || []).map(src => keepUrlOrSmallDataImage(src, feedImgLimit, STORAGE_IMAGE_PLACEHOLDER));
      return next;
    });
  }

  if (trimMessagesForStorage(mode)) changed = true;

  return changed;
}

function migrateOversizedLegacyStorage() {
  const changed = cleanupLargeState('normal');
  if (changed) console.warn('[Storage] 检测到旧的大体积缓存，已自动瘦身一次');
}

function savePhoneIconsSafely(savedIcons) {
  const clone = { ...(savedIcons || {}) };
  Object.keys(clone).forEach(key => {
    clone[key] = keepUrlOrSmallDataImage(clone[key], 260000, '');
  });

  if (!safeSetItemJSON('st_phone_icons', clone)) {
    Object.keys(clone).forEach(key => {
      clone[key] = keepUrlOrSmallDataImage(clone[key], 120000, '');
    });
    safeSetItemJSON('st_phone_icons', clone);
  }
}

async function triggerSlash(cmd) {
  if (!cmd) return false;

  if (VV_BRIDGE_CONFIG.debug) {
    console.log('[VV] 触发指令:', cmd);
  }

  try {
    if (typeof window.executeSlashCommands === 'function') {
      await window.executeSlashCommands(cmd);
      return true;
    }

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'VVPHONE_SLASH',
        command: cmd
      }, '*');
      return true;
    }

    console.warn('[VV] 未检测到 slash 执行器，已退回本地模式');
    return false;
  } catch (err) {
    console.error('[VV] slash 执行失败:', err);
    return false;
  }
}

function escapeHTML(str) {
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
}

function getNowTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function getNowFullLabel() {
  const now = new Date();
  return `${now.getMonth() + 1}月${now.getDate()}日 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function isSameTimeDivider(a, b) {
  return a === b;
}

function splitInputToChunks(text) {
  return String(text || '').split('\n').map(i => i.trim()).filter(Boolean);
}

function playClickSound() {
  const sound = document.getElementById('clickSound');
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function saveAll(retryMode = 'normal') {
  cleanupLargeState(retryMode);

  const okList = [
    safeSetItemJSON('st_contact_list', contactList),
    safeSetItemJSON('st_group_list', groupList),
    safeSetItemJSON('st_feed_posts', feedPosts),
    safeSetItemJSON('st_messages', messages),
    safeSetItemJSON('st_call_logs', callLogs),
    safeSetItemJSON('st_chat_settings', chatSettings),
    safeSetItemJSON('st_sticker_packs', stickerPacks),
    safeSetItemJSON('st_relationship_settings', relationshipSettings),
    safeSetItemJSON('st_app_profile', appProfile),
    safeSetItemJSON('st_pending_reply_targets', pendingReplyTargets)
  ];

  const success = okList.every(Boolean);

  if (!success && retryMode !== 'aggressive') {
    console.warn('[Storage] 首次保存超额，尝试激进瘦身后重试');
    cleanupLargeState('aggressive');

    const secondTry = [
      safeSetItemJSON('st_contact_list', contactList),
      safeSetItemJSON('st_group_list', groupList),
      safeSetItemJSON('st_feed_posts', feedPosts),
      safeSetItemJSON('st_messages', messages),
      safeSetItemJSON('st_call_logs', callLogs),
      safeSetItemJSON('st_chat_settings', chatSettings),
      safeSetItemJSON('st_sticker_packs', stickerPacks),
      safeSetItemJSON('st_relationship_settings', relationshipSettings),
      safeSetItemJSON('st_app_profile', appProfile),
      safeSetItemJSON('st_pending_reply_targets', pendingReplyTargets)
    ];

    if (!secondTry.every(Boolean)) {
      alert('本地缓存空间已满。\n我已经自动压缩/清理了一部分图片，但仍然超限。\n建议手动清空旧缓存后再使用。');
      return false;
    }

    return true;
  }

  if (STORAGE_DEBUG) {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key) || '';
        total += getApproxSize(value);
      }
      console.log(`[Storage] 当前 localStorage 总占用约 ${(total / 1024).toFixed(1)} KB`);
      if (total > STORAGE_SOFT_LIMIT) {
        console.warn('[Storage] 当前缓存已接近上限，建议减少图片消息/背景/表情');
      }
    } catch (err) {}
  }

  return true;
}

function loadAll() {
  contactList = safeJSONParse(localStorage.getItem('st_contact_list') || '[]', []);
  groupList = safeJSONParse(localStorage.getItem('st_group_list') || '[]', []);
  feedPosts = safeJSONParse(localStorage.getItem('st_feed_posts') || '[]', []);
  messages = safeJSONParse(localStorage.getItem('st_messages') || '{}', {});
  callLogs = safeJSONParse(localStorage.getItem('st_call_logs') || '{}', {});
  chatSettings = safeJSONParse(localStorage.getItem('st_chat_settings') || '{}', {});
  stickerPacks = safeJSONParse(localStorage.getItem('st_sticker_packs') || '[]', []);
  relationshipSettings = safeJSONParse(localStorage.getItem('st_relationship_settings') || '{}', {});
  appProfile = safeJSONParse(localStorage.getItem('st_app_profile') || '{"myName":"我","myAvatar":"","feedCover":""}', {
    myName: '我',
    myAvatar: '',
    feedCover: ''
  });
  pendingReplyTargets = safeJSONParse(localStorage.getItem('st_pending_reply_targets') || '{}', {});

  migrateOversizedLegacyStorage();
}

function updateRealTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hh}:${mm}`;
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const wd = weekdays[now.getDay()];
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dateStr = `${wd} ${month}月${day}日`;

  ['topBarTime', 'topBarTime2', 'topBarTime3', 'topBarTime4', 'topBarTime5', 'topBarTime6'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerText = timeStr;
  });

  const mainTime = document.getElementById('mainTime');
  const mainDate = document.getElementById('mainDate');
  if (mainTime) mainTime.innerText = timeStr;
  if (mainDate) mainDate.innerText = dateStr;
}

function applyBorderColor(color) {
  const box = document.getElementById('phoneContainer');
  if (box) box.style.setProperty('--phone-border', color);
}

function applyTextColor(color) {
  const box = document.getElementById('phoneContainer');
  if (box) box.style.setProperty('--text-color', color);
}

function initColorPickers() {
  const borderPicker = document.getElementById('borderColorPicker');
  const textPicker = document.getElementById('textColorPicker');
  if (!borderPicker || !textPicker) return;

  const savedBorder = localStorage.getItem('st_phone_border_color');
  const savedText = localStorage.getItem('st_phone_text_color');

  if (savedBorder) {
    borderPicker.value = savedBorder;
    applyBorderColor(savedBorder);
  } else {
    applyBorderColor('#363636');
  }

  if (savedText) {
    textPicker.value = savedText;
    applyTextColor(savedText);
  } else {
    applyTextColor('#ffffff');
  }

  borderPicker.addEventListener('input', e => {
    applyBorderColor(e.target.value);
    localStorage.setItem('st_phone_border_color', e.target.value);
  });

  textPicker.addEventListener('input', e => {
    applyTextColor(e.target.value);
    localStorage.setItem('st_phone_text_color', e.target.value);
  });
}

function updateBgStyle() {
  const opacityEl = document.getElementById('bgOpacity');
  const blurEl = document.getElementById('bgBlur');
  const overlay = document.querySelector('.screen-bg-overlay');
  if (!opacityEl || !blurEl || !overlay) return;

  const opacity = opacityEl.value;
  const blur = blurEl.value;
  overlay.style.background = `rgba(0,0,0,${opacity})`;
  overlay.style.backdropFilter = `blur(${blur}px)`;

  safeSetItemJSON('st_phone_bg', { opacity, blur });
}

function restoreBgStyle() {
  const overlay = document.querySelector('.screen-bg-overlay');
  if (!overlay) return;

  const bgSettings = safeJSONParse(localStorage.getItem('st_phone_bg') || '{"opacity":0.2,"blur":3}', {
    opacity: 0.2,
    blur: 3
  });

  overlay.style.background = `rgba(0,0,0,${bgSettings.opacity})`;
  overlay.style.backdropFilter = `blur(${bgSettings.blur}px)`;

  const bgOpacity = document.getElementById('bgOpacity');
  const bgBlur = document.getElementById('bgBlur');
  if (bgOpacity) bgOpacity.value = bgSettings.opacity;
  if (bgBlur) bgBlur.value = bgSettings.blur;
}

function showDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;
  dialog.style.display = 'flex';
  setTimeout(() => dialog.classList.add('show'), 10);
}

function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;
  dialog.classList.remove('show');

  setTimeout(() => {
    dialog.style.display = 'none';

    if (dialogId === 'settingDialog') {
      const iconSelect = document.getElementById('iconSelect');
      const imageUpload = document.getElementById('imageUpload');
      const box = document.querySelector('#settingDialog .preview-box');
      if (iconSelect) iconSelect.value = '';
      if (imageUpload) imageUpload.value = '';
      if (box) box.innerHTML = '<span>图片预览区</span>';
      currentUploadImage = '';
    }

    if (dialogId === 'addContactDialog') {
      const a = document.getElementById('contactName');
      const b = document.getElementById('contactBridgeName');
      if (a) a.value = '';
      if (b) b.value = '';
    }

    if (dialogId === 'addCallDialog') {
      const el = document.getElementById('callTargetName');
      if (el) el.value = '';
    }

    if (dialogId === 'addGroupDialog') {
      const a = document.getElementById('groupName');
      const b = document.getElementById('groupMembers');
      if (a) a.value = '';
      if (b) b.value = '';
    }

    if (dialogId === 'postFeedDialog') {
      const input = document.getElementById('feedContentInput');
      const files = document.getElementById('feedPostImages');
      const preview = document.getElementById('feedPostPreview');
      if (input) input.value = '';
      if (files) files.value = '';
      currentFeedImages = [];
      if (preview) preview.innerHTML = '<span>最多9张图片</span>';
    }

    if (dialogId === 'transferDialog') {
      const a = document.getElementById('transferAmount');
      const b = document.getElementById('transferNote');
      if (a) a.value = '';
      if (b) b.value = '';
    }

    if (dialogId === 'imageSendDialog') {
      const a = document.getElementById('sendImageInput');
      const b = document.getElementById('sendImageDesc');
      const preview = document.getElementById('sendImagePreviewBox');
      if (a) a.value = '';
      if (b) b.value = '';
      currentSendImageData = '';
      if (preview) preview.innerHTML = '<span>图片预览区</span>';
    }

    if (dialogId === 'voiceDialog') {
      const a = document.getElementById('voiceTextInput');
      const b = document.getElementById('voiceDurationInput');
      if (a) a.value = '';
      if (b) b.value = '';
    }

    if (dialogId === 'stickerImportDialog') {
      const a = document.getElementById('stickerNameInput');
      const b = document.getElementById('stickerUrlInput');
      const c = document.getElementById('stickerFileInput');
      const preview = document.getElementById('stickerImportPreview');
      if (a) a.value = '';
      if (b) b.value = '';
      if (c) c.value = '';
      if (preview) preview.innerHTML = '<span>表情预览区</span>';
      currentUploadImage = '';
    }
  }, 300);
}

function fileToDataURL(file, callback, options = {}) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async e => {
    let result = e.target.result;

    if (options.compress && file.type.startsWith('image/')) {
      result = await compressImage(
        result,
        options.maxWidth || 1000,
        options.quality || 0.72
      );
    }

    callback(result);
  };
  reader.readAsDataURL(file);
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  fileToDataURL(file, data => {
    currentUploadImage = data;
    const box = document.querySelector('#settingDialog .preview-box');
    if (box) box.innerHTML = `<img src="${data}" style="max-width:100%;max-height:100%;object-fit:contain;">`;
  }, {
    compress: true,
    maxWidth: 1000,
    quality: 0.72
  });
}

async function confirmReplace() {
  const target = document.getElementById('iconSelect')?.value;
  if (!target || !currentUploadImage) {
    alert('请选择目标和图片！');
    return;
  }

  const storedRef = await persistImageToIDB(currentUploadImage, {
    area: 'phone_icons',
    key: target
  });

  const finalSrc = await resolveImageRefToUrl(storedRef);

  if (target === 'wallpaper') {
    const phone = document.querySelector('.phone-container');
    if (phone) phone.style.backgroundImage = `url(${finalSrc})`;
  } else {
    const el = document.getElementById(target);
    if (el) el.src = finalSrc;
  }

  const saved = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});
  saved[target] = storedRef;
  savePhoneIconsSafely(saved);

  alert('替换成功！');
  closeDialog('settingDialog');
}

async function restoreIcons() {
  const savedIcons = safeJSONParse(localStorage.getItem('st_phone_icons') || '{}', {});
  for (const [iconId, imageSrc] of Object.entries(savedIcons)) {
    const safeSrc = imageSrc || '';
    if (!safeSrc) continue;

    const finalSrc = await resolveImageRefToUrl(safeSrc);

    if (iconId === 'wallpaper') {
      const phone = document.querySelector('.phone-container');
      if (phone) phone.style.backgroundImage = `url(${finalSrc})`;
    } else {
      const el = document.getElementById(iconId);
      if (el) el.src = finalSrc;
    }
  }
}

function hideAllPages() {
  ['homePage', 'contactPage', 'chatDetailPage', 'callPage', 'incomingCallPage', 'chatSettingPage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function openContactPage() {
  hideAllPages();
  const page = document.getElementById('contactPage');
  if (page) page.style.display = 'block';
  renderAllPanels();
  renderFeedHeader();
}

function backToHome() {
  hideAllPages();
  const page = document.getElementById('homePage');
  if (page) page.style.display = 'block';
}

function backToContactList() {
  const a = document.getElementById('chatDetailPage');
  const b = document.getElementById('contactPage');
  if (a) a.style.display = 'none';
  if (b) b.style.display = 'block';
  renderAllPanels();
}

function backToChatDetail() {
  const a = document.getElementById('chatSettingPage');
  const b = document.getElementById('chatDetailPage');
  if (a) a.style.display = 'none';
  if (b) b.style.display = 'block';
  renderMessages();
}

function closeCallPage() {
  hideAllPages();
  const page = document.getElementById('homePage');
  if (page) page.style.display = 'block';
}

function switchContactTab(tab) {
  currentContactTab = tab;
  document.querySelectorAll('.contact-tab').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tab);
  });
  document.querySelectorAll('.panel').forEach(el => el.classList.remove('active'));

  if (tab === 'direct') document.getElementById('directPanel')?.classList.add('active');
  if (tab === 'group') document.getElementById('groupPanel')?.classList.add('active');
  if (tab === 'feed') document.getElementById('feedPanel')?.classList.add('active');

  renderAllPanels();
}

function handleTopAdd() {
  if (currentContactTab === 'direct') showDialog('addContactDialog');
  if (currentContactTab === 'group') showDialog('addGroupDialog');
  if (currentContactTab === 'feed') showDialog('postFeedDialog');
}

function getChatSetting(id) {
  if (!chatSettings[id]) {
    chatSettings[id] = {
      background: '',
      myAvatar: appProfile.myAvatar || DEFAULT_AVATAR,
      theirAvatar: DEFAULT_AVATAR
    };
  }
  return chatSettings[id];
}

function getRelSetting(id) {
  if (!relationshipSettings[id]) {
    relationshipSettings[id] = {
      blockedByMe: false,
      blockedByThem: false
    };
  }
  return relationshipSettings[id];
}

function getCurrentChatName(id, type = 'direct') {
  const list = type === 'group' ? groupList : contactList;
  const item = list.find(i => i.id === id);
  return item ? item.name : '联系人';
}

function getBridgeNameByChatId(chatId, type = 'direct') {
  if (type === 'group') {
    const group = groupList.find(i => i.id === chatId);
    return group?.bridgeName || group?.name || '群聊';
  }
  const contact = contactList.find(i => i.id === chatId);
  return contact?.bridgeName || contact?.name || '角色';
}

function buildLatestUserPayload(chatId) {
  const list = messages[chatId] || [];
  const myRecent = [...list].reverse().filter(m => m.isMe && !m.recalled).slice(0, 8).reverse();

  if (!myRecent.length) return '请继续回复刚才的话题。';

  return myRecent.map(m => {
    if (m.type === 'text') return (m.chunks || []).join('\n');
    if (m.type === 'sticker') return `[表情] ${m.stickerName || '表情'}`;
    if (m.type === 'image') return `[图片] ${m.desc || ''}`.trim();
    if (m.type === 'voice') return `[语音] ${m.transcript || ''}`.trim();
    if (m.type === 'transfer') return `[转账] 金额${m.amount}，备注${m.note || '无'}`;
    if (m.type === 'system') return `[系统] ${(m.chunks || []).join(' / ')}`;
    return '[消息]';
  }).join('\n');
}

function renderAllPanels() {
  renderChatList();
  renderGroupList();
  renderFeedList();
}

function getMessageSummary(m) {
  if (!m) return '暂无消息';
  if (m.recalled) return '撤回了一条消息';
  switch (m.type) {
    case 'text':
      return m.chunks?.[0] || '文字消息';
    case 'sticker':
      return `[表情] ${m.stickerName || '表情'}`;
    case 'image':
      return `[图片]${m.desc ? ' ' + m.desc : ''}`;
    case 'voice':
      return `[语音]${m.transcript ? ' ' + m.transcript : ''}`;
    case 'transfer':
      return `[转账] ¥${m.amount}`;
    case 'system':
      return m.chunks?.[0] || '系统消息';
    default:
      return '消息';
  }
}

function generateItem(item, type) {
  const lastMsg = getMessageSummary(messages[item.id]?.slice(-1)[0]);
  const typeLabel = type === 'group' ? '群聊' : '单聊';
  const rel = getRelSetting(item.id);
  const avatar = type === 'direct'
    ? (getChatSetting(item.id).theirAvatar || item.avatar || DEFAULT_AVATAR)
    : (item.avatar || DEFAULT_AVATAR);

  return `
    <div class="chat-item" data-id="${item.id}" onclick="openChat('${item.id}','${type}')" oncontextmenu="showOperationMenu(event,'${item.id}')">
      ${item.isSticky ? '<div class="sticky-tag">置顶</div>' : ''}
      <div class="chat-avatar"><img ${buildMediaSrcAttrs(avatar)} alt=""></div>
      <div class="chat-info">
        <div class="chat-name-row">
          <div class="chat-name">${escapeHTML(item.name)}${rel.blockedByMe ? '（已拉黑）' : ''}</div>
          <div class="chat-type-badge">${typeLabel}</div>
        </div>
        <div class="chat-time">${escapeHTML(item.lastTime || '')}</div>
        <div class="chat-last-msg">${escapeHTML(lastMsg)}</div>
      </div>
    </div>
  `;
}

function renderChatList() {
  const dom = document.getElementById('chatList');
  if (!dom) return;

  if (contactList.length === 0) {
    dom.innerHTML = `<div class="empty-state"><span>暂无联系人，点击右上角＋添加</span></div>`;
    return;
  }

  const sticky = contactList.filter(i => i.isSticky);
  const normal = contactList.filter(i => !i.isSticky);

  let html = '';
  if (sticky.length) {
    html += '<div class="sticky-title">置顶</div>';
    sticky.forEach(i => html += generateItem(i, 'direct'));
  }
  if (normal.length) {
    html += '<div class="sticky-title">朋友</div>';
    normal.forEach(i => html += generateItem(i, 'direct'));
  }

  dom.innerHTML = html;
  hydrateMediaRefs(dom);
}

function renderGroupList() {
  const dom = document.getElementById('groupList');
  if (!dom) return;

  if (groupList.length === 0) {
    dom.innerHTML = `<div class="empty-state"><span>暂无群聊，点击右上角＋创建</span></div>`;
    return;
  }

  dom.innerHTML = '<div class="sticky-title">我的群聊</div>' + groupList.map(i => generateItem(i, 'group')).join('');
  hydrateMediaRefs(dom);
}

async function renderFeedHeader() {
  const avatarEl = document.getElementById('feedMyAvatar');
  const nameEl = document.getElementById('feedUserName');
  const coverEl = document.getElementById('feedCover');
  if (!avatarEl || !nameEl || !coverEl) return;

  const myAvatar = appProfile.myAvatar || DEFAULT_AVATAR;
  const cover = appProfile.feedCover || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=900&auto=format&fit=crop';

  avatarEl.src = await resolveImageRefToUrl(myAvatar);
  nameEl.innerText = appProfile.myName || '我';
  coverEl.style.backgroundImage = `url(${await resolveImageRefToUrl(cover)})`;
}

function renderFeedList() {
  const dom = document.getElementById('feedList');
  if (!dom) return;

  if (feedPosts.length === 0) {
    dom.innerHTML = `<div class="empty-state" style="height:220px;"><span>还没有动态，点击右上角＋发布</span></div>`;
    return;
  }

  dom.innerHTML = feedPosts.map(post => {
    const images = (post.images || []).length ? `
      <div class="feed-image-grid">
        ${(post.images || []).map(src => `<img ${buildMediaSrcAttrs(src)} alt="">`).join('')}
      </div>
    ` : '';

    const likes = (post.likes || []).length
      ? `<div class="feed-comment">❤️ ${(post.likes || []).map(i => `<strong>${escapeHTML(i.from)}</strong>`).join('、')}</div>`
      : '';

    const comments = (post.comments || []).map((c, idx) => `
      <div class="feed-comment">
        <strong>${escapeHTML(c.from)}</strong>${c.replyTo ? ` 回复 <strong>${escapeHTML(c.replyTo)}</strong>` : ''}：${escapeHTML(c.text)}
        <span style="color:#999;cursor:pointer;" onclick="replyFeedComment('${post.id}',${idx})"> 回复</span>
      </div>
    `).join('');

    return `
      <div class="feed-card">
        <div class="feed-post-avatar"><img ${buildMediaSrcAttrs(post.authorAvatar || DEFAULT_AVATAR)} alt=""></div>
        <div class="feed-main">
          <div class="feed-author">${escapeHTML(post.author)}</div>
          <div class="feed-content">${escapeHTML(post.content)}</div>
          ${images}
          <div class="feed-meta-row">
            <div class="feed-meta">${escapeHTML(post.time)}</div>
            <div>
              <button class="feed-op-btn" onclick="toggleFeedLike('${post.id}')">点赞</button>
              <button class="feed-op-btn" onclick="feedQuickComment('${post.id}')">评论</button>
            </div>
          </div>
          <div class="feed-comment-box">
            ${likes}
            ${comments || '<div class="feed-comment">还没有评论</div>'}
          </div>
        </div>
      </div>
    `;
  }).join('');

  hydrateMediaRefs(dom);
}

function toggleFeedLike(postId) {
  const post = feedPosts.find(i => i.id === postId);
  if (!post) return;
  const myName = appProfile.myName || '我';
  post.likes = post.likes || [];
  const idx = post.likes.findIndex(i => i.from === myName);
  if (idx >= 0) {
    post.likes.splice(idx, 1);
  } else {
    post.likes.push({ from: myName });
  }
  saveAll();
  renderFeedList();
}

async function feedQuickComment(postId) {
  const post = feedPosts.find(i => i.id === postId);
  if (!post) return;

  const text = prompt('输入评论内容');
  if (!text) return;

  post.comments = post.comments || [];
  post.comments.push({
    from: appProfile.myName || '我',
    text
  });

  const triggerAI = confirm('是否让AI角色回复这条评论？');
  if (triggerAI) {
    const bridgeName = post.bridgeName || post.author || '角色';
    let slashOk = false;

    if (VV_BRIDGE_CONFIG.enabled && (VV_BRIDGE_CONFIG.feedMode === 'slash' || VV_BRIDGE_CONFIG.feedMode === 'local+slash')) {
      const cmd = VV_BRIDGE_CONFIG.buildFeedCommentCommand({
        bridgeName,
        postId,
        promptText: `用户评论了你的动态：${text}\n请以动态作者身份进行一条自然回复。`
      });
      slashOk = await triggerSlash(cmd);
    }

    if (!slashOk || VV_BRIDGE_CONFIG.feedMode === 'local') {
      post.comments.push({
        from: '角色',
        text: '我看到了你的评论。'
      });
    }
  }

  saveAll();
  renderFeedList();
}

async function replyFeedComment(postId, commentIndex) {
  const post = feedPosts.find(i => i.id === postId);
  if (!post || !post.comments?.[commentIndex]) return;

  const target = post.comments[commentIndex];
  const text = prompt(`回复 ${target.from}`);
  if (!text) return;

  post.comments.push({
    from: appProfile.myName || '我',
    replyTo: target.from,
    text
  });

  const triggerAI = confirm('是否让AI角色回复你的这条评论？');
  if (triggerAI) {
    const bridgeName = post.bridgeName || post.author || '角色';
    let slashOk = false;

    if (VV_BRIDGE_CONFIG.enabled && (VV_BRIDGE_CONFIG.feedMode === 'slash' || VV_BRIDGE_CONFIG.feedMode === 'local+slash')) {
      const cmd = VV_BRIDGE_CONFIG.buildFeedCommentCommand({
        bridgeName,
        postId,
        promptText: `用户回复了评论。\n原评论人:${target.from}\n用户回复内容:${text}\n请以动态作者身份进行一条自然回复。`
      });
      slashOk = await triggerSlash(cmd);
    }

    if (!slashOk || VV_BRIDGE_CONFIG.feedMode === 'local') {
      post.comments.push({
        from: '角色',
        replyTo: appProfile.myName || '我',
        text: '我来接一句。'
      });
    }
  }

  saveAll();
  renderFeedList();
}

function addContact() {
  const name = document.getElementById('contactName')?.value.trim();
  const bridgeName = document.getElementById('contactBridgeName')?.value.trim();

  if (!name) {
    alert('请输入角色名称！');
    return;
  }

  if (contactList.find(i => i.name === name)) {
    alert('这个联系人已经存在了');
    return;
  }

  const id = 'c' + Date.now();
  const time = getNowTime();

  contactList.unshift({
    id,
    name,
    avatar: DEFAULT_AVATAR,
    isSticky: false,
    lastTime: time,
    bridgeName: bridgeName || name,
    threadType: 'direct'
  });

  messages[id] = [{
    id: 'm' + Date.now(),
    sender: 'system',
    senderName: '系统',
    isMe: false,
    type: 'system',
    chunks: ['已建立联系，开始聊天吧~'],
    time,
    timeLabel: getNowFullLabel()
  }];

  getChatSetting(id);
  getRelSetting(id);

  saveAll();
  renderChatList();
  closeDialog('addContactDialog');
}

function addGroup() {
  const name = document.getElementById('groupName')?.value.trim();
  const membersRaw = document.getElementById('groupMembers')?.value.trim();

  if (!name) {
    alert('请输入群聊名称');
    return;
  }

  const members = String(membersRaw || '').split('\n').map(i => i.trim()).filter(Boolean);
  const id = 'g' + Date.now();
  const time = getNowTime();

  groupList.unshift({
    id,
    name,
    bridgeName: name,
    avatar: DEFAULT_AVATAR,
    isSticky: false,
    lastTime: time,
    members
  });

  messages[id] = [{
    id: 'm' + Date.now(),
    sender: 'system',
    senderName: '系统',
    isMe: false,
    type: 'system',
    chunks: [`群聊「${name}」已创建`, members.length ? `成员：${members.join('、')}` : '暂时还没有成员'],
    time,
    timeLabel: getNowFullLabel()
  }];

  saveAll();
  renderGroupList();
  closeDialog('addGroupDialog');
}

async function addFeedPost() {
  const content = document.getElementById('feedContentInput')?.value.trim();

  if (!content && !currentFeedImages.length) {
    alert('请输入动态内容或选择图片');
    return;
  }

  const storedImages = [];
  for (const img of [...currentFeedImages].slice(0, 9)) {
    storedImages.push(await persistImageToIDB(img, {
      area: 'feed.post.image'
    }));
  }

  const authorAvatar = appProfile.myAvatar
    ? await persistImageToIDB(appProfile.myAvatar, { area: 'feed.authorAvatar' }).catch(() => appProfile.myAvatar)
    : DEFAULT_AVATAR;

  feedPosts.unshift({
    id: 'f' + Date.now(),
    author: appProfile.myName || '我',
    authorAvatar,
    bridgeName: appProfile.myName || '我',
    content,
    time: getNowTime(),
    images: storedImages,
    likes: [],
    comments: [{ from: '系统', text: '动态已发布' }]
  });

  saveAll();
  renderFeedList();
  closeDialog('postFeedDialog');
}

function openChat(id, type = 'direct') {
  currentChatId = id;
  currentChatType = type;

  const list = type === 'group' ? groupList : contactList;
  const item = list.find(i => i.id === id);
  if (!item) return;

  const title = document.getElementById('chatDetailName');
  const a = document.getElementById('contactPage');
  const b = document.getElementById('chatDetailPage');

  if (title) title.innerText = item.name;
  if (a) a.style.display = 'none';
  if (b) b.style.display = 'block';

  applyCurrentChatBackground();
  clearComposerDraft();
  renderMessages();
}

async function applyCurrentChatBackground() {
  const bg = getChatSetting(currentChatId).background || '';
  const layer = document.getElementById('chatBackgroundLayer');
  if (!layer) return;

  if (bg) {
    const finalBg = await resolveImageRefToUrl(bg);
    layer.style.backgroundImage = `url(${finalBg})`;
    layer.style.backgroundColor = 'transparent';
  } else {
    layer.style.backgroundImage = 'none';
    layer.style.backgroundColor = '#f0f0f0';
  }
}

function renderMessageOriginal(m) {
  switch (m.type) {
    case 'text':
      return (m.chunks || []).map(chunk => `<div class="message-bubble">${escapeHTML(chunk)}</div>`).join('');
    case 'sticker':
      return `<div class="message-bubble sticker-bubble"><img ${buildMediaSrcAttrs(m.src)} alt="${escapeHTML(m.stickerName || '表情')}"></div>`;
    case 'image':
      return `
        <div class="message-bubble image-bubble">
          <img ${buildMediaSrcAttrs(m.src)} alt="">
          ${m.desc ? `<div class="image-desc">${escapeHTML(m.desc)}</div>` : ''}
        </div>`;
    case 'voice':
      return `
        <div class="message-bubble voice-bubble">
          <div class="voice-main">
            <div class="voice-icon">🎤</div>
            <div>${escapeHTML(m.duration || 4)}'' 语音</div>
          </div>
          <div class="voice-text">转文字：${escapeHTML(m.transcript || '')}</div>
        </div>`;
    case 'transfer':
      return `
        <div class="transfer-card ${m.status === '已收款' ? 'received' : ''}">
          <div class="transfer-card-top">
            <div class="transfer-icon">${m.status === '已收款' ? '✓' : '¥'}</div>
            <div class="transfer-text">
              <div class="transfer-amount">¥${escapeHTML(m.amount)}</div>
              <div class="transfer-note">${escapeHTML(m.note || '转账')}</div>
            </div>
          </div>
          <div class="transfer-card-bottom">${escapeHTML(m.status || '待收款')}</div>
        </div>`;
    case 'system':
      return (m.chunks || []).map(chunk => `<div class="message-bubble">${escapeHTML(chunk)}</div>`).join('');
    default:
      return `<div class="message-bubble">未知消息</div>`;
  }
}

function renderMessages() {
  const area = document.getElementById('messageArea');
  if (!area) return;

  const msgs = messages[currentChatId] || [];
  if (!msgs.length) {
    area.innerHTML = '<div style="text-align:center;color:#999;padding:20px;">开始聊天吧~</div>';
    return;
  }

  const setting = getChatSetting(currentChatId);
  let html = '';
  let lastLabel = '';

  msgs.forEach(m => {
    const label = m.timeLabel || '';
    if (label && !isSameTimeDivider(label, lastLabel)) {
      html += `<div class="time-divider">${escapeHTML(label)}</div>`;
      lastLabel = label;
    }

    const avatarSrc = m.isMe
      ? (setting.myAvatar || DEFAULT_AVATAR)
      : (setting.theirAvatar || DEFAULT_AVATAR);

    const avatar = `<div class="message-avatar"><img ${buildMediaSrcAttrs(avatarSrc)} alt=""></div>`;

    const senderName = (!m.isMe && currentChatType === 'group')
      ? `<div class="message-sender">${escapeHTML(m.senderName || '')}</div>`
      : '';

    const quote = m.replyTo ? `
      <div class="quote-box">
        <strong>${escapeHTML(m.replyTo.senderName || '消息')}</strong><br>
        ${escapeHTML(m.replyTo.preview || '')}
      </div>` : '';

    let bodyHTML = '';

    if (m.recalled) {
      bodyHTML = `
        <div class="recalled-tip" onclick="toggleHiddenOriginal('${m.id}')">
          ${m.isMe ? '你' : escapeHTML(m.senderName || '对方')}撤回了一条消息
        </div>
        <div class="hidden-original" id="hidden-${m.id}">
          ${renderMessageOriginal(m)}
        </div>`;
    } else {
      bodyHTML = renderMessageOriginal(m);
    }

    html += `
      <div class="message-row ${m.isMe ? 'me' : ''}" data-mid="${m.id}" oncontextmenu="showMessageMenu(event,'${m.id}')">
        <div class="message-group">
          ${avatar}
          <div class="message-stack">
            ${senderName}
            ${quote}
            ${bodyHTML}
          </div>
        </div>
      </div>
    `;
  });

  area.innerHTML = html;
  hydrateMediaRefs(area);
  area.scrollTop = area.scrollHeight;
}

function toggleHiddenOriginal(mid) {
  const el = document.getElementById('hidden-' + mid);
  if (!el) return;
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function clearComposerDraft() {
  composerDraft = {
    quote: null,
    attachments: []
  };
  renderComposerPreview();
}

function clearComposerQuote() {
  composerDraft.quote = null;
  renderComposerPreview();
}

function renderComposerPreview() {
  const quoteBox = document.getElementById('composerQuotePreview');
  const quoteText = document.getElementById('composerQuoteText');
  const attachBox = document.getElementById('composerAttachments');
  if (!quoteBox || !quoteText || !attachBox) return;

  if (composerDraft.quote) {
    quoteBox.style.display = 'flex';
    quoteText.innerHTML = `引用 <strong>${escapeHTML(composerDraft.quote.senderName)}</strong>：${escapeHTML(composerDraft.quote.preview)}`;
  } else {
    quoteBox.style.display = 'none';
  }

  if (composerDraft.attachments.length) {
    attachBox.style.display = 'flex';
    attachBox.innerHTML = composerDraft.attachments.map((att, idx) => {
      if (att.type === 'sticker') {
        return `<div class="attach-chip"><img ${buildMediaSrcAttrs(att.src)} alt=""><div class="attach-chip-text">表情：${escapeHTML(att.stickerName)}</div><button class="attach-chip-close" onclick="removeDraftAttachment(${idx})">✕</button></div>`;
      }
      if (att.type === 'image') {
        return `<div class="attach-chip"><img ${buildMediaSrcAttrs(att.src)} alt=""><div class="attach-chip-text">图片：${escapeHTML(att.desc || '未填写描述')}</div><button class="attach-chip-close" onclick="removeDraftAttachment(${idx})">✕</button></div>`;
      }
      if (att.type === 'voice') {
        return `<div class="attach-chip"><div class="attach-chip-text">语音：${escapeHTML(att.transcript || '')}</div><button class="attach-chip-close" onclick="removeDraftAttachment(${idx})">✕</button></div>`;
      }
      if (att.type === 'transfer') {
        return `<div class="attach-chip"><div class="attach-chip-text">转账：¥${escapeHTML(att.amount)} ${escapeHTML(att.note || '')}</div><button class="attach-chip-close" onclick="removeDraftAttachment(${idx})">✕</button></div>`;
      }
      return '';
    }).join('');

    hydrateMediaRefs(attachBox);
  } else {
    attachBox.style.display = 'none';
    attachBox.innerHTML = '';
  }
}

function removeDraftAttachment(index) {
  composerDraft.attachments.splice(index, 1);
  renderComposerPreview();
}

function getAttachmentSummary(att) {
  if (!att) return '消息';
  if (att.type === 'sticker') return `[表情] ${att.stickerName || '表情'}`;
  if (att.type === 'image') return `[图片]${att.desc ? ' ' + att.desc : ''}`;
  if (att.type === 'voice') return `[语音] ${att.transcript || ''}`;
  if (att.type === 'transfer') return `[转账] ¥${att.amount}`;
  return '消息';
}

function updateLastMsg(id, lastText, time, type = currentChatType) {
  const list = type === 'group' ? groupList : contactList;
  const item = list.find(i => i.id === id);
  if (item) {
    item.lastTime = time || item.lastTime;
    item.lastPreview = lastText || item.lastPreview || '';
  }
  saveAll();
  renderAllPanels();
}

function collectRefsFromMessage(msg) {
  const refs = [];
  if (msg && isIDBRef(msg.src)) refs.push(msg.src);
  return refs;
}

function removeRefsPossiblyUnused(refs) {
  if (!refs || !refs.length) return;
  setTimeout(() => {
    cleanupUnusedIDBAssets();
  }, 0);
}

function sendMessage() {
  if (!currentChatId) return;

  const rel = getRelSetting(currentChatId);
  if (rel.blockedByMe) {
    alert('你已拉黑该联系人，无法发送消息');
    return;
  }
  if (rel.blockedByThem) {
    alert('对方已拉黑你，消息将被拒收');
    return;
  }

  const input = document.getElementById('chatInput');
  if (!input) return;

  const rawText = input.value.trim();
  const chunks = splitInputToChunks(rawText);
  const hasText = chunks.length > 0;
  const attachments = [...composerDraft.attachments];
  const hasAnything = hasText || attachments.length || composerDraft.quote;

  if (!hasAnything) return;

  if (!messages[currentChatId]) messages[currentChatId] = [];

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  if (hasText) {
    messages[currentChatId].push({
      id: 'm' + Date.now() + '_t',
      sender: 'me',
      senderName: '我',
      isMe: true,
      type: 'text',
      chunks,
      replyTo: composerDraft.quote ? { ...composerDraft.quote } : null,
      recalled: false,
      time,
      timeLabel
    });
  }

  attachments.forEach((att, idx) => {
    messages[currentChatId].push({
      id: 'm' + Date.now() + '_' + idx,
      sender: 'me',
      senderName: '我',
      isMe: true,
      type: att.type,
      src: att.src || '',
      stickerName: att.stickerName || '',
      desc: att.desc || '',
      transcript: att.transcript || '',
      duration: att.duration || 4,
      amount: att.amount || '',
      note: att.note || '',
      status: att.status || '',
      replyTo: (!hasText && idx === 0 && composerDraft.quote) ? { ...composerDraft.quote } : null,
      recalled: false,
      time,
      timeLabel
    });
  });

  const lastContent = hasText ? chunks[chunks.length - 1] : getAttachmentSummary(attachments[attachments.length - 1]);
  updateLastMsg(currentChatId, lastContent, time, currentChatType);

  pendingReplyTargets[currentChatId] = true;

  input.value = '';
  clearComposerDraft();
  renderMessages();
  saveAll();

  // === VV_EVENT 发送区：先只发文本消息 ===
  if (hasText) {
    const rel2 = getRelSetting(currentChatId);
    const chatSetting = getChatSetting(currentChatId) || {};
    const contactName = chatSetting.name || rel2.name || '未知联系人';

    const myAvatarKey = (appProfile && appProfile.myAvatar) ? 'current_my_avatar' : 'current_my_avatar';
    const targetAvatarId = chatSetting.theirAvatar ? String(chatSetting.theirAvatar) : 'contact_unknown_avatar';
    const myBubble = (chatSetting.myBubble || '#5B86FF');
    const targetBubble = (chatSetting.theirBubble || '#F8F8F8');
    const chatBgKey = chatSetting.background ? String(chatSetting.background) : 'current_chat_bg';

    const eventText = [
      '[VV_EVENT]',
      'type=chat',
      'target=' + contactName,
      'time=' + timeLabel,
      'message=' + rawText.replace(/\n/g, '\\n'),
      'myAvatarKey=' + myAvatarKey,
      'targetAvatarId=' + targetAvatarId,
      'myBubble=' + myBubble,
      'targetBubble=' + targetBubble,
      'chatBgKey=' + chatBgKey,
      '[/VV_EVENT]'
    ].join('\n');

    console.log('VV_EVENT =>\n' + eventText);

    // 先尝试发给父页面/桥接层
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'VV_EVENT',
        payload: eventText
      }, '*');
    }
  }
}

function buildVVEventPayload(chatId) {
  const list = messages[chatId] || [];
  const myRecent = [...list].reverse().filter(m => m.isMe && !m.recalled).slice(0, 1).reverse();
  if (!myRecent.length) return '';

  const last = myRecent[0];
  const chatSetting = getChatSetting(chatId) || {};
  const rel = getRelSetting(chatId) || {};
  const time = typeof getNowFullLabel === 'function' ? getNowFullLabel() : getNowTime();
  const targetName = rel.name || chatSetting.name || getBridgeNameByChatId(chatId, currentChatType) || '未知联系人';

  let messageText = '';
  if (last.type === 'text') messageText = (last.chunks || []).join('\n');
  else if (last.type === 'sticker') messageText = `[表情] ${last.stickerName || '表情'}`;
  else if (last.type === 'image') messageText = `[图片] ${last.desc || ''}`.trim();
  else if (last.type === 'voice') messageText = `[语音] ${last.transcript || ''}`.trim();
  else if (last.type === 'transfer') messageText = `[转账] 金额${last.amount}，备注${last.note || '无'}`;
  else if (last.type === 'system') messageText = `[系统] ${(last.chunks || []).join(' / ')}`;
  else messageText = '[消息]';

  const myAvatarKey = 'current_my_avatar';
  const targetAvatarId = chatSetting.theirAvatar ? String(chatSetting.theirAvatar) : 'contact_unknown_avatar';
  const myBubble = chatSetting.myBubble || '#5B86FF';
  const targetBubble = chatSetting.theirBubble || '#F8F8F8';
  const chatBgKey = chatSetting.background ? String(chatSetting.background) : 'current_chat_bg';

  return [
    '以下是一次手机聊天事件。',
    '不要复述事件字段，不要解释字段内容，不要引用字段名。',
    '如果角色选择继续回复线上消息，必须直接使用 [消息] 块格式回复。',
    '每条回复消息都要单独成块。',
    '如需表现正在输入，可先输出 state=typing 的 [消息] 块。',
    '如果角色不打算回复线上消息，则改为正常正文，并明确交代没有继续回复手机消息。',
    '',
    '[VV_EVENT]',
    'type=chat',
    'target=' + targetName,
    'time=' + time,
    'message=' + String(messageText || '').replace(/\n/g, '\\n'),
    'myAvatarKey=' + myAvatarKey,
    'targetAvatarId=' + targetAvatarId,
    'myBubble=' + myBubble,
    'targetBubble=' + targetBubble,
    'chatBgKey=' + chatBgKey,
    '[/VV_EVENT]'
  ].join('\n');
}

async function triggerAIReply() {
  if (!currentChatId) return;

  if (!pendingReplyTargets[currentChatId]) {
    alert('当前没有待回复的新内容');
    return;
  }

  pendingReplyTargets[currentChatId] = false;

  const bridgeName = getBridgeNameByChatId(currentChatId, currentChatType);
  const promptText = buildVVEventPayload(currentChatId) || buildLatestUserPayload(currentChatId);

  let slashOk = false;

  if (VV_BRIDGE_CONFIG.enabled && (VV_BRIDGE_CONFIG.chatMode === 'slash' || VV_BRIDGE_CONFIG.chatMode === 'local+slash')) {
    const cmd = VV_BRIDGE_CONFIG.buildReplyCommand({
      bridgeName,
      chatId: currentChatId,
      chatType: currentChatType,
      promptText
    });
    slashOk = await triggerSlash(cmd);
  }

  if (!slashOk || VV_BRIDGE_CONFIG.chatMode === 'local') {
    simulateAutoReply(currentChatId, currentChatType);
  }

  saveAll();
}

function simulateAutoReply(targetId, type) {
  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  if (!messages[targetId]) messages[targetId] = [];

  const lastMine = [...messages[targetId]].reverse().find(m => m.isMe);
  let autoReply;

  if (type === 'group') {
    autoReply = {
      id: 'm' + Date.now(),
      sender: 'npc_' + Date.now(),
      senderName: '群友A',
      isMe: false,
      type: 'text',
      chunks: ['看到了，我先回一句。', '这个群终于热闹起来了。'],
      recalled: false,
      time,
      timeLabel
    };
  } else {
    let text = '我看到了你刚刚发来的消息。';
    if (lastMine?.type === 'transfer') {
      text = '我已经收下转账了。';
      lastMine.status = '已收款';
    }
    autoReply = {
      id: 'm' + Date.now(),
      sender: targetId,
      senderName: getCurrentChatName(targetId, type),
      isMe: false,
      type: 'text',
      chunks: [text],
      recalled: false,
      time,
      timeLabel
    };
  }

  messages[targetId].push(autoReply);
  renderMessages();
  updateLastMsg(targetId, autoReply.chunks?.slice(-1)[0] || '新消息', time, type);
  saveAll();
}

function appendAIMessageToCurrentChat({ chatId, senderName, text, type = 'text' }) {
  if (!chatId) return;
  if (!messages[chatId]) messages[chatId] = [];

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  const lastMine = [...messages[chatId]].reverse().find(m => m.isMe);
  if (lastMine?.type === 'transfer' && lastMine.status !== '已收款') {
    lastMine.status = '已收款';
  }

  messages[chatId].push({
    id: 'm' + Date.now(),
    sender: chatId,
    senderName: senderName || getCurrentChatName(chatId, currentChatType),
    isMe: false,
    type,
    chunks: type === 'text' ? splitInputToChunks(text || '...') : [text || '...'],
    recalled: false,
    time,
    timeLabel
  });

  renderMessages();
  updateLastMsg(chatId, text || '新消息', time, currentChatType);
  saveAll();
}

function appendAICommentToFeed({ postId, senderName, text, replyTo = '' }) {
  const post = feedPosts.find(i => i.id === postId);
  if (!post) return;

  post.comments = post.comments || [];
  post.comments.push({
    from: senderName || '角色',
    replyTo: replyTo || '',
    text: text || '……'
  });

  saveAll();
  renderFeedList();
}

function showOperationMenu(e, id) {
  e.preventDefault();
  e.stopPropagation();

  if (currentContactTab !== 'direct') return;

  currentActiveContactId = id;
  const menu = document.getElementById('operationMenu');
  const btn = document.getElementById('stickyBtn');
  const contact = contactList.find(i => i.id === id);
  if (!menu || !btn || !contact) return;

  btn.innerText = contact.isSticky ? '取消置顶' : '置顶';

  const rect = document.getElementById('phoneContainer').getBoundingClientRect();
  menu.style.top = `${e.clientY - rect.top}px`;
  menu.style.right = `16px`;
  menu.classList.add('show');
}

function toggleSticky() {
  const c = contactList.find(i => i.id === currentActiveContactId);
  if (c) {
    c.isSticky = !c.isSticky;
    saveAll();
    renderChatList();
  }
  document.getElementById('operationMenu')?.classList.remove('show');
}

function deleteContact() {
  if (!confirm('确定删除？')) return;

  const removedMessages = messages[currentActiveContactId] || [];
  const refs = [];
  removedMessages.forEach(m => refs.push(...collectRefsFromMessage(m)));

  const setting = chatSettings[currentActiveContactId];
  if (setting) {
    if (isIDBRef(setting.background)) refs.push(setting.background);
    if (isIDBRef(setting.myAvatar)) refs.push(setting.myAvatar);
    if (isIDBRef(setting.theirAvatar)) refs.push(setting.theirAvatar);
  }

  contactList = contactList.filter(i => i.id !== currentActiveContactId);
  delete messages[currentActiveContactId];
  delete chatSettings[currentActiveContactId];
  delete relationshipSettings[currentActiveContactId];

  saveAll();
  renderChatList();
  document.getElementById('operationMenu')?.classList.remove('show');
  removeRefsPossiblyUnused(refs);
}

function showMessageMenu(e, mid) {
  e.preventDefault();
  e.stopPropagation();
  currentMessageAction = { id: mid };
  const menu = document.getElementById('messageOperationMenu');
  if (!menu) return;
  const rect = document.getElementById('phoneContainer').getBoundingClientRect();
  menu.style.top = `${e.clientY - rect.top}px`;
  menu.style.left = `${Math.max(10, e.clientX - rect.left - 40)}px`;
  menu.classList.add('show');
}

function findCurrentMessage() {
  const list = messages[currentChatId] || [];
  return list.find(m => m.id === currentMessageAction?.id);
}

function quoteCurrentMessage() {
  const msg = findCurrentMessage();
  if (!msg) return;
  composerDraft.quote = {
    messageId: msg.id,
    senderName: msg.senderName || (msg.isMe ? '我' : '对方'),
    preview: getMessageSummary(msg)
  };
  renderComposerPreview();
  document.getElementById('messageOperationMenu')?.classList.remove('show');
}

function recallCurrentMessage() {
  const msg = findCurrentMessage();
  if (!msg) return;
  msg.recalled = true;
  renderMessages();
  saveAll();
  document.getElementById('messageOperationMenu')?.classList.remove('show');
}

function deleteCurrentMessage() {
  if (!currentMessageAction) return;

  const list = messages[currentChatId] || [];
  const target = list.find(m => m.id === currentMessageAction.id);
  const refs = target ? collectRefsFromMessage(target) : [];

  messages[currentChatId] = list.filter(m => m.id !== currentMessageAction.id);
  renderMessages();
  saveAll();
  document.getElementById('messageOperationMenu')?.classList.remove('show');
  removeRefsPossiblyUnused(refs);
}

function initDefaultStickers() {
  if (stickerPacks.length) return;
  stickerPacks = [
    { id: 's1', name: '开心小熊', src: 'https://images.unsplash.com/photo-1545243424-0ce743321e11?q=80&w=300&auto=format&fit=crop' },
    { id: 's2', name: '委屈小狗', src: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=300&auto=format&fit=crop' },
    { id: 's3', name: '困困猫咪', src: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=300&auto=format&fit=crop' },
    { id: 's4', name: '爱心小兔', src: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=300&auto=format&fit=crop' }
  ];
}

function toggleEmojiPanel() {
  const panel = document.getElementById('emojiPanel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  if (panel.style.display === 'block') renderEmojiPanel();
}

function renderEmojiPanel() {
  const grid = document.getElementById('emojiPanelGrid');
  if (!grid) return;
  grid.innerHTML = stickerPacks.map(s => `
    <div class="emoji-item" onclick="addStickerDraft('${s.id}')">
      <img ${buildMediaSrcAttrs(s.src)} alt="">
      <span>${escapeHTML(s.name)}</span>
    </div>
  `).join('');
  hydrateMediaRefs(grid);
}

function addStickerDraft(id) {
  const s = stickerPacks.find(i => i.id === id);
  if (!s) return;
  composerDraft.attachments.push({
    type: 'sticker',
    stickerName: s.name,
    src: s.src
  });
  renderComposerPreview();
}

function pickComposerImage() {
  showDialog('imageSendDialog');
}

async function confirmImageDraft() {
  if (!currentSendImageData) {
    alert('请先选择图片');
    return;
  }

  const storedRef = await persistImageToIDB(currentSendImageData, {
    area: 'composer.image',
    chatId: currentChatId
  });

  composerDraft.attachments.push({
    type: 'image',
    src: storedRef,
    desc: document.getElementById('sendImageDesc')?.value.trim() || ''
  });

  renderComposerPreview();
  closeDialog('imageSendDialog');
}

function addVoiceDraft() {
  showDialog('voiceDialog');
}

function confirmVoiceDraft() {
  const transcript = document.getElementById('voiceTextInput')?.value.trim();
  const duration = document.getElementById('voiceDurationInput')?.value.trim() || '4';
  if (!transcript) {
    alert('请输入语音转文字内容');
    return;
  }
  composerDraft.attachments.push({
    type: 'voice',
    transcript,
    duration
  });
  renderComposerPreview();
  closeDialog('voiceDialog');
}

function openTransferDialog() {
  if (!currentChatId) return;
  showDialog('transferDialog');
}

function confirmTransfer() {
  if (!currentChatId) return;
  const amount = document.getElementById('transferAmount')?.value.trim();
  const note = document.getElementById('transferNote')?.value.trim();

  if (!amount) {
    alert('请输入金额');
    return;
  }

  composerDraft.attachments.push({
    type: 'transfer',
    amount,
    note: note || '转账',
    status: '待收款'
  });

  renderComposerPreview();
  closeDialog('transferDialog');
}

function startCallFromDialog() {
  const name = document.getElementById('callTargetName')?.value.trim();
  if (!name) {
    alert('请输入要拨打的角色名称');
    return;
  }

  let contact = contactList.find(i => i.name === name || i.bridgeName === name);
  if (!contact) {
    const id = 'c' + Date.now();
    const time = getNowTime();
    contact = {
      id,
      name,
      avatar: DEFAULT_AVATAR,
      isSticky: false,
      lastTime: time,
      bridgeName: name,
      threadType: 'direct'
    };
    contactList.unshift(contact);

    if (!messages[id]) {
      messages[id] = [{
        id: 'm' + Date.now(),
        sender: 'system',
        senderName: '系统',
        isMe: false,
        type: 'system',
        chunks: ['已通过电话建立联系'],
        time,
        timeLabel: getNowFullLabel()
      }];
    }

    getChatSetting(id);
    getRelSetting(id);
  }

  saveAll();
  closeDialog('addCallDialog');
  simulateOutgoingCall(contact.id);
}

async function simulateOutgoingCall(contactId) {
  const contact = contactList.find(i => i.id === contactId);
  if (!contact) return;

  currentCallId = contactId;
  hideAllPages();
  document.getElementById('callPage').style.display = 'block';
  document.getElementById('callName').innerText = contact.name;
  document.getElementById('callAvatar').src = await resolveImageRefToUrl(getChatSetting(contactId).theirAvatar || contact.avatar || DEFAULT_AVATAR);
  document.getElementById('callStatus').innerText = '正在呼叫…';
  document.getElementById('callTranscript').innerHTML = '<div class="call-line">拨号中…</div>';

  const bridgeName = contact.bridgeName || contact.name;
  let ok = false;

  if (VV_BRIDGE_CONFIG.enabled && (VV_BRIDGE_CONFIG.callMode === 'slash' || VV_BRIDGE_CONFIG.callMode === 'local+slash')) {
    const cmd = VV_BRIDGE_CONFIG.buildCallCommand({
      bridgeName,
      promptText: '用户正在拨打电话，请根据当前剧情决定：接听、拒接或无人接听。请由宿主根据结果回传 VVPHONE_CALL_STATUS。'
    });
    ok = await triggerSlash(cmd);
  }

  if (!ok || VV_BRIDGE_CONFIG.callMode === 'local') {
    const outcomes = ['accepted', 'rejected', 'missed'];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];

    setTimeout(() => {
      if (result === 'accepted') {
        openCallPage(contactId, true);
      } else if (result === 'rejected') {
        document.getElementById('callStatus').innerText = '对方已拒接';
        document.getElementById('callTranscript').innerHTML = '<div class="call-line">通话未接通，对方拒接了你的来电。</div>';
      } else {
        document.getElementById('callStatus').innerText = '无人接听';
        document.getElementById('callTranscript').innerHTML = '<div class="call-line">通话未接通，对方暂时没有接听。</div>';
      }
    }, 1200);
  }
}

async function openCallPage(contactId, accepted = false) {
  const contact = contactList.find(i => i.id === contactId);
  if (!contact) return;

  currentCallId = contactId;
  hideAllPages();
  document.getElementById('callPage').style.display = 'block';

  document.getElementById('callName').innerText = contact.name;
  document.getElementById('callAvatar').src = await resolveImageRefToUrl(getChatSetting(contactId).theirAvatar || contact.avatar || DEFAULT_AVATAR);
  document.getElementById('callStatus').innerText = accepted ? '通话中…' : '正在连接…';

  if (!callLogs[contactId]) {
    callLogs[contactId] = [
      { speaker: contact.name, isMe: false, text: '喂，我接到了。', time: getNowTime() }
    ];
  }

  renderCallTranscript();
  saveAll();
}

function renderCallTranscript() {
  const box = document.getElementById('callTranscript');
  if (!box) return;

  const logs = callLogs[currentCallId] || [];
  if (!logs.length) {
    box.innerHTML = '<div class="call-line">通话已连接。</div>';
    return;
  }

  box.innerHTML = logs.map(item => `<div class="call-line ${item.isMe ? 'me' : ''}">${escapeHTML(item.text)}</div>`).join('');
  box.scrollTop = box.scrollHeight;
}

async function sendCallMessage() {
  const input = document.getElementById('callInput');
  const raw = input?.value.trim();
  if (!raw || !currentCallId) return;

  const lines = splitInputToChunks(raw);
  if (!lines.length) return;

  if (!callLogs[currentCallId]) callLogs[currentCallId] = [];

  lines.forEach(line => {
    callLogs[currentCallId].push({
      speaker: '我',
      isMe: true,
      text: line,
      time: getNowTime()
    });
  });

  input.value = '';
  renderCallTranscript();
  saveAll();

  const contact = contactList.find(i => i.id === currentCallId);
  const bridgeName = contact?.bridgeName || contact?.name || '角色';

  let ok = false;
  if (VV_BRIDGE_CONFIG.enabled && (VV_BRIDGE_CONFIG.callMode === 'slash' || VV_BRIDGE_CONFIG.callMode === 'local+slash')) {
    const cmd = VV_BRIDGE_CONFIG.buildCallCommand({
      bridgeName,
      promptText: lines.join('\n')
    });
    ok = await triggerSlash(cmd);
  }

  if (!ok || VV_BRIDGE_CONFIG.callMode === 'local') {
    setTimeout(() => {
      callLogs[currentCallId].push({
        speaker: contact?.name || '对方',
        isMe: false,
        text: '我听见了，你继续说。',
        time: getNowTime()
      });
      renderCallTranscript();
      saveAll();
    }, 900);
  }
}

function jumpCallToChat() {
  if (!currentCallId) return;
  const id = currentCallId;
  document.getElementById('callPage').style.display = 'none';
  document.getElementById('contactPage').style.display = 'block';
  openChat(id, 'direct');
}

function endCall() {
  if (!currentCallId) {
    closeCallPage();
    return;
  }

  const contact = contactList.find(i => i.id === currentCallId);
  if (contact) {
    document.getElementById('callStatus').innerText = '通话结束';

    if (!messages[currentCallId]) messages[currentCallId] = [];
    messages[currentCallId].push({
      id: 'm' + Date.now(),
      sender: 'system',
      senderName: '系统',
      isMe: false,
      type: 'system',
      chunks: [`与${contact.name}的通话已结束`],
      time: getNowTime(),
      timeLabel: getNowFullLabel()
    });

    contact.lastTime = getNowTime();
    saveAll();
  }

  setTimeout(closeCallPage, 300);
}

function openCallFromChat() {
  if (!currentChatId || currentChatType !== 'direct') {
    alert('当前只有单聊可以直接拨打电话');
    return;
  }
  simulateOutgoingCall(currentChatId);
}

async function simulateIncomingCall(contactId) {
  const contact = contactList.find(i => i.id === contactId);
  if (!contact) return;

  currentIncomingCallId = contactId;
  hideAllPages();
  document.getElementById('incomingCallPage').style.display = 'block';
  document.getElementById('incomingName').innerText = contact.name;
  document.getElementById('incomingAvatar').src = await resolveImageRefToUrl(getChatSetting(contactId).theirAvatar || DEFAULT_AVATAR);
  resetSwipeThumb();
}

function resetSwipeThumb() {
  const thumb = document.getElementById('swipeThumb');
  if (!thumb) return;
  thumb.classList.remove('reject');
  thumb.style.left = 'calc(50% - 22px)';
}

function acceptIncomingCall() {
  if (!currentIncomingCallId) return;
  document.getElementById('incomingCallPage').style.display = 'none';
  openCallPage(currentIncomingCallId, true);
}

function rejectIncomingCall() {
  if (!currentIncomingCallId) return;
  const id = currentIncomingCallId;
  const contact = contactList.find(i => i.id === id);

  if (contact) {
    if (!messages[id]) messages[id] = [];
    messages[id].push({
      id: 'm' + Date.now(),
      sender: 'system',
      senderName: '系统',
      isMe: false,
      type: 'system',
      chunks: [`你拒接了${contact.name}的来电`],
      time: getNowTime(),
      timeLabel: getNowFullLabel()
    });
  }

  saveAll();
  hideAllPages();
  document.getElementById('homePage').style.display = 'block';
}

async function openChatSettingPage() {
  if (!currentChatId || currentChatType !== 'direct') {
    alert('当前只有单聊可进入聊天设置');
    return;
  }

  const contact = contactList.find(i => i.id === currentChatId);
  const set = getChatSetting(currentChatId);
  const rel = getRelSetting(currentChatId);

  document.getElementById('profileTitleName').innerText = contact?.name || '联系人';

  const profileCover = document.getElementById('profileCover');
  const theirAvatar = document.getElementById('profileTheirAvatar');
  const myPreview = document.getElementById('profileMyAvatarPreview');
  const theirPreview = document.getElementById('profileTheirAvatarPreview');

  if (profileCover) {
    if (set.background) {
      profileCover.style.backgroundImage = `url(${await resolveImageRefToUrl(set.background)})`;
    } else {
      profileCover.style.backgroundImage = 'linear-gradient(135deg, #f7d9e9, #d8edf7)';
    }
  }

  if (theirAvatar) theirAvatar.src = await resolveImageRefToUrl(set.theirAvatar || DEFAULT_AVATAR);
  if (myPreview) myPreview.src = await resolveImageRefToUrl(set.myAvatar || DEFAULT_AVATAR);
  if (theirPreview) theirPreview.src = await resolveImageRefToUrl(set.theirAvatar || DEFAULT_AVATAR);

  const chip = document.getElementById('blockToggleChip');
  chip.innerText = rel.blockedByMe ? '已拉黑' : '未拉黑';
  chip.classList.toggle('active', rel.blockedByMe);

  document.getElementById('chatDetailPage').style.display = 'none';
  document.getElementById('chatSettingPage').style.display = 'block';
}

function toggleBlockCurrentContact() {
  const rel = getRelSetting(currentChatId);
  rel.blockedByMe = !rel.blockedByMe;
  saveAll();
  openChatSettingPage();
  renderChatList();
}

function clearCurrentChatHistory() {
  if (!currentChatId) return;
  if (!confirm('确定清空当前聊天记录？')) return;

  const refs = [];
  (messages[currentChatId] || []).forEach(m => refs.push(...collectRefsFromMessage(m)));

  messages[currentChatId] = [];
  saveAll();
  alert('已清空');
  removeRefsPossiblyUnused(refs);
}

function deleteCurrentChatFromSetting() {
  if (!currentChatId) return;
  if (!confirm('确定删除该聊天与联系人？')) return;

  const refs = [];
  (messages[currentChatId] || []).forEach(m => refs.push(...collectRefsFromMessage(m)));

  const setting = chatSettings[currentChatId];
  if (setting) {
    if (isIDBRef(setting.background)) refs.push(setting.background);
    if (isIDBRef(setting.myAvatar)) refs.push(setting.myAvatar);
    if (isIDBRef(setting.theirAvatar)) refs.push(setting.theirAvatar);
  }

  contactList = contactList.filter(i => i.id !== currentChatId);
  delete messages[currentChatId];
  delete chatSettings[currentChatId];
  delete relationshipSettings[currentChatId];

  saveAll();
  hideAllPages();
  document.getElementById('contactPage').style.display = 'block';
  renderAllPanels();
  removeRefsPossiblyUnused(refs);
}

function bindFileInput(id, callback, options = {}) {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    fileToDataURL(file, callback, options);
  });
}

function openStickerImportDialog(mode) {
  currentStickerImportMode = mode;
  showDialog('stickerImportDialog');
}

async function confirmStickerImport() {
  const name = document.getElementById('stickerNameInput')?.value.trim();
  const url = document.getElementById('stickerUrlInput')?.value.trim();

  if (!name) {
    alert('请输入表情名称');
    return;
  }

  const finishAdd = async src => {
    if (!src) {
      alert('请提供表情图片');
      return;
    }

    let finalSrc = src;
    if (isDataImage(src)) {
      finalSrc = await persistImageToIDB(src, {
        area: 'sticker.import',
        name
      });
    }

    stickerPacks.unshift({
      id: 's' + Date.now(),
      name,
      src: finalSrc
    });

    saveAll();
    renderEmojiPanel();
    closeDialog('stickerImportDialog');
    cleanupUnusedIDBAssets();
  };

  if (currentStickerImportMode === 'url') {
    if (!url) {
      alert('请输入图片URL');
      return;
    }
    await finishAdd(url);
  } else {
    if (!currentUploadImage) {
      alert('请上传图片');
      return;
    }
    await finishAdd(currentUploadImage);
  }
}

function initStickerImportPreview() {
  const stickerFileInput = document.getElementById('stickerFileInput');
  const stickerUrlInput = document.getElementById('stickerUrlInput');
  if (!stickerFileInput || !stickerUrlInput) return;

  stickerFileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    fileToDataURL(file, data => {
      currentUploadImage = data;
      const box = document.getElementById('stickerImportPreview');
      if (box) {
        box.innerHTML = `<img src="${data}" style="max-width:100%;max-height:100%;object-fit:contain;">`;
      }
    }, {
      compress: true,
      maxWidth: 512,
      quality: 0.72
    });
  });

  stickerUrlInput.addEventListener('input', function () {
    if (currentStickerImportMode !== 'url') return;
    const url = this.value.trim();
    if (!url) return;
    const box = document.getElementById('stickerImportPreview');
    if (box) {
      box.innerHTML = `<img src="${url}" style="max-width:100%;max-height:100%;object-fit:contain;">`;
    }
  });
}

function initSendImagePreview() {
  const sendImageInput = document.getElementById('sendImageInput');
  if (!sendImageInput) return;

  sendImageInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    fileToDataURL(file, data => {
      currentSendImageData = data;
      const box = document.getElementById('sendImagePreviewBox');
      if (box) {
        box.innerHTML = `<img src="${data}" style="max-width:100%;max-height:100%;object-fit:contain;">`;
      }
    }, {
      compress: true,
      maxWidth: 1000,
      quality: 0.72
    });
  });
}

function initFeedPostImages() {
  const input = document.getElementById('feedPostImages');
  if (!input) return;

  input.addEventListener('change', e => {
    const files = [...e.target.files].slice(0, 9);
    currentFeedImages = [];
    const preview = document.getElementById('feedPostPreview');
    if (!preview) return;

    preview.innerHTML = '';

    if (!files.length) {
      preview.innerHTML = '<span>最多9张图片</span>';
      return;
    }

    let loaded = 0;
    files.forEach(file => {
      fileToDataURL(file, data => {
        currentFeedImages.push(data);
        loaded++;
        if (loaded === files.length) {
          preview.innerHTML = currentFeedImages.map(src => `<img src="${src}" alt="">`).join('');
        }
      }, {
        compress: true,
        maxWidth: 900,
        quality: 0.7
      });
    });
  });
}

function initSwipeCall() {
  const thumb = document.getElementById('swipeThumb');
  const track = document.getElementById('swipeTrack');
  if (!thumb || !track) return;

  let dragging = false;
  let startX = 0;
  let startLeft = 0;

  function getThumbLeftPx() {
    const trackWidth = track.clientWidth;
    const thumbWidth = 44;
    const center = (trackWidth - thumbWidth) / 2;
    const left = thumb.style.left;
    if (!left || left.includes('calc')) return center;
    return parseFloat(left);
  }

  function start(clientX) {
    dragging = true;
    startX = clientX;
    startLeft = getThumbLeftPx();
    thumb.style.transition = 'none';
  }

  function move(clientX) {
    if (!dragging) return;
    const trackRect = track.getBoundingClientRect();
    const thumbWidth = 44;
    const minLeft = 5;
    const maxLeft = trackRect.width - thumbWidth - 5;
    const next = Math.max(minLeft, Math.min(maxLeft, startLeft + (clientX - startX)));
    thumb.style.left = next + 'px';

    const center = (trackRect.width - thumbWidth) / 2;
    thumb.classList.toggle('reject', next < center - 30);
  }

  function end() {
    if (!dragging) return;
    dragging = false;

    const trackRect = track.getBoundingClientRect();
    const thumbWidth = 44;
    const minLeft = 5;
    const maxLeft = trackRect.width - thumbWidth - 5;
    const current = getThumbLeftPx();
    const center = (trackRect.width - thumbWidth) / 2;

    thumb.style.transition = 'left 0.15s ease';

    if (current <= minLeft + 20) {
      rejectIncomingCall();
    } else if (current >= maxLeft - 20) {
      acceptIncomingCall();
    } else {
      thumb.style.left = center + 'px';
      thumb.classList.remove('reject');
    }
  }

  thumb.addEventListener('mousedown', e => start(e.clientX));
  document.addEventListener('mousemove', e => move(e.clientX));
  document.addEventListener('mouseup', end);

  thumb.addEventListener('touchstart', e => start(e.touches[0].clientX));
  document.addEventListener('touchmove', e => move(e.touches[0].clientX), { passive: true });
  document.addEventListener('touchend', end);
}

function maybeSimulateIncomingCall() {
  if (!contactList.length) return;
  if (Math.random() < 0.12) {
    const random = contactList[Math.floor(Math.random() * contactList.length)];
    setTimeout(() => simulateIncomingCall(random.id), 1200);
  }
}

function initSTBridgeListener() {
  window.addEventListener('message', event => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (VV_BRIDGE_CONFIG.debug) {
      console.log('[VV] 收到 bridge 消息:', data);
    }

    if (data.type === 'VVPHONE_REPLY') {
      const chatId = data.chatId || currentChatId;
      appendAIMessageToCurrentChat({
        chatId,
        senderName: data.senderName || getBridgeNameByChatId(chatId, currentChatType),
        text: data.text || '……'
      });
    }

    if (data.type === 'VVPHONE_CALL_REPLY') {
      const chatId = data.chatId || currentCallId;
      if (!chatId) return;
      if (!callLogs[chatId]) callLogs[chatId] = [];
      callLogs[chatId].push({
        speaker: data.senderName || getBridgeNameByChatId(chatId, 'direct'),
        isMe: false,
        text: data.text || '我在听。',
        time: getNowTime()
      });
      renderCallTranscript();
      saveAll();
    }

    if (data.type === 'VVPHONE_CALL_STATUS') {
      const contactId = data.chatId || currentCallId;
      if (!contactId) return;

      const status = data.status;
      if (status === 'accepted') {
        openCallPage(contactId, true);
      } else if (status === 'rejected') {
        document.getElementById('callStatus').innerText = '对方已拒接';
        document.getElementById('callTranscript').innerHTML = '<div class="call-line">通话未接通，对方拒接了你的来电。</div>';
      } else if (status === 'missed') {
        document.getElementById('callStatus').innerText = '无人接听';
        document.getElementById('callTranscript').innerHTML = '<div class="call-line">通话未接通，对方暂时没有接听。</div>';
      }
    }

    if (data.type === 'VVPHONE_INCOMING_CALL') {
      const bridgeName = data.bridgeName || data.senderName || '角色';
      let contact = contactList.find(i => (i.bridgeName || i.name) === bridgeName || i.name === bridgeName);

      if (!contact) {
        const id = 'c' + Date.now();
        contact = {
          id,
          name: data.senderName || bridgeName,
          bridgeName,
          avatar: DEFAULT_AVATAR,
          isSticky: false,
          lastTime: getNowTime(),
          threadType: 'direct'
        };
        contactList.unshift(contact);
        getChatSetting(contact.id);
        getRelSetting(contact.id);
      }

      saveAll();
      simulateIncomingCall(contact.id);
    }

    if (data.type === 'VVPHONE_FEED_REPLY') {
      appendAICommentToFeed({
        postId: data.postId,
        senderName: data.senderName || '角色',
        text: data.text || '……',
        replyTo: data.replyTo || ''
      });
    }
  });
}

function initEventBindings() {
  document.getElementById('bgOpacity')?.addEventListener('input', updateBgStyle);
  document.getElementById('bgBlur')?.addEventListener('input', updateBgStyle);
  document.getElementById('imageUpload')?.addEventListener('change', handleImageUpload);

  document.addEventListener('click', e => {
    const menu = document.getElementById('operationMenu');
    if (menu && !e.target.closest('#operationMenu') && !e.target.closest('.chat-item')) {
      menu.classList.remove('show');
    }
    const msgMenu = document.getElementById('messageOperationMenu');
    if (msgMenu && !e.target.closest('#messageOperationMenu')) {
      msgMenu.classList.remove('show');
    }
  });

  document.addEventListener('contextmenu', e => {
    if (!e.target.closest('.chat-item') && !e.target.closest('.message-row')) {
      document.getElementById('operationMenu')?.classList.remove('show');
      document.getElementById('messageOperationMenu')?.classList.remove('show');
    }
  });

  document.getElementById('chatInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  document.getElementById('callInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCallMessage();
    }
  });

  bindFileInput('myAvatarInput', async data => {
    if (!currentChatId) return;
    const ref = await persistImageToIDB(data, { area: 'chat.myAvatar', chatId: currentChatId });
    getChatSetting(currentChatId).myAvatar = ref;
    appProfile.myAvatar = ref;
    saveAll();
    openChatSettingPage();
    renderFeedHeader();
    renderMessages();
    renderChatList();
  }, {
    compress: true,
    maxWidth: 512,
    quality: 0.72
  });

  bindFileInput('theirAvatarInput', async data => {
    if (!currentChatId) return;
    const ref = await persistImageToIDB(data, { area: 'chat.theirAvatar', chatId: currentChatId });
    getChatSetting(currentChatId).theirAvatar = ref;
    saveAll();
    openChatSettingPage();
    renderMessages();
    renderChatList();
  }, {
    compress: true,
    maxWidth: 512,
    quality: 0.72
  });

  bindFileInput('chatBgInput', async data => {
    if (!currentChatId) return;
    const ref = await persistImageToIDB(data, { area: 'chat.background', chatId: currentChatId });
    getChatSetting(currentChatId).background = ref;
    saveAll();
    openChatSettingPage();
    applyCurrentChatBackground();
  }, {
    compress: true,
    maxWidth: 1280,
    quality: 0.68
  });

  bindFileInput('feedCoverInput', async data => {
    const ref = await persistImageToIDB(data, { area: 'feed.cover' });
    appProfile.feedCover = ref;
    saveAll();
    renderFeedHeader();
    const cover = document.getElementById('profileCover');
    if (cover) {
      cover.style.backgroundImage = `url(${await resolveImageRefToUrl(ref)})`;
    }
  }, {
    compress: true,
    maxWidth: 1280,
    quality: 0.68
  });
}

window.onload = async function () {
  loadAll();
  initDefaultStickers();

  await convertLegacyImagesToIDB();

  updateRealTime();
  setInterval(updateRealTime, 1000);

  restoreBgStyle();
  initColorPickers();
  await restoreIcons();

  initEventBindings();
  initSendImagePreview();
  initStickerImportPreview();
  initFeedPostImages();
  initSwipeCall();
  initSTBridgeListener();

  renderAllPanels();
  await renderFeedHeader();
  renderEmojiPanel();

  saveAll('normal');
  cleanupUnusedIDBAssets();

  maybeSimulateIncomingCall();
};

window.addEventListener('beforeunload', () => {
  releaseAllAssetObjectUrls();
});
