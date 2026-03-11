/**
 * @fileoverview Pure utility functions for filtering and sorting medical logs.
 * These functions have no side effects and don't depend on React or state.
 *
 * All functions follow the same pattern:
 * - Take raw data as first argument
 * - Take options/filters as second argument
 * - Return new array (don't mutate input)
 */

/**
 * Default filter configuration
 */
export const DEFAULT_MEDICAL_LOG_FILTERS = {
  search: '',
  searchField: 'animal_name', // Field to search in
  logTypes: [], // Empty array means "all types"
  dateRange: { from: null, to: null },
  createdBy: 'all', // 'all' | 'admin' | 'foster'
  assignedAnimalIds: null, // Set of IDs for foster view (null = no filter)
};

/**
 * Check if a log matches the search term.
 * Case-insensitive, handles null/undefined.
 *
 * @param {Object} log - Medical log
 * @param {string} search - Search term
 * @param {string} field - Field to search in (default: 'animal_name')
 * @returns {boolean}
 */
export function matchesSearch(log, search, field = 'animal_name') {
  if (!search) return true;
  const value = log[field];
  if (!value) return false;
  return value.toLowerCase().includes(search.toLowerCase());
}

/**
 * Check if a log matches the log type filter.
 *
 * @param {Object} log - Medical log
 * @param {Array<string>} logTypes - Array of categories to include
 * @returns {boolean}
 */
export function matchesLogTypes(log, logTypes) {
  if (!logTypes || logTypes.length === 0) return true;
  return logTypes.includes(log.category);
}

/**
 * Check if a log matches the date range filter.
 * Safely handles invalid dates.
 *
 * @param {Object} log - Medical log
 * @param {Object} dateRange - { from: Date|null, to: Date|null }
 * @param {string} dateField - Field containing the date (default: 'logged_at')
 * @returns {boolean}
 */
export function matchesDateRange(log, dateRange, dateField = 'logged_at') {
  if (!dateRange) return true;

  const logDate = log[dateField] ? new Date(log[dateField]) : null;
  if (!logDate || isNaN(logDate.getTime())) return true; // Invalid dates pass through

  if (dateRange.from && logDate < dateRange.from) return false;
  if (dateRange.to && logDate > dateRange.to) return false;

  return true;
}

/**
 * Check if a log matches the "created by" filter.
 *
 * @param {Object} log - Medical log
 * @param {string} createdBy - 'all' | 'admin' | 'foster'
 * @returns {boolean}
 */
export function matchesCreatedBy(log, createdBy) {
  if (createdBy === 'all') return true;
  if (createdBy === 'admin') return !log.foster_user_id;
  if (createdBy === 'foster') return !!log.foster_user_id;
  return true;
}

/**
 * Check if a log is for an assigned animal (foster view).
 *
 * @param {Object} log - Medical log
 * @param {Set<string>} assignedAnimalIds - Set of assigned animal IDs
 * @returns {boolean}
 */
export function matchesAssignedAnimal(log, assignedAnimalIds) {
  if (!assignedAnimalIds) return true;
  return assignedAnimalIds.has(log.animal_id);
}

/**
 * Filter an array of medical logs.
 * Combines all filter predicates.
 *
 * @param {Array<Object>} logs - Medical logs to filter
 * @param {Object} filters - Filter configuration
 * @param {string} [filters.search] - Search term
 * @param {Array<string>} [filters.logTypes] - Log categories
 * @param {Object} [filters.dateRange] - Date range
 * @param {string} [filters.createdBy] - Who created the log
 * @param {Set<string>} [filters.assignedAnimalIds] - Assigned animals (foster view)
 * @returns {Array<Object>} Filtered logs
 *
 * @example
 * const filtered = filterMedicalLogs(logs, {
 *   search: 'fluffy',
 *   logTypes: ['MEDICAL'],
 *   dateRange: { from: new Date('2024-01-01'), to: new Date('2024-12-31') },
 *   createdBy: 'foster'
 * });
 */
export function filterMedicalLogs(logs, filters = {}) {
  const {
    search = '',
    logTypes = [],
    dateRange = { from: null, to: null },
    createdBy = 'all',
    assignedAnimalIds = null,
  } = filters;

  return logs.filter((log) => {
    // Foster view: only assigned animals
    if (!matchesAssignedAnimal(log, assignedAnimalIds)) return false;

    // Search
    if (!matchesSearch(log, search)) return false;

    // Log types
    if (!matchesLogTypes(log, logTypes)) return false;

    // Date range
    if (!matchesDateRange(log, dateRange)) return false;

    // Created by
    if (!matchesCreatedBy(log, createdBy)) return false;

    return true;
  });
}

/**
 * Sort medical logs by date.
 * Safely handles invalid dates.
 *
 * @param {Array<Object>} logs - Medical logs to sort
 * @param {Object} options - Sort options
 * @param {string} [options.field='logged_at'] - Date field to sort by
 * @param {'asc'|'desc'} [options.direction='desc'] - Sort direction
 * @returns {Array<Object>} New sorted array (input not mutated)
 *
 * @example
 * const sorted = sortMedicalLogsByDate(logs, { direction: 'desc' });
 */
export function sortMedicalLogsByDate(logs, options = {}) {
  const { field = 'logged_at', direction = 'desc' } = options;

  return [...logs].sort((a, b) => {
    const dateA = a[field] ? new Date(a[field]).getTime() : 0;
    const dateB = b[field] ? new Date(b[field]).getTime() : 0;

    // Handle invalid dates by treating as 0 (epoch)
    const timeA = isNaN(dateA) ? 0 : dateA;
    const timeB = isNaN(dateB) ? 0 : dateB;

    if (direction === 'asc') {
      return timeA - timeB;
    }
    return timeB - timeA;
  });
}

/**
 * Filter AND sort medical logs in one call.
 * Convenience function for common use case.
 *
 * @param {Array<Object>} logs - Medical logs
 * @param {Object} filters - Filter configuration
 * @param {Object} sortOptions - Sort configuration
 * @returns {Array<Object>} Filtered and sorted logs
 *
 * @example
 * const result = processMedicalLogs(logs, {
 *   search: 'fluffy',
 *   logTypes: ['MEDICAL']
 * }, { direction: 'desc' });
 */
export function processMedicalLogs(logs, filters = {}, sortOptions = { direction: 'desc' }) {
  const filtered = filterMedicalLogs(logs, filters);
  return sortMedicalLogsByDate(filtered, sortOptions);
}

/**
 * Calculate statistics for medical logs.
 * Used for dashboard cards and summary displays.
 *
 * @param {Array<Object>} logs - Medical logs
 * @returns {Object} Statistics object
 */
export function calculateMedicalLogStats(logs) {
  // Guard against non-array input to prevent runtime crashes
  if (!Array.isArray(logs)) {
    return { total: 0, medical: 0, behavioral: 0, veterinary: 0, fosterCreated: 0, adminCreated: 0, orphaned: 0 };
  }
  const total = logs.length;
  const medical = logs.filter((l) => l.category === 'MEDICAL').length;
  const behavioral = logs.filter((l) => l.category === 'BEHAVIORAL').length;
  const veterinary = logs.filter((l) => l.category === 'VETERINARY').length;
  const fosterCreated = logs.filter((l) => l.foster_user_id).length;
  const adminCreated = total - fosterCreated;
  const orphaned = logs.filter((l) => l.is_orphaned).length;

  return {
    total,
    medical,
    behavioral,
    veterinary,
    fosterCreated,
    adminCreated,
    orphaned,
  };
}
