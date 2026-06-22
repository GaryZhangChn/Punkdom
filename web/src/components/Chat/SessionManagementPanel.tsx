import { useMemo, useState } from 'react'
import { Check, Edit3, LogIn, MessageSquareText, Plus, Search, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '@/i18n'
import type { SessionSummary } from '@/lib/api'

interface SessionManagementPanelProps {
  sessions: SessionSummary[]
  activeSessionId: string
  disabled?: boolean
  onCreate: (title?: string) => void | Promise<void>
  onSwitch: (id: string) => void | Promise<void>
  onRename: (id: string, title: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
  onEnterChat: () => void
}

/** 右侧面板内的完整会话管理视图，承载搜索、切换、重命名和删除。 */
export function SessionManagementPanel({
  sessions,
  activeSessionId,
  disabled = false,
  onCreate,
  onSwitch,
  onRename,
  onDelete,
  onEnterChat,
}: SessionManagementPanelProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState('')
  const [draftTitle, setDraftTitle] = useState('')

  const filteredSessions = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const sorted = [...sessions].sort((a, b) => Date.parse(b.updated_at || b.created_at || '') - Date.parse(a.updated_at || a.created_at || ''))
    if (!keyword) return sorted
    return sorted.filter((session) => displaySessionTitle(session, t).toLowerCase().includes(keyword))
  }, [query, sessions, t])

  const activeSession = sessions.find((session) => session.id === activeSessionId) ||
    sessions.find((session) => session.active) ||
    sessions[0]

  const handleCreate = async () => {
    if (disabled) return
    await onCreate()
    onEnterChat()
  }

  const beginRename = (session: SessionSummary) => {
    setEditingId(session.id)
    setDraftTitle(displaySessionTitle(session, t))
  }

  const cancelRename = () => {
    setEditingId('')
    setDraftTitle('')
  }

  const submitRename = async (id: string) => {
    const title = draftTitle.trim()
    if (!title) {
      cancelRename()
      return
    }
    await onRename(id, title)
    cancelRename()
  }

  const handleDelete = async (id: string) => {
    if (disabled || sessions.length <= 1) return
    await onDelete(id)
  }

  const enterSession = async (id: string) => {
    if (disabled) return
    if (id !== activeSessionId) await onSwitch(id)
    onEnterChat()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--punkdom-bg)]">
      <div className="border-b border-[var(--punkdom-border)] bg-[var(--punkdom-surface)] px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--punkdom-text-faint)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="punkdom-field h-8 w-full rounded border pl-7 pr-2 text-xs outline-none"
              placeholder={t('chat.searchSessionPlaceholder')}
              aria-label={t('chat.searchSession')}
            />
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={() => void handleCreate()}
            className="punkdom-nav-item flex h-8 shrink-0 items-center gap-1.5 border border-[var(--punkdom-border)] bg-[var(--punkdom-surface-2)] px-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('chat.new')}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--punkdom-text-faint)]">
          <span>{t('chat.sessionRatio', { filtered: filteredSessions.length, total: sessions.length })}</span>
          <span className="truncate">{t('chat.currentSession', { title: activeSession ? displaySessionTitle(activeSession, t) : t('chat.noSession') })}</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {filteredSessions.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-[var(--punkdom-text-faint)]">
            {t('chat.noMatchedSession')}
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredSessions.map((session) => {
              const active = session.id === activeSessionId || session.active
              const editing = editingId === session.id
              return (
                <div
                  key={session.id}
                  className={`rounded-[var(--punkdom-radius)] border px-2.5 py-2 ${
                    active
                      ? 'border-[var(--punkdom-border)] bg-[var(--punkdom-active)]'
                      : 'border-transparent bg-[var(--punkdom-surface)] hover:border-[var(--punkdom-border)]'
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-2">
                    <MessageSquareText className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${active ? 'text-[var(--punkdom-text)]' : 'text-[var(--punkdom-text-muted)]'}`} />
                    <div className="min-w-0 flex-1">
                      {editing ? (
                        <input
                          autoFocus
                          value={draftTitle}
                          onChange={(event) => setDraftTitle(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') void submitRename(session.id)
                            if (event.key === 'Escape') cancelRename()
                          }}
                          className="punkdom-field h-7 w-full rounded border px-2 text-xs outline-none"
                          aria-label={t('chat.sessionTitle')}
                        />
                      ) : (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => void onSwitch(session.id)}
                          className="block max-w-full truncate text-left text-xs font-medium text-[var(--punkdom-text)] disabled:cursor-not-allowed"
                          title={displaySessionTitle(session, t)}
                        >
                          {displaySessionTitle(session, t)}
                        </button>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[var(--punkdom-text-faint)]">
                        <span>{t('common.messages', { count: session.message_count })}</span>
                        <span>{formatSessionTime(session.updated_at || session.created_at, t)}</span>
                        {active && <span className="rounded border border-[var(--punkdom-border)] bg-[var(--punkdom-surface-2)] px-1.5 text-[var(--punkdom-text-muted)]">{t('common.current')}</span>}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-0.5">
                      {editing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void submitRename(session.id)}
                            className="punkdom-nav-item rounded p-1"
                            aria-label={t('chat.saveSession', { title: displaySessionTitle(session, t) })}
                            title={t('common.save')}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelRename}
                            className="punkdom-nav-item rounded p-1"
                            aria-label={t('chat.cancelRename')}
                            title={t('common.cancel')}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => void enterSession(session.id)}
                            className="punkdom-nav-item rounded p-1 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={t('chat.enterSession', { title: displaySessionTitle(session, t) })}
                            title={t('chat.enterChat')}
                          >
                            <LogIn className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => beginRename(session)}
                            className="punkdom-nav-item rounded p-1 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`${t('chat.renameSession')} ${displaySessionTitle(session, t)}`}
                            title={t('common.rename')}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={disabled || sessions.length <= 1}
                            onClick={() => void handleDelete(session.id)}
                            className="punkdom-nav-item rounded p-1 hover:bg-[var(--punkdom-danger-bg)] hover:text-[var(--punkdom-danger)] disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label={`${t('chat.deleteSession')} ${displaySessionTitle(session, t)}`}
                            title={sessions.length <= 1 ? t('chat.keepOneSession') : t('common.delete')}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function displaySessionTitle(session: SessionSummary, t: (key: string) => string) {
  return session.title || t('chat.untitledSession')
}

function formatSessionTime(value: string, t: (key: string) => string) {
  const formatted = formatDateTime(value)
  return formatted || t('chat.unknownTime')
}
