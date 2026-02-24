'use client';

import RadioCard from '@/components/wizard/RadioCard';
import type { FamilyType } from '@/lib/types';

interface FamilyTypeSelectorProps {
  selectedType: FamilyType | null;
  dependentChildren: number;
  onTypeChange: (type: FamilyType) => void;
  onChildrenChange: (count: number) => void;
}

const FAMILY_OPTIONS: Array<{ value: FamilyType; label: string; description: string }> = [
  { value: 'single',        label: 'Single',        description: 'No spouse or dependants' },
  { value: 'couple',        label: 'Couple',         description: 'Married or de facto, no dependants' },
  { value: 'family',        label: 'Family',         description: 'Couple with dependent children' },
  { value: 'single-parent', label: 'Single parent',  description: 'One parent with dependent children' },
];

export default function FamilyTypeSelector({
  selectedType,
  dependentChildren,
  onTypeChange,
  onChildrenChange,
}: FamilyTypeSelectorProps) {
  const showChildren = selectedType === 'family' || selectedType === 'single-parent';

  return (
    <div>
      <fieldset>
        <legend className="label mb-3">What is your family situation?</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FAMILY_OPTIONS.map((opt) => (
            <RadioCard
              key={opt.value}
              id={`family-${opt.value}`}
              name="familyType"
              value={opt.value}
              checked={selectedType === opt.value}
              onChange={(val) => onTypeChange(val as FamilyType)}
              label={opt.label}
              description={opt.description}
            />
          ))}
        </div>
      </fieldset>

      {showChildren && (
        <div className="mt-4">
          <label htmlFor="dependent-children" className="label">
            Number of dependent children
          </label>
          <select
            id="dependent-children"
            value={dependentChildren}
            onChange={(e) => onChildrenChange(parseInt(e.target.value, 10))}
            className="input-field max-w-[200px]"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'child' : 'children'}
              </option>
            ))}
          </select>
          {dependentChildren > 1 && (
            <p className="text-sm text-muted mt-1">
              Family MLS threshold increases by $1,500 for each child after the first.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
