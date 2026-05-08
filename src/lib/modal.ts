/**
 * Modal utilities for creating and managing modal dialogs
 */

/** Size configurations */
export const MODAL_SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-3xl',
} as const;

export type ModalSize = keyof typeof MODAL_SIZES;

/** Default modal configuration */
export interface ModalConfig {
  id: string;
  title: string;
  size?: ModalSize;
  showClose?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  onClose?: () => void;
}

/**
 * Creates inline modal HTML string for dynamic modal creation
 *
 * @example
 * const html = createModalHtml({
 *   id: 'confirm-delete',
 *   title: 'Delete Item?',
 *   content: '<p>Are you sure?</p>',
 *   actions: [
 *     { label: 'Cancel', onClick: 'closeDeleteModal()', variant: 'outline' },
 *     { label: 'Delete', onClick: 'handleDelete()', variant: 'primary', danger: true }
 *   ]
 * });
 */
export function createModalHtml({
  id,
  title,
  content = '',
  actions = [],
  size = 'md',
  showClose = true,
}: {
  id: string;
  title?: string;
  content?: string;
  actions?: ModalAction[];
  size?: ModalSize;
  showClose?: boolean;
}): string {
  const maxWidth = MODAL_SIZES[size] || MODAL_SIZES.md;

  const actionsHtml = actions.length > 0
    ? `<div class="modal-actions flex gap-2 pt-4">
        ${actions.map(action => {
          const baseClasses = 'flex-1 py-2 rounded-md transition-opacity text-sm font-medium';
          let variantClasses = 'border hover:bg-muted';

          if (action.variant === 'primary') {
            variantClasses = action.danger
              ? 'bg-red-500 text-white hover:opacity-90'
              : 'bg-primary text-primary-foreground hover:opacity-90';
          } else if (action.variant === 'outline') {
            variantClasses = 'border hover:bg-muted';
          }

          return `<button
            type="button"
            class="${baseClasses} ${variantClasses}"
            ${action.onClick ? `onclick="${action.onClick}"` : ''}
            ${action.id ? `id="${action.id}"` : ''}
            ${action.variant === 'primary' ? 'data-confirm-btn' : ''}
          >${action.label}</button>`;
        }).join('')}
      </div>`
    : '';

  const closeButton = showClose
    ? `<button type="button" class="modal-close-btn p-1 hover:bg-muted rounded transition-colors" aria-label="Close">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>`
    : '';

  return `<div id="${id}" class="modal-backdrop fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4" aria-modal="true" role="dialog">
  <div class="modal-content bg-card border rounded-lg w-full ${maxWidth} max-h-[90vh] overflow-y-auto">
    <div class="modal-header p-4 border-b flex items-center justify-between">
      <h2 class="text-lg font-bold">${title || ''}</h2>
      ${closeButton}
    </div>
    <div class="modal-body p-4 space-y-4">
      ${content}
      ${actionsHtml}
    </div>
  </div>
</div>`;
}

/**
 * Modal action button configuration
 */
export interface ModalAction {
  label: string;
  onClick?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  danger?: boolean;
  id?: string;
}

/** Preset confirm dialog */
export function createConfirmDialog(options: {
  id: string;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: string;
  onCancel?: string;
  danger?: boolean;
}): string {
  return createModalHtml({
    id: options.id,
    title: options.title,
    content: `<p class="text-sm text-muted-foreground">${options.message}</p>`,
    actions: [
      {
        label: options.cancelLabel || 'Cancel',
        variant: 'outline',
        onClick: options.onCancel || `hideModal('${options.id}')`,
      },
      {
        label: options.confirmLabel || 'Confirm',
        variant: 'primary',
        danger: options.danger,
        onClick: options.onConfirm || `hideModal('${options.id}')`,
      },
    ],
    size: 'sm',
  });
}

/** Preset delete confirmation dialog */
export function createDeleteDialog(options: {
  id: string;
  itemName: string;
  onConfirm?: string;
  onCancel?: string;
}): string {
  return createConfirmDialog({
    id: options.id,
    title: 'Delete Item?',
    message: `Are you sure you want to delete "${escapeHtml(options.itemName)}"? This action cannot be undone.`,
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    danger: true,
    onConfirm: options.onConfirm,
    onCancel: options.onCancel,
  });
}

/** Inject modal HTML into document body */
export function injectModal(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  const modal = container.firstElementChild as HTMLElement;
  document.body.appendChild(modal);

  // Initialize close handlers
  initModalHandlers(modal);

  return modal;
}

/** Remove modal from DOM */
export function removeModal(id: string): void {
  const modal = document.getElementById(id);
  if (modal) {
    modal.remove();
  }
}

/** Initialize close handlers for a modal element */
export function initModalHandlers(modal: HTMLElement): void {
  // Close button
  modal.querySelector('.modal-close-btn')?.addEventListener('click', () => {
    hideModal(modal.id);
  });

  // Backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideModal(modal.id);
    }
  });

  // Escape key
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideModal(modal.id);
    }
  });
}

/** Show modal by ID */
export function showModal(id: string): void {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

/** Hide modal by ID */
export function hideModal(id: string): void {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/** Toggle modal visibility */
export function toggleModal(id: string): void {
  const modal = document.getElementById(id);
  if (modal) {
    if (modal.classList.contains('hidden')) {
      showModal(id);
    } else {
      hideModal(id);
    }
  }
}

// Expose to window for inline onclick handlers
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).showModal = showModal;
  (window as unknown as Record<string, unknown>).hideModal = hideModal;
  (window as unknown as Record<string, unknown>).toggleModal = toggleModal;
  (window as unknown as Record<string, unknown>).createModalHtml = createModalHtml;
  (window as unknown as Record<string, unknown>).injectModal = injectModal;
  (window as unknown as Record<string, unknown>).removeModal = removeModal;
}

/** Escape HTML to prevent XSS */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}