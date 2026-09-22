import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import multiplayer from '@/store/multiplayer'
import { MatchmakingService } from '@/services/matchmaking'
import MultiplayerLobby from '@/views/MultiplayerLobby.vue'

// ── MatchmakingService contract tests ──────────────────────────────

const BASE = `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_API_BASE_URL}`
const PREFIX = 'verbapix'

function mockResponse(data, ok = true) {
  return Promise.resolve({ ok, status: ok ? 200 : 400, json: () => Promise.resolve(data), text: () => Promise.resolve(JSON.stringify(data)) })
}

describe('MatchmakingService (T17 contract)', () => {
  beforeEach(() => { global.fetch = vi.fn() })

  it('quickMatch POSTs to /game/verbapix/quick-match', async () => {
    global.fetch.mockResolvedValue(mockResponse({ room: { code: 'ABC123', host_id: 'u1', participants: [] } }))
    await MatchmakingService.quickMatch()
    expect(global.fetch).toHaveBeenCalledWith(`${BASE}/game/${PREFIX}/quick-match`, expect.objectContaining({ method: 'POST' }))
  })

  it('createRoom POSTs room options', async () => {
    global.fetch.mockResolvedValue(mockResponse({ room: { id: 12, code: 'XYZ789', participants: [] } }))
    await MatchmakingService.createRoom({ name: 'Test Room', maxPlayers: 4, isPublic: true })
    const [, opts] = global.fetch.mock.calls[0]
    expect(opts.method).toBe('POST')
    expect(JSON.parse(opts.body)).toEqual({ name: 'Test Room', max_players: 4, is_public: true })
  })

  it('getRoom reads the authoritative room state by ID', async () => {
    global.fetch.mockResolvedValue(mockResponse({ room: { id: 12, code: 'XYZ789', participants: [] } }))
    await MatchmakingService.getRoom(12)
    expect(global.fetch).toHaveBeenCalledWith(`${BASE}/game/${PREFIX}/rooms/12`, expect.objectContaining({ method: 'GET' }))
  })

  it('joinRoom POSTs to /game/verbapix/rooms/{id}/join', async () => {
    global.fetch.mockResolvedValue(mockResponse({ room: { code: 'ABC123', participants: [] } }))
    await MatchmakingService.joinRoom('r1')
    expect(global.fetch).toHaveBeenCalledWith(`${BASE}/game/${PREFIX}/rooms/r1/join`, expect.objectContaining({ method: 'POST' }))
  })

  it('joinByCode POSTs { code }', async () => {
    global.fetch.mockResolvedValue(mockResponse({ room: { code: 'ABC123', participants: [] } }))
    await MatchmakingService.joinByCode('ABC123')
    const [, opts] = global.fetch.mock.calls[0]
    expect(JSON.parse(opts.body)).toEqual({ code: 'ABC123' })
  })

  it('startGame POSTs to /rooms/{id}/start', async () => {
    global.fetch.mockResolvedValue(mockResponse({ room: { status: 'active' } }))
    await MatchmakingService.startGame('r1')
    expect(global.fetch).toHaveBeenCalledWith(`${BASE}/game/${PREFIX}/rooms/r1/start`, expect.objectContaining({ method: 'POST' }))
  })

  it('submitTurn POSTs { card_ids }', async () => {
    global.fetch.mockResolvedValue(mockResponse({ score: 10 }))
    await MatchmakingService.submitTurn('r1', ['c1', 'c2'])
    const [, opts] = global.fetch.mock.calls[0]
    expect(JSON.parse(opts.body)).toEqual({ card_ids: ['c1', 'c2'] })
  })

  it('throws on non-ok response', async () => {
    global.fetch.mockResolvedValue(mockResponse({ message: 'nope' }, false))
    await expect(MatchmakingService.quickMatch()).rejects.toThrow(/failed/)
  })
})

// ── Multiplayer store actions tests ────────────────────────────────

function makeStore() {
  return createStore({
    modules: {
      multiplayer: { ...multiplayer, namespaced: true, state: () => ({ ...multiplayer.state, roomId: null, roomCode: null, players: [], gameStatus: 'lobby', connectionStatus: 'disconnected', isHost: false }) },
      player: { namespaced: true, state: { playerData: { id: 'u1', name: 'Test' } } }
    }
  })
}

