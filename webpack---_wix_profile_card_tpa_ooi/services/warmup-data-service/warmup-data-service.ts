export interface WarmupDataService {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T) => void;
}
export const initWarmupDataService = (
  warmupDataService: WarmupDataService,
): WarmupDataService => {
  const callMap: Record<string, boolean> = {};

  return {
    get: <T>(key: string) => {
      if (callMap[key]) {
        return null;
      }

      const warmupData = warmupDataService.get<T>(key);
      callMap[key] = true;
      return warmupData;
    },
    set: (key, value) => warmupDataService.set(key, value),
  };
};
