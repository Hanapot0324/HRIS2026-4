import { useSystemSettings } from './useSystemSettings';
import { alpha } from '@mui/material/styles';

/**
 * Hook to get CRUD button styles based on system settings
 * @param {string} type - 'create' | 'read' | 'update' | 'delete'
 * @returns {object} - Button sx styles object
 */
export const useCRUDButtonStyles = (type = 'create') => {
  const { settings } = useSystemSettings();

  const getButtonColor = () => {
    switch (type.toLowerCase()) {
      case 'create':
      case 'add':
      case 'save':
        return settings.createButtonColor || '#6d2323';
      case 'read':
      case 'view':
      case 'preview':
        return settings.readButtonColor || '#6d2323';
      case 'update':
      case 'edit':
      case 'modify':
        return settings.updateButtonColor || '#6d2323';
      case 'delete':
      case 'remove':
        return settings.deleteButtonColor || '#6d2323';
      case 'cancel':
      case 'close':
        return settings.cancelButtonColor || '#6c757d';
      default:
        return settings.primaryColor || '#894444';
    }
  };

  const getHoverColor = () => {
    switch (type.toLowerCase()) {
      case 'create':
      case 'add':
      case 'save':
        return settings.createButtonHoverColor || '#a31d1d';
      case 'read':
      case 'view':
      case 'preview':
        return settings.readButtonHoverColor || '#a31d1d';
      case 'update':
      case 'edit':
      case 'modify':
        return settings.updateButtonHoverColor || '#a31d1d';
      case 'delete':
      case 'remove':
        return settings.deleteButtonHoverColor || '#a31d1d';
      case 'cancel':
      case 'close':
        return settings.cancelButtonHoverColor || '#5a6268';
      default:
        return settings.hoverColor || '#6D2323';
    }
  };

  const buttonColor = getButtonColor();
  const hoverColor = getHoverColor();

  return {
    bgcolor: buttonColor,
    color: '#FFFFFF',
    '&:hover': {
      bgcolor: hoverColor,
      boxShadow: `0 6px 20px ${alpha(hoverColor, 0.4)}`,
    },
    '&:active': {
      bgcolor: hoverColor,
      boxShadow: `0 2px 10px ${alpha(hoverColor, 0.3)}`,
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };
};

/**
 * Hook to get CRUD button styles for outlined variant
 * @param {string} type - 'create' | 'read' | 'update' | 'delete'
 * @returns {object} - Button sx styles object
 */
export const useCRUDButtonStylesOutlined = (type = 'create') => {
  const { settings } = useSystemSettings();

  const getButtonColor = () => {
    switch (type.toLowerCase()) {
      case 'create':
      case 'add':
      case 'save':
        return settings.createButtonColor || '#6d2323';
      case 'read':
      case 'view':
      case 'preview':
        return settings.readButtonColor || '#6d2323';
      case 'update':
      case 'edit':
      case 'modify':
        return settings.updateButtonColor || '#6d2323';
      case 'delete':
      case 'remove':
        return settings.deleteButtonColor || '#6d2323';
      case 'cancel':
      case 'close':
        return settings.cancelButtonColor || '#6c757d';
      default:
        return settings.primaryColor || '#894444';
    }
  };

  const getHoverColor = () => {
    switch (type.toLowerCase()) {
      case 'create':
      case 'add':
      case 'save':
        return settings.createButtonHoverColor || '#a31d1d';
      case 'read':
      case 'view':
      case 'preview':
        return settings.readButtonHoverColor || '#a31d1d';
      case 'update':
      case 'edit':
      case 'modify':
        return settings.updateButtonHoverColor || '#a31d1d';
      case 'delete':
      case 'remove':
        return settings.deleteButtonHoverColor || '#a31d1d';
      case 'cancel':
      case 'close':
        return settings.cancelButtonHoverColor || '#5a6268';
      default:
        return settings.hoverColor || '#6D2323';
    }
  };

  const buttonColor = getButtonColor();
  const hoverColor = getHoverColor();

  return {
    borderColor: buttonColor,
    color: buttonColor,
    '&:hover': {
      borderColor: hoverColor,
      color: hoverColor,
      backgroundColor: alpha(hoverColor, 0.1),
      boxShadow: `0 4px 14px ${alpha(hoverColor, 0.2)}`,
    },
    '&:active': {
      borderColor: hoverColor,
      backgroundColor: alpha(hoverColor, 0.2),
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };
};

/**
 * Hook to get CRUD button styles for IconButton
 * @param {string} type - 'create' | 'read' | 'update' | 'delete'
 * @returns {object} - IconButton sx styles object
 */
export const useCRUDIconButtonStyles = (type = 'create') => {
  const { settings } = useSystemSettings();

  const getButtonColor = () => {
    switch (type.toLowerCase()) {
      case 'create':
      case 'add':
      case 'save':
        return settings.createButtonColor || '#6d2323';
      case 'read':
      case 'view':
      case 'preview':
        return settings.readButtonColor || '#6d2323';
      case 'update':
      case 'edit':
      case 'modify':
        return settings.updateButtonColor || '#6d2323';
      case 'delete':
      case 'remove':
        return settings.deleteButtonColor || '#6d2323';
      case 'cancel':
      case 'close':
        return settings.cancelButtonColor || '#6c757d';
      default:
        return settings.primaryColor || '#894444';
    }
  };

  const getHoverColor = () => {
    switch (type.toLowerCase()) {
      case 'create':
      case 'add':
      case 'save':
        return settings.createButtonHoverColor || '#a31d1d';
      case 'read':
      case 'view':
      case 'preview':
        return settings.readButtonHoverColor || '#a31d1d';
      case 'update':
      case 'edit':
      case 'modify':
        return settings.updateButtonHoverColor || '#a31d1d';
      case 'delete':
      case 'remove':
        return settings.deleteButtonHoverColor || '#a31d1d';
      case 'cancel':
      case 'close':
        return settings.cancelButtonHoverColor || '#5a6268';
      default:
        return settings.hoverColor || '#6D2323';
    }
  };

  const buttonColor = getButtonColor();
  const hoverColor = getHoverColor();

  return {
    color: buttonColor,
    '&:hover': {
      color: hoverColor,
      backgroundColor: alpha(hoverColor, 0.1),
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };
};

