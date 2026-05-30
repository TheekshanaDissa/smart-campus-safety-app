import { validateIncident, getSeverityLabel } from './validation';

describe('incident validation', () => {
  test('rejects short incident report', () => {
    const result = validateIncident({ title: 'A', description: 'short', category: '', severity: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBeTruthy();
    expect(result.errors.description).toBeTruthy();
  });

  test('accepts complete incident report', () => {
    const result = validateIncident({
      title: 'Broken light',
      description: 'Broken light near library entrance.',
      category: 'Infrastructure',
      severity: 'medium'
    });
    expect(result.valid).toBe(true);
  });

  test('returns severity label', () => {
    expect(getSeverityLabel('high')).toBe('High');
  });
});
