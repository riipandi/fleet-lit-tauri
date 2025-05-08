import { persistentMap } from '@nanostores/persistent'

type UIStore = {
  panels: {
    explorer: {
      width: number
    }
    search: {
      width: number
    }
    git: {
      width: number
    }
    terminal: {
      height: number
      visible: boolean
      maximized: boolean // Add maximized state for terminal panel
    }
    settings: {
      width: number
    }
    chat: {
      width: number
      visible: boolean
    }
    activeLeftPanel: string | null
  }
}

/**
 * The default values for the UI store, which includes the initial state of the sidebar.
 */
const defaultUIStoreValues: UIStore = {
  panels: {
    explorer: {
      width: 300,
    },
    search: {
      width: 300,
    },
    git: {
      width: 300,
    },
    terminal: {
      height: 250,
      visible: false,
      maximized: false, // Default is not maximized
    },
    settings: {
      width: 300,
    },
    chat: {
      width: 420,
      visible: false,
    },
    activeLeftPanel: 'explorer',
  },
}

/**
 * A persistent map store for the UI state, with the default values for the sidebar state.
 * Using key-value map store. It will keep each key in separated localStorage key.
 * You can switch localStorage to any other storage for all used stores.
 * @ref: https://github.com/nanostores/persistent#persistent-engines
 */
const uiStore = persistentMap<UIStore>('ui:', defaultUIStoreValues, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

/**
 * Saves the current UI state by merging the provided partial UI store values with the
 * existing values. Deep merges partial UI store values with the existing state.
 * @param values - A partial object of the UI store values to be merged with the existing state.
 */
function saveUiState<K extends keyof UIStore>(key: K, values: Partial<UIStore[K]>) {
  const currentState = uiStore.get()
  uiStore.set({
    ...currentState,
    [key]: {
      ...currentState[key],
      ...values,
    },
  })
}

/**
 * Updates a panel's width in the UI store
 * @param panelId - The ID of the panel to update
 * @param width - The new width value
 */
function savePanelWidth(panelId: keyof UIStore['panels'], width: number) {
  const currentState = uiStore.get()

  if (panelId === 'activeLeftPanel' || panelId === 'terminal') return // Skip if trying to update activeLeftPanel or terminal

  uiStore.set({
    ...currentState,
    panels: {
      ...currentState.panels,
      [panelId]: {
        ...currentState.panels[panelId],
        width,
      },
    },
  })
}

/**
 * Updates a panel's height in the UI store
 * @param panelId - The ID of the panel to update
 * @param height - The new height value
 */
function savePanelHeight(panelId: keyof UIStore['panels'], height: number) {
  const currentState = uiStore.get()

  if (panelId === 'activeLeftPanel') return // Skip if trying to update activeLeftPanel

  uiStore.set({
    ...currentState,
    panels: {
      ...currentState.panels,
      [panelId]: {
        ...currentState.panels[panelId],
        height,
      },
    },
  })
}

/**
 * Updates the active left panel in the UI store
 * @param panelId - The ID of the active panel, or null to hide all panels
 */
function setActiveLeftPanel(panelId: string | null) {
  const currentState = uiStore.get()
  uiStore.set({
    ...currentState,
    panels: {
      ...currentState.panels,
      activeLeftPanel: panelId,
    },
  })
}

/**
 * Toggles the visibility of the terminal panel
 */
function toggleTerminalPanel() {
  const currentState = uiStore.get()
  const currentVisible = currentState.panels.terminal.visible

  uiStore.set({
    ...currentState,
    panels: {
      ...currentState.panels,
      terminal: {
        ...currentState.panels.terminal,
        visible: !currentVisible,
      },
    },
  })
}

/**
 * Toggles the maximized state of the terminal panel
 */
function toggleMaximizeTerminalPanel() {
  const currentState = uiStore.get()
  const currentMaximized = currentState.panels.terminal.maximized

  uiStore.set({
    ...currentState,
    panels: {
      ...currentState.panels,
      terminal: {
        ...currentState.panels.terminal,
        maximized: !currentMaximized,
        visible: true, // Ensure panel is visible when maximizing
      },
    },
  })
}

/**
 * Toggles the visibility of the chat panel
 */
function toggleChatPanel() {
  const currentState = uiStore.get()
  const currentVisible = currentState.panels.chat.visible

  uiStore.set({
    ...currentState,
    panels: {
      ...currentState.panels,
      chat: {
        ...currentState.panels.chat,
        visible: !currentVisible,
      },
    },
  })
}

/**
 * Resets the UI store to its default values
 */
function resetUiState() {
  uiStore.set(defaultUIStoreValues)
}

export {
  uiStore,
  defaultUIStoreValues,
  saveUiState,
  resetUiState,
  savePanelWidth,
  savePanelHeight,
  setActiveLeftPanel,
  toggleTerminalPanel,
  toggleMaximizeTerminalPanel,
  toggleChatPanel,
}

export type { UIStore }
