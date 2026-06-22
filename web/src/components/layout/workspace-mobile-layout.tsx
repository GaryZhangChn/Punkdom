import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export interface MobileNavItem {
  id: string
  label: string
  icon: ReactNode
  active?: boolean
  expanded?: boolean
  disabled?: boolean
  onClick: () => void
}

interface MobileDrawer {
  id: 'project' | 'agent'
  title: string
  icon: ReactNode
  side: 'left' | 'right'
  content: ReactNode
  onOpen?: () => void
  onClose?: () => void
}

interface WorkspaceMobileLayoutProps {
  topBar: ReactNode
  main: ReactNode
  activityItems: MobileNavItem[]
  settingsItem: MobileNavItem
  projectDrawer?: MobileDrawer
  agentDrawer?: MobileDrawer
  closeLabel: string
  navigationLabel: string
}

export function WorkspaceMobileLayout({
  topBar,
  main,
  activityItems,
  settingsItem,
  projectDrawer,
  agentDrawer,
  closeLabel,
  navigationLabel,
}: WorkspaceMobileLayoutProps) {
  const [openDrawerId, setOpenDrawerId] = useState<MobileDrawer['id'] | null>(null)
  const drawers = useMemo(() => [projectDrawer, agentDrawer].filter(Boolean) as MobileDrawer[], [agentDrawer, projectDrawer])
  const openDrawer = drawers.find((drawer) => drawer.id === openDrawerId)

  useEffect(() => {
    if (!openDrawerId) return
    if (!drawers.some((drawer) => drawer.id === openDrawerId)) {
      setOpenDrawerId(null)
    }
  }, [drawers, openDrawerId])

  const closeDrawer = () => {
    openDrawer?.onClose?.()
    setOpenDrawerId(null)
  }

  const runNavAction = (action: () => void) => {
    closeDrawer()
    action()
  }

  const runDrawerAction = (drawer: MobileDrawer) => {
    if (openDrawerId === drawer.id) {
      closeDrawer()
      return
    }
    openDrawer?.onClose?.()
    drawer.onOpen?.()
    setOpenDrawerId(drawer.id)
  }

  return (
    <div data-punkdom-app-shell="true" data-punkdom-mobile-shell="true" className="flex h-dvh w-screen flex-col overflow-hidden bg-[var(--punkdom-bg)] text-[var(--punkdom-text)]">
      {topBar}
      <div className="min-h-0 flex-1 overflow-hidden">
        {main}
      </div>
      <nav className="punkdom-mobile-nav flex shrink-0 items-stretch gap-1 border-t border-[var(--punkdom-border)] bg-[var(--punkdom-surface)] px-2 py-1.5" aria-label={navigationLabel}>
        {projectDrawer ? (
          <MobileNavButton
            item={{
              id: projectDrawer.id,
              label: projectDrawer.title,
              icon: projectDrawer.icon,
              expanded: openDrawerId === projectDrawer.id,
              onClick: () => runDrawerAction(projectDrawer),
            }}
          />
        ) : null}
        <div className="punkdom-mobile-nav-scroll flex min-w-0 flex-1 items-stretch gap-1 overflow-x-auto">
          {activityItems.map((item) => (
            <MobileNavButton key={item.id} item={{ ...item, onClick: () => runNavAction(item.onClick) }} />
          ))}
        </div>
        {agentDrawer ? (
          <MobileNavButton
            item={{
              id: agentDrawer.id,
              label: agentDrawer.title,
              icon: agentDrawer.icon,
              expanded: openDrawerId === agentDrawer.id,
              onClick: () => runDrawerAction(agentDrawer),
            }}
          />
        ) : null}
        <MobileNavButton item={{ ...settingsItem, onClick: () => runNavAction(settingsItem.onClick) }} />
      </nav>
      {openDrawer ? (
        <div className={`fixed inset-0 z-50 flex ${openDrawer.side === 'right' ? 'justify-end' : 'justify-start'}`}>
          <button type="button" className="punkdom-mobile-drawer-backdrop absolute inset-0 bg-black/45" aria-label={closeLabel} onClick={closeDrawer} />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={openDrawer.title}
            className={`relative z-10 flex h-full min-h-0 w-[min(90vw,390px)] flex-col border-[var(--punkdom-border)] bg-[var(--punkdom-surface-2)] shadow-[var(--punkdom-shadow)] ${openDrawer.side === 'right' ? 'border-l' : 'border-r'}`}
          >
            <div className="punkdom-topbar flex h-11 shrink-0 items-center justify-between border-b border-[var(--punkdom-border)] px-3">
              <span className="min-w-0 truncate text-xs font-semibold text-[var(--punkdom-text)]">{openDrawer.title}</span>
              <button type="button" className="punkdom-icon-button flex h-8 w-8 items-center justify-center rounded-[var(--punkdom-radius)] text-[var(--punkdom-text-muted)] hover:text-[var(--punkdom-text)]" aria-label={closeLabel} onClick={closeDrawer}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              {openDrawer.content}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  )
}

function MobileNavButton({ item }: { item: MobileNavItem }) {
  return (
    <button
      type="button"
      className={`punkdom-mobile-nav-item flex min-h-[52px] min-w-[58px] max-w-[82px] flex-col items-center justify-center gap-0.5 rounded-[var(--punkdom-radius)] px-1.5 text-[11px] text-[var(--punkdom-text-faint)] transition-colors hover:bg-[var(--punkdom-hover)] hover:text-[var(--punkdom-text-muted)] disabled:opacity-45 ${item.active ? 'is-active bg-[var(--punkdom-active)] text-[var(--punkdom-text)]' : ''} ${item.expanded && !item.active ? 'is-expanded border border-[var(--punkdom-border)] text-[var(--punkdom-text-muted)]' : ''}`}
      disabled={item.disabled}
      aria-label={item.label}
      aria-current={item.active ? 'page' : undefined}
      aria-expanded={item.expanded || undefined}
      onClick={item.onClick}
    >
      <span className="flex h-5 w-5 items-center justify-center">{item.icon}</span>
      <span className="max-w-full truncate">{item.label}</span>
    </button>
  )
}
