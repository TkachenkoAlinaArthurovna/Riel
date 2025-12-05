import { filterPremisesByFilters } from './filterPremisesByFilters';
import { renderUnitsPortion } from './renderUnitsList';

export function applyFiltersAndSave(allUnits, filters, portionSize = 12) {
  const filtered = filterPremisesByFilters(allUnits, filters);

  localStorage.setItem('filteredPremises', JSON.stringify(filtered));

  const shown = portionSize;
  localStorage.setItem('shownCount', shown);

  renderUnitsPortion(filtered, shown, portionSize);
}
