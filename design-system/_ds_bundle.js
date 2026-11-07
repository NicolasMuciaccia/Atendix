/* @ds-bundle: {"format":4,"namespace":"AtendixDesignSystem_94ef37","components":[{"name":"Composer","sourcePath":"components/conversation/Composer.jsx"},{"name":"Message","sourcePath":"components/conversation/Message.jsx"},{"name":"SuggestedReplies","sourcePath":"components/conversation/SuggestedReplies.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"STATUS_TONE","sourcePath":"components/core/StatusPill.jsx"},{"name":"StatusPill","sourcePath":"components/core/StatusPill.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"TextLink","sourcePath":"components/core/TextLink.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"BottomNav","sourcePath":"components/navigation/BottomNav.jsx"},{"name":"NavItem","sourcePath":"components/navigation/NavItem.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"CustomerSummary","sourcePath":"components/tickets/CustomerSummary.jsx"},{"name":"DetailRow","sourcePath":"components/tickets/DetailRow.jsx"},{"name":"KpiCard","sourcePath":"components/tickets/KpiCard.jsx"},{"name":"PanelSection","sourcePath":"components/tickets/PanelSection.jsx"},{"name":"RelatedTicket","sourcePath":"components/tickets/RelatedTicket.jsx"},{"name":"TicketRow","sourcePath":"components/tickets/TicketRow.jsx"}],"sourceHashes":{"components/conversation/Composer.jsx":"b5e456cb3b0e","components/conversation/Message.jsx":"0d82b09893fe","components/conversation/SuggestedReplies.jsx":"b81f34d9263d","components/core/Avatar.jsx":"535c7c381383","components/core/Badge.jsx":"b718e19bea97","components/core/Button.jsx":"cbfc24ca2b55","components/core/Card.jsx":"c7033f762da0","components/core/Icon.jsx":"1d157b1837f4","components/core/IconButton.jsx":"2d3993b2d235","components/core/StatusPill.jsx":"88246a487d12","components/core/Tag.jsx":"7c741f40ee9b","components/core/TextLink.jsx":"aeef94900578","components/forms/Checkbox.jsx":"f7e85b49a565","components/forms/Input.jsx":"3f5194a7f78b","components/forms/Select.jsx":"a93cc38d99e9","components/navigation/BottomNav.jsx":"1e121427c275","components/navigation/NavItem.jsx":"d053c285553d","components/navigation/Sidebar.jsx":"786ebbdea2d6","components/navigation/Tabs.jsx":"ef05cd343875","components/tickets/CustomerSummary.jsx":"0dc0f5e50801","components/tickets/DetailRow.jsx":"65c071a49b62","components/tickets/KpiCard.jsx":"4c1e5c097890","components/tickets/PanelSection.jsx":"b012f1263f34","components/tickets/RelatedTicket.jsx":"b6c01eef040f","components/tickets/TicketRow.jsx":"e91bebd410c3","ui_kits/helpdesk/App.jsx":"e23d4e7d6ca6","ui_kits/helpdesk/ContextPanel.jsx":"6f493060000c","ui_kits/helpdesk/ConversationPane.jsx":"908e3e7d256f","ui_kits/helpdesk/InboxHeader.jsx":"fdcac7643738","ui_kits/helpdesk/MobileScreens.jsx":"2b894b855ff3","ui_kits/helpdesk/TicketList.jsx":"cf3fa3fca6d5","ui_kits/helpdesk/data.js":"73235941ce48","ui_kits/helpdesk/helpers.js":"fa603606027b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AtendixDesignSystem_94ef37 = window.AtendixDesignSystem_94ef37 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
const TONES = [{
  bg: 'var(--blue-100)',
  fg: 'var(--blue-700)'
}, {
  bg: 'var(--violet-100)',
  fg: 'var(--violet-600)'
}, {
  bg: 'var(--green-100)',
  fg: 'var(--green-600)'
}, {
  bg: 'var(--amber-100)',
  fg: 'var(--amber-600)'
}, {
  bg: 'var(--ink-150)',
  fg: 'var(--ink-700)'
}];
const STATUS = {
  online: 'var(--green-500)',
  away: 'var(--amber-500)',
  busy: 'var(--red-500)',
  offline: 'var(--ink-300)'
};
function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function hash(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = h * 31 + str.charCodeAt(i) | 0;
  return Math.abs(h);
}
function Avatar({
  name = '',
  src,
  size = 36,
  status,
  ringColor = 'var(--white)',
  tone,
  style
}) {
  const t = TONES[tone != null ? tone % TONES.length : hash(name) % TONES.length];
  const dot = Math.max(8, Math.round(size * 0.26));
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      width: size,
      height: size,
      flexShrink: 0,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    "aria-label": name,
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: t.bg,
      color: t.fg,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: Math.round(size * 0.36),
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: '0.01em'
    }
  }, initialsOf(name)), status ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -1,
      bottom: -1,
      width: dot,
      height: dot,
      borderRadius: '50%',
      background: STATUS[status] || STATUS.offline,
      boxShadow: '0 0 0 2px ' + ringColor
    }
  }) : null);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: 'var(--ink-100)',
    fg: 'var(--ink-600)'
  },
  accent: {
    bg: 'var(--blue-100)',
    fg: 'var(--blue-600)'
  },
  solid: {
    bg: 'var(--blue-500)',
    fg: 'var(--white)'
  },
  nav: {
    bg: 'var(--nav-badge-bg)',
    fg: 'var(--navy-300)'
  },
  navActive: {
    bg: 'var(--white)',
    fg: 'var(--navy-900)'
  },
  danger: {
    bg: 'var(--red-500)',
    fg: 'var(--white)'
  }
};
function Badge({
  children,
  tone = 'neutral',
  size = 'md',
  ring,
  style
}) {
  const t = TONES[tone] || TONES.neutral;
  const h = size === 'sm' ? 16 : 18;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: h,
      height: h,
      padding: '0 6px',
      borderRadius: 'var(--radius-full)',
      background: t.bg,
      color: t.fg,
      fontFamily: 'var(--font-sans)',
      fontSize: size === 'sm' ? 'var(--text-2xs)' : 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1,
      boxShadow: ring ? '0 0 0 2px ' + ring : 'none',
      flexShrink: 0,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  default: {
    bg: 'var(--surface-card)',
    border: 'var(--border-subtle)',
    fg: 'inherit'
  },
  subtle: {
    bg: 'var(--bg-subtle)',
    border: 'var(--blue-100)',
    fg: 'inherit'
  },
  muted: {
    bg: 'var(--surface-muted)',
    border: 'var(--border-subtle)',
    fg: 'inherit'
  },
  inverse: {
    bg: 'var(--surface-inverse)',
    border: 'transparent',
    fg: 'var(--text-inverse)'
  }
};
const PAD = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32
};
const RADIUS = {
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)'
};
const ELEV = {
  none: 'none',
  xs: 'var(--shadow-xs)',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)'
};
function Card({
  tone = 'default',
  padding = 'md',
  radius = 'lg',
  elevation = 'sm',
  interactive = false,
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const t = TONES[tone] || TONES.default;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: interactive ? () => setHover(true) : undefined,
    onMouseLeave: interactive ? () => setHover(false) : undefined,
    style: {
      background: t.bg,
      color: t.fg,
      border: '1px solid ' + t.border,
      borderRadius: RADIUS[radius] || radius,
      padding: typeof padding === 'number' ? padding : PAD[padding],
      boxShadow: interactive && hover ? 'var(--shadow-md)' : ELEV[elevation],
      transform: interactive && hover ? 'translateY(-1px)' : 'none',
      transition: 'box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
      cursor: interactive ? 'pointer' : undefined,
      minWidth: 0,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
// Lucide icons (ISC) — copied from lucide-static@0.460.0. Source SVGs live in assets/icons/.
const ICONS = {
  "archive": "<rect width=\"20\" height=\"5\" x=\"2\" y=\"3\" rx=\"1\" /><path d=\"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8\" /><path d=\"M10 12h4\" />",
  "arrow-down": "<path d=\"M12 5v14\" /><path d=\"m19 12-7 7-7-7\" />",
  "arrow-left": "<path d=\"m12 19-7-7 7-7\" /><path d=\"M19 12H5\" />",
  "arrow-right": "<path d=\"M5 12h14\" /><path d=\"m12 5 7 7-7 7\" />",
  "arrow-up": "<path d=\"m5 12 7-7 7 7\" /><path d=\"M12 19V5\" />",
  "at-sign": "<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8\" />",
  "battery-full": "<rect width=\"16\" height=\"10\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\" /><line x1=\"22\" x2=\"22\" y1=\"11\" y2=\"13\" /><line x1=\"6\" x2=\"6\" y1=\"11\" y2=\"13\" /><line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"13\" /><line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"13\" />",
  "bell": "<path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\" /><path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\" />",
  "bold": "<path d=\"M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8\" />",
  "bookmark": "<path d=\"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z\" />",
  "building-2": "<path d=\"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z\" /><path d=\"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2\" /><path d=\"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2\" /><path d=\"M10 6h4\" /><path d=\"M10 10h4\" /><path d=\"M10 14h4\" /><path d=\"M10 18h4\" />",
  "calendar": "<path d=\"M8 2v4\" /><path d=\"M16 2v4\" /><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /><path d=\"M3 10h18\" />",
  "calendar-days": "<path d=\"M8 2v4\" /><path d=\"M16 2v4\" /><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /><path d=\"M3 10h18\" /><path d=\"M8 14h.01\" /><path d=\"M12 14h.01\" /><path d=\"M16 14h.01\" /><path d=\"M8 18h.01\" /><path d=\"M12 18h.01\" /><path d=\"M16 18h.01\" />",
  "chart-column": "<path d=\"M3 3v16a2 2 0 0 0 2 2h16\" /><path d=\"M18 17V9\" /><path d=\"M13 17V5\" /><path d=\"M8 17v-3\" />",
  "chart-no-axes-column": "<line x1=\"18\" x2=\"18\" y1=\"20\" y2=\"10\" /><line x1=\"12\" x2=\"12\" y1=\"20\" y2=\"4\" /><line x1=\"6\" x2=\"6\" y1=\"20\" y2=\"14\" />",
  "check": "<path d=\"M20 6 9 17l-5-5\" />",
  "check-check": "<path d=\"M18 6 7 17l-5-5\" /><path d=\"m22 10-7.5 7.5L13 16\" />",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\" />",
  "chevron-left": "<path d=\"m15 18-6-6 6-6\" />",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\" />",
  "chevron-up": "<path d=\"m18 15-6-6-6 6\" />",
  "circle-alert": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\" /><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\" />",
  "circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m9 12 2 2 4-4\" />",
  "circle-dot": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><circle cx=\"12\" cy=\"12\" r=\"1\" />",
  "circle-help": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\" /><path d=\"M12 17h.01\" />",
  "circle-user": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><circle cx=\"12\" cy=\"10\" r=\"3\" /><path d=\"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662\" />",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><polyline points=\"12 6 12 12 16 14\" />",
  "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />",
  "credit-card": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\" /><line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\" />",
  "ellipsis": "<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"19\" cy=\"12\" r=\"1\" /><circle cx=\"5\" cy=\"12\" r=\"1\" />",
  "external-link": "<path d=\"M15 3h6v6\" /><path d=\"M10 14 21 3\" /><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\" />",
  "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\" /><path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /><path d=\"M10 9H8\" /><path d=\"M16 13H8\" /><path d=\"M16 17H8\" />",
  "filter": "<polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\" />",
  "flag": "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\" /><line x1=\"4\" x2=\"4\" y1=\"22\" y2=\"15\" />",
  "folder": "<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\" />",
  "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /><path d=\"M2 12h20\" />",
  "hash": "<line x1=\"4\" x2=\"20\" y1=\"9\" y2=\"9\" /><line x1=\"4\" x2=\"20\" y1=\"15\" y2=\"15\" /><line x1=\"10\" x2=\"8\" y1=\"3\" y2=\"21\" /><line x1=\"16\" x2=\"14\" y1=\"3\" y2=\"21\" />",
  "headset": "<path d=\"M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z\" /><path d=\"M21 16v2a4 4 0 0 1-4 4h-5\" />",
  "history": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\" /><path d=\"M3 3v5h5\" /><path d=\"M12 7v5l4 2\" />",
  "image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" /><circle cx=\"9\" cy=\"9\" r=\"2\" /><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />",
  "inbox": "<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\" /><path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\" />",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 16v-4\" /><path d=\"M12 8h.01\" />",
  "italic": "<line x1=\"19\" x2=\"10\" y1=\"4\" y2=\"4\" /><line x1=\"14\" x2=\"5\" y1=\"20\" y2=\"20\" /><line x1=\"15\" x2=\"9\" y1=\"4\" y2=\"20\" />",
  "layers": "<path d=\"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z\" /><path d=\"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65\" /><path d=\"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65\" />",
  "layout-dashboard": "<rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1\" /><rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\" />",
  "link": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" /><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />",
  "list-filter": "<path d=\"M3 6h18\" /><path d=\"M7 12h10\" /><path d=\"M10 18h4\" />",
  "loader": "<path d=\"M12 2v4\" /><path d=\"m16.2 7.8 2.9-2.9\" /><path d=\"M18 12h4\" /><path d=\"m16.2 16.2 2.9 2.9\" /><path d=\"M12 18v4\" /><path d=\"m4.9 19.1 2.9-2.9\" /><path d=\"M2 12h4\" /><path d=\"m4.9 4.9 2.9 2.9\" />",
  "lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />",
  "log-out": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" /><polyline points=\"16 17 21 12 16 7\" /><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\" />",
  "mail": "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\" /><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\" />",
  "map-pin": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /><circle cx=\"12\" cy=\"10\" r=\"3\" />",
  "menu": "<line x1=\"4\" x2=\"20\" y1=\"12\" y2=\"12\" /><line x1=\"4\" x2=\"20\" y1=\"6\" y2=\"6\" /><line x1=\"4\" x2=\"20\" y1=\"18\" y2=\"18\" />",
  "message-square": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\" />",
  "mic": "<path d=\"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z\" /><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\" /><line x1=\"12\" x2=\"12\" y1=\"19\" y2=\"22\" />",
  "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\" />",
  "paperclip": "<path d=\"m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48\" />",
  "pen-line": "<path d=\"M12 20h9\" /><path d=\"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z\" />",
  "phone": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" />",
  "plus": "<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />",
  "refresh-cw": "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\" /><path d=\"M21 3v5h-5\" /><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\" /><path d=\"M8 16H3v5\" />",
  "reply": "<polyline points=\"9 17 4 12 9 7\" /><path d=\"M20 18v-2a4 4 0 0 0-4-4H4\" />",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\" /><path d=\"m21 21-4.3-4.3\" />",
  "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" /><path d=\"m21.854 2.147-10.94 10.939\" />",
  "settings": "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /><path d=\"m9 12 2 2 4-4\" />",
  "signal": "<path d=\"M2 20h.01\" /><path d=\"M7 20v-4\" /><path d=\"M12 20v-8\" /><path d=\"M17 20V8\" /><path d=\"M22 4v16\" />",
  "sliders-horizontal": "<line x1=\"21\" x2=\"14\" y1=\"4\" y2=\"4\" /><line x1=\"10\" x2=\"3\" y1=\"4\" y2=\"4\" /><line x1=\"21\" x2=\"12\" y1=\"12\" y2=\"12\" /><line x1=\"8\" x2=\"3\" y1=\"12\" y2=\"12\" /><line x1=\"21\" x2=\"16\" y1=\"20\" y2=\"20\" /><line x1=\"12\" x2=\"3\" y1=\"20\" y2=\"20\" /><line x1=\"14\" x2=\"14\" y1=\"2\" y2=\"6\" /><line x1=\"8\" x2=\"8\" y1=\"10\" y2=\"14\" /><line x1=\"16\" x2=\"16\" y1=\"18\" y2=\"22\" />",
  "smile": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M8 14s1.5 2 4 2 4-2 4-2\" /><line x1=\"9\" x2=\"9.01\" y1=\"9\" y2=\"9\" /><line x1=\"15\" x2=\"15.01\" y1=\"9\" y2=\"9\" />",
  "sparkles": "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\" /><path d=\"M20 3v4\" /><path d=\"M22 5h-4\" /><path d=\"M4 17v2\" /><path d=\"M5 18H3\" />",
  "square-pen": "<path d=\"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\" /><path d=\"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z\" />",
  "star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2\" /><path d=\"M12 20v2\" /><path d=\"m4.93 4.93 1.41 1.41\" /><path d=\"m17.66 17.66 1.41 1.41\" /><path d=\"M2 12h2\" /><path d=\"M20 12h2\" /><path d=\"m6.34 17.66-1.41 1.41\" /><path d=\"m19.07 4.93-1.41 1.41\" />",
  "tag": "<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\" /><circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />",
  "ticket": "<path d=\"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\" /><path d=\"M13 5v2\" /><path d=\"M13 17v2\" /><path d=\"M13 11v2\" />",
  "trash-2": "<path d=\"M3 6h18\" /><path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\" /><path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\" /><line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\" /><line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\" />",
  "trending-down": "<polyline points=\"22 17 13.5 8.5 8.5 13.5 2 7\" /><polyline points=\"16 17 22 17 22 11\" />",
  "trending-up": "<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\" /><polyline points=\"16 7 22 7 22 13\" />",
  "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /><path d=\"M12 9v4\" /><path d=\"M12 17h.01\" />",
  "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /><circle cx=\"12\" cy=\"7\" r=\"4\" />",
  "user-plus": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /><circle cx=\"9\" cy=\"7\" r=\"4\" /><line x1=\"19\" x2=\"19\" y1=\"8\" y2=\"14\" /><line x1=\"22\" x2=\"16\" y1=\"11\" y2=\"11\" />",
  "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /><circle cx=\"9\" cy=\"7\" r=\"4\" /><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /><path d=\"M16 3.13a4 4 0 0 1 0 7.75\" />",
  "wifi": "<path d=\"M12 20h.01\" /><path d=\"M2 8.82a15 15 0 0 1 20 0\" /><path d=\"M5 12.859a10 10 0 0 1 14 0\" /><path d=\"M8.5 16.429a5 5 0 0 1 7 0\" />",
  "x": "<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />",
  "zap": "<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\" />"
};
function Icon({
  name,
  size = 16,
  strokeWidth = 1.75,
  color = 'currentColor',
  title,
  style,
  className
}) {
  const body = ICONS[name];
  if (!body) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: title ? 'img' : undefined,
    "aria-hidden": title ? undefined : true,
    className: className,
    style: {
      display: 'block',
      flexShrink: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: (title ? '<title>' + title + '</title>' : '') + body
    }
  });
}
Icon.names = Object.keys(ICONS);
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/conversation/Message.jsx
try { (() => {
const ROLES = {
  customer: {
    bg: 'var(--surface-message)',
    border: 'transparent'
  },
  agent: {
    bg: 'var(--surface-message-agent)',
    border: 'transparent'
  },
  note: {
    bg: 'var(--attention-bg)',
    border: 'var(--amber-100)'
  }
};
function Message({
  author,
  avatarSrc,
  time,
  role = 'customer',
  noteLabel = 'Nota interna',
  children,
  style
}) {
  const r = ROLES[role] || ROLES.customer;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: author,
    src: avatarSrc,
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: '12px 16px 14px',
      background: r.bg,
      border: '1px solid ' + r.border,
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, author), time ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-subtle)'
    }
  }, time) : null, role === 'note' ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--attention-text)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "lock",
    size: 11,
    strokeWidth: 2
  }), noteLabel) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--ink-700)',
      textWrap: 'pretty'
    }
  }, children)));
}
Object.assign(__ds_scope, { Message });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/conversation/Message.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: 'var(--control-sm)',
    padding: '0 10px',
    fontSize: 'var(--text-sm)',
    gap: 6,
    radius: 'var(--radius-sm)',
    icon: 14
  },
  md: {
    height: 'var(--control-md)',
    padding: '0 14px',
    fontSize: 'var(--text-base)',
    gap: 8,
    radius: 'var(--radius-md)',
    icon: 15
  },
  lg: {
    height: 'var(--control-lg)',
    padding: '0 18px',
    fontSize: 'var(--text-md)',
    gap: 8,
    radius: 'var(--radius-md)',
    icon: 17
  }
};
const VARIANTS = {
  primary: {
    bg: 'var(--action-primary)',
    hover: 'var(--action-primary-hover)',
    press: 'var(--action-primary-press)',
    fg: 'var(--white)',
    border: 'transparent',
    shadow: 'var(--shadow-xs)'
  },
  accent: {
    bg: 'var(--action-accent)',
    hover: 'var(--action-accent-hover)',
    press: 'var(--action-accent-press)',
    fg: 'var(--white)',
    border: 'transparent',
    shadow: 'var(--shadow-xs)'
  },
  secondary: {
    bg: 'var(--white)',
    hover: 'var(--surface-hover)',
    press: 'var(--ink-100)',
    fg: 'var(--ink-800)',
    border: 'var(--border-default)',
    shadow: 'var(--shadow-xs)'
  },
  ghost: {
    bg: 'transparent',
    hover: 'var(--surface-hover)',
    press: 'var(--ink-100)',
    fg: 'var(--ink-700)',
    border: 'transparent',
    shadow: 'none'
  },
  danger: {
    bg: 'var(--danger-bg)',
    hover: 'var(--red-100)',
    press: 'var(--red-100)',
    fg: 'var(--danger-text)',
    border: 'transparent',
    shadow: 'none'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const bg = disabled ? v.bg : press ? v.press : hover ? v.hover : v.bg;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      borderRadius: s.radius,
      border: '1px solid ' + v.border,
      background: bg,
      color: v.fg,
      boxShadow: v.shadow,
      fontFamily: 'var(--font-sans)',
      fontSize: s.fontSize,
      fontWeight: 'var(--weight-semibold)',
      lineHeight: 1,
      letterSpacing: '-0.005em',
      whiteSpace: 'nowrap',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transform: press && !disabled ? 'scale(0.98)' : 'none',
      transition: 'background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)',
      ...style
    }
  }, rest), iconLeft ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.icon,
    strokeWidth: 2
  }) : null, children, iconRight ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon,
    strokeWidth: 2
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/conversation/SuggestedReplies.jsx
try { (() => {
function SuggestedReplies({
  label = 'Respostas sugeridas',
  items = [],
  onPick,
  style
}) {
  if (!items.length) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, items.map(it => /*#__PURE__*/React.createElement(__ds_scope.Button, {
    key: it,
    variant: "secondary",
    size: "sm",
    onClick: () => onPick && onPick(it),
    style: {
      fontWeight: 'var(--weight-medium)'
    }
  }, it))));
}
Object.assign(__ds_scope, { SuggestedReplies });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/conversation/SuggestedReplies.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    box: 26,
    icon: 14,
    radius: 'var(--radius-sm)'
  },
  md: {
    box: 32,
    icon: 16,
    radius: 'var(--radius-md)'
  },
  lg: {
    box: 40,
    icon: 20,
    radius: 'var(--radius-md)'
  }
};
const VARIANTS = {
  ghost: {
    bg: 'transparent',
    hover: 'var(--surface-hover)',
    fg: 'var(--ink-600)',
    border: 'transparent'
  },
  outline: {
    bg: 'var(--white)',
    hover: 'var(--surface-hover)',
    fg: 'var(--ink-700)',
    border: 'var(--border-default)'
  },
  solid: {
    bg: 'var(--action-primary)',
    hover: 'var(--action-primary-hover)',
    fg: 'var(--white)',
    border: 'transparent'
  },
  inverse: {
    bg: 'transparent',
    hover: 'var(--nav-item-hover)',
    fg: 'var(--nav-text-muted)',
    border: 'transparent'
  }
};
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  round = false,
  active = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: s.box,
      height: s.box,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      borderRadius: round ? 'var(--radius-full)' : s.radius,
      border: '1px solid ' + v.border,
      background: (hover || active) && !disabled ? v.hover : v.bg,
      color: active && variant !== 'solid' ? 'var(--text-accent)' : v.fg,
      boxShadow: variant === 'outline' ? 'var(--shadow-xs)' : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--duration-fast) var(--ease-standard)',
      flexShrink: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusPill.jsx
