/**
 * Form Manager Module
 * Handles form interactions, dynamic lists, and data management
 */
class FormManager {
    constructor() {
        this.initialized = false;
    }

    async init() {
        try {
            AppLogger.info('FormManager', 'Initializing form manager');
            
            this.setupDynamicLists();
            this.setupFileOperations();
            
            this.initialized = true;
            AppLogger.info('FormManager', 'Form manager initialized successfully');
        } catch (error) {
            AppLogger.error('FormManager', 'Failed to initialize form manager', error);
            throw error;
        }
    }

    setupDynamicLists() {
        try {
            const addExtraCostBtn = document.getElementById('add-extra-cost');
            const addDiscountBtn = document.getElementById('add-discount');

            if (addExtraCostBtn) {
                addExtraCostBtn.addEventListener('click', () => this.createDynamicRow('extra-costs'));
            }

            if (addDiscountBtn) {
                addDiscountBtn.addEventListener('click', () => this.createDynamicRow('discounts'));
            }

            AppLogger.debug('FormManager', 'Dynamic list event listeners setup complete');
        } catch (error) {
            AppLogger.error('FormManager', 'Failed to setup dynamic lists', error);
        }
    }

    setupFileOperations() {
        try {
            const saveBtn = document.getElementById('save-btn');
            const importInput = document.getElementById('import-json-contract');

            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.saveContract());
                AppLogger.debug('FormManager', 'Save button event listener attached');
            } else {
                AppLogger.warn('FormManager', 'Save button not found');
            }

            if (importInput) {
                importInput.addEventListener('change', (e) => this.importContract(e));
                AppLogger.debug('FormManager', 'Import input event listener attached');
            } else {
                AppLogger.warn('FormManager', 'Import input not found (this is normal if using drag-and-drop)');
            }

