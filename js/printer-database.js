/**
 * Printer Database Module
 * Manages printer information and autocomplete data
 */
class PrinterDatabase {
    constructor() {
        this.printerData = {};
        this.initialized = false;
    }

    async init() {
        try {
            AppLogger.info('PrinterDatabase', 'Initializing printer database');
            
            this.printerData = {
                "Canon": {
                    models: ["imageRUNNER ADVANCE DX C3800 Series", "imageRUNNER ADVANCE DX 6800 Series", "i-SENSYS X Series"],
                    characteristics: { maintenance: 85, reliability: 90, support: 88, easeOfUse: 87, repairability: 80 }
                },
                "Toshiba": {
                    models: ["e-STUDIO 7527AC", "e-STUDIO 6529A", "e-STUDIO 509CS"],
                    characteristics: { maintenance: 85, reliability: 88, support: 80, easeOfUse: 87, repairability: 80 }
                },
                "Ricoh": {
                    models: ["IM C Series", "IM Series"],
                    characteristics: { maintenance: 82, reliability: 88, support: 80, easeOfUse: 89, repairability: 78 }
                },
                "Konica Minolta": {
                    models: ["bizhub i-Series"],
                    characteristics: { maintenance: 80, reliability: 90, support: 82, easeOfUse: 85, repairability: 75 }
                },
                "Koesio (Kyocera)": {
                    models: ["TASKalfa Series", "ECOSYS Series"],
                    characteristics: { maintenance: 85, reliability: 92, support: 85, easeOfUse: 85, repairability: 88 }
                },
                "Sharp": {
                    models: ["MX-B/C Series"],
                    characteristics: { maintenance: 70, reliability: 75, support: 60, easeOfUse: 80, repairability: 65 }
                },
                "Xerox": {
                    models: ["AltaLink C8200/B8100 Series", "VersaLink C7100/B7100 Series"],
                    characteristics: { maintenance: 65, reliability: 70, support: 55, easeOfUse: 85, repairability: 60 }
                },
                "HP": {
                    models: ["LaserJet Enterprise M700/M800 Series", "PageWide Enterprise Series"],
                    characteristics: { maintenance: 75, reliability: 80, support: 70, easeOfUse: 85, repairability: 70 }
                },
                "Epson": {
                    models: ["WorkForce Enterprise Series", "WorkForce Pro Series"],
                    characteristics: { maintenance: 88, reliability: 90, support: 85, easeOfUse: 87, repairability: 85 }
                }
            };

            this.initialized = true;
            AppLogger.info('PrinterDatabase', `Loaded ${Object.keys(this.printerData).length} manufacturers`);
        } catch (error) {
            AppLogger.error('PrinterDatabase', 'Failed to initialize printer database', error);
            throw error;
        }
    }

    getManufacturers() {
        try {
            return Object.keys(this.printerData);
        } catch (error) {
            AppLogger.error('PrinterDatabase', 'Failed to get manufacturers', error);
            return [];
        }
    }

    getManufacturerData(manufacturer) {
        try {
            const data = this.printerData[manufacturer];
            if (!data) {
                AppLogger.warn('PrinterDatabase', `Manufacturer ${manufacturer} not found`);
                return null;
            }
            return data;
        } catch (error) {
            AppLogger.error('PrinterDatabase', `Failed to get data for manufacturer ${manufacturer}`, error);
            return null;
        }
    }

    getModels(manufacturer) {
        try {
            const data = this.getManufacturerData(manufacturer);
            return data ? data.models : [];
        } catch (error) {
            AppLogger.error('PrinterDatabase', `Failed to get models for manufacturer ${manufacturer}`, error);
            return [];
        }
    }

    getCharacteristics(manufacturer) {
        try {
            const data = this.getManufacturerData(manufacturer);
            return data ? data.characteristics : null;
        } catch (error) {
            AppLogger.error('PrinterDatabase', `Failed to get characteristics for manufacturer ${manufacturer}`, error);
            return null;
        }
    }

    getAllData() {
        return this.printerData;
    }

