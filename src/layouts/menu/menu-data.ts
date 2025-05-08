import type { MenuItem } from './menu-types'

/**
 * Default application menu structure
 * Supports up to 3 levels of nesting
 */
export const defaultMenuItems: MenuItem[] = [
  {
    id: 'file',
    label: 'File',
    children: [
      {
        id: 'file-new',
        label: 'New',
        children: [
          {
            id: 'file-new-file',
            label: 'File',
            shortcut: 'Ctrl+N',
            action: () => console.log('New file'),
          },
          {
            id: 'file-new-folder',
            label: 'Folder',
            shortcut: 'Ctrl+Shift+N',
            action: () => console.log('New folder'),
          },
          {
            id: 'file-new-window',
            label: 'Window',
            shortcut: 'Ctrl+Shift+W',
            action: () => console.log('New window'),
          },
        ],
      },
      {
        id: 'file-open',
        label: 'Open',
        children: [
          {
            id: 'file-open-file',
            label: 'File...',
            shortcut: 'Ctrl+O',
            action: () => console.log('Open file'),
          },
          {
            id: 'file-open-folder',
            label: 'Folder...',
            shortcut: 'Ctrl+K Ctrl+O',
            action: () => console.log('Open folder'),
          },
          {
            id: 'file-open-workspace',
            label: 'Workspace...',
            action: () => console.log('Open workspace'),
          },
        ],
      },
      { id: 'file-sep-1', label: '', separator: true },
      { id: 'file-save', label: 'Save', shortcut: 'Ctrl+S', action: () => console.log('Save') },
      {
        id: 'file-save-as',
        label: 'Save As...',
        shortcut: 'Ctrl+Shift+S',
        action: () => console.log('Save as'),
      },
      {
        id: 'file-save-all',
        label: 'Save All',
        shortcut: 'Ctrl+K S',
        action: () => console.log('Save all'),
      },
      { id: 'file-sep-2', label: '', separator: true },
      { id: 'file-exit', label: 'Exit', action: () => console.log('Exit') },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    children: [
      { id: 'edit-undo', label: 'Undo', shortcut: 'Ctrl+Z', action: () => console.log('Undo') },
      { id: 'edit-redo', label: 'Redo', shortcut: 'Ctrl+Y', action: () => console.log('Redo') },
      { id: 'edit-sep-1', label: '', separator: true },
      { id: 'edit-cut', label: 'Cut', shortcut: 'Ctrl+X', action: () => console.log('Cut') },
      { id: 'edit-copy', label: 'Copy', shortcut: 'Ctrl+C', action: () => console.log('Copy') },
      { id: 'edit-paste', label: 'Paste', shortcut: 'Ctrl+V', action: () => console.log('Paste') },
      { id: 'edit-sep-2', label: '', separator: true },
      { id: 'edit-find', label: 'Find', shortcut: 'Ctrl+F', action: () => console.log('Find') },
      {
        id: 'edit-replace',
        label: 'Replace',
        shortcut: 'Ctrl+H',
        action: () => console.log('Replace'),
      },
    ],
  },
  {
    id: 'view',
    label: 'View',
    children: [
      {
        id: 'view-appearance',
        label: 'Appearance',
        children: [
          {
            id: 'view-fullscreen',
            label: 'Full Screen',
            shortcut: 'F11',
            action: () => console.log('Full screen'),
          },
          {
            id: 'view-zen-mode',
            label: 'Zen Mode',
            shortcut: 'Ctrl+K Z',
            action: () => console.log('Zen mode'),
          },
          { id: 'view-appearance-sep-1', label: '', separator: true },
          {
            id: 'view-theme',
            label: 'Theme',
            children: [
              { id: 'view-theme-light', label: 'Light', action: () => console.log('Light theme') },
              { id: 'view-theme-dark', label: 'Dark', action: () => console.log('Dark theme') },
              {
                id: 'view-theme-system',
                label: 'System',
                action: () => console.log('System theme'),
              },
            ],
          },
        ],
      },
      {
        id: 'view-explorer',
        label: 'Explorer',
        shortcut: 'Ctrl+Shift+E',
        action: () => console.log('Explorer'),
      },
      {
        id: 'view-search',
        label: 'Search',
        shortcut: 'Ctrl+Shift+F',
        action: () => console.log('Search'),
      },
      {
        id: 'view-git',
        label: 'Source Control',
        shortcut: 'Ctrl+Shift+G',
        action: () => console.log('Git'),
      },
      {
        id: 'view-terminal',
        label: 'Terminal',
        shortcut: 'Ctrl+`',
        action: () => console.log('Terminal'),
      },
    ],
  },
  {
    id: 'navigate',
    label: 'Navigate',
    children: [
      {
        id: 'navigate-back',
        label: 'Back',
        shortcut: 'Alt+Left',
        action: () => console.log('Navigate back'),
      },
      {
        id: 'navigate-forward',
        label: 'Forward',
        shortcut: 'Alt+Right',
        action: () => console.log('Navigate forward'),
      },
      { id: 'navigate-sep-1', label: '', separator: true },
      {
        id: 'navigate-file',
        label: 'Go to File...',
        shortcut: 'Ctrl+P',
        action: () => console.log('Go to file'),
      },
      {
        id: 'navigate-symbol',
        label: 'Go to Symbol...',
        shortcut: 'Ctrl+Shift+O',
        action: () => console.log('Go to symbol'),
      },
    ],
  },
  {
    id: 'code',
    label: 'Code',
    children: [
      {
        id: 'code-comment',
        label: 'Toggle Comment',
        shortcut: 'Ctrl+/',
        action: () => console.log('Toggle comment'),
      },
      {
        id: 'code-format',
        label: 'Format Document',
        shortcut: 'Shift+Alt+F',
        action: () => console.log('Format document'),
      },
      { id: 'code-sep-1', label: '', separator: true },
      {
        id: 'code-folding',
        label: 'Folding',
        children: [
          {
            id: 'code-fold',
            label: 'Fold',
            shortcut: 'Ctrl+Shift+[',
            action: () => console.log('Fold'),
          },
          {
            id: 'code-unfold',
            label: 'Unfold',
            shortcut: 'Ctrl+Shift+]',
            action: () => console.log('Unfold'),
          },
          {
            id: 'code-fold-all',
            label: 'Fold All',
            shortcut: 'Ctrl+K Ctrl+0',
            action: () => console.log('Fold all'),
          },
          {
            id: 'code-unfold-all',
            label: 'Unfold All',
            shortcut: 'Ctrl+K Ctrl+J',
            action: () => console.log('Unfold all'),
          },
        ],
      },
    ],
  },
  {
    id: 'run',
    label: 'Run',
    children: [
      {
        id: 'run-start',
        label: 'Start Debugging',
        shortcut: 'F5',
        action: () => console.log('Start debugging'),
      },
      {
        id: 'run-without',
        label: 'Run Without Debugging',
        shortcut: 'Ctrl+F5',
        action: () => console.log('Run without debugging'),
      },
      {
        id: 'run-stop',
        label: 'Stop Debugging',
        shortcut: 'Shift+F5',
        action: () => console.log('Stop debugging'),
      },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    children: [
      {
        id: 'tools-extensions',
        label: 'Extensions',
        shortcut: 'Ctrl+Shift+X',
        action: () => console.log('Extensions'),
      },
      { id: 'tools-sep-1', label: '', separator: true },
      {
        id: 'tools-settings',
        label: 'Settings',
        shortcut: 'Ctrl+,',
        action: () => console.log('Settings'),
      },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    children: [
      { id: 'help-welcome', label: 'Welcome', action: () => console.log('Welcome') },
      { id: 'help-docs', label: 'Documentation', action: () => console.log('Documentation') },
      { id: 'help-sep-1', label: '', separator: true },
      { id: 'help-about', label: 'About', action: () => console.log('About') },
    ],
  },
]
