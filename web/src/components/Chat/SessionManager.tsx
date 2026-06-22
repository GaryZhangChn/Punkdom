import { useState } from 'react'
import { Edit3, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SessionSummary } from '@/lib/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SessionManagerProps {
  sessions: SessionSummary[]
  activeSessionId: string
  disabled?: boolean
  onCreate: (title?: string) => void | Promise<void>
  onSwitch: (id: string) => void | Promise<void>
  onRename: (id: string, title: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
}

/** 会话管理面板，提供创建、切换、重命名和删除当前 workspace 内的会话。 */
export function SessionManager({
  sessions,
  activeSessionId,
  disabled = false,
  onCreate,
  onSwitch,
  onRename,
  onDelete,
}: SessionManagerProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const activeSession = sessions.find(session => session.id === activeSessionId) ||
    sessions.find(session => session.active) ||
    sessions[0]

  const beginRename = () => {
    if (!activeSession) return
    setIsEditing(true)
    setDraftTitle(activeSession.title)
  }

  const submitRename = async () => {
    const title = draftTitle.trim()
    if (!activeSession || !title) {
      setIsEditing(false)
      return
    }
    await onRename(activeSession.id, title)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!activeSession || sessions.length <= 1) return
    await onDelete(activeSession.id)
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5">
      <span className="shrink-0 text-[11px] font-medium text-[var(--punkdom-text-muted)]">{t('chat.view.sessions')}</span>
      {isEditing && activeSession ? (
        <input
          autoFocus
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          onBlur={() => void submitRename()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void submitRename()
            if (event.key === 'Escape') setIsEditing(false)
          }}
          className="min-w-0 flex-1 rounded border border-[var(--punkdom-border)] bg-[var(--punkdom-surface)] px-2 py-0.5 text-xs text-[var(--punkdom-text)] outline-none"
          aria-label={t('chat.sessionTitle')}
        />
      ) : (
        <Select
          value={activeSession?.id || ''}
          disabled={disabled || sessions.length === 0}
          onValueChange={(id) => void onSwitch(id)}
        >
          <SelectTrigger
            size="sm"
            className="min-w-0 flex-1 border-[var(--punkdom-border)] bg-[var(--punkdom-surface-2)] px-2 py-0.5 text-xs text-[var(--punkdom-text)] outline-none hover:bg-[var(--punkdom-hover)] focus:ring-0"
            aria-label={t('chat.selectSession')}
            title={activeSession ? `${activeSession.title} · ${t('common.messages', { count: activeSession.message_count })}` : t('chat.noSession')}
          >
            <SelectValue placeholder={t('chat.noSession')} />
          </SelectTrigger>
          <SelectContent className="border-[var(--punkdom-border)] bg-[var(--punkdom-menu-bg)] text-[var(--punkdom-text)]">
            {sessions.length === 0 ? (
              <SelectItem value="empty" disabled>{t('chat.noSession')}</SelectItem>
            ) : sessions.map(session => (
              <SelectItem key={session.id} value={session.id}>
                {session.title || t('chat.newSession')} · {t('chat.sessionCountShort', { count: session.message_count })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => void onCreate()}
          className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[11px] text-[var(--punkdom-text-muted)] hover:bg-[var(--punkdom-hover)] hover:text-[var(--punkdom-text)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={t('chat.newSession')}
        >
          <Plus className="h-3 w-3" />
        </button>
        <button
          type="button"
          disabled={disabled || !activeSession}
          onClick={beginRename}
          className="rounded p-0.5 text-[var(--punkdom-text-muted)] hover:bg-[var(--punkdom-hover)] hover:text-[var(--punkdom-text)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={activeSession ? `${t('chat.renameSession')} ${activeSession.title}` : t('chat.renameSession')}
        >
          <Edit3 className="h-3 w-3" />
        </button>
        <button
          type="button"
          disabled={disabled || !activeSession || sessions.length <= 1}
          onClick={() => void handleDelete()}
          className="rounded p-0.5 text-[var(--punkdom-text-muted)] hover:bg-[var(--punkdom-danger-bg)] hover:text-[var(--punkdom-danger)] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={activeSession ? `${t('chat.deleteSession')} ${activeSession.title}` : t('chat.deleteSession')}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
