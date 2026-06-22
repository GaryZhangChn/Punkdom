import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface InlineErrorNoticeProps {
  message: string
  title?: string
  className?: string
}

/** InlineErrorNotice 用于 IDE 面板内的紧凑错误提示。 */
export function InlineErrorNotice({ message, title, className = '' }: InlineErrorNoticeProps) {
  const { t } = useTranslation()
  const displayTitle = title ?? t('inlineError.defaultTitle')
  return (
    <div className={`flex items-start gap-2 rounded-[var(--punkdom-radius)] border border-[var(--punkdom-border)] bg-[var(--punkdom-surface)] px-2.5 py-2 text-xs leading-5 text-[var(--punkdom-text-muted)] shadow-[var(--punkdom-shadow)] ${className}`}>
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[var(--punkdom-danger-border)] bg-[var(--punkdom-danger-bg)] text-[var(--punkdom-danger)]">
        <AlertTriangle className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="mr-1 font-medium text-[var(--punkdom-text)]">{displayTitle}</span>
        <span className="break-words text-[var(--punkdom-text-muted)]">{message}</span>
      </span>
    </div>
  )
}
