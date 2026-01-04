import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  FormControlLabel,
  Checkbox,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  alpha,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Functions as FunctionsIcon,
  HelpOutline as HelpOutlineIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL from '../../apiConfig';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';

// Available payroll fields for formula builder
const PAYROLL_FIELDS = [
  { value: 'rateNbc584', label: 'Rate NBC 584', category: 'Basic Salary' },
  { value: 'rateNbc594', label: 'Rate NBC 594', category: 'Basic Salary' },
  { value: 'nbc594', label: 'NBC 594', category: 'Basic Salary' },
  { value: 'nbcDiffl597', label: 'NBC Differential 597', category: 'Basic Salary' },
  { value: 'increment', label: 'Increment', category: 'Basic Salary' },
  { value: 'h', label: 'Hours (H)', category: 'Attendance' },
  { value: 'm', label: 'Minutes (M)', category: 'Attendance' },
  { value: 's', label: 'Seconds (S)', category: 'Attendance' },
  { value: 'gsisSalaryLoan', label: 'GSIS Salary Loan', category: 'Deductions' },
  { value: 'gsisPolicyLoan', label: 'GSIS Policy Loan', category: 'Deductions' },
  { value: 'gsisArrears', label: 'GSIS Arrears', category: 'Deductions' },
  { value: 'cpl', label: 'CPL', category: 'Deductions' },
  { value: 'mpl', label: 'MPL', category: 'Deductions' },
  { value: 'eal', label: 'EAL', category: 'Deductions' },
  { value: 'mplLite', label: 'MPL Lite', category: 'Deductions' },
  { value: 'emergencyLoan', label: 'Emergency Loan', category: 'Deductions' },
  { value: 'pagibigFundCont', label: 'Pag-IBIG Fund Contribution', category: 'Deductions' },
  { value: 'pagibig2', label: 'Pag-IBIG 2', category: 'Deductions' },
  { value: 'multiPurpLoan', label: 'Multi-Purpose Loan', category: 'Deductions' },
  { value: 'liquidatingCash', label: 'Liquidating Cash', category: 'Deductions' },
  { value: 'landbankSalaryLoan', label: 'Landbank Salary Loan', category: 'Deductions' },
  { value: 'earistCreditCoop', label: 'EARIST Credit Coop', category: 'Deductions' },
  { value: 'feu', label: 'FEU', category: 'Deductions' },
  { value: 'withholdingTax', label: 'Withholding Tax', category: 'Deductions' },
  { value: 'PhilHealthContribution', label: 'PhilHealth Contribution', category: 'Deductions' },
  { value: 'ec', label: 'EC', category: 'Deductions' },
];

// Available operators
const OPERATORS = [
  { value: '+', label: 'Add (+)', icon: '+' },
  { value: '-', label: 'Subtract (-)', icon: '−' },
  { value: '*', label: 'Multiply (×)', icon: '×' },
  { value: '/', label: 'Divide (÷)', icon: '÷' },
  { value: '%', label: 'Modulo (%)', icon: '%' },
];

// Available functions - Simple, non-technical labels
const FUNCTIONS = [
  { value: 'Math.floor', label: 'Round Down', description: 'Rounds down to nearest whole number', example: 'Example: 3.7 becomes 3' },
  { value: 'Math.ceil', label: 'Round Up', description: 'Rounds up to nearest whole number', example: 'Example: 3.2 becomes 4' },
  { value: 'Math.round', label: 'Round', description: 'Rounds to nearest whole number', example: 'Example: 3.5 becomes 4' },
  { value: 'Math.max', label: 'Get Larger Number', description: 'Returns the larger of two numbers', example: 'Example: 5 and 10 gives 10' },
  { value: 'Math.min', label: 'Get Smaller Number', description: 'Returns the smaller of two numbers', example: 'Example: 5 and 10 gives 5' },
];

// Available calculated fields (other formulas that can be referenced)
const CALCULATED_FIELDS = [
  { value: 'grossSalary', label: 'Gross Salary' },
  { value: 'abs', label: 'Absence Deductions' },
  { value: 'netSalary', label: 'Net Salary' },
  { value: 'personalLifeRetIns', label: 'Personal Life Retirement Insurance' },
  { value: 'totalGsisDeds', label: 'Total GSIS Deductions' },
  { value: 'totalPagibigDeds', label: 'Total Pag-IBIG Deductions' },
  { value: 'totalOtherDeds', label: 'Total Other Deductions' },
  { value: 'totalDeductions', label: 'Total Deductions' },
  { value: 'pay1stCompute', label: 'Pay 1st Compute' },
  { value: 'pay2ndCompute', label: 'Pay 2nd Compute' },
  { value: 'pay1st', label: 'Pay 1st' },
  { value: 'pay2nd', label: 'Pay 2nd' },
  { value: 'rtIns', label: 'RT Insurance' },
];

