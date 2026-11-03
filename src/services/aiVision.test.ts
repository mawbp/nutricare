import { describe, it, expect } from 'vitest';
import { analyzeFoodImage } from './aiVision';

describe('AI Vision Service', () => {
  const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  it('provides realistic nutrition analysis via heuristic engine when no api key is present', async () => {
    const result = await analyzeFoodImage(dummyBase64);

    expect(result).toBeDefined();
    expect(result.calories).toBeGreaterThan(100);
    expect(result.calories).toBeLessThan(1200);
    expect(result.protein).toBeGreaterThan(0);
    expect(result.carbs).toBeGreaterThan(0);
    expect(result.fat).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0.7);
    expect(result.source).toBe('heuristic');
    expect(typeof result.foodName).toBe('string');
  });

  it('attempts Gemini API when key is provided and falls back gracefully on network error', async () => {
    // Provide a dummy key that fails network call
    const result = await analyzeFoodImage(dummyBase64, 'INVALID_TEST_KEY');
    
    // Should gracefully return valid analysis rather than throwing
    expect(result).toBeDefined();
    expect(result.calories).toBeGreaterThan(0);
  });
});
