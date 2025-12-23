# Dashboard Fix Plan

## Issues to Fix

### 1. TypeScript Error: `Type 'Element[]' is not assignable to type 'CollectionElement<object>'`

- **Location**: `app/[locale]/(admin)/dashboard/page.tsx` line with `availableYears.map()`
- **Problem**: TypeScript doesn't recognize the array of SelectItem elements as valid children
- **Solution**: Ensure proper typing and array handling

### 2. Default Data Fetching Should Be Current Year (Not All Time)

- **Location**: Both API route and component
- **Problem**: Currently defaults to "month" which shows last month's data
- **Solution**: Change default to "year" with current year selected

## Implementation Steps

### Step 1: Fix TypeScript Error in Dashboard Component

1. Review the `availableYears.map()` implementation
2. Ensure proper type casting and element rendering
3. Add explicit typing for the SelectItem components

### Step 2: Update API Route Default Behavior

1. Change default `timeRange` from "month" to "year"
2. Set default year to current year
3. Ensure API returns current year data by default

### Step 3: Update Component Default State

1. Change initial `timeRange` state to "year"
2. Set initial `selectedYear` to current year
3. Update filter logic to work with year-based default

### Step 4: Test and Validate

1. Verify TypeScript error is resolved
2. Confirm dashboard loads with current year data by default
3. Ensure all filters work correctly

## Expected Results

- ✅ No TypeScript compilation errors
- ✅ Dashboard shows current year data by default
- ✅ Year selector shows current year as selected
- ✅ All filtering functionality works correctly
