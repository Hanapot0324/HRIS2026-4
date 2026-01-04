import { useState, useEffect, useCallback } from 'react';
import { loadFormulas, calculateAllFields } from '../utils/payrollCalculator';

/**
 * Custom hook for managing payroll formulas
 * Fetches formulas from API and provides calculation functions
 */
export function usePayrollFormulas() {
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch formulas from API
   */
  const fetchFormulas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedFormulas = await loadFormulas();
      setFormulas(fetchedFormulas);
    } catch (err) {
      console.error('Error fetching formulas:', err);
      setError(err.message || 'Failed to load formulas');
      setFormulas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Calculate payroll fields for an employee
   * @param {object} item - Employee payroll data
   * @returns {object} - Employee data with calculated fields
   */
  const calculatePayroll = useCallback(
    (item) => {
      if (!item) {
        return null;
      }

      if (formulas.length === 0) {
        console.warn('No formulas loaded, returning original item');
        return item;
      }

      return calculateAllFields(item, formulas);
    },
    [formulas]
  );

  /**
   * Refresh formulas from API
   */
  const refreshFormulas = useCallback(() => {
    return fetchFormulas();
  }, [fetchFormulas]);

  // Load formulas on mount
  useEffect(() => {
    fetchFormulas();
  }, [fetchFormulas]);

  return {
    formulas,
    loading,
    error,
    calculatePayroll,
    refreshFormulas,
  };
}