try { (() => {
const TONES = {
  danger: {
    bg: 'var(--danger-bg)',
    fg: 'var(--danger-text)',
    dot: 'var(--danger)'
  },
  attention: {
    bg: 'var(--attention-bg)',
    fg: 'var(--attention-text)',
    dot: 'var(--attention)'
  },
  positive: {
    bg: 'var(--positive-bg)',
    fg: 'var(--positive-text)',
    dot: 'var(--positive)'
  },
  info: {
    bg: 'var(--info-bg)',
    fg: 'var(--info-text)',
    dot: 'var(--info)'
  },
  neutral: {
    bg: 'var(--ink-100)',
    fg: 'var(--ink-600)',
    dot: 'var(--ink-400)'
  }
};
const STATUS_TONE = {
  open: 'danger',
  pending: 'attention',
  solved: 'positive',
  closed: 'neutral',
  new: 'info'
};
function StatusPill({
  children,
  tone = 'neutral',
  dot = false,
  icon,
  plain = false,
  style
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 20,
      padding: plain ? 0 : '0 8px',
      borderRadius: 'var(--radius-xs)',
      background: plain ? 'transparent' : t.bg,
      color: plain ? 'var(--ink-800)' : t.fg,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: t.dot,
      flexShrink: 0
    }
  }) : null, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12,
    strokeWidth: 2
  }) : null, children);
}
Object.assign(__ds_scope, { STATUS_TONE, StatusPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusPill.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
const TONES = {
  high: {
    bg: 'var(--priority-high-bg)',
    fg: 'var(--priority-high-text)'
  },
  medium: {
    bg: 'var(--priority-medium-bg)',
    fg: 'var(--priority-medium-text)'
  },
  low: {
    bg: 'var(--priority-low-bg)',
    fg: 'var(--priority-low-text)'
  },
  neutral: {
    bg: 'var(--tag-neutral-bg)',
    fg: 'var(--tag-neutral-text)'
  },
  violet: {
    bg: 'var(--tag-violet-bg)',
    fg: 'var(--tag-violet-text)'
  },
  blue: {
    bg: 'var(--tag-blue-bg)',
    fg: 'var(--tag-blue-text)'
  }
};
function Tag({
  children,
  tone = 'neutral',
  size = 'sm',
  icon,
  onClick,
  onRemove,
  style
}) {
  const t = TONES[tone] || TONES.neutral;
  const md = size === 'md';
  const Comp = onClick ? 'button' : 'span';
  return /*#__PURE__*/React.createElement(Comp, {
    type: onClick ? 'button' : undefined,
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: md ? 24 : 20,
      padding: md ? '0 9px' : '0 7px',
      borderRadius: 'var(--radius-xs)',
      border: 0,
      background: t.bg,
      color: t.fg,
      fontFamily: 'var(--font-sans)',
      fontSize: md ? 'var(--text-sm)' : 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: md ? 12 : 11,
    strokeWidth: 2
  }) : null, children, onRemove ? /*#__PURE__*/React.createElement("span", {
    role: "button",
    "aria-label": "Remover",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: 'inline-flex',
      marginRight: -2,
      cursor: 'pointer',
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: md ? 12 : 11,
    strokeWidth: 2
  })) : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/TextLink.jsx
try { (() => {
function TextLink({
  href,
  onClick,
  children,
  arrow = false,
  size = 'sm',
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href || '#',
    onClick: e => {
      if (!href) e.preventDefault();
      onClick && onClick(e);
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      color: hover ? 'var(--text-link-hover)' : 'var(--text-link)',
      fontFamily: 'var(--font-sans)',
      fontSize: size === 'md' ? 'var(--text-base)' : 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      textDecoration: 'none',
      cursor: 'pointer',
      ...style
    }
  }, children, arrow ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: 13,
    strokeWidth: 2,
    style: {
      transform: hover ? 'translateX(2px)' : 'none',
      transition: 'transform var(--duration-fast) var(--ease-standard)'
    }
  }) : null);
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  style
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const toggle = () => {
    if (disabled) return;
    setInner(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: e => {
      e.preventDefault();
      toggle();
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-600)',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": on,
    tabIndex: disabled ? -1 : 0,
    onKeyDown: e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    },
    style: {
      width: 15,
      height: 15,
      borderRadius: 4,
      border: '1px solid ' + (on ? 'var(--blue-500)' : 'var(--ink-300)'),
      background: on ? 'var(--blue-500)' : 'var(--white)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--white)',
      flexShrink: 0,
      transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)'
    }
  }, on ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 11,
    strokeWidth: 3
  }) : null), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    h: 'var(--control-sm)',
    fs: 'var(--text-sm)',
    icon: 14
  },
  md: {
    h: 'var(--control-md)',
    fs: 'var(--text-sm)',
    icon: 15
  },
  lg: {
    h: 'var(--control-lg)',
    fs: 'var(--text-md)',
    icon: 17
  }
};
function Input({
  label,
  hint,
  error,
  icon,
  trailing,
  size = 'md',
  value,
  defaultValue,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  fullWidth = true,
  id,
  style,
  inputStyle,
  onFocus,
  onBlur,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const autoId = React.useId ? React.useId() : undefined;
  const inputId = id || autoId;
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      flexDirection: 'column',
      gap: 6,
      width: fullWidth ? '100%' : undefined,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--ink-700)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: s.h,
      padding: '0 10px',
      background: disabled ? 'var(--surface-muted)' : 'var(--white)',
      border: '1px solid ' + borderColor,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? error ? '0 0 0 3px rgba(229,72,77,.18)' : 'var(--focus-ring)' : 'none',
      transition: 'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)'
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon,
    color: "var(--ink-400)"
  }) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: e => {
      setFocus(true);
      onFocus && onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      onBlur && onBlur(e);
    },
    style: {
      flex: 1,
      minWidth: 0,
      height: '100%',
      border: 0,
      outline: 'none',
      background: 'transparent',
      fontFamily: 'inherit',
      fontSize: s.fs,
      color: 'var(--text-strong)',
      padding: 0,
      ...inputStyle
    }
  }, rest)), trailing || null), error || hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--danger-text)' : 'var(--text-muted)'
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder = 'Selecionar',
  size = 'sm',
  label,
  fullWidth = true,
  disabled = false,
  style
}) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue);
  const [hoverIdx, setHoverIdx] = React.useState(-1);
  const ref = React.useRef(null);
  const current = value !== undefined ? value : inner;
  const selected = options.find(o => o.value === current);
  const h = size === 'md' ? 'var(--control-md)' : 26;
  React.useEffect(() => {
    if (!open) return;
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const pick = o => {
    setInner(o.value);
    onChange && onChange(o.value, o);
    setOpen(false);
  };
  const lead = o => o.avatar ? o.avatar : o.dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: o.dot,
      flexShrink: 0
    }
  }) : o.icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: o.icon,
    size: 13,
    color: "var(--ink-500)"
  }) : null;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      display: fullWidth ? 'flex' : 'inline-flex',
      flexDirection: 'column',
      gap: 6,
      width: fullWidth ? '100%' : undefined,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--ink-700)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: () => setOpen(o => !o),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      height: h,
      padding: '0 8px',
      width: '100%',
      background: 'var(--white)',
      border: '1px solid ' + (open ? 'var(--border-focus)' : 'var(--border-default)'),
      boxShadow: open ? 'var(--focus-ring)' : 'none',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'inherit',
      fontSize: size === 'md' ? 'var(--text-base)' : 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      color: selected ? 'var(--ink-800)' : 'var(--text-subtle)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      textAlign: 'left',
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  }, selected ? lead(selected) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, selected ? selected.label : placeholder), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 13,
    color: "var(--ink-400)",
    style: {
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--duration-fast) var(--ease-standard)'
    }
  })), open ? /*#__PURE__*/React.createElement("div", {
    role: "listbox",
    style: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      minWidth: 160,
      zIndex: 'var(--z-dropdown)',
      background: 'var(--white)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      padding: 4
    }
  }, options.map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: o.value,
    role: "option",
    "aria-selected": o.value === current,
    onClick: () => pick(o),
    onMouseEnter: () => setHoverIdx(i),
    onMouseLeave: () => setHoverIdx(-1),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 30,
      padding: '0 8px',
      borderRadius: 'var(--radius-sm)',
      background: hoverIdx === i ? 'var(--surface-hover)' : 'transparent',
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-800)',
      cursor: 'pointer'
    }
  }, lead(o), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, o.label), o.value === current ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 13,
    color: "var(--blue-500)",
    strokeWidth: 2.2
  }) : null))) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomNav.jsx
