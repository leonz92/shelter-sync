import FilterBar from './FilterBar';
import { UnifiedMedicalLogPopover } from './ui/unified-medical-log-popover';

export function MedicalLogFilterBar({
  filters,
  onFiltersChange,
  showCreatedBy = true,
  onAddNew,
  addNewButtonLabel = 'Add Medical Log',
  className,
}) {
  const handleClear = () => {
    const clearedFilters = {
      search: '',
      dateRange: { from: null, to: null },
      logTypes: [],
      createdBy: showCreatedBy ? 'all' : 'foster',
    };
    onFiltersChange(clearedFilters);
  };

  return (
    <FilterBar
      onFilter={() => {}}
      onClear={handleClear}
      onAddNew={onAddNew}
      addNewButtonLabel={addNewButtonLabel}
      className={className}
    >
      <UnifiedMedicalLogPopover
        filters={filters}
        onFiltersChange={onFiltersChange}
        showCreatedBy={showCreatedBy}
      />
    </FilterBar>
  );
}

export { MedicalLogFilterBar as MedicalLogFilterbar };