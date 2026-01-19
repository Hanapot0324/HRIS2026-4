# DTR Print Tracking System - Testing Guide

## Quick Start Testing

### Prerequisites
1. Backend server is running
2. Frontend is running
3. Database migration has been executed
4. You have HR access to the DTR Overall page

### Test Scenario 1: First Time Bulk Printing

**Steps:**
1. Navigate to Daily Time Record Overall page
2. Switch to "Multiple Users" view mode
3. Select a date range (e.g., January 1-15, 2026)
4. Click "Load All Users DTR" button
5. Wait for data to load (you'll see print status loading)
6. **Verify**: You should see three filter tabs: All | Printed | Unprinted
7. Click "Unprinted" tab
8. **Verify**: All users should appear (none printed yet)
9. Use "Print first..." dropdown to select "First 20"
10. **Verify**: First 20 users are checked/selected
11. Click "Bulk Printing (20)" button
12. **Verify**: Preview modal opens
13. Click "Print All Selected" button
14. **Verify**: 
    - Progress indicator shows
    - Print dialog opens with all 20 DTRs in one PDF
    - Modal closes automatically
15. **Verify**: The 20 printed users now show:
    - "Printed" status chip (green)
    - Print icon button in Actions column
    - Checkboxes are disabled (grayed out)

### Test Scenario 2: Filter by Print Status

**Steps:**
1. After completing Scenario 1, stay on the same page
2. Click "Printed" filter tab
3. **Verify**: Only the 20 printed users appear
4. Click "Unprinted" filter tab
5. **Verify**: Only unprinted users appear
6. Click "All" filter tab
7. **Verify**: All users appear (both printed and unprinted)

### Test Scenario 3: Individual Re-printing

**Steps:**
1. Click "Printed" filter tab (or "All" tab)
2. Find a user with "Printed" status
3. **Verify**: Print icon button is visible in Actions column
4. Click the print icon button
5. **Verify**:
    - Progress indicator shows briefly
    - Print dialog opens with single DTR
    - No modal preview needed
6. Check the same user again
7. **Verify**: Still shows "Printed" status (timestamp updated in backend)

### Test Scenario 4: Prevent Accidental Duplicate Printing

**Steps:**
1. Try to select a user with "Printed" status using checkbox
2. **Verify**: Checkbox is disabled (cannot be checked)
3. Try to click on the checkbox
4. **Verify**: Nothing happens (selection prevented)
5. Select some unprinted users
6. Click "Print first... → First 10"
7. **Verify**: Only unprinted users are selected (printed ones skipped)

### Test Scenario 5: Print Another Batch

**Steps:**
1. Click "Unprinted" filter tab
2. Select 10 more users (use checkboxes or "Print first..." dropdown)
3. Click "Bulk Printing (10)" button
4. Print them
5. **Verify**: 
    - These 10 now show "Printed" status
    - Total printed users increased
    - Still cannot bulk-select them anymore

### Test Scenario 6: Month Specificity

**Steps:**
1. Change date range to next month (e.g., February 1-28, 2026)
2. Click "Load All Users DTR" button
3. **Verify**: 
    - All users show "Not Printed" status
    - All checkboxes are enabled
    - No print icon buttons appear
4. This confirms print status is tracked per month

### Test Scenario 7: Search and Filter Combination

**Steps:**
1. Load users for January again
2. Click "Printed" filter tab
3. Use search box to search for a specific employee name
4. **Verify**: Search works with print status filter
5. Clear search
6. Select "Has Records" from Records dropdown
7. **Verify**: Can combine multiple filters

### Test Scenario 8: Page Refresh Persistence

**Steps:**
1. After printing some users, refresh the browser page
2. Switch to "Multiple Users" view
3. Load the same date range
4. **Verify**: 
    - Print status persists (same users show "Printed")
    - Data comes from database, not just memory

### Expected Database Behavior

**Query to check print history:**
```sql
SELECT * FROM dtr_print_history 
ORDER BY printed_at DESC 
LIMIT 20;
```

**Expected columns:**
- employee_number
- year
- month
- start_date
- end_date
- printed_at (timestamp)
- printed_by (who printed)

### Common Issues & Solutions

#### Issue 1: "Error fetching print status"
**Solution**: Check backend console for errors, verify database migration ran successfully

#### Issue 2: Print icon button not appearing
**Solution**: 
- Ensure user was actually printed (check database)
- Verify printStatusMap is populated (React DevTools)

#### Issue 3: Cannot re-print
**Solution**: 
- Check browser console for errors
- Verify DTR data is loaded in bulkDTRRefs

#### Issue 4: All users show "Not Printed" after printing
**Solution**: 
- Check if mark-as-printed API call succeeded
- Verify network tab shows successful POST to /api/mark-dtr-printed

### Performance Testing

**Test with large dataset:**
1. Load 100+ users
2. Print in batches of 20
3. **Verify**: 
    - No significant slowdown
    - Print status loads quickly
    - Filtering remains responsive

### UI/UX Verification

**Visual checks:**
- ✅ Filter tabs are clearly visible
- ✅ Active tab is highlighted
- ✅ "Printed" chip is green, "Not Printed" is gray
- ✅ Print icon is visible and clickable
- ✅ Disabled checkboxes are visually grayed out
- ✅ No layout shifts when switching filters
- ✅ Progress indicators show during loading/printing

### Browser Compatibility

Test in:
- ✅ Chrome/Edge (primary)
- ✅ Firefox
- ✅ Safari (if available)

### Security Testing

**Verify:**
1. Non-HR users cannot access the page (existing access control)
2. Print history shows correct "printed_by" user
3. Audit logs record print actions

### Edge Cases

#### Edge Case 1: No users with records
1. Select date range with no attendance data
2. **Verify**: System handles gracefully, no errors

#### Edge Case 2: Network error during print
1. Disconnect internet
2. Try to print
3. **Verify**: Error message shows, print status not updated

#### Edge Case 3: Very long employee names
1. Find user with long name
2. **Verify**: Name truncates with ellipsis, doesn't break layout

### Acceptance Criteria Checklist

- ✅ Can print DTRs in batches (e.g., 20 at a time)
- ✅ Cannot accidentally re-print via bulk selection
- ✅ Can intentionally re-print individual records
- ✅ Print status persists across sessions
- ✅ Print status is month-specific
- ✅ Filter tabs work correctly (All/Printed/Unprinted)
- ✅ Visual indicators are clear and intuitive
- ✅ No performance degradation with large datasets
- ✅ Audit trail tracks all print operations

### Success Indicators

**The implementation is successful if:**
1. HR can confidently print in batches without fear of duplicates
2. Re-printing a single record takes only 1 click
3. Print status is immediately visible
4. No accidental duplicate prints occur
5. System feels fast and responsive

### Feedback Collection

After testing, gather feedback on:
1. Is the filter tab placement intuitive?
2. Is the print icon button obvious enough?
3. Should we add a confirmation dialog for re-printing?
4. Would a print history view be useful?
5. Any workflow improvements needed?

---

**Happy Testing!** 🎉

If you encounter any issues, check:
1. Browser console for JavaScript errors
2. Network tab for failed API calls
3. Backend console for server errors
4. Database for data integrity