try { (() => {
function Item({
  it,
  active,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    "aria-current": active ? 'page' : undefined,
    style: {
      flex: 1,
      minWidth: 'var(--touch-min)',
      height: 52,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      border: 0,
      background: 'transparent',
      color: active ? 'var(--navy-900)' : 'var(--ink-400)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-2xs)',
      fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon,
    size: 22,
    strokeWidth: active ? 2 : 1.75
  }), it.badge != null ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "solid",
    size: "sm",
    ring: "var(--white)",
    style: {
      position: 'absolute',
      top: -7,
      left: 12
    }
  }, it.badge) : null), it.label);
}
function BottomNav({
  items = [],
  activeId,
  onSelect,
  onAction,
  actionIcon = 'plus',
  actionLabel = 'Novo ticket',
  style
}) {
  const mid = Math.ceil(items.length / 2);
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 'var(--bottom-nav-height)',
      padding: '0 8px 8px',
      background: 'var(--white)',
      borderTop: '1px solid var(--border-subtle)',
      ...style
    }
  }, items.slice(0, mid).map(it => /*#__PURE__*/React.createElement(Item, {
    key: it.id,
    it: it,
    active: it.id === activeId,
    onClick: () => onSelect && onSelect(it.id)
  })), onAction ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": actionLabel,
    onClick: onAction,
    style: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      border: 0,
      background: 'var(--action-primary)',
      color: 'var(--white)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 6px 16px rgba(16,31,60,.28)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: actionIcon,
    size: 22,
    strokeWidth: 2.2
  }))) : null, items.slice(mid).map(it => /*#__PURE__*/React.createElement(Item, {
    key: it.id,
    it: it,
    active: it.id === activeId,
    onClick: () => onSelect && onSelect(it.id)
  })));
}
Object.assign(__ds_scope, { BottomNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavItem.jsx
try { (() => {
function NavItem({
  icon,
  label,
  count,
  active = false,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    "aria-current": active ? 'page' : undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      height: 34,
      padding: '0 8px 0 10px',
      border: 0,
      borderRadius: 'var(--radius-md)',
      background: active ? 'var(--nav-item-active)' : hover ? 'var(--nav-item-hover)' : 'transparent',
      color: active ? 'var(--nav-text-active)' : 'var(--nav-text)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'background var(--duration-fast) var(--ease-standard)',
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, label), count != null ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: active ? 'navActive' : 'nav'
  }, count) : null);
}
Object.assign(__ds_scope, { NavItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sidebar.jsx
try { (() => {
function Sidebar({
  brand = 'Atendix',
  items = [],
  groups = [],
  activeId,
  onSelect,
  user,
  onSearch,
  footer,
  style
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--sidebar-width)',
      flexShrink: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--nav-bg)',
      color: 'var(--nav-text)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 'var(--topbar-height)',
      padding: '0 12px 0 20px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '-0.02em',
      color: 'var(--white)'
    }
  }, brand), onSearch ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "search",
    label: "Buscar",
    variant: "inverse",
    size: "sm",
    onClick: onSearch
  }) : null), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '6px 12px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, items.map(it => /*#__PURE__*/React.createElement(__ds_scope.NavItem, {
    key: it.id,
    icon: it.icon,
    label: it.label,
    count: it.count,
    active: it.id === activeId,
    onClick: () => onSelect && onSelect(it.id)
  })), groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.title,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 10px 6px',
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-overline)',
      textTransform: 'uppercase',
      color: 'var(--nav-text-muted)'
    }
  }, g.title), g.items.map(it => /*#__PURE__*/React.createElement(__ds_scope.NavItem, {
    key: it.id,
    icon: it.icon,
    label: it.label,
    count: it.count,
    active: it.id === activeId,
    onClick: () => onSelect && onSelect(it.id)
  }))))), footer || (user ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 20px 18px',
      borderTop: '1px solid var(--navy-800)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: user.name,
    src: user.src,
    size: 34,
    status: user.status || 'online',
    ringColor: "var(--nav-bg)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--white)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--nav-text-muted)'
    }
  }, user.statusLabel || 'Online'))) : null));
}
Object.assign(__ds_scope, { Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sidebar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  size = 'sm',
  trailing,
  style
}) {
  const [inner, setInner] = React.useState(defaultValue !== undefined ? defaultValue : items[0] && items[0].id);
  const active = value !== undefined ? value : inner;
  const select = id => {
    setInner(id);
    onChange && onChange(id);
  };
  const pill = variant === 'pill';
  const fs = size === 'md' ? 'var(--text-base)' : 'var(--text-sm)';
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: pill ? 8 : 18,
      borderBottom: pill ? 'none' : '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, items.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      role: "tab",
      type: "button",
      "aria-selected": on,
      onClick: () => select(it.id),
      style: pill ? {
        position: 'relative',
        flex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 34,
        padding: '0 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid ' + (on ? 'var(--border-default)' : 'transparent'),
        background: on ? 'var(--white)' : 'var(--ink-100)',
        boxShadow: on ? 'var(--shadow-xs)' : 'none',
        color: on ? 'var(--blue-500)' : 'var(--ink-500)',
        fontFamily: 'inherit',
        fontSize: fs,
        fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)',
        cursor: 'pointer',
        overflow: 'hidden'
      } : {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 36,
        padding: 0,
        border: 0,
        background: 'transparent',
        color: on ? 'var(--ink-900)' : 'var(--ink-500)',
        fontFamily: 'inherit',
        fontSize: fs,
        fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }
    }, it.label, it.count != null ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
      size: "sm",
      tone: on ? 'accent' : 'neutral'
    }, it.count) : null, on ? /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: pill ? 12 : -2,
        right: pill ? 12 : -2,
        bottom: pill ? 0 : -1,
        height: 2,
        borderRadius: 2,
        background: 'var(--blue-500)'
      }
    }) : null);
  }), trailing ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'inline-flex'
    }
  }, trailing) : null);
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/conversation/Composer.jsx
try { (() => {
const TOOL_LABELS = {
  paperclip: 'Anexar arquivo',
  smile: 'Emoji',
  'pen-line': 'Assinatura',
  image: 'Imagem',
  link: 'Link',
  bold: 'Negrito',
  italic: 'Itálico',
  sparkles: 'Sugerir com IA'
};
function Composer({
  mode,
  defaultMode = 'reply',
  onModeChange,
  value,
  onChange,
  onSend,
  replyLabel = 'Responder',
  noteLabel = 'Nota interna',
  placeholder = 'Escreva uma resposta…',
  notePlaceholder = 'Escreva uma nota visível só para a equipe…',
  sendLabel = 'Enviar',
  internalLabel = 'Enviar como nota interna',
  tools = ['paperclip', 'smile', 'pen-line'],
  style
}) {
  const [innerMode, setInnerMode] = React.useState(defaultMode);
  const [innerVal, setInnerVal] = React.useState('');
  const m = mode !== undefined ? mode : innerMode;
  const v = value !== undefined ? value : innerVal;
  const isNote = m === 'note';
  const setMode = id => {
    setInnerMode(id);
    onModeChange && onModeChange(id);
  };
  const setVal = t => {
    setInnerVal(t);
    onChange && onChange(t);
  };
  const send = () => {
    if (!v.trim()) return;
    onSend && onSend(v, m);
    if (value === undefined) setInnerVal('');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--white)',
      border: '1px solid ' + (isNote ? 'var(--amber-100)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xs)',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      background: 'var(--surface-muted)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Tabs, {
    items: [{
      id: 'reply',
      label: replyLabel
    }, {
      id: 'note',
      label: noteLabel
    }],
    value: m,
    onChange: setMode,
    style: {
      borderBottom: 'none',
      gap: 22
    }
  })), /*#__PURE__*/React.createElement("textarea", {
    value: v,
    onChange: e => setVal(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send();
    },
    placeholder: isNote ? notePlaceholder : placeholder,
    rows: 3,
    style: {
      display: 'block',
      width: '100%',
      minHeight: 72,
      resize: 'vertical',
      border: 0,
      outline: 'none',
      padding: '12px 16px',
      background: isNote ? 'var(--attention-bg)' : 'var(--white)',
      fontFamily: 'inherit',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-normal)',
      color: 'var(--text-strong)',
      transition: 'background var(--duration-base) var(--ease-standard)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '8px 10px 10px 12px',
      background: isNote ? 'var(--attention-bg)' : 'var(--white)'
    }
  }, tools.map(t => /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    key: t,
    icon: t,
    label: TOOL_LABELS[t] || t,
    size: "sm"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
    label: internalLabel,
    checked: isNote,
    onChange: on => setMode(on ? 'note' : 'reply'),
    style: {
      marginRight: 12
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    iconRight: "arrow-right",
    onClick: send,
    disabled: !v.trim()
  }, sendLabel)));
}
Object.assign(__ds_scope, { Composer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/conversation/Composer.jsx", error: String((e && e.message) || e) }); }

// components/tickets/CustomerSummary.jsx
try { (() => {
function CustomerSummary({
  name,
  email,
  avatarSrc,
  details = [],
  profileLabel = 'Ver perfil completo',
  onViewProfile,
  onMore,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: name,
    src: avatarSrc,
    size: 42
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, email)), onMore ? /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "ellipsis",
    label: "Mais a\xE7\xF5es",
    variant: "outline",
    size: "sm",
    onClick: onMore
  }) : null), details.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, details.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 'var(--text-sm)',
      color: 'var(--ink-600)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: d.icon,
    size: 14,
    color: "var(--ink-400)"
  }), /*#__PURE__*/React.createElement("span", null, d.label)))) : null, onViewProfile ? /*#__PURE__*/React.createElement(__ds_scope.TextLink, {
    arrow: true,
    onClick: onViewProfile
  }, profileLabel) : null);
}
Object.assign(__ds_scope, { CustomerSummary });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tickets/CustomerSummary.jsx", error: String((e && e.message) || e) }); }

