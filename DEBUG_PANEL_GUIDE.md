# Debug Panel Quick Reference

## Opening the Debug Panel
- **Keyboard Shortcut**: `Ctrl + Shift + D`
- The panel toggles open/closed with the same shortcut

## Panel Sections

### 🏥 Module Health Status
- **Green**: Module is healthy and functioning normally
- **Yellow**: Module has warnings but is still operational  
- **Red**: Module has errors and may not be functioning properly
- **Hover**: Over module names to see error counts and details

### 📋 Recent Logs (Last 50 entries)
- **Filter by Level**: Click buttons to show only specific log types
  - `All`: Show all log entries
  - `Debug`: Development and diagnostic messages
  - `Info`: General information messages
  - `Warn`: Warning messages that don't break functionality
  - `Error`: Error messages indicating problems
- **Timestamp**: When the log entry was created
- **Module**: Which module generated the log entry
- **Message**: Description of what happened

### ℹ️ System Information
- **Browser**: User agent and browser details
- **Timestamp**: When the debug panel was opened
- **Module Versions**: Version information for all registered modules

### 💾 Export Options
- **Export Debug Data**: Downloads a JSON file with all system information, logs, and module status
- **Filename**: `debug-report-[timestamp].json`

## Common Debug Scenarios

### ❌ Application Won't Load
1. Open debug panel (`Ctrl + Shift + D`)
2. Check module health - look for red status indicators
3. Review recent logs for initialization errors
4. Export debug data for detailed analysis

### ⚠️ Feature Not Working
1. Try to reproduce the issue
2. Open debug panel to see recent error logs
3. Check which module is reporting errors
4. Look at the specific error messages for clues

### 📊 Template Import Issues
1. Attempt template import
2. Check `TemplateManager` health status
3. Look for CSV parsing errors in logs
4. Verify CSV format matches expected structure

### 🔧 Form Problems
1. Interact with the problematic form element
2. Check `FormManager` and related module status
3. Look for validation or event handler errors
4. Check if dependencies like `TranslationManager` are healthy

## Error Levels Explained

- **🐛 Debug**: Technical details for developers
- **ℹ️ Info**: Normal operation messages
- **⚠️ Warn**: Potential issues that don't break functionality
- **❌ Error**: Problems that prevent normal operation

## Tips for Effective Debugging

1. **Reproduce the Issue**: Try to trigger the problem while the debug panel is open
2. **Check Dependencies**: If a module is failing, check its dependencies first
3. **Read Error Messages**: Error messages often contain specific details about what went wrong
4. **Export Early**: If you encounter a complex issue, export debug data immediately
5. **Time Context**: Recent logs show what happened just before the issue

## Module Interdependencies

```
TranslationManager ← FormManager
PrinterDatabase ← AutocompleteManager ← TemplateManager ← FormManager
```

If a module is failing, modules that depend on it may also show errors.

## When to Contact Support

Export debug data and contact support if you see:
- Multiple modules showing red status
- Repeated errors in the logs
- Critical initialization failures
- Persistent issues after browser refresh

The exported debug file contains all the technical information needed to diagnose complex issues.
