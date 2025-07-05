/**
 * Autocomplete Manager Module
 * Handles all autocomplete functionality for form inputs
 */
class AutocompleteManager {
    constructor() {
        this.activeDropdowns = new Map();
        this.initialized = false;
    }

    async init() {
        try {
            AppLogger.info('AutocompleteManager', 'Initializing autocomplete manager');
            
            this.setupManufacturerAutocomplete();
            this.setupTemplateAutocomplete();
            
            // Global click handler to close dropdowns
            document.addEventListener('click', (e) => this.closeAllDropdowns(e.target));
            
            this.initialized = true;
            AppLogger.info('AutocompleteManager', 'Autocomplete manager initialized successfully');
        } catch (error) {
            AppLogger.error('AutocompleteManager', 'Failed to initialize autocomplete manager', error);
            throw error;
        }
    }

    setupManufacturerAutocomplete() {
        try {
            const manufacturerInput = document.getElementById('manufacturer');
            if (!manufacturerInput) {
                throw new Error('Manufacturer input not found');
            }

            // Get the PrinterDatabase instance from the registry
            const printerDatabase = ModuleRegistry.getModule('PrinterDatabase');
            if (!printerDatabase) {
                throw new Error('PrinterDatabase module not found');
            }

            const manufacturers = printerDatabase.getManufacturers();
            this.setupGenericAutocomplete(manufacturerInput, manufacturers, {
                onSelect: (value) => this.handleManufacturerChange(value)
            });

            AppLogger.debug('AutocompleteManager', 'Manufacturer autocomplete setup complete');
        } catch (error) {
            AppLogger.error('AutocompleteManager', 'Failed to setup manufacturer autocomplete', error);
        }
    }

    setupTemplateAutocomplete() {
        try {
            const contractNameInput = document.getElementById('contract-name');
            if (!contractNameInput) {
                throw new Error('Contract name input not found');
            }

            this.setupTemplateAutoComplete(contractNameInput);
            AppLogger.debug('AutocompleteManager', 'Template autocomplete setup complete');
        } catch (error) {
            AppLogger.error('AutocompleteManager', 'Failed to setup template autocomplete', error);
        }
    }

    setupGenericAutocomplete(input, dataArray, options = {}) {
        try {
            let currentFocus = -1;
            const inputId = input.id;

            const showDropdown = (items) => {
                this.closeDropdown(inputId);
                
                if (items.length === 0) return;

                const dropdown = document.createElement('div');
                dropdown.id = `${inputId}-autocomplete-list`;
                dropdown.className = 'autocomplete-items';
                
                items.forEach((item, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.innerHTML = item.highlighted;
                    itemDiv.addEventListener('click', () => {
                        input.value = item.value;
                        this.closeDropdown(inputId);
                        if (options.onSelect) {
                            options.onSelect(item.value);
                        }
                    });
                    dropdown.appendChild(itemDiv);
                });

                input.parentNode.appendChild(dropdown);
                this.activeDropdowns.set(inputId, dropdown);
            };

            const filterItems = (query) => {
                if (!query) return [];
                
                return dataArray
                    .filter(item => item.toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 10) // Limit results
                    .map(item => {
                        const index = item.toLowerCase().indexOf(query.toLowerCase());
                        const highlighted = index >= 0 
                            ? `${item.substring(0, index)}<strong>${item.substring(index, index + query.length)}</strong>${item.substring(index + query.length)}`
                            : item;
                        return { value: item, highlighted };
                    });
            };

            // Input event listener
            input.addEventListener('input', (e) => {
                const query = e.target.value;
                const items = filterItems(query);
                showDropdown(items);
                currentFocus = -1;
            });

            // Keyboard navigation
            input.addEventListener('keydown', (e) => {
                const dropdown = this.activeDropdowns.get(inputId);
                if (!dropdown) return;

                const items = dropdown.getElementsByTagName('div');
                if (e.keyCode === 40) { // Down arrow
                    currentFocus++;
                    this.setActive(items, currentFocus);
                    e.preventDefault();
                } else if (e.keyCode === 38) { // Up arrow
                    currentFocus--;
                    this.setActive(items, currentFocus);
                    e.preventDefault();
                } else if (e.keyCode === 13) { // Enter
                    e.preventDefault();
                    if (currentFocus > -1 && items[currentFocus]) {
                        items[currentFocus].click();
                    }
                } else if (e.keyCode === 27) { // Escape
                    this.closeDropdown(inputId);
                }
            });

            AppLogger.debug('AutocompleteManager', `Generic autocomplete setup for ${inputId}`);
        } catch (error) {
            AppLogger.error('AutocompleteManager', `Failed to setup autocomplete for ${input.id}`, error);
        }
    }

