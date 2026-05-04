let currentUploadImage = '';
let currentActiveContactId = '';
let currentChatId = '';
let isChatViewReady = false;
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

let composerDraft = {
  quote: null,
  attachments: []
};

let pendingReplyTargets = {};
let currentReplyBatch = {};

let myProfile = {
  avatar: '',
  nickname: '我',
  avatarUnified: false,
  backgroundUnified: false,
  globalChatBg: ''
};

let walletData = {
  balance: 0
};

let stickerManageMode = false;
let stickerPressTimer = null;
let stickerRenameId = null;
let stickerRenameDraft = '';

// ==================== 图片裁剪功能模块 ====================
let currentCropper = null;
let cropCallback = null;

let currentTransferMessageRef = null;
let currentTransferChatId = null;

/**
 * 打开裁剪弹窗
 * @param {string} dataUrl - 原图的 DataURL
 * @param {number} aspectRatio - 裁剪比例 (头像 1, 背景 16/9)
 * @param {function} callback - 裁剪完成后的回调，传回新的 DataURL
 */

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

    tx.oncomplete = function () {
      resolve(record.id);
    };

    tx.onerror = function () {
      reject(tx.error || new Error('idbPutAsset transaction failed'));
    };

    tx.onabort = function () {
      reject(tx.error || new Error('idbPutAsset transaction aborted'));
    };

    store.put(record);
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
      reject(req.error || new Error('idbGetAsset request failed'));
    };

    tx.onerror = function () {
      reject(tx.error || new Error('idbGetAsset transaction failed'));
    };

    tx.onabort = function () {
      reject(tx.error || new Error('idbGetAsset transaction aborted'));
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
    id,
    blob,
    mime: blob.type || 'image/jpeg',
    createdAt: Date.now(),
    meta: meta || {}
  });

  const saved = await idbGetAsset(id);
  if (!saved || !saved.blob) {
    console.error('[persistImageToIDB] 写入后回读失败:', id, saved);
    return '';
  }

  return createAssetRef(id);
}

async function handleProfileAvatarFile(fileOrDataUrl) {
  let dataUrl = '';

  if (typeof fileOrDataUrl === 'string') {
    dataUrl = fileOrDataUrl;
  } else if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
    dataUrl = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result || '');
      reader.readAsDataURL(fileOrDataUrl);
    });
  }

  if (!dataUrl) return;

  let finalSrc = dataUrl;
  if (typeof persistImageToIDB === 'function') {
    finalSrc = await persistImageToIDB(dataUrl, {
      area: 'profile.avatar'
    });
  }

  setMyProfileAvatar(finalSrc);
}

function handleProfileAvatarCrop(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target?.result;
    if (!dataUrl) return;
    // 拦截！打开裁剪框，比例 1:1
    openCropDialog(dataUrl, 1, (croppedUrl) => {
      handleProfileAvatarFile(croppedUrl); // 裁剪后走原存储
    });
  };
  reader.readAsDataURL(file);
}

