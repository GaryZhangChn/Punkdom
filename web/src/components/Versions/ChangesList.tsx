import type { VersionChange } from '@/lib/api'
import { useTranslation } from 'react-i18next'
import { dirName, fileName, statusColor, statusLabel, statusText } from './version-panel-utils'

interface ChangesListProps {
  changes: VersionChange[]
  onOpenDiff: (path: string) => void
}

export function ChangesList({ changes, onOpenDiff }: ChangesListProps) {
  const { t } = useTranslation()
  if (changes.length === 0) {
    return <div className="rounded bg-[var(--punkdom-surface)] px-2 py-2 text-[var(--punkdom-text-faint)]">{t('versions.noChanges')}</div>
  }
  return (
    <div className="space-y-0.5">
      {changes.map(change => (
        <button key={`${change.status}:${change.path}`} type="button" className="group flex w-full items-center gap-2 rounded px-1.5 py-1 text-left hover:bg-[var(--punkdom-hover)]" title={change.path} onClick={() => onOpenDiff(change.path)}>
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-[var(--punkdom-border)] bg-[var(--punkdom-surface-2)] text-[9px] text-[var(--punkdom-text-muted)]">{statusLabel(change.status)}</span>
          <span className="min-w-0 flex-1 truncate text-[var(--punkdom-text-muted)]">{fileName(change.path)}</span>
          <span className="truncate text-[10px] text-[var(--punkdom-text-faint)]">{dirName(change.path)}</span>
          <span className={`shrink-0 text-[11px] ${statusColor(change.status)}`}>{statusText(change.status, t)}</span>
        </button>
      ))}
    </div>
  )
}
