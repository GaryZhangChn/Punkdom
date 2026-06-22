import type { VersionItem } from './version-timeline'
import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface RollbackDialogProps {
  open: boolean
  version?: VersionItem | null
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onRollback: (version: VersionItem) => void | Promise<void>
}

/** 回滚确认弹窗，通过二次确认避免误重置当前作品工作区。 */
export function RollbackDialog({
  open,
  version,
  loading = false,
  onOpenChange,
  onRollback,
}: RollbackDialogProps) {
  const { t } = useTranslation()
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-[var(--punkdom-border)] bg-[var(--punkdom-surface)] text-[var(--punkdom-text)]">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('versions.rollbackTitle')}</AlertDialogTitle>
          <AlertDialogDescription className="text-[var(--punkdom-text-muted)]">
            {version
              ? t('versions.rollbackDescription', { version: version.description || version.title })
              : t('versions.rollbackPickVersion')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[var(--punkdom-warning-bg)] text-[var(--punkdom-warning)] hover:bg-[var(--punkdom-warning-bg)]"
            disabled={loading || !version}
            onClick={(event) => {
              event.preventDefault()
              if (version) void onRollback(version)
            }}
          >
            {t('versions.rollbackConfirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