            AppLogger.debug('FormManager', 'File operation event listeners setup complete');
        } catch (error) {
            AppLogger.error('FormManager', 'Failed to setup file operations', error);
        }
    }

    createDynamicRow(type) {
        try {
            const list = document.getElementById(`${type}-list`);
            if (!list) {
                throw new Error(`List container for ${type} not found`);
            }

            const item = document.createElement('div');
            item.classList.add('dynamic-list-item');
            
            // Get the TranslationManager instance from the registry
            const translationManager = ModuleRegistry.getModule('TranslationManager');
            const currentLang = translationManager ? translationManager.getCurrentLanguage() : 'en';
            const translations = translationManager ? translationManager.translations[currentLang] : {
                descriptionPlaceholder: 'Description',
                amountPlaceholder: 'Amount (€)',
                freqOneTime: 'One-Time',
                freqMonthly: 'Monthly',
                freqQuarterly: 'Quarterly',
                freqYearly: 'Yearly'
            };
            
            item.innerHTML = `
                <input type="text" class="${type}-desc" placeholder="${translations.descriptionPlaceholder}">
                <input type="number" step="0.01" class="${type}-amount" placeholder="${translations.amountPlaceholder}">
                <select class="${type}-freq">
                    <option value="one-time">${translations.freqOneTime}</option>
                    <option value="monthly" selected>${translations.freqMonthly}</option>
                    <option value="quarterly">${translations.freqQuarterly}</option>
                    <option value="yearly">${translations.freqYearly}</option>
                </select>
                <button type="button" class="remove-btn">×</button>
            `;
            
            list.appendChild(item);
            
            // Setup remove button
            const removeBtn = item.querySelector('.remove-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    item.remove();
                    AppLogger.debug('FormManager', `Removed ${type} item`);
                });
            }

            AppLogger.debug('FormManager', `Created ${type} row`);
            return item;
        } catch (error) {
            AppLogger.error('FormManager', `Failed to create dynamic row for ${type}`, error);
            return null;
        }
    }

    getDynamicListData(type) {
        try {
            const items = [];
            const listItems = document.querySelectorAll(`#${type}-list .dynamic-list-item`);
            
            listItems.forEach((item, index) => {
                try {
                    const description = item.querySelector(`.${type}-desc`)?.value?.trim();
                    const amountStr = item.querySelector(`.${type}-amount`)?.value?.trim();
                    const frequency = item.querySelector(`.${type}-freq`)?.value;

                    if (!description) {
                        AppLogger.warn('FormManager', `${type} item ${index} missing description`);
                        return;
                    }

                    const amount = parseFloat(amountStr);
                    if (isNaN(amount)) {
                        AppLogger.warn('FormManager', `${type} item ${index} has invalid amount: ${amountStr}`);
                        return;
                    }

                    items.push({ description, amount, frequency: frequency || 'monthly' });
                } catch (error) {
                    AppLogger.error('FormManager', `Error processing ${type} item ${index}`, error);
                }
            });

            return items;
        } catch (error) {
            AppLogger.error('FormManager', `Failed to get dynamic list data for ${type}`, error);
            return [];
        }
    }

    getFormData() {
        try {
            const data = {
                id: `contract-${crypto.randomUUID()}`,
                name: this.getFieldValue('contract-name'),
                provider: this.getFieldValue('provider'),
                printerInfo: {
                    manufacturer: this.getFieldValue('manufacturer'),
                    model: this.getFieldValue('model'),
                    maintenance: this.getIntValue('maintenance'),
                    reliability: this.getIntValue('reliability'),
                    support: this.getIntValue('support'),
                    easeOfUse: this.getIntValue('easeOfUse'),
                    repairability: this.getIntValue('repairability')
                },
                baseMonthlyCost: this.getFloatValue('base-cost'),
                contractDurationMonths: this.getIntValue('duration'),
                includedPagesMonochrome: this.getIntValue('mono-included'),
                costPerPageMonochromeOverrun: this.getFloatValue('mono-overrun'),
                includedPagesColor: this.getIntValue('color-included'),
                costPerPageColorOverrun: this.getFloatValue('color-overrun'),
                setupFee: this.getFloatValue('setup-fee'),
                deliveryFee: this.getFloatValue('delivery-fee'),
                extraCosts: this.getDynamicListData('extra-costs'),
                discounts: this.getDynamicListData('discounts'),
                createdAt: new Date().toISOString()
            };

            AppLogger.debug('FormManager', 'Form data collected', data);
            return data;
        } catch (error) {
            AppLogger.error('FormManager', 'Failed to get form data', error);
            throw error;
        }
    }

    getFieldValue(fieldId) {
        try {
            const field = document.getElementById(fieldId);
            return field ? field.value.trim() : '';
        } catch (error) {
            AppLogger.error('FormManager', `Failed to get value for field: ${fieldId}`, error);
            return '';
        }
    }

    getIntValue(fieldId) {
        try {
            const value = this.getFieldValue(fieldId);
            const intValue = parseInt(value);
            return isNaN(intValue) ? 0 : intValue;
        } catch (error) {
            AppLogger.error('FormManager', `Failed to get int value for field: ${fieldId}`, error);
            return 0;
        }
    }

    getFloatValue(fieldId) {
        try {
            const value = this.getFieldValue(fieldId);
            const floatValue = parseFloat(value);
            return isNaN(floatValue) ? 0 : floatValue;
        } catch (error) {
            AppLogger.error('FormManager', `Failed to get float value for field: ${fieldId}`, error);
            return 0;
        }
    }

    setFormData(data) {
        try {
            AppLogger.info('FormManager', 'Setting form data', data);

            this.setFieldValue('contract-name', data.name);
            this.setFieldValue('provider', data.provider);

            if (data.printerInfo) {
                this.setFieldValue('manufacturer', data.printerInfo.manufacturer);
                this.setFieldValue('model', data.printerInfo.model);
                this.setFieldValue('maintenance', data.printerInfo.maintenance);
                this.setFieldValue('reliability', data.printerInfo.reliability);
                this.setFieldValue('support', data.printerInfo.support);
                this.setFieldValue('easeOfUse', data.printerInfo.easeOfUse);
                this.setFieldValue('repairability', data.printerInfo.repairability);
            }

            this.setFieldValue('base-cost', data.baseMonthlyCost);
            this.setFieldValue('duration', data.contractDurationMonths);
            this.setFieldValue('mono-included', data.includedPagesMonochrome);
            this.setFieldValue('mono-overrun', data.costPerPageMonochromeOverrun);
            this.setFieldValue('color-included', data.includedPagesColor);
            this.setFieldValue('color-overrun', data.costPerPageColorOverrun);
            this.setFieldValue('setup-fee', data.setupFee);
            this.setFieldValue('delivery-fee', data.deliveryFee);

            // Handle dynamic lists
            this.setDynamicListData('extra-costs', data.extraCosts);
            this.setDynamicListData('discounts', data.discounts);

            AppLogger.info('FormManager', 'Form data set successfully');
        } catch (error) {
            AppLogger.error('FormManager', 'Failed to set form data', error);
            throw error;
        }
    }

    setFieldValue(fieldId, value) {
        try {
            const field = document.getElementById(fieldId);
            if (field && value !== undefined && value !== null && value !== '') {
                field.value = value;
            }
        } catch (error) {
            AppLogger.error('FormManager', `Failed to set field value: ${fieldId}`, error);
        }
    }

    setDynamicListData(type, dataList) {
        try {
            const listContainer = document.getElementById(`${type}-list`);
            if (!listContainer) return;

            // Clear existing items
            listContainer.innerHTML = '';

            if (!dataList || !Array.isArray(dataList)) return;

            dataList.forEach(dataItem => {
                const row = this.createDynamicRow(type);
                if (row) {
                    const descInput = row.querySelector(`.${type}-desc`);
                    const amountInput = row.querySelector(`.${type}-amount`);
                    const freqSelect = row.querySelector(`.${type}-freq`);

                    if (descInput) descInput.value = dataItem.description || '';
                    if (amountInput) amountInput.value = dataItem.amount || '';
                    if (freqSelect) freqSelect.value = dataItem.frequency || 'monthly';
                }
            });

            AppLogger.debug('FormManager', `Set ${type} data: ${dataList.length} items`);
        } catch (error) {
            AppLogger.error('FormManager', `Failed to set dynamic list data: ${type}`, error);
        }
    }

    saveContract() {
        try {
            AppLogger.info('FormManager', 'Saving contract - method called');

            const contractData = this.getFormData();
            AppLogger.debug('FormManager', 'Contract data retrieved:', contractData);
            
            // Validate required fields
            if (!contractData.name || !contractData.name.trim()) {
                throw new Error('Contract name is required');
            }

            const dataStr = JSON.stringify(contractData, null, 4);
            const filename = `${contractData.name.replace(/[^a-z0-9]/gi, '_') || 'contract'}.json`;
            
            AppLogger.debug('FormManager', `Preparing to download file: ${filename}`);
            this.downloadFile(dataStr, filename, 'application/json');
            
            AppLogger.info('FormManager', `Contract saved as ${filename}`);
        } catch (error) {
            AppLogger.error('FormManager', 'Failed to save contract', error);
            alert(`Error saving contract: ${error.message}`);
        }
    }

    async importContract(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;

            AppLogger.info('FormManager', `Importing contract from: ${file.name}`);

            const jsonText = await this.readFileAsText(file);
            const data = JSON.parse(jsonText);

            this.setFormData(data);

            AppLogger.info('FormManager', 'Contract imported successfully');
        } catch (error) {
            AppLogger.error('FormManager', 'Failed to import contract', error);
            alert('Error: Could not parse the JSON file. Please check the file format.');
        }
    }

    validateForm() {
        try {
            const errors = [];
            
            // Required field validation
            if (!this.getFieldValue('contract-name').trim()) {
                errors.push('Contract name is required');
            }

            // Numeric field validation
            const numericFields = [
                { id: 'duration', name: 'Contract Duration', min: 1, max: 120 },
                { id: 'base-cost', name: 'Base Monthly Cost', min: 0 },
                { id: 'maintenance', name: 'Maintenance', min: 0, max: 100 },
                { id: 'reliability', name: 'Reliability', min: 0, max: 100 },
                { id: 'support', name: 'Support', min: 0, max: 100 },
                { id: 'easeOfUse', name: 'Ease of Use', min: 0, max: 100 },
                { id: 'repairability', name: 'Repairability', min: 0, max: 100 }
            ];

            numericFields.forEach(field => {
                const value = field.id.includes('cost') || field.id.includes('fee') 
                    ? this.getFloatValue(field.id) 
                    : this.getIntValue(field.id);
                
                if (field.min !== undefined && value < field.min) {
                    errors.push(`${field.name} must be at least ${field.min}`);
                }
                
                if (field.max !== undefined && value > field.max) {
                    errors.push(`${field.name} must be at most ${field.max}`);
                }
            });

            return { valid: errors.length === 0, errors };
        } catch (error) {
            AppLogger.error('FormManager', 'Failed to validate form', error);
            return { valid: false, errors: ['Form validation failed'] };
        }
    }

    clearForm() {
        try {
            AppLogger.info('FormManager', 'Clearing form');

            // Clear all input fields
            const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
            inputs.forEach(input => input.value = '');

            // Clear dynamic lists
            document.getElementById('extra-costs-list').innerHTML = '';
            document.getElementById('discounts-list').innerHTML = '';

            AppLogger.info('FormManager', 'Form cleared successfully');
        } catch (error) {
            AppLogger.error('FormManager', 'Failed to clear form', error);
        }
    }

    downloadFile(content, filename, mimeType) {
        try {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.visibility = 'hidden';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            AppLogger.error('FormManager', 'Failed to download file', error);
            throw error;
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
}
