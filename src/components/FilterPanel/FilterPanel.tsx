// FilterPanel Component Stub
// Commerce Bundle - Frontend Scaffold Agent

import React from 'react';
import styles from './FilterPanel.module.css';

export interface FilterPanelProps {
    categories?: string[];
    materials?: string[];
    priceRange?: { min: number; max: number };
    selectedFilters?: {
        category?: string;
        material?: string;
        minPrice?: number;
        maxPrice?: number;
    };
    onFilterChange?: (filters: FilterPanelProps['selectedFilters']) => void;
    onClear?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
    categories = [],
    materials = [],
    priceRange = { min: 0, max: 1000 },
    selectedFilters = {},
    onFilterChange,
    onClear,
}) => {
    return (
        <aside className={styles.filterPanel}>
            <div className={styles.header}>
                <h3 className={styles.title}>Filters</h3>
                <button onClick={onClear} className={styles.clearBtn}>Clear All</button>
            </div>

            {/* Category Filter */}
            <div className={styles.filterGroup}>
                <h4 className={styles.groupTitle}>Category</h4>
                <div className={styles.options}>
                    {categories.map(cat => (
                        <label key={cat} className={styles.option}>
                            <input
                                type="radio"
                                name="category"
                                checked={selectedFilters.category === cat}
                                onChange={() => onFilterChange?.({ ...selectedFilters, category: cat })}
                            />
                            <span>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Material Filter */}
            <div className={styles.filterGroup}>
                <h4 className={styles.groupTitle}>Material</h4>
                <div className={styles.options}>
                    {materials.map(mat => (
                        <label key={mat} className={styles.option}>
                            <input
                                type="checkbox"
                                checked={selectedFilters.material === mat}
                                onChange={() => onFilterChange?.({ ...selectedFilters, material: mat })}
                            />
                            <span>{mat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className={styles.filterGroup}>
                <h4 className={styles.groupTitle}>Price Range</h4>
                <div className={styles.priceInputs}>
                    <input
                        type="number"
                        placeholder="Min"
                        min={priceRange.min}
                        value={selectedFilters.minPrice || ''}
                        onChange={(e) => onFilterChange?.({ ...selectedFilters, minPrice: Number(e.target.value) })}
                        className={styles.priceInput}
                    />
                    <span>—</span>
                    <input
                        type="number"
                        placeholder="Max"
                        max={priceRange.max}
                        value={selectedFilters.maxPrice || ''}
                        onChange={(e) => onFilterChange?.({ ...selectedFilters, maxPrice: Number(e.target.value) })}
                        className={styles.priceInput}
                    />
                </div>
            </div>

            <div className={styles.pluginSlot} data-slot="filter-plugin" />
        </aside>
    );
};

export default FilterPanel;