// components/tickets/DetailRow.jsx
try { (() => {
function DetailRow({
  label,
  children,
  labelWidth = 92,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minHeight: 28,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: labelWidth,
      flexShrink: 0,
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--ink-800)'
    }
  }, children));
}
Object.assign(__ds_scope, { DetailRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tickets/DetailRow.jsx", error: String((e && e.message) || e) }); }

// components/tickets/KpiCard.jsx
try { (() => {
const TILES = {
  blue: {
    bg: 'var(--tile-blue-bg)',
    fg: 'var(--tile-blue-fg)'
  },
  amber: {
    bg: 'var(--tile-amber-bg)',
    fg: 'var(--tile-amber-fg)'
  },
  green: {
    bg: 'var(--tile-green-bg)',
    fg: 'var(--tile-green-fg)'
  },
  violet: {
    bg: 'var(--violet-50)',
    fg: 'var(--violet-500)'
  }
};
function Spark({
  data,
  kind,
  w = 76,
  h = 34
}) {
  if (!data || !data.length) return null;
  const max = Math.max(...data),
    min = Math.min(...data);
  if (kind === 'bars') {
    const gap = 3,
      bw = (w - gap * (data.length - 1)) / data.length;
    return /*#__PURE__*/React.createElement("svg", {
      width: w,
      height: h,
      viewBox: `0 0 ${w} ${h}`,
      "aria-hidden": "true",
      style: {
        display: 'block',
        flexShrink: 0
      }
    }, data.map((v, i) => {
      const bh = Math.max(3, v / max * h);
      return /*#__PURE__*/React.createElement("rect", {
        key: i,
        x: i * (bw + gap),
        y: h - bh,
        width: bw,
        height: bh,
        rx: 1.5,
        fill: i >= data.length - 2 ? 'var(--blue-300)' : 'var(--blue-200)'
      });
    }));
  }
  const pts = data.map((v, i) => [i / (data.length - 1) * w, h - 3 - (v - min) / (max - min || 1) * (h - 6)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const gid = 'kpi-g-' + data.join('-');
  return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    viewBox: `0 0 ${w} ${h}`,
    "aria-hidden": "true",
    style: {
      display: 'block',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: gid,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "var(--blue-300)",
    stopOpacity: "0.35"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "var(--blue-300)",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: line + ` L${w} ${h} L0 ${h} Z`,
    fill: `url(#${gid})`
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: "var(--blue-400)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
function KpiCard({
  icon = 'mail',
  tone = 'blue',
  label,
  value,
  delta,
  direction = 'up',
  sentiment = 'positive',
  chart,
  data,
  onClick,
  style
}) {
  const t = TILES[tone] || TILES.blue;
  const good = sentiment === 'positive';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 16px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xs)',
      fontFamily: 'var(--font-sans)',
      minWidth: 0,
      cursor: onClick ? 'pointer' : undefined,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-lg)',
      background: t.bg,
      color: t.fg,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--text-strong)',
      letterSpacing: '-0.02em',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), delta ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      height: 18,
      padding: '0 6px',
      borderRadius: 'var(--radius-xs)',
      background: good ? 'var(--positive-bg)' : 'var(--danger-bg)',
      color: good ? 'var(--positive-text)' : 'var(--danger-text)',
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-semibold)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: direction === 'down' ? 'arrow-down' : 'arrow-up',
    size: 10,
    strokeWidth: 2.4
  }), delta) : null)), chart ? /*#__PURE__*/React.createElement(Spark, {
    data: data,
    kind: chart
  }) : null);
}
Object.assign(__ds_scope, { KpiCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tickets/KpiCard.jsx", error: String((e && e.message) || e) }); }

// components/tickets/PanelSection.jsx
try { (() => {
function PanelSection({
  title,
  count,
  action,
  divider = true,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '18px 0',
      borderBottom: divider ? '1px solid var(--border-subtle)' : 'none',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      flex: 1,
      margin: 0,
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)',
      letterSpacing: '-0.005em'
    }
  }, title), count != null ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral"
  }, count) : null, action || null) : null, children);
}
Object.assign(__ds_scope, { PanelSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tickets/PanelSection.jsx", error: String((e && e.message) || e) }); }

// components/tickets/RelatedTicket.jsx
try { (() => {
function RelatedTicket({
  title,
  id,
  date,
  status = 'Resolvido',
  tone = 'positive',
  icon = 'history',
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '8px 6px',
      margin: '0 -6px',
      borderRadius: 'var(--radius-sm)',
      background: hover && onClick ? 'var(--surface-hover)' : 'transparent',
      cursor: onClick ? 'pointer' : undefined,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 15,
    color: "var(--ink-400)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--ink-800)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 2,
      fontSize: 'var(--text-xs)',
      color: 'var(--text-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", null, id), /*#__PURE__*/React.createElement("span", null, date))), /*#__PURE__*/React.createElement(__ds_scope.StatusPill, {
    tone: tone
  }, status));
}
Object.assign(__ds_scope, { RelatedTicket });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tickets/RelatedTicket.jsx", error: String((e && e.message) || e) }); }

// components/tickets/TicketRow.jsx
try { (() => {
function TicketRow({
  name,
  avatarSrc,
  subject,
  preview,
  time,
  tags = [],
  selected = false,
  unread = false,
  compact = false,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    role: "button",
    tabIndex: 0,
    onClick: onClick,
    onKeyDown: e => {
      if (e.key === 'Enter') onClick && onClick();
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'flex',
      gap: 12,
      padding: compact ? '14px 14px' : '12px 14px',
      borderRadius: 'var(--radius-md)',
      background: selected ? 'var(--surface-selected)' : hover ? 'var(--surface-hover)' : 'transparent',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      transition: 'background var(--duration-fast) var(--ease-standard)',
      outline: 'none',
      ...style
    }
  }, selected ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 6,
      bottom: 6,
      width: 2.5,
      borderRadius: 2,
      background: 'var(--blue-500)'
    }
  }) : null, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: name,
    src: avatarSrc,
    size: compact ? 40 : 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontSize: compact ? 'var(--text-md)' : 'var(--text-base)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: unread ? 'var(--blue-500)' : 'var(--text-subtle)',
      fontWeight: unread ? 'var(--weight-semibold)' : 'var(--weight-regular)',
      whiteSpace: 'nowrap'
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: compact ? 'var(--text-base)' : 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--ink-800)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, subject), preview && !compact ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, preview) : null, tags.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: compact ? 10 : 8
    }
  }, tags.map((t, i) => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: i,
    tone: t.tone,
    size: compact ? 'md' : 'sm'
  }, t.label))) : null), unread ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 14,
      bottom: 16,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--blue-500)'
    }
  }) : null);
}
Object.assign(__ds_scope, { TicketRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tickets/TicketRow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/helpdesk/App.jsx
try { (() => {
function useViewportWidth() {
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const f = () => setW(window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return w;
}
const VIEW_FILTERS = {
  inbox: () => true,
  mine: t => t.owner === 'me',
  mentions: t => t.thread.some(m => m.role === 'note'),
  unassigned: t => !t.owner,
  all: () => true,
  geral: () => true,
  financeiro: t => t.category === 'billing',
  tecnico: t => t.category === 'technical',
  produto: t => t.category === 'product',
  escalonamentos: () => false
};
const VIEW_TITLES = {
  inbox: 'Caixa de entrada',
  mine: 'Meus tickets',
  mentions: 'Menções',
  unassigned: 'Não atribuídos',
  all: 'Todos os tickets',
  customers: 'Clientes',
  reports: 'Relatórios',
  geral: 'Geral',
  financeiro: 'Financeiro',
  tecnico: 'Técnico',
  produto: 'Produto',
  escalonamentos: 'Escalonamentos'
};
function OutOfScope({
  title
}) {
  const {
    Card,
    Icon
  } = window.AtendixDesignSystem_94ef37;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--bg-app)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "lg",
    radius: "xl",
    style: {
      maxWidth: 380,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 22,
    color: "var(--ink-400)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-md)',
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      marginTop: 6,
      textWrap: 'pretty'
    }
  }, "Esta tela n\xE3o aparece na refer\xEAncia visual, ent\xE3o foi deixada em branco de prop\xF3sito.")));
}
function App() {
  const NS = window.AtendixDesignSystem_94ef37;
  const {
    Sidebar
  } = NS;
  const D = window.ATX_DATA;
  const store = window.useTicketStore();
  const w = useViewportWidth();
  const [view, setView] = React.useState('inbox');
  const [tab, setTab] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(D.tickets[0].id);
  const [drafts, setDrafts] = React.useState({});
  const [modes, setModes] = React.useState({});
  const [ctxOpen, setCtxOpen] = React.useState(false);
  if (w < 960) return /*#__PURE__*/React.createElement(window.MobileApp, {
    store: store
  });
  const inline = w >= 1280;
  const q = query.trim().toLowerCase();
  const inView = store.tickets.filter(VIEW_FILTERS[view] || (() => true));
  const list = inView.filter(t => tab === 'all' || (tab === 'mine' ? t.owner === 'me' : !t.owner)).filter(t => !q || (t.name + ' ' + t.subject + ' ' + t.id).toLowerCase().includes(q));
  const ticket = list.find(t => t.id === selectedId) || list[0];
  const select = id => {
    setSelectedId(id);
    store.update(id, {
      unread: false
    });
  };
  const newTicket = () => {
    const id = store.create();
    setView('inbox');
    setTab('all');
    setQuery('');
    setSelectedId(id);
  };
  const outOfScope = view === 'customers' || view === 'reports';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100vh',
      background: 'var(--white)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    activeId: view,
    onSelect: id => {
      setView(id);
      setTab('all');
    },
    onSearch: () => {},
    user: D.agent,
    items: [{
      id: 'inbox',
      icon: 'inbox',
      label: 'Caixa de entrada',
      count: 12
    }, {
      id: 'mine',
      icon: 'ticket',
      label: 'Meus tickets',
      count: 8
    }, {
      id: 'mentions',
      icon: 'at-sign',
      label: 'Menções',
      count: 3
    }, {
      id: 'unassigned',
      icon: 'user',
      label: 'Não atribuídos',
      count: 6
    }, {
      id: 'all',
      icon: 'archive',
      label: 'Todos os tickets'
    }, {
      id: 'customers',
      icon: 'users',
      label: 'Clientes'
    }, {
      id: 'reports',
      icon: 'chart-column',
      label: 'Relatórios'
    }],
    groups: [{
      title: 'Equipes',
      items: [{
        id: 'geral',
        icon: 'hash',
        label: 'Geral'
      }, {
        id: 'financeiro',
        icon: 'hash',
        label: 'Financeiro'
      }, {
        id: 'tecnico',
        icon: 'hash',
        label: 'Técnico'
      }, {
        id: 'produto',
        icon: 'hash',
        label: 'Produto'
      }, {
        id: 'escalonamentos',
        icon: 'hash',
        label: 'Escalonamentos'
      }]
    }]
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(InboxHeader, {
    title: VIEW_TITLES[view],
    query: query,
    onQuery: setQuery,
    onNewTicket: newTicket,
    kpis: outOfScope ? [] : D.kpis,
    compact: !inline
  }), outOfScope ? /*#__PURE__*/React.createElement(OutOfScope, {
    title: VIEW_TITLES[view]
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      borderTop: '1px solid var(--border-subtle)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(TicketList, {
    tickets: list,
    selectedId: ticket && ticket.id,
    onSelect: select,
    tab: tab,
    onTab: setTab,
    counts: {
      all: 48,
      mine: 8,
      unassigned: 6
    }
  }), /*#__PURE__*/React.createElement(ConversationPane, {
    ticket: ticket,
    draft: ticket ? drafts[ticket.id] || '' : '',
    setDraft: v => ticket && setDrafts(d => ({
      ...d,
      [ticket.id]: v
    })),
    mode: ticket ? modes[ticket.id] || 'reply' : 'reply',
    setMode: m => ticket && setModes(s => ({
      ...s,
      [ticket.id]: m
    })),
    onSend: (text, m) => store.send(ticket.id, text, m),
    showContextToggle: !inline,
    contextOpen: ctxOpen,
    onToggleContext: () => setCtxOpen(o => !o)
  }), ticket && inline ? /*#__PURE__*/React.createElement(ContextPanel, {
    ticket: ticket,
    onUpdate: p => store.update(ticket.id, p)
  }) : null, ticket && !inline && ctxOpen ? /*#__PURE__*/React.createElement(ContextPanel, {
    ticket: ticket,
    onUpdate: p => store.update(ticket.id, p),
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: 'var(--z-overlay)',
      boxShadow: 'var(--shadow-xl)'
    }
  }) : null)));
}
window.App = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helpdesk/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/helpdesk/ContextPanel.jsx
try { (() => {
function ContextPanel({
  ticket,
  onUpdate,
  style
}) {
  const {
    PanelSection,
    CustomerSummary,
    DetailRow,
    Select,
    Avatar,
    StatusPill,
    Tag,
    RelatedTicket,
    TextLink,
    Input
  } = window.AtendixDesignSystem_94ef37;
  const D = window.ATX_DATA;
  const U = window.ATX_UTIL;
  const [adding, setAdding] = React.useState(false);
  const [newTag, setNewTag] = React.useState('');
  React.useEffect(() => {
    setAdding(false);
    setNewTag('');
  }, [ticket && ticket.id]);
  if (!ticket) return null;
  const tags = U.panelTags(ticket);
  const addTag = () => {
    const v = newTag.trim();
    if (v) onUpdate({
      tags: ticket.tags.concat([{
        label: v
      }])
    });
    setNewTag('');
    setAdding(false);
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--context-width)',
      flexShrink: 0,
      overflowY: 'auto',
      padding: '0 20px 20px',
      background: 'var(--white)',
      borderLeft: '1px solid var(--border-subtle)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(PanelSection, {
    title: "Cliente"
  }, /*#__PURE__*/React.createElement(CustomerSummary, {
    name: ticket.name,
    email: ticket.email,
    details: [{
      icon: 'map-pin',
      label: ticket.location
    }, {
      icon: 'calendar',
      label: ticket.since
    }, {
      icon: 'credit-card',
      label: ticket.plan
    }],
    onViewProfile: () => {},
    onMore: () => {}
  })), /*#__PURE__*/React.createElement(PanelSection, {
    title: "Detalhes do ticket"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(DetailRow, {
    label: "Status"
  }, /*#__PURE__*/React.createElement(Select, {
    options: D.statusOptions,
    value: ticket.status,
    onChange: v => onUpdate({
      status: v,
      sla: v === 'solved' ? 'Concluído' : ticket.sla === 'Concluído' ? 'Responder em 8h' : ticket.sla
    })
  })), /*#__PURE__*/React.createElement(DetailRow, {
    label: "Prioridade"
  }, /*#__PURE__*/React.createElement(Select, {
    options: D.priorityOptions,
    value: ticket.priority,
    onChange: v => onUpdate({
      priority: v
    })
  })), /*#__PURE__*/React.createElement(DetailRow, {
    label: "Categoria"
  }, /*#__PURE__*/React.createElement(Select, {
    options: D.categoryOptions,
    value: ticket.category,
    onChange: v => onUpdate({
      category: v
    })
  })), /*#__PURE__*/React.createElement(DetailRow, {
    label: "Atribu\xEDdo a"
  }, ticket.owner ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Avatar, {
    name: D.agent.name,
    size: 20
  }), D.agent.name) : /*#__PURE__*/React.createElement(TextLink, {
    onClick: () => onUpdate({
      owner: 'me'
    })
  }, "Atribuir a mim")), /*#__PURE__*/React.createElement(DetailRow, {
    label: "SLA"
  }, /*#__PURE__*/React.createElement(StatusPill, {
    tone: ticket.status === 'solved' ? 'positive' : 'danger',
    icon: "clock"
  }, ticket.sla)), /*#__PURE__*/React.createElement(DetailRow, {
    label: "Criado"
  }, ticket.created), /*#__PURE__*/React.createElement(DetailRow, {
    label: "\xDAltima resposta"
  }, ticket.lastReply))), /*#__PURE__*/React.createElement(PanelSection, {
    title: "Tags"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, tags.map((t, i) => /*#__PURE__*/React.createElement(Tag, {
    key: t.label + i,
    tone: t.tone,
    onRemove: () => onUpdate({
      tags: ticket.tags.filter(x => x !== t)
    })
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, adding ? /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    autoFocus: true,
    placeholder: "Nome da tag e Enter",
    value: newTag,
    onChange: e => setNewTag(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') addTag();
      if (e.key === 'Escape') setAdding(false);
    },
    onBlur: addTag
  }) : /*#__PURE__*/React.createElement(Tag, {
    icon: "plus",
    onClick: () => setAdding(true)
  }, "Adicionar tag"))), /*#__PURE__*/React.createElement(PanelSection, {
    title: "Tickets relacionados",
    count: ticket.related.length,
    divider: false
  }, ticket.related.length ? ticket.related.map(r => /*#__PURE__*/React.createElement(RelatedTicket, {
    key: r.id,
    title: r.title,
    id: r.id,
    date: r.date,
    onClick: () => {}
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, "Nenhum ticket anterior deste cliente.")));
}
window.ContextPanel = ContextPanel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helpdesk/ContextPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/helpdesk/ConversationPane.jsx
try { (() => {
function ConversationPane({
  ticket,
  draft,
  setDraft,
  mode,
  setMode,
  onSend,
  onToggleContext,
  contextOpen,
  showContextToggle
}) {
  const {
    Tag,
    StatusPill,
    IconButton,
    Message,
    SuggestedReplies,
    Composer,
    Icon
  } = window.AtendixDesignSystem_94ef37;
  const U = window.ATX_UTIL;
  const D = window.ATX_DATA;
  const Body = window.ATX_Body;
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [ticket && ticket.id, ticket && ticket.thread.length]);
  if (!ticket) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)'
      }
    }, "Selecione um ticket para ver a conversa.");
  }
  const st = U.STATUS[ticket.status];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 52,
      padding: '0 20px 0 24px',
      borderBottom: '1px solid var(--border-subtle)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-md)',
      fontWeight: 700,
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      minWidth: 0
    }
  }, ticket.subject), /*#__PURE__*/React.createElement(Tag, {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, "#", ticket.id), /*#__PURE__*/React.createElement(StatusPill, {
    tone: st.tone,
    dot: true
  }, st.label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), showContextToggle ? /*#__PURE__*/React.createElement(IconButton, {
    icon: "info",
    label: "Contexto do cliente",
    variant: "outline",
    size: "sm",
    active: contextOpen,
    onClick: onToggleContext
  }) : null, /*#__PURE__*/React.createElement(IconButton, {
    icon: "ellipsis",
    label: "Mais a\xE7\xF5es",
    variant: "outline",
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, ticket.thread.length ? ticket.thread.map((m, i) => /*#__PURE__*/React.createElement(Message, {
    key: i,
    author: m.author,
    time: m.time,
    role: m.role
  }, /*#__PURE__*/React.createElement(Body, {
    lines: m.body
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      color: 'var(--text-muted)',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-square",
    size: 22,
    color: "var(--ink-300)"
  }), "Sem mensagens ainda. Escreva a primeira resposta abaixo.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      flexShrink: 0
    }
  }, ticket.status !== 'solved' && ticket.thread.length ? /*#__PURE__*/React.createElement(SuggestedReplies, {
    items: D.suggested,
    onPick: t => {
      setMode('reply');
      setDraft(t);
    }
  }) : null, /*#__PURE__*/React.createElement(Composer, {
    mode: mode,
    onModeChange: setMode,
    value: draft,
    onChange: setDraft,
    onSend: (text, m) => {
      onSend(text, m);
      setDraft('');
    }
  })));
}
window.ConversationPane = ConversationPane;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helpdesk/ConversationPane.jsx", error: String((e && e.message) || e) }); }