    addManufacturer(name, data) {
        try {
            if (!name || !data) {
                throw new Error('Manufacturer name and data are required');
            }

            if (!data.models || !Array.isArray(data.models)) {
                throw new Error('Models array is required');
            }

            if (!data.characteristics || typeof data.characteristics !== 'object') {
                throw new Error('Characteristics object is required');
            }

            this.printerData[name] = data;
            AppLogger.info('PrinterDatabase', `Added manufacturer: ${name}`);
            return true;
        } catch (error) {
            AppLogger.error('PrinterDatabase', `Failed to add manufacturer ${name}`, error);
            return false;
        }
    }

    updateManufacturer(name, data) {
        try {
            if (!this.printerData[name]) {
                throw new Error(`Manufacturer ${name} not found`);
            }

            this.printerData[name] = { ...this.printerData[name], ...data };
            AppLogger.info('PrinterDatabase', `Updated manufacturer: ${name}`);
            return true;
        } catch (error) {
            AppLogger.error('PrinterDatabase', `Failed to update manufacturer ${name}`, error);
            return false;
        }
    }

    removeManufacturer(name) {
        try {
            if (!this.printerData[name]) {
                throw new Error(`Manufacturer ${name} not found`);
            }

            delete this.printerData[name];
            AppLogger.info('PrinterDatabase', `Removed manufacturer: ${name}`);
            return true;
        } catch (error) {
            AppLogger.error('PrinterDatabase', `Failed to remove manufacturer ${name}`, error);
            return false;
        }
    }

    validateCharacteristics(characteristics) {
        const required = ['maintenance', 'reliability', 'support', 'easeOfUse', 'repairability'];
        for (const field of required) {
            if (!(field in characteristics)) {
                return { valid: false, error: `Missing required field: ${field}` };
            }
            const value = characteristics[field];
            if (typeof value !== 'number' || value < 0 || value > 100) {
                return { valid: false, error: `Field ${field} must be a number between 0 and 100` };
            }
        }
        return { valid: true };
    }

    exportToCSV() {
        try {
            const headers = "manufacturer;models;maintenance;reliability;support;easeOfUse;repairability";
            const rows = [];

            for (const [manufacturer, data] of Object.entries(this.printerData)) {
                const modelsStr = data.models.join('|'); // Use | as separator for models
                const char = data.characteristics;
                rows.push(`${manufacturer};${modelsStr};${char.maintenance};${char.reliability};${char.support};${char.easeOfUse};${char.repairability}`);
            }

            const csvContent = headers + '\n' + rows.join('\n');
            AppLogger.info('PrinterDatabase', 'Exported printer database to CSV');
            return csvContent;
        } catch (error) {
            AppLogger.error('PrinterDatabase', 'Failed to export to CSV', error);
            return null;
        }
    }

    getStatistics() {
        try {
            const stats = {
                totalManufacturers: Object.keys(this.printerData).length,
                totalModels: 0,
                averageCharacteristics: {
                    maintenance: 0,
                    reliability: 0,
                    support: 0,
                    easeOfUse: 0,
                    repairability: 0
                },
                manufacturerRankings: {}
            };

            const manufacturers = Object.keys(this.printerData);
            const totals = { maintenance: 0, reliability: 0, support: 0, easeOfUse: 0, repairability: 0 };

            for (const [manufacturer, data] of Object.entries(this.printerData)) {
                stats.totalModels += data.models.length;
                
                const char = data.characteristics;
                totals.maintenance += char.maintenance;
                totals.reliability += char.reliability;
                totals.support += char.support;
                totals.easeOfUse += char.easeOfUse;
                totals.repairability += char.repairability;

                stats.manufacturerRankings[manufacturer] = {
                    modelCount: data.models.length,
                    overallScore: (char.maintenance + char.reliability + char.support + char.easeOfUse + char.repairability) / 5
                };
            }

            // Calculate averages
            const count = manufacturers.length;
            stats.averageCharacteristics.maintenance = Math.round(totals.maintenance / count);
            stats.averageCharacteristics.reliability = Math.round(totals.reliability / count);
            stats.averageCharacteristics.support = Math.round(totals.support / count);
            stats.averageCharacteristics.easeOfUse = Math.round(totals.easeOfUse / count);
            stats.averageCharacteristics.repairability = Math.round(totals.repairability / count);

            AppLogger.info('PrinterDatabase', 'Generated statistics', stats);
            return stats;
        } catch (error) {
            AppLogger.error('PrinterDatabase', 'Failed to generate statistics', error);
            return null;
        }
    }
}
