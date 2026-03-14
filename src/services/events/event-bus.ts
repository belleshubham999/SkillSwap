export type AppEvent =
  | { type: 'application.created'; payload: { projectId: string; founderId: string } }
  | { type: 'application.accepted'; payload: { projectId: string; developerId: string } }
  | { type: 'milestone.updated'; payload: { matchId: string; status: string } }
  | { type: 'message.created'; payload: { matchId: string; receiverId: string } };

const listeners = new Map<AppEvent['type'], Array<(event: AppEvent) => void>>();

export const eventBus = {
  emit(event: AppEvent) {
    listeners.get(event.type)?.forEach((cb) => cb(event));
  },
  on<T extends AppEvent['type']>(type: T, cb: (event: Extract<AppEvent, { type: T }>) => void) {
    const existing = listeners.get(type) ?? [];
    listeners.set(type, [...existing, cb as (event: AppEvent) => void]);
    return () => listeners.set(type, (listeners.get(type) ?? []).filter((x) => x !== cb));
  }
};
