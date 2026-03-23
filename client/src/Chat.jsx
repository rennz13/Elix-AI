import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import elixLogo from './assets/logore.png';
import elixLogoChat from './assets/elix logo.png';
import './Chat.css';
import { supabase } from './supabase';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const PHOTO_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp,image/heic,.heic,.heif';

const INITIAL_CHATS = [];

/** Free tier: max user messages per local calendar day (0 = unlimited). Set VITE_DAILY_PROMPT_LIMIT in .env to change. */
const DAILY_USER_PROMPT_LIMIT = (() => {
  const raw = import.meta.env.VITE_DAILY_PROMPT_LIMIT;
  if (raw === undefined || raw === '') return 8;
  const n = parseInt(String(raw), 10);
  return Number.isFinite(n) ? n : 8;
})();

function IconPlus() {
  return (
    <svg className="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function IconPaperclip() {
  return (
    <svg
      className="chat-icon chat-attach-menu__item-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function IconChatBubble() {
  return (
    <svg className="chat-icon chat-icon--muted" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4H6a2 2 0 01-2-2V6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconUser() {
  return (
    <svg className="chat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg className="chat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg className="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg className="chat-icon chat-icon--send" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg className="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg
      className="chat-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg className="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg className="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg
      className="chat-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
      <path d="M19 10v1a7 7 0 01-14 0v-1" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

function IconMore() {
  return (
    <svg className="chat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function IconPin({ className = '' }) {
  return (
    <svg className={`chat-icon ${className}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 9V4l1-1V2H7v1l1 1v5l-2 2v2h5v7l1 1 1-1v-7h5v-2l-2-2z" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg className="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg className="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" strokeLinecap="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  );
}

const MOBILE_NAV_QUERY = '(max-width: 768px)';
const BACKEND_CHAT_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/chat';
const FALLBACK_AI_UNAVAILABLE = '⚠️ AI is currently unavailable. Please try again.';
/** Shown when user attaches a photo; does not call the AI or use a daily prompt credit. */
const IMAGE_RECOGNITION_UNAVAILABLE_MSG =
  'Image recognition is unavailable for now.';
const DEFAULT_CHAT_TITLE = 'New Chat';
const DEFAULT_CHAT_SUBTITLE = 'Start a new conversation';

function serializeUserMessageContent(text, imageDataUrl) {
  const t = typeof text === 'string' ? text.trim() : '';
  if (!imageDataUrl) return t;
  return JSON.stringify({ t, img: imageDataUrl });
}

function parseUserMessageContent(content) {
  if (content == null || typeof content !== 'string') {
    return { text: '', imageUrl: null };
  }
  if (!content.startsWith('{')) {
    return { text: content, imageUrl: null };
  }
  try {
    const o = JSON.parse(content);
    if (o && typeof o.img === 'string') {
      return { text: typeof o.t === 'string' ? o.t : '', imageUrl: o.img };
    }
  } catch {
    /* plain text */
  }
  return { text: content, imageUrl: null };
}

/** True when saved user content is our JSON shape with an image (not billed toward daily AI limit). */
function isImagePromptContent(content) {
  if (content == null || typeof content !== 'string') return false;
  if (!content.startsWith('{')) return false;
  try {
    const o = JSON.parse(content);
    return Boolean(o && typeof o.img === 'string' && o.img.length > 0);
  } catch {
    return false;
  }
}

function dataUrlToImagePayload(dataUrl) {
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!m) return null;
  return { mimeType: m[1], base64: m[2] };
}

function UserMessageBubble({ content }) {
  const { text, imageUrl } = parseUserMessageContent(content);
  if (!imageUrl && !text) {
    return <p>{content}</p>;
  }
  return (
    <>
      {imageUrl ? <img className="chat-message__attach-img" src={imageUrl} alt="" /> : null}
      {text ? <p>{text}</p> : null}
    </>
  );
}

/** Helps when the model outputs `...text.### Heading` on one line — markdown needs breaks before headings. */
function normalizeAssistantMarkdown(text) {
  if (!text || typeof text !== 'string') return text;
  return text.replace(/([^\n#])(#{1,6}\s)/g, '$1\n\n$2');
}

function BotMessageBubble({ content }) {
  const raw = typeof content === 'string' ? content : '';
  if (!raw.trim()) {
    return null;
  }
  const text = normalizeAssistantMarkdown(raw);
  return (
    <div className="chat-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

async function requestChatReply(prompt, imagePayload = null) {
  const body = { prompt: typeof prompt === 'string' ? prompt.trim() : '' };
  if (imagePayload?.base64 && imagePayload?.mimeType) {
    body.imageBase64 = imagePayload.base64;
    body.imageMimeType = imagePayload.mimeType;
  }
  const response = await fetch(BACKEND_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const backendMessage =
      typeof data?.error === 'string' && data.error.trim()
        ? data.error
        : FALLBACK_AI_UNAVAILABLE;
    throw new Error(backendMessage);
  }

  if (typeof data?.reply === 'string' && data.reply.trim()) {
    return data.reply;
  }
  throw new Error(FALLBACK_AI_UNAVAILABLE);
}

function formatTimestamp(dateInput) {
  return new Date(dateInput || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function fetchTodayUserPromptCount(userId) {
  if (!userId) return null;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const { data, error } = await supabase
    .from('chat_messages')
    .select('content')
    .eq('user_id', userId)
    .eq('role', 'user')
    .gte('created_at', start.toISOString())
    .lt('created_at', end.toISOString())
    .limit(2000);

  if (error) {
    console.error('Failed to count daily prompts:', error.message);
    return null;
  }
  const rows = data || [];
  return rows.filter((row) => !isImagePromptContent(row.content)).length;
}

function mapSessionToChat(session) {
  return {
    id: session.id,
    title: session.title || DEFAULT_CHAT_TITLE,
    subtitle: session.subtitle || DEFAULT_CHAT_SUBTITLE,
    pinned: Boolean(session.pinned),
  };
}

/** First name / handle for greeting: metadata first, else email local-part before @. */
function displayNameForGreeting(user) {
  if (!user) return 'there';
  const meta = user.user_metadata || {};
  const capitalizeWord = (w) =>
    w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '';
  const firstFromFullName = (s) => {
    const t = typeof s === 'string' ? s.trim() : '';
    if (!t) return '';
    const first = t.split(/\s+/)[0];
    return capitalizeWord(first);
  };
  const fromMeta = firstFromFullName(meta.full_name) || firstFromFullName(meta.name);
  if (fromMeta) return fromMeta;
  if (typeof meta.preferred_username === 'string' && meta.preferred_username.trim()) {
    const cleaned = meta.preferred_username.replace(/[._-]+/g, ' ').trim();
    const first = cleaned.split(/\s+/)[0];
    if (first) return capitalizeWord(first);
  }
  const email = typeof user.email === 'string' ? user.email : '';
  const local = email.split('@')[0] || '';
  if (!local) return 'there';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  const first = cleaned.split(/\s+/)[0];
  return first ? capitalizeWord(first) : 'there';
}

/** Sidebar title from the first user message (no duplicate preview line). */
function titleFromFirstPrompt(prompt) {
  const cleaned = prompt.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return { title: DEFAULT_CHAT_TITLE };
  }
  const maxTitle = 60;
  const title =
    cleaned.length > maxTitle ? `${cleaned.slice(0, maxTitle - 1)}…` : cleaned;
  return { title };
}

/** Second line in chat list: when the first prompt was sent (date, month, time). */
function formatChatListSubtitle(at = new Date()) {
  return at.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function closeNavIfMobile(setSidebarOpen) {
  if (typeof window !== 'undefined' && window.matchMedia(MOBILE_NAV_QUERY).matches) {
    setSidebarOpen(false);
  }
}

export default function Chat({ onLogout, user }) {
  const FALLBACK_BOT_REPLY = FALLBACK_AI_UNAVAILABLE;
  const userId = user?.id ?? null;
  const [theme, setTheme] = useState(() => localStorage.getItem('chat-theme') || 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [voiceListening, setVoiceListening] = useState(false);
  const speechRecRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const [settingsMenuPosition, setSettingsMenuPosition] = useState({ top: 0, left: 0, align: 'right' });
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState('');
  const [chatMenuOpenId, setChatMenuOpenId] = useState(null);
  const [chatMenuPosition, setChatMenuPosition] = useState({ top: 0, left: 0, align: 'right' });
  const [renameModal, setRenameModal] = useState({ id: null, value: '' });
  const [deleteChatId, setDeleteChatId] = useState(null);
  const chatMenuRef = useRef(null);
  const [chatMessages, setChatMessages] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  /** How many user (prompt) messages already sent today; null while loading or if limits off */
  const [promptsUsedToday, setPromptsUsedToday] = useState(null);
  const [promptLimitBannerDismissed, setPromptLimitBannerDismissed] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const photoInputRef = useRef(null);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const attachMenuWrapRef = useRef(null);

  const refreshPromptUsage = useCallback(async () => {
    if (!userId || DAILY_USER_PROMPT_LIMIT <= 0) {
      setPromptsUsedToday(null);
      return;
    }
    const n = await fetchTodayUserPromptCount(userId);
    setPromptsUsedToday(n);
  }, [userId]);

  const createChatSession = async () => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        title: DEFAULT_CHAT_TITLE,
        subtitle: DEFAULT_CHAT_SUBTITLE,
      })
      .select('id,title,subtitle,pinned')
      .single();

    if (error) {
      console.error('Failed to create chat session:', error.message);
      return null;
    }
    return mapSessionToChat(data);
  };

  const saveMessage = async (sessionId, role, content) => {
    if (!userId || !sessionId) return;
    const str = content == null ? '' : String(content);
    if (!str.length) return;
    const { error } = await supabase.from('chat_messages').insert({
      session_id: sessionId,
      user_id: userId,
      role,
      content: str,
    });
    if (error) {
      console.error('Failed to save message:', error.message);
    }
  };

  const updateSessionTitleFromFirstPrompt = async (sessionId, promptText, promptedAt = new Date()) => {
    if (!userId || !sessionId) return;
    const { title } = titleFromFirstPrompt(promptText);
    const subtitle = formatChatListSubtitle(promptedAt);
    const { error } = await supabase
      .from('chat_sessions')
      .update({ title, subtitle })
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to update chat title:', error.message);
      return;
    }
    setChats((prev) =>
      prev.map((c) => (c.id === sessionId ? { ...c, title, subtitle } : c)),
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, activeChatId, isTyping]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) {
        setChats([]);
        setChatMessages({});
        setActiveChatId('');
        return;
      }

      const { data: sessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('id,title,subtitle,pinned,updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (sessionsError) {
        console.error('Failed to load chat sessions:', sessionsError.message);
        return;
      }

      let mappedChats = (sessions || []).map(mapSessionToChat);
      if (mappedChats.length === 0) {
        const createdChat = await createChatSession();
        if (!createdChat) return;
        mappedChats = [createdChat];
      }

      const sessionIds = mappedChats.map((chat) => chat.id);
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('id,session_id,role,content,created_at')
        .in('session_id', sessionIds)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Failed to load chat messages:', messagesError.message);
        return;
      }

      const groupedMessages = {};
      for (const chat of mappedChats) {
        groupedMessages[chat.id] = [];
      }
      for (const msg of messages || []) {
        groupedMessages[msg.session_id] = groupedMessages[msg.session_id] || [];
        groupedMessages[msg.session_id].push({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: formatTimestamp(msg.created_at),
        });
      }

      setChats(mappedChats);
      setChatMessages(groupedMessages);
      setActiveChatId(mappedChats[0]?.id || '');
    };

    loadHistory();
  }, [userId]);

  useEffect(() => {
    refreshPromptUsage();
  }, [refreshPromptUsage]);

  useEffect(() => {
    setPromptLimitBannerDismissed(false);
  }, [userId]);

  useEffect(() => {
    if (!attachMenuOpen) return;
    const onPointerDown = (e) => {
      if (attachMenuWrapRef.current && !attachMenuWrapRef.current.contains(e.target)) {
        setAttachMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setAttachMenuOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [attachMenuOpen]);

  const promptsRemaining =
    DAILY_USER_PROMPT_LIMIT > 0 && promptsUsedToday !== null
      ? Math.max(0, DAILY_USER_PROMPT_LIMIT - promptsUsedToday)
      : null;
  const isDailyLimitReached =
    DAILY_USER_PROMPT_LIMIT > 0 &&
    promptsUsedToday !== null &&
    promptsUsedToday >= DAILY_USER_PROMPT_LIMIT;

  const showPromptLimitBanner =
    userId &&
    DAILY_USER_PROMPT_LIMIT > 0 &&
    (isDailyLimitReached || !promptLimitBannerDismissed);

  const handlePhotoSelected = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > MAX_IMAGE_BYTES) {
      window.alert('Please choose a photo under 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPendingImage({ dataUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    const imageDataUrl = pendingImage?.dataUrl ?? null;
    const hasImage = Boolean(imageDataUrl);

    if ((!trimmedMessage && !hasImage) || isTyping || !userId) return;

    if (DAILY_USER_PROMPT_LIMIT > 0 && !hasImage) {
      const used = await fetchTodayUserPromptCount(userId);
      if (used !== null && used >= DAILY_USER_PROMPT_LIMIT) {
        setPromptsUsedToday(used);
        return;
      }
    }

    let currentChatId = activeChatId;
    if (!currentChatId) {
      const createdChat = await createChatSession();
      if (!createdChat) {
        return;
      }
      setChats((prev) => [createdChat, ...prev]);
      setChatMessages((prev) => ({ ...prev, [createdChat.id]: [] }));
      setActiveChatId(createdChat.id);
      currentChatId = createdChat.id;
    }

    const serializedContent = serializeUserMessageContent(trimmedMessage, imageDataUrl);
    const titleSeed = trimmedMessage || (imageDataUrl ? 'Photo' : '');
    const isFirstMessageInSession = (chatMessages[currentChatId] || []).length === 0;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: serializedContent,
      timestamp: formatTimestamp(),
    };

    setChatMessages((prev) => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), userMessage],
    }));
    setMessage('');
    setPendingImage(null);
    setIsTyping(true);
    await saveMessage(currentChatId, 'user', serializedContent);
    if (!hasImage) {
      await refreshPromptUsage();
    }
    if (isFirstMessageInSession) {
      const promptedAt = new Date();
      updateSessionTitleFromFirstPrompt(currentChatId, titleSeed, promptedAt);
    }

    if (hasImage) {
      const stubText = IMAGE_RECOGNITION_UNAVAILABLE_MSG;
      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: stubText,
        timestamp: formatTimestamp(),
      };
      setChatMessages((prev) => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), botMessage],
      }));
      await saveMessage(currentChatId, 'bot', stubText);
      setIsTyping(false);
      return;
    }

    const imagePayload = imageDataUrl ? dataUrlToImagePayload(imageDataUrl) : null;
    try {
      const response = await requestChatReply(trimmedMessage, imagePayload);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response,
        timestamp: formatTimestamp(),
      };

      setChatMessages((prev) => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), botMessage],
      }));
      saveMessage(currentChatId, 'bot', response);
    } catch (error) {
      const fallbackText =
        typeof error?.message === 'string' && error.message.trim()
          ? error.message
          : FALLBACK_BOT_REPLY;
      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: fallbackText,
        timestamp: formatTimestamp(),
      };
      setChatMessages((prev) => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), botMessage],
      }));
      saveMessage(currentChatId, 'bot', fallbackText);
      console.error('Failed to get bot response');
    } finally {
      setIsTyping(false);
    }
  };

  const orderedChats = useMemo(() => {
    const pinned = chats.filter((c) => c.pinned);
    const unpinned = chats.filter((c) => !c.pinned);
    return [...pinned, ...unpinned];
  }, [chats]);

  const toggleVoiceInput = () => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      return;
    }
    if (voiceListening && speechRecRef.current) {
      try {
        speechRecRef.current.stop();
      } catch {
        /* ignore */
      }
      return;
    }
    const rec = new SpeechRecognition();
    speechRecRef.current = rec;
    rec.lang = typeof navigator !== 'undefined' ? navigator.language || 'en-US' : 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setVoiceListening(true);
    rec.onend = () => {
      setVoiceListening(false);
      speechRecRef.current = null;
    };
    rec.onerror = () => {
      setVoiceListening(false);
      speechRecRef.current = null;
    };
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript?.trim();
      if (text) {
        setMessage((prev) => (prev ? `${prev} ${text}` : text));
      }
    };
    try {
      rec.start();
    } catch {
      setVoiceListening(false);
      speechRecRef.current = null;
    }
  };

  useEffect(() => {
    document.body.classList.add('chat-view');
    document.body.dataset.chatTheme = theme;
    localStorage.setItem('chat-theme', theme);
    return () => {
      document.body.classList.remove('chat-view');
      delete document.body.dataset.chatTheme;
    };
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const onViewportChange = () => {
      if (mq.matches) {
        setSidebarOpen(false);
      }
    };
    mq.addEventListener('change', onViewportChange);
    return () => mq.removeEventListener('change', onViewportChange);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) {
      setSettingsMenuOpen(false);
      setChatMenuOpenId(null);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    if (!settingsMenuOpen) {
      return undefined;
    }
    const onPointerDown = (e) => {
      // Check if clicking inside the menu or on the button that opened it
      const isInsideMenu = e.target.closest('.chat-settings-menu');
      const isSettingsBtn = settingsMenuRef.current && settingsMenuRef.current.contains(e.target);
      
      if (!isInsideMenu && !isSettingsBtn) {
        setSettingsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [settingsMenuOpen]);

  useEffect(() => {
    if (!chatMenuOpenId) {
      return undefined;
    }
    const onPointerDown = (e) => {
      // Check if clicking inside the menu or on the button that opened it
      const isInsideMenu = chatMenuRef.current && chatMenuRef.current.contains(e.target);
      const isMoreBtn = e.target.closest('.chat-history__more');
      
      // If we're clicking outside the menu and NOT on a 'more' button, close it.
      // If we click a different 'more' button, the onClick handler of that button 
      // will handle closing the current one and opening the new one.
      if (!isInsideMenu && !isMoreBtn) {
        setChatMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [chatMenuOpenId]);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_QUERY);
    const lockScroll =
      logoutModalOpen ||
      Boolean(renameModal.id) ||
      Boolean(deleteChatId) ||
      (sidebarOpen && mq.matches);
    if (!lockScroll) {
      return undefined;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen, logoutModalOpen, renameModal.id, deleteChatId]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (logoutModalOpen) {
          setLogoutModalOpen(false);
        } else if (renameModal.id) {
          setRenameModal({ id: null, value: '' });
        } else if (deleteChatId) {
          setDeleteChatId(null);
        } else if (chatMenuOpenId) {
          setChatMenuOpenId(null);
        } else if (settingsMenuOpen) {
          setSettingsMenuOpen(false);
        } else {
          setSidebarOpen(false);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [logoutModalOpen, renameModal.id, deleteChatId, chatMenuOpenId, settingsMenuOpen]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const togglePinChat = async (id) => {
    const current = chats.find((c) => c.id === id);
    if (!current) return;

    const nextPinned = !current.pinned;
    const { error } = await supabase
      .from('chat_sessions')
      .update({ pinned: nextPinned })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to pin/unpin chat:', error.message);
      return;
    }

    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: nextPinned } : c)));
    setChatMenuOpenId(null);
  };

  const openRenameChat = (chat) => {
    setChatMenuOpenId(null);
    setRenameModal({ id: chat.id, value: chat.title });
  };

  const saveRenameChat = async () => {
    const { id, value } = renameModal;
    if (!id || !userId) {
      return;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    const { error } = await supabase
      .from('chat_sessions')
      .update({ title: trimmed })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to rename chat:', error.message);
      return;
    }

    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title: trimmed } : c)));
    setRenameModal({ id: null, value: '' });
  };

  const confirmDeleteChat = async () => {
    if (!deleteChatId || !userId) {
      return;
    }
    const removedId = deleteChatId;
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', removedId)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to delete chat:', error.message);
      return;
    }

    const next = chats.filter((c) => c.id !== removedId);
    setChats(next);
    setChatMessages((prev) => {
      const updated = { ...prev };
      delete updated[removedId];
      return updated;
    });
    if (activeChatId === removedId) {
      setActiveChatId(next[0]?.id ?? '');
    }
    setDeleteChatId(null);
    setChatMenuOpenId(null);
  };

  return (
    <div
      className={`chat-app${sidebarOpen ? ' chat-app--nav-open' : ''}`}
      data-theme={theme}
    >
      <div
        className="chat-backdrop"
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      />

      <aside className="chat-sidebar" aria-label="Sidebar">
        <div className="chat-sidebar__head">
          <div className="chat-sidebar__brand">
            <img src={elixLogo} alt="" className="chat-logo-img" width={56} height={56} />
            <span className="chat-sidebar__title">Elix AI</span>
          </div>
          <button
            type="button"
            className="chat-sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <IconClose />
          </button>
        </div>

        <button
          type="button"
          className="chat-btn-new"
          onClick={async () => {
            const newChat = await createChatSession();
            if (!newChat) {
              return;
            }
            setChats((prev) => [newChat, ...prev]);
            setChatMessages((prev) => ({ ...prev, [newChat.id]: [] }));
            setActiveChatId(newChat.id);
            closeNavIfMobile(setSidebarOpen);
          }}
        >
          <IconPlus />
          New Chat
        </button>

        <nav className="chat-history" aria-label="Recent chats">
          <div className="chat-history__scroll">
            {orderedChats.map((chat) => (
              <div
                key={chat.id}
                data-chat-row={chat.id}
                className={`chat-history__row${chat.id === activeChatId ? ' chat-history__row--active' : ''}${
                  chatMenuOpenId === chat.id ? ' chat-history__row--menu-open' : ''
                }`}
              >
                <button
                  type="button"
                  className="chat-history__item"
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setChatMenuOpenId(null);
                    closeNavIfMobile(setSidebarOpen);
                  }}
                >
                  <IconChatBubble />
                  <span className="chat-history__text">
                    <span className="chat-history__title-row">
                      <span className="chat-history__title">{chat.title}</span>
                      {chat.pinned && <IconPin className="chat-history__pin-icon" />}
                    </span>
                    <span className="chat-history__subtitle">{chat.subtitle}</span>
                  </span>
                </button>
                <div className="chat-history__overflow">
                  <button
                    type="button"
                    className="chat-history__more"
                    aria-label={`More options for ${chat.title}`}
                    aria-expanded={chatMenuOpenId === chat.id}
                    aria-haspopup="menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const menuHeight = 160; // Estimated menu height
                      const menuWidth = 168; // Estimated menu width (10.5rem)
                      let top = rect.top;
                      let left = rect.right + 8;
                      let align = 'left'; // By default align to left of the menu (show on right of button)
                      
                      // If the menu would go off the bottom of the screen, position it higher
                      if (top + menuHeight > window.innerHeight) {
                        top = window.innerHeight - menuHeight - 16;
                      }

                      // On mobile, if the menu would go off the right side, align it to the right instead (show on left of button)
                      if (left + menuWidth > window.innerWidth) {
                        left = rect.left - menuWidth - 8;
                        align = 'right';
                        // If it's still off-screen on the left (very small screens), center it
                        if (left < 0) {
                          left = (window.innerWidth - menuWidth) / 2;
                          align = 'center';
                        }
                      }
                      
                      setChatMenuPosition({ top, left, align });
                      setChatMenuOpenId((id) => (id === chat.id ? null : chat.id));
                    }}
                  >
                    <IconMore />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </nav>

        {chatMenuOpenId && (
          <div
            ref={chatMenuRef}
            className="chat-history__menu"
            role="menu"
            style={{
              position: 'fixed',
              top: `${chatMenuPosition.top}px`,
              left: `${chatMenuPosition.left}px`,
              zIndex: 1000,
              transformOrigin: chatMenuPosition.align === 'right' ? 'top right' : 'top left',
            }}
          >
            <button
              type="button"
              className="chat-history__menu-item"
              role="menuitem"
              onClick={() => togglePinChat(chatMenuOpenId)}
            >
              <IconPin className="chat-history__menu-pin" />
              <span>{chats.find((c) => c.id === chatMenuOpenId)?.pinned ? 'Unpin chat' : 'Pin chat'}</span>
            </button>
            <button
              type="button"
              className="chat-history__menu-item"
              role="menuitem"
              onClick={() => {
                const chat = chats.find((c) => c.id === chatMenuOpenId);
                if (chat) {
                  openRenameChat(chat);
                }
              }}
            >
              <IconPencil />
              <span>Rename</span>
            </button>
            <button
              type="button"
              className="chat-history__menu-item chat-history__menu-item--danger"
              role="menuitem"
              onClick={() => {
                setDeleteChatId(chatMenuOpenId);
                setChatMenuOpenId(null);
              }}
            >
              <IconTrash />
              <span>Delete</span>
            </button>
          </div>
        )}

        <div className="chat-sidebar__footer">
          <div className="chat-user">
            <div className="chat-user__avatar" aria-hidden>
              {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="" className="chat-user__avatar-img" />
              ) : (
                <IconUser />
              )}
            </div>
            <span className="chat-user__label">
              {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User'}
            </span>
          </div>
          <div className="chat-sidebar__footer-actions" ref={settingsMenuRef}>
            <button
              type="button"
              className="chat-btn-icon chat-btn-icon--footer"
              aria-label="Settings"
              aria-expanded={settingsMenuOpen}
              aria-haspopup="menu"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const menuWidth = 168; // Estimated menu width (10.5rem)
                let left = rect.right + 8;
                let align = 'left';
                
                // If it goes off the right of the screen (on mobile)
                if (left + menuWidth > window.innerWidth) {
                  left = rect.left - menuWidth - 8;
                  align = 'right';
                  if (left < 0) {
                    left = (window.innerWidth - menuWidth) / 2;
                    align = 'center';
                  }
                }
                
                setSettingsMenuPosition({ top: rect.top, left, align });
                setSettingsMenuOpen((open) => !open);
              }}
            >
              <IconSettings />
            </button>
          </div>
        </div>
      </aside>

      {settingsMenuOpen && typeof onLogout === 'function' && (
        <div
          className="chat-settings-menu"
          role="menu"
          style={{
            position: 'fixed',
            top: `${settingsMenuPosition.top}px`,
            left: `${settingsMenuPosition.left}px`,
            zIndex: 1000,
            transform: 'translateY(-100%) translateY(32px)', // Align with button but show above
            transformOrigin: settingsMenuPosition.align === 'right' ? 'bottom right' : 'bottom left',
          }}
        >
          <button
            type="button"
            className="chat-settings-menu__item"
            role="menuitem"
            onClick={() => {
              setSettingsMenuOpen(false);
              setLogoutModalOpen(true);
            }}
          >
            <IconLogout />
            <span>Log out</span>
          </button>
        </div>
      )}

      <main className="chat-main">
        <header className="chat-header">
          <div className="chat-header__left">
            <button
              type="button"
              className="chat-btn-icon chat-btn-icon--menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              aria-expanded={sidebarOpen}
            >
              <IconMenu />
            </button>
            <h1 className="chat-header__title">
              Hello, welcome, {displayNameForGreeting(user)}
            </h1>
          </div>
          <button
            type="button"
            className="chat-btn-icon chat-btn-icon--theme"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <IconMoon /> : <IconSun />}
          </button>
        </header>

        <div className="chat-messages">
          {(chatMessages[activeChatId] || []).length === 0 ? (
            <div className="chat-empty">
              <p className="chat-empty__title">No messages yet</p>
              <p className="chat-empty__hint">Ask anything below to start the conversation.</p>
            </div>
          ) : (
            <div className="chat-messages__list">
              {chatMessages[activeChatId].map((msg) => (
                <div key={msg.id} className={`chat-message chat-message--${msg.role}`}>
                  <div className="chat-message__avatar">
                    {msg.role === 'user' ? (
                      user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                        <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="" />
                      ) : (
                        <IconUser />
                      )
                    ) : (
                      <img src={elixLogoChat} alt="" />
                    )}
                  </div>
                  <div className="chat-message__content">
                    <div className="chat-message__bubble">
                      {msg.role === 'user' ? (
                        <UserMessageBubble content={msg.content} />
                      ) : (
                        <BotMessageBubble content={msg.content} />
                      )}
                    </div>
                    <span className="chat-message__time">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-message chat-message--bot">
                  <div className="chat-message__avatar">
                    <img src={elixLogoChat} alt="" />
                  </div>
                  <div className="chat-message__content">
                    <div className="chat-message__bubble chat-message__bubble--typing">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <footer className="chat-input-bar">
          <div className="chat-input-dock">
            {showPromptLimitBanner && (
              <div
                className={`chat-prompt-strip${isDailyLimitReached ? ' chat-prompt-strip--at-limit' : ''}`}
                role="status"
                aria-live="polite"
              >
                <div className="chat-prompt-strip__text">
                  {promptsUsedToday === null ? (
                    <span className="chat-prompt-strip__lead">Checking free plan usage…</span>
                  ) : isDailyLimitReached ? (
                    <>
                      <span className="chat-prompt-strip__lead">
                        Daily message limit reached ({DAILY_USER_PROMPT_LIMIT} per day). Resets at midnight.
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="chat-prompt-strip__lead">
                        Free plan · <strong>{promptsRemaining}</strong>{' '}
                        {promptsRemaining === 1 ? 'prompt' : 'prompts'} left today
                      </span>
                    </>
                  )}
                </div>
                {!isDailyLimitReached && (
                  <div className="chat-prompt-strip__actions">
                    <button type="button" className="chat-prompt-strip__upgrade">
                      Upgrade
                    </button>
                    <button
                      type="button"
                      className="chat-prompt-strip__dismiss"
                      aria-label="Dismiss"
                      onClick={() => setPromptLimitBannerDismissed(true)}
                    >
                      <IconClose />
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="chat-input-dock__white">
              <input
                ref={photoInputRef}
                type="file"
                className="chat-photo-input"
                accept={PHOTO_ACCEPT}
                aria-hidden
                tabIndex={-1}
                onChange={handlePhotoSelected}
              />
              {pendingImage ? (
                <div className="chat-pending-photo">
                  <img src={pendingImage.dataUrl} alt="" className="chat-pending-photo__img" />
                  <button
                    type="button"
                    className="chat-pending-photo__remove"
                    aria-label="Remove photo"
                    onClick={() => setPendingImage(null)}
                  >
                    <IconClose />
                  </button>
                </div>
              ) : null}
              <div className="chat-input-wrap">
            <div className="chat-composer">
              <div className="chat-composer__attach" ref={attachMenuWrapRef}>
                <button
                  type="button"
                  className={`chat-composer__btn${attachMenuOpen ? ' chat-composer__btn--menu-open' : ''}`}
                  aria-label="Attach"
                  aria-expanded={attachMenuOpen}
                  aria-haspopup="menu"
                  id="chat-attach-menu-button"
                  disabled={isDailyLimitReached}
                  onClick={() => setAttachMenuOpen((open) => !open)}
                >
                  <IconPlus />
                </button>
                {attachMenuOpen ? (
                  <div
                    className="chat-attach-menu"
                    role="menu"
                    aria-labelledby="chat-attach-menu-button"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="chat-attach-menu__item"
                      onClick={() => {
                        setAttachMenuOpen(false);
                        photoInputRef.current?.click();
                      }}
                    >
                      <IconPaperclip />
                      <span>Add photos</span>
                    </button>
                  </div>
                ) : null}
              </div>
              <input
                type="text"
                className="chat-composer__input"
                placeholder={
                  isDailyLimitReached ? 'Daily limit reached — try again tomorrow' : 'Ask anything'
                }
                aria-label="Message"
                autoComplete="off"
                value={message}
                disabled={isDailyLimitReached}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              {message.trim() || pendingImage ? (
                <button
                  type="button"
                  className="chat-composer__btn"
                  aria-label="Clear message"
                  onClick={() => {
                    setMessage('');
                    setPendingImage(null);
                  }}
                >
                  <IconClose />
                </button>
              ) : null}
              <button
                type="button"
                className={`chat-composer__btn${voiceListening ? ' chat-composer__btn--listening' : ''}`}
                aria-label={voiceListening ? 'Stop voice input' : 'Voice input'}
                aria-pressed={voiceListening}
                onClick={toggleVoiceInput}
              >
                <IconMic />
              </button>
            </div>
            <button
              type="button"
              className="chat-btn-send"
              aria-label="Send message"
              disabled={(!message.trim() && !pendingImage) || isTyping || isDailyLimitReached}
              onClick={handleSendMessage}
            >
              <IconSend />
            </button>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {logoutModalOpen && (
        <div
          className="chat-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-confirm-title"
        >
          <button
            type="button"
            className="chat-modal-backdrop"
            aria-label="Close dialog"
            onClick={() => setLogoutModalOpen(false)}
          />
          <div className="chat-modal">
            <h2 id="logout-confirm-title" className="chat-modal__title">
              Log out
            </h2>
            <p className="chat-modal__message">Are you sure you want to logout?</p>
            <div className="chat-modal__actions">
              <button type="button" className="chat-modal__btn chat-modal__btn--secondary" onClick={() => setLogoutModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="chat-modal__btn chat-modal__btn--primary"
                onClick={() => {
                  setLogoutModalOpen(false);
                  if (typeof onLogout === 'function') {
                    onLogout();
                  }
                }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {renameModal.id && (
        <div
          className="chat-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rename-chat-title"
        >
          <button
            type="button"
            className="chat-modal-backdrop"
            aria-label="Close dialog"
            onClick={() => setRenameModal({ id: null, value: '' })}
          />
          <div className="chat-modal chat-modal--form">
            <h2 id="rename-chat-title" className="chat-modal__title">
              Rename chat
            </h2>
            <label className="chat-modal__label" htmlFor="rename-chat-input">
              Title
            </label>
            <input
              id="rename-chat-input"
              type="text"
              className="chat-modal__field"
              value={renameModal.value}
              onChange={(e) => setRenameModal((m) => ({ ...m, value: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveRenameChat();
                }
              }}
              autoComplete="off"
            />
            <div className="chat-modal__actions">
              <button
                type="button"
                className="chat-modal__btn chat-modal__btn--secondary"
                onClick={() => setRenameModal({ id: null, value: '' })}
              >
                Cancel
              </button>
              <button type="button" className="chat-modal__btn chat-modal__btn--primary" onClick={saveRenameChat}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteChatId && (
        <div
          className="chat-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-chat-title"
        >
          <button
            type="button"
            className="chat-modal-backdrop"
            aria-label="Close dialog"
            onClick={() => setDeleteChatId(null)}
          />
          <div className="chat-modal">
            <h2 id="delete-chat-title" className="chat-modal__title">
              Delete chat?
            </h2>
            <p className="chat-modal__message">This conversation will be removed.</p>
            <div className="chat-modal__actions">
              <button type="button" className="chat-modal__btn chat-modal__btn--secondary" onClick={() => setDeleteChatId(null)}>
                Cancel
              </button>
              <button type="button" className="chat-modal__btn chat-modal__btn--danger" onClick={confirmDeleteChat}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
