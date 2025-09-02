import { useState, useEffect } from 'react';
import Select from 'react-select';

const optionsCategory = [
    {
        id: 1,
        value: 'Европа',
        label: 'Европа',
        subCategories: [
            { id: 101, value: 'Франция', label: 'Франция' },
            { id: 102, value: 'България', label: 'България' },
            { id: 103, value: 'Германия', label: 'Германия' },
        ],
    },
    {
        id: 2,
        value: 'Азия',
        label: 'Азия',
        subCategories: [
            { id: 201, value: 'Индия', label: 'Индия' },
            { id: 202, value: 'Китай', label: 'Китай' },
            { id: 203, value: 'Япония', label: 'Япония' },
        ],
    },
];

const Category = ({ onCategoryChange }) => {
    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);

    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory);
        setSubCategory(null);

        if (onCategoryChange) {
            onCategoryChange({
                category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.label } : null,
                subCategory: null,
            });
        }
    };

    const handleSubCategoryChange = (selectedSubCategory) => {
        setSubCategory(selectedSubCategory);

        if (onCategoryChange) {
            onCategoryChange({
                category: category ? { id: category.id, name: category.label } : null,
                subCategory: selectedSubCategory ? { id: selectedSubCategory.id, name: selectedSubCategory.label } : null,
            });
        }
    };
    const selectedCategoryData = optionsCategory.find(cat => cat.id === category?.id);
    const subCategoryOptions = selectedCategoryData ? selectedCategoryData.subCategories : [];

    return (
        <div>
            {/* Категории */}
            <Select
                options={optionsCategory}
                value={category}
                onChange={handleCategoryChange}
                placeholder="Изберете категория"
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => String(e.id)}
            />

            {/* Подкатегории */}
            <div className='mt-1'>
                {subCategoryOptions.length > 0 && (
                    <Select
                        options={subCategoryOptions}
                        value={subCategory}
                        onChange={handleSubCategoryChange}
                        placeholder="Изберете подкатегория"
                        isDisabled={!subCategoryOptions.length}
                        getOptionLabel={(e) => e.label}
                        getOptionValue={(e) => String(e.id)}
                    />
                )}
            </div>
        </div>
    );
};

export default Category;
