# 🖨️ Printer Contract Management Tool

A comprehensive web application for managing printer leasing contracts with multi-language support, drag-and-drop file imports, and modular architecture.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Development](#development)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [TODO](#todo)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality
- **Contract Management**: Create, edit, and save printer leasing contracts
- **Multi-language Support**: English and French interface (🇬🇧/🇫🇷)
- **Drag & Drop Import**: Import JSON contracts and CSV templates
- **Autocomplete**: Smart manufacturer and model suggestions
- **Dynamic Lists**: Add/remove extra costs and discounts
- **JSON Export/Import**: Save and load contract data

### Advanced Features
- **Modular Architecture**: Clean separation of concerns with module registry
- **Error Logging**: Comprehensive logging and debugging system
- **Debug Panel**: Toggle with `Ctrl+Shift+D` for system diagnostics
- **Template System**: Industry-specific contract templates
- **Responsive Design**: Modern, mobile-friendly interface

### Data Management
- **Printer Database**: Pre-loaded manufacturer specifications
- **Contract Templates**: Various industry scenarios (Enterprise, SMB, Healthcare, etc.)
- **Import/Export**: CSV and JSON format support
- **Validation**: Form validation and error handling

## 🚀 Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)
- Docker (optional, for containerized deployment)

### Quick Start
1. **Clone or download** the project files
2. **Open directly** in browser: `file:///path/to/index.html`
3. **Or serve locally**:
   ```bash
   cd WORKWORK/PRINTER
   python -m http.server 8080
   # Navigate to http://localhost:8080
   ```

### Development Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd printer-contract-tool

# Start development server
python -m http.server 8080

# Or use Node.js
npx http-server -p 8080
```

## 📖 Usage

### Basic Contract Creation
1. **Fill in contract details**: Name, provider, duration
2. **Select manufacturer**: Use autocomplete for suggestions
3. **Enter costs**: Base cost, setup fees, page costs
4. **Add extras**: Extra costs and discounts
5. **Save**: Click "💾 Save as JSON"

### Import Contracts
- **Drag & Drop**: Drop `.json` or `.csv` files onto the drop zone
- **Browse**: Click the drop zone to select files
- **Import Buttons**: Use specific import buttons for different file types

### Language Switching
- **English**: Click 🇬🇧 flag
- **French**: Click 🇫🇷 flag
- Interface translates automatically

### Debug Mode
- **Activate**: Press `Ctrl+Shift+D`
- **View**: Module status, logs, system information
- **Export**: Download debug logs

## 🏗️ Architecture

### Modular Design
The application uses a modular architecture with dependency management:

```
PrinterApp (Global Namespace)
├── Logger (Centralized logging)
├── ModuleRegistry (Dependency management)
├── TranslationManager (i18n support)
├── PrinterDatabase (Manufacturer data)
├── AutocompleteManager (Form enhancements)
├── TemplateManager (Template operations)
├── FormManager (Form handling)
└── DebugPanel (Development tools)
```

### Module Communication
- **Registry Pattern**: Centralized module registration and discovery
- **Event-Driven**: Modules communicate through events and callbacks
- **Error Isolation**: Module failures don't crash the entire application
- **Lazy Loading**: Modules initialize only when needed

## 📁 File Structure

```
PRINTER/
├── index.html                 # Main application
├── README.md                  # This file
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose setup
├── requirements.txt           # Python dependencies
│
├── js/                        # JavaScript modules
│   ├── logger.js             # Logging system
│   ├── module-registry.js    # Module management
│   ├── translation-manager.js # Internationalization
│   ├── printer-database.js   # Printer data
│   ├── autocomplete-manager.js # Form enhancements
│   ├── template-manager.js   # Template handling
│   ├── form-manager.js       # Form operations
│   └── debug-panel.js        # Debug interface
│
├── test/                     # Test data
│   ├── README.md            # Test documentation
│   ├── contracts_template.csv # CSV template
│   ├── contracts_extended_template.csv # Extended CSV
│   ├── contract_*.json      # Sample contracts
│   └── template_*.json      # Industry templates
│
├── static/                  # Static assets
│   └── script.js           # Legacy script
│
├── templates/              # HTML templates
│   └── index.html         # Alternative template
│
└── printer_lease_webapp/  # Flask webapp (alternative)
    ├── app.py
    ├── static/
    └── templates/
```

## 🛠️ Development

### Adding New Modules
1. **Create module file** in `js/` directory
2. **Implement class** with `init()` method
3. **Register module** in `index.html`
4. **Add dependencies** if needed

Example:
```javascript
class NewModule {
    constructor() {
        this.initialized = false;
    }
    
    async init() {
        // Initialization code
        this.initialized = true;
    }
}

// Register in index.html
PrinterApp.moduleRegistry.register('NewModule', {
    version: '1.0.0',
    description: 'Description',
    instance: new NewModule(),
    dependencies: []
});
```

### Adding Translations
Update `js/translation-manager.js`:
```javascript
en: {
    newKey: 'English text'
},
fr: {
    newKey: 'Texte français'
}
```

### Adding Printer Manufacturers
Update `js/printer-database.js`:
```javascript
"NewBrand": {
    models: ["Model 1", "Model 2"],
    characteristics: { 
        maintenance: 80, 
        reliability: 85, 
        support: 75, 
        easeOfUse: 90, 
        repairability: 80 
    }
}
```

## 🧪 Testing

### Test Data
The `test/` folder contains comprehensive test scenarios:

- **Standard Contracts**: 7 different manufacturer examples
- **Extended Templates**: 5 industry-specific templates
- **Edge Cases**: 10 boundary and error test cases
- **CSV Templates**: Batch import testing

### Manual Testing
1. **Import each test file** from `test/` folder
2. **Verify form population** and data integrity
3. **Test language switching** with imported data
4. **Check drag-and-drop** functionality
5. **Validate export/save** operations

### Debug Testing
- **Enable debug panel**: `Ctrl+Shift+D`
- **Check module status**: All should show "✅ Healthy"
- **Monitor logs**: Look for errors or warnings
- **Test error scenarios**: Import invalid files

## 🐳 Docker Deployment

### Build and Run
```bash
# Build image
docker build -t printer-contract-tool .

# Run container
docker run -p 8080:80 printer-contract-tool

# Or use Docker Compose
docker-compose up -d
```

### Production Deployment
```bash
# Production build
docker build -t printer-contract-tool:prod .

# Deploy with nginx
docker run -d \
  --name printer-app \
  -p 80:80 \
  printer-contract-tool:prod
```

## 📝 TODO

### High Priority
- [ ] **Remove useless buttons** - Clean up redundant UI elements
- [ ] **Change template button** - Update template button design and functionality
- [ ] **Make template button work** - Implement proper template download functionality

### Medium Priority
- [ ] Add user authentication system
- [ ] Implement contract comparison feature
- [ ] Add contract versioning and history
- [ ] Create contract analytics dashboard
- [ ] Add email integration for contract sharing
- [ ] Implement contract approval workflow

### Low Priority
- [ ] Add more language support (German, Spanish, Italian)
- [ ] Create mobile app version
- [ ] Add integration with printer management systems
- [ ] Implement advanced search and filtering
- [ ] Add contract templates marketplace
- [ ] Create API for third-party integrations

### Bug Fixes
- [ ] Fix edge cases in drag-and-drop validation
- [ ] Improve error handling for large file imports
- [ ] Optimize performance for complex contracts
- [ ] Fix minor translation inconsistencies

### Code Quality
- [ ] Add unit tests for all modules
- [ ] Implement end-to-end testing
- [ ] Add JSDoc documentation
- [ ] Optimize bundle size
- [ ] Add TypeScript definitions
- [ ] Implement continuous integration

## 🤝 Contributing

### Guidelines
1. **Follow the modular architecture**
2. **Add proper error handling and logging**
3. **Include translations for new UI elements**
4. **Test with provided test data**
5. **Update documentation**

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Update documentation
5. Submit pull request

### Code Style
- Use ES6+ JavaScript features
- Follow existing naming conventions
- Add JSDoc comments for public methods
- Include error handling in all functions
- Use the AppLogger for debugging

## 📄 License

This project is open source. See LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the debug panel (`Ctrl+Shift+D`)
2. Review console logs in browser
3. Test with provided sample files
4. Check network requests in browser dev tools

---

**Made with ❤️ for efficient printer contract management**
