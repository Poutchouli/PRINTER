/**
 * Logger Module - Centralized logging system
 * Provides different log levels and error tracking
 */
class Logger {
    constructor() {
        this.logLevel = 'info'; // debug, info, warn, error
        this.logs = [];
        this.maxLogs = 1000;
    }

    setLogLevel(level) {
        this.logLevel = level;
    }

    log(level, module, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            module,
            message,
            data: data ? JSON.stringify(data) : null
        };

        this.logs.push(logEntry);
        
        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }

        // Console output with color coding
        const colors = {
            debug: 'color: #888;',
            info: 'color: #007bff;',
            warn: 'color: #ffa500;',
            error: 'color: #dc3545; font-weight: bold;'
        };

        console.log(
            `%c[${timestamp}] ${level.toUpperCase()} [${module}]: ${message}`,
            colors[level] || '',
            data || ''
        );

        // Show errors in UI
        if (level === 'error') {
            this.showErrorToUser(module, message);
        }
    }

    debug(module, message, data) {
        if (this.shouldLog('debug')) {
            this.log('debug', module, message, data);
        }
    }

    info(module, message, data) {
        if (this.shouldLog('info')) {
            this.log('info', module, message, data);
        }
    }

    warn(module, message, data) {
        if (this.shouldLog('warn')) {
            this.log('warn', module, message, data);
        }
    }

    error(module, message, data) {
        if (this.shouldLog('error')) {
            this.log('error', module, message, data);
        }
    }

    shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }

    showErrorToUser(module, message) {
        // Create or update error display
        let errorDiv = document.getElementById('error-display');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-display';
            errorDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #dc3545;
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(errorDiv);
        }

        errorDiv.innerHTML = `
            <strong>Error in ${module}:</strong><br>
            ${message}
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer;">×</button>
        `;

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 10000);
    }

    downloadLogs() {
        const logContent = this.logs.map(log => 
            `${log.timestamp} [${log.level.toUpperCase()}] [${log.module}]: ${log.message}${log.data ? ' | Data: ' + log.data : ''}`
        ).join('\n');

        const blob = new Blob([logContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `app-logs-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    getLogs(level = null) {
        return level ? this.logs.filter(log => log.level === level) : this.logs;
    }
}

// Logger class is available globally
// Instance will be created in index.html