    setupTemplateAutoComplete(input) {
        try {
            let currentFocus = -1;
            const inputId = input.id;

            const showDropdown = (templates) => {
                this.closeDropdown(inputId);
                
                if (templates.length === 0) return;

                const dropdown = document.createElement('div');
                dropdown.id = `${inputId}-autocomplete-list`;
                dropdown.className = 'autocomplete-items';
                
                templates.forEach((template, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.innerHTML = template.highlighted;
                    itemDiv.dataset.templateIndex = index;
                    itemDiv.addEventListener('click', () => {
                        if (window.TemplateManager) {
                            window.TemplateManager.applyTemplate(template.data);
                        }
                        this.closeDropdown(inputId);
                    });
                    dropdown.appendChild(itemDiv);
                });

                input.parentNode.appendChild(dropdown);
                this.activeDropdowns.set(inputId, dropdown);
            };

            input.addEventListener('input', (e) => {
                const query = e.target.value;
                if (!query || !window.TemplateManager) return;

                const templates = window.TemplateManager.searchTemplates(query);
                showDropdown(templates);
                currentFocus = -1;
            });

            // Keyboard navigation (same as generic)
            input.addEventListener('keydown', (e) => {
                const dropdown = this.activeDropdowns.get(inputId);
                if (!dropdown) return;

                const items = dropdown.getElementsByTagName('div');
                if (e.keyCode === 40) { // Down
                    currentFocus++;
                    this.setActive(items, currentFocus);
                    e.preventDefault();
                } else if (e.keyCode === 38) { // Up
                    currentFocus--;
                    this.setActive(items, currentFocus);
                    e.preventDefault();
                } else if (e.keyCode === 13) { // Enter
                    e.preventDefault();
                    if (currentFocus > -1 && items[currentFocus]) {
                        items[currentFocus].click();
                    }
                } else if (e.keyCode === 27) { // Escape
                    this.closeDropdown(inputId);
                }
            });

            AppLogger.debug('AutocompleteManager', 'Template autocomplete setup complete');
        } catch (error) {
            AppLogger.error('AutocompleteManager', 'Failed to setup template autocomplete', error);
        }
    }

    handleManufacturerChange(manufacturerName) {
        try {
            // Get the PrinterDatabase instance from the registry
            const printerDatabase = ModuleRegistry.getModule('PrinterDatabase');
            if (!printerDatabase) {
                throw new Error('PrinterDatabase module not found');
            }

            const data = printerDatabase.getManufacturerData(manufacturerName);
            if (!data) {
                AppLogger.warn('AutocompleteManager', `No data found for manufacturer: ${manufacturerName}`);
                return;
            }

            // Fill in characteristics
            const characteristics = data.characteristics;
            const maintenanceField = document.getElementById('maintenance');
            const reliabilityField = document.getElementById('reliability');
            const supportField = document.getElementById('support');
            const easeOfUseField = document.getElementById('easeOfUse');
            const repairabilityField = document.getElementById('repairability');

            if (maintenanceField) maintenanceField.value = characteristics.maintenance;
            if (reliabilityField) reliabilityField.value = characteristics.reliability;
            if (supportField) supportField.value = characteristics.support;
            if (easeOfUseField) easeOfUseField.value = characteristics.easeOfUse;
            if (repairabilityField) repairabilityField.value = characteristics.repairability;

            // Setup model autocomplete
            const modelInput = document.getElementById('model');
            if (modelInput) {
                this.setupGenericAutocomplete(modelInput, data.models);
            }

            AppLogger.info('AutocompleteManager', `Manufacturer changed to: ${manufacturerName}`);
        } catch (error) {
            AppLogger.error('AutocompleteManager', `Failed to handle manufacturer change: ${manufacturerName}`, error);
        }
    }

    setActive(items, index) {
        if (!items || items.length === 0) return;
        
        // Remove active class from all items
        Array.from(items).forEach(item => item.classList.remove('autocomplete-active'));
        
        // Normalize index
        if (index >= items.length) index = 0;
        if (index < 0) index = items.length - 1;
        
        // Add active class to current item
        if (items[index]) {
            items[index].classList.add('autocomplete-active');
        }
    }

    closeDropdown(inputId) {
        try {
            const dropdown = this.activeDropdowns.get(inputId);
            if (dropdown && dropdown.parentNode) {
                dropdown.parentNode.removeChild(dropdown);
                this.activeDropdowns.delete(inputId);
            }
        } catch (error) {
            AppLogger.error('AutocompleteManager', `Failed to close dropdown for ${inputId}`, error);
        }
    }

    closeAllDropdowns(exceptElement) {
        try {
            for (const [inputId, dropdown] of this.activeDropdowns.entries()) {
                if (dropdown !== exceptElement && !dropdown.contains(exceptElement)) {
                    this.closeDropdown(inputId);
                }
            }
        } catch (error) {
            AppLogger.error('AutocompleteManager', 'Failed to close all dropdowns', error);
        }
    }

    refreshTemplateAutocomplete() {
        try {
            // Re-setup template autocomplete when templates change
            this.setupTemplateAutocomplete();
            AppLogger.debug('AutocompleteManager', 'Template autocomplete refreshed');
        } catch (error) {
            AppLogger.error('AutocompleteManager', 'Failed to refresh template autocomplete', error);
        }
    }
}
