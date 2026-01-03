// app/test-types.tsx
import type { pages_home } from '@/types/i18n';

// Test that type works
const testKey: pages_home = "title"; // Should autocomplete

// Invalid key should error
// const invalidKey: PagesHomeKeys = "invalid"; // ❌ Should show error