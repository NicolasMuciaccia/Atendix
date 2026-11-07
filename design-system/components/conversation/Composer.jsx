import React from 'react';
import { Button } from '../core/Button.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Checkbox } from '../forms/Checkbox.jsx';
import { Tabs } from '../navigation/Tabs.jsx';

const TOOL_LABELS = { paperclip: 'Anexar arquivo', smile: 'Emoji', 'pen-line': 'Assinatura', image: 'Imagem', link: 'Link', bold: 'Negrito', italic: 'Itálico', sparkles: 'Sugerir com IA' };

export function Composer({
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
  style,
}) {
  const [innerMode, setInnerMode] = React.useState(defaultMode);
  const [innerVal, setInnerVal] = React.useState('');
  const m = mode !== undefined ? mode : innerMode;
  const v = value !== undefined ? value : innerVal;
  const isNote = m === 'note';
  const setMode = (id) => { setInnerMode(id); onModeChange && onModeChange(id); };
  const setVal = (t) => { setInnerVal(t); onChange && onChange(t); };
  const send = () => { if (!v.trim()) return; onSend && onSend(v, m); if (value === undefined) setInnerVal(''); };

  return (
    <div style={{ background: 'var(--white)', border: '1px solid ' + (isNote ? 'var(--amber-100)' : 'var(--border-default)'), borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden', fontFamily: 'var(--font-sans)', ...style }}>
      <div style={{ padding: '0 16px', background: 'var(--surface-muted)' }}>
        <Tabs
          items={[{ id: 'reply', label: replyLabel }, { id: 'note', label: noteLabel }]}
          value={m}
          onChange={setMode}
          style={{ borderBottom: 'none', gap: 22 }}
        />
      </div>
      <textarea
        value={v}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(); }}
        placeholder={isNote ? notePlaceholder : placeholder}
        rows={3}
        style={{ display: 'block', width: '100%', minHeight: 72, resize: 'vertical', border: 0, outline: 'none', padding: '12px 16px', background: isNote ? 'var(--attention-bg)' : 'var(--white)', fontFamily: 'inherit', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)', color: 'var(--text-strong)', transition: 'background var(--duration-base) var(--ease-standard)' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 10px 10px 12px', background: isNote ? 'var(--attention-bg)' : 'var(--white)' }}>
        {tools.map((t) => <IconButton key={t} icon={t} label={TOOL_LABELS[t] || t} size="sm" />)}
        <span style={{ flex: 1 }}></span>
        <Checkbox label={internalLabel} checked={isNote} onChange={(on) => setMode(on ? 'note' : 'reply')} style={{ marginRight: 12 }} />
        <Button size="sm" iconRight="arrow-right" onClick={send} disabled={!v.trim()}>{sendLabel}</Button>
      </div>
    </div>
  );
}