// ui_kits/helpdesk/InboxHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function InboxHeader({
  title = 'Caixa de entrada',
  query,
  onQuery,
  onNewTicket,
  kpis = [],
  compact = false
}) {
  const {
    Input,
    IconButton,
    Button,
    KpiCard,
    Icon
  } = window.AtendixDesignSystem_94ef37;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 24px',
      background: 'var(--white)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 64
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      border: 0,
      background: 'transparent',
      padding: 0,
      fontFamily: 'inherit',
      fontSize: 'var(--text-xl)',
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: 'var(--text-strong)',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  }, title, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 16,
    color: "var(--ink-500)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Input, {
    icon: "search",
    placeholder: "Buscar conversas, clientes ou tickets\u2026",
    value: query,
    onChange: e => onQuery(e.target.value),
    fullWidth: false,
    style: {
      width: compact ? 220 : 340
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "sliders-horizontal",
    label: "Filtros",
    variant: "outline",
    size: "md"
  }), /*#__PURE__*/React.createElement(Button, {
    iconLeft: "plus",
    onClick: onNewTicket
  }, "Novo ticket")), kpis.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: 12,
      paddingBottom: 16
    }
  }, kpis.map(k => /*#__PURE__*/React.createElement(KpiCard, _extends({
    key: k.label
  }, k)))) : null);
}
window.InboxHeader = InboxHeader;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helpdesk/InboxHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/helpdesk/MobileScreens.jsx
try { (() => {
function MobileStatusBar() {
  const {
    Icon
  } = window.AtendixDesignSystem_94ef37;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 44,
      padding: '0 26px 0 30px',
      flexShrink: 0,
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--ink-900)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 5,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "signal",
    size: 16,
    strokeWidth: 2.2
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "wifi",
    size: 16,
    strokeWidth: 2.2
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "battery-full",
    size: 20,
    strokeWidth: 1.8
  })));
}
function MobileInbox({
  tickets,
  tab,
  onTab,
  onOpen,
  nav,
  onNav,
  onNew
}) {
  const {
    IconButton,
    Badge,
    Tabs,
    TicketRow,
    BottomNav
  } = window.AtendixDesignSystem_94ef37;
  const U = window.ATX_UTIL;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 16px 4px 20px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 19,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--navy-900)'
    }
  }, "Atendix"), /*#__PURE__*/React.createElement(IconButton, {
    icon: "search",
    label: "Buscar",
    size: "lg"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "menu",
    label: "Menu",
    variant: "outline",
    size: "lg"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '14px 20px 12px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--text-2xl)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)'
    }
  }, "Caixa de entrada"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "48")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 8px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    variant: "pill",
    items: [{
      id: 'all',
      label: 'Todos'
    }, {
      id: 'mine',
      label: 'Meus'
    }, {
      id: 'unassigned',
      label: 'Sem dono'
    }],
    value: tab,
    onChange: onTab
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: '4px 4px 12px'
    }
  }, tickets.map((t, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: t.id
  }, i > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      margin: '0 16px',
      background: 'var(--ink-100)'
    }
  }) : null, /*#__PURE__*/React.createElement(TicketRow, {
    compact: true,
    name: t.name,
    subject: t.subject,
    time: t.time,
    tags: U.listTags(t),
    unread: t.unread,
    selected: i === 0 && tab === 'all',
    onClick: () => onOpen(t.id)
  })))), /*#__PURE__*/React.createElement(BottomNav, {
    activeId: nav,
    onSelect: onNav,
    onAction: onNew,
    items: [{
      id: 'inbox',
      icon: 'inbox',
      label: 'Entrada',
      badge: 12
    }, {
      id: 'mine',
      icon: 'ticket',
      label: 'Meus tickets'
    }, {
      id: 'customers',
      icon: 'users',
      label: 'Clientes'
    }, {
      id: 'more',
      icon: 'menu',
      label: 'Mais'
    }]
  }));
}
function MobileTicket({
  ticket,
  onBack,
  onSend,
  draft,
  setDraft,
  mode,
  setMode
}) {
  const {
    IconButton,
    StatusPill,
    Message,
    SuggestedReplies,
    Composer
  } = window.AtendixDesignSystem_94ef37;
  const U = window.ATX_UTIL;
  const D = window.ATX_DATA;
  const Body = window.ATX_Body;
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [ticket.thread.length]);
  const st = U.STATUS[ticket.status];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px 10px 8px',
      borderBottom: '1px solid var(--border-subtle)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "arrow-left",
    label: "Voltar",
    size: "lg",
    onClick: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-md)',
      fontWeight: 700,
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, ticket.subject), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 2,
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, ticket.name, " \xB7 #", ticket.id), /*#__PURE__*/React.createElement(StatusPill, {
    tone: st.tone,
    dot: true,
    style: {
      height: 18
    }
  }, st.label))), /*#__PURE__*/React.createElement(IconButton, {
    icon: "ellipsis",
    label: "Mais a\xE7\xF5es",
    variant: "outline",
    size: "md"
  })), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, ticket.thread.map((m, i) => /*#__PURE__*/React.createElement(Message, {
    key: i,
    author: m.author,
    time: m.time,
    role: m.role
  }, /*#__PURE__*/React.createElement(Body, {
    lines: m.body
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      borderTop: '1px solid var(--border-subtle)',
      flexShrink: 0
    }
  }, ticket.status !== 'solved' ? /*#__PURE__*/React.createElement(SuggestedReplies, {
    items: D.suggested.slice(0, 2),
    onPick: t => {
      setMode('reply');
      setDraft(t);
    }
  }) : null, /*#__PURE__*/React.createElement(Composer, {
    mode: mode,
    onModeChange: setMode,
    value: draft,
    onChange: setDraft,
    tools: ['paperclip', 'smile'],
    internalLabel: "Nota",
    onSend: (text, m) => {
      onSend(text, m);
      setDraft('');
    }
  })));
}
function MobileApp({
  store,
  framed = false
}) {
  const [screen, setScreen] = React.useState('list');
  const [selId, setSelId] = React.useState(null);
  const [tab, setTab] = React.useState('all');
  const [nav, setNav] = React.useState('inbox');
  const [draft, setDraft] = React.useState('');
  const [mode, setMode] = React.useState('reply');
  const list = store.tickets.filter(t => tab === 'all' || (tab === 'mine' ? t.owner === 'me' : !t.owner));
  const ticket = store.tickets.find(t => t.id === selId);
  const open = id => {
    setSelId(id);
    setDraft('');
    setMode('reply');
    setScreen('ticket');
    store.update(id, {
      unread: false
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--white)',
      fontFamily: 'var(--font-sans)'
    }
  }, framed ? /*#__PURE__*/React.createElement(MobileStatusBar, null) : null, screen === 'ticket' && ticket ? /*#__PURE__*/React.createElement(MobileTicket, {
    ticket: ticket,
    onBack: () => setScreen('list'),
    onSend: (text, m) => store.send(ticket.id, text, m),
    draft: draft,
    setDraft: setDraft,
    mode: mode,
    setMode: setMode
  }) : /*#__PURE__*/React.createElement(MobileInbox, {
    tickets: list,
    tab: tab,
    onTab: setTab,
    onOpen: open,
    nav: nav,
    onNav: id => {
      setNav(id);
      if (id === 'mine') setTab('mine');
      if (id === 'inbox') setTab('all');
    },
    onNew: () => open(store.create())
  }));
}
Object.assign(window, {
  MobileApp,
  MobileInbox,
  MobileTicket,
  MobileStatusBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helpdesk/MobileScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/helpdesk/TicketList.jsx
try { (() => {
function TicketList({
  tickets,
  selectedId,
  onSelect,
  tab,
  onTab,
  counts
}) {
  const {
    Tabs,
    IconButton,
    TicketRow,
    Icon
  } = window.AtendixDesignSystem_94ef37;
  const U = window.ATX_UTIL;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'var(--list-width)',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      borderRight: '1px solid var(--border-subtle)',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px 0'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      id: 'all',
      label: 'Todos',
      count: counts.all
    }, {
      id: 'mine',
      label: 'Meus',
      count: counts.mine
    }, {
      id: 'unassigned',
      label: 'Não atribuídos',
      count: counts.unassigned
    }],
    value: tab,
    onChange: onTab,
    trailing: /*#__PURE__*/React.createElement(IconButton, {
      icon: "ellipsis",
      label: "Mais filtros",
      size: "sm"
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '8px 8px 16px'
    }
  }, tickets.length ? tickets.map((t, i) => {
    const sel = t.id === selectedId;
    const prevSel = i > 0 && tickets[i - 1].id === selectedId;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: t.id
    }, i > 0 && !sel && !prevSel ? /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        margin: '0 14px',
        background: 'var(--ink-100)'
      }
    }) : i > 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1
      }
    }) : null, /*#__PURE__*/React.createElement(TicketRow, {
      name: t.name,
      subject: t.subject,
      preview: t.preview,
      time: t.time,
      tags: U.listTags(t),
      selected: sel,
      unread: t.unread,
      onClick: () => onSelect(t.id)
    }));
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      padding: '48px 24px',
      color: 'var(--text-muted)',
      fontSize: 'var(--text-sm)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "inbox",
    size: 22,
    color: "var(--ink-300)"
  }), "Nenhum ticket nesta vis\xE3o.")));
}
window.TicketList = TicketList;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helpdesk/TicketList.jsx", error: String((e && e.message) || e) }); }