describe('Multiplayer actions (T17)', () => {
  beforeEach(() => { global.fetch = vi.fn() })

  it('createRoom commits room state on success', async () => {
    global.fetch.mockResolvedValue(mockResponse({
      room: { id: 12, code: 'ABC123', host_id: 'u1', participants: [{ user_id: 'u1', name: 'Test', status: 'ready' }] }
    }))
    const store = makeStore()
    const code = await store.dispatch('multiplayer/createRoom', { name: 'Test' })
    expect(code).toBe('ABC123')
    expect(store.state.multiplayer.roomCode).toBe('ABC123')
    expect(store.state.multiplayer.roomId).toBe(12)
    expect(store.state.multiplayer.isHost).toBe(true)
    expect(store.state.multiplayer.gameStatus).toBe('lobby')
  })

  it('createRoom sets connectionStatus to disconnected on failure', async () => {
    global.fetch.mockRejectedValue(new Error('network'))
    const store = makeStore()
    await expect(store.dispatch('multiplayer/createRoom', { name: 'Test' })).rejects.toThrow('network')
    expect(store.state.multiplayer.connectionStatus).toBe('disconnected')
  })

  it('joinRoom commits joined room state', async () => {
    global.fetch.mockResolvedValue(mockResponse({
      room: { id: 22, code: 'XYZ789', host_id: 'u2', participants: [{ user_id: 'u1', name: 'Test', status: 'ready' }] }
    }))
    const store = makeStore()
    await store.dispatch('multiplayer/joinRoom', 'r1')
    expect(store.state.multiplayer.roomCode).toBe('XYZ789')
    expect(store.state.multiplayer.isHost).toBe(false)
  })

  it('quickMatch sets host when host_id matches', async () => {
    global.fetch.mockResolvedValue(mockResponse({
      room: { id: 31, code: 'QM1', host_id: 'u1', participants: [{ user_id: 'u1', name: 'Test', status: 'ready' }] }
    }))
    const store = makeStore()
    await store.dispatch('multiplayer/quickMatch')
    expect(store.state.multiplayer.isHost).toBe(true)
  })

  it('startGame delegates to MatchmakingService.startGame', async () => {
    global.fetch.mockResolvedValue(mockResponse({ room: { status: 'active' } }))
    const store = makeStore()
    store.commit('multiplayer/setRoomId', 12)
    store.commit('multiplayer/setIsHost', true)
    await store.dispatch('multiplayer/startGame')
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/rooms/12/start'), expect.any(Object))
  })

  it('submitTurn delegates to MatchmakingService.submitTurn', async () => {
    global.fetch.mockResolvedValue(mockResponse({ score: 10 }))
    const store = makeStore()
    store.commit('multiplayer/setRoomId', 12)
    const result = await store.dispatch('multiplayer/submitTurn', ['c1', 'c2'])
    expect(result.score).toBe(10)
  })

  it('leaveRoom clears local state without inventing a backend endpoint', async () => {
    const store = makeStore()
    store.commit('multiplayer/setRoomId', 12)
    store.commit('multiplayer/setRoomCode', 'r1')
    store.commit('multiplayer/setPlayers', [{ id: 'u1', name: 'Test' }])
    store.commit('multiplayer/setGameStatus', 'playing')
    store.commit('multiplayer/setConnectionStatus', 'connected')
    await store.dispatch('multiplayer/leaveRoom')
    expect(global.fetch).not.toHaveBeenCalled()
    expect(store.state.multiplayer.roomId).toBeNull()
    expect(store.state.multiplayer.roomCode).toBeNull()
    expect(store.state.multiplayer.players).toEqual([])
    expect(store.state.multiplayer.gameStatus).toBe('lobby')
  })
})

describe('Multiplayer lobby room identity', () => {
  it('uses the numeric room ID rather than the invite code', () => {
    const vm = {
      $route: { query: {} },
      $store: { state: { multiplayer: { roomId: 12, roomCode: 'ABC123' } } }
    }
    expect(MultiplayerLobby.computed.roomId.call(vm)).toBe(12)
  })
})
