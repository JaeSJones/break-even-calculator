interface StorageData {
  workDays: number;
  expenses: Record<string, number>;
}

const STORAGE_KEY = "beauticianCalculator";

export function saveCalculation(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save calculation to localStorage:", error);
  }
}

export function loadCalculation(): StorageData | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load calculation from localStorage:", error);
  }
  return null;
}

export function clearCalculation(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear calculation from localStorage:", error);
  }
}
