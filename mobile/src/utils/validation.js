export function validateIncident(input) {
  const errors = {};
  if (!input.title || input.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }
  if (!input.description || input.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }
  if (!input.category) {
    errors.category = 'Category is required.';
  }
  if (!input.severity) {
    errors.severity = 'Severity is required.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export function getSeverityLabel(value) {
  if (value === 'high') return 'High';
  if (value === 'medium') return 'Medium';
  return 'Low';
}

export function getSeverityColor(value) {
  if (value === 'high') return '#E53935';
  if (value === 'medium') return '#FB8C00';
  return '#43A047';
}
