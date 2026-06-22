import { History, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export type VersionItem = {
  id: string
  title: string
  description?: string
  createdAt: string
  author?: string
}

interface VersionTimelineProps {
  versions: VersionItem[]
  selectedVersionId?: string
  loading?: boolean
  canRollback?: boolean
  onSelectVersion?: (version: VersionItem) => void
  onOpenDiff?: (version: VersionItem) => void
  onRollback?: (version: VersionItem) => void
}

/** 版本时间线，只负责展示版本列表并通过 props 抛出用户操作。 */
export function VersionTimeline({
  versions,
  selectedVersionId,
  loading = false,
  canRollback = true,
  onSelectVersion,
  onOpenDiff,
  onRollback,
}: VersionTimelineProps) {
  const { t } = useTranslation()
  if (versions.length === 0) {
    return <div className="rounded bg-[var(--punkdom-surface)] px-2 py-2 text-[var(--punkdom-text-faint)]">{t('versions.historyEmpty')}</div>
  }

  return (
    <div className="space-y-1 border-l border-[var(--punkdom-border)] pl-2">
      {versions.map((version) => {
        const selected = version.id === selectedVersionId
        return (
          <div
            key={version.id}
            className={`relative rounded px-1.5 py-1 hover:bg-[var(--punkdom-hover)] ${selected ? 'bg-[var(--punkdom-active)]' : ''}`}
          >
            <span className="absolute -left-[13px] top-2 h-2 w-2 rounded-full bg-[var(--punkdom-active)]" />
            <button
              type="button"
              className="w-full text-left"
              onClick={() => onSelectVersion?.(version)}
            >
              <div className="flex items-center gap-1 truncate text-[var(--punkdom-text)]" title={version.title}>
                <History className="h-3 w-3 shrink-0 text-[var(--punkdom-text-muted)]" />
                <span className="truncate">{version.title || t('versions.emptyMessage')}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--punkdom-text-faint)]">
                {version.description && <span className="font-mono text-[var(--punkdom-text-muted)]">{version.description}</span>}
                {version.author && <span className="min-w-0 flex-1 truncate">{version.author}</span>}
              </div>
              <div className="mt-0.5 truncate text-[10px] text-[var(--punkdom-text-faint)]">{version.createdAt}</div>
            </button>
            <div className="mt-1 flex items-center gap-1">
              {onOpenDiff && (
                <button
                  type="button"
                  className="rounded px-1.5 py-0.5 text-[11px] text-[var(--punkdom-text-muted)] hover:bg-[var(--punkdom-hover)] hover:text-[var(--punkdom-text)]"
                  onClick={() => onOpenDiff(version)}
                >
                  Diff
                </button>
              )}
              {onRollback && (
                <button
                  type="button"
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-[var(--punkdom-text-muted)] hover:bg-[var(--punkdom-hover)] hover:text-[var(--punkdom-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => onRollback(version)}
                  disabled={loading || !canRollback}
                  title={!canRollback ? t('versions.rollbackDisabled') : t('versions.rollbackTo')}
                >
                  <RotateCcw className="h-3 w-3" />
                  {t('versions.rollback')}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
