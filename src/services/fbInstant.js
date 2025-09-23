
const STORAGE_KEY = 'fbinstant_mock_player_data'

function createMockStorage () {
  if (typeof window === 'undefined') {
    return {}
  }
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

function persistMockStorage (data) {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function createMock () {
  const stored = createMockStorage()
  const profile = stored.profile || {
    id: 'mock-player-id',
    name: 'Guest Player',
    photo: ''
  }
  const stats = stored.stats || {}

  const getData = (keys = []) => {
    if (!keys.length) {
      return { ...(stored.data || {}) }
    }
    const result = {}
    keys.forEach((key) => {
      if (stored.data && key in stored.data) {
        result[key] = stored.data[key]
      }
    })
    return result
  }

  const saveData = (data) => {
    stored.data = {
      ...(stored.data || {}),
      ...data
    }
    const next = {
      profile,
      stats,
      data: stored.data
    }
    persistMockStorage(next)
    return next
  }

  const mock = {
    initializeAsync: () => Promise.resolve(),
    startGameAsync: () => Promise.resolve(),
    setLoadingProgress: () => {},
    onPause: (callback) => {
      if (typeof window !== 'undefined' && typeof callback === 'function') {
        window.addEventListener('blur', callback)
      }
    },
    getLocale: () => (typeof navigator !== 'undefined' ? navigator.language || 'en_US' : 'en_US'),
    player: {
      getID: () => profile.id,
      getName: () => profile.name,
      getPhoto: () => profile.photo,
      getDataAsync: (keys) => Promise.resolve(getData(keys)),
      setDataAsync: (data) => {
        saveData(data)
        return Promise.resolve()
      },
      getConnectedPlayersAsync: () => Promise.resolve([])
    },
    context: {
      getPlayersAsync: () => Promise.resolve([])
    }
  }

  return mock
}

const fbInstant = typeof window !== 'undefined' && window.FBInstant
  ? window.FBInstant
  : createMock()

export default fbInstant