async function handleGlobalBgFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async e => {
    const dataUrl = e.target?.result;
    if (!dataUrl) return;

    let finalSrc = dataUrl;
    if (typeof persistImageToIDB === 'function') {
      finalSrc = await persistImageToIDB(dataUrl, {
        area: 'profile.globalBg'
      });
    }

    ensureProfileData();
    myProfile.globalChatBg = finalSrc;
    myProfile.backgroundUnified = true;

    updateProfileUI();
    renderMessages?.();
    saveAll();
  };
  reader.readAsDataURL(file);
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
  console.log('[hydrateMediaRefs] nodes =', nodes.length);

  for (const el of nodes) {
    const ref = el.getAttribute('data-media-ref') || '';
    console.log('[hydrateMediaRefs] ref =', ref);

    const realSrc = await resolveImageRefToUrl(ref);
    console.log('[hydrateMediaRefs] realSrc =', realSrc);

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

  if (myProfile) {
    tryAdd(myProfile.avatar);
    tryAdd(myProfile.globalChatBg);
  }

  Object.values(chatSettings || {}).forEach(item => {
    if (!item) return;
    tryAdd(item.background);
    tryAdd(item.backgroundBase);
    tryAdd(item.backgroundOverride);
    tryAdd(item.myAvatar);
    tryAdd(item.myAvatarBase);
    tryAdd(item.myAvatarOverride);
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

function parseVVChatBlocks(raw) {
  const text = String(raw || '');
  console.log('[VV] parseVVChatBlocks input full >>>');
  console.log(text);
  console.log('<<< [VV] parseVVChatBlocks input full');

  const syncMatch = text.match(/\[VV_CHAT_SYNC\]([\s\S]*?)\[\/VV_CHAT_SYNC\]/);

  console.log('[VV] syncMatch exists:', !!syncMatch);

  if (!syncMatch) {
    console.warn('[VV] parseVVChatBlocks: no VV_CHAT_SYNC block found');
    return null;
  }

  const full = syncMatch[1];
  console.log('[VV] extracted sync block full >>>');
  console.log(full);
  console.log('<<< [VV] extracted sync block full');

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function readField(name) {
    const m = full.match(new RegExp('^\\s*' + escapeRegExp(name) + '\\s*[=:]\\s*(.*)$', 'mi'));
    return m ? m[1].trim() : '';
  }

  const chat = {
    chatId: readField('chatId'),
    target: readField('target'),
    time: readField('time'),
    myAvatarKey: readField('myAvatarKey'),
    targetAvatarId: readField('targetAvatarId'),
    myBubble: readField('myBubble'),
    targetBubble: readField('targetBubble'),
    chatBgKey: readField('chatBgKey'),
    messages: []
  };

  const msgRegex = /\[消息\]([\s\S]*?)\[\/消息\]/g;
  let m;
  while ((m = msgRegex.exec(full))) {
    const block = m[1];
    console.log('[VV] found [消息] block >>>');
    console.log(block);
    console.log('<<< [VV] found [消息] block');

    function readMsgField(name) {
      const mm = block.match(new RegExp('^\\s*' + escapeRegExp(name) + '\\s*[=:]\\s*(.*)$', 'mi'));
      return mm ? mm[1].trim() : '';
    }

    const msg = {
      side: readMsgField('side'),
      sender: readMsgField('sender'),
      content:
        readMsgField('content') ||
        readMsgField('text') ||
        readMsgField('message') ||
        readMsgField('msg'),
      state: readMsgField('state'),
      type: readMsgField('type') || 'text',
      transferAction: readMsgField('transferAction'),
      transferAmount: readMsgField('transferAmount'),
      transferNote: readMsgField('transferNote'),
      _raw: block.trim()
    };

    console.log('[VV] parsed msg:', msg);
    chat.messages.push(msg);
  }

  console.log('[VV] parseVVChatBlocks parsed chat:', chat);
  return chat;
}

function appendVVChatReplyToLocal(chatData) {
  console.log('[VV] appendVVChatReplyToLocal chatData:', chatData);

  if (!chatData || !chatData.chatId) {
    console.warn('[VV] appendVVChatReplyToLocal: invalid chatData');
    return;
  }

  const chatId = chatData.chatId;

  if (!messages[chatId]) {
    messages[chatId] = [];
  }

  // 确保新会话初始化完整
  getChatSetting(chatId);
  getRelSetting(chatId);

  const thread = messages[chatId];
  const time = getNowTime();
  const timeLabel = chatData.time || getNowFullLabel();

  const allMsgs = Array.isArray(chatData.messages) ? chatData.messages : [];
  console.log('[VV] all parsed messages:', allMsgs);

  const leftMsgs = allMsgs.filter(msg => {
    const side = String(msg.side || '').trim().toLowerCase();
    const content = String(msg.content || '').trim();
    const isLeftLike = side === 'left' || side === 'assistant' || side === 'them';
    const hasContent = !!content;

    console.log('[VV] filter msg check:', {
      raw: msg,
      side,
      isLeftLike,
      content,
      hasContent
    });

    return isLeftLike && hasContent;
  });

  console.log('[VV] leftMsgs to append:', leftMsgs);

  let hasAppendedLeftMessage = false;
  let hasAnyLeftSignal = leftMsgs.length > 0;

  leftMsgs.forEach(msg => {
    const normalizedContent = String(msg.content || '').trim();
    if (!normalizedContent) return;

    const lastAssistantMsg = [...thread].reverse().find(item =>
      !item.isMe &&
      !item.recalled &&
      item.type === 'text'
    );

    const duplicated = !!lastAssistantMsg && (
      (
        Array.isArray(lastAssistantMsg.chunks) &&
        lastAssistantMsg.chunks.join('\n').trim() === normalizedContent
      ) ||
      (
        typeof lastAssistantMsg.text === 'string' &&
        lastAssistantMsg.text.trim() === normalizedContent
      )
    );

    if (!duplicated) {
      thread.push({
        id: 'm' + Date.now() + '_' + Math.random().toString(36).slice(2),
        sender: 'them',
        senderName: msg.sender || chatData.target || '对方',
        isMe: false,
        type: 'text',
        chunks: [normalizedContent],
        text: normalizedContent,
        replyTo: null,
        recalled: false,
        time,
        timeLabel,
        state: msg.state || 'reply'
      });

      hasAppendedLeftMessage = true;
      console.log('[VV] appended assistant msg:', normalizedContent);
    } else {
      console.log('[VV] skip duplicated assistant msg:', normalizedContent);
    }

    const action = String(msg.transferAction || '').trim().toLowerCase();

    if (action === 'accept') {
      const transferMsg = findLastPendingMyTransfer(chatId);
      if (transferMsg) {
        console.log('[VV] transferAction=accept, accept last pending transfer');
        acceptMyTransferByAI(chatId, transferMsg);
      }
    }

    if (action === 'return') {
      const transferMsg = findLastPendingMyTransfer(chatId);
      if (transferMsg) {
        console.log('[VV] transferAction=return, return last pending transfer');
        returnMyTransferByAI(chatId, transferMsg);
      }
    }

    if (action === 'send') {
      const amount = Number(msg.transferAmount || 0);
      const note = String(msg.transferNote || '').trim() || '给你的转账';

      if (amount > 0) {
        const alreadyExists = thread.some(item =>
          !item.isMe &&
          item.type === 'transfer' &&
          Number(item.amount || 0) === amount &&
          String(item.note || '').trim() === note &&
          item.status === '待收款'
        );

        if (!alreadyExists) {
          console.log('[VV] transferAction=send, receive transfer from AI:', amount, note);
          receiveTransferFromAI(chatId, amount, note);
        } else {
          console.log('[VV] skip duplicated AI transfer:', amount, note);
        }
      }
    }
  });

  const rel = getRelSetting(chatId);
  if (chatData.target && rel && !rel.name) {
    rel.name = chatData.target;
  }

  const setting = getChatSetting(chatId);
  if (chatData.chatBgKey) setting.background = chatData.chatBgKey;
  if (chatData.myBubble) setting.myBubble = chatData.myBubble;
  if (chatData.targetBubble) setting.targetBubble = chatData.targetBubble;
  if (chatData.targetAvatarId) {
    setting.theirAvatar = chatData.targetAvatarId;
    setting.targetAvatarId = chatData.targetAvatarId;
  }
  if (chatData.myAvatarKey) setting.myAvatarKey = chatData.myAvatarKey;
  if (chatData.target) setting.target = chatData.target;

  if (leftMsgs.length) {
    const last = leftMsgs[leftMsgs.length - 1];
    updateLastMsg(chatId, last.content, time, currentChatType);
  }

  if (hasAnyLeftSignal) {
    const batchIds = currentReplyBatch[chatId] || [];

    pendingReplyTargets[chatId] = false;

    thread.forEach(m => {
      if (batchIds.includes(m.id)) {
        m.pendingForReply = false;
      }
    });

    currentReplyBatch[chatId] = [];

    console.log('[VV] pending cleared after sync:', {
      chatId,
      hasAnyLeftSignal,
      hasAppendedLeftMessage,
      clearedBatchIds: batchIds,
      pending: pendingReplyTargets[chatId]
    });
  } else {
    console.warn('[VV] no leftMsgs appended from sync:', {
      chatId,
      allMsgs
    });
  }

  console.log('[VV] thread after append:', thread);
  console.log('[VV] append done:', {
    chatId,
    currentChatId,
    threadLen: thread.length,
    lastMsg: thread[thread.length - 1]
  });

  saveAll();

  if (chatId === currentChatId && typeof renderMessages === 'function') {
    renderMessages();
  }
}

async function handleVVChatSyncRaw(raw) {
  console.log('[VV] handleVVChatSyncRaw called');
  console.log('[VV] raw sync text >>>');
  console.log(String(raw || ''));
  console.log('<<< [VV] raw sync text');

  const parsed = parseVVChatBlocks(raw);

  console.log('[VV] parsed sync data:', parsed);

  if (!parsed) {
    console.warn('[VV] handleVVChatSyncRaw: parsed is null');
    return;
  }

  if (!parsed.chatId) {
    console.warn('[VV] handleVVChatSyncRaw: parsed.chatId missing');
    return;
  }

  console.log('[VV] parsed.messages =', parsed.messages);

  appendVVChatReplyToLocal(parsed);

  console.log('[VV] after append, thread =', messages[parsed.chatId]);

  if (parsed.chatId === currentChatId && typeof renderMessages === 'function') {
    console.log('[VV] handleVVChatSyncRaw render current chat');
    await renderMessages();
  }

  if (typeof renderChatList === 'function') {
    renderChatList();
  }

  saveAll();
}

async function triggerSlash(cmd) {
  if (!cmd) return false;

  if (VV_BRIDGE_CONFIG.debug) {
    console.log('[VV] 触发指令:', cmd);
  }

  try {
    const result = await new Promise((resolve) => {
      const requestId = 'vv-' + Date.now() + '-' + Math.random().toString(36).slice(2);
      const viewId = window.__vv_view_id || '';

      function onMessage(event) {
        const data = event.data;
        if (!data || data.type !== 'VV_EXECUTE_RESULT' || data.requestId !== requestId) {
          return;
        }
        
        if (data.viewId && viewId && data.viewId !== viewId) {
          console.log('[VV] ignore VV_EXECUTE_RESULT for other viewId:', data.viewId, 'mine=', viewId);
          return;
        }        

        window.removeEventListener('message', onMessage);

        if (VV_BRIDGE_CONFIG.debug) {
          console.log('[VV] 收到 bridge 消息:', data);
        }

        resolve({
          ok: !!data.ok,
          error: data.error || null
        });
      }

      window.addEventListener('message', onMessage);

      window.parent.postMessage({
        type: 'VV_EXECUTE_SLASH',
        requestId,
        command: cmd
      }, '*');

      setTimeout(() => {
        window.removeEventListener('message', onMessage);
        resolve({
          ok: false,
          error: 'timeout'
        });
      }, 15000);
    });

    if (!result.ok) {
      console.warn('[VV] slash 执行失败:', result.error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[VV] slash 执行异常:', err);
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

function escapeHTMLAttr(str = '') {
  return String(str == null ? '' : str)
    .replace(/&/g, '&')
    .replace(/"/g, '"')
    .replace(/</g, '<')
    .replace(/>/g, '>');
}

function ensureProfileData() {
  if (!myProfile || typeof myProfile !== 'object') {
    myProfile = {
      avatar: '',
      nickname: '我',
      avatarUnified: false,
      backgroundUnified: false,
      globalChatBg: ''
    };
  }

  if (!walletData || typeof walletData !== 'object') {
    walletData = { balance: 0 };
  }

  if (typeof myProfile.avatarUnified !== 'boolean') {
    myProfile.avatarUnified = false;
  }

  if (typeof myProfile.backgroundUnified !== 'boolean') {
    myProfile.backgroundUnified = false;
  }

  if (typeof myProfile.nickname !== 'string' || !myProfile.nickname.trim()) {
    myProfile.nickname = '我';
  }

  if (typeof walletData.balance !== 'number') {
    walletData.balance = Number(walletData.balance || 0);
  }
}

function getMyProfileAvatar() {
  ensureProfileData();
  return myProfile.avatar || DEFAULT_AVATAR;
}

function getMyAvatar(chatId = null) {
  ensureProfileData();

  if (!chatId) {
    return myProfile.avatar || DEFAULT_AVATAR;
  }

  const setting = getChatSetting(chatId);

  if (myProfile.avatarUnified) {
    return setting.myAvatarOverride
      || myProfile.avatar
      || DEFAULT_AVATAR;
  }

  return setting.myAvatarBase
    || myProfile.avatar
    || DEFAULT_AVATAR;
}

function getChatBackground(chatId = null) {
  ensureProfileData();

  if (!chatId) {
    return myProfile.globalChatBg || '';
  }

  const setting = getChatSetting(chatId);

  if (myProfile.backgroundUnified) {
    return setting.backgroundOverride
      || myProfile.globalChatBg
      || '';
  }

  return setting.backgroundBase
    || setting.background
    || myProfile.globalChatBg
    || '';
}

async function updateProfileUI() {
  ensureProfileData();

  const avatarUrl = await resolveImageRefToUrl(getMyProfileAvatar());

  const avatarEls = document.querySelectorAll('[data-my-profile-avatar]');
  avatarEls.forEach(el => {
    if (el.tagName === 'IMG') {
      el.src = avatarUrl;
    } else {
      el.style.backgroundImage = `url("${avatarUrl}")`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
    }
  });

  const nicknameEl = document.getElementById('profileNickname');
  if (nicknameEl) nicknameEl.textContent = myProfile.nickname || '我';

  const avatarUnifiedInput = document.getElementById('avatarUnifiedSwitch');
  if (avatarUnifiedInput) avatarUnifiedInput.checked = !!myProfile.avatarUnified;

  const bgUnifiedInput = document.getElementById('backgroundUnifiedSwitch');
  if (bgUnifiedInput) bgUnifiedInput.checked = !!myProfile.backgroundUnified;

  const walletBalanceEl = document.getElementById('walletBalance');
  if (walletBalanceEl) walletBalanceEl.textContent = `¥${Number(walletData.balance || 0)}`;

  renderFeedHeader?.();
  renderFeedList?.();
  renderMessages?.();

  if (currentChatId) {
    renderMessages?.();
  }
}

async function setMyProfileAvatar(src) {
  ensureProfileData();
  myProfile.avatar = src || '';

  if (myProfile.avatarUnified) {
    Object.keys(chatSettings).forEach(chatId => {
      const setting = getChatSetting(chatId);
      setting.myAvatarOverride = '';
    });
  }

  saveAll();

  await updateProfileUI();
  renderMessages?.();
  renderChatList?.();
  renderFeedHeader?.();
  renderFeedList?.();
  renderGroupList?.();
}

function setMyProfileNickname(name) {
  ensureProfileData();
  myProfile.nickname = (name || '').trim() || '我';
  updateProfileUI();
  saveAll();
}

function addWalletBalance(amount) {
  ensureProfileData();
  walletData.balance = Number(walletData.balance || 0) + Number(amount || 0);
  if (walletData.balance < 0) walletData.balance = 0;
  updateProfileUI();
  saveAll();
}

function getWalletBalance() {
  ensureProfileData();
  return Number(walletData.balance || 0);
}

function canAfford(amount) {
  return getWalletBalance() >= Number(amount || 0);
}

function subtractWalletBalance(amount) {
  ensureProfileData();
  const value = Number(amount || 0);

  if (value <= 0) return false;
  if (getWalletBalance() < value) return false;

  walletData.balance = Number(walletData.balance || 0) - value;
  if (walletData.balance < 0) walletData.balance = 0;

  updateProfileUI();
  saveAll();
  return true;
}

async function toggleAvatarUnified(checked) {
  ensureProfileData();
  myProfile.avatarUnified = !!checked;

  if (checked) {
    Object.keys(chatSettings).forEach(chatId => {
      const setting = getChatSetting(chatId);
      setting.myAvatarOverride = '';
    });
  }

  saveAll();

  await updateProfileUI();
  renderMessages?.();
  renderChatList?.();
  renderFeedHeader?.();
  renderFeedList?.();
  renderGroupList?.();
}

async function toggleBackgroundUnified(checked) {
  ensureProfileData();
  myProfile.backgroundUnified = !!checked;

  if (checked) {
    Object.keys(chatSettings).forEach(chatId => {
      const setting = getChatSetting(chatId);
      setting.backgroundOverride = '';
    });
  }

  saveAll();

  await updateProfileUI?.();
  await applyCurrentChatBackground?.();
  renderChatList?.();
  renderFeedHeader?.();
  renderFeedList?.();
  renderGroupList?.();
}

function handleWalletClick() {
  playClickSound?.();
  addWalletBalance(10);
}

function handleProfileNicknameChange() {
  const input = document.getElementById('profileNicknameInput');
  if (!input) return;
  setMyProfileNickname(input.value);
}

function triggerGlobalBgPick() {
  document.getElementById('globalBgInput')?.click();
}

function initProfilePage() {
  ensureProfileData();

  const avatarInput = document.getElementById('profileAvatarInput');
  if (avatarInput) {
    avatarInput.addEventListener('change', e => {
      const file = e.target.files?.[0];
      handleProfileAvatarFile(file);
      e.target.value = '';
    });
  }

  const bgInput = document.getElementById('globalBgInput');
  if (bgInput) {
    bgInput.addEventListener('change', e => {
      const file = e.target.files?.[0];
      handleGlobalBgFile(file);
      e.target.value = '';
    });
  }

  updateProfileUI();
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
    safeSetItemJSON('st_pending_reply_targets', pendingReplyTargets),
    safeSetItemJSON('st_my_profile', myProfile),
    safeSetItemJSON('st_wallet_data', walletData)
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
      safeSetItemJSON('st_pending_reply_targets', pendingReplyTargets),
      safeSetItemJSON('st_my_profile', myProfile),
      safeSetItemJSON('st_wallet_data', walletData)
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

  myProfile = safeJSONParse(localStorage.getItem('st_my_profile') || '{"avatar":"","nickname":"我","avatarUnified":false,"backgroundUnified":false,"globalChatBg":""}', {
    avatar: '',
    nickname: '我',
    avatarUnified: false,
    backgroundUnified: false,
    globalChatBg: ''
  });

  walletData = safeJSONParse(localStorage.getItem('st_wallet_data') || '{"balance":0}', {
    balance: 0
  });

  ensureProfileData();
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

function showDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;

  dialog.style.display = 'flex';

  requestAnimationFrame(() => {
    dialog.classList.add('show');
  });
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
  const directPanel = document.getElementById('directPanel');
  const groupPanel = document.getElementById('groupPanel');
  const feedPanel = document.getElementById('feedPanel');
  const profilePage = document.getElementById('profilePage');

  const titleEl = document.querySelector('#contactPage .nav-title');
  const navAction = document.querySelector('#contactPage .nav-action');

  if (directPanel) {
    directPanel.style.display = tab === 'direct' ? 'block' : 'none';
    directPanel.classList.toggle('active', tab === 'direct');
  }

  if (groupPanel) {
    groupPanel.style.display = tab === 'group' ? 'block' : 'none';
    groupPanel.classList.toggle('active', tab === 'group');
  }

  if (feedPanel) {
    feedPanel.style.display = tab === 'feed' ? 'block' : 'none';
    feedPanel.classList.toggle('active', tab === 'feed');
  }

  if (profilePage) {
    profilePage.style.display = tab === 'profile' ? 'block' : 'none';
    profilePage.classList.toggle('active', tab === 'profile');
  }

  document.querySelectorAll('.contact-tab').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tab);
  });

  if (titleEl) {
    if (tab === 'direct') titleEl.textContent = '消息';
    else if (tab === 'group') titleEl.textContent = '群聊';
    else if (tab === 'feed') titleEl.textContent = '动态';
    else if (tab === 'profile') titleEl.textContent = '我的';
  }

  if (navAction) {
    if (tab === 'profile') {
      navAction.style.display = 'none';
      navAction.textContent = '';
      navAction.onclick = null;
    } else if (tab === 'feed') {
      navAction.style.display = 'flex';
      navAction.textContent = '＋';
      navAction.onclick = () => {
        playClickSound?.();
        showDialog('postFeedDialog');
      };
    } else {
      navAction.style.display = 'flex';
      navAction.textContent = '＋';
      navAction.onclick = () => {
        playClickSound?.();
        handleTopAdd?.();
      };
    }
  }

  if (tab === 'feed') {
    renderFeedHeader?.();
    renderFeedList?.();
  }

  if (tab === 'profile') {
    updateProfileUI?.();
  }
}

function handleTopAdd() {
  if (currentContactTab === 'direct') showDialog('addContactDialog');
  if (currentContactTab === 'group') showDialog('addGroupDialog');
  if (currentContactTab === 'feed') showDialog('postFeedDialog');
}

function getChatSetting(chatId) {
  if (!chatId) {
    console.warn('[getChatSetting] invalid chatId:', chatId);
    return {
      background: '',
      backgroundBase: '',
      backgroundOverride: '',
      myAvatar: '',
      myAvatarBase: '',
      myAvatarOverride: '',
      theirAvatar: ''
    };
  }

  if (!chatSettings[chatId]) {
    chatSettings[chatId] = {
      background: '',
      backgroundBase: '',
      backgroundOverride: '',
      myAvatar: '',
      myAvatarBase: '',
      myAvatarOverride: '',
      theirAvatar: ''
    };
  }

  return chatSettings[chatId];
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

  const myAvatar = getMyProfileAvatar();
  const cover = appProfile.feedCover || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=900&auto=format&fit=crop';

  avatarEl.src = await resolveImageRefToUrl(myAvatar);
  nameEl.innerText = myProfile.nickname || appProfile.myName || '我';
  coverEl.style.backgroundImage = `url(${await resolveImageRefToUrl(cover)})`;
}

function renderFeedList() {
  const dom = document.getElementById('feedList');
  if (!dom) return;

  if (feedPosts.length === 0) {
    dom.innerHTML = `<div class="empty-state" style="height:220px;"><span>还没有动态，点击右上角发布</span></div>`;
    return;
  }

  const myName = myProfile.nickname || appProfile.myName || '我';
  const myNames = new Set([
    '我',
    myProfile.nickname || '',
    appProfile.myName || ''
  ].filter(Boolean));

  dom.innerHTML = feedPosts.map(post => {
    const isMine = post.authorId === 'me' || myNames.has(post.author);
    const postAvatar = getFeedAuthorAvatar(post);

    const images = (post.images || []).length ? `
      <div class="feed-image-grid">
        ${(post.images || []).map(src => `
          <img ${buildMediaSrcAttrs(src)} alt="" onclick="openFeedImageViewerFromNode(this)">
        `).join('')}
      </div>
    ` : '';

    const likes = (post.likes || []).length
      ? `<div class="feed-comment">❤️ ${(post.likes || []).map(i => `<strong>${escapeHTML(i.from)}</strong>`).join('、')}</div>`
      : '';

    const comments = (post.comments || []).map((c, idx) => {
      const isMyComment = c.from === myName;

      return `
        <div class="feed-comment">
          <strong>${escapeHTML(c.from)}</strong>${c.replyTo ? ` 回复 <strong>${escapeHTML(c.replyTo)}</strong>` : ''}：${escapeHTML(c.text)}
          <span style="color:#999;cursor:pointer;margin-left:8px;" onclick="replyFeedComment('${post.id}',${idx})">回复</span>
          ${isMyComment ? `<span style="color:#d9534f;cursor:pointer;margin-left:8px;" onclick="deleteFeedComment('${post.id}',${idx})">删除</span>` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="feed-card">
        <div class="feed-post-avatar"><img ${buildMediaSrcAttrs(postAvatar)} alt=""></div>
        <div class="feed-main">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <div class="feed-author">${escapeHTML(post.author)}</div>
            ${isMine ? `<button class="feed-delete-btn" onclick="deleteFeedPost('${post.id}')">删除</button>` : ''}
          </div>
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

function openFeedImageViewerFromNode(imgEl) {
  if (!imgEl) return;
  const src = imgEl.currentSrc || imgEl.src;
  if (!src) return;

  const viewer = document.getElementById('feedImageViewer');
  const viewerImg = document.getElementById('feedImageViewerImg');
  if (!viewer || !viewerImg) return;

  viewerImg.src = src;
  viewer.style.display = 'flex';

  requestAnimationFrame(() => {
    viewer.classList.add('show');
  });
}

function closeFeedImageViewer() {
  const viewer = document.getElementById('feedImageViewer');
  const viewerImg = document.getElementById('feedImageViewerImg');
  if (!viewer || !viewerImg) return;

  viewer.classList.remove('show');
  setTimeout(() => {
    viewer.style.display = 'none';
    viewerImg.src = '';
  }, 200);
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

function deleteFeedPost(postId) {
  const index = feedPosts.findIndex(post => post.id === postId);
  if (index === -1) return;

  const post = feedPosts[index];
  if (post.author !== (myProfile.nickname || appProfile.myName || '我')) {
    alert('只能删除自己发布的动态');
    return;
  }

  const ok = confirm('确定删除这条动态吗？');
  if (!ok) return;

  feedPosts.splice(index, 1);
  saveAll();
  renderFeedList();
}

function deleteFeedComment(postId, commentIndex) {
  const post = feedPosts.find(i => i.id === postId);
  if (!post || !post.comments?.[commentIndex]) return;

  const comment = post.comments[commentIndex];
  const myName = myProfile.nickname || appProfile.myName || '我';

  if (comment.from !== myName) {
    alert('只能删除自己的评论');
    return;
  }

  const ok = confirm('确定删除这条评论吗？');
  if (!ok) return;

  post.comments.splice(commentIndex, 1);
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

  feedPosts.unshift({
    id: 'f' + Date.now(),
    authorId: 'me',
    author: myProfile.nickname || appProfile.myName || '我',
    authorAvatar: getMyProfileAvatar() || DEFAULT_AVATAR,
    bridgeName: myProfile.nickname || appProfile.myName || '我',
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

async function openChat(id, type = 'direct') {
  currentChatId = id;
  currentChatType = type;
  isChatViewReady = false;

  const list = type === 'group' ? groupList : contactList;
  const item = list.find(i => i.id === id);
  if (!item) return;

  if (!messages[id]) messages[id] = [];
  getChatSetting(id);
  getRelSetting(id);

  const title = document.getElementById('chatDetailName');
  const a = document.getElementById('contactPage');
  const b = document.getElementById('chatDetailPage');

  if (title) title.innerText = item.name;
  if (a) a.style.display = 'none';
  if (b) b.style.display = 'block';

  clearComposerDraft();
  await applyCurrentChatBackground();
  await renderMessages();
  renderChatList?.();

  isChatViewReady = true;
}

async function applyCurrentChatBackground() {
  const bg = getChatBackground(currentChatId) || '';
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

async function openChatDetail(chatId, forceName = '') {
  if (!chatId) return;

  isChatViewReady = false;

  if (!messages[chatId]) {
    messages[chatId] = [];
  }

  currentChatId = chatId;
  currentChatType = 'direct';

  let contact = contactList.find(i => i.id === chatId);

  if (!contact) {
    contact = {
      id: chatId,
      name: forceName || '联系人',
      bridgeName: forceName || '',
      avatar: DEFAULT_AVATAR,
      isSticky: false,
      lastTime: getNowTime(),
      lastPreview: '',
      threadType: 'direct'
    };
    contactList.unshift(contact);
  } else {
    if (forceName && (!contact.name || contact.name === '联系人')) {
      contact.name = forceName;
    }
    if (forceName && !contact.bridgeName) {
      contact.bridgeName = forceName;
    }
  }

  const rel = getRelSetting(chatId);
  if (forceName && !rel.name) {
    rel.name = forceName;
  }

  const setting = getChatSetting(chatId);
  if (!setting.theirAvatar) {
    setting.theirAvatar = DEFAULT_AVATAR;
  }
  if (typeof setting.myAvatarBase === 'undefined') {
    setting.myAvatarBase = '';
  }
  if (typeof setting.myAvatarOverride === 'undefined') {
    setting.myAvatarOverride = '';
  }
  if (typeof setting.backgroundBase === 'undefined') {
    setting.backgroundBase = '';
  }
  if (typeof setting.backgroundOverride === 'undefined') {
    setting.backgroundOverride = '';
  }

  const titleEl = document.getElementById('chatDetailName');
  if (titleEl) {
    titleEl.textContent = forceName || contact.name || rel.name || '联系人';
  }

  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
  });

  const page = document.getElementById('chatDetailPage');
  if (page) {
    page.style.display = 'block';
  }

  renderComposerPreview?.();

  if (typeof applyCurrentChatBackground === 'function') {
    await applyCurrentChatBackground();
  }

  if (typeof renderMessages === 'function') {
    await renderMessages();
  }

  if (typeof renderChatList === 'function') {
    renderChatList();
  } else if (typeof renderAllPanels === 'function') {
    renderAllPanels();
  }

  saveAll();

  isChatViewReady = true;
}

async function restoreLastChatSession() {
  const lastChatId = localStorage.getItem('st_current_chat_id') || '';
  const lastChatType = localStorage.getItem('st_current_chat_type') || 'direct';

  if (!lastChatId) return false;

  if (lastChatType === 'direct') {
    await openChatDetail(lastChatId);
    return true;
  }

  await openChat(lastChatId, lastChatType);
  return true;
}

function removeComposerAttachment(index) {
  if (!composerDraft.attachments || index < 0) return;
  composerDraft.attachments.splice(index, 1);
  renderComposerPreview();
}

function getTransferStatusClass(status) {
  switch (status) {
    case '待收款':
      return 'transfer-card pending';
    case '已收款':
    case '已被接收':
      return 'transfer-card success';
    case '已退回':
      return 'transfer-card returned';
    default:
      return 'transfer-card pending';
  }
}

function getTransferStatusText(status) {
  switch (status) {
    case '待收款':
      return '待收款';
    case '已收款':
      return '✓ 已收款';
    case '已被接收':
      return '✓ 已被接收';
    case '已退回':
      return '已退回';
    default:
      return status || '待收款';
  }
}

function getTransferIconText(status) {
  switch (status) {
    case '已收款':
    case '已被接收':
      return '✓';
    case '已退回':
      return '↩';
    default:
      return '¥';
  }
}

function renderTransferMessage(m) {
  const cls = getTransferStatusClass(m.status);
  const amount = Number(m.amount || 0);
  const note = m.note || '转账';
  const statusText = getTransferStatusText(m.status);
  const icon = getTransferIconText(m.status);

  return `
    <div class="${cls}" onclick="openTransferReceiveDialog('${m.id}')">
      <div class="transfer-card-top">
        <div class="transfer-icon">${icon}</div>
        <div class="transfer-text">
          <div class="transfer-amount">¥${escapeHTML(String(amount))}</div>
          <div class="transfer-note">${escapeHTML(note)}</div>
        </div>
      </div>
      <div class="transfer-card-bottom">${escapeHTML(statusText)}</div>
    </div>
  `;
}

function renderTransferNoticeMessage(m) {
  const cls = getTransferStatusClass(m.status);
  const amount = Number(m.amount || 0);
  const note = m.note || '转账';
  const statusText = getTransferStatusText(m.status);
  const icon = getTransferIconText(m.status);

  return `
    <div class="${cls}">
      <div class="transfer-card-top">
        <div class="transfer-icon">${icon}</div>
        <div class="transfer-text">
          <div class="transfer-amount">¥${escapeHTML(String(amount))}</div>
          <div class="transfer-note">${escapeHTML(note)}</div>
        </div>
      </div>
      <div class="transfer-card-bottom">${escapeHTML(statusText)}</div>
    </div>
  `;
}

function renderMessageOriginal(m) {
  if (m.type === 'transfer') {
    return renderTransferMessage(m);
  }

  if (m.type === 'transfer_notice') {
    return renderTransferNoticeMessage(m);
  }

  switch (m.type) {
    case 'text': {
      const chunks = Array.isArray(m.chunks) && m.chunks.length
        ? m.chunks
        : (typeof m.text === 'string' && m.text.trim()
            ? [m.text]
            : []);
      return chunks.map(chunk => `<div class="message-bubble">${escapeHTML(chunk)}</div>`).join('');
    }

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

    case 'system':
      return (m.chunks || []).map(chunk => `<div class="message-bubble">${escapeHTML(chunk)}</div>`).join('');

    default:
      return `<div class="message-bubble">未知消息</div>`;
  }
}

async function renderMessages() {
  console.log('[renderMessages] start currentChatId =', currentChatId);

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
      ? getMyAvatar(currentChatId)
      : (setting.theirAvatar || DEFAULT_AVATAR);

    console.log('[renderMessages] avatarSrc =', avatarSrc, 'isMe=', m.isMe);

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
  console.log('[renderMessages] html injected');

  await hydrateMediaRefs(area);

  area.style.display = 'none';
  area.offsetHeight;
  area.style.display = '';

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

function exitStickerManageMode() {
  stickerManageMode = false;
  stickerRenameId = null;
  stickerRenameDraft = '';
  clearTimeout(stickerPressTimer);
  renderEmojiPanel();
}

function handleStickerTouchStart(stickerId) {
  clearTimeout(stickerPressTimer);
  stickerPressTimer = setTimeout(() => {
    enterStickerManageMode(stickerId);
  }, 450);
}

function enterStickerManageMode(stickerId = null) {
  stickerManageMode = true;
  stickerRenameId = stickerId;
  stickerRenameDraft = '';

  const sticker = stickerPacks.find(s => s.id === stickerId);
  if (sticker) {
    stickerRenameDraft = sticker.name || '表情';
  }

  renderEmojiPanel();

  requestAnimationFrame(() => {
    if (!stickerId) return;
    const input = document.querySelector(`.sticker-rename-input[data-sticker-id="${stickerId}"]`);
    input?.focus();
    input?.select();
  });
}

function handleStickerTouchEnd() {
  clearTimeout(stickerPressTimer);
}

function deleteStickerById(stickerId, e) {

  e?.preventDefault?.();
  e?.stopPropagation?.();

  const index = stickerPacks.findIndex(s => s.id === stickerId);
  if (index === -1) return;

  const ok = confirm('确定删除这个表情吗？');
  if (!ok) return;

  stickerPacks.splice(index, 1);
  saveAll();
  renderEmojiPanel();
}

function saveStickerRename(stickerId, value) {
  const sticker = stickerPacks.find(s => s.id === stickerId);
  if (!sticker) return;

  const name = (value || '').trim() || '表情';
  sticker.name = name;

  saveAll();
  renderEmojiPanel();

  requestAnimationFrame(() => {
    const input = document.querySelector(`.sticker-rename-input[data-sticker-id="${stickerId}"]`);
    input?.focus();
    input?.select();
  });
}

function handleStickerRenameKeydown(event, stickerId) {
  event.stopPropagation();

  if (event.key === 'Enter') {
    event.preventDefault();
    saveStickerRename(stickerId, event.target.value);
    event.target.blur();
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    const sticker = stickerPacks.find(s => s.id === stickerId);
    if (sticker) {
      event.target.value = sticker.name || '表情';
    }
    event.target.blur();
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

async function sendMessage() {
  if (!currentChatId) return;

  if (!isChatViewReady && typeof openChatDetail === 'function') {
    await openChatDetail(currentChatId);
  }

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
      timeLabel,
      pendingForReply: true
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
      timeLabel,
      pendingForReply: true
    });
  });

  const lastContent = hasText
    ? chunks[chunks.length - 1]
    : getAttachmentSummary(attachments[attachments.length - 1]);

  updateLastMsg(currentChatId, lastContent, time, currentChatType);

  input.value = '';
  clearComposerDraft();
  saveAll();
  closeEmojiPanel?.();

  await renderMessages();

  console.log('[sendMessage] message saved locally only, waiting for manual triggerAIReply');
}

function buildVVEventPayload(chatId) {
  const list = messages[chatId] || [];
  const batchIds = currentReplyBatch[chatId] || [];

  const myPending = list.filter(m =>
    batchIds.includes(m.id)
  );

  if (!myPending.length) return '';

  const chatSetting = getChatSetting(chatId) || {};
  const rel = getRelSetting(chatId) || {};
  const time = typeof getNowFullLabel === 'function' ? getNowFullLabel() : getNowTime();
  const targetName = rel.name || chatSetting.name || getBridgeNameByChatId(chatId, currentChatType) || '未知联系人';

  const messageText = myPending.map(m => {
    if (m.type === 'text') return (m.chunks || []).join('\n');
    if (m.type === 'sticker') return `[表情] ${m.stickerName || '表情'}`;
    if (m.type === 'image') return `[图片] ${m.desc || ''}`.trim();
    if (m.type === 'voice') return `[语音] ${m.transcript || ''}`.trim();
    if (m.type === 'transfer') return `[转账] 金额${m.amount}，备注${m.note || '无'}`;
    if (m.type === 'system') return `[系统] ${(m.chunks || []).join(' / ')}`;
    return '[消息]';
  }).join('\\n');

  const myAvatarKey = 'current_my_avatar';
  const targetAvatarId = chatSetting.theirAvatar ? String(chatSetting.theirAvatar) : 'contact_unknown_avatar';
  const myBubble = chatSetting.myBubble || '#5B86FF';
  const targetBubble = chatSetting.theirBubble || '#F8F8F8';
  const chatBgKey = chatSetting.background ? String(chatSetting.background) : 'current_chat_bg';

  return [
    '以下是一次手机聊天事件。',
    '不要复述事件字段，不要解释字段内容，不要引用字段名。',
    '你必须输出完整的 [聊天界面] ... [/聊天界面] 结构。',
    '在输出完 [聊天界面] ... [/聊天界面] 后，还必须额外输出一份 [VV_CHAT_SYNC] ... [/VV_CHAT_SYNC] 同步块。',
    '[VV_CHAT_SYNC] 只用于前端同步，不要省略。',
    '[VV_CHAT_SYNC] 只允许包含本轮新增消息，绝对不要重复任何历史消息。',
    '你必须先把用户本轮刚刚发送的 message 内容按顺序展开成一个或多个 side=right 的 [消息] 块。',
    '然后再输出角色自己的 side=left 的 [消息] 回复块。',
    '如果本轮有多条用户消息，必须逐条展开，不可合并成一条。',
    '角色回复只能针对本轮新增的用户消息，不要把更早已经回复过的历史消息再次纳入本轮回复。',
    '聊天展示必须保留以下字段：chatId、target、time、myAvatarKey、targetAvatarId、myBubble、targetBubble、chatBgKey。',
    'time 只在 [聊天界面] 顶部显示一次，消息块内部默认不要重复输出 time。',
    '用户消息必须使用 side=right，角色消息必须使用 side=left。',
    '每条消息都要单独成块。',
    '所有 [消息] 块必须显式包含以下字段：side、sender、content、state。',
    '不得使用 text 代替 content。',
    '不得省略 sender=',
    '不得省略 state=',
    '如需表现正在输入，可先输出 state=typing 的 [消息] 块。',
    '如果角色不打算继续回复线上消息，则改为正常正文，并明确交代没有继续回复手机消息。',
    '无论是 [聊天界面] 还是 [VV_CHAT_SYNC]，都只输出本轮新增消息，不要重复历史消息；历史聊天由前端根据 chatId 自行读取。',
    '当前聊天系统支持转账互动。',
    '如果角色接受用户最近一笔待收款转账，则必须在对应的 side=left [消息] 块中加入：transferAction=accept',
    '如果角色退回用户最近一笔待收款转账，则必须在对应的 side=left [消息] 块中加入：transferAction=return',
    '如果角色主动向用户发起转账，则必须在对应的 side=left [消息] 块中加入：transferAction=send',
    '当 transferAction=send 时，必须同时提供：transferAmount=正数金额',
    '如有备注，可额外提供：transferNote=备注内容',
    'transferAction、transferAmount、transferNote 必须写在 [消息] 块内部，和 side、sender、content、state 同级，不能写在正文里，不能写在块外。',
    '如果只是普通聊天，没有发生转账行为，则不要添加 transferAction 字段。',
    '如果用户消息中包含“[转账] 金额xx，备注xx”，且角色语义上表示“收到、谢谢、我收下了”，则应添加 transferAction=accept。',
    '如果用户消息中包含“[转账] 金额xx，备注xx”，且角色语义上表示“我不能收、你拿回去、不用给我”，则应添加 transferAction=return。',
    '如果输出的 [消息] 块使用 text 字段、缺少 sender 字段、缺少 state 字段，均视为格式错误，必须自行改正后再输出。',
    '若回复语义已经构成接受转账、退回转账或主动发起转账，则必须补出 transferAction 字段，否则视为格式错误。',
    '',
    '[VV_EVENT]',
    'type=chat',
    'chatId=' + chatId,
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

let isTriggeringAIReply = false;

async function triggerAIReply() {
  if (isTriggeringAIReply) {
    console.log('[triggerAIReply] skipped: locked');
    return;
  }

  isTriggeringAIReply = true;

  try {
    console.log(
      '[triggerAIReply] currentChatId=',
      currentChatId,
      'pending=',
      pendingReplyTargets[currentChatId],
      'msgLen=',
      (messages[currentChatId] || []).length
    );

    if (!currentChatId) {
      console.log('[triggerAIReply] aborted: no currentChatId');
      return;
    }

    if (!pendingReplyTargets[currentChatId]) {
      console.log('[triggerAIReply] aborted: no pending target');
      return;
    }

    const thread = messages[currentChatId] || [];
    const pendingMessages = thread.filter(m => m.isMe && !m.recalled && m.pendingForReply);

    console.log('[triggerAIReply] pendingMessages.length =', pendingMessages.length);
    console.log('[triggerAIReply] pendingMessages =', pendingMessages);

    if (!pendingMessages.length) {
      console.log('[triggerAIReply] no pendingMessages, clear target');
      pendingReplyTargets[currentChatId] = false;
      saveAll();
      return;
    }

    const bridgeName = getBridgeNameByChatId(currentChatId, currentChatType);
    const vvPayload = buildVVEventPayload(currentChatId);
    const latestPayload = buildLatestUserPayload(currentChatId);
    const promptText = vvPayload || latestPayload;

    console.log('[triggerAIReply] bridgeName =', bridgeName);
    console.log('[triggerAIReply] vvPayload =', vvPayload);
    console.log('[triggerAIReply] latestPayload =', latestPayload);
    console.log('[triggerAIReply] final promptText =', promptText);

    if (!promptText || !String(promptText).trim()) {
      console.warn('[triggerAIReply] aborted: promptText is empty');
      return;
    }

    let slashOk = false;

    if (
      VV_BRIDGE_CONFIG.enabled &&
      (VV_BRIDGE_CONFIG.chatMode === 'slash' || VV_BRIDGE_CONFIG.chatMode === 'local+slash')
    ) {
      const cmd = VV_BRIDGE_CONFIG.buildReplyCommand({
        bridgeName,
        chatId: currentChatId,
        chatType: currentChatType,
        promptText
      });

      console.log('[triggerAIReply] slash cmd =', cmd);
      slashOk = await triggerSlash(cmd);
      console.log('[triggerAIReply] slashOk =', slashOk);
    }

    if (!slashOk || VV_BRIDGE_CONFIG.chatMode === 'local') {
      console.log('[triggerAIReply] fallback simulateAutoReply');
      simulateAutoReply(currentChatId, currentChatType);

      pendingMessages.forEach(m => {
        m.pendingForReply = false;
      });
      pendingReplyTargets[currentChatId] = false;

      saveAll();
      return;
    }

    // 关键：这里不要提前清 pending
    // 等 handleVVChatSyncRaw -> appendVVChatReplyToLocal 真正落库后再清
    console.log('[triggerAIReply] slash submitted, waiting for VVPHONE_CHAT_SYNC...');
    saveAll();
  } catch (err) {
    console.error('[triggerAIReply] error:', err);
  } finally {
    setTimeout(() => {
      isTriggeringAIReply = false;
      console.log('[triggerAIReply] lock released');
    }, 300);
  }
}

async function requestCurrentChatReply() {
  if (!currentChatId) {
    console.log('[requestCurrentChatReply] aborted: no currentChatId');
    return;
  }

  if (!messages[currentChatId]) {
    messages[currentChatId] = [];
  }

  const batch = collectCurrentReplyBatch(currentChatId);

  console.log('[requestCurrentChatReply] collected batch:', batch);

  if (!batch.length) {
    console.log('[requestCurrentChatReply] no new batch messages');
    return;
  }

  currentReplyBatch[currentChatId] = batch.map(m => m.id);
  pendingReplyTargets[currentChatId] = true;
  saveAll();

  console.log('[requestCurrentChatReply] pendingReplyTargets set true for', currentChatId);
  console.log('[requestCurrentChatReply] currentReplyBatch ids =', currentReplyBatch[currentChatId]);

  await triggerAIReply();
}

function collectCurrentReplyBatch(chatId) {
  const thread = messages[chatId] || [];
  if (!thread.length) {
    console.log('[collectCurrentReplyBatch] empty thread:', chatId);
    return [];
  }

  console.log('[collectCurrentReplyBatch] thread snapshot:', thread.map((m, idx) => ({
    idx,
    id: m.id,
    isMe: m.isMe,
    type: m.type,
    text: m.text || (Array.isArray(m.chunks) ? m.chunks.join('\n') : ''),
    pendingForReply: m.pendingForReply,
    recalled: m.recalled
  })));

  let lastThemIndex = -1;
  for (let i = thread.length - 1; i >= 0; i--) {
    const m = thread[i];
    if (!m.isMe && !m.recalled) {
      lastThemIndex = i;
      break;
    }
  }

  console.log('[collectCurrentReplyBatch] lastThemIndex =', lastThemIndex);

  const batch = thread.filter((m, idx) => (
    idx > lastThemIndex &&
    m.isMe &&
    !m.recalled &&
    m.pendingForReply
  ));

  console.log('[collectCurrentReplyBatch] batch result:', batch);

  return batch;
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

function findLastPendingMyTransfer(chatId) {
  const thread = messages[chatId] || [];
  for (let i = thread.length - 1; i >= 0; i--) {
    const msg = thread[i];
    if (msg && msg.isMe && msg.type === 'transfer' && msg.status === '待收款') {
      return msg;
    }
  }
  return null;
}

function acceptMyTransferByAI(chatId, transferMsg) {
  if (!chatId || !transferMsg) return;
  if (transferMsg.status !== '待收款') return;

  transferMsg.status = '已被接收';

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[chatId].push({
    id: 'm' + Date.now() + '_accept',
    sender: chatId,
    senderName: getCurrentChatName(chatId, currentChatType),
    isMe: false,
    type: 'transfer_notice',
    amount: Number(transferMsg.amount || 0),
    note: transferMsg.note || '转账',
    status: '已收款',
    relatedTransferId: transferMsg.id,
    recalled: false,
    time,
    timeLabel
  });

  updateLastMsg(chatId, `[收款] ¥${transferMsg.amount}`, time, currentChatType);
  renderMessages();
  saveAll();
}

function returnMyTransferByAI(chatId, transferMsg) {
  if (!chatId || !transferMsg) return;

  console.log('[AI退回前]', transferMsg.id, transferMsg.status);

  if (transferMsg.status !== '待收款') return;

  transferMsg.status = '已退回';
  console.log('[AI退回后]', transferMsg.id, transferMsg.status);

  if (!transferMsg.refunded) {
    addWalletBalance(Number(transferMsg.amount || 0));
    transferMsg.refunded = true;
  }

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[chatId].push({
    id: 'm' + Date.now() + '_return',
    sender: chatId,
    senderName: getCurrentChatName(chatId, currentChatType),
    isMe: false,
    type: 'transfer_notice',
    amount: Number(transferMsg.amount || 0),
    note: transferMsg.note || '转账',
    status: '已退回',
    relatedTransferId: transferMsg.id,
    recalled: false,
    time,
    timeLabel
  });

  updateLastMsg(chatId, `[退回转账] ¥${transferMsg.amount}`, time, currentChatType);
  renderMessages();
  saveAll();
}

function receiveTransferFromAI(chatId, amount, note = '给你的转账') {
  if (!chatId) return;

  const money = Number(amount || 0);
  if (!Number.isFinite(money) || money <= 0) return;

  if (!messages[chatId]) messages[chatId] = [];

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  const newMsg = {
    id: 'm' + Date.now() + '_ai_transfer',
    sender: chatId,
    senderName: getCurrentChatName(chatId, currentChatType),
    isMe: false,
    type: 'transfer',
    amount: money,
    note,
    status: '待收款',
    recalled: false,
    time,
    timeLabel,
    settled: false,
    refunded: false
  };

  messages[chatId].push(newMsg);

  updateLastMsg(chatId, `[转账] ¥${money}`, time, currentChatType);
  renderMessages();
  saveAll();
}

function openTransferReceiveDialog(messageId) {
  if (!currentChatId || !messageId) return;

  const thread = messages[currentChatId] || [];
  const msg = thread.find(m => m.id === messageId);
  if (!msg || msg.type !== 'transfer') return;

  currentTransferMessageRef = msg;
  currentTransferChatId = currentChatId;

  const amountEl = document.getElementById('receiveTransferAmount');
  const noteEl = document.getElementById('receiveTransferNote');
  const actionEl = document.getElementById('receiveTransferActions');
  const stateEl = document.getElementById('receiveTransferState');

  if (amountEl) amountEl.textContent = `¥${Number(msg.amount || 0)}`;
  if (noteEl) noteEl.textContent = msg.note || '转账';

  const isPending = msg.status === '待收款';
  const canOperate = !msg.isMe && isPending;

  if (stateEl) {
    stateEl.textContent = isPending ? '待收款' : (msg.status || '');
  }

  if (actionEl) {
    actionEl.style.display = canOperate ? 'flex' : 'none';
  }

  showDialog('receiveTransferDialog');
}

function acceptIncomingTransfer() {
  const msg = currentTransferMessageRef;
  const chatId = currentTransferChatId;
  if (!msg || !chatId) return;

  if (msg.isMe) {
    closeDialog('receiveTransferDialog');
    return;
  }

  const thread = messages[chatId] || [];
  const idx = thread.findIndex(item => item.id === msg.id);
  if (idx === -1) {
    closeDialog('receiveTransferDialog');
    return;
  }

  const targetMsg = thread[idx];

  if (targetMsg.type !== 'transfer' || targetMsg.status !== '待收款') {
    closeDialog('receiveTransferDialog');
    return;
  }

  if (!targetMsg.settled) {
    addWalletBalance(Number(targetMsg.amount || 0));
    targetMsg.settled = true;
  }

  // 关键：直接回写到消息数组里
  messages[chatId][idx] = {
    ...targetMsg,
    status: '已收款'
  };

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[chatId].push({
    id: 'm' + Date.now() + '_accepted_notice',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'transfer_notice',
    amount: Number(targetMsg.amount || 0),
    note: targetMsg.note || '转账',
    status: '已收款',
    relatedTransferId: targetMsg.id,
    recalled: false,
    time,
    timeLabel
  });

  currentTransferMessageRef = messages[chatId][idx];

  updateLastMsg(chatId, `[已收款] ¥${targetMsg.amount}`, time, currentChatType);
  renderMessages();
  saveAll();
  closeDialog('receiveTransferDialog');
}

function returnIncomingTransfer() {
  const msg = currentTransferMessageRef;
  const chatId = currentTransferChatId;
  if (!msg || !chatId) return;

  if (msg.isMe) {
    closeDialog('receiveTransferDialog');
    return;
  }

  if (msg.type !== 'transfer' || msg.status !== '待收款') {
    closeDialog('receiveTransferDialog');
    return;
  }

  msg.status = '已退回';
  msg.refunded = true;

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[chatId].push({
    id: 'm' + Date.now() + '_return_notice',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'transfer_notice',
    amount: Number(msg.amount || 0),
    note: msg.note || '转账',
    status: '已退回',
    relatedTransferId: msg.id,
    recalled: false,
    time,
    timeLabel
  });

  updateLastMsg(chatId, `[已退回转账] ¥${msg.amount}`, time, currentChatType);
  renderMessages();
  saveAll();
  closeDialog('receiveTransferDialog');
}

function extractVVChatSyncBlock(text) {
  if (!text) return '';
  const match = String(text).match(/\[VV_CHAT_SYNC\]([\s\S]*?)\[\/VV_CHAT_SYNC\]/);
  return match ? match[1].trim() : '';
}

function parseVVSyncMessages(syncText) {
  if (!syncText) return [];

  const blocks = [...String(syncText).matchAll(/\[消息\]([\s\S]*?)\[\/消息\]/g)];

  return blocks.map(match => {
    const block = match[1];

    const getField = (name) => {
      const m = block.match(new RegExp(`${name}=([^\\n]*)`));
      return m ? m[1].trim() : '';
    };

    return {
      side: getField('side'),
      sender: getField('sender'),
      content: getField('content') || getField('text'),
      state: getField('state'),
      transferAction: getField('transferAction'),
      transferAmount: getField('transferAmount'),
      transferNote: getField('transferNote')
    };
  });
}

function handleAITransferDirectives(chatId, text) {
  if (!chatId || !text) return text;

  console.log('[handleAITransferDirectives] raw head=', String(text).slice(0, 500));

  const syncText = extractVVChatSyncBlock(text);
  if (!syncText) return text;

  const syncMessages = parseVVSyncMessages(syncText);

  syncMessages.forEach(msg => {
    if (msg.side !== 'left') return;

    if (msg.transferAction === 'accept') {
      const transferMsg = findLastPendingMyTransfer(chatId);
      if (transferMsg) {
        acceptMyTransferByAI(chatId, transferMsg);
      }
    }

    if (msg.transferAction === 'return') {
      const transferMsg = findLastPendingMyTransfer(chatId);
      if (transferMsg) {
        returnMyTransferByAI(chatId, transferMsg);
      }
    }

    if (msg.transferAction === 'send') {
      const amount = Number(msg.transferAmount || 0);
      if (amount > 0) {
        receiveTransferFromAI(chatId, amount, msg.transferNote || '给你的转账');
      }
    }
  });

  return text;
}

function appendAIMessageToCurrentChat({ chatId, senderName, text, type = 'text' }) {
  if (!chatId) return;
  if (!messages[chatId]) messages[chatId] = [];

  let finalText = text || '...';

  if (type === 'text') {
    finalText = handleAITransferDirectives(chatId, finalText);
  }

  if (type === 'text' && !finalText.trim()) {
    renderMessages();
    saveAll();
    return;
  }

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[chatId].push({
    id: 'm' + Date.now(),
    sender: chatId,
    senderName: senderName || getCurrentChatName(chatId, currentChatType),
    isMe: false,
    type,
    chunks: type === 'text' ? splitInputToChunks(finalText || '...') : [finalText || '...'],
    recalled: false,
    time,
    timeLabel
  });

  renderMessages();
  updateLastMsg(chatId, finalText || '新消息', time, currentChatType);
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

  if (!(msg.sender === 'me' || msg.isMe === true)) {
    document.getElementById('messageOperationMenu')?.classList.remove('show');
    alert('只能撤回自己发出的消息');
    return;
  }

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
    { id: 's1', name: '摸摸头', src: 'https://s41.ax1x.com/2026/03/04/pe9kxzR.jpg' },
    { id: 's2', name: '贴贴', src: 'https://s41.ax1x.com/2026/03/08/pePRyo4.jpg' },
    { id: 's3', name: '我要嫁给你', src: 'https://origin.picgo.net/2026/03/24/Screenshot_20260324_070736_com.ss.android.ugc.aweme_edit_10274381810346293b0de1b6a9ab34974.jpg' },
    { id: 's4', name: '本皇准了', src: 'https://origin.picgo.net/2026/03/24/Screenshot_20260324_070717_com.ss.android.ugc.aweme_edit_1027439026581243742ad1c6449bd1222.jpg' },
    { id: 's5', name: '炸毛的小猫', src: 'https://s41.ax1x.com/2026/03/07/pePE9cd.jpg' },
    { id: 's6', name: '害羞小猫', src: 'https://s41.ax1x.com/2026/03/07/pePEp1H.jpg' },
    { id: 's7', name: '竖中指', src: 'https://s41.ax1x.com/2026/03/24/peKyxP0.jpg' },
    { id: 's8', name: '出现！', src: 'https://origin.picgo.net/2026/04/01/Screenshot_20260401_235612_com.ss.android.ugc.aweme_edit_10936805860700943a95d4ee57e75f1ba.jpg' },
    { id: 's9', name: '略————！', src: 'https://origin.picgo.net/2026/03/24/Screenshot_20260324_070639_com.ss.android.ugc.aweme_edit_102744136709186847dd8df865478ae5d.jpg' },
    { id: 's10', name: '生气到跺脚', src: 'https://origin.picgo.net/2026/03/24/Screenshot_20260324_070648_com.ss.android.ugc.aweme_edit_102744019583145192b544c46a8f1afe9.jpg' },
    { id: 's11', name: '骄傲', src: 'https://origin.picgo.net/2026/04/01/Screenshot_20260401_235205_com.ss.android.ugc.aweme_edit_109369104937092604fef08e4144e4b58.jpg' },
    { id: 's12', name: '走了！', src: 'https://origin.picgo.net/2026/04/01/Screenshot_20260401_235605_com.ss.android.ugc.aweme_edit_10936822637478545524bc31bf75f3fb7.jpg' } 
  ];
}

function toggleEmojiPanel() {
  console.log('toggleEmojiPanel fired');

  const panel = document.getElementById('emojiPanel');
  console.log('emojiPanel =', panel);

  if (!panel) return;

  const isOpen = panel.classList.contains('show');
  console.log('isOpen =', isOpen);

  if (isOpen) {
    closeEmojiPanel();
  } else {
    renderEmojiPanel();
    panel.style.display = 'block';
    requestAnimationFrame(() => {
      panel.classList.add('show');
    });
  }
}

function renderEmojiPanel() {
  const grid = document.getElementById('emojiPanelGrid');
  if (!grid) return;

  if (!stickerPacks.length) {
    grid.innerHTML = `<div class="empty-state"><span>还没有表情包</span></div>`;
    return;
  }

  grid.innerHTML = stickerPacks.map(s => `
    <div class="emoji-item ${stickerManageMode ? 'manage-mode' : ''}"
         oncontextmenu="event.preventDefault(); enterStickerManageMode('${s.id}')"
         ontouchstart="handleStickerTouchStart('${s.id}')"
         ontouchend="handleStickerTouchEnd()"
         ontouchmove="handleStickerTouchEnd()"
         onmousedown="handleStickerTouchStart('${s.id}')"
         onmouseup="handleStickerTouchEnd()"
         onmouseleave="handleStickerTouchEnd()"
         onclick="${stickerManageMode ? 'return false;' : `sendStickerDirect('${s.id}')`}">

      <img ${buildMediaSrcAttrs(s.src)} alt="">

      ${stickerManageMode
        ? `<div class="sticker-delete-btn" data-sticker-id="${s.id}">×</div>`
        : ''}     
      ${
        stickerManageMode
          ? `<input
               class="sticker-rename-input"
               data-sticker-id="${s.id}"
               value="${escapeHTMLAttr(s.name || '表情')}"
               onclick="event.stopPropagation()"
               onmousedown="event.stopPropagation()"
               ontouchstart="event.stopPropagation()"
               onkeydown="handleStickerRenameKeydown(event, '${s.id}')"
               onblur="saveStickerRename('${s.id}', this.value)"
             >`
          : `<span>${escapeHTML(s.name || '表情')}</span>`
      }
    </div>
  `).join('');

  hydrateMediaRefs(grid);

  if (stickerManageMode && stickerRenameId) {
    requestAnimationFrame(() => {
      const input = document.querySelector(`.sticker-rename-input[data-sticker-id="${stickerRenameId}"]`);
      input?.focus();
      input?.select();
    });
  }
}

function sendStickerDirect(stickerId) {
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

  const sticker = stickerPacks.find(s => s.id === stickerId);
  if (!sticker) return;

  if (!messages[currentChatId]) {
    messages[currentChatId] = [];
  }

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[currentChatId].push({
    id: 'm' + Date.now() + '_sticker',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'sticker',
    src: sticker.src || '',
    stickerName: sticker.name || '表情',
    desc: '',
    replyTo: null,
    recalled: false,
    time,
    timeLabel,
    pendingForReply: true
  });

  updateLastMsg(currentChatId, `[表情] ${sticker.name || '表情'}`, time, currentChatType);
  pendingReplyTargets[currentChatId] = true;

  renderMessages();
  saveAll();
  closeEmojiPanel();
}

function closeEmojiPanel() {
  const panel = document.getElementById('emojiPanel');
  const messageArea = document.getElementById('messageArea');
  if (!panel || !messageArea) return;

  panel.classList.remove('show');
  messageArea.style.bottom = '104px';

  if (stickerManageMode) {
    stickerManageMode = false;
    stickerRenameId = null;
    stickerRenameDraft = '';
    renderEmojiPanel();
  }
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

  if (!currentSendImageData) {
    alert('请先选择图片');
    return;
  }

  const storedRef = await persistImageToIDB(currentSendImageData, {
    area: 'composer.image',
    chatId: currentChatId
  });

  if (!messages[currentChatId]) messages[currentChatId] = [];

  const time = getNowTime();
  const timeLabel = getNowFullLabel();
  const desc = document.getElementById('sendImageDesc')?.value.trim() || '';

  messages[currentChatId].push({
    id: 'm' + Date.now() + '_img',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'image',
    src: storedRef,
    desc,
    recalled: false,
    time,
    timeLabel,
    pendingForReply: true
  });

  updateLastMsg(currentChatId, desc || '[图片]', time, currentChatType);
  pendingReplyTargets[currentChatId] = true;

  renderMessages();
  saveAll();

  currentSendImageData = null;
  const input = document.getElementById('sendImageInput');
  if (input) input.value = '';
  const descInput = document.getElementById('sendImageDesc');
  if (descInput) descInput.value = '';

  closeDialog('imageSendDialog');
  closeEmojiPanel?.();
}

function addVoiceDraft() {
  showDialog('voiceDialog');
}

function confirmVoiceDraft() {
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

  const transcript = document.getElementById('voiceTextInput')?.value.trim();
  const duration = document.getElementById('voiceDurationInput')?.value.trim() || '4';

  if (!transcript) {
    alert('请输入语音转文字内容');
    return;
  }

  if (!messages[currentChatId]) messages[currentChatId] = [];

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[currentChatId].push({
    id: 'm' + Date.now() + '_voice',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'voice',
    transcript,
    duration,
    recalled: false,
    time,
    timeLabel,
    pendingForReply: true
  });

  updateLastMsg(currentChatId, '[语音]', time, currentChatType);
  pendingReplyTargets[currentChatId] = true;

  renderMessages();
  saveAll();

  const textInput = document.getElementById('voiceTextInput');
  if (textInput) textInput.value = '';
  const durationInput = document.getElementById('voiceDurationInput');
  if (durationInput) durationInput.value = '';

  closeDialog('voiceDialog');
  closeEmojiPanel?.();
}

function openTransferDialog() {
  if (!currentChatId) return;
  showDialog('transferDialog');
}

function confirmTransfer() {
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

  const amountText = document.getElementById('transferAmount')?.value.trim();
  const note = document.getElementById('transferNote')?.value.trim();

  if (!amountText) {
    alert('请输入金额');
    return;
  }

  const amount = Number(amountText);
  if (!Number.isFinite(amount) || amount <= 0) {
    alert('请输入正确的金额');
    return;
  }

  if (!canAfford(amount)) {
    alert('余额不足');
    return;
  }

  const ok = subtractWalletBalance(amount);
  if (!ok) {
    alert('余额不足');
    return;
  }

  if (!messages[currentChatId]) messages[currentChatId] = [];

  const time = getNowTime();
  const timeLabel = getNowFullLabel();

  messages[currentChatId].push({
    id: 'm' + Date.now() + '_transfer',
    sender: 'me',
    senderName: '我',
    isMe: true,
    type: 'transfer',
    amount: amount,
    note: note || '转账',
    status: '待收款',
    recalled: false,
    time,
    timeLabel,
    pendingForReply: true,
    settled: true,
    refunded: false
  });

  updateLastMsg(currentChatId, `[转账] ¥${amount}`, time, currentChatType);
  pendingReplyTargets[currentChatId] = true;

  renderMessages();
  saveAll();

  const amountInput = document.getElementById('transferAmount');
  if (amountInput) amountInput.value = '';
  const noteInput = document.getElementById('transferNote');
  if (noteInput) noteInput.value = '';

  closeDialog('transferDialog');
  closeEmojiPanel?.();
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

  const titleEl = document.getElementById('profileTitleName');
  if (titleEl) titleEl.innerText = contact?.name || '联系人';

  const profileCover = document.getElementById('profileCover');
  const theirAvatar = document.getElementById('profileTheirAvatar');
  const myPreview = document.getElementById('profileMyAvatarPreview');
  const theirPreview = document.getElementById('profileTheirAvatarPreview');

  const bgSrc = getChatBackground(currentChatId);
  const myAvatarSrc = getMyAvatar(currentChatId);
  const theirAvatarSrc = set.theirAvatar || DEFAULT_AVATAR;

  if (profileCover) {
    if (bgSrc) {
      profileCover.style.backgroundImage = `url(${await resolveImageRefToUrl(bgSrc)})`;
      profileCover.style.backgroundSize = 'cover';
      profileCover.style.backgroundPosition = 'center';
    } else {
      profileCover.style.backgroundImage = 'linear-gradient(135deg, #f7d9e9, #d8edf7)';
    }
  }

  if (theirAvatar) {
    theirAvatar.src = await resolveImageRefToUrl(theirAvatarSrc);
  }

  if (myPreview) {
    myPreview.src = await resolveImageRefToUrl(myAvatarSrc);
  }

  if (theirPreview) {
    theirPreview.src = await resolveImageRefToUrl(theirAvatarSrc);
  }

  const chip = document.getElementById('blockToggleChip');
  if (chip) {
    chip.innerText = rel.blockedByMe ? '已拉黑' : '未拉黑';
    chip.classList.toggle('active', rel.blockedByMe);
  }

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
  const fileInput = document.getElementById('stickerFileInput');

  const makeStickerId = () => 's' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

  if (currentStickerImportMode === 'url') {
    if (!url) {
      alert('请输入图片URL');
      return;
    }

    stickerPacks.unshift({
      id: makeStickerId(),
      name: name || '表情',
      src: url
    });

    saveAll();
    renderEmojiPanel();
    closeDialog('stickerImportDialog');
    cleanupUnusedIDBAssets();
    return;
  }

  const files = Array.from(fileInput?.files || []).filter(file => file.type.startsWith('image/'));
  if (!files.length) {
    alert('请上传图片');
    return;
  }

  if (files.length > 20) {
    alert('一次最多导入 20 张表情');
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const dataUrl = await new Promise(resolve => {
      fileToDataURL(file, data => resolve(data), {
        compress: true,
        maxWidth: 512,
        quality: 0.72
      });
    });

    const ref = await persistImageToIDB(dataUrl, {
      area: 'sticker.import',
      name: file.name
    });

    stickerPacks.unshift({
      id: makeStickerId(),
      name: files.length === 1 ? (name || '表情') : '表情',
      src: ref
    });
  }

  saveAll();
  renderEmojiPanel();
  closeDialog('stickerImportDialog');
  cleanupUnusedIDBAssets();

  const preview = document.getElementById('stickerImportPreview');
  if (preview) {
    preview.innerHTML = `<span>表情预览区</span>`;
  }

  if (fileInput) fileInput.value = '';
  const nameInput = document.getElementById('stickerNameInput');
  if (nameInput) nameInput.value = '';
  const urlInput = document.getElementById('stickerUrlInput');
  if (urlInput) urlInput.value = '';
}

function initStickerImportPreview() {
  const stickerFileInput = document.getElementById('stickerFileInput');
  const stickerUrlInput = document.getElementById('stickerUrlInput');
  if (!stickerFileInput || !stickerUrlInput) return;

  stickerFileInput.addEventListener('change', e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (files.length > 20) {
      alert('一次最多导入 20 张表情');
      stickerFileInput.value = '';
      return;
    }

    const box = document.getElementById('stickerImportPreview');
    if (!box) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (!imageFiles.length) return;

    const previewFiles = imageFiles.slice(0, 8);

    Promise.all(previewFiles.map(file => new Promise(resolve => {
      fileToDataURL(file, data => resolve(data), {
        compress: true,
        maxWidth: 256,
        quality: 0.72
      });
    }))).then(results => {
      box.innerHTML = `
        <div style="font-size:12px;color:#666;margin-bottom:8px;">
          已选择 ${imageFiles.length} 张图片
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
          ${results.map(src => `
            <img src="${src}" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:10px;">
          `).join('')}
        </div>
      `;
    });
  });

  stickerUrlInput.addEventListener('input', function () {
    if (currentStickerImportMode !== 'url') return;
    const url = this.value.trim();
    const box = document.getElementById('stickerImportPreview');
    if (!box) return;

    if (!url) {
      box.innerHTML = `<span>表情预览区</span>`;
      return;
    }

    box.innerHTML = `<img src="${url}" style="max-width:100%;max-height:100%;object-fit:contain;">`;
  });
}

function initStickerPanelEvents() {
  const grid = document.getElementById('emojiPanelGrid');
  if (!grid || grid.dataset.bindDelete === '1') return;

  grid.dataset.bindDelete = '1';

  grid.addEventListener('pointerdown', function (e) {
    const btn = e.target.closest('.sticker-delete-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const stickerId = btn.dataset.stickerId;
    if (!stickerId) return;

    deleteStickerById(stickerId, e);
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
  window.addEventListener('message', async event => {
    const data = event.data;

    console.log('[VV][listener] raw message event:', data);

    if (!data || typeof data !== 'object') {
      console.log('[VV][listener] ignored: data invalid');
      return;
    }

    const myViewId = window.__vv_view_id || '';
    console.log('[VV][listener] view check:', {
      incomingType: data.type,
      incomingViewId: data.viewId || '',
      myViewId
    });

    if (data.viewId && myViewId && data.viewId !== myViewId) {
      console.log('[VV][listener] ignore message for other viewId:', {
        type: data.type,
        incomingViewId: data.viewId,
        myViewId
      });
      return;
    }

    if (VV_BRIDGE_CONFIG.debug) {
      console.log('[VV] 收到 bridge 消息:', data);
    }

    if (data.type === 'VVPHONE_CHAT_SYNC') {
      console.log('[VV] 收到 VVPHONE_CHAT_SYNC:', (data.raw || '').slice(0, 300));
      await handleVVChatSyncRaw(data.raw || '');
      return;
    }

    if (data.type === 'VVPHONE_REPLY') {
      const chatId = data.chatId || currentChatId;
      appendAIMessageToCurrentChat({
        chatId,
        senderName: data.senderName || getBridgeNameByChatId(chatId, currentChatType),
        text: data.text || '……'
      });
      return;
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
      return;
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
      return;
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
      return;
    }

    if (data.type === 'VVPHONE_FEED_REPLY') {
      appendAICommentToFeed({
        postId: data.postId,
        senderName: data.senderName || '角色',
        text: data.text || '……',
        replyTo: data.replyTo || ''
      });
      return;
    }

    console.log('[VV][listener] unhandled message type:', data.type);
  });
}

function initEventBindings() {
  document.getElementById('bgOpacity')?.addEventListener('input', updateBgStyle);
  document.getElementById('bgBlur')?.addEventListener('input', updateBgStyle);
  document.getElementById('imageUpload')?.addEventListener('change', handleImageUpload);
    // --- 拦截主页头像上传 ---
  document.getElementById('profileAvatarInput')?.addEventListener('change', async e => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async ev => {
      const dataUrl = ev.target?.result;
      if (!dataUrl) return;

      // 拦截！打开裁剪框，比例 1:1 (头像)
      openCropDialog(dataUrl, 1, async (croppedUrl) => {
        // 裁剪完成后，直接把 DataURL 传给原有的处理函数
        await handleProfileAvatarFile(croppedUrl);
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, true); // 清空 input，允许重复选同一张图

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

  document.getElementById('emojiPanelGrid')?.addEventListener('click', e => {
    if (!stickerManageMode) return;

    const clickedItem = e.target.closest('.emoji-item');
    const clickedDeleteBtn = e.target.closest('.sticker-delete-btn');

    if (!clickedItem && !clickedDeleteBtn) {
      exitStickerManageMode();
    }
  });

  document.getElementById('myAvatarInput')?.addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file || !currentChatId) return;

    const chatId = currentChatId;

    const reader = new FileReader();
    reader.onload = async ev => {
      const data = ev.target?.result;
      if (!data) return;

      // 拦截：打开裁剪框，比例 1:1 (头像)
      openCropDialog(data, 1, async (croppedUrl) => {
        const ref = await persistImageToIDB(croppedUrl, {
          area: 'chat.myAvatar',
          chatId
        });

        if (!ref) {
          alert('头像保存失败，请重试');
          return;
        }

        const setting = getChatSetting(chatId);

        setting.myAvatarBase = ref;

        if (myProfile.avatarUnified) {
          setting.myAvatarOverride = ref;
        }

        saveAll();

        if (currentChatId === chatId && currentChatType === 'direct') {
          await openChatSettingPage();
        }

        renderMessages?.();
        renderChatList?.();
        renderFeedHeader?.();
        renderFeedList?.();
      });
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  });

  bindFileInput('theirAvatarInput', async data => {
    if (!currentChatId) return;
    // 拦截：打开裁剪框，比例 1:1 (头像)
    openCropDialog(data, 1, async (croppedUrl) => {
      const ref = await persistImageToIDB(croppedUrl, { area: 'chat.theirAvatar', chatId: currentChatId });
      getChatSetting(currentChatId).theirAvatar = ref;
      saveAll();
      openChatSettingPage();
      renderMessages();
      renderChatList();
    });
  }, {
    compress: true,
    maxWidth: 512,
    quality: 0.72
  });

  bindFileInput('chatBgInput', async data => {
    if (!currentChatId) return;

    // 拦截：打开裁剪框，比例 16:9 (背景)
    openCropDialog(data, 9 / 16, async (croppedUrl) => {
      const ref = await persistImageToIDB(croppedUrl, {
        area: 'chat.background',
        chatId: currentChatId
      });

      if (!ref) {
        alert('背景保存失败，请重试');
        return;
      }

      const setting = getChatSetting(currentChatId);

      setting.backgroundBase = ref;

      if (myProfile.backgroundUnified) {
        setting.backgroundOverride = ref;
      }

      saveAll();
      await openChatSettingPage();
      await applyCurrentChatBackground();
      renderChatList?.();
      renderFeedHeader?.();
      renderFeedList?.();
    });
  }, {
    compress: true,
    maxWidth: 1280,
    quality: 0.68
  });

  bindFileInput('feedCoverInput', async data => {
    // 拦截：打开裁剪框，比例 16:9 (背景)
    openCropDialog(data, 16 / 9, async (croppedUrl) => {
      const ref = await persistImageToIDB(croppedUrl, { area: 'feed.cover' });
      appProfile.feedCover = ref;
      saveAll();
      renderFeedHeader();
      const cover = document.getElementById('profileCover');
      if (cover) {
        cover.style.backgroundImage = `url(${await resolveImageRefToUrl(ref)})`;
      }
    });
  }, {
    compress: true,
    maxWidth: 1280,
    quality: 0.68
  });

  bindFileInput('globalBgInput', async data => {
    // 拦截：打开裁剪框，比例 16:9 (背景)
    openCropDialog(data, 9 / 16, async (croppedUrl) => {
      const ref = await persistImageToIDB(croppedUrl, { area: 'profile.globalBg' });

      if (!ref) {
        alert('背景保存失败，请重试');
        return;
      }

      ensureProfileData();
      myProfile.globalChatBg = ref;

      if (myProfile.backgroundUnified) {
        Object.keys(chatSettings).forEach(chatId => {
          const setting = getChatSetting(chatId);
          setting.backgroundOverride = '';
        });
      }

      saveAll();

      await updateProfileUI();
      if (currentChatId) {
        await applyCurrentChatBackground?.();
      }

      renderChatList?.();
      renderFeedHeader?.();
      renderFeedList?.();
      renderGroupList?.();
    });
  }, {
    compress: true,
    maxWidth: 1280,
    quality: 0.68
  });
}

function migrateFeedPostsAuthorId() {
  const myNames = new Set([
    '我',
    myProfile.nickname || '',
    appProfile.myName || ''
  ].filter(Boolean));

  let changed = false;

  (feedPosts || []).forEach(post => {
    if (!post) return;

    if (!post.authorId && myNames.has(post.author)) {
      post.authorId = 'me';
      changed = true;
    }
  });

  if (changed) {
    saveAll();
  }
}

function getVVRouteParams() {
  try {
    const url = new URL(window.location.href);
    return {
      view: url.searchParams.get('vv_view') || '',
      chatId: url.searchParams.get('chatId') || '',
      chatType: url.searchParams.get('chatType') || 'chat',
      target: url.searchParams.get('target') || ''
    };
  } catch (err) {
    return {
      view: '',
      chatId: '',
      chatType: 'chat',
      target: ''
    };
  }
}

async function openChatByRoute() {
  const route = getVVRouteParams();
  if (route.view !== 'chat') return false;
  if (!route.chatId) return false;

  const chatId = route.chatId;
  const chatType = route.chatType || 'direct';

  if (!messages[chatId]) {
    messages[chatId] = [];
  }

  currentChatId = chatId;
  currentChatType = chatType;

  const rel = getRelSetting(chatId);
  if (route.target && rel && !rel.name) {
    rel.name = route.target;
  }

  const nameEl = document.getElementById('chatDetailName');
  if (nameEl) {
    nameEl.textContent = route.target || (rel && rel.name) || '联系人';
  }

  if (typeof openChatDetail === 'function') {
    await openChatDetail(chatId, route.target || '');
    return true;
  }

  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

  const page = document.getElementById('chatDetailPage');
  if (page) {
    page.style.display = 'block';
  }

  if (typeof applyCurrentChatBackground === 'function') {
    await applyCurrentChatBackground();
  }

  if (typeof renderMessages === 'function') {
    await renderMessages();
  }

  isChatViewReady = true;
  return true;
}

function openProfileNicknameDialog() {
  const input = document.getElementById('profileNicknameDialogInput');
  if (input) input.value = myProfile.nickname || '我';
  showDialog('profileNicknameDialog');
}

function confirmProfileNicknameChange() {
  const input = document.getElementById('profileNicknameDialogInput');
  if (!input) return;

  setMyProfileNickname(input.value);
  closeDialog('profileNicknameDialog');
}

function normalizeChatSetting(chatId) {
  const setting = getChatSetting(chatId);

  if (typeof setting.myAvatarBase === 'undefined' && setting.myAvatar) {
    setting.myAvatarBase = setting.myAvatar;
  }

  if (typeof setting.backgroundBase === 'undefined' && setting.background) {
    setting.backgroundBase = setting.background;
  }

  return setting;
}

function getFeedAuthorAvatar(post) {
  if (!post) return DEFAULT_AVATAR;

  const myNames = new Set([
    '我',
    myProfile.nickname || '',
    appProfile.myName || ''
  ].filter(Boolean));

  const isMine = post.authorId === 'me' || myNames.has(post.author);

  if (isMine) {
    return getMyProfileAvatar() || DEFAULT_AVATAR;
  }

  return post.authorAvatar || DEFAULT_AVATAR;
}

function updateContactHeaderByTab(tab) {
  const titleEl = document.getElementById('contactNavTitle');
  const actionEl = document.getElementById('navAction');
  const actionIconEl = document.getElementById('navActionIcon'); // 如果你有的话

  if (tab === 'direct') {
    if (titleEl) titleEl.textContent = '消息';
    if (actionEl) {
      actionEl.style.display = 'flex';
      actionEl.onclick = () => openContactActionMenu?.();
      actionEl.textContent = '＋';
    }
    return;
  }

  if (tab === 'group') {
    if (titleEl) titleEl.textContent = '群聊';
    if (actionEl) {
      actionEl.style.display = 'flex';
      actionEl.onclick = () => openContactActionMenu?.();
      actionEl.textContent = '＋';
    }
    return;
  }

  if (tab === 'feed') {
    if (titleEl) titleEl.textContent = '动态';
    if (actionEl) {
      actionEl.style.display = 'flex';
      actionEl.onclick = () => openPublishFeedDialog?.();
      actionEl.textContent = '＋';
    }
    return;
  }

  if (tab === 'profile') {
    if (titleEl) titleEl.textContent = '我的';
    if (actionEl) {
      actionEl.style.display = 'none';
      actionEl.onclick = null;
    }
  }
}

function openCropDialog(dataUrl, aspectRatio, callback) {
  const dialog = document.getElementById('imageCropDialog');
  const image = document.getElementById('cropTargetImage');

  if (!dialog || !image) return;

  // 记录回调
  cropCallback = callback;

  // 如果有旧的裁剪实例，先销毁
  if (currentCropper) {
    currentCropper.destroy();
    currentCropper = null;
  }

  // 设置图片源并显示弹窗
  image.src = dataUrl;
  dialog.style.display = 'flex';

  // 【关键新增】屏蔽底层所有页面的点击/触摸事件，防止误触触发文件选择
  document.querySelectorAll('.page, .app-container, .tab-bar').forEach(el => {
    el.style.pointerEvents = 'none';
  });

  // 等图片加载完再初始化 Cropper
  image.onload = () => {
    currentCropper = new Cropper(image, {
      aspectRatio: aspectRatio || 1,
      viewMode: 1,
      autoCropArea: 0.8,
      responsive: true,
      background: true,
      zoomable: true,
      movable: true,
    });
  };
}

async function confirmCrop() {
  if (!currentCropper || !cropCallback) {
    closeCropDialog();
    return;
  }

  const isAvatar = currentCropper.options.aspectRatio === 1;
  const maxWidth = isAvatar ? 512 : 1280;

  try {
    const canvas = currentCropper.getCroppedCanvas({
      maxWidth: maxWidth,
      maxHeight: maxWidth,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    if (!canvas) {
      console.error('[Cropper] 裁剪画布生成失败');
      closeCropDialog();
      return;
    }

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);

    // 【调试神器】在执行回调前，看看我们要传进去的到底是啥
    console.log('[Cropper] 准备传给回调的数据类型:', typeof croppedDataUrl, '长度:', croppedDataUrl?.length, '前50字符:', String(croppedDataUrl).substring(0, 50));

    // 执行原来的保存回调
    await cropCallback(croppedDataUrl);

    // 【关键修改】只有回调完全执行成功，没有报错，才关闭弹窗！
    closeCropDialog();

  } catch (err) {
    console.error('[Cropper] 裁剪确认时发生错误:', err);
    // 报错了弹窗不关闭，方便你多点几次或者看控制台
  }
}

/**
 * 关闭裁剪弹窗
 */
function closeCropDialog() {
  const dialog = document.getElementById('imageCropDialog');
  if (currentCropper) {
    currentCropper.destroy();
    currentCropper = null;
  }
  cropCallback = null;
  if (dialog) dialog.style.display = 'none';

  // 恢复底层页面的点击/触摸事件
  document.querySelectorAll('.page, .app-container, .tab-bar').forEach(el => {
    el.style.pointerEvents = '';
  });
}

window.addEventListener('beforeunload', () => {
  releaseAllAssetObjectUrls();
});

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
  initStickerPanelEvents();
  initFeedPostImages();
  initSwipeCall();
  initSTBridgeListener();
  initProfilePage();

  renderAllPanels();
  await renderFeedHeader();
  renderEmojiPanel();

  saveAll('normal');
  cleanupUnusedIDBAssets();

  migrateFeedPostsAuthorId();

  setTimeout(() => {
    !openChatByRoute()
  }, 80);

  // 暂时关闭随机来电，后续改为剧情触发式来电
  // maybeSimulateIncomingCall();
};
