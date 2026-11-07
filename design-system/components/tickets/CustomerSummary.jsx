import React from 'react';
import { Avatar } from '../core/Avatar.jsx';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { TextLink } from '../core/TextLink.jsx';

export function CustomerSummary({ name, email, avatarSrc, details = [], profileLabel = 'Ver perfil completo', onViewProfile, onMore, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: 'var(--font-sans)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={name} src={avatarSrc} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-strong)' }}>{name}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</div>
        </div>
        {onMore ? <IconButton icon="ellipsis" label="Mais ações" variant="outline" size="sm" onClick={onMore} /> : null}
      </div>
      {details.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {details.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--text-sm)', color: 'var(--ink-600)' }}>
              <Icon name={d.icon} size={14} color="var(--ink-400)" />
              <span>{d.label}</span>
            </div>
          ))}
        </div>
      ) : null}
      {onViewProfile ? <TextLink arrow onClick={onViewProfile}>{profileLabel}</TextLink> : null}
    </div>
  );
}
