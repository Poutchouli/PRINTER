/**
 * Debug Panel Module
 * Provides debugging information and system health monitoring
 */
class DebugPanel {
    constructor() {
        this.panel = null;
        this.isVisible = false;
        this.refreshInterval = null;
        this.initialized = false;
    }

    async init() {
        try {
            AppLogger.info('DebugPanel', 'Initializing debug panel');
            
            this.createPanel();
            this.setupKeyboardShortcuts();
            
            this.initialized = true;
            AppLogger.info('DebugPanel', 'Debug panel initialized successfully');
        } catch (error) {
            AppLogger.error('DebugPanel', 'Failed to initialize debug panel', error);
            throw error;
        }
    }

    createPanel() {
        try {
            this.panel = document.createElement('div');
            this.panel.id = 'debug-panel';
            this.panel.style.cssText = `
                position: fixed;
                top: 50px;
                right: 10px;
                width: 400px;
                max-height: 70vh;
                background: rgba(0, 0, 0, 0.9);
                color: #fff;
                padding: 15px;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                z-index: 10001;
                display: none;
                overflow-y: auto;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;

            this.panel.innerHTML = this.generatePanelHTML();
            document.body.appendChild(this.panel);

            this.setupPanelEventListeners();
            AppLogger.debug('DebugPanel', 'Debug panel created');
        } catch (error) {
            AppLogger.error('DebugPanel', 'Failed to create debug panel', error);
        }
    }

    generatePanelHTML() {
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                <h3 style="margin: 0; color: #007bff;">🐛 Debug Panel</h3>
                <div>
                    <button id="debug-refresh" style="background: #28a745; border: none; color: white; padding: 4px 8px; border-radius: 3px; cursor: pointer; margin-right: 5px;">Refresh</button>
                    <button id="debug-download" style="background: #17a2b8; border: none; color: white; padding: 4px 8px; border-radius: 3px; cursor: pointer; margin-right: 5px;">Export</button>
                    <button id="debug-close" style="background: #dc3545; border: none; color: white; padding: 4px 8px; border-radius: 3px; cursor: pointer;">×</button>
                </div>
            </div>
            <div id="debug-content"></div>
        `;
    }

    setupPanelEventListeners() {
        try {
            const refreshBtn = this.panel.querySelector('#debug-refresh');
            const downloadBtn = this.panel.querySelector('#debug-download');
            const closeBtn = this.panel.querySelector('#debug-close');

            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => this.refresh());
            }

            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => this.exportDebugInfo());
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.hide());
            }
        } catch (error) {
            AppLogger.error('DebugPanel', 'Failed to setup panel event listeners', error);
        }
    }

    setupKeyboardShortcuts() {
        try {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+D to toggle debug panel
                if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                    e.preventDefault();
                    this.toggle();
                }
            });

            AppLogger.debug('DebugPanel', 'Keyboard shortcuts setup (Ctrl+Shift+D)');
        } catch (error) {
            AppLogger.error('DebugPanel', 'Failed to setup keyboard shortcuts', error);
        }
    }

    show() {
        try {
            if (!this.panel) return;
            
            this.panel.style.display = 'block';
            this.isVisible = true;
            this.refresh();
            
            // Auto-refresh every 5 seconds
            this.refreshInterval = setInterval(() => this.refresh(), 5000);
            
            AppLogger.info('DebugPanel', 'Debug panel shown');
        } catch (error) {
            AppLogger.error('DebugPanel', 'Failed to show debug panel', error);
        }
    }

    hide() {
        try {
            if (!this.panel) return;
            
            this.panel.style.display = 'none';
            this.isVisible = false;
            
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
            }
            
            AppLogger.info('DebugPanel', 'Debug panel hidden');
        } catch (error) {
            AppLogger.error('DebugPanel', 'Failed to hide debug panel', error);
        }
    }

    toggle() {
        this.isVisible ? this.hide() : this.show();
    }

    refresh() {
        try {
            const content = this.panel.querySelector('#debug-content');
            if (!content) return;

            const debugInfo = this.generateDebugInfo();
            content.innerHTML = debugInfo;
        } catch (error) {
            AppLogger.error('DebugPanel', 'Failed to refresh debug panel', error);
        }
    }

    generateDebugInfo() {
        try {
            const healthReport = ModuleRegistry.getHealthReport();
            const logs = AppLogger.getLogs().slice(-10); // Last 10 logs
            const systemInfo = this.getSystemInfo();

            return `
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #ffc107; margin: 0 0 8px 0;">📊 System Health</h4>
                    <div style="background: #111; padding: 8px; border-radius: 4px;">
                        <div>Modules: ${healthReport.initializedModules}/${healthReport.totalModules}</div>
                        <div>Errors: ${healthReport.totalErrors}</div>
                        <div>Memory: ${(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(1) || 'N/A'} MB</div>
                        <div>Uptime: ${this.formatUptime(Date.now() - systemInfo.startTime)}</div>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <h4 style="color: #28a745; margin: 0 0 8px 0;">📦 Modules</h4>
                    <div style="background: #111; padding: 8px; border-radius: 4px; max-height: 150px; overflow-y: auto;">
                        ${healthReport.modules.map(module => `
                            <div style="margin-bottom: 4px; ${module.errorCount > 0 ? 'color: #dc3545;' : 'color: #28a745;'}">
                                ${module.initialized ? '✅' : '❌'} ${module.name} 
                                ${module.errorCount > 0 ? `(${module.errorCount} errors)` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <h4 style="color: #17a2b8; margin: 0 0 8px 0;">📝 Recent Logs</h4>
                    <div style="background: #111; padding: 8px; border-radius: 4px; max-height: 200px; overflow-y: auto;">
                        ${logs.map(log => `
                            <div style="margin-bottom: 2px; font-size: 11px; ${this.getLogColor(log.level)}">
                                [${log.timestamp.split('T')[1].split('.')[0]}] 
                                <strong>${log.level.toUpperCase()}</strong> 
                                [${log.module}]: ${log.message}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <h4 style="color: #6f42c1; margin: 0 0 8px 0;">🔧 System Info</h4>
                    <div style="background: #111; padding: 8px; border-radius: 4px; font-size: 11px;">
                        <div>Browser: ${navigator.userAgent}</div>
                        <div>Screen: ${screen.width}x${screen.height}</div>
                        <div>Viewport: ${window.innerWidth}x${window.innerHeight}</div>
                        <div>Templates: ${TemplateManager?.getTemplateCount() || 0}</div>
                        <div>Printer DB: ${Object.keys(PrinterDatabase?.getAllData() || {}).length} manufacturers</div>
                    </div>
                </div>
            `;
        } catch (error) {
            AppLogger.error('DebugPanel', 'Failed to generate debug info', error);
            return '<div style="color: #dc3545;">Error generating debug info</div>';
        }
    }

    getLogColor(level) {
        const colors = {
            debug: 'color: #6c757d;',
            info: 'color: #17a2b8;',
            warn: 'color: #ffc107;',
            error: 'color: #dc3545;'
        };
        return colors[level] || '';
    }

    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    getSystemInfo() {
        return {
            startTime: window.APP_START_TIME || Date.now(),
            userAgent: navigator.userAgent,
            screen: { width: screen.width, height: screen.height },
            viewport: { width: window.innerWidth, height: window.innerHeight }
        };
    }

    exportDebugInfo() {
        try {
            const debugData = {
                timestamp: new Date().toISOString(),
                healthReport: ModuleRegistry.getHealthReport(),
                logs: AppLogger.getLogs(),
                moduleRegistry: ModuleRegistry.generateDebugInfo(),
                systemInfo: this.getSystemInfo(),
                formData: FormManager?.getFormData(),
                templates: TemplateManager?.getTemplates(),
                printerDatabase: PrinterDatabase?.getAllData()
            };

            const content = JSON.stringify(debugData, null, 2);
            const filename = `debug-export-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(content, filename, 'application/json');
            
            AppLogger.info('DebugPanel', `Debug info exported to ${filename}`);
        } catch (error) {
            AppLogger.error('DebugPanel', 'Failed to export debug info', error);
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
            AppLogger.error('DebugPanel', 'Failed to download file', error);
        }
    }
}
