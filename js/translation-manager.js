/**
 * Translation Manager Module
 * Handles internationalization and language switching
 */
class TranslationManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.initialized = false;
    }

    async init() {
        try {
            // Safe logging - check if AppLogger exists
            if (typeof AppLogger !== 'undefined') {
                AppLogger.info('TranslationManager', 'Initializing translation manager');
            } else {
                console.log('TranslationManager: Initializing translation manager');
            }
            
            this.translations = {
                en: {
                    title: '🖨️ Printer Leasing Contract Tool',
                    templates: 'Contract Templates & Import',
                    importTemplatesBtn: '📂 Import Templates (CSV)',
                    downloadTemplateBtn: '📥 Download Template',
                    generalInfo: 'General Information',
                    contractName: 'Contract Name',
                    contractNamePlaceholder: 'e.g., Contract A (HP LaserJet Pro)',
                    provider: 'Provider',
                    providerPlaceholder: 'e.g., Printer Solutions Inc.',
                    duration: 'Contract Duration (Months)',
                    durationPlaceholder: 'e.g., 36',
                    printerInfo: 'Printer Information',
                    manufacturer: 'Manufacturer',
                    manufacturerPlaceholder: 'e.g., Canon',
                    model: 'Model',
                    modelPlaceholder: 'e.g., imageRUNNER...',
                    maintenance: 'Maintenance (0-100)',
                    reliability: 'Reliability (0-100)',
                    support: 'Support (0-100)',
                    easeOfUse: 'Ease of Use (0-100)',
                    repairability: 'Repairability (0-100)',
                    coreCosts: 'Core Costs',
                    baseCost: 'Base Monthly Cost (€)',
                    baseCostPlaceholder: 'e.g., 50.00',
                    setupFee: 'Setup Fee (€)',
                    setupFeePlaceholder: 'e.g., 100.00',
                    deliveryFee: 'Delivery Fee (€)',
                    deliveryFeePlaceholder: 'e.g., 50.00',
                    pageCosts: 'Page Costs',
                    monoIncluded: 'Included Mono Pages',
                    monoIncludedPlaceholder: 'e.g., 5000',
                    monoOverrun: 'Mono Overrun Cost (€)',
                    monoOverrunPlaceholder: 'e.g., 0.01',
                    colorIncluded: 'Included Color Pages',
                    colorIncludedPlaceholder: 'e.g., 1000',
                    colorOverrun: 'Color Overrun Cost (€)',
                    colorOverrunPlaceholder: 'e.g., 0.05',
                    extraCosts: 'Extra Costs',
                    addExtraCost: 'Add Extra Cost',
                    discounts: 'Discounts',
                    addDiscount: 'Add Discount',
                    saveBtn: '💾 Save as JSON',
                    importBtn: '📂 Import from JSON',
                    importJsonBtn: '📄 Import Contract (JSON)',
                    dropZoneText: 'Drag & Drop Files Here',
                    dropZoneSubtext: 'or click to browse (.json, .csv files)',
                    descriptionPlaceholder: 'Description',
                    amountPlaceholder: 'Amount (€)',
                    freqOneTime: 'One-Time',
                    freqMonthly: 'Monthly',
                    freqQuarterly: 'Quarterly',
                    freqYearly: 'Yearly'
                },
                fr: {
                    title: '🖨️ Outil de Contrat de Location d\'Imprimante',
                    templates: 'Modèles de Contrat et Import',
                    importTemplatesBtn: '📂 Importer des Modèles (CSV)',
                    downloadTemplateBtn: '📥 Télécharger le Modèle',
                    generalInfo: 'Informations Générales',
                    contractName: 'Nom du Contrat',
                    contractNamePlaceholder: 'ex: Contrat A (HP LaserJet Pro)',
                    provider: 'Fournisseur',
                    providerPlaceholder: 'ex: Printer Solutions Inc.',
                    duration: 'Durée du Contrat (Mois)',
                    durationPlaceholder: 'ex: 36',
                    printerInfo: 'Informations sur l\'Imprimante',
                    manufacturer: 'Fabricant',
                    manufacturerPlaceholder: 'ex: Canon',
                    model: 'Modèle',
                    modelPlaceholder: 'ex: imageRUNNER...',
                    maintenance: 'Maintenance (0-100)',
                    reliability: 'Fiabilité (0-100)',
                    support: 'Support (0-100)',
                    easeOfUse: 'Facilité d\'Utilisation (0-100)',
                    repairability: 'Réparabilité (0-100)',
                    coreCosts: 'Coûts de Base',
                    baseCost: 'Coût Mensuel de Base (€)',
                    baseCostPlaceholder: 'ex: 50.00',
                    setupFee: 'Frais d\'Installation (€)',
                    setupFeePlaceholder: 'ex: 100.00',
                    deliveryFee: 'Frais de Livraison (€)',
                    deliveryFeePlaceholder: 'ex: 50.00',
                    pageCosts: 'Coûts par Page',
                    monoIncluded: 'Pages Mono Incluses',
                    monoIncludedPlaceholder: 'ex: 5000',
                    monoOverrun: 'Coût Dépassement Mono (€)',
                    monoOverrunPlaceholder: 'ex: 0.01',
                    colorIncluded: 'Pages Couleur Incluses',
                    colorIncludedPlaceholder: 'ex: 1000',
                    colorOverrun: 'Coût Dépassement Couleur (€)',
                    colorOverrunPlaceholder: 'ex: 0.05',
                    extraCosts: 'Coûts Supplémentaires',
                    addExtraCost: 'Ajouter un Coût',
                    discounts: 'Réductions',
                    addDiscount: 'Ajouter une Réduction',
                    saveBtn: '💾 Sauvegarder en JSON',
                    importBtn: '📂 Importer depuis JSON',
                    importJsonBtn: '📄 Importer Contrat (JSON)',
                    dropZoneText: 'Glisser-Déposer Fichiers Ici',
                    dropZoneSubtext: 'ou cliquer pour parcourir (fichiers .json, .csv)',
                    descriptionPlaceholder: 'Description',
                    amountPlaceholder: 'Montant (€)',
                    freqOneTime: 'Unique',
                    freqMonthly: 'Mensuel',
                    freqQuarterly: 'Trimestriel',
                    freqYearly: 'Annuel'
                }
            };

            this.setupLanguageSwitchers();
            this.setLanguage(this.currentLanguage);
            this.initialized = true;
            
            if (typeof AppLogger !== 'undefined') {
                AppLogger.info('TranslationManager', 'Translation manager initialized successfully');
            } else {
                console.log('TranslationManager: Translation manager initialized successfully');
            }
        } catch (error) {
            if (typeof AppLogger !== 'undefined') {
                AppLogger.error('TranslationManager', 'Failed to initialize translation manager', error);
            } else {
                console.error('TranslationManager: Failed to initialize translation manager', error);
            }
            throw error;
        }
    }

    setLanguage(lang) {
        try {
            if (!this.translations[lang]) {
                throw new Error(`Language ${lang} not supported`);
            }

            this.currentLanguage = lang;
            
            // Update text content
            document.querySelectorAll('[data-lang]').forEach(el => {
                const key = el.getAttribute('data-lang');
                if (this.translations[lang][key]) {
                    el.textContent = this.translations[lang][key];
                }
            });

            // Update placeholders
            document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
                const key = el.getAttribute('data-lang-placeholder');
                if (this.translations[lang][key]) {
                    el.placeholder = this.translations[lang][key];
                }
            });

            // Update dynamic list items
            document.querySelectorAll('.dynamic-list-item').forEach(item => {
                const textInput = item.querySelector('input[type="text"]');
                const numberInput = item.querySelector('input[type="number"]');
                if (textInput) textInput.placeholder = this.translations[lang].descriptionPlaceholder;
                if (numberInput) numberInput.placeholder = this.translations[lang].amountPlaceholder;
            });

            // Update language switcher
            document.querySelectorAll('.lang-switcher span').forEach(span => span.classList.remove('active'));
            const activeSpan = document.getElementById(`lang-${lang}`);
            if (activeSpan) activeSpan.classList.add('active');

            AppLogger.info('TranslationManager', `Language switched to ${lang}`);
        } catch (error) {
            AppLogger.error('TranslationManager', `Failed to set language to ${lang}`, error);
            throw error;
        }
    }

    setupLanguageSwitchers() {
        try {
            const frSwitcher = document.getElementById('lang-fr');
            const enSwitcher = document.getElementById('lang-en');

            if (frSwitcher) {
                frSwitcher.addEventListener('click', () => this.setLanguage('fr'));
            }
            if (enSwitcher) {
                enSwitcher.addEventListener('click', () => this.setLanguage('en'));
            }

            AppLogger.debug('TranslationManager', 'Language switchers setup complete');
        } catch (error) {
            AppLogger.error('TranslationManager', 'Failed to setup language switchers', error);
            throw error;
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getTranslation(key, lang = null) {
        const targetLang = lang || this.currentLanguage;
        return this.translations[targetLang]?.[key] || key;
    }

    getSupportedLanguages() {
        return Object.keys(this.translations);
    }
}
