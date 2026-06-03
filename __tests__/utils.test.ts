import { formatCurrency, formatDate, slugify } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats numbers as INR currency', () => {
      expect(formatCurrency(1000)).toBe('₹1,000');
      expect(formatCurrency(0)).toBe('₹0');
    });
  });

  describe('formatDate', () => {
    it('formats a date to Indian English format', () => {
      const date = new Date('2026-05-31T00:00:00Z');
      expect(formatDate(date)).toContain('2026');
      expect(formatDate(date)).toContain('May');
    });
  });

  describe('slugify', () => {
    it('converts strings to URL-friendly slugs', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('Track 01: Action & Adventure')).toBe('track-01-action-adventure');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });
  });
});
