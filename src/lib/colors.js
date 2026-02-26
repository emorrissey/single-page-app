// Symptom color palette — cycles through as users add new symptoms
export const SYMPTOM_COLORS = [
  '#8B5CF6', // purple
  '#F97316', // orange
  '#14B8A6', // teal
  '#3B82F6', // blue
  '#EC4899', // pink
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#6366F1', // indigo
  '#84CC16', // lime
]

export function getNextColor(existingCount) {
  return SYMPTOM_COLORS[existingCount % SYMPTOM_COLORS.length]
}
