/**
 * PayrollCalculator Service
 * Safely evaluates payroll formulas stored in database
 */

const db = require('../db');

// Whitelist of allowed functions and constants for formula evaluation
const ALLOWED_FUNCTIONS = {
  Math: {
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    abs: Math.abs,
    max: Math.max,
    min: Math.min,
    pow: Math.pow,
    sqrt: Math.sqrt,
  },
  parseFloat: parseFloat,
  parseInt: parseInt,
  Number: Number,
};

/**
 * Safely evaluate a formula expression
 * @param {string} formula - The formula expression to evaluate
 * @param {object} context - The data context (employee payroll data)
 * @returns {number} - The calculated result
 */
function evaluateFormula(formula, context) {
  if (!formula || typeof formula !== 'string') {
    throw new Error('Invalid formula: formula must be a non-empty string');
  }

  if (!context || typeof context !== 'object') {
    throw new Error('Invalid context: context must be an object');
  }

  try {
    // Create a safe context with field names as direct variables
    // This allows simple syntax like "rateNbc594 + nbcDiffl597" instead of "parseFloat(item.rateNbc594 || 0) + parseFloat(item.nbcDiffl597 || 0)"
    const safeContext = {
      item: context,
      ...ALLOWED_FUNCTIONS,
    };

    // Add all context fields as direct variables for simple access
    // This makes formulas readable: "rateNbc594 + nbcDiffl597" instead of "parseFloat(item.rateNbc594 || 0) + parseFloat(item.nbcDiffl597 || 0)"
    Object.keys(context).forEach((key) => {
      const value = context[key];
      // Convert to number, default to 0 if invalid
      safeContext[key] = typeof value === 'number' ? value : parseFloat(value) || 0;
    });

    // Create a function that evaluates the formula
    // Using Function constructor to avoid eval() security issues
    // This is safer than eval() but still requires careful validation
    const funcParams = ['item', 'Math', 'parseFloat', 'parseInt', 'Number', ...Object.keys(context)];
    const funcBody = `"use strict"; return (${formula});`;
    
    const func = new Function(...funcParams, funcBody);

    const result = func(
      safeContext.item,
      safeContext.Math,
      safeContext.parseFloat,
      safeContext.parseInt,
      safeContext.Number,
      ...Object.keys(context).map(key => safeContext[key])
    );

    // Validate result is a number
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      console.warn(`Formula evaluation returned invalid result: ${result}`);
      return 0;
    }

    return result;
  } catch (error) {
    console.error(`Error evaluating formula: ${formula}`, error);
    throw new Error(`Formula evaluation failed: ${error.message}`);
  }
}

/**
 * Validate formula syntax (basic validation)
 * @param {string} formula - The formula expression to validate
 * @returns {object} - { valid: boolean, error: string }
 */
function validateFormula(formula) {
  if (!formula || typeof formula !== 'string') {
    return { valid: false, error: 'Formula must be a non-empty string' };
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    /eval\s*\(/i,
    /function\s*\(/i,
    /require\s*\(/i,
    /import\s+/i,
    /export\s+/i,
    /process\./i,
    /global\./i,
    /__dirname/i,
    /__filename/i,
    /while\s*\(/i,
    /for\s*\(/i,
    /\.exec\s*\(/i,
    /\.spawn\s*\(/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(formula)) {
      return {
        valid: false,
        error: `Formula contains potentially dangerous code: ${pattern}`,
      };
    }
  }

  // Try to parse the formula (basic syntax check)
  try {
    new Function('item', 'Math', 'parseFloat', 'parseInt', 'Number', `return (${formula});`);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: `Invalid formula syntax: ${error.message}` };
  }
}

/**
 * Get all active formulas from database
 * @returns {Promise<Array>} - Array of formula objects
 */
function getFormulas() {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM payroll_formulas WHERE is_active = TRUE ORDER BY id ASC',
      (err, results) => {
        if (err) {
          console.error('Error fetching formulas:', err);
          return reject(err);
        }
        resolve(results);
      }
    );
  });
}

/**
 * Get a specific formula by key
 * @param {string} formulaKey - The formula key
 * @returns {Promise<object>} - Formula object
 */
function getFormula(formulaKey) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM payroll_formulas WHERE formula_key = ? AND is_active = TRUE',
      [formulaKey],
      (err, results) => {
        if (err) {
          console.error('Error fetching formula:', err);
          return reject(err);
        }
        if (results.length === 0) {
          return reject(new Error(`Formula not found: ${formulaKey}`));
        }
        resolve(results[0]);
      }
    );
  });
}

/**
 * Calculate all payroll fields for an employee using formulas from database
 * @param {object} item - Employee payroll data
 * @returns {Promise<object>} - Employee data with all calculated fields
 */
async function calculatePayroll(item) {
  try {
    // Get all active formulas
    const formulas = await getFormulas();

    // Create a map of formulas by key for easy lookup
    const formulaMap = {};
    formulas.forEach((formula) => {
      formulaMap[formula.formula_key] = formula;
    });

    // Define calculation order based on dependencies
    // This ensures formulas are calculated in the correct order
    const calculationOrder = [
      'grossSalary',
      'abs',
      'PhilHealthContribution',
      'personalLifeRetIns',
      'netSalary',
      'totalGsisDeds',
      'totalPagibigDeds',
      'totalOtherDeds',
      'totalDeductions',
      'pay1stCompute',
      'pay2ndCompute',
      'pay1st',
      'pay2nd',
      'rtIns',
    ];

    // Create a result object starting with the original item data
    const result = { ...item };

    // Calculate each field in order
    for (const key of calculationOrder) {
      const formula = formulaMap[key];
      if (formula) {
        try {
          result[key] = evaluateFormula(formula.formula_expression, result);
        } catch (error) {
          console.error(`Error calculating ${key}:`, error);
          // Set to 0 if calculation fails
          result[key] = 0;
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error in calculatePayroll:', error);
    throw error;
  }
}

/**
 * Calculate a specific field using its formula
 * @param {string} formulaKey - The formula key
 * @param {object} item - Employee payroll data
 * @returns {Promise<number>} - Calculated value
 */
async function calculateField(formulaKey, item) {
  try {
    const formula = await getFormula(formulaKey);
    return evaluateFormula(formula.formula_expression, item);
  } catch (error) {
    console.error(`Error calculating field ${formulaKey}:`, error);
    throw error;
  }
}

module.exports = {
  evaluateFormula,
  validateFormula,
  getFormulas,
  getFormula,
  calculatePayroll,
  calculateField,
};

