/**
 * Module Registry - Central module management and error tracking
 * Helps with debugging by providing module information and health checks
 */
class ModuleRegistry {
    constructor() {
        this.modules = new Map();
        this.dependencies = new Map();
        this.initOrder = [];
        this.errorCount = new Map();
    }

    /**
     * Register a module with its metadata
     */
    register(name, moduleInfo) {
        try {
            const module = {
                name,
                version: moduleInfo.version || '1.0.0',
                description: moduleInfo.description || '',
                dependencies: moduleInfo.dependencies || [],
                instance: moduleInfo.instance || null,
                initialized: false,
                lastError: null,
                errorCount: 0,
                ...moduleInfo
            };

            this.modules.set(name, module);
            this.dependencies.set(name, moduleInfo.dependencies || []);
            
            AppLogger.info('ModuleRegistry', `Registered module: ${name}`, module);
            return true;
        } catch (error) {
            AppLogger.error('ModuleRegistry', `Failed to register module ${name}`, error);
            return false;
        }
    }

    /**
     * Initialize modules in dependency order
     */
    async initializeAll() {
        try {
            const sortedModules = this.topologicalSort();
            AppLogger.info('ModuleRegistry', `Initializing modules in order: ${sortedModules.join(', ')}`);

            for (const moduleName of sortedModules) {
                await this.initializeModule(moduleName);
            }

            this.initOrder = sortedModules;
            AppLogger.info('ModuleRegistry', 'All modules initialized successfully');
            return true;
        } catch (error) {
            AppLogger.error('ModuleRegistry', 'Failed to initialize modules', error);
            return false;
        }
    }

    /**
     * Initialize a single module
     */
    async initializeModule(name) {
        const module = this.modules.get(name);
        if (!module) {
            throw new Error(`Module ${name} not found`);
        }

        if (module.initialized) {
            AppLogger.debug('ModuleRegistry', `Module ${name} already initialized`);
            return;
        }

        try {
            // Check dependencies
            for (const dep of module.dependencies) {
                const depModule = this.modules.get(dep);
                if (!depModule || !depModule.initialized) {
                    throw new Error(`Dependency ${dep} not initialized for module ${name}`);
                }
            }

            // Initialize module
            if (module.init && typeof module.init === 'function') {
                await module.init();
            }

            module.initialized = true;
            AppLogger.info('ModuleRegistry', `Module ${name} initialized successfully`);
        } catch (error) {
            this.recordError(name, error);
            throw new Error(`Failed to initialize module ${name}: ${error.message}`);
        }
    }

    /**
     * Record an error for a module
     */
    recordError(moduleName, error) {
        const module = this.modules.get(moduleName);
        if (module) {
            module.lastError = error;
            module.errorCount++;
        }

        const totalErrors = this.errorCount.get(moduleName) || 0;
        this.errorCount.set(moduleName, totalErrors + 1);

        AppLogger.error('ModuleRegistry', `Error in module ${moduleName}`, {
            error: error.message,
            stack: error.stack,
            errorCount: totalErrors + 1
        });
    }

    /**
     * Get a module instance by name
     */
    getModule(name) {
        const module = this.modules.get(name);
        if (!module) {
            AppLogger.error('ModuleRegistry', `Module ${name} not found`);
            return null;
        }
        
        if (!module.initialized) {
            AppLogger.warn('ModuleRegistry', `Module ${name} not yet initialized`);
            return null;
        }

        return module.instance;
    }

    /**
     * Get all modules
     */
    getAllModules() {
        return Array.from(this.modules.values());
    }

    /**
     * Get module health status
     */
    getHealthReport() {
        const modules = this.getAllModules();
        const report = {
            totalModules: modules.length,
            initializedModules: modules.filter(m => m.initialized).length,
            modulesWithErrors: modules.filter(m => m.errorCount > 0).length,
            totalErrors: Array.from(this.errorCount.values()).reduce((sum, count) => sum + count, 0),
            modules: modules.map(m => ({
                name: m.name,
                initialized: m.initialized,
                errorCount: m.errorCount,
                lastError: m.lastError ? m.lastError.message : null
            }))
        };

        AppLogger.info('ModuleRegistry', 'Health report generated', report);
        return report;
    }

    /**
     * Topological sort for dependency resolution
     */
    topologicalSort() {
        const visited = new Set();
        const visiting = new Set();
        const result = [];

        const visit = (name) => {
            if (visiting.has(name)) {
                throw new Error(`Circular dependency detected involving ${name}`);
            }
            if (visited.has(name)) {
                return;
            }

            visiting.add(name);
            const deps = this.dependencies.get(name) || [];
            for (const dep of deps) {
                if (!this.modules.has(dep)) {
                    throw new Error(`Missing dependency ${dep} for module ${name}`);
                }
                visit(dep);
            }
            visiting.delete(name);
            visited.add(name);
            result.push(name);
        };

        for (const name of this.modules.keys()) {
            visit(name);
        }

        return result;
    }

    /**
     * Find modules that depend on a given module
     */
    findDependents(moduleName) {
        const dependents = [];
        for (const [name, deps] of this.dependencies.entries()) {
            if (deps.includes(moduleName)) {
                dependents.push(name);
            }
        }
        return dependents;
    }

    /**
     * Generate debugging information
     */
    generateDebugInfo() {
        const info = {
            timestamp: new Date().toISOString(),
            initOrder: this.initOrder,
            healthReport: this.getHealthReport(),
            dependencyGraph: Object.fromEntries(this.dependencies),
            errorSummary: Object.fromEntries(this.errorCount)
        };

        return JSON.stringify(info, null, 2);
    }
}

// ModuleRegistry class is available globally
// Instance will be created in index.html