const PayrollFormulas = () => {
  const { settings } = useSystemSettings();
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [formulaForm, setFormulaForm] = useState({
    formula_key: '',
    formula_expression: '',
    description: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [formulaBuilder, setFormulaBuilder] = useState({
    parts: [],
    currentPart: { type: 'field', value: '' },
  });
  const [originalBuilder, setOriginalBuilder] = useState({
    parts: [],
    currentPart: { type: 'field', value: '' },
  });
  const [originalDescription, setOriginalDescription] = useState('');
  const [formulaInput, setFormulaInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [inputRef, setInputRef] = useState(null);
  const [verificationChecked, setVerificationChecked] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  useEffect(() => {
    fetchFormulas();
  }, []);

  const fetchFormulas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/payroll-formulas`,
        getAuthHeaders()
      );
      setFormulas(response.data);
    } catch (error) {
      console.error('Error fetching formulas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Parse formula expression back into builder parts - handles both typed input and stored formulas
  const parseExpressionToBuilder = (expression) => {
    if (!expression) {
      return { parts: [], currentPart: { type: 'field', value: '' } };
    }

    const builderParts = [];
    let i = 0;
    const expr = expression.trim();
    
    while (i < expr.length) {
      // Skip whitespace
      if (/\s/.test(expr[i])) {
        i++;
        continue;
      }
      
      // Match parseFloat(item.fieldName || 0) - for backward compatibility
      const fieldMatch = expr.substring(i).match(/^parseFloat\(item\.(\w+)\s*\|\|\s*0\)/);
      if (fieldMatch) {
        builderParts.push({ type: 'field', value: fieldMatch[1] });
        i += fieldMatch[0].length;
        continue;
      }
      
      // Match function names (simple names like "Round Down" or technical "Math.floor")
      const functionNames = [
        { simple: 'Round Down', tech: 'Math.floor' },
        { simple: 'Round Up', tech: 'Math.ceil' },
        { simple: 'Round', tech: 'Math.round' },
        { simple: 'Larger', tech: 'Math.max' },
        { simple: 'Smaller', tech: 'Math.min' },
      ];
      
      let matchedFunction = null;
      for (const func of functionNames) {
        const simpleMatch = expr.substring(i).match(new RegExp(`^${func.simple.replace(/\s/g, '\\s*')}(?=\\s*\\()`));
        const techMatch = expr.substring(i).match(new RegExp(`^${func.tech.replace('.', '\\.')}(?=\\s*\\()`));
        if (simpleMatch || techMatch) {
          matchedFunction = func.tech;
          i += (simpleMatch ? simpleMatch[0].length : techMatch[0].length);
          builderParts.push({ type: 'function', value: func.tech, open: true });
          // Skip the opening parenthesis
          if (expr[i] === '(') i++;
          break;
        }
      }
      
      if (matchedFunction) continue;
      
      // Match simple field names (new readable format)
      // Try to match field names from PAYROLL_FIELDS or CALCULATED_FIELDS
      const allFieldNames = [...PAYROLL_FIELDS.map(f => f.value), ...CALCULATED_FIELDS.map(f => f.value)];
      let matchedField = null;
      let maxLength = 0;
      
      // Find the longest matching field name
      for (const fieldName of allFieldNames) {
        const regex = new RegExp(`^${fieldName}(?=\\s*[+\\-*/%()]|\\s*$|\\s*[,\\s])`);
        const match = expr.substring(i).match(regex);
        if (match && fieldName.length > maxLength) {
          matchedField = fieldName;
          maxLength = fieldName.length;
        }
      }
      
      if (matchedField) {
        builderParts.push({ type: 'field', value: matchedField });
        i += matchedField.length;
        continue;
      }
      
      // Match Math.functionName( - technical format
      const functionMatch = expr.substring(i).match(/^(Math\.\w+)\(/);
      if (functionMatch) {
        builderParts.push({ type: 'function', value: functionMatch[1], open: true });
        i += functionMatch[0].length;
        continue;
      }
      
      // Match percentages (like 5% or 12.5%) - must check BEFORE operators to avoid matching % as operator
      const percentMatch = expr.substring(i).match(/^(\d+\.?\d*)\s*%/);
      if (percentMatch) {
        // Convert percentage to decimal (5% = 0.05, 12.5% = 0.125)
        const percentValue = parseFloat(percentMatch[1]) / 100;
        builderParts.push({ type: 'number', value: percentValue.toString() });
        i += percentMatch[0].length;
        continue;
      }
      
      // Match operators (but not % if it's part of a percentage)
      if (/[+\-*/]/.test(expr[i])) {
        builderParts.push({ type: 'operator', value: expr[i] });
        i++;
        continue;
      }
      
      // Match numbers (including decimals)
      const numberMatch = expr.substring(i).match(/^\d+\.?\d*/);
      if (numberMatch) {
        builderParts.push({ type: 'number', value: numberMatch[0] });
        i += numberMatch[0].length;
        continue;
      }
      
      // Skip parentheses and other characters we don't need to track
      if (expr[i] === '(' || expr[i] === ')') {
        i++;
        continue;
      }
      
      // Skip unknown characters
      i++;
    }
    
    return {
      parts: builderParts,
      currentPart: { type: 'field', value: '' },
    };
  };

  const handleEdit = (formula) => {
    setSelectedFormula(formula);
    setFormulaForm({
      formula_key: formula.formula_key,
      formula_expression: formula.formula_expression,
      description: formula.description || '',
    });
    
    // Parse the existing formula into builder parts
    const parsedBuilder = parseExpressionToBuilder(formula.formula_expression);
    setFormulaBuilder(parsedBuilder);
    setOriginalBuilder(JSON.parse(JSON.stringify(parsedBuilder))); // Deep copy
    setOriginalDescription(formula.description || '');
    
    // Set the input to show simple format (NO PARSEFLOAT!)
    const simpleFormula = formatFormulaForDisplay(formula.formula_expression);
    setFormulaInput(simpleFormula);
    setVerificationChecked(false); // Reset verification when editing
    
    setEditModal(true);
  };

  const handleCreate = () => {
    setSelectedFormula(null);
    setFormulaForm({
      formula_key: '',
      formula_expression: '',
      description: '',
    });
    setFormulaBuilder({ parts: [], currentPart: { type: 'field', value: '' } });
    setOriginalBuilder({ parts: [], currentPart: { type: 'field', value: '' } });
    setOriginalDescription('');
    setFormulaInput('');
    setCreateModal(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Use the input value if available, otherwise build from builder
      // This ensures we save the simple format the user typed
      const expression = formulaInput.trim() || buildExpressionFromBuilder();
      
      // Make sure it's in simple format (no parseFloat)
      const simpleExpression = formatFormulaForDisplay(expression);

      if (selectedFormula) {
        await axios.put(
          `${API_BASE_URL}/api/payroll-formulas/${formulaForm.formula_key}`,
          {
            formula_expression: simpleExpression,
            description: formulaForm.description,
          },
          getAuthHeaders()
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/api/payroll-formulas`,
          {
            formula_key: formulaForm.formula_key,
            formula_expression: simpleExpression,
            description: formulaForm.description,
          },
          getAuthHeaders()
        );
      }
      await fetchFormulas();
      setEditModal(false);
      setCreateModal(false);
      setFormulaInput('');
      setVerificationChecked(false);
    } catch (error) {
      console.error('Error saving formula:', error);
      alert(error.response?.data?.error || 'Error saving formula');
    } finally {
      setLoading(false);
    }
  };

  // Check if formula has been modified
  const hasFormulaChanged = () => {
    if (!selectedFormula) {
      // For new formulas, check if builder has content
      const allParts = [...formulaBuilder.parts];
      if (formulaBuilder.currentPart.value) {
        allParts.push(formulaBuilder.currentPart);
      }
      return allParts.length > 0 && formulaForm.formula_key && formulaForm.description;
    }
    
    // For editing, compare current state with original
    const currentParts = [...formulaBuilder.parts];
    if (formulaBuilder.currentPart.value) {
      currentParts.push(formulaBuilder.currentPart);
    }
    
    const originalParts = [...originalBuilder.parts];
    if (originalBuilder.currentPart.value) {
      originalParts.push(originalBuilder.currentPart);
    }
    
    // Compare parts
    if (currentParts.length !== originalParts.length) {
      return true;
    }
    
    for (let i = 0; i < currentParts.length; i++) {
      if (currentParts[i].type !== originalParts[i].type || 
          currentParts[i].value !== originalParts[i].value) {
        return true;
      }
    }
    
    // Compare description
    if (formulaForm.description !== originalDescription) {
      return true;
    }
    
    return false;
  };

  const handleDelete = async (formulaKey) => {
    if (window.confirm(`Are you sure you want to delete "${formulaKey}"?`)) {
      try {
        setLoading(true);
        await axios.delete(
          `${API_BASE_URL}/api/payroll-formulas/${formulaKey}`,
          getAuthHeaders()
        );
        await fetchFormulas();
      } catch (error) {
        console.error('Error deleting formula:', error);
        alert('Error deleting formula');
      } finally {
        setLoading(false);
      }
    }
  };

  // Formula Builder Functions
  const addFieldToBuilder = (field) => {
    if (formulaBuilder.currentPart.value) {
      setFormulaBuilder({
        parts: [...formulaBuilder.parts, formulaBuilder.currentPart],
        currentPart: { type: 'field', value: field },
      });
    } else {
      setFormulaBuilder({
        ...formulaBuilder,
        currentPart: { ...formulaBuilder.currentPart, value: field },
      });
    }
  };

  const addOperatorToBuilder = (operator) => {
    if (formulaBuilder.currentPart.value) {
      setFormulaBuilder({
        parts: [...formulaBuilder.parts, formulaBuilder.currentPart, { type: 'operator', value: operator }],
        currentPart: { type: 'field', value: '' },
      });
    }
  };

  const addFunctionToBuilder = (func) => {
    setFormulaBuilder({
      parts: [...formulaBuilder.parts, { type: 'function', value: func, open: true }],
      currentPart: { type: 'field', value: '' },
    });
  };

  const addNumberToBuilder = (number) => {
    if (formulaBuilder.currentPart.type === 'number') {
      setFormulaBuilder({
        ...formulaBuilder,
        currentPart: { ...formulaBuilder.currentPart, value: formulaBuilder.currentPart.value + number },
      });
    } else if (formulaBuilder.currentPart.value) {
      setFormulaBuilder({
        parts: [...formulaBuilder.parts, formulaBuilder.currentPart],
        currentPart: { type: 'number', value: number },
      });
    } else {
      setFormulaBuilder({
        ...formulaBuilder,
        currentPart: { type: 'number', value: number },
      });
    }
  };

  const removeLastPart = () => {
    if (formulaBuilder.currentPart.value) {
      setFormulaBuilder({
        ...formulaBuilder,
        currentPart: { type: 'field', value: '' },
      });
    } else if (formulaBuilder.parts.length > 0) {
      const lastPart = formulaBuilder.parts[formulaBuilder.parts.length - 1];
      setFormulaBuilder({
        parts: formulaBuilder.parts.slice(0, -1),
        currentPart: lastPart.type === 'operator' ? { type: 'field', value: '' } : lastPart,
      });
    }
  };

  // Insert suggestion into formula input
  const insertSuggestion = (suggestion) => {
    const cursorPos = document.activeElement.selectionStart || formulaInput.length;
    const textBeforeCursor = formulaInput.substring(0, cursorPos);
    const textAfterCursor = formulaInput.substring(cursorPos);
    
    // Find the current word being typed
    const words = textBeforeCursor.split(/[\s+\-*/()]/);
    const currentWord = words[words.length - 1] || '';
    
    // Replace current word with suggestion
    const beforeWord = textBeforeCursor.substring(0, textBeforeCursor.length - currentWord.length);
    let insertValue = suggestion.value;
    
    // Add spacing if needed
    if (beforeWord && !/[+\-*/\(\s]/.test(beforeWord[beforeWord.length - 1])) {
      insertValue = ' ' + insertValue;
    }
    if (textAfterCursor && !/[+\-*/\)\s]/.test(textAfterCursor[0])) {
      insertValue = insertValue + ' ';
    }
    
    const newValue = beforeWord + insertValue + textAfterCursor;
    setFormulaInput(newValue);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Parse and update builder
    const parsed = parseExpressionToBuilder(newValue);
    setFormulaBuilder(parsed);
    
    // Focus back on input and set cursor position
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) {
        const newCursorPos = beforeWord.length + insertValue.length;
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Convert technical formula to simple readable format - NO PARSEFLOAT! NO TECHNICAL CODE!
  const formatFormulaForDisplay = (formula) => {
    if (!formula) return '';
    
    // Remove ALL technical code patterns and show only simple field names
    let simple = formula
      // Remove ALL parseFloat patterns - NO PARSEFLOAT ALLOWED ANYWHERE!
      .replace(/parseFloat\s*\(/g, '')
      .replace(/parseFloat\(item\.(\w+)\s*\|\|\s*0\)/g, '$1')
      .replace(/parseFloat\((\w+)\s*\|\|\s*0\)/g, '$1')
      .replace(/parseFloat\(([^)]+)\)/g, '$1')
      // Remove item.fieldName and replace with just fieldName
      .replace(/item\.(\w+)/g, '$1')
      // Remove || 0 patterns
      .replace(/\s*\|\|\s*0/g, '')
      // Remove Math. prefix from functions - show simple names
      .replace(/Math\.floor/g, 'Round Down')
      .replace(/Math\.ceil/g, 'Round Up')
      .replace(/Math\.round/g, 'Round')
      .replace(/Math\.max/g, 'Larger')
      .replace(/Math\.min/g, 'Smaller')
      // Remove ternary operators completely
      .replace(/\?[^:]*:/g, '')
      .replace(/\?/g, '')
      .replace(/:/g, '')
      // Remove parentheses around single values
      .replace(/\((\w+)\)/g, '$1')
      // Clean up extra spaces and operators
      .replace(/\s+/g, ' ')
      .replace(/\s*\+\s*/g, ' + ')
      .replace(/\s*-\s*/g, ' - ')
      .replace(/\s*\*\s*/g, ' * ')
      .replace(/\s*\/\s*/g, ' / ')
      .trim();
    
    return simple;
  };

  const buildExpressionFromBuilder = () => {
    const allParts = [...formulaBuilder.parts];
    if (formulaBuilder.currentPart.value) {
      allParts.push(formulaBuilder.currentPart);
    }

    let expression = '';
    let functionDepth = 0;

    allParts.forEach((part, index) => {
      if (part.type === 'field') {
        // Use simple field names - much more readable!
        // The calculator will handle converting these to safe values
        expression += part.value;
      } else if (part.type === 'number') {
        expression += part.value;
      } else if (part.type === 'operator') {
        expression += ` ${part.value} `;
      } else if (part.type === 'function') {
        expression += `${part.value}(`;
        functionDepth++;
      } else if (part.type === 'close') {
        expression += ')';
        functionDepth--;
      }
    });

    // Close any open functions
    for (let i = 0; i < functionDepth; i++) {
      expression += ')';
    }

    return expression;
  };

  const filteredFormulas = formulas.filter((formula) =>
    formula.formula_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (formula.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFormulas = filteredFormulas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderBuilderPreview = () => {
    const allParts = [...formulaBuilder.parts];
    if (formulaBuilder.currentPart.value) {
      allParts.push(formulaBuilder.currentPart);
    }

    return (
      <Box sx={{ p: 2, bgcolor: alpha(settings.primaryColor, 0.1), borderRadius: 2, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: settings.textPrimaryColor }}>
          Formula Preview:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {allParts.map((part, index) => (
            <Chip
              key={index}
              label={
                part.type === 'field'
                  ? PAYROLL_FIELDS.find((f) => f.value === part.value)?.label || 
                    CALCULATED_FIELDS.find((f) => f.value === part.value)?.label || 
                    part.value
                  : part.type === 'number'
                  ? part.value
                  : part.type === 'operator'
                  ? part.value
                  : part.type === 'function'
                  ? `${part.value}(`
                  : part.value
              }
              color={part.type === 'operator' ? 'primary' : part.type === 'function' ? 'secondary' : 'default'}
              sx={{ fontWeight: 'bold' }}
            />
          ))}
          {allParts.length === 0 && (
            <Typography variant="body2" sx={{ color: settings.textPrimaryColor, opacity: 0.6 }}>
              Start building your formula...
            </Typography>
          )}
        </Box>
        {allParts.length > 0 && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: settings.textPrimaryColor }}>
              Generated Expression:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                color: settings.textPrimaryColor,
                mt: 0.5,
                wordBreak: 'break-all',
              }}
            >
                            {formatFormulaForDisplay(buildExpressionFromBuilder())}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: settings.backgroundColor }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${settings.accentColor} 0%, ${settings.backgroundColor} 100%)`,
            borderRadius: 3,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: settings.primaryColor, width: 56, height: 56 }}>
                <CalculateIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: settings.textPrimaryColor }}>
                  Payroll Formulas
                </Typography>
                <Typography variant="body2" sx={{ color: settings.textPrimaryColor, opacity: 0.8 }}>
                  Manage and create payroll computation formulas easily
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchFormulas}
                disabled={loading}
                sx={{
                  borderColor: settings.primaryColor,
                  color: settings.textPrimaryColor,
                  '&:hover': { borderColor: settings.secondaryColor, bgcolor: alpha(settings.primaryColor, 0.1) },
                }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
                sx={{
                  bgcolor: settings.primaryColor,
                  color: settings.accentColor,
                  '&:hover': { bgcolor: settings.secondaryColor },
                }}
              >
                New Formula
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search formulas..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: <CodeIcon sx={{ mr: 1, color: settings.primaryColor }} />,
          }}
          sx={{
            maxWidth: 500,
            '& .MuiOutlinedInput-root': {
              bgcolor: settings.accentColor,
            },
          }}
        />
      </Box>

      {/* Formulas Table */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: settings.primaryColor }} />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(settings.primaryColor, 0.1) }}>
                    <TableCell sx={{ fontWeight: 'bold', color: settings.textPrimaryColor }}>Formula Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: settings.textPrimaryColor }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: settings.textPrimaryColor }}>Expression</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: settings.textPrimaryColor }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedFormulas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography sx={{ color: settings.textPrimaryColor, opacity: 0.7 }}>
                          {searchTerm ? 'No formulas found' : 'No formulas available. Create your first formula!'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedFormulas.map((formula) => (
                      <TableRow
                        key={formula.id}
                        sx={{
                          '&:hover': { bgcolor: alpha(settings.primaryColor, 0.05) },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: settings.textPrimaryColor }}>
                          {formula.formula_key}
                        </TableCell>
                        <TableCell sx={{ color: settings.textPrimaryColor }}>
                          {formula.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.9rem',
                              color: settings.textPrimaryColor,
                              maxWidth: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontWeight: 500,
                            }}
                            title={formatFormulaForDisplay(formula.formula_expression)}
                          >
                            {formatFormulaForDisplay(formula.formula_expression)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(formula)}
                                sx={{ color: settings.primaryColor }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(formula.formula_key)}
                                sx={{ color: '#d32f2f' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredFormulas.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </>
        )}
      </Paper>

      {/* Create/Edit Modal */}
      <Dialog
        open={createModal || editModal}
        onClose={() => {
          setCreateModal(false);
          setEditModal(false);
        }}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${settings.accentColor} 0%, ${settings.backgroundColor} 100%)`,
          },
        }}
      >
        <DialogTitle sx={{ color: settings.textPrimaryColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalculateIcon />
          {selectedFormula ? 'Edit Formula' : 'Create New Formula'}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#f5f5f5' }}>
          {/* Basic Info */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Formula Name"
              value={formulaForm.formula_key}
              onChange={(e) => setFormulaForm({ ...formulaForm, formula_key: e.target.value })}
              disabled={!!selectedFormula}
              sx={{ mb: 2, bgcolor: 'white' }}
            />
            <TextField
              fullWidth
              label="Description"
              value={formulaForm.description}
              onChange={(e) => setFormulaForm({ ...formulaForm, description: e.target.value })}
              sx={{ bgcolor: 'white' }}
            />
          </Box>

          {/* Formula Input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
              Type Your Formula:
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                inputRef={(ref) => setInputRef(ref)}
                value={formulaInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormulaInput(value);
                  
                  const cursorPos = e.target.selectionStart;
                  const textBeforeCursor = value.substring(0, cursorPos);
                  const words = textBeforeCursor.split(/[\s+\-*/()]/);
                  const currentWord = words[words.length - 1] || '';
                  
                  if (currentWord.length > 0) {
                    const allSuggestions = [
                      ...PAYROLL_FIELDS.map(f => ({ value: f.value, label: f.label, type: 'field', display: f.label })),
                      ...CALCULATED_FIELDS.map(f => ({ value: f.value, label: f.label, type: 'field', display: f.label })),
                      ...OPERATORS.map(op => ({ value: op.value, label: op.label, type: 'operator', display: op.icon })),
                      ...FUNCTIONS.map(f => ({ value: f.value, label: f.label, type: 'function', display: f.label })),
                      { value: '0.05', label: '5%', type: 'number', display: '5%' },
                      { value: '0.09', label: '9%', type: 'number', display: '9%' },
                      { value: '0.12', label: '12%', type: 'number', display: '12%' },
                    ];
                    
                    const filtered = allSuggestions.filter(s => 
                      s.label.toLowerCase().includes(currentWord.toLowerCase()) ||
                      s.value.toLowerCase().includes(currentWord.toLowerCase())
                    );
                    
                    setSuggestions(filtered.slice(0, 8));
                    setShowSuggestions(filtered.length > 0);
                    setSuggestionIndex(0);
                  } else {
                    setShowSuggestions(false);
                    setSuggestions([]);
                  }
                  
                  if (value.trim()) {
                    const parsed = parseExpressionToBuilder(value);
                    setFormulaBuilder(parsed);
                  } else {
                    setFormulaBuilder({ parts: [], currentPart: { type: 'field', value: '' } });
                  }
                }}
                onKeyDown={(e) => {
                  if (showSuggestions && suggestions.length > 0) {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setSuggestionIndex(prev => (prev + 1) % suggestions.length);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
                    } else if (e.key === 'Enter' || e.key === 'Tab') {
                      e.preventDefault();
                      const selected = suggestions[suggestionIndex];
                      if (selected) insertSuggestion(selected);
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Type formula here... (e.g., rateNbc594 + nbcDiffl597 + increment)"
                sx={{ bgcolor: 'white' }}
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <Paper
                  elevation={8}
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    mt: 0.5,
                    maxHeight: 300,
                    overflowY: 'auto',
                    bgcolor: 'white',
                    border: `2px solid ${settings.primaryColor}`,
                    borderRadius: 2,
                  }}
                >
                  {suggestions.map((suggestion, index) => (
                    <Box
                      key={`${suggestion.value}-${index}`}
                      onClick={() => insertSuggestion(suggestion)}
                      onMouseEnter={() => setSuggestionIndex(index)}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        bgcolor: index === suggestionIndex ? alpha(settings.primaryColor, 0.15) : 'transparent',
                        borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none',
                        '&:hover': { bgcolor: alpha(settings.primaryColor, 0.15) },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Typography sx={{ fontWeight: 'bold', color: suggestion.type === 'field' ? settings.primaryColor : suggestion.type === 'operator' ? '#c62828' : suggestion.type === 'function' ? '#2e7d32' : '#FF9800', flex: 1 }}>
                        {suggestion.display}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999', fontFamily: 'monospace', fontSize: '0.7rem', bgcolor: '#f5f5f5', px: 1, py: 0.5, borderRadius: 1 }}>
                        {suggestion.value}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>
          </Box>

          {/* Preview */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
              Preview:
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: alpha(settings.primaryColor, 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha(settings.primaryColor, 0.2)}`,
                minHeight: 60,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                alignItems: 'center',
              }}
            >
              {(() => {
                const allParts = [...formulaBuilder.parts];
                if (formulaBuilder.currentPart.value) allParts.push(formulaBuilder.currentPart);
                
                if (allParts.length === 0) {
                  return <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>Your formula will appear here...</Typography>;
                }
                
                return allParts.map((part, index) => {
                  let label = '';
                  let bgColor = '#e3f2fd';
                  let textColor = '#1976d2';
                  
                  if (part.type === 'field') {
                    label = PAYROLL_FIELDS.find((f) => f.value === part.value)?.label || CALCULATED_FIELDS.find((f) => f.value === part.value)?.label || part.value;
                    bgColor = CALCULATED_FIELDS.some(f => f.value === part.value) ? '#f3e5f5' : '#e3f2fd';
                    textColor = CALCULATED_FIELDS.some(f => f.value === part.value) ? '#7b1fa2' : '#1976d2';
                  } else if (part.type === 'number') {
                    label = part.value;
                    bgColor = '#fff3e0';
                    textColor = '#e65100';
                  } else if (part.type === 'operator') {
                    label = part.value;
                    bgColor = '#ffebee';
                    textColor = '#c62828';
                  } else if (part.type === 'function') {
                    const func = FUNCTIONS.find(f => f.value === part.value);
                    label = func ? `${func.label}(` : `${part.value}(`;
                    bgColor = '#e8f5e9';
                    textColor = '#2e7d32';
                  }
                  
                  return (
                    <Chip key={index} label={label} sx={{ bgcolor: bgColor, color: textColor, fontWeight: 'bold', fontSize: '0.9rem', border: `1px solid ${textColor}` }} />
                  );
                });
              })()}
            </Paper>
          </Box>

          {/* Quick Add Buttons */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
              Quick Add:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {OPERATORS.map((op) => (
                <Button
                  key={op.value}
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => {
                    const current = formulaInput.trim();
                    const newValue = current ? `${current} ${op.value} ` : `${op.value} `;
                    setFormulaInput(newValue);
                    const parsed = parseExpressionToBuilder(newValue);
                    setFormulaBuilder(parsed);
                  }}
                  sx={{ minWidth: 45, height: 36, fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  {op.icon}
                </Button>
              ))}
              {[{ label: '5%', value: '0.05' }, { label: '9%', value: '0.09' }, { label: '12%', value: '0.12' }].map((percent) => (
                <Button
                  key={percent.value}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const current = formulaInput.trim();
                    const newValue = current ? `${current} * ${percent.value}` : percent.value;
                    setFormulaInput(newValue);
                    const parsed = parseExpressionToBuilder(newValue);
                    setFormulaBuilder(parsed);
                  }}
                  sx={{ borderColor: '#FF9800', color: '#FF9800', fontWeight: 'bold' }}
                >
                  {percent.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Fields */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
              Fields:
            </Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto', bgcolor: 'white', p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {PAYROLL_FIELDS.map((field) => (
                  <Button
                    key={field.value}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const current = formulaInput.trim();
                      const newValue = current ? `${current} ${field.value}` : field.value;
                      setFormulaInput(newValue);
                      const parsed = parseExpressionToBuilder(newValue);
                      setFormulaBuilder(parsed);
                    }}
                    sx={{ borderColor: settings.primaryColor, color: settings.primaryColor, fontSize: '0.8rem' }}
                  >
                    {field.label}
                  </Button>
                ))}
                {CALCULATED_FIELDS.map((field) => (
                  <Button
                    key={field.value}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const current = formulaInput.trim();
                      const newValue = current ? `${current} ${field.value}` : field.value;
                      setFormulaInput(newValue);
                      const parsed = parseExpressionToBuilder(newValue);
                      setFormulaBuilder(parsed);
                    }}
                    sx={{ borderColor: settings.secondaryColor, color: settings.secondaryColor, fontSize: '0.8rem' }}
                  >
                    {field.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Functions */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
              Functions:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {FUNCTIONS.map((func) => (
                <Button
                  key={func.value}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const current = formulaInput.trim();
                    const newValue = current ? `${current} ${func.value}(` : `${func.value}(`;
                    setFormulaInput(newValue);
                    const parsed = parseExpressionToBuilder(newValue);
                    setFormulaBuilder(parsed);
                  }}
                  sx={{ borderColor: '#2e7d32', color: '#2e7d32', fontSize: '0.8rem' }}
                >
                  {func.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Verification Checkbox - Only show when editing and formula has changed */}
          {selectedFormula && hasFormulaChanged() && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#fff3cd', borderRadius: 2, border: '2px solid #ffc107' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={verificationChecked}
                    onChange={(e) => setVerificationChecked(e.target.checked)}
                    sx={{ color: '#856404', '&.Mui-checked': { color: '#856404' } }}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 'bold', color: '#856404', fontSize: '0.95rem' }}>
                    ✓ I verify that I want to make changes to this formula
                  </Typography>
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Button
            variant="outlined"
            onClick={() => {
              setCreateModal(false);
              setEditModal(false);
              setVerificationChecked(false);
            }}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading || !formulaForm.formula_key || !hasFormulaChanged() || (selectedFormula && hasFormulaChanged() && !verificationChecked)}
            sx={{
              bgcolor: settings.primaryColor,
              '&:hover': { bgcolor: settings.secondaryColor },
              '&:disabled': {
                bgcolor: '#ccc',
                color: '#666',
              },
            }}
          >
            {loading ? 'Saving...' : 'Save Formula'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PayrollFormulas;

