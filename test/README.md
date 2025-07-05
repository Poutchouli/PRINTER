# Test Contract Data

This folder contains comprehensive sample contract data files for testing the Printer Contract Management Tool.

## JSON Contract Files

Individual contract files in JSON format that can be imported using the "📂 Import from JSON" button:

### Standard Business Contracts
- **contract_canon_office.json** - Canon imageRUNNER ADVANCE C3520i (36 months)
- **contract_hp_enterprise.json** - HP LaserJet Enterprise MFP M631dn (48 months, mono only)
- **contract_ricoh_color.json** - Ricoh Aficio MP C3003SP (60 months, color)
- **contract_koesio_eco.json** - Koesio Kyocera ECOSYS M3145idn (42 months, eco-friendly)
- **contract_xerox_premium.json** - Xerox WorkCentre 6515 (36 months, premium support)
- **contract_epson_ecotank.json** - Epson EcoTank Pro ET-5170 (24 months, low cost)
- **contract_lexmark_colorlaser.json** - Lexmark CS521dn (48 months, color laser)

### Extended Template Contracts (with Additional Fields)
- **template_advanced_enterprise.json** - Enterprise template with security, compliance, and advanced features
- **template_smb_complete.json** - Small/Medium Business template with consumables and support packages
- **template_educational.json** - Educational institution template with academic-specific features
- **template_healthcare.json** - Healthcare facility template with HIPAA compliance and medical features
- **template_manufacturing.json** - Manufacturing/Industrial template with environmental resistance features

### Edge Case Contracts
- **contract_minimal_basic.json** - Basic mono printer with minimal features (12 months)
- **contract_enterprise_highvolume.json** - High-volume enterprise solution (60 months)
- **contract_simple_nodiscounts.json** - Simple lease with no extra costs or discounts (24 months)
- **contract_shortterm_rental.json** - Short-term rental (6 months)
- **contract_evaluation_free.json** - Zero-cost evaluation unit (3 months)

### Testing & Edge Cases
- **contract_invalid_test.json** - Malformed contract for error testing (invalid data types)
- **contract_unicode_special.json** - Contract with Unicode characters and special symbols
- **contract_extreme_numbers.json** - Contract with very large numbers for boundary testing
- **contract_long_text.json** - Contract with very long text fields for UI testing

## CSV Template Files

- **contracts_template.csv** - Basic CSV file for batch importing (3 contracts)
- **contracts_extended_template.csv** - Extended CSV file with diverse scenarios (12 contracts)

## How to Use

### 1. **Drag & Drop Import** (New!)
   - Simply drag and drop `.json` or `.csv` files onto the drop zone in the main application
   - The interface will automatically detect the file type and import accordingly
   - Visual feedback shows processing status and results

### 2. **Single Contract Import**: 
   - Click "� Import Contract (JSON)" or use the drag & drop zone
   - Select one of the `.json` files
   - The form will be populated with the contract data

### 3. **Multiple Contracts Import**:
   - Click "📂 Import Templates (CSV)" or drag a CSV file to the drop zone
   - Select the `contracts_template.csv` or `contracts_extended_template.csv` file
   - Multiple contracts will be loaded as templates

### 4. **Template Testing**:
   - Use the extended template files to test complex contract scenarios
   - Templates include additional fields like compliance standards, security levels, and industry-specific features
   - Test the application's handling of rich contract data

## Contract Variations

The test contracts include various scenarios:
- Different manufacturers (Canon, HP, Ricoh, Koesio, Xerox, Epson)
- Various contract durations (24-60 months)
- Both mono and color printers
- Different cost structures
- Multiple extra costs and discounts
- Various support ratings and reliability scores

## Testing Scenarios

Use these files to test:

### Basic Functionality
- Import various contract types to verify form population
- Test autocomplete with different manufacturers
- Verify all numeric fields accept proper values
- Test language switching with imported data

### Edge Cases & Error Handling
- **contract_invalid_test.json** - Test error handling with malformed data
- **contract_unicode_special.json** - Test Unicode character support
- **contract_extreme_numbers.json** - Test large number handling
- **contract_long_text.json** - Test UI with very long text fields
- **contract_evaluation_free.json** - Test zero-cost scenarios

### Business Scenarios
- **Basic contracts** - Standard small/medium business setups
- **Enterprise contracts** - High-volume, complex arrangements
- **Short-term rentals** - Temporary or evaluation setups
- **Minimal contracts** - Simple, basic printer leases

### UI & Performance Testing
- Import multiple contracts sequentially
- Test debug panel (Ctrl+Shift+D) with various contracts loaded
- Verify autocomplete performance with different manufacturers
- Test CSV batch import with extended template file

### Data Validation Testing
- Mix of mono-only and color printers
- Various contract durations (1-120 months)
- Different cost structures (free to high-end)
- Empty arrays vs populated extra costs/discounts
- Edge case values (0, negative numbers, very large numbers)

### Advanced Template Features

The extended template contracts include additional fields for testing comprehensive scenarios:

**Enterprise Templates:**
- Contract dates and billing cycles
- Service level agreements
- Compliance standards (GDPR, HIPAA, SOX, etc.)
- Environmental certifications
- Insurance and escrow requirements
- Remote monitoring and predictive maintenance
- Security and encryption features

**Industry-Specific Features:**
- **Healthcare**: HIPAA compliance, medical records printing, biohazard protocols
- **Education**: FERPA compliance, academic scheduling, student services
- **Manufacturing**: Environmental resistance, industrial certifications, safety documentation
- **SMB**: Consumables management, basic support packages, cost optimization

### File Structure
```
test/
├── README.md                           # This file
├── contracts_template.csv              # Basic CSV template (3 contracts)
├── contracts_extended_template.csv     # Extended CSV template (12 contracts)
│
├── Standard Business Contracts/
├── contract_canon_office.json          # Standard business contract
├── contract_hp_enterprise.json         # Enterprise mono contract
├── contract_ricoh_color.json           # Color printer contract
├── contract_koesio_eco.json           # Eco-friendly contract
├── contract_xerox_premium.json        # Premium support contract
├── contract_epson_ecotank.json        # Low-cost contract
├── contract_lexmark_colorlaser.json   # Color laser contract
│
├── Extended Template Contracts/
├── template_advanced_enterprise.json  # Enterprise with full features
├── template_smb_complete.json         # SMB complete package
├── template_educational.json          # Academic institution
├── template_healthcare.json           # Medical facility
├── template_manufacturing.json        # Industrial/manufacturing
│
├── Edge Cases & Testing/
├── contract_minimal_basic.json        # Minimal features contract
├── contract_enterprise_highvolume.json # High-volume enterprise
├── contract_simple_nodiscounts.json   # Simple, no extras
├── contract_shortterm_rental.json     # Short-term rental
├── contract_evaluation_free.json      # Zero-cost evaluation
├── contract_invalid_test.json         # Error testing (malformed)
├── contract_unicode_special.json      # Unicode/special chars
├── contract_extreme_numbers.json      # Large number testing
└── contract_long_text.json           # Long text field testing
```
- Form population and validation
- Autocomplete functionality with manufacturer selection
- Dynamic cost calculations
- Language switching with populated data
- Export/import round-trip functionality
- Module error handling and recovery
