// Chart Customization System - Fixed Version
window.chartInstances = window.chartInstances || {};
window.chartSettings = window.chartSettings || {
    colorSchemes: {
        default: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'],
        vibrant: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'],
        professional: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7', '#ecf0f1'],
        nature: ['#27ae60', '#2ecc71', '#16a085', '#1abc9c', '#f39c12', '#e67e22'],
        sunset: ['#ff7675', '#fd79a8', '#fdcb6e', '#e17055', '#74b9ff', '#0984e3']
    },
    animations: {
        enabled: true,
        duration: 1000,
        easing: 'easeOutQuart'
    },
    currentScheme: 'default'
};

// Load chart settings from localStorage
function loadChartSettings() {
    try {
        const saved = localStorage.getItem('chartSettings');
        if (saved) {
            const parsedSettings = JSON.parse(saved);
            window.chartSettings = { ...window.chartSettings, ...parsedSettings };
        }
    } catch (e) {
        console.log('Error loading chart settings:', e);
    }
}

// Save chart settings to localStorage
function saveChartSettings() {
    try {
        localStorage.setItem('chartSettings', JSON.stringify(window.chartSettings));
    } catch (e) {
        console.log('Error saving chart settings:', e);
    }
}

// Open chart customizer modal
function openChartCustomizer() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content chart-customizer-modal">
            <div class="modal-header customizer-header">
                <div class="header-content">
                    <div class="header-icon">
                        <i class="fas fa-palette"></i>
                    </div>
                    <div class="header-text">
                        <h2>Personalizar Gráficos</h2>
                        <p>Customize a aparência e comportamento dos gráficos nos relatórios</p>
                    </div>
                </div>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            
            <div class="customizer-content">
                <div class="customizer-section">
                    <h4><i class="fas fa-palette"></i> Esquemas de Cores</h4>
                    <div class="color-scheme-grid" id="colorSchemeGrid">
                        ${Object.entries(window.chartSettings.colorSchemes).map(([key, colors]) => `
                            <div class="color-scheme ${key === window.chartSettings.currentScheme ? 'selected' : ''}" 
                                 data-scheme="${key}" onclick="selectColorScheme('${key}')">
                                <div class="color-palette">
                                    ${colors.slice(0, 6).map(color => `
                                        <div class="color-dot" style="background-color: ${color}"></div>
                                    `).join('')}
                                </div>
                                <div class="scheme-name">${getSchemeDisplayName(key)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="customizer-section">
                    <h4><i class="fas fa-play"></i> Animações</h4>
                    <div class="animation-options">
                        <div class="animation-option">
                            <input type="checkbox" id="enableAnimations" 
                                   ${window.window.chartSettings.animations.enabled ? 'checked' : ''}
                                   onchange="toggleAnimations(this.checked)">
                            <label for="enableAnimations">Ativar Animações</label>
                        </div>
                        <div class="animation-option">
                            <label for="animationDuration">Duração: </label>
                            <input type="range" id="animationDuration" min="500" max="3000" step="100"
                                   value="${window.window.chartSettings.animations.duration}"
                                   onchange="updateAnimationDuration(this.value)">
                            <span id="durationValue">${window.window.chartSettings.animations.duration}ms</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="resetChartSettings()">
                    <i class="fas fa-undo"></i>
                    Restaurar Padrão
                </button>
                <button class="btn btn-primary" onclick="applyChartSettings()">
                    <i class="fas fa-check"></i>
                    Aplicar Configurações
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Get display name for color scheme
function getSchemeDisplayName(key) {
    const names = {
        default: 'Padrão',
        vibrant: 'Vibrante',
        professional: 'Profissional',
        nature: 'Natureza',
        sunset: 'Pôr do Sol'
    };
    return names[key] || key;
}

// Select color scheme
function selectColorScheme(scheme) {
    const grid = document.getElementById('colorSchemeGrid');
    if (grid) {
        grid.querySelectorAll('.color-scheme').forEach(el => el.classList.remove('selected'));
        const targetScheme = grid.querySelector(`[data-scheme="${scheme}"]`);
        if (targetScheme) {
            targetScheme.classList.add('selected');
        }
    }
    window.chartSettings.currentScheme = scheme;
}

// Toggle animations
function toggleAnimations(enabled) {
    window.window.chartSettings.animations.enabled = enabled;
}

// Update animation duration
function updateAnimationDuration(duration) {
    window.window.chartSettings.animations.duration = parseInt(duration);
    const durationDisplay = document.getElementById('durationValue');
    if (durationDisplay) {
        durationDisplay.textContent = duration + 'ms';
    }
}

// Apply chart settings
function applyChartSettings() {
    saveChartSettings();
    
    // Update all charts with new settings
    setTimeout(() => {
        updateTypeChart();
        updatePriorityChart();
        updateStatusChart();
        updateHoursChart();
    }, 100);
    
    // Close modal
    const modal = document.querySelector('.chart-customizer-modal');
    if (modal) {
        modal.closest('.modal').remove();
    }
    
    showNotification('Configurações dos gráficos aplicadas com sucesso!', 'success');
}

// Reset chart settings
function resetChartSettings() {
    window.chartSettings = {
        colorSchemes: window.chartSettings.colorSchemes,
        animations: { enabled: true, duration: 1000, easing: 'easeOutQuart' },
        currentScheme: 'default'
    };
    
    saveChartSettings();
    applyChartSettings();
    
    showNotification('Configurações restauradas para o padrão', 'success');
}

// Enhanced chart rendering functions
function updateTypeChart() {
    const canvas = document.getElementById('projectTypeChart');
    if (!canvas) return;
    
    // Destroy existing chart
    if (window.chartInstances.typeChart) {
        window.chartInstances.typeChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const chartType = document.getElementById('typeChartType')?.value || 'bar';
    
    // Get type counts from all project types
    const typeCounts = {};
    if (typeof projectTypes !== 'undefined') {
        projectTypes.forEach(type => {
            const count = projects.filter(p => p.type === type.id || p.type === type.name).length;
            if (count > 0) {
                typeCounts[type.name] = count;
            }
        });
    } else {
        // Fallback for static types
        const staticTypes = ['Sistemas', 'Infra', 'Networking', 'Servidores'];
        staticTypes.forEach(type => {
            const count = projects.filter(p => p.type === type).length;
            if (count > 0) {
                typeCounts[type] = count;
            }
        });
    }
    
    const colors = window.chartSettings.colorSchemes[window.chartSettings.currentScheme];
    
    window.chartInstances.typeChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                data: Object.values(typeCounts),
                backgroundColor: colors,
                borderWidth: chartType === 'bar' ? 0 : 2,
                borderColor: chartType !== 'bar' ? '#fff' : undefined,
                borderRadius: chartType === 'bar' ? 8 : undefined,
                cutout: chartType === 'doughnut' ? '70%' : undefined
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: window.chartSettings.animations.enabled ? window.chartSettings.animations.duration : 0,
                easing: window.chartSettings.animations.easing
            },
            plugins: {
                legend: {
                    display: chartType !== 'bar',
                    position: 'bottom'
                }
            },
            scales: chartType === 'bar' ? {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            } : undefined
        }
    });
}

function updatePriorityChart() {
    const canvas = document.getElementById('priorityChart');
    if (!canvas) return;
    
    if (window.chartInstances.priorityChart) {
        window.chartInstances.priorityChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const chartType = document.getElementById('priorityChartType')?.value || 'polarArea';
    
    const priorityCounts = {
        'Baixa': projects.filter(p => p.priority === 'low').length,
        'Média': projects.filter(p => p.priority === 'medium').length,
        'Alta': projects.filter(p => p.priority === 'high').length,
        'Crítica': projects.filter(p => p.priority === 'critical').length
    };
    
    const colors = window.chartSettings.colorSchemes[window.chartSettings.currentScheme];
    
    window.chartInstances.priorityChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: Object.keys(priorityCounts),
            datasets: [{
                data: Object.values(priorityCounts),
                backgroundColor: colors,
                borderWidth: chartType === 'bar' ? 0 : 2,
                borderColor: chartType !== 'bar' ? '#fff' : undefined,
                borderRadius: chartType === 'bar' ? 8 : undefined,
                cutout: chartType === 'doughnut' ? '70%' : undefined
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: window.chartSettings.animations.enabled ? window.chartSettings.animations.duration : 0,
                easing: window.chartSettings.animations.easing
            },
            plugins: {
                legend: {
                    display: chartType !== 'bar',
                    position: 'bottom'
                }
            },
            scales: chartType === 'bar' ? {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            } : undefined
        }
    });
}

function updateStatusChart() {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;
    
    if (window.chartInstances.statusChart) {
        window.chartInstances.statusChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const chartType = document.getElementById('statusChartType')?.value || 'doughnut';
    
    const statusCounts = {
        'A Fazer': projects.filter(p => p.status === 'todo').length,
        'Em Andamento': projects.filter(p => p.status === 'in_progress').length,
        'Concluído': projects.filter(p => p.status === 'completed').length
    };
    
    const colors = window.chartSettings.colorSchemes[window.chartSettings.currentScheme].slice(0, 3);
    
    window.chartInstances.statusChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: colors,
                borderWidth: chartType === 'bar' ? 0 : 2,
                borderColor: chartType !== 'bar' ? '#fff' : undefined,
                borderRadius: chartType === 'bar' ? 8 : undefined,
                cutout: chartType === 'doughnut' ? '70%' : undefined
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: window.chartSettings.animations.enabled ? window.chartSettings.animations.duration : 0,
                easing: window.chartSettings.animations.easing
            },
            plugins: {
                legend: {
                    display: chartType !== 'bar',
                    position: 'bottom'
                }
            },
            scales: chartType === 'bar' ? {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            } : undefined
        }
    });
}

function updateHoursChart() {
    const canvas = document.getElementById('hoursChart');
    if (!canvas) return;
    
    if (window.chartInstances.hoursChart) {
        window.chartInstances.hoursChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const chartType = document.getElementById('hoursChartType')?.value || 'bar';
    
    // Get hours by project type
    const hoursData = {};
    if (typeof projectTypes !== 'undefined') {
        projectTypes.forEach(type => {
            const typeProjects = projects.filter(p => p.type === type.id || p.type === type.name);
            const totalHours = typeProjects.reduce((sum, p) => sum + (p.totalHours || 0), 0);
            if (totalHours > 0) {
                hoursData[type.name] = totalHours;
            }
        });
    } else {
        // Fallback for static types
        const staticTypes = ['Sistemas', 'Infra', 'Networking', 'Servidores'];
        staticTypes.forEach(type => {
            const typeProjects = projects.filter(p => p.type === type);
            const totalHours = typeProjects.reduce((sum, p) => sum + (p.totalHours || 0), 0);
            if (totalHours > 0) {
                hoursData[type] = totalHours;
            }
        });
    }
    
    const colors = window.chartSettings.colorSchemes[window.chartSettings.currentScheme];
    
    window.chartInstances.hoursChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: Object.keys(hoursData),
            datasets: [{
                label: 'Horas Trabalhadas',
                data: Object.values(hoursData),
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: chartType === 'line' ? 3 : 0,
                fill: chartType === 'line' ? false : true,
                borderRadius: chartType === 'bar' ? 8 : undefined
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: window.chartSettings.animations.enabled ? window.chartSettings.animations.duration : 0,
                easing: window.chartSettings.animations.easing
            },
            plugins: {
                legend: {
                    display: chartType === 'line',
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize chart customization on DOM load
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        loadChartSettings();
        
        // Override existing chart functions
        window.renderProjectTypeChart = updateTypeChart;
        window.renderPriorityChart = updatePriorityChart;
    });
}