// ui_kits/helpdesk/data.js
try { (() => {
// Mock data for the Atendix helpdesk UI kit. Illustrative content only.
window.ATX_DATA = {
  agent: {
    name: 'Marina Costa',
    status: 'online',
    statusLabel: 'Online'
  },
  kpis: [{
    icon: 'mail',
    tone: 'blue',
    label: 'Tickets abertos',
    value: '48',
    delta: '24%',
    direction: 'down',
    sentiment: 'positive',
    chart: 'line',
    data: [3, 3, 4, 4, 5, 7, 6, 9]
  }, {
    icon: 'clock',
    tone: 'amber',
    label: 'Respostas pendentes (SLA)',
    value: '12',
    delta: '3',
    direction: 'up',
    sentiment: 'negative'
  }, {
    icon: 'chart-no-axes-column',
    tone: 'blue',
    label: '1ª resposta (média)',
    value: '18m',
    delta: '40%',
    direction: 'down',
    sentiment: 'positive',
    chart: 'bars',
    data: [3, 2, 4, 3, 5, 6, 7]
  }, {
    icon: 'smile',
    tone: 'green',
    label: 'Satisfação (7d)',
    value: '96%',
    delta: '4%',
    direction: 'up',
    sentiment: 'positive',
    chart: 'bars',
    data: [2, 3, 3, 4, 5, 6, 7]
  }],
  statusOptions: [{
    value: 'open',
    label: 'Aberto',
    dot: 'var(--red-500)'
  }, {
    value: 'pending',
    label: 'Pendente',
    dot: 'var(--amber-500)'
  }, {
    value: 'solved',
    label: 'Resolvido',
    dot: 'var(--green-500)'
  }],
  priorityOptions: [{
    value: 'high',
    label: 'Alta',
    dot: 'var(--red-500)'
  }, {
    value: 'medium',
    label: 'Média',
    dot: 'var(--amber-500)'
  }, {
    value: 'low',
    label: 'Baixa',
    dot: 'var(--green-500)'
  }],
  categoryOptions: [{
    value: 'access',
    label: 'Acesso à conta',
    dot: 'var(--ink-300)'
  }, {
    value: 'billing',
    label: 'Faturamento',
    dot: 'var(--violet-500)'
  }, {
    value: 'technical',
    label: 'Técnico',
    dot: 'var(--blue-400)'
  }, {
    value: 'product',
    label: 'Feedback de produto',
    dot: 'var(--blue-300)'
  }, {
    value: 'onboarding',
    label: 'Onboarding',
    dot: 'var(--green-500)'
  }],
  suggested: ['Enviar link de redefinição', 'Verificar status da conta', 'Escalar para o time técnico'],
  tickets: [{
    id: 'AX-41827',
    name: 'Juliana Alves',
    email: 'juliana.alves@email.com',
    subject: 'Não consigo acessar minha conta',
    preview: 'Oi, estou recebendo um erro quando tento entrar…',
    time: '10:24',
    priority: 'high',
    category: 'access',
    status: 'open',
    owner: 'me',
    sla: 'Responder em 2h 36m',
    created: '15 jun 2026 · 10:24',
    lastReply: '15 jun 2026 · 10:31',
    location: 'São Paulo, SP',
    since: 'Cliente desde jan 2024',
    plan: 'Plano Pro · Mensal',
    tags: [{
      label: 'Acesso à conta'
    }, {
      label: 'Problema de login',
      tone: 'violet'
    }],
    related: [{
      title: 'Problemas de login no celular',
      id: '#AX-40211',
      date: '3 abr'
    }, {
      title: 'E-mail de redefinição não chegou',
      id: '#AX-38902',
      date: '12 mar'
    }, {
      title: 'Conta bloqueada após 5 tentativas',
      id: '#AX-37190',
      date: '6 fev'
    }],
    thread: [{
      author: 'Juliana Alves',
      time: '10:24',
      role: 'customer',
      body: ['Oi, equipe,', 'Estou recebendo um erro quando tento entrar na minha conta. Ontem funcionava, mas agora aparece “Credenciais inválidas” mesmo usando o e-mail e a senha corretos.', 'Vocês podem dar uma olhada? Preciso acessar um relatório importante hoje.', 'Obrigada!\nJuliana']
    }, {
      author: 'Marina Costa',
      time: '10:31',
      role: 'agent',
      body: ['Oi, Juliana,', 'Obrigada por avisar! Verifiquei sua conta e está tudo certo do nosso lado. Vamos redefinir sua senha por segurança.', 'Acabei de enviar um link seguro de redefinição para o seu e-mail. Pode testar e me contar se conseguiu entrar?', 'Abraço,\nMarina']
    }]
  }, {
    id: 'AX-41822',
    name: 'Daniel Kim',
    email: 'daniel.kim@email.com',
    subject: 'Pagamento não está passando',
    preview: 'O cartão está sendo recusado mesmo depois…',
    time: '9:17',
    priority: 'medium',
    category: 'billing',
    status: 'open',
    owner: null,
    sla: 'Responder em 4h 10m',
    created: '15 jun 2026 · 09:17',
    lastReply: '—',
    location: 'Curitiba, PR',
    since: 'Cliente desde mar 2025',
    plan: 'Plano Starter · Anual',
    tags: [{
      label: 'Faturamento',
      tone: 'violet'
    }, {
      label: 'Pagamento'
    }],
    unread: true,
    related: [{
      title: 'Atualizar dados do cartão',
      id: '#AX-39420',
      date: '2 mai'
    }],
    thread: [{
      author: 'Daniel Kim',
      time: '9:17',
      role: 'customer',
      body: ['Olá! O cartão está sendo recusado mesmo depois de confirmar com o banco que está tudo certo. Podem verificar?']
    }]
  }, {
    id: 'AX-41815',
    name: 'Sofia Martins',
    email: 'sofia.martins@email.com',
    subject: 'Sugestão: modo escuro',
    preview: 'Adoraria ter uma opção de modo escuro no painel…',
    time: '8:46',
    priority: 'low',
    category: 'product',
    status: 'pending',
    owner: 'me',
    sla: 'Responder em 1d 4h',
    created: '15 jun 2026 · 08:46',
    lastReply: '15 jun 2026 · 09:02',
    location: 'Lisboa, PT',
    since: 'Cliente desde ago 2023',
    plan: 'Plano Pro · Anual',
    tags: [{
      label: 'Baixa',
      tone: 'low'
    }, {
      label: 'Feedback de produto',
      tone: 'blue'
    }],
    related: [],
    thread: [{
      author: 'Sofia Martins',
      time: '8:46',
      role: 'customer',
      body: ['Adoraria ter uma opção de modo escuro no painel. Passo o dia inteiro nele!']
    }, {
      author: 'Marina Costa',
      time: '9:02',
      role: 'note',
      body: ['Já existe pedido parecido no roadmap (#PRD-218). Vincular quando o time de produto responder.']
    }]
  }, {
    id: 'AX-41790',
    name: 'Rafael Souza',
    email: 'rafael.souza@email.com',
    subject: 'Não consigo exportar meus dados',
    preview: 'A exportação trava em 99%. Vocês podem…',
    time: 'Ontem',
    priority: 'medium',
    category: 'technical',
    status: 'open',
    owner: null,
    sla: 'Responder em 52m',
    created: '14 jun 2026 · 17:40',
    lastReply: '—',
    location: 'Belo Horizonte, MG',
    since: 'Cliente desde nov 2024',
    plan: 'Plano Business · Mensal',
    tags: [{
      label: 'Média',
      tone: 'medium'
    }, {
      label: 'Técnico'
    }],
    related: [],
    thread: [{
      author: 'Rafael Souza',
      time: 'Ontem, 17:40',
      role: 'customer',
      body: ['A exportação trava em 99%. Vocês podem verificar? Tentei em dois navegadores.']
    }]
  }, {
    id: 'AX-41771',
    name: 'Lina Chen',
    email: 'lina.chen@email.com',
    subject: 'Link de convite não funciona',
    preview: 'O link de convite da equipe aparece como inválido…',
    time: 'Ontem',
    priority: 'high',
    category: 'onboarding',
    status: 'open',
    owner: 'me',
    sla: 'Responder em 1h 05m',
    created: '14 jun 2026 · 15:12',
    lastReply: '14 jun 2026 · 15:30',
    location: 'Porto Alegre, RS',
    since: 'Cliente desde jun 2026',
    plan: 'Plano Pro · Mensal',
    tags: [{
      label: 'Alta',
      tone: 'high'
    }, {
      label: 'Onboarding'
    }],
    related: [],
    thread: [{
      author: 'Lina Chen',
      time: 'Ontem, 15:12',
      role: 'customer',
      body: ['O link de convite da equipe aparece como inválido para todo mundo que tento adicionar.']
    }]
  }, {
    id: 'AX-41702',
    name: 'Marcos Lima',
    email: 'marcos.lima@email.com',
    subject: 'Reembolso de cobrança duplicada',
    preview: 'Fui cobrado duas vezes pelo plano Pro…',
    time: '14 jun',
    priority: 'medium',
    category: 'billing',
    status: 'solved',
    owner: null,
    sla: 'Concluído',
    created: '14 jun 2026 · 09:05',
    lastReply: '14 jun 2026 · 11:20',
    location: 'Recife, PE',
    since: 'Cliente desde jan 2022',
    plan: 'Plano Pro · Mensal',
    tags: [{
      label: 'Faturamento',
      tone: 'blue'
    }, {
      label: 'Reembolso'
    }],
    related: [],
    thread: [{
      author: 'Marcos Lima',
      time: '14 jun, 09:05',
      role: 'customer',
      body: ['Fui cobrado duas vezes pelo plano Pro este mês.']
    }, {
      author: 'Marina Costa',
      time: '14 jun, 11:20',
      role: 'agent',
      body: ['Oi, Marcos! O reembolso da cobrança duplicada foi processado e aparece na sua fatura em até 5 dias úteis.']
    }]
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helpdesk/data.js", error: String((e && e.message) || e) }); }

// ui_kits/helpdesk/helpers.js
try { (() => {
// Shared helpers + mock store for the Atendix helpdesk UI kit.
window.ATX_UTIL = {
  PRI: {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa'
  },
  CAT: {
    access: 'Acesso à conta',
    billing: 'Faturamento',
    technical: 'Técnico',
    product: 'Feedback de produto',
    onboarding: 'Onboarding'
  },
  STATUS: {
    open: {
      label: 'Aberto',
      tone: 'danger'
    },
    pending: {
      label: 'Pendente',
      tone: 'attention'
    },
    solved: {
      label: 'Resolvido',
      tone: 'positive'
    }
  },
  listTags: function (t) {
    var catTone = t.category === 'billing' ? 'violet' : t.category === 'product' ? 'blue' : 'neutral';
    return [{
      label: this.PRI[t.priority],
      tone: t.priority
    }, {
      label: this.CAT[t.category],
      tone: catTone
    }];
  },
  panelTags: function (t) {
    return t.tags.filter(function (x) {
      return ['high', 'medium', 'low'].indexOf(x.tone) === -1;
    });
  }
};
window.useTicketStore = function () {
  var D = window.ATX_DATA;
  var st = React.useState(D.tickets);
  var tickets = st[0],
    setTickets = st[1];
  var update = function (id, patch) {
    setTickets(function (ts) {
      return ts.map(function (t) {
        return t.id === id ? Object.assign({}, t, typeof patch === 'function' ? patch(t) : patch) : t;
      });
    });
  };
  var send = function (id, text, mode) {
    update(id, function (t) {
      return {
        thread: t.thread.concat([{
          author: D.agent.name,
          time: 'Agora',
          role: mode === 'note' ? 'note' : 'agent',
          body: text.split(/\n{2,}/)
        }]),
        lastReply: 'Agora',
        preview: mode === 'note' ? t.preview : text.slice(0, 60),
        unread: false
      };
    });
  };
  var create = function () {
    var n = 41828 + Math.floor(Math.random() * 100);
    var nt = {
      id: 'AX-' + n,
      name: 'Novo cliente',
      email: 'sem e-mail',
      subject: 'Novo ticket',
      preview: 'Rascunho',
      time: 'Agora',
      priority: 'medium',
      category: 'access',
      status: 'open',
      owner: 'me',
      sla: 'Responder em 8h',
      created: 'Agora',
      lastReply: '—',
      location: '—',
      since: 'Novo cliente',
      plan: 'Sem plano',
      tags: [],
      related: [],
      thread: []
    };
    setTickets(function (ts) {
      return [nt].concat(ts);
    });
    return nt.id;
  };
  return {
    tickets: tickets,
    update: update,
    send: send,
    create: create
  };
};
window.ATX_Body = function (props) {
  return React.createElement(React.Fragment, null, props.lines.map(function (p, i) {
    var parts = p.split('\n');
    return React.createElement('p', {
      key: i,
      style: {
        margin: i === props.lines.length - 1 ? 0 : '0 0 10px'
      }
    }, parts.map(function (s, j) {
      return j ? [React.createElement('br', {
        key: 'b' + j
      }), s] : s;
    }));
  }));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helpdesk/helpers.js", error: String((e && e.message) || e) }); }

__ds_ns.Composer = __ds_scope.Composer;

__ds_ns.Message = __ds_scope.Message;

__ds_ns.SuggestedReplies = __ds_scope.SuggestedReplies;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.STATUS_TONE = __ds_scope.STATUS_TONE;

__ds_ns.StatusPill = __ds_scope.StatusPill;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.BottomNav = __ds_scope.BottomNav;

__ds_ns.NavItem = __ds_scope.NavItem;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.CustomerSummary = __ds_scope.CustomerSummary;

__ds_ns.DetailRow = __ds_scope.DetailRow;

__ds_ns.KpiCard = __ds_scope.KpiCard;

__ds_ns.PanelSection = __ds_scope.PanelSection;

__ds_ns.RelatedTicket = __ds_scope.RelatedTicket;

__ds_ns.TicketRow = __ds_scope.TicketRow;

})();
