import React from 'react';

const TONES = [
  { bg: 'var(--blue-100)', fg: 'var(--blue-700)' },
  { bg: 'var(--violet-100)', fg: 'var(--violet-600)' },
  { bg: 'var(--green-100)', fg: 'var(--green-600)' },
  { bg: 'var(--amber-100)', fg: 'var(--amber-600)' },
  { bg: 'var(--ink-150)', fg: 'var(--ink-700)' },
];

const STATUS = { online: 'var(--green-500)', away: 'var(--amber-500)', busy: 'var(--red-500)', offline: 'var(--ink-300)' };

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hash(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Avatar({ name = '', src, size = 36, status, ringColor = 'var(--white)', tone, style }) {
  const t = TONES[tone != null ? tone % TONES.length : hash(name) % TONES.length];
  const dot = Math.max(8, Math.round(size * 0.26));
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size, flexShrink: 0, ...style }}>
      {src ? (
        <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <span
          aria-label={name}
          style={{
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
            letterSpacing: '0.01em',
          }}
        >
          {initialsOf(name)}
        </span>
      )}
      {status ? (
        <span
          style={{
            position: 'absolute',
            right: -1,
            bottom: -1,
            width: dot,
            height: dot,
            borderRadius: '50%',
            background: STATUS[status] || STATUS.offline,
            boxShadow: '0 0 0 2px ' + ringColor,
          }}
        ></span>
      ) : null}
    </span>
  );
}
