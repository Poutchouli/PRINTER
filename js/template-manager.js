/**
 * Template Manager Module
 * Handles template loading, saving, and management
 */
class TemplateManager {
    constructor() {
        this.customTemplates = [];
        this.initialized = false;
    }

    async init() {
        try {
            AppLogger.info('TemplateManager', 'Initializing template manager');
            
            this.setupEventListeners();
            this.initialized = true;
            
            AppLogger.info('TemplateManager', 'Template manager initialized successfully');
        } catch (error) {
            AppLogger.error('TemplateManager', 'Failed to initialize template manager', error);
            throw error;
        }
    }

    setupEventListeners() {
        try {
            const downloadBtn = document.getElementById('download-template');
            const importInput = document.getElementById('import-templates');

            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => this.downloadTemplate());
            }

            if (importInput) {
                importInput.addEventListener('change', (e) => this.importTemplates(e));
            }

            AppLogger.debug('TemplateManager', 'Event listeners setup complete');
        } catch (error) {
            AppLogger.error('TemplateManager', 'Failed to setup event listeners', error);
        }
    }

    downloadTemplate() {
        try {
            const headers = "name;provider;manufacturer;model;maintenance;reliability;support;easeOfUse;repairability;baseMonthlyCost;contractDurationMonths;includedPagesMonochrome;costPerPageMonochromeOverrun;includedPagesColor;costPerPageColorOverrun;setupFee;deliveryFee;extraCosts;discounts";
            
            // Generate comprehensive field descriptions
            const fieldDescriptions = this.generateFieldDescriptions();
            
            // Generate templates using actual printer data
            let csvContent = fieldDescriptions + headers + '\n';
            
            // Create example templates for each manufacturer
            const printerData = PrinterDatabase.getAllData();
            Object.keys(printerData).forEach((manufacturer, index) => {
                const data = printerData[manufacturer];
                const firstModel = data.models[0];
                const char = data.characteristics;
                const templateName = `Template ${String.fromCharCode(65 + index)} - ${manufacturer}`;
                const provider = `${manufacturer} Solutions Inc.`;
                const baseCost = 50 + (index * 25);
                
                const templateRow = `${templateName};${provider};${manufacturer};${firstModel};${char.maintenance};${char.reliability};${char.support};${char.easeOfUse};${char.repairability};${baseCost}.00;36;5000;0.01${index};1000;0.0${5+index};100;50;[{"description":"Monthly support","amount":${15+index*5},"frequency":"monthly"}];[]`;
                csvContent += templateRow + '\n';
            });
            
            // Add empty template at the end
            csvContent += ';;;;;;;;;;;;;;;;;;[];[]';
            
            this.downloadFile(csvContent, 'printer_database_template.csv', 'text/csv');
            AppLogger.info('TemplateManager', 'Template downloaded successfully');
        } catch (error) {
            AppLogger.error('TemplateManager', 'Failed to download template', error);
            alert('Error downloading template. Please check the console for details.');
        }
    }

    generateFieldDescriptions() {
        const printerData = PrinterDatabase.getAllData();
        
        return `# CSV Template for Contract Templates - Current Printer Database
# This template shows the current printer manufacturers and models available in autocomplete
# You can use this data as reference when creating your contract templates
# Below are all the current manufacturers, their models, and characteristics
#
# Current Available Manufacturers and Models:
${Object.entries(printerData).map(([manufacturer, data]) => 
    `# ${manufacturer}: ${data.models.join(', ')}`
).join('\n')}
#
# Characteristics by Manufacturer (Maintenance, Reliability, Support, Ease of Use, Repairability):
${Object.entries(printerData).map(([manufacturer, data]) => {
    const char = data.characteristics;
    return `# ${manufacturer}: ${char.maintenance}, ${char.reliability}, ${char.support}, ${char.easeOfUse}, ${char.repairability}`;
}).join('\n')}
#
# Template Format Guide:
# name = Contract Name, provider = Provider Name, manufacturer = Use from list above
# model = Use models from manufacturer above, maintenance/reliability/support/easeOfUse/repairability = 0-100
# Costs in euros, durations in months, pages as numbers
# extraCosts/discounts = JSON format: [{"description":"Name","amount":0,"frequency":"monthly"}]
# Frequency options: "one-time", "monthly", "quarterly", "yearly"
#
`;
    }

    async importTemplates(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;

            AppLogger.info('TemplateManager', `Importing templates from: ${file.name}`);

            const csvText = await this.readFileAsText(file);
            const templates = this.parseCSV(csvText);
            
            this.customTemplates = templates;
            
            // Refresh autocomplete
            if (window.AutocompleteManager) {
                window.AutocompleteManager.refreshTemplateAutocomplete();
            }

            AppLogger.info('TemplateManager', `Successfully imported ${templates.length} templates`);
            alert(`${templates.length} templates loaded successfully!`);
        } catch (error) {
            AppLogger.error('TemplateManager', 'Failed to import templates', error);
            alert('Error parsing CSV file. Please check the format and try again.');
        }
    }

    parseCSV(csvText) {
        try {
            const lines = csvText.trim().split(/\r?\n/);
            
            // Find header line (skip comment lines starting with #)
            let headerIndex = 0;
            while (headerIndex < lines.length && lines[headerIndex].startsWith('#')) {
                headerIndex++;
            }
            
            if (headerIndex >= lines.length) {
                throw new Error('No header line found in CSV');
            }

            const headers = lines[headerIndex].split(';').map(h => h.trim());
            const templates = [];

            for (let i = headerIndex + 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line === '' || line.startsWith('#')) continue;

                const values = this.parseCSVLine(line);
                if (values.length !== headers.length) {
                    AppLogger.warn('TemplateManager', `Line ${i + 1} has ${values.length} values, expected ${headers.length}`);
                    continue;
                }

                const template = {};
                for (let j = 0; j < headers.length; j++) {
                    template[headers[j]] = values[j] ? values[j].trim() : '';
                }

                // Validate template
                if (this.validateTemplate(template)) {
                    templates.push(template);
                } else {
                    AppLogger.warn('TemplateManager', `Template on line ${i + 1} failed validation`);
                }
            }

            return templates;
        } catch (error) {
            AppLogger.error('TemplateManager', 'Failed to parse CSV', error);
            throw error;
        }
    }

    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ';' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current);
        return values;
    }

    validateTemplate(template) {
        try {
            // Required fields
            if (!template.name || template.name.trim() === '') {
                return false;
            }

            // Validate JSON fields
            if (template.extraCosts) {
                try {
                    JSON.parse(template.extraCosts);
                } catch {
                    AppLogger.warn('TemplateManager', `Invalid extraCosts JSON in template: ${template.name}`);
                    return false;
                }
            }

            if (template.discounts) {
                try {
                    JSON.parse(template.discounts);
                } catch {
                    AppLogger.warn('TemplateManager', `Invalid discounts JSON in template: ${template.name}`);
                    return false;
                }
            }

            return true;
        } catch (error) {
            AppLogger.error('TemplateManager', 'Error validating template', error);
            return false;
        }
    }

    applyTemplate(template) {
        try {
            if (!template) {
                throw new Error('No template provided');
            }

            AppLogger.info('TemplateManager', `Applying template: ${template.name}`);

            // Fill form fields
            this.setFieldValue('contract-name', template.name);
            this.setFieldValue('provider', template.provider);
            this.setFieldValue('manufacturer', template.manufacturer);
            this.setFieldValue('model', template.model);
            this.setFieldValue('maintenance', template.maintenance);
            this.setFieldValue('reliability', template.reliability);
            this.setFieldValue('support', template.support);
            this.setFieldValue('easeOfUse', template.easeOfUse);
            this.setFieldValue('repairability', template.repairability);
            this.setFieldValue('base-cost', template.baseMonthlyCost);
            this.setFieldValue('duration', template.contractDurationMonths);
            this.setFieldValue('mono-included', template.includedPagesMonochrome);
            this.setFieldValue('mono-overrun', template.costPerPageMonochromeOverrun);
            this.setFieldValue('color-included', template.includedPagesColor);
            this.setFieldValue('color-overrun', template.costPerPageColorOverrun);
            this.setFieldValue('setup-fee', template.setupFee);
            this.setFieldValue('delivery-fee', template.deliveryFee);

            // Handle dynamic lists
            this.populateDynamicList('extra-costs', template.extraCosts);
            this.populateDynamicList('discounts', template.discounts);

            AppLogger.info('TemplateManager', 'Template applied successfully');
        } catch (error) {
            AppLogger.error('TemplateManager', `Failed to apply template: ${template?.name}`, error);
        }
    }

    setFieldValue(fieldId, value) {
        try {
            const field = document.getElementById(fieldId);
            if (field && value !== undefined && value !== null) {
                field.value = value;
            }
        } catch (error) {
            AppLogger.error('TemplateManager', `Failed to set field value: ${fieldId}`, error);
        }
    }

    populateDynamicList(type, jsonString) {
        try {
            const listContainer = document.getElementById(`${type}-list`);
            if (!listContainer) return;

            listContainer.innerHTML = '';
            
            if (!jsonString) return;

            const dataList = JSON.parse(jsonString);
            if (!Array.isArray(dataList)) return;

            dataList.forEach(dataItem => {
                if (window.FormManager) {
                    const row = window.FormManager.createDynamicRow(type);
                    if (row) {
                        const descInput = row.querySelector(`.${type}-desc`);
                        const amountInput = row.querySelector(`.${type}-amount`);
                        const freqSelect = row.querySelector(`.${type}-freq`);

                        if (descInput) descInput.value = dataItem.description || '';
                        if (amountInput) amountInput.value = dataItem.amount || '';
                        if (freqSelect) freqSelect.value = dataItem.frequency || 'monthly';
                    }
                }
            });
        } catch (error) {
            AppLogger.error('TemplateManager', `Failed to populate dynamic list: ${type}`, error);
        }
    }

    searchTemplates(query) {
        try {
            if (!query || this.customTemplates.length === 0) {
                return [];
            }

            const results = this.customTemplates
                .filter(template => 
                    template.name.toLowerCase().includes(query.toLowerCase())
                )
                .slice(0, 10)
                .map(template => {
                    const index = template.name.toLowerCase().indexOf(query.toLowerCase());
                    const highlighted = index >= 0 
                        ? `<strong>${template.name.substring(0, index + query.length)}</strong>${template.name.substring(index + query.length)}`
                        : template.name;
                    return { data: template, highlighted };
                });

            return results;
        } catch (error) {
            AppLogger.error('TemplateManager', 'Failed to search templates', error);
            return [];
        }
    }

    getTemplates() {
        return this.customTemplates;
    }

    getTemplateCount() {
        return this.customTemplates.length;
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
            AppLogger.error('TemplateManager', 'Failed to download file', error);
            throw error;
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
}
