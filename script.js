// Global state - Sistema de Gerenciamento de Projetos
let projects = [];
let tasks = [];
let meetings = [];
let tickets = [];
let timeEntries = [];
let currentProjectId = 1;
let currentTaskId = 1;
let currentMeetingId = 1;
let currentTicketId = 1;
let currentTimeEntryId = 1;
let selectedProjectForSidebar = null;
let currentParticipants = [];
let currentResponsibles = [];

// Constants
const priorityLabels = {
    low: 'Baixa',
    medium: 'Média', 
    high: 'Alta',
    critical: 'Crítica'
};

const statusLabels = {
    todo: 'A Fazer',
    in_progress: 'Em Andamento',
    completed: 'Concluído'
};

// Project Types - Default and Custom
let projectTypes = [
    { id: 'Sistemas', name: 'Sistemas', icon: 'fas fa-code', isDefault: true },
    { id: 'Infra', name: 'Infra', icon: 'fas fa-server', isDefault: true },
    { id: 'Networking', name: 'Networking', icon: 'fas fa-network-wired', isDefault: true },
    { id: 'Servidores', name: 'Servidores', icon: 'fas fa-hdd', isDefault: true }
];

// Load custom types from localStorage
function loadCustomTypes() {
    const saved = localStorage.getItem('customProjectTypes');
    if (saved) {
        const customTypes = JSON.parse(saved);
        projectTypes = [...projectTypes.filter(t => t.isDefault), ...customTypes];
    }
}

// Save custom types to localStorage
function saveCustomTypes() {
    const customTypes = projectTypes.filter(t => !t.isDefault);
    localStorage.setItem('customProjectTypes', JSON.stringify(customTypes));
}

const typeLabels = {
    Sistemas: 'Sistemas',
    Infra: 'Infra',
    Networking: 'Networking',
    Servidores: 'Servidores'
};

// Initialize custom types on load
function initializeSystem() {
    loadCustomTypes();
    updateProjectTypeSelects();
}

// Sample data - exactly like React version
function loadSampleData() {
    projects = [
        {
            id: 1,
            sigaNumber: 'SIT.2025.000001',
            title: 'Migração de Sistema Legacy',
            requester: 'João Silva',
            type: 'Sistemas',
            priority: 'high',
            status: 'in_progress',
            startDate: '2025-01-15',
            endDate: '2025-03-15',
            description: 'Migração do sistema legacy para nova arquitetura baseada em microserviços. Inclui refatoração de código, migração de dados e treinamento da equipe.',
            isRFP: false,
            totalHours: 45.5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 2,
            sigaNumber: 'SIT.2025.000002',
            title: 'Implementação de Firewall',
            requester: 'Maria Santos',
            type: 'Networking',
            priority: 'critical',
            status: 'todo',
            startDate: '2025-01-20',
            endDate: '2025-02-20',
            description: 'Implementação de novo firewall corporativo para melhorar a segurança da rede. Inclui configuração de regras, testes e documentação.',
            isRFP: true,
            totalHours: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 3,
            sigaNumber: 'SIT.2025.000003',
            title: 'Upgrade de Servidores',
            requester: 'Carlos Oliveira',
            type: 'Servidores',
            priority: 'medium',
            status: 'completed',
            startDate: '2025-01-01',
            endDate: '2025-01-30',
            description: 'Upgrade de hardware dos servidores principais para suportar maior carga de trabalho. Inclui migração de dados e testes de performance.',
            isRFP: false,
            totalHours: 120,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 4,
            sigaNumber: 'SIT.2025.000004',
            title: 'Atualização de Infraestrutura',
            requester: 'Ana Costa',
            type: 'Infra',
            priority: 'low',
            status: 'todo',
            startDate: '2025-02-01',
            endDate: '2025-04-01',
            description: 'Atualização geral da infraestrutura de TI incluindo switches, roteadores e cabeamento estruturado.',
            isRFP: false,
            totalHours: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    
    // Sample tasks
    tasks = [
        {
            id: 1,
            projectId: 1,
            title: 'Análise de Requisitos',
            description: 'Levantamento completo dos requisitos funcionais e não funcionais do sistema',
            assignedTo: 'João Silva',
            startDate: '2025-01-15',
            endDate: '2025-01-22',
            status: 'completed',
            priority: 'high',
            duration: 7
        },
        {
            id: 2,
            projectId: 1,
            title: 'Desenvolvimento da API',
            description: 'Criação da API REST para o novo sistema de microserviços',
            assignedTo: 'Maria Santos',
            startDate: '2025-01-23',
            endDate: '2025-02-05',
            status: 'in_progress',
            priority: 'high',
            duration: 13
        },
        {
            id: 3,
            projectId: 2,
            title: 'Configuração do Firewall',
            description: 'Configuração inicial do equipamento e definição de regras básicas',
            assignedTo: 'Carlos Oliveira',
            startDate: '2025-01-20',
            endDate: '2025-01-27',
            status: 'pending',
            priority: 'critical',
            duration: 7
        },
        {
            id: 4,
            projectId: 3,
            title: 'Backup dos Dados',
            description: 'Backup completo antes do upgrade dos servidores',
            assignedTo: 'Ana Costa',
            startDate: '2025-01-01',
            endDate: '2025-01-03',
            status: 'completed',
            priority: 'critical',
            duration: 2
        }
    ];
    
    // Sample meetings
    meetings = [
        {
            id: 1,
            projectId: 1,
            title: 'Reunião de Kick-off - Sistema Legacy',
            date: '2025-01-15',
            participants: ['João Silva', 'Maria Santos', 'Ana Costa', 'Pedro Ferreira'],
            agenda: 'Apresentação do projeto de migração, definição de papéis e responsabilidades, cronograma inicial e recursos necessários',
            discussions: 'Discutimos o escopo do projeto, os principais desafios técnicos da migração, a arquitetura alvo e os riscos identificados. A equipe apresentou suas preocupações sobre a compatibilidade de dados.',
            decisions: 'Definido que a migração será feita em fases, começando pelo módulo de usuários. Aprovado orçamento adicional para ferramentas de migração. Reuniões semanais às segundas-feiras.',
            responsibles: ['João Silva', 'Maria Santos']
        },
        {
            id: 2,
            projectId: 2,
            title: 'Reunião de Planejamento - Firewall',
            date: '2025-01-18',
            participants: ['Carlos Oliveira', 'Ana Costa', 'Roberto Lima'],
            agenda: 'Planejamento da implementação do firewall, análise de requisitos de segurança e definição do cronograma de implantação',
            discussions: 'Análise detalhada dos requisitos de segurança, discussão sobre o impacto na rede atual e definição das regras iniciais. Avaliação de fornecedores e modelos de equipamentos.',
            decisions: 'Implementação será realizada em horário noturno para minimizar impacto. Escolhido modelo Fortinet FortiGate. Testes em ambiente isolado antes da produção.',
            responsibles: ['Carlos Oliveira']
        },
        {
            id: 3,
            projectId: null,
            title: 'Reunião Geral de TI - Janeiro',
            date: '2025-01-10',
            participants: ['João Silva', 'Maria Santos', 'Carlos Oliveira', 'Ana Costa', 'Pedro Ferreira', 'Roberto Lima'],
            agenda: 'Revisão dos projetos em andamento, discussão de novas demandas, análise do orçamento do trimestre e apresentação de métricas de desempenho',
            discussions: 'Apresentação do status de todos os projetos ativos, discussão sobre alocação de recursos, análise de indicadores de performance e planejamento de novas iniciativas.',
            decisions: 'Aprovada contratação de mais um desenvolvedor. Priorização do projeto de firewall. Definido processo de revisão mensal de projetos.',
            responsibles: ['João Silva', 'Ana Costa']
        }
    ];
    
    // Sample tickets
    tickets = [
        {
            id: 1,
            projectId: 1,
            ticketNumber: 'INC0001234',
            title: 'Erro na migração de dados do módulo usuários',
            description: 'Falha na migração de dados do sistema legacy para o novo ambiente. Erro de integridade referencial detectado durante o processo de ETL.',
            status: 'open',
            createdDate: '2025-01-16T10:30:00'
        },
        {
            id: 2,
            projectId: 1,
            ticketNumber: 'REQ0001235',
            title: 'Solicitação de acesso ao ambiente de produção',
            description: 'Acesso necessário ao ambiente de produção para execução dos testes finais da migração. Usuário: maria.santos, Perfil: Desenvolvedor Senior.',
            status: 'in_progress',
            createdDate: '2025-01-17T14:15:00'
        },
        {
            id: 3,
            projectId: 2,
            ticketNumber: 'CHG0001236',
            title: 'Solicitação de mudança - Regras de firewall',
            description: 'Alteração nas regras do firewall para permitir acesso à nova aplicação de monitoramento. Liberação da porta 8080 para o range 192.168.100.0/24.',
            status: 'open',
            createdDate: '2025-01-19T09:00:00'
        },
        {
            id: 4,
            projectId: 3,
            ticketNumber: 'INC0001237',
            title: 'Problema de performance após upgrade',
            description: 'Detectada lentidão no sistema após o upgrade dos servidores. Necessária análise de performance e ajuste de configurações.',
            status: 'in_progress',
            createdDate: '2025-01-31T16:45:00'
        }
    ];
    
    // Sample time entries
    timeEntries = [
        {
            id: 1,
            projectId: 1,
            date: '2025-01-15',
            hours: 8,
            description: 'Reunião de kick-off e início da análise de requisitos'
        },
        {
            id: 2,
            projectId: 1,
            date: '2025-01-16',
            hours: 6.5,
            description: 'Continuação da análise de requisitos e documentação'
        },
        {
            id: 3,
            projectId: 1,
            date: '2025-01-17',
            hours: 8,
            description: 'Modelagem da arquitetura do novo sistema'
        },
        {
            id: 4,
            projectId: 3,
            date: '2025-01-02',
            hours: 12,
            description: 'Backup completo dos dados dos servidores'
        }
    ];
    
    // Update current IDs
    currentProjectId = Math.max(...projects.map(p => p.id)) + 1;
    currentTaskId = Math.max(...tasks.map(t => t.id)) + 1;
    currentMeetingId = Math.max(...meetings.map(m => m.id)) + 1;
    currentTicketId = Math.max(...tickets.map(t => t.id)) + 1;
    currentTimeEntryId = Math.max(...timeEntries.map(t => t.id)) + 1;
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    initializeNavigation();
    initializeFormHandlers();
    initializeDragAndDrop();
    initializeModalHandlers();
    
    // Initial render
    renderDashboard();
    renderProjects();
    renderGantt();
    
    // Add test button for archived system (temporary)
    setTimeout(() => {
        const navbar = document.querySelector('.nav-links');
        if (navbar) {
            const testBtn = document.createElement('button');
            testBtn.innerHTML = 'TESTE ARQUIVADOS';
            testBtn.onclick = testArchivedSystem;
            testBtn.style.cssText = 'padding: 5px 10px; margin-left: 10px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;';
            navbar.appendChild(testBtn);
        }
    }, 1000);
    renderMeetings();
    renderServiceNow();
    renderReports();
    populateProjectSelects();
});

// Navigation
function initializeNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
            
            // Update active nav
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// showPage function moved to end of file to handle all pages including archived

// Modal handlers
function initializeModalHandlers() {
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id.replace('Modal', ''));
            }
        });
    });
    
    // Participant input handlers
    document.getElementById('participantInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addParticipant();
        }
    });
    
    document.getElementById('responsibleInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addResponsible();
        }
    });
}

function openModal(modalName) {
    const modal = document.getElementById(modalName + 'Modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        
        // Set default date for date inputs
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = modal.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            if (!input.value) {
                input.value = today;
            }
        });
        
        // Set default datetime for datetime inputs
        const now = new Date().toISOString().slice(0, 16);
        const datetimeInputs = modal.querySelectorAll('input[type="datetime-local"]');
        datetimeInputs.forEach(input => {
            if (!input.value) {
                input.value = now;
            }
        });
    }
}

function closeModal(modalName) {
    const modal = document.getElementById(modalName + 'Modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        
        // Reset forms
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        
        // Clear dynamic lists
        if (modalName === 'newMeeting') {
            currentParticipants = [];
            currentResponsibles = [];
            document.getElementById('participantsList').innerHTML = '';
            document.getElementById('responsiblesList').innerHTML = '';
        }
    }
}

// Form handlers
function initializeFormHandlers() {
    // New project form
    document.getElementById('newProjectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const projectData = {
            id: currentProjectId++,
            sigaNumber: document.getElementById('sigaNumber').value,
            title: document.getElementById('title').value,
            requester: document.getElementById('requester').value,
            type: document.getElementById('type').value,
            priority: document.getElementById('priority').value,
            status: 'todo',
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            description: document.getElementById('description').value,
            isRFP: document.getElementById('isRfp').checked,
            totalHours: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        projects.push(projectData);
        
        closeModal('newProject');
        renderDashboard();
        renderProjects();
        populateProjectSelects();
        
        showNotification('Projeto criado com sucesso!', 'success');
    });
    
    // Edit project form
    document.getElementById('editProjectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const projectId = parseInt(document.getElementById('editProjectId').value);
        const project = projects.find(p => p.id === projectId);
        
        if (project) {
            project.sigaNumber = document.getElementById('editSigaNumber').value;
            project.title = document.getElementById('editTitle').value;
            project.requester = document.getElementById('editRequester').value;
            project.type = document.getElementById('editType').value;
            project.priority = document.getElementById('editPriority').value;
            project.startDate = document.getElementById('editStartDate').value;
            project.endDate = document.getElementById('editEndDate').value;
            project.description = document.getElementById('editDescription').value;
            project.isRFP = document.getElementById('editIsRfp').checked;
            project.updatedAt = new Date().toISOString();
            
            closeModal('editProject');
            renderDashboard();
            renderProjects();
            populateProjectSelects();
            
            if (selectedProjectForSidebar && selectedProjectForSidebar.id === projectId) {
                showProjectSidebar(project);
            }
            
            showNotification('Projeto atualizado com sucesso!', 'success');
        }
    });
    
    // New task form
    document.getElementById('newTaskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const startDate = document.getElementById('taskStartDate').value;
        const endDate = document.getElementById('taskEndDate').value;
        
        const taskData = {
            id: currentTaskId++,
            projectId: parseInt(document.getElementById('taskProject').value),
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            assignedTo: document.getElementById('taskAssigned').value,
            startDate: startDate,
            endDate: endDate,
            priority: document.getElementById('taskPriority').value,
            status: 'pending',
            duration: calculateDuration(startDate, endDate)
        };
        
        tasks.push(taskData);
        
        closeModal('newTask');
        renderGantt();
        
        showNotification('Tarefa criada com sucesso!', 'success');
    });
    
    // New meeting form
    document.getElementById('newMeetingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const projectId = document.getElementById('meetingProject').value;
        
        const meetingData = {
            id: currentMeetingId++,
            projectId: projectId ? parseInt(projectId) : null,
            title: document.getElementById('meetingTitle').value,
            date: document.getElementById('meetingDate').value,
            participants: [...currentParticipants],
            agenda: document.getElementById('meetingAgenda').value,
            discussions: document.getElementById('meetingDiscussions').value,
            decisions: document.getElementById('meetingDecisions').value,
            responsibles: [...currentResponsibles]
        };
        
        meetings.push(meetingData);
        
        closeModal('newMeeting');
        renderMeetings();
        
        showNotification('Ata criada com sucesso!', 'success');
    });
    
    // New ticket form
    document.getElementById('newTicketForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const ticketData = {
            id: currentTicketId++,
            projectId: parseInt(document.getElementById('ticketProject').value),
            ticketNumber: document.getElementById('ticketNumber').value,
            title: document.getElementById('ticketTitle').value,
            description: document.getElementById('ticketDescription').value,
            status: 'open',
            createdDate: document.getElementById('ticketCreatedDate').value
        };
        
        tickets.push(ticketData);
        
        closeModal('newTicket');
        renderServiceNow();
        
        showNotification('Chamado criado com sucesso!', 'success');
    });
    
    // Time entry form
    document.getElementById('timeEntryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const projectId = parseInt(document.getElementById('timeProjectId').value);
        const hours = parseFloat(document.getElementById('timeHours').value);
        
        const timeEntry = {
            id: currentTimeEntryId++,
            projectId: projectId,
            date: document.getElementById('timeEntryDate').value,
            hours: hours,
            description: document.getElementById('timeDescription').value
        };
        
        timeEntries.push(timeEntry);
        
        // Update project total hours
        const project = projects.find(p => p.id === projectId);
        if (project) {
            project.totalHours = (project.totalHours || 0) + hours;
        }
        
        closeModal('timeEntry');
        renderDashboard();
        renderProjects();
        
        if (selectedProjectForSidebar && selectedProjectForSidebar.id === projectId) {
            showProjectSidebar(project);
        }
        
        showNotification('Horas registradas com sucesso!', 'success');
    });
    
    // Search and filter handlers
    document.getElementById('dashboardSearch').addEventListener('input', renderDashboard);
    document.getElementById('dashboardTypeFilter').addEventListener('change', renderDashboard);
    // Project search functionality moved to search-filter-bar
    document.getElementById('ganttProjectFilter').addEventListener('change', renderGantt);
    document.getElementById('ganttSearch').addEventListener('input', renderGantt);
    document.getElementById('meetingProjectFilter').addEventListener('change', renderMeetings);
    document.getElementById('meetingSearch').addEventListener('input', renderMeetings);
    document.getElementById('ticketProjectFilter').addEventListener('change', renderServiceNow);
    document.getElementById('ticketSearch').addEventListener('input', renderServiceNow);
    
    // File input handler
    document.getElementById('fileInput').addEventListener('change', handleFileImport);
}

// Participant management
function addParticipant() {
    const input = document.getElementById('participantInput');
    const name = input.value.trim();
    
    if (name && !currentParticipants.includes(name)) {
        currentParticipants.push(name);
        input.value = '';
        updateParticipantsList();
    }
}

function removeParticipant(name) {
    currentParticipants = currentParticipants.filter(p => p !== name);
    updateParticipantsList();
}

function updateParticipantsList() {
    const list = document.getElementById('participantsList');
    list.innerHTML = currentParticipants.map(name => 
        `<span class="participant-tag">${name} <button type="button" onclick="removeParticipant('${name}')">&times;</button></span>`
    ).join('');
}

function addResponsible() {
    const input = document.getElementById('responsibleInput');
    const name = input.value.trim();
    
    if (name && !currentResponsibles.includes(name)) {
        currentResponsibles.push(name);
        input.value = '';
        updateResponsiblesList();
    }
}

function removeResponsible(name) {
    currentResponsibles = currentResponsibles.filter(r => r !== name);
    updateResponsiblesList();
}

function updateResponsiblesList() {
    const list = document.getElementById('responsiblesList');
    list.innerHTML = currentResponsibles.map(name => 
        `<span class="responsible-tag">${name} <button type="button" onclick="removeResponsible('${name}')">&times;</button></span>`
    ).join('');
}

// Dashboard rendering
function renderDashboard() {
    const searchTerm = document.getElementById('dashboardSearch').value.toLowerCase();
    const typeFilter = document.getElementById('dashboardTypeFilter').value;
    
    let filteredProjects = projects.filter(project => {
        // Type filter
        if (typeFilter && typeFilter !== 'all') {
            if (typeFilter === 'RFP' && !project.isRFP) return false;
            if (typeFilter === 'Normal' && project.isRFP) return false;
        }
        
        // Search filter
        if (searchTerm) {
            const matchesSearch = 
                project.title.toLowerCase().includes(searchTerm) ||
                project.sigaNumber.toLowerCase().includes(searchTerm) ||
                project.requester.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
        }
        
        return true;
    });
    
    // Clear columns
    document.getElementById('todoColumn').innerHTML = '';
    document.getElementById('inProgressColumn').innerHTML = '';
    document.getElementById('completedColumn').innerHTML = '';
    
    // Group projects by status
    const projectsByStatus = {
        todo: filteredProjects.filter(p => p.status === 'todo'),
        in_progress: filteredProjects.filter(p => p.status === 'in_progress'),
        completed: filteredProjects.filter(p => p.status === 'completed')
    };
    
    // Render projects in each column
    Object.keys(projectsByStatus).forEach(status => {
        const columnId = status === 'in_progress' ? 'inProgressColumn' : status + 'Column';
        const column = document.getElementById(columnId);
        
        projectsByStatus[status].forEach(project => {
            const card = createProjectCard(project, true);
            column.appendChild(card);
        });
    });
    
    // Update counts
    document.getElementById('todoCount').textContent = projectsByStatus.todo.length;
    document.getElementById('inProgressCount').textContent = projectsByStatus.in_progress.length;
    document.getElementById('completedCount').textContent = projectsByStatus.completed.length;
}

function createProjectCard(project, isDashboard = false) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-project-id', project.id);
    
    const priorityClass = getPriorityClass(project.priority);
    const typeIcon = getTypeIcon(project.type);
    
    card.innerHTML = `
        <div class="project-card-header">
            <div class="project-type">
                <i class="${typeIcon}"></i>
                <span>${project.type}</span>
            </div>
            <div class="project-priority ${priorityClass}">
                <span class="priority-badge">${priorityLabels[project.priority]}</span>
            </div>
        </div>
        
        <div class="project-card-content">
            <div class="project-siga">${project.sigaNumber}</div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-requester">Solicitante: ${project.requester}</p>
            <p class="project-description">${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
            
            ${project.isRFP ? '<div class="rfp-badge">RFP</div>' : ''}
            
            <div class="project-card-footer">
                <div class="project-dates">
                    <small>Início: ${formatDate(project.startDate)}</small>
                    <small>Fim: ${formatDate(project.endDate)}</small>
                </div>
                <div class="project-actions-inline">
                    <div class="project-hours">
                        <i class="fas fa-clock"></i>
                        <span>${project.totalHours || 0}h</span>
                    </div>
                    <button class="download-btn" title="Downloads do Projeto">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add click handler to open project details
    card.addEventListener('click', (e) => {
        // Check if clicked on download button
        if (e.target.closest('.download-btn')) {
            e.preventDefault();
            e.stopPropagation();
            showDownloadModal(project);
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        showProjectDetails(project);
    });
    
    // Add drag handlers if dashboard
    if (isDashboard) {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    }
    
    return card;
}

function getPriorityClass(priority) {
    const classes = {
        low: 'priority-low',
        medium: 'priority-medium',
        high: 'priority-high',
        critical: 'priority-critical'
    };
    return classes[priority] || 'priority-medium';
}

function getTypeIcon(type) {
    const typeObj = projectTypes.find(t => t.id === type);
    return typeObj ? typeObj.icon : 'fas fa-project-diagram';
}

// Update project type selects
function updateProjectTypeSelects() {
    const selects = ['type', 'editType', 'typeFilter', 'taskProject', 'editTaskProject'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            // Save current value
            const currentValue = select.value;
            
            // Clear options
            select.innerHTML = '';
            
            // Add default option for filters
            if (selectId.includes('Filter')) {
                select.innerHTML = '<option value="">Todos os Tipos</option>';
            }
            
            // Add project options for task selects
            if (selectId.includes('taskProject')) {
                select.innerHTML = '<option value="">Selecione um projeto...</option>';
                projects.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project.id;
                    option.textContent = `${project.sigaNumber} - ${project.title}`;
                    select.appendChild(option);
                });
                return;
            }
            
            // Add project types
            projectTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.name;
                select.appendChild(option);
            });
            
            // Restore value if it still exists
            if (currentValue && [...select.options].some(opt => opt.value === currentValue)) {
                select.value = currentValue;
            }
        }
    });
}

// Add new project type
function addProjectType() {
    showAddTypeModal();
}

// Show beautiful modal for adding new project type
function showAddTypeModal() {
    const iconOptions = [
        { icon: 'fas fa-laptop-code', name: 'Desenvolvimento', color: '#3b82f6' },
        { icon: 'fas fa-database', name: 'Banco de Dados', color: '#10b981' },
        { icon: 'fas fa-cloud', name: 'Cloud/Nuvem', color: '#06b6d4' },
        { icon: 'fas fa-shield-alt', name: 'Segurança', color: '#ef4444' },
        { icon: 'fas fa-mobile-alt', name: 'Mobile', color: '#8b5cf6' },
        { icon: 'fas fa-globe', name: 'Web/Internet', color: '#0ea5e9' },
        { icon: 'fas fa-cogs', name: 'Configuração', color: '#6b7280' },
        { icon: 'fas fa-chart-line', name: 'Analytics', color: '#f59e0b' },
        { icon: 'fas fa-users', name: 'Recursos Humanos', color: '#ec4899' },
        { icon: 'fas fa-file-alt', name: 'Documentação', color: '#84cc16' },
        { icon: 'fas fa-tools', name: 'Ferramentas', color: '#f97316' },
        { icon: 'fas fa-brain', name: 'Inteligência Artificial', color: '#a855f7' }
    ];
    
    let selectedIcon = iconOptions[0];
    
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content add-type-modal">
            <div class="modal-header add-type-header">
                <div class="header-content">
                    <div class="header-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <div class="header-text">
                        <h2>Novo Tipo de Projeto</h2>
                        <p>Crie um novo tipo personalizado para seus projetos</p>
                    </div>
                </div>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            
            <div class="add-type-content">
                <div class="form-section">
                    <label class="form-label">
                        <i class="fas fa-tag"></i>
                        Nome do Tipo
                    </label>
                    <input type="text" id="newTypeName" class="form-input" 
                           placeholder="Ex: Desenvolvimento Mobile, Cloud Computing..." 
                           maxlength="30">
                    <small class="form-help">Digite um nome descritivo para o novo tipo de projeto</small>
                </div>
                
                <div class="form-section">
                    <label class="form-label">
                        <i class="fas fa-palette"></i>
                        Escolha um Ícone
                    </label>
                    <div class="icon-grid" id="iconGrid">
                        ${iconOptions.map((option, index) => `
                            <div class="icon-option ${index === 0 ? 'selected' : ''}" 
                                 data-icon="${option.icon}" 
                                 data-index="${index}"
                                 style="--icon-color: ${option.color}">
                                <i class="${option.icon}"></i>
                                <span>${option.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="form-section preview-section">
                    <label class="form-label">
                        <i class="fas fa-eye"></i>
                        Pré-visualização
                    </label>
                    <div class="type-preview" id="typePreview">
                        <i class="${selectedIcon.icon}" style="color: ${selectedIcon.color}"></i>
                        <span id="previewName">Novo Tipo</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
                <button class="btn btn-primary" onclick="createNewProjectType()">
                    <i class="fas fa-plus"></i>
                    Criar Tipo
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const nameInput = modal.querySelector('#newTypeName');
    const iconGrid = modal.querySelector('#iconGrid');
    const preview = modal.querySelector('#typePreview');
    const previewName = modal.querySelector('#previewName');
    
    // Update preview when typing
    nameInput.addEventListener('input', function() {
        const name = this.value.trim() || 'Novo Tipo';
        previewName.textContent = name;
    });
    
    // Handle icon selection
    iconGrid.addEventListener('click', function(e) {
        const iconOption = e.target.closest('.icon-option');
        if (!iconOption) return;
        
        // Remove previous selection
        iconGrid.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
        
        // Add selection to clicked option
        iconOption.classList.add('selected');
        
        // Update selected icon
        const index = parseInt(iconOption.dataset.index);
        selectedIcon = iconOptions[index];
        
        // Update preview
        const previewIcon = preview.querySelector('i');
        previewIcon.className = selectedIcon.icon;
        previewIcon.style.color = selectedIcon.color;
    });
    
    // Focus on name input
    setTimeout(() => nameInput.focus(), 100);
    
    // Store selected icon globally
    window.currentSelectedIcon = selectedIcon;
}

// Create the new project type from modal
function createNewProjectType() {
    const nameInput = document.getElementById('newTypeName');
    const name = nameInput.value.trim();
    
    if (!name) {
        nameInput.focus();
        showNotification('Por favor, digite um nome para o tipo de projeto', 'error');
        return;
    }
    
    // Check if type already exists
    if (projectTypes.some(t => t.name.toLowerCase() === name.toLowerCase())) {
        nameInput.focus();
        showNotification('Este tipo de projeto já existe!', 'error');
        return;
    }
    
    // Create new type
    const newType = {
        id: name.replace(/\s+/g, '_'),
        name: name,
        icon: window.currentSelectedIcon.icon,
        isDefault: false
    };
    
    projectTypes.push(newType);
    saveCustomTypes();
    updateProjectTypeSelects();
    
    // Close modal
    document.querySelector('.add-type-modal').closest('.modal').remove();
    
    showNotification(`Tipo "${name}" criado com sucesso!`, 'success');
    
    // Refresh the manage types modal if it's open
    const manageModal = document.querySelector('.types-modal');
    if (manageModal) {
        manageModal.remove();
        manageProjectTypes();
    }
}

// Remove custom project type
function removeProjectType(typeId) {
    const type = projectTypes.find(t => t.id === typeId);
    if (!type) return;
    
    if (type.isDefault) {
        alert('Não é possível remover tipos padrão do sistema!');
        return;
    }
    
    // Check if type is being used
    const inUse = projects.some(p => p.type === typeId);
    if (inUse) {
        if (!confirm(`O tipo "${type.name}" está sendo usado em projetos existentes. Tem certeza que deseja removê-lo?`)) {
            return;
        }
    }
    
    projectTypes = projectTypes.filter(t => t.id !== typeId);
    saveCustomTypes();
    updateProjectTypeSelects();
    
    showNotification(`Tipo "${type.name}" removido com sucesso!`, 'success');
}

// Show project types management
function manageProjectTypes() {
    const customTypes = projectTypes.filter(t => !t.isDefault);
    
    let html = `
        <div class="types-manager">
            <h3>Gerenciar Tipos de Projeto</h3>
            <div class="types-section">
                <h4>Tipos Padrão</h4>
                <div class="types-list">
                    ${projectTypes.filter(t => t.isDefault).map(type => `
                        <div class="type-item default">
                            <i class="${type.icon}"></i>
                            <span>${type.name}</span>
                            <span class="type-badge">Padrão</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="types-section">
                <h4>Tipos Personalizados</h4>
                <div class="types-list">
                    ${customTypes.length === 0 ? 
                        '<div class="no-custom-types">Nenhum tipo personalizado criado</div>' :
                        customTypes.map(type => `
                            <div class="type-item custom">
                                <i class="${type.icon}"></i>
                                <span>${type.name}</span>
                                <button onclick="removeProjectType('${type.id}')" class="btn-remove">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')
                    }
                </div>
                <button onclick="addProjectType()" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    Adicionar Tipo
                </button>
            </div>
        </div>
    `;
    
    // Show in a modal or alert
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content types-modal">
            <div class="modal-header">
                <h3>Gerenciar Tipos de Projeto</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            ${html}
        </div>
    `;
    
    document.body.appendChild(modal);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Projects page rendering
function renderProjects() {
    const searchElement = document.getElementById('projectSearch');
    const typeElement = document.getElementById('typeFilter');
    const priorityElement = document.getElementById('priorityFilter');
    
    const searchTerm = searchElement ? searchElement.value.toLowerCase() : '';
    const typeFilter = typeElement ? typeElement.value : '';
    const priorityFilter = priorityElement ? priorityElement.value : '';
    
    let filteredProjects = projects.filter(project => {
        // Type filter
        if (typeFilter && project.type !== typeFilter) return false;
        
        // Priority filter
        if (priorityFilter && project.priority !== priorityFilter) return false;
        
        // Search filter
        if (searchTerm) {
            const matchesSearch = 
                project.title.toLowerCase().includes(searchTerm) ||
                project.sigaNumber.toLowerCase().includes(searchTerm) ||
                project.requester.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
        }
        
        return true;
    });
    
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';
    
    if (filteredProjects.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-project-diagram"></i><h3>Nenhum projeto encontrado</h3><p>Ajuste os filtros ou crie um novo projeto</p></div>';
        return;
    }
    
    filteredProjects.forEach(project => {
        const card = createProjectCard(project, false);
        grid.appendChild(card);
    });
}

// Project sidebar
function showProjectSidebar(project) {
    selectedProjectForSidebar = project;
    const sidebar = document.getElementById('projectSidebar');
    const content = document.getElementById('sidebarContent');
    
    // Get project time entries
    const projectTimeEntries = timeEntries.filter(entry => entry.projectId === project.id);
    const totalHours = projectTimeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    
    // Get project tasks
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    
    content.innerHTML = `
        <div class="project-details">
            <div class="detail-group">
                <label>Número SIGA:</label>
                <span>${project.sigaNumber}</span>
            </div>
            
            <div class="detail-group">
                <label>Título:</label>
                <span>${project.title}</span>
            </div>
            
            <div class="detail-group">
                <label>Solicitante:</label>
                <span>${project.requester}</span>
            </div>
            
            <div class="detail-group">
                <label>Tipo:</label>
                <span><i class="${getTypeIcon(project.type)}"></i> ${project.type}</span>
            </div>
            
            <div class="detail-group">
                <label>Prioridade:</label>
                <span class="priority-badge ${getPriorityClass(project.priority)}">${priorityLabels[project.priority]}</span>
            </div>
            
            <div class="detail-group">
                <label>Status:</label>
                <span class="status-badge status-${project.status}">${statusLabels[project.status]}</span>
            </div>
            
            <div class="detail-group">
                <label>Data de Início:</label>
                <span>${formatDate(project.startDate)}</span>
            </div>
            
            <div class="detail-group">
                <label>Data de Fim:</label>
                <span>${formatDate(project.endDate)}</span>
            </div>
            
            <div class="detail-group">
                <label>RFP:</label>
                <span>${project.isRFP ? 'Sim' : 'Não'}</span>
            </div>
            
            <div class="detail-group">
                <label>Total de Horas:</label>
                <span>${totalHours}h</span>
            </div>
            
            <div class="detail-group full-width">
                <label>Descrição:</label>
                <p>${project.description}</p>
            </div>
        </div>
        
        <div class="sidebar-actions">
            <button class="btn btn-primary" onclick="editProject(${project.id})">
                <i class="fas fa-edit"></i>
                Editar Projeto
            </button>
            <button class="btn btn-secondary" onclick="openTimeEntryModal(${project.id})">
                <i class="fas fa-clock"></i>
                Registrar Horas
            </button>
        </div>
        
        <div class="download-section">
            <h4>Downloads do Projeto</h4>
            <div class="download-buttons">
                <button class="btn btn-outline" onclick="downloadProjectMeetings(${project.id})">
                    <i class="fas fa-file-pdf"></i>
                    Baixar Atas
                </button>
                <button class="btn btn-outline" onclick="downloadProjectSchedule(${project.id})">
                    <i class="fas fa-calendar-alt"></i>
                    Baixar Cronograma
                </button>
                <button class="btn btn-outline" onclick="downloadProjectReport(${project.id})">
                    <i class="fas fa-chart-bar"></i>
                    Relatório Completo
                </button>
            </div>
        </div>
        
        <div class="time-entries-section">
            <h4>Registros de Horas</h4>
            <div class="time-entries-list">
                ${projectTimeEntries.length === 0 ? 
                    '<p class="no-entries">Nenhum registro de horas encontrado</p>' :
                    projectTimeEntries.map(entry => `
                        <div class="time-entry">
                            <div class="time-entry-header">
                                <span class="time-entry-date">${formatDate(entry.date)}</span>
                                <span class="time-entry-hours">${entry.hours}h</span>
                            </div>
                            <p class="time-entry-description">${entry.description}</p>
                        </div>
                    `).join('')
                }
            </div>
        </div>
        
        <div class="tasks-section">
            <h4>Tarefas do Projeto</h4>
            <div class="tasks-list">
                ${projectTasks.length === 0 ? 
                    '<p class="no-tasks">Nenhuma tarefa encontrada</p>' :
                    projectTasks.map(task => `
                        <div class="task-item">
                            <div class="task-header">
                                <span class="task-title">${task.title}</span>
                                <span class="status-badge status-${task.status}">${task.status === 'pending' ? 'Pendente' : task.status === 'in_progress' ? 'Em Andamento' : 'Concluída'}</span>
                            </div>
                            <p class="task-assigned">Responsável: ${task.assignedTo}</p>
                            <p class="task-dates">${formatDate(task.startDate)} - ${formatDate(task.endDate)}</p>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
    
    sidebar.classList.add('open');
}

function closeSidebar() {
    document.getElementById('projectSidebar').classList.remove('open');
    selectedProjectForSidebar = null;
}

function editProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Populate edit form
    document.getElementById('editProjectId').value = project.id;
    document.getElementById('editSigaNumber').value = project.sigaNumber;
    document.getElementById('editTitle').value = project.title;
    document.getElementById('editRequester').value = project.requester;
    document.getElementById('editType').value = project.type;
    document.getElementById('editPriority').value = project.priority;
    document.getElementById('editStartDate').value = project.startDate;
    document.getElementById('editEndDate').value = project.endDate;
    document.getElementById('editDescription').value = project.description;
    document.getElementById('editIsRfp').checked = project.isRFP;
    
    openModal('editProject');
}

function openTimeEntryModal(projectId, date = null) {
    document.getElementById('timeProjectId').value = projectId;
    document.getElementById('timeEntryDate').value = date || new Date().toISOString().split('T')[0];
    openModal('timeEntry');
}

// Drag and drop functionality
function initializeDragAndDrop() {
    const columns = document.querySelectorAll('.kanban-content');
    
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-project-id'));
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    
    const projectId = parseInt(e.dataTransfer.getData('text/plain'));
    const targetColumn = e.currentTarget;
    const targetStatus = targetColumn.parentElement.getAttribute('data-status');
    
    // Update project status using the enhanced function
    const project = projects.find(p => p.id === projectId);
    if (project && project.status !== targetStatus) {
        // Use the enhanced updateProjectStatus function that handles archiving
        updateProjectStatus(projectId, targetStatus);
        
        // Re-render dashboard
        renderDashboard();
        renderProjects();
        
        const statusLabels = {
            'todo': 'A Fazer',
            'in_progress': 'Em Andamento', 
            'completed': 'Concluído'
        };
        showNotification(`Projeto movido para ${statusLabels[targetStatus]}`, 'success');
    }
}

// Gantt page functions
function renderGantt() {
    const projectFilter = document.getElementById('ganttProjectFilter').value;
    const searchTerm = document.getElementById('ganttSearch').value.toLowerCase();
    
    let filteredTasks = tasks.filter(task => {
        const matchesProject = !projectFilter || task.projectId == projectFilter;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
                             task.assignedTo.toLowerCase().includes(searchTerm);
        return matchesProject && matchesSearch;
    });
    
    const tasksList = document.getElementById('ganttTasksList');
    tasksList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state"><i class="fas fa-tasks"></i><h3>Nenhuma tarefa encontrada</h3><p>Crie uma nova tarefa para começar</p></div>';
        return;
    }
    
    // Group tasks by project for better organization
    const tasksByProject = {};
    filteredTasks.forEach(task => {
        const projectId = task.projectId;
        if (!tasksByProject[projectId]) {
            tasksByProject[projectId] = [];
        }
        tasksByProject[projectId].push(task);
    });
    
    // Render tasks grouped by project
    Object.keys(tasksByProject).forEach(projectId => {
        const projectTasks = tasksByProject[projectId];
        const project = projects.find(p => p.id == projectId);
        
        // Create project section header
        const projectSection = document.createElement('div');
        projectSection.className = 'gantt-project-section';
        
        const projectHeader = document.createElement('div');
        projectHeader.className = 'gantt-project-header';
        projectHeader.innerHTML = `
            <div class="project-info">
                <h3>
                    <i class="fas fa-project-diagram"></i>
                    ${getProjectTitle(parseInt(projectId))}
                </h3>
                <div class="project-meta">
                    <span class="task-count">${projectTasks.length} ${projectTasks.length === 1 ? 'tarefa' : 'tarefas'}</span>
                    ${project ? `<span class="project-status status-${project.status}">${project.status === 'todo' ? 'A Fazer' : project.status === 'in_progress' ? 'Em Andamento' : 'Concluído'}</span>` : ''}
                </div>
            </div>
            <div class="project-actions">
                <button class="btn-icon" onclick="downloadProjectSchedule(${projectId})" title="Baixar Cronograma do Projeto">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;
        
        // Create tasks grid for this project
        const tasksGrid = document.createElement('div');
        tasksGrid.className = 'gantt-tasks-grid';
        
        projectTasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = `gantt-task-card ${task.status}`;
            taskCard.innerHTML = `
                <div class="task-card-header">
                    <div class="task-title-section">
                        <h4 class="task-title">${task.title}</h4>
                        <div class="task-status-badge">
                            <span class="status-badge ${task.status}">${getTaskStatusLabel(task.status)}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-icon" onclick="editTask(${task.id})" title="Editar Tarefa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon success" onclick="completeTask(${task.id})" title="Marcar como Concluída">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-icon danger" onclick="deleteTask(${task.id})" title="Excluir Tarefa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="task-card-content">
                    <div class="task-assignment">
                        <div class="assignment-info">
                            <i class="fas fa-user"></i>
                            <span class="assigned-to">${task.assignedTo}</span>
                        </div>
                        <div class="priority-info">
                            <i class="fas fa-flag"></i>
                            <span class="priority priority-${task.priority}">${task.priority === 'low' ? 'Baixa' : task.priority === 'medium' ? 'Média' : task.priority === 'high' ? 'Alta' : 'Crítica'}</span>
                        </div>
                    </div>
                    
                    <div class="task-timeline">
                        <div class="timeline-info">
                            <div class="date-range">
                                <div class="start-date">
                                    <i class="fas fa-play"></i>
                                    <span>Início: ${formatDate(task.startDate)}</span>
                                </div>
                                <div class="end-date">
                                    <i class="fas fa-flag-checkered"></i>
                                    <span>Fim: ${formatDate(task.endDate)}</span>
                                </div>
                            </div>
                            <div class="duration-info">
                                <i class="fas fa-clock"></i>
                                <span>${task.duration} dias</span>
                            </div>
                        </div>
                        
                        <div class="progress-bar">
                            <div class="progress-fill ${task.status}" style="width: ${task.status === 'completed' ? '100%' : task.status === 'in_progress' ? '50%' : '0%'}"></div>
                        </div>
                    </div>
                    
                    ${task.description ? `
                        <div class="task-description">
                            <i class="fas fa-align-left"></i>
                            <p>${task.description}</p>
                        </div>
                    ` : ''}
                </div>
            `;
            
            tasksGrid.appendChild(taskCard);
        });
        
        projectSection.appendChild(projectHeader);
        projectSection.appendChild(tasksGrid);
        tasksList.appendChild(projectSection);
    });
}

function getTaskStatusLabel(status) {
    const labels = {
        pending: 'Pendente',
        in_progress: 'Em Andamento',
        completed: 'Concluída'
    };
    return labels[status] || status;
}

function completeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'completed';
        renderGantt();
        showNotification('Tarefa concluída!', 'success');
    }
}

function deleteTask(taskId) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderGantt();
        showNotification('Tarefa excluída!', 'success');
    }
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        showNotification('Tarefa não encontrada!', 'error');
        return;
    }
    
    // Populate edit form with task data
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskProject').value = task.projectId;
    document.getElementById('editTaskAssigned').value = task.assignedTo;
    document.getElementById('editTaskDescription').value = task.description || '';
    document.getElementById('editTaskPriority').value = task.priority;
    document.getElementById('editTaskStatus').value = task.status;
    document.getElementById('editTaskStartDate').value = task.startDate;
    document.getElementById('editTaskEndDate').value = task.endDate;
    
    // Store task ID for form submission
    document.getElementById('editTaskForm').dataset.taskId = taskId;
    
    // Populate project select
    populateProjectSelects();
    
    // Open the edit modal
    openModal('editTask');
}

function submitEditTask() {
    const form = document.getElementById('editTaskForm');
    const taskId = parseInt(form.dataset.taskId);
    
    const updatedTask = {
        id: taskId,
        title: document.getElementById('editTaskTitle').value,
        projectId: parseInt(document.getElementById('editTaskProject').value),
        assignedTo: document.getElementById('editTaskAssigned').value,
        description: document.getElementById('editTaskDescription').value,
        priority: document.getElementById('editTaskPriority').value,
        status: document.getElementById('editTaskStatus').value,
        startDate: document.getElementById('editTaskStartDate').value,
        endDate: document.getElementById('editTaskEndDate').value
    };
    
    // Find and update the task
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = updatedTask;
        renderGantt();
        closeModal('editTask');
        showNotification('Tarefa atualizada com sucesso!', 'success');
    } else {
        showNotification('Erro ao atualizar tarefa!', 'error');
    }
}

// Meeting functions
function renderMeetings() {
    const projectFilter = document.getElementById('meetingProjectFilter').value;
    const searchTerm = document.getElementById('meetingSearch').value.toLowerCase();
    
    let filteredMeetings = meetings.filter(meeting => {
        const matchesProject = !projectFilter || meeting.projectId == projectFilter;
        const matchesSearch = meeting.title.toLowerCase().includes(searchTerm) ||
                             meeting.participants.some(p => p.toLowerCase().includes(searchTerm));
        return matchesProject && matchesSearch;
    });
    
    const grid = document.getElementById('meetingsGrid');
    grid.innerHTML = '';
    
    if (filteredMeetings.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><h3>Nenhuma ata encontrada</h3><p>Crie uma nova ata de reunião</p></div>';
        return;
    }
    
    // Group meetings by project for better organization
    const meetingsByProject = {};
    filteredMeetings.forEach(meeting => {
        const projectId = meeting.projectId || 'general';
        if (!meetingsByProject[projectId]) {
            meetingsByProject[projectId] = [];
        }
        meetingsByProject[projectId].push(meeting);
    });
    
    // Render meetings grouped by project
    Object.keys(meetingsByProject).forEach(projectId => {
        const projectMeetings = meetingsByProject[projectId];
        
        // Create project section header
        const projectSection = document.createElement('div');
        projectSection.className = 'meetings-project-section';
        
        const projectHeader = document.createElement('div');
        projectHeader.className = 'project-section-header';
        projectHeader.innerHTML = `
            <div class="project-info">
                <h3>
                    <i class="fas fa-project-diagram"></i>
                    ${projectId === 'general' ? 'Reuniões Gerais' : getProjectTitle(parseInt(projectId))}
                </h3>
                <span class="meeting-count">${projectMeetings.length} ${projectMeetings.length === 1 ? 'ata criada' : 'atas criadas'}</span>
            </div>
        `;
        
        // Create meetings grid for this project
        const meetingsGrid = document.createElement('div');
        meetingsGrid.className = 'meetings-cards-grid';
        
        projectMeetings.forEach(meeting => {
            const meetingCard = document.createElement('div');
            meetingCard.className = 'meeting-card enhanced';
            meetingCard.innerHTML = `
                <div class="meeting-card-header">
                    <div class="meeting-title-section">
                        <h4 class="meeting-title">${meeting.title}</h4>
                        <div class="meeting-date">
                            <i class="fas fa-calendar-alt"></i>
                            ${formatDate(meeting.date)}
                        </div>
                    </div>
                    <div class="meeting-actions">
                        <button class="btn-icon" onclick="downloadMeetingPDF(${meeting.id})" title="Baixar Ata">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-icon" onclick="editMeeting(${meeting.id})" title="Editar Ata">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
                
                <div class="meeting-card-content">
                    <div class="meeting-participants">
                        <div class="participants-header">
                            <i class="fas fa-users"></i>
                            <span>Participantes (${meeting.participants.length})</span>
                        </div>
                        <div class="participants-list">
                            ${meeting.participants.map(p => `<span class="participant-tag">${p}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="meeting-preview">
                        <div class="preview-section">
                            <h5><i class="fas fa-list-ul"></i> Pauta</h5>
                            <p class="preview-text">${meeting.agenda.length > 100 ? meeting.agenda.substring(0, 100) + '...' : meeting.agenda}</p>
                        </div>
                        
                        <div class="preview-section">
                            <h5><i class="fas fa-gavel"></i> Principais Decisões</h5>
                            <p class="preview-text">${meeting.decisions.length > 100 ? meeting.decisions.substring(0, 100) + '...' : meeting.decisions}</p>
                        </div>
                        
                        ${meeting.responsibles && meeting.responsibles.length > 0 ? `
                            <div class="preview-section">
                                <h5><i class="fas fa-user-check"></i> Responsabilidades</h5>
                                <div class="responsibilities-list">
                                    ${meeting.responsibles.map(r => `<span class="responsibility-tag">${r}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="meeting-card-footer">
                    <button class="expand-btn" onclick="toggleMeetingExpansion(${meeting.id})">
                        <span class="expand-text">Ver Detalhes Completos</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                
                <div class="meeting-expanded-content" id="expanded-${meeting.id}" style="display: none;">
                    <div class="expanded-section">
                        <h5><i class="fas fa-comments"></i> Discussões Detalhadas</h5>
                        <p>${meeting.discussions}</p>
                    </div>
                    
                    <div class="expanded-section">
                        <h5><i class="fas fa-gavel"></i> Decisões Completas</h5>
                        <p>${meeting.decisions}</p>
                    </div>
                    
                    <div class="expanded-section">
                        <h5><i class="fas fa-list-ul"></i> Pauta Completa</h5>
                        <p>${meeting.agenda}</p>
                    </div>
                </div>
            `;
            
            meetingsGrid.appendChild(meetingCard);
        });
        
        projectSection.appendChild(projectHeader);
        projectSection.appendChild(meetingsGrid);
        grid.appendChild(projectSection);
    });
}

// ServiceNow functions
function renderServiceNow() {
    const projectFilter = document.getElementById('ticketProjectFilter').value;
    const searchTerm = document.getElementById('ticketSearch').value.toLowerCase();
    
    let filteredTickets = tickets.filter(ticket => {
        const matchesProject = !projectFilter || ticket.projectId == projectFilter;
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm) ||
                             ticket.ticketNumber.toLowerCase().includes(searchTerm) ||
                             ticket.description.toLowerCase().includes(searchTerm);
        const isOpen = ticket.status === 'open' || ticket.status === 'in_progress';
        return matchesProject && matchesSearch && isOpen;
    });
    
    const container = document.getElementById('serviceNowTickets');
    container.innerHTML = '';
    
    if (filteredTickets.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-ticket-alt"></i><h3>Nenhum chamado aberto encontrado</h3><p>Todos os chamados estão fechados ou não há chamados cadastrados</p></div>';
        return;
    }
    
    // Group tickets by project
    const ticketsByProject = {};
    filteredTickets.forEach(ticket => {
        if (!ticketsByProject[ticket.projectId]) {
            ticketsByProject[ticket.projectId] = [];
        }
        ticketsByProject[ticket.projectId].push(ticket);
    });
    
    Object.keys(ticketsByProject).forEach(projectId => {
        const projectSection = document.createElement('div');
        projectSection.className = 'project-section';
        
        const projectHeader = document.createElement('div');
        projectHeader.className = 'project-header';
        projectHeader.textContent = getProjectTitle(parseInt(projectId));
        
        const ticketsList = document.createElement('div');
        ticketsList.className = 'tickets-list';
        
        ticketsByProject[projectId].forEach(ticket => {
            const ticketItem = document.createElement('div');
            ticketItem.className = 'ticket-item';
            
            ticketItem.innerHTML = `
                <div class="ticket-content">
                    <div class="ticket-info">
                        <div class="ticket-number">
                            <i class="fas fa-ticket-alt"></i>
                            ${ticket.ticketNumber}
                        </div>
                        <div class="ticket-title">${ticket.title}</div>
                        <div class="ticket-description">${ticket.description}</div>
                    </div>
                    <div class="ticket-meta">
                        <div class="ticket-date">
                            <i class="fas fa-calendar"></i>
                            ${new Date(ticket.createdDate).toLocaleString('pt-BR')}
                        </div>
                        <div class="ticket-status ${ticket.status}">
                            <i class="fas fa-circle"></i>
                            ${ticket.status === 'open' ? 'Aberto' : ticket.status === 'in_progress' ? 'Em Andamento' : 'Fechado'}
                        </div>
                        <div class="ticket-priority priority-${ticket.priority}">
                            <i class="fas fa-exclamation-triangle"></i>
                            ${ticket.priority === 'low' ? 'Baixa' : ticket.priority === 'medium' ? 'Média' : ticket.priority === 'high' ? 'Alta' : 'Crítica'}
                        </div>
                    </div>
                </div>
                <div class="ticket-actions">
                    <button class="btn btn-sm btn-outline" onclick="editTicket(${ticket.id})" title="Editar Chamado">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="closeTicket(${ticket.id})" title="Fechar Chamado">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTicket(${ticket.id})" title="Excluir Chamado">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            ticketsList.appendChild(ticketItem);
        });
        
        projectSection.appendChild(projectHeader);
        projectSection.appendChild(ticketsList);
        container.appendChild(projectSection);
    });
}

// Reports functions
function renderReports() {
    const content = document.getElementById('content');
    
    // Calculate comprehensive statistics
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const inProgressProjects = projects.filter(p => p.status === 'in_progress').length;
    const todoProjects = projects.filter(p => p.status === 'todo').length;
    
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const averageHours = totalProjects > 0 ? (totalHours / totalProjects).toFixed(1) : 0;
    
    const criticalProjects = projects.filter(p => p.priority === 'critical').length;
    const highProjects = projects.filter(p => p.priority === 'high').length;
    const mediumProjects = projects.filter(p => p.priority === 'medium').length;
    const lowProjects = projects.filter(p => p.priority === 'low').length;
    
    // Calculate completion rate
    const completionRate = totalProjects > 0 ? (completedProjects / totalProjects * 100).toFixed(1) : 0;
    const criticalRate = totalProjects > 0 ? (criticalProjects / totalProjects * 100).toFixed(1) : 0;
    const progressRate = totalProjects > 0 ? (inProgressProjects / totalProjects * 100).toFixed(1) : 0;
    
    // Calculate type distribution
    const sistemas = projects.filter(p => p.type === 'Sistemas').length;
    const infra = projects.filter(p => p.type === 'Infra').length;
    const networking = projects.filter(p => p.type === 'Networking').length;
    const servidores = projects.filter(p => p.type === 'Servidores').length;
    
    // Calculate RFP statistics
    const rfpProjects = projects.filter(p => p.isRFP).length;
    const rfpRate = totalProjects > 0 ? (rfpProjects / totalProjects * 100).toFixed(1) : 0;
    
    content.innerHTML = `
        <div class="page-header">
            <h1><i class="fas fa-chart-line"></i> Dashboard de Relatórios e Análises</h1>
            <div class="header-actions">
                <button class="btn btn-outline" onclick="generateProjectReport()">
                    <i class="fas fa-file-pdf"></i> Relatório Completo
                </button>
                <button class="btn btn-outline" onclick="generateHoursReport()">
                    <i class="fas fa-clock"></i> Relatório de Horas
                </button>
                <button class="btn btn-primary" onclick="exportDashboardPDF()">
                    <i class="fas fa-download"></i> Exportar Dashboard
                </button>
            </div>
        </div>
        
        <!-- Key Performance Indicators -->
        <div class="kpi-section">
            <div class="kpi-card highlight">
                <div class="kpi-icon"><i class="fas fa-trophy"></i></div>
                <div class="kpi-content">
                    <div class="kpi-number">${completionRate}%</div>
                    <div class="kpi-label">Taxa de Conclusão</div>
                    <div class="kpi-trend ${completionRate > 70 ? 'positive' : completionRate > 40 ? 'neutral' : 'negative'}">
                        <i class="fas fa-arrow-${completionRate > 70 ? 'up' : completionRate > 40 ? 'right' : 'down'}"></i>
                        ${completionRate > 70 ? 'Excelente' : completionRate > 40 ? 'Bom' : 'Atenção'}
                    </div>
                </div>
            </div>
            
            <div class="kpi-card">
                <div class="kpi-icon primary"><i class="fas fa-project-diagram"></i></div>
                <div class="kpi-content">
                    <div class="kpi-number">${totalProjects}</div>
                    <div class="kpi-label">Total de Projetos</div>
                    <div class="kpi-detail">${inProgressProjects} em andamento</div>
                </div>
            </div>
            
            <div class="kpi-card">
                <div class="kpi-icon success"><i class="fas fa-check-circle"></i></div>
                <div class="kpi-content">
                    <div class="kpi-number">${completedProjects}</div>
                    <div class="kpi-label">Concluídos</div>
                    <div class="kpi-detail">+${Math.floor(Math.random() * 3 + 1)} este mês</div>
                </div>
            </div>
            
            <div class="kpi-card">
                <div class="kpi-icon danger"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="kpi-content">
                    <div class="kpi-number">${criticalProjects}</div>
                    <div class="kpi-label">Críticos</div>
                    <div class="kpi-detail">${criticalRate}% do total</div>
                </div>
            </div>
            
            <div class="kpi-card">
                <div class="kpi-icon info"><i class="fas fa-clock"></i></div>
                <div class="kpi-content">
                    <div class="kpi-number">${totalHours}h</div>
                    <div class="kpi-label">Total de Horas</div>
                    <div class="kpi-detail">Média: ${averageHours}h/projeto</div>
                </div>
            </div>
            
            <div class="kpi-card">
                <div class="kpi-icon warning"><i class="fas fa-file-contract"></i></div>
                <div class="kpi-content">
                    <div class="kpi-number">${rfpProjects}</div>
                    <div class="kpi-label">Projetos RFP</div>
                    <div class="kpi-detail">${rfpRate}% do total</div>
                </div>
            </div>
        </div>
        
        <!-- Charts Grid -->
        <div class="charts-grid">
            <div class="chart-card large">
                <div class="chart-header">
                    <h3><i class="fas fa-pie-chart"></i> Status dos Projetos</h3>
                    <div class="chart-legend">
                        <span class="legend-item todo"><span class="legend-color"></span>A Fazer (${todoProjects})</span>
                        <span class="legend-item progress"><span class="legend-color"></span>Em Andamento (${inProgressProjects})</span>
                        <span class="legend-item completed"><span class="legend-color"></span>Concluído (${completedProjects})</span>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="statusChart"></canvas>
                    <div class="chart-center-text">
                        <div class="center-number">${totalProjects}</div>
                        <div class="center-label">Total</div>
                    </div>
                </div>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h3><i class="fas fa-layer-group"></i> Distribuição por Tipo</h3>
                </div>
                <canvas id="typeChart"></canvas>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h3><i class="fas fa-thermometer-half"></i> Níveis de Prioridade</h3>
                </div>
                <canvas id="priorityChart"></canvas>
            </div>
            
            <div class="chart-card large">
                <div class="chart-header">
                    <h3><i class="fas fa-chart-line"></i> Produtividade Mensal</h3>
                    <div class="chart-filters">
                        <select id="timelineFilter" onchange="renderTimelineChart()">
                            <option value="6">Últimos 6 meses</option>
                            <option value="12">Último ano</option>
                        </select>
                    </div>
                </div>
                <canvas id="timelineChart"></canvas>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h3><i class="fas fa-clock"></i> Distribuição de Horas</h3>
                </div>
                <canvas id="hoursChart"></canvas>
            </div>
        </div>
        
        <!-- Detailed Analysis -->
        <div class="analysis-section">
            <div class="analysis-card">
                <h3><i class="fas fa-analytics"></i> Análise de Performance</h3>
                
                <div class="progress-grid">
                    <div class="progress-item">
                        <div class="progress-header">
                            <label>Taxa de Conclusão</label>
                            <span class="progress-value">${completionRate}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill success" style="width: ${completionRate}%"></div>
                        </div>
                        <div class="progress-insight">${completionRate > 70 ? 'Excelente performance!' : completionRate > 40 ? 'Performance adequada' : 'Necessita atenção'}</div>
                    </div>
                    
                    <div class="progress-item">
                        <div class="progress-header">
                            <label>Projetos Críticos</label>
                            <span class="progress-value">${criticalRate}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill danger" style="width: ${criticalRate}%"></div>
                        </div>
                        <div class="progress-insight">${criticalRate > 30 ? 'Alto nível de criticidade' : criticalRate > 15 ? 'Nível moderado' : 'Baixa criticidade'}</div>
                    </div>
                    
                    <div class="progress-item">
                        <div class="progress-header">
                            <label>Em Desenvolvimento</label>
                            <span class="progress-value">${progressRate}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill warning" style="width: ${progressRate}%"></div>
                        </div>
                        <div class="progress-insight">${progressRate > 50 ? 'Alta atividade' : progressRate > 25 ? 'Atividade normal' : 'Baixa atividade'}</div>
                    </div>
                    
                    <div class="progress-item">
                        <div class="progress-header">
                            <label>Projetos RFP</label>
                            <span class="progress-value">${rfpRate}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill info" style="width: ${rfpRate}%"></div>
                        </div>
                        <div class="progress-insight">${rfpRate > 40 ? 'Alto volume RFP' : rfpRate > 20 ? 'Volume moderado' : 'Baixo volume RFP'}</div>
                    </div>
                </div>
            </div>
            
            <div class="analysis-card">
                <h3><i class="fas fa-table"></i> Resumo por Categoria</h3>
                <div class="summary-table">
                    <div class="summary-row header">
                        <span>Tipo</span>
                        <span>Quantidade</span>
                        <span>Concluídos</span>
                        <span>Taxa</span>
                        <span>Horas</span>
                    </div>
                    <div class="summary-row">
                        <span><i class="fas fa-code"></i> Sistemas</span>
                        <span>${sistemas}</span>
                        <span>${projects.filter(p => p.type === 'Sistemas' && p.status === 'completed').length}</span>
                        <span>${sistemas > 0 ? (projects.filter(p => p.type === 'Sistemas' && p.status === 'completed').length / sistemas * 100).toFixed(0) : 0}%</span>
                        <span>${timeEntries.filter(e => projects.find(p => p.id === e.projectId && p.type === 'Sistemas')).reduce((sum, e) => sum + e.hours, 0)}h</span>
                    </div>
                    <div class="summary-row">
                        <span><i class="fas fa-server"></i> Infra</span>
                        <span>${infra}</span>
                        <span>${projects.filter(p => p.type === 'Infra' && p.status === 'completed').length}</span>
                        <span>${infra > 0 ? (projects.filter(p => p.type === 'Infra' && p.status === 'completed').length / infra * 100).toFixed(0) : 0}%</span>
                        <span>${timeEntries.filter(e => projects.find(p => p.id === e.projectId && p.type === 'Infra')).reduce((sum, e) => sum + e.hours, 0)}h</span>
                    </div>
                    <div class="summary-row">
                        <span><i class="fas fa-network-wired"></i> Networking</span>
                        <span>${networking}</span>
                        <span>${projects.filter(p => p.type === 'Networking' && p.status === 'completed').length}</span>
                        <span>${networking > 0 ? (projects.filter(p => p.type === 'Networking' && p.status === 'completed').length / networking * 100).toFixed(0) : 0}%</span>
                        <span>${timeEntries.filter(e => projects.find(p => p.id === e.projectId && p.type === 'Networking')).reduce((sum, e) => sum + e.hours, 0)}h</span>
                    </div>
                    <div class="summary-row">
                        <span><i class="fas fa-hdd"></i> Servidores</span>
                        <span>${servidores}</span>
                        <span>${projects.filter(p => p.type === 'Servidores' && p.status === 'completed').length}</span>
                        <span>${servidores > 0 ? (projects.filter(p => p.type === 'Servidores' && p.status === 'completed').length / servidores * 100).toFixed(0) : 0}%</span>
                        <span>${timeEntries.filter(e => projects.find(p => p.id === e.projectId && p.type === 'Servidores')).reduce((sum, e) => sum + e.hours, 0)}h</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Render charts after DOM is updated
    setTimeout(() => {
        updateStatusChart();
        updateTypeChart();
        updatePriorityChart();
        renderTimelineChart();
        updateHoursChart();
    }, 100);
}

function renderProjectTypeChart() {
    // Use the new updateTypeChart function
    updateTypeChart();
}

function renderPriorityChart() {
    // Use the new updatePriorityChart function
    updatePriorityChart();
}

// Helper functions
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function getProjectTitle(projectId) {
    const project = projects.find(p => p.id === projectId);
    return project ? `${project.sigaNumber} - ${project.title}` : 'Projeto não encontrado';
}

function populateProjectSelects() {
    const selects = [
        'taskProject',
        'meetingProject', 
        'ticketProject',
        'timeProjectId',
        'ganttProjectFilter',
        'meetingProjectFilter',
        'ticketProjectFilter',
        'editTicketProject'
    ];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            // Clear existing options except first one
            while (select.children.length > 1) {
                select.removeChild(select.lastChild);
            }
            
            // Add project options
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = `${project.sigaNumber} - ${project.title}`;
                select.appendChild(option);
            });
        }
    });
}

// Export functions
function exportProjectsCSV() {
    const headers = ['Número SIGA', 'Título', 'Solicitante', 'Tipo', 'Prioridade', 'Status', 'Data Início', 'Data Fim', 'RFP', 'Horas'];
    const csvContent = [
        headers.join(','),
        ...projects.map(project => [
            project.sigaNumber,
            `"${project.title}"`,
            `"${project.requester}"`,
            project.type,
            priorityLabels[project.priority],
            statusLabels[project.status],
            project.startDate,
            project.endDate,
            project.isRFP ? 'Sim' : 'Não',
            project.totalHours || 0
        ].join(','))
    ].join('\n');
    
    downloadCSV(csvContent, 'projetos.csv');
    showNotification('Arquivo CSV exportado!', 'success');
}

function exportGantt() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Cronograma de Tarefas', 20, 20);
    
    let y = 40;
    tasks.forEach(task => {
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
        
        doc.setFontSize(12);
        doc.text(`${task.title} - ${getProjectTitle(task.projectId)}`, 20, y);
        doc.setFontSize(10);
        doc.text(`Responsável: ${task.assignedTo} | Status: ${getTaskStatusLabel(task.status)}`, 20, y + 10);
        doc.text(`Período: ${formatDate(task.startDate)} - ${formatDate(task.endDate)}`, 20, y + 20);
        y += 35;
    });
    
    doc.save('cronograma-tarefas.pdf');
    showNotification('Cronograma exportado!', 'success');
}

function exportMeetings() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Atas de Reunião', 20, 20);
    
    let y = 40;
    meetings.forEach(meeting => {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        
        doc.setFontSize(14);
        doc.text(meeting.title, 20, y);
        doc.setFontSize(10);
        doc.text(`Data: ${formatDate(meeting.date)}`, 20, y + 10);
        doc.text(`Participantes: ${meeting.participants.join(', ')}`, 20, y + 20);
        
        // Add agenda and decisions with text wrapping
        const agendaLines = doc.splitTextToSize(`Pauta: ${meeting.agenda}`, 170);
        agendaLines.forEach((line, index) => {
            doc.text(line, 20, y + 30 + (index * 5));
        });
        
        y += 30 + (agendaLines.length * 5) + 20;
    });
    
    doc.save('atas-reuniao.pdf');
    showNotification('Atas exportadas!', 'success');
}

function generateProjectReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Relatório de Projetos', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Total de projetos: ${projects.length}`, 20, 40);
    doc.text(`Projetos críticos: ${projects.filter(p => p.priority === 'critical').length}`, 20, 50);
    doc.text(`Projetos concluídos: ${projects.filter(p => p.status === 'completed').length}`, 20, 60);
    doc.text(`Projetos em andamento: ${projects.filter(p => p.status === 'in_progress').length}`, 20, 70);
    doc.text(`Total de horas registradas: ${projects.reduce((sum, p) => sum + (p.totalHours || 0), 0)}h`, 20, 80);
    
    doc.save('relatorio-projetos.pdf');
    showNotification('Relatório gerado!', 'success');
}

function generateHoursReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Relatório de Horas', 20, 20);
    
    let y = 40;
    projects.forEach(project => {
        const projectEntries = timeEntries.filter(entry => entry.projectId === project.id);
        const totalHours = projectEntries.reduce((sum, entry) => sum + entry.hours, 0);
        
        if (totalHours > 0) {
            doc.setFontSize(12);
            doc.text(`${project.sigaNumber} - ${project.title}`, 20, y);
            doc.setFontSize(10);
            doc.text(`Total: ${totalHours}h`, 20, y + 10);
            y += 25;
        }
    });
    
    doc.save('relatorio-horas.pdf');
    showNotification('Relatório de horas gerado!', 'success');
}

function generateMeetingsReport() {
    exportMeetings(); // Reuse the meetings export
}

function generateTicketsReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Relatório de Tickets ServiceNow', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Total de tickets: ${tickets.length}`, 20, 40);
    doc.text(`Tickets abertos: ${tickets.filter(t => t.status === 'open').length}`, 20, 50);
    doc.text(`Tickets em andamento: ${tickets.filter(t => t.status === 'in_progress').length}`, 20, 60);
    
    doc.save('relatorio-tickets.pdf');
    showNotification('Relatório de tickets gerado!', 'success');
}

// File handling
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            if (file.name.endsWith('.csv')) {
                importFromCSV(e.target.result);
            } else if (file.name.endsWith('.xlsx')) {
                importFromExcel(e.target.result);
            }
        } catch (error) {
            console.error('Erro ao importar arquivo:', error);
            showNotification('Erro ao importar arquivo', 'error');
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
}

function importFromCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    let imported = 0;
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 6) {
            const project = {
                id: currentProjectId++,
                sigaNumber: values[0] || `SIT.2025.${String(currentProjectId).padStart(6, '0')}`,
                title: values[1] || 'Projeto Importado',
                requester: values[2] || 'Não informado',
                type: values[3] || 'Sistemas',
                priority: mapPriority(values[4]) || 'medium',
                status: 'todo',
                startDate: values[5] || new Date().toISOString().split('T')[0],
                endDate: values[6] || new Date().toISOString().split('T')[0],
                description: values[7] || 'Descrição não informada',
                isRFP: values[8] === 'Sim' || values[8] === 'true',
                totalHours: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            projects.push(project);
            imported++;
        }
    }
    
    closeModal('importProjects');
    renderDashboard();
    renderProjects();
    populateProjectSelects();
    
    showNotification(`${imported} projetos importados com sucesso!`, 'success');
}

function importFromExcel(data) {
    const workbook = XLSX.read(data, { type: 'binary' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    
    let imported = 0;
    jsonData.forEach(row => {
        const project = {
            id: currentProjectId++,
            sigaNumber: row['Número SIGA'] || row['sigaNumber'] || `SIT.2025.${String(currentProjectId).padStart(6, '0')}`,
            title: row['Título'] || row['title'] || 'Projeto Importado',
            requester: row['Solicitante'] || row['requester'] || 'Não informado',
            type: row['Tipo'] || row['type'] || 'Sistemas',
            priority: mapPriority(row['Prioridade'] || row['priority']) || 'medium',
            status: 'todo',
            startDate: formatDateFromExcel(row['Data Início'] || row['startDate']) || new Date().toISOString().split('T')[0],
            endDate: formatDateFromExcel(row['Data Fim'] || row['endDate']) || new Date().toISOString().split('T')[0],
            description: row['Descrição'] || row['description'] || 'Descrição não informada',
            isRFP: row['RFP'] === 'Sim' || row['RFP'] === 'true' || row['isRFP'] === true,
            totalHours: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        projects.push(project);
        imported++;
    });
    
    closeModal('importProjects');
    renderDashboard();
    renderProjects();
    populateProjectSelects();
    
    showNotification(`${imported} projetos importados com sucesso!`, 'success');
}

function mapPriority(priority) {
    const priorityMap = {
        'Baixa': 'low',
        'Média': 'medium',
        'Alta': 'high',
        'Crítica': 'critical',
        'low': 'low',
        'medium': 'medium',
        'high': 'high',
        'critical': 'critical'
    };
    return priorityMap[priority] || 'medium';
}

function formatDateFromExcel(dateValue) {
    if (!dateValue) return null;
    
    // If it's already a valid date string
    if (typeof dateValue === 'string' && dateValue.match(/\d{4}-\d{2}-\d{2}/)) {
        return dateValue;
    }
    
    // Try to parse as date
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
    }
    
    return null;
}

function downloadTemplate() {
    const headers = ['Número SIGA', 'Título', 'Solicitante', 'Tipo', 'Prioridade', 'Data Início', 'Data Fim', 'Descrição', 'RFP'];
    const sampleData = [
        'SIT.2025.000001',
        'Projeto Exemplo',
        'João Silva',
        'Sistemas',
        'Média',
        '2025-01-01',
        '2025-02-01',
        'Descrição do projeto exemplo',
        'Não'
    ];
    
    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    downloadCSV(csvContent, 'template-projetos.csv');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
        color: #065f46;
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
        color: #991b1b;
    }
    
    .notification-info {
        border-left: 4px solid #3b82f6;
        color: #1e40af;
    }
    
    .participant-tag, .responsible-tag {
        display: inline-block;
        background: #f3f4f6;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        margin: 0.25rem;
        font-size: 0.875rem;
    }
    
    .participant-tag button, .responsible-tag button {
        background: none;
        border: none;
        margin-left: 0.25rem;
        cursor: pointer;
        color: #6b7280;
    }
    
    .participants-list, .responsibles-list {
        margin-top: 0.5rem;
    }
`;
document.head.appendChild(notificationStyles);

// Export functions for Excel
function exportProjectsExcel() {
    const data = projects.map(project => ({
        'Número SIGA': project.sigaNumber,
        'Título': project.title,
        'Solicitante': project.requester,
        'Tipo': project.type,
        'Prioridade': priorityLabels[project.priority],
        'Status': statusLabels[project.status],
        'Data Início': project.startDate,
        'Data Fim': project.endDate,
        'RFP': project.isRFP ? 'Sim' : 'Não',
        'Total Horas': project.totalHours || 0,
        'Descrição': project.description
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projetos');
    XLSX.writeFile(wb, 'projetos.xlsx');
    showNotification('Arquivo Excel exportado!', 'success');
}

function exportMeetingsExcel() {
    const data = meetings.map(meeting => ({
        'Título': meeting.title,
        'Data': formatDate(meeting.date),
        'Projeto': meeting.projectId ? getProjectTitle(meeting.projectId) : 'Reunião Geral',
        'Participantes': meeting.participants.join(', '),
        'Pauta': meeting.agenda,
        'Discussões': meeting.discussions,
        'Decisões': meeting.decisions,
        'Responsáveis': meeting.responsibles.join(', ')
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Atas de Reunião');
    XLSX.writeFile(wb, 'atas-reuniao.xlsx');
    showNotification('Atas exportadas em Excel!', 'success');
}

function exportTicketsExcel() {
    const data = tickets.map(ticket => ({
        'Número': ticket.ticketNumber,
        'Título': ticket.title,
        'Projeto': getProjectTitle(ticket.projectId),
        'Descrição': ticket.description,
        'Status': ticket.status === 'open' ? 'Aberto' : 'Em Andamento',
        'Data Criação': new Date(ticket.createdDate).toLocaleString('pt-BR')
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Chamados ServiceNow');
    XLSX.writeFile(wb, 'chamados-servicenow.xlsx');
    showNotification('Chamados exportados em Excel!', 'success');
}

function exportGanttExcel() {
    const data = tasks.map(task => ({
        'Tarefa': task.title,
        'Projeto': getProjectTitle(task.projectId),
        'Responsável': task.assignedTo,
        'Data Início': formatDate(task.startDate),
        'Data Fim': formatDate(task.endDate),
        'Duração': task.duration + ' dias',
        'Status': getTaskStatusLabel(task.status),
        'Prioridade': priorityLabels[task.priority],
        'Descrição': task.description
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cronograma de Tarefas');
    XLSX.writeFile(wb, 'cronograma-tarefas.xlsx');
    showNotification('Cronograma exportado em Excel!', 'success');
}

// Rename existing functions to maintain PDF functionality
function exportMeetingsPDF() {
    exportMeetings(); // Call existing PDF function
}

function exportTicketsPDF() {
    generateTicketsReport(); // Call existing PDF function
}

// Archive system for completed projects
let archivedProjects = [];

// Get completion month/year from project
function getCompletionPeriod(project) {
    if (!project.completedAt) {
        project.completedAt = new Date().toISOString();
    }
    const date = new Date(project.completedAt);
    const month = date.toLocaleString('pt-BR', { month: 'long' });
    const year = date.getFullYear();
    return { month, year, monthYear: `${month} ${year}` };
}

// Archive completed projects
function archiveCompletedProjects() {
    const completedProjects = projects.filter(p => p.status === 'completed');
    
    completedProjects.forEach(project => {
        // Check if not already archived
        if (!archivedProjects.find(ap => ap.id === project.id)) {
            project.completedAt = project.completedAt || new Date().toISOString();
            archivedProjects.push({...project});
        }
    });
    
    // Remove completed projects from main projects array
    projects = projects.filter(p => p.status !== 'completed');
}

// Update project status and handle archiving
function updateProjectStatus(projectId, newStatus) {
    console.log(`updateProjectStatus called with projectId: ${projectId}, newStatus: ${newStatus}`);
    
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const oldStatus = project.status;
        project.status = newStatus;
        project.updatedAt = new Date().toISOString();
        
        console.log(`Project ${projectId} status changed from ${oldStatus} to ${newStatus}`);
        
        if (newStatus === 'completed') {
            project.completedAt = new Date().toISOString();
            console.log(`Project ${projectId} completed, starting archival process...`);
            
            // Archive related items immediately
            archiveProjectRelatedItems(projectId);
            
            // Move to archived after a short delay to show completion
            setTimeout(() => {
                archiveCompletedProjects();
                renderDashboard();
                renderProjects();
                showNotification(`Projeto "${project.title}" foi concluído e arquivado junto com suas atas e cronogramas!`, 'success');
                
                // Update other pages that might show the archived items
                if (document.getElementById('meetings')) {
                    renderMeetings();
                }
                if (document.getElementById('ganttTasksList')) {
                    renderGantt();
                }
            }, 1000);
        }
    } else {
        console.error(`Project with ID ${projectId} not found`);
    }
}

// Render archived projects page
function renderArchivedProjects() {
    console.log('renderArchivedProjects called');
    console.log('archivedProjects array:', archivedProjects);
    
    const searchElement = document.getElementById('archivedSearch');
    const monthElement = document.getElementById('monthFilter');
    const yearElement = document.getElementById('yearFilter');
    
    const searchTerm = searchElement ? searchElement.value.toLowerCase() : '';
    const monthFilter = monthElement ? monthElement.value : '';
    const yearFilter = yearElement ? yearElement.value : '';
    
    let filteredProjects = archivedProjects.filter(project => {
        const period = getCompletionPeriod(project);
        
        // Month filter
        if (monthFilter && period.month !== monthFilter) return false;
        
        // Year filter  
        if (yearFilter && period.year.toString() !== yearFilter) return false;
        
        // Search filter
        if (searchTerm) {
            const matchesSearch = 
                project.title.toLowerCase().includes(searchTerm) ||
                project.sigaNumber.toLowerCase().includes(searchTerm) ||
                project.requester.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
        }
        
        return true;
    });
    
    const container = document.getElementById('archivedContainer');
    if (!container) {
        console.error('archivedContainer element not found');
        return;
    }
    
    container.innerHTML = '';
    
    console.log(`Filtered ${filteredProjects.length} archived projects`);
    
    if (filteredProjects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-archive"></i>
                <h3>Nenhum projeto arquivado</h3>
                <p>Projetos concluídos aparecerão aqui organizados por mês</p>
                <p><small>Total de projetos arquivados: ${archivedProjects.length}</small></p>
            </div>
        `;
        return;
    }
    
    // Group by month/year
    const groupedProjects = {};
    filteredProjects.forEach(project => {
        const period = getCompletionPeriod(project);
        const key = period.monthYear;
        
        if (!groupedProjects[key]) {
            groupedProjects[key] = [];
        }
        groupedProjects[key].push(project);
    });
    
    // Sort by date (newest first)
    const sortedKeys = Object.keys(groupedProjects).sort((a, b) => {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        return dateB - dateA;
    });
    
    sortedKeys.forEach(monthYear => {
        const monthSection = document.createElement('div');
        monthSection.className = 'month-section';
        
        const monthHeader = document.createElement('div');
        monthHeader.className = 'month-header';
        monthHeader.innerHTML = `
            <h3>
                <i class="fas fa-calendar-alt"></i>
                ${monthYear} 
                <span class="month-count">(${groupedProjects[monthYear].length} projetos)</span>
            </h3>
        `;
        
        const projectsGrid = document.createElement('div');
        projectsGrid.className = 'projects-grid';
        
        groupedProjects[monthYear].forEach(project => {
            projectsGrid.innerHTML += createArchivedProjectCardHTML(project);
        });
        
        monthSection.appendChild(monthHeader);
        monthSection.appendChild(projectsGrid);
        container.appendChild(monthSection);
    });
}

// Create archived project card
function createArchivedProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card archived-card';
    
    const priorityClass = getPriorityClass(project.priority);
    const typeIcon = getTypeIcon(project.type);
    const completionDate = new Date(project.completedAt).toLocaleDateString('pt-BR');
    
    card.innerHTML = `
        <div class="project-card-header">
            <div class="project-type">
                <i class="${typeIcon}"></i>
                <span>${project.type}</span>
            </div>
            <div class="completion-badge">
                <i class="fas fa-check-circle"></i>
                Concluído em ${completionDate}
            </div>
        </div>
        
        <div class="project-card-content">
            <div class="project-siga">${project.sigaNumber}</div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-requester">Solicitante: ${project.requester}</p>
            <p class="project-description">${project.description.substring(0, 150)}${project.description.length > 150 ? '...' : ''}</p>
            
            ${project.isRFP ? '<div class="rfp-badge">RFP</div>' : ''}
            
            <div class="project-card-footer">
                <div class="project-dates">
                    <small>Início: ${formatDate(project.startDate)}</small>
                    <small>Fim: ${formatDate(project.endDate)}</small>
                    <small>Duração: ${calculateProjectDuration(project.startDate, project.endDate)} dias</small>
                </div>
                <div class="project-hours">
                    <i class="fas fa-clock"></i>
                    <span>${project.totalHours || 0}h</span>
                </div>
            </div>
            
            <div class="archived-actions">
                <button class="btn btn-secondary btn-sm" onclick="restoreProject(${project.id})">
                    <i class="fas fa-undo"></i>
                    Restaurar
                </button>
                <button class="btn btn-secondary btn-sm" onclick="viewArchivedProject(${project.id})">
                    <i class="fas fa-eye"></i>
                    Visualizar
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Calculate project duration in days
function calculateProjectDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Restore archived project
function restoreProject(projectId) {
    if (confirm('Tem certeza que deseja restaurar este projeto?')) {
        const archivedProject = archivedProjects.find(p => p.id === projectId);
        if (archivedProject) {
            // Remove completed status and add back to active projects
            archivedProject.status = 'in_progress';
            archivedProject.completedAt = null;
            archivedProject.updatedAt = new Date().toISOString();
            
            projects.push(archivedProject);
            archivedProjects = archivedProjects.filter(p => p.id !== projectId);
            
            renderArchivedProjects();
            renderDashboard();
            renderProjects();
            showNotification('Projeto restaurado com sucesso!', 'success');
        }
    }
}

// View archived project details
function viewArchivedProject(projectId) {
    const project = archivedProjects.find(p => p.id === projectId);
    if (project) {
        showProjectSidebar(project);
    }
}

// Populate month and year filters
function populateArchiveFilters() {
    const monthSelect = document.getElementById('monthFilter');
    const yearSelect = document.getElementById('yearFilter');
    
    // Clear existing options except first
    while (monthSelect.children.length > 1) {
        monthSelect.removeChild(monthSelect.lastChild);
    }
    while (yearSelect.children.length > 1) {
        yearSelect.removeChild(yearSelect.lastChild);
    }
    
    const months = new Set();
    const years = new Set();
    
    archivedProjects.forEach(project => {
        const period = getCompletionPeriod(project);
        months.add(period.month);
        years.add(period.year);
    });
    
    // Add months
    [...months].sort().forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
    
    // Add years (newest first)
    [...years].sort((a, b) => b - a).forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

// Export archived projects to Excel
function exportArchivedExcel() {
    const data = archivedProjects.map(project => {
        const period = getCompletionPeriod(project);
        return {
            'Número SIGA': project.sigaNumber,
            'Título': project.title,
            'Solicitante': project.requester,
            'Tipo': project.type,
            'Prioridade': priorityLabels[project.priority],
            'Data Início': project.startDate,
            'Data Fim': project.endDate,
            'Data Conclusão': new Date(project.completedAt).toLocaleDateString('pt-BR'),
            'Mês Conclusão': period.monthYear,
            'RFP': project.isRFP ? 'Sim' : 'Não',
            'Total Horas': project.totalHours || 0,
            'Duração (dias)': calculateProjectDuration(project.startDate, project.endDate),
            'Descrição': project.description
        };
    });
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projetos Arquivados');
    XLSX.writeFile(wb, 'projetos-arquivados.xlsx');
    showNotification('Projetos arquivados exportados!', 'success');
}

// Update the original drag and drop handler to use the new status update function
function handleDrop(e) {
    e.preventDefault();
    
    const projectId = parseInt(e.dataTransfer.getData('text/plain'));
    const targetColumn = e.currentTarget;
    const targetStatus = targetColumn.parentElement.getAttribute('data-status');
    
    // Update project status using the new function
    updateProjectStatus(projectId, targetStatus);
    
    // Re-render dashboard
    renderDashboard();
    showNotification(`Projeto movido para ${statusLabels[targetStatus]}`, 'success');
}

// Update render reports to include stats
function renderReports() {
    // Update statistics
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('criticalProjects').textContent = projects.filter(p => p.priority === 'critical').length;
    document.getElementById('completedProjects').textContent = archivedProjects.length;
    document.getElementById('totalHours').textContent = 
        projects.reduce((sum, p) => sum + (p.totalHours || 0), 0) + 
        archivedProjects.reduce((sum, p) => sum + (p.totalHours || 0), 0) + 'h';
    
    // Render charts with slight delay
    setTimeout(() => {
        renderProjectTypeChart();
        renderPriorityChart();
    }, 100);
}

// Enhanced showPage function to handle all pages including archived
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Render page-specific content
    switch(pageId) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'projects':
            renderProjects();
            break;
        case 'gantt':
            renderGantt();
            populateProjectSelects();
            break;
        case 'meetings':
            renderMeetings();
            populateProjectSelects();
            break;
        case 'servicenow':
            renderServiceNow();
            populateProjectSelects();
            break;
        case 'reports':
            renderReports();
            break;
        case 'archived':
            console.log('Switching to archived page');
            renderArchivedProjects();
            populateArchiveFilters();
            break;
    }
}

// Add event listeners for archived page filters
document.addEventListener('DOMContentLoaded', function() {
    const archivedSearch = document.getElementById('archivedSearch');
    const monthFilter = document.getElementById('monthFilter');
    const yearFilter = document.getElementById('yearFilter');
    
    if (archivedSearch) archivedSearch.addEventListener('input', renderArchivedProjects);
    if (monthFilter) monthFilter.addEventListener('change', renderArchivedProjects);
    if (yearFilter) yearFilter.addEventListener('change', renderArchivedProjects);
});

// Additional event listeners for search and filter functionality
document.addEventListener('DOMContentLoaded', function() {
    // Project page filters have been removed from UI
    
    // Gantt page filters
    const ganttSearch = document.getElementById('ganttSearch');
    const ganttProjectFilter = document.getElementById('ganttProjectFilter');
    
    if (ganttSearch) {
        ganttSearch.addEventListener('input', renderGantt);
    }
    
    if (ganttProjectFilter) {
        ganttProjectFilter.addEventListener('change', renderGantt);
    }
    
    // Meeting page filters
    const meetingSearch = document.getElementById('meetingSearch');
    const meetingProjectFilter = document.getElementById('meetingProjectFilter');
    
    if (meetingSearch) {
        meetingSearch.addEventListener('input', renderMeetings);
    }
    
    if (meetingProjectFilter) {
        meetingProjectFilter.addEventListener('change', renderMeetings);
    }
    
    // Edit task form submission
    const editTaskForm = document.getElementById('editTaskForm');
    if (editTaskForm) {
        editTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitEditTask();
        });
    }
    
    // ServiceNow page filters
    const ticketSearch = document.getElementById('ticketSearch');
    const ticketProjectFilter = document.getElementById('ticketProjectFilter');
    
    if (ticketSearch) {
        ticketSearch.addEventListener('input', renderServiceNow);
    }
    
    if (ticketProjectFilter) {
        ticketProjectFilter.addEventListener('change', renderServiceNow);
    }
});

// Project Details Modal Functions
function showProjectDetails(project) {
    const modal = document.createElement('div');
    modal.className = 'modal project-details-modal';
    modal.id = 'projectDetailsModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>
                    <i class="fas fa-project-diagram"></i>
                    Detalhes do Projeto
                </h2>
                <button class="close-btn" onclick="closeProjectDetails()">&times;</button>
            </div>
            
            <div class="modal-body">
                <div class="project-details-content">
                    <!-- Project Info Section -->
                    <div class="details-section">
                        <div class="section-header">
                            <h3><i class="fas fa-info-circle"></i> Informações do Projeto</h3>
                            <button class="btn btn-secondary btn-sm" onclick="editProject(${project.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                        </div>
                        
                        <div class="project-info-grid">
                            <div class="info-item">
                                <label>Número SIGA:</label>
                                <span class="project-siga-number">${project.sigaNumber}</span>
                            </div>
                            <div class="info-item">
                                <label>Título:</label>
                                <span>${project.title}</span>
                            </div>
                            <div class="info-item">
                                <label>Solicitante:</label>
                                <span>${project.requester}</span>
                            </div>
                            <div class="info-item">
                                <label>Tipo:</label>
                                <span class="project-type-badge">
                                    <i class="${getTypeIcon(project.type)}"></i>
                                    ${project.type}
                                </span>
                            </div>
                            <div class="info-item">
                                <label>Prioridade:</label>
                                <span class="priority-badge ${getPriorityClass(project.priority)}">
                                    ${priorityLabels[project.priority]}
                                </span>
                            </div>
                            <div class="info-item">
                                <label>Status:</label>
                                <span class="status-badge status-${project.status}">
                                    ${statusLabels[project.status]}
                                </span>
                            </div>
                            <div class="info-item">
                                <label>Data Início:</label>
                                <span>${formatDate(project.startDate)}</span>
                            </div>
                            <div class="info-item">
                                <label>Data Fim:</label>
                                <span>${formatDate(project.endDate)}</span>
                            </div>
                            <div class="info-item">
                                <label>É RFP:</label>
                                <span class="${project.isRFP ? 'rfp-yes' : 'rfp-no'}">
                                    ${project.isRFP ? 'Sim' : 'Não'}
                                </span>
                            </div>
                            <div class="info-item full-width">
                                <label>Descrição:</label>
                                <p class="project-description-full">${project.description}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Time Tracking Section -->
                    <div class="details-section">
                        <div class="section-header">
                            <h3><i class="fas fa-clock"></i> Controle de Horas</h3>
                            <div class="time-actions">
                                <span class="total-hours">Total: ${project.totalHours || 0}h</span>
                                <button class="btn btn-primary btn-sm" onclick="openTimeEntryForProject(${project.id})">
                                    <i class="fas fa-plus"></i> Registrar Horas
                                </button>
                            </div>
                        </div>
                        
                        <div id="timeEntriesList_${project.id}" class="time-entries-list">
                            <!-- Time entries will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Actions Section -->
                    <div class="details-section">
                        <div class="section-header">
                            <h3><i class="fas fa-cogs"></i> Ações</h3>
                        </div>
                        
                        <div class="project-actions">
                            <button class="btn btn-primary" onclick="editProject(${project.id})">
                                <i class="fas fa-edit"></i>
                                Editar Projeto
                            </button>
                            
                            <button class="btn btn-secondary" onclick="openTimeEntryForProject(${project.id})">
                                <i class="fas fa-clock"></i>
                                Registrar Horas
                            </button>
                            
                            <button class="btn btn-outline" onclick="duplicateProject(${project.id})">
                                <i class="fas fa-copy"></i>
                                Duplicar
                            </button>
                            
                            <button class="btn btn-danger" onclick="deleteProject(${project.id})">
                                <i class="fas fa-trash"></i>
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Load time entries for this project
    loadProjectTimeEntries(project.id);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectDetails();
        }
    });
}

function closeProjectDetails() {
    const modal = document.getElementById('projectDetailsModal');
    if (modal) {
        modal.remove();
    }
}

function loadProjectTimeEntries(projectId) {
    const projectTimeEntries = timeEntries.filter(entry => entry.projectId === projectId);
    const container = document.getElementById(`timeEntriesList_${projectId}`);
    
    if (!container) return;
    
    if (projectTimeEntries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clock"></i>
                <p>Nenhuma entrada de tempo registrada</p>
                <button class="btn btn-primary" onclick="openTimeEntryForProject(${projectId})">
                    Registrar Primeira Entrada
                </button>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    projectTimeEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = projectTimeEntries.map(entry => `
        <div class="time-entry-item">
            <div class="time-entry-header">
                <span class="time-entry-date">${formatDate(entry.date)}</span>
                <span class="time-entry-hours">${entry.hours}h</span>
                <div class="time-entry-actions">
                    <button class="btn btn-sm btn-outline" onclick="editTimeEntry(${entry.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTimeEntry(${entry.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="time-entry-description">${entry.description}</p>
        </div>
    `).join('');
}

function editProject(projectId) {
    closeProjectDetails();
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Fill edit form with project data
    document.getElementById('editSigaNumber').value = project.sigaNumber;
    document.getElementById('editTitle').value = project.title;
    document.getElementById('editRequester').value = project.requester;
    document.getElementById('editType').value = project.type;
    document.getElementById('editPriority').value = project.priority;
    document.getElementById('editStartDate').value = project.startDate;
    document.getElementById('editEndDate').value = project.endDate;
    document.getElementById('editIsRFP').checked = project.isRFP;
    document.getElementById('editDescription').value = project.description;
    
    // Store project ID for update
    document.getElementById('editProjectForm').dataset.projectId = projectId;
    
    openModal('editProject');
}

function deleteProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    if (confirm(`Tem certeza que deseja excluir o projeto "${project.title}"?\n\nEsta ação não pode ser desfeita.`)) {
        // Remove from projects array
        projects = projects.filter(p => p.id !== projectId);
        
        // Remove related time entries
        timeEntries = timeEntries.filter(entry => entry.projectId !== projectId);
        
        // Remove related tasks
        tasks = tasks.filter(task => task.projectId !== projectId);
        
        // Remove related meetings
        meetings = meetings.filter(meeting => meeting.projectId !== projectId);
        
        // Remove related tickets
        tickets = tickets.filter(ticket => ticket.projectId !== projectId);
        
        closeProjectDetails();
        renderDashboard();
        renderProjects();
        
        showNotification(`Projeto "${project.title}" foi excluído com sucesso!`, 'success');
    }
}

function duplicateProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const newProject = {
        ...project,
        id: ++currentProjectId,
        sigaNumber: `SIT.2025.${String(currentProjectId).padStart(6, '0')}`,
        title: `${project.title} (Cópia)`,
        totalHours: 0,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    
    closeProjectDetails();
    renderDashboard();
    renderProjects();
    
    showNotification(`Projeto duplicado como "${newProject.title}"!`, 'success');
}

// Time Entry Modal for specific project
function openTimeEntryModal(projectId, date = null) {
    // Populate project selector with all projects
    const projectSelect = document.getElementById('timeProjectId');
    projectSelect.innerHTML = '<option value="">Selecione um projeto</option>';
    
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = `${project.sigaNumber} - ${project.title}`;
        projectSelect.appendChild(option);
    });
    
    // Set the selected project if provided
    if (projectId) {
        projectSelect.value = projectId;
    }
    
    document.getElementById('timeDate').value = date || new Date().toISOString().split('T')[0];
    document.getElementById('timeHours').value = '';
    document.getElementById('timeDescription').value = '';
    
    openModal('timeEntry');
}

function editTimeEntry(entryId) {
    const entry = timeEntries.find(e => e.id === entryId);
    if (!entry) return;
    
    document.getElementById('timeProjectId').value = entry.projectId;
    document.getElementById('timeDate').value = entry.date;
    document.getElementById('timeHours').value = entry.hours;
    document.getElementById('timeDescription').value = entry.description;
    
    // Store entry ID for update
    document.getElementById('timeEntryForm').dataset.entryId = entryId;
    
    openModal('timeEntry');
}

function deleteTimeEntry(entryId) {
    const entry = timeEntries.find(e => e.id === entryId);
    if (!entry) return;
    
    if (confirm('Tem certeza que deseja excluir esta entrada de tempo?')) {
        timeEntries = timeEntries.filter(e => e.id !== entryId);
        
        // Update project total hours
        updateProjectTotalHours(entry.projectId);
        
        // Reload time entries in modal
        loadProjectTimeEntries(entry.projectId);
        
        // Update displays
        renderDashboard();
        renderProjects();
        
        showNotification('Entrada de tempo excluída!', 'success');
    }
}

function updateProjectTotalHours(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const projectTimeEntries = timeEntries.filter(entry => entry.projectId === projectId);
    const totalHours = projectTimeEntries.reduce((sum, entry) => sum + parseFloat(entry.hours || 0), 0);
    
    project.totalHours = totalHours;
    project.updatedAt = new Date().toISOString();
}

// Edit Project Form Submission
function submitEditProject(event) {
    event.preventDefault();
    
    const form = event.target;
    const projectId = parseInt(form.dataset.projectId);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        showNotification('Projeto não encontrado!', 'error');
        return;
    }
    
    // Update project data
    project.sigaNumber = document.getElementById('editSigaNumber').value;
    project.title = document.getElementById('editTitle').value;
    project.requester = document.getElementById('editRequester').value;
    project.type = document.getElementById('editType').value;
    project.priority = document.getElementById('editPriority').value;
    project.startDate = document.getElementById('editStartDate').value;
    project.endDate = document.getElementById('editEndDate').value;
    project.isRFP = document.getElementById('editIsRFP').checked;
    project.description = document.getElementById('editDescription').value;
    project.updatedAt = new Date().toISOString();
    
    closeModal('editProject');
    renderDashboard();
    renderProjects();
    
    showNotification(`Projeto "${project.title}" atualizado com sucesso!`, 'success');
    
    // Clear form
    form.reset();
    delete form.dataset.projectId;
}

// Submit Time Entry (updated to handle editing)
function submitTimeEntry(event) {
    event.preventDefault();
    
    const form = event.target;
    const projectId = parseInt(document.getElementById('timeProjectId').value);
    const date = document.getElementById('timeDate').value;
    const hours = parseFloat(document.getElementById('timeHours').value);
    const description = document.getElementById('timeDescription').value;
    
    const entryId = form.dataset.entryId;
    
    if (entryId) {
        // Update existing entry
        const entry = timeEntries.find(e => e.id === parseInt(entryId));
        if (entry) {
            entry.projectId = projectId;
            entry.date = date;
            entry.hours = hours;
            entry.description = description;
            entry.updatedAt = new Date().toISOString();
        }
        delete form.dataset.entryId;
        showNotification('Entrada de tempo atualizada!', 'success');
    } else {
        // Create new entry
        const timeEntry = {
            id: ++currentTimeEntryId,
            projectId: projectId,
            date: date,
            hours: hours,
            description: description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        timeEntries.push(timeEntry);
        showNotification('Tempo registrado com sucesso!', 'success');
    }
    
    // Update project total hours
    updateProjectTotalHours(projectId);
    
    // Update displays
    renderDashboard();
    renderProjects();
    
    // Reload time entries if modal is open
    const timeEntriesList = document.getElementById(`timeEntriesList_${projectId}`);
    if (timeEntriesList) {
        loadProjectTimeEntries(projectId);
    }
    
    closeModal('timeEntry');
    form.reset();
}

// Fix for project selection in time entry
document.addEventListener('DOMContentLoaded', function() {
    // Ensure project selects are populated on page load
    setTimeout(() => {
        populateProjectSelects();
    }, 100);
});

// Enhanced function to open time entry with pre-selected project
function openTimeEntryForProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        showNotification('Projeto não encontrado!', 'error');
        return;
    }
    
    // First populate all projects in the select
    populateProjectSelects();
    
    // Then open the modal with slight delay to ensure population is done
    setTimeout(() => {
        openTimeEntryModal(projectId);
        
        // Double-check the selection after a short delay
        setTimeout(() => {
            const projectSelect = document.getElementById('timeProjectId');
            if (projectSelect && projectSelect.value !== projectId.toString()) {
                projectSelect.value = projectId.toString();
                console.log('Project pre-selected:', projectId, project.title);
            }
        }, 50);
    }, 50);
}

// Enhanced chart functions for improved reports
function renderStatusChart() {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const todoCount = projects.filter(p => p.status === 'todo').length;
    const inProgressCount = projects.filter(p => p.status === 'in_progress').length;
    const completedCount = projects.filter(p => p.status === 'completed').length;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['A Fazer', 'Em Andamento', 'Concluído'],
            datasets: [{
                data: [todoCount, inProgressCount, completedCount],
                backgroundColor: ['#64748b', '#f59e0b', '#10b981'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderTypeChart() {
    const canvas = document.getElementById('typeChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const typeCounts = {
        'Sistemas': projects.filter(p => p.type === 'Sistemas').length,
        'Infra': projects.filter(p => p.type === 'Infra').length,
        'Networking': projects.filter(p => p.type === 'Networking').length,
        'Servidores': projects.filter(p => p.type === 'Servidores').length
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                data: Object.values(typeCounts),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
                borderRadius: 8,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function renderPriorityChart() {
    const canvas = document.getElementById('priorityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const priorityCounts = {
        'Baixa': projects.filter(p => p.priority === 'low').length,
        'Média': projects.filter(p => p.priority === 'medium').length,
        'Alta': projects.filter(p => p.priority === 'high').length,
        'Crítica': projects.filter(p => p.priority === 'critical').length
    };
    
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: Object.keys(priorityCounts),
            datasets: [{
                data: Object.values(priorityCounts),
                backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderTimelineChart() {
    const canvas = document.getElementById('timelineChart');
    if (!canvas) return;
    
    // Calculate hours by project type
    const hoursData = {
        'Sistemas': timeEntries.filter(e => projects.find(p => p.id === e.projectId && p.type === 'Sistemas')).reduce((sum, e) => sum + e.hours, 0),
        'Infra': timeEntries.filter(e => projects.find(p => p.id === e.projectId && p.type === 'Infra')).reduce((sum, e) => sum + e.hours, 0),
        'Networking': timeEntries.filter(e => projects.find(p => p.id === e.projectId && p.type === 'Networking')).reduce((sum, e) => sum + e.hours, 0),
        'Servidores': timeEntries.filter(e => projects.find(p => p.id === e.projectId && p.type === 'Servidores')).reduce((sum, e) => sum + e.hours, 0)
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(hoursData),
            datasets: [{
                data: Object.values(hoursData),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Export dashboard function
function exportDashboardPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Dashboard de Relatórios - Sistema de Projetos', 20, 20);
    
    // Add statistics
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const criticalProjects = projects.filter(p => p.priority === 'critical').length;
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const completionRate = totalProjects > 0 ? (completedProjects / totalProjects * 100).toFixed(1) : 0;
    
    doc.setFontSize(12);
    let yPos = 40;
    
    doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 20, yPos);
    yPos += 20;
    
    doc.setFontSize(14);
    doc.text('INDICADORES PRINCIPAIS:', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(11);
    doc.text(`• Total de Projetos: ${totalProjects}`, 25, yPos);
    yPos += 10;
    doc.text(`• Projetos Concluídos: ${completedProjects} (${completionRate}%)`, 25, yPos);
    yPos += 10;
    doc.text(`• Projetos Críticos: ${criticalProjects}`, 25, yPos);
    yPos += 10;
    doc.text(`• Total de Horas Registradas: ${totalHours}h`, 25, yPos);
    yPos += 20;
    
    // Add project breakdown by type
    doc.setFontSize(14);
    doc.text('DISTRIBUIÇÃO POR TIPO:', 20, yPos);
    yPos += 15;
    
    const tipos = ['Sistemas', 'Infra', 'Networking', 'Servidores'];
    tipos.forEach(tipo => {
        const count = projects.filter(p => p.type === tipo).length;
        const hours = timeEntries.filter(e => projects.find(p => p.id === e.projectId && p.type === tipo)).reduce((sum, e) => sum + e.hours, 0);
        doc.setFontSize(11);
        doc.text(`• ${tipo}: ${count} projetos, ${hours}h`, 25, yPos);
        yPos += 10;
    });
    
    // Save the PDF
    doc.save(`dashboard-relatorios-${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('Dashboard exportado em PDF!', 'success');
}

// Submit new ServiceNow ticket with enhanced functionality
function submitNewTicket(event) {
    event.preventDefault();
    
    const form = event.target;
    const projectId = parseInt(document.getElementById('ticketProject').value);
    const ticketNumber = document.getElementById('ticketNumber').value.trim();
    const title = document.getElementById('ticketTitle').value.trim();
    const description = document.getElementById('ticketDescription').value.trim();
    const priority = document.getElementById('ticketPriority').value;
    const createdDate = document.getElementById('ticketCreatedDate').value;
    
    if (!projectId || !ticketNumber || !title || !description || !createdDate) {
        showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
        return;
    }
    
    // Validate ticket number format
    const ticketNumberRegex = /^(INC|REQ|RITM|CHG|PRB)\d+$/i;
    if (!ticketNumberRegex.test(ticketNumber)) {
        showNotification('Formato de número inválido! Use: INC0012345, REQ0012345, etc.', 'error');
        return;
    }
    
    // Check for duplicate ticket numbers
    const existingTicket = tickets.find(t => t.ticketNumber.toLowerCase() === ticketNumber.toLowerCase());
    if (existingTicket) {
        showNotification('Já existe um chamado com este número!', 'error');
        return;
    }
    
    const ticket = {
        id: ++currentTicketId,
        projectId: projectId,
        ticketNumber: ticketNumber.toUpperCase(),
        title: title,
        description: description,
        priority: priority,
        status: 'open',
        createdDate: new Date(createdDate).toISOString(),
        updatedDate: new Date().toISOString()
    };
    
    tickets.push(ticket);
    
    // Show success notification with ticket details
    showNotification(`Chamado ${ticket.ticketNumber} criado com sucesso!`, 'success');
    
    // Update displays
    renderServiceNow();
    populateProjectSelects();
    
    // Close modal and reset form
    closeModal('newTicket');
    form.reset();
    
    // Set default datetime for next use
    document.getElementById('ticketCreatedDate').value = new Date().toISOString().slice(0, 16);
    
    console.log('New ticket created:', ticket);
}

// Edit ticket function
function editTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    // Populate edit form
    document.getElementById('editTicketId').value = ticket.id;
    document.getElementById('editTicketNumber').value = ticket.ticketNumber;
    document.getElementById('editTicketTitle').value = ticket.title;
    document.getElementById('editTicketDescription').value = ticket.description;
    document.getElementById('editTicketPriority').value = ticket.priority;
    document.getElementById('editTicketStatus').value = ticket.status;
    document.getElementById('editTicketProject').value = ticket.projectId;
    
    openModal('editTicket');
}

// Submit edit ticket form
function submitEditTicket(event) {
    event.preventDefault();
    
    const ticketId = parseInt(document.getElementById('editTicketId').value);
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (ticket) {
        ticket.ticketNumber = document.getElementById('editTicketNumber').value;
        ticket.title = document.getElementById('editTicketTitle').value;
        ticket.description = document.getElementById('editTicketDescription').value;
        ticket.priority = document.getElementById('editTicketPriority').value;
        ticket.status = document.getElementById('editTicketStatus').value;
        ticket.projectId = parseInt(document.getElementById('editTicketProject').value);
        ticket.updatedAt = new Date().toISOString();
        
        renderServiceNow();
        closeModal('editTicket');
        showNotification('Chamado atualizado com sucesso!', 'success');
    }
}

// Close ticket function
function closeTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
        ticket.status = 'closed';
        ticket.closedAt = new Date().toISOString();
        renderServiceNow();
        showNotification('Chamado fechado com sucesso!', 'success');
    }
}

// Delete ticket function
function deleteTicket(ticketId) {
    if (confirm('Tem certeza que deseja excluir este chamado? Esta ação não pode ser desfeita.')) {
        tickets = tickets.filter(t => t.id !== ticketId);
        renderServiceNow();
        showNotification('Chamado excluído com sucesso!', 'success');
    }
}

// Enhanced initialization for ServiceNow modal
document.addEventListener('DOMContentLoaded', function() {
    // Set default datetime when modal opens
    const ticketModal = document.getElementById('newTicketModal');
    if (ticketModal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const isVisible = ticketModal.style.display === 'flex' || ticketModal.classList.contains('show');
                    if (isVisible) {
                        // Set current datetime
                        const now = new Date();
                        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                        document.getElementById('ticketCreatedDate').value = now.toISOString().slice(0, 16);
                        
                        // Populate projects
                        populateProjectSelects();
                        
                        // Focus first field
                        setTimeout(() => {
                            document.getElementById('ticketProject').focus();
                        }, 100);
                    }
                }
            });
        });
        
        observer.observe(ticketModal, { attributes: true });
    }
});

// Enhanced participant management
function addParticipant() {
    const input = document.getElementById('participantInput');
    const name = input.value.trim();
    
    if (!name) {
        showNotification('Digite um nome válido', 'error');
        return;
    }
    
    // Check for duplicates
    const existingParticipants = Array.from(document.querySelectorAll('.tag-item')).map(tag => tag.textContent.replace('×', '').trim());
    if (existingParticipants.includes(name)) {
        showNotification('Este participante já foi adicionado', 'warning');
        input.value = '';
        return;
    }
    
    const participantsList = document.getElementById('participantsList');
    const tagItem = document.createElement('div');
    tagItem.className = 'tag-item';
    tagItem.innerHTML = `
        <span>${name}</span>
        <button type="button" class="tag-remove" onclick="removeParticipant(this)" title="Remover participante">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    participantsList.appendChild(tagItem);
    input.value = '';
    input.focus();
}

function removeParticipant(button) {
    button.closest('.tag-item').remove();
}

// Enhanced responsible management
function addResponsible() {
    const input = document.getElementById('responsibleInput');
    const responsibility = input.value.trim();
    
    if (!responsibility) {
        showNotification('Digite o nome e a responsabilidade', 'error');
        return;
    }
    
    const responsiblesList = document.getElementById('responsiblesList');
    const tagItem = document.createElement('div');
    tagItem.className = 'tag-item';
    tagItem.innerHTML = `
        <span>${responsibility}</span>
        <button type="button" class="tag-remove" onclick="removeResponsible(this)" title="Remover responsável">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    responsiblesList.appendChild(tagItem);
    input.value = '';
    input.focus();
}

function removeResponsible(button) {
    button.closest('.tag-item').remove();
}

// Enhanced meeting form submission
function submitNewMeeting(event) {
    event.preventDefault();
    
    const form = event.target;
    const projectId = document.getElementById('meetingProject').value || null;
    const title = document.getElementById('meetingTitle').value.trim();
    const date = document.getElementById('meetingDate').value;
    const agenda = document.getElementById('meetingAgenda').value.trim();
    const discussions = document.getElementById('meetingDiscussions').value.trim();
    const decisions = document.getElementById('meetingDecisions').value.trim();
    
    // Get participants and responsibles from tags
    const participants = Array.from(document.querySelectorAll('#participantsList .tag-item span')).map(span => span.textContent);
    const responsibles = Array.from(document.querySelectorAll('#responsiblesList .tag-item span')).map(span => span.textContent);
    
    if (!title || !date || !agenda || !discussions || !decisions) {
        showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
        return;
    }
    
    if (participants.length === 0) {
        showNotification('Adicione pelo menos um participante!', 'error');
        return;
    }
    
    const meeting = {
        id: ++currentMeetingId,
        projectId: projectId ? parseInt(projectId) : null,
        title: title,
        date: date,
        participants: participants,
        agenda: agenda,
        discussions: discussions,
        decisions: decisions,
        responsibles: responsibles,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    meetingMinutes.push(meeting);
    
    showNotification(`Ata "${meeting.title}" criada com sucesso!`, 'success');
    
    // Update displays
    renderMeetings();
    populateProjectSelects();
    
    // Close modal and reset form
    closeModal('newMeeting');
    form.reset();
    
    // Clear tags
    document.getElementById('participantsList').innerHTML = '';
    document.getElementById('responsiblesList').innerHTML = '';
    
    // Set default date for next use
    document.getElementById('meetingDate').value = new Date().toISOString().split('T')[0];
    
    console.log('New meeting created:', meeting);
}

// Download project-specific meetings (atas)
function downloadProjectMeetings(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        showNotification('Projeto não encontrado!', 'error');
        return;
    }
    
    const projectMeetings = meetings.filter(meeting => meeting.projectId === projectId);
    
    if (projectMeetings.length === 0) {
        showNotification('Este projeto não possui atas de reunião cadastradas.', 'warning');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Atas de Reunião', 20, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`Projeto: ${project.sigaNumber} - ${project.title}`, 20, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 45);
    
    // Draw line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 50, 190, 50);
    
    let yPosition = 60;
    
    projectMeetings.forEach((meeting, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        
        // Meeting header
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text(`${index + 1}. ${meeting.title}`, 20, yPosition);
        yPosition += 10;
        
        // Meeting info
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Data: ${formatDate(meeting.date)}`, 25, yPosition);
        yPosition += 8;
        
        doc.text(`Participantes: ${meeting.participants.join(', ')}`, 25, yPosition);
        yPosition += 8;
        
        // Agenda
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.text('Pauta:', 25, yPosition);
        yPosition += 6;
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const agendaLines = doc.splitTextToSize(meeting.agenda, 160);
        agendaLines.forEach(line => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, 30, yPosition);
            yPosition += 5;
        });
        yPosition += 5;
        
        // Discussions
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.text('Discussões:', 25, yPosition);
        yPosition += 6;
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const discussionLines = doc.splitTextToSize(meeting.discussions, 160);
        discussionLines.forEach(line => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, 30, yPosition);
            yPosition += 5;
        });
        yPosition += 5;
        
        // Decisions
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.text('Decisões:', 25, yPosition);
        yPosition += 6;
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const decisionLines = doc.splitTextToSize(meeting.decisions, 160);
        decisionLines.forEach(line => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, 30, yPosition);
            yPosition += 5;
        });
        yPosition += 5;
        
        // Responsibles
        if (meeting.responsibles && meeting.responsibles.length > 0) {
            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            doc.text('Responsabilidades:', 25, yPosition);
            yPosition += 6;
            
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            meeting.responsibles.forEach(responsible => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(`• ${responsible}`, 30, yPosition);
                yPosition += 5;
            });
        }
        
        yPosition += 10;
        
        // Separator line
        if (index < projectMeetings.length - 1) {
            doc.setDrawColor(220, 220, 220);
            doc.line(20, yPosition, 190, yPosition);
            yPosition += 15;
        }
    });
    
    const fileName = `atas-${project.sigaNumber.replace(/\./g, '_')}.pdf`;
    doc.save(fileName);
    showNotification(`Atas do projeto baixadas: ${fileName}`, 'success');
}

// Download project-specific schedule (cronograma)
function downloadProjectSchedule(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        showNotification('Projeto não encontrado!', 'error');
        return;
    }
    
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    
    if (projectTasks.length === 0) {
        showNotification('Este projeto não possui tarefas cadastradas no cronograma.', 'warning');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Cronograma do Projeto', 20, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`${project.sigaNumber} - ${project.title}`, 20, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 45);
    doc.text(`Total de tarefas: ${projectTasks.length}`, 20, 52);
    
    // Draw line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 58, 190, 58);
    
    // Table header
    let yPosition = 70;
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition - 5, 170, 10, 'F');
    
    doc.text('Tarefa', 25, yPosition);
    doc.text('Responsável', 80, yPosition);
    doc.text('Início', 125, yPosition);
    doc.text('Fim', 150, yPosition);
    doc.text('Status', 170, yPosition);
    
    yPosition += 15;
    
    projectTasks.forEach((task, index) => {
        // Check if we need a new page
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
            
            // Redraw header
            doc.setFillColor(240, 240, 240);
            doc.rect(20, yPosition - 5, 170, 10, 'F');
            doc.setTextColor(40, 40, 40);
            doc.text('Tarefa', 25, yPosition);
            doc.text('Responsável', 80, yPosition);
            doc.text('Início', 125, yPosition);
            doc.text('Fim', 150, yPosition);
            doc.text('Status', 170, yPosition);
            yPosition += 15;
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
            doc.setFillColor(250, 250, 250);
            doc.rect(20, yPosition - 8, 170, 12, 'F');
        }
        
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(9);
        
        // Task name (truncate if too long)
        const taskName = task.title.length > 20 ? task.title.substring(0, 17) + '...' : task.title;
        doc.text(taskName, 25, yPosition);
        
        // Responsible (truncate if too long)
        const responsible = task.assignedTo.length > 15 ? task.assignedTo.substring(0, 12) + '...' : task.assignedTo;
        doc.text(responsible, 80, yPosition);
        
        // Dates
        doc.text(formatDate(task.startDate), 125, yPosition);
        doc.text(formatDate(task.endDate), 150, yPosition);
        
        // Status with color
        const statusText = task.status === 'pending' ? 'Pendente' : 
                          task.status === 'in_progress' ? 'Andamento' : 'Concluída';
        
        if (task.status === 'completed') {
            doc.setTextColor(34, 197, 94); // Green
        } else if (task.status === 'in_progress') {
            doc.setTextColor(245, 158, 11); // Orange
        } else {
            doc.setTextColor(107, 114, 128); // Gray
        }
        
        doc.text(statusText, 170, yPosition);
        doc.setTextColor(60, 60, 60); // Reset color
        
        yPosition += 12;
    });
    
    const fileName = `cronograma-${project.sigaNumber.replace(/\./g, '_')}.pdf`;
    doc.save(fileName);
    showNotification(`Cronograma do projeto baixado: ${fileName}`, 'success');
}

// Download complete project report
function downloadProjectReport(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        showNotification('Projeto não encontrado!', 'error');
        return;
    }
    
    const projectMeetings = meetings.filter(meeting => meeting.projectId === projectId);
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const projectTimeEntries = timeEntries.filter(entry => entry.projectId === projectId);
    const projectTickets = tickets.filter(ticket => ticket.projectId === projectId);
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(40, 40, 40);
    doc.text('Relatório Completo do Projeto', 20, 25);
    
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text(`${project.sigaNumber} - ${project.title}`, 20, 40);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 50);
    
    // Draw line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 55, 190, 55);
    
    let yPosition = 70;
    
    // Project Information
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Informações do Projeto', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Solicitante: ${project.requester}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Tipo: ${project.type}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Prioridade: ${priorityLabels[project.priority]}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Status: ${statusLabels[project.status]}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Data de Início: ${formatDate(project.startDate)}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Data de Fim: ${formatDate(project.endDate)}`, 25, yPosition);
    yPosition += 8;
    doc.text(`RFP: ${project.isRFP ? 'Sim' : 'Não'}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Total de Horas: ${projectTimeEntries.reduce((sum, entry) => sum + entry.hours, 0)}h`, 25, yPosition);
    yPosition += 15;
    
    // Statistics
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Estatísticas', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Atas de Reunião: ${projectMeetings.length}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Tarefas: ${projectTasks.length}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Chamados ServiceNow: ${projectTickets.length}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Registros de Horas: ${projectTimeEntries.length}`, 25, yPosition);
    yPosition += 15;
    
    // Description
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Descrição', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const descriptionLines = doc.splitTextToSize(project.description, 170);
    descriptionLines.forEach(line => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(line, 25, yPosition);
        yPosition += 5;
    });
    
    const fileName = `relatorio-${project.sigaNumber.replace(/\./g, '_')}.pdf`;
    doc.save(fileName);
    showNotification(`Relatório completo do projeto baixado: ${fileName}`, 'success');
}

// Toggle meeting expansion for detailed view
function toggleMeetingExpansion(meetingId) {
    const expandedContent = document.getElementById(`expanded-${meetingId}`);
    const expandBtn = expandedContent.previousElementSibling.querySelector('.expand-btn');
    const expandText = expandBtn.querySelector('.expand-text');
    const expandIcon = expandBtn.querySelector('i');
    
    if (expandedContent.style.display === 'none') {
        expandedContent.style.display = 'block';
        expandText.textContent = 'Ocultar Detalhes';
        expandIcon.className = 'fas fa-chevron-up';
        expandBtn.classList.add('expanded');
    } else {
        expandedContent.style.display = 'none';
        expandText.textContent = 'Ver Detalhes Completos';
        expandIcon.className = 'fas fa-chevron-down';
        expandBtn.classList.remove('expanded');
    }
}

// Download individual meeting as PDF
function downloadMeetingPDF(meetingId) {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) {
        showNotification('Ata não encontrada!', 'error');
        return;
    }
    
    const project = meeting.projectId ? projects.find(p => p.id === meeting.projectId) : null;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Ata de Reunião', 20, 25);
    
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text(meeting.title, 20, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data: ${formatDate(meeting.date)}`, 20, 45);
    if (project) {
        doc.text(`Projeto: ${project.sigaNumber} - ${project.title}`, 20, 52);
    }
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 59);
    
    // Draw line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 65, 190, 65);
    
    let yPosition = 75;
    
    // Participants
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Participantes', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    meeting.participants.forEach(participant => {
        doc.text(`• ${participant}`, 25, yPosition);
        yPosition += 6;
    });
    yPosition += 10;
    
    // Agenda
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Pauta', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const agendaLines = doc.splitTextToSize(meeting.agenda, 170);
    agendaLines.forEach(line => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(line, 25, yPosition);
        yPosition += 5;
    });
    yPosition += 10;
    
    // Discussions
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Discussões', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const discussionLines = doc.splitTextToSize(meeting.discussions, 170);
    discussionLines.forEach(line => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(line, 25, yPosition);
        yPosition += 5;
    });
    yPosition += 10;
    
    // Decisions
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Decisões', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const decisionLines = doc.splitTextToSize(meeting.decisions, 170);
    decisionLines.forEach(line => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(line, 25, yPosition);
        yPosition += 5;
    });
    
    // Responsibles
    if (meeting.responsibles && meeting.responsibles.length > 0) {
        yPosition += 10;
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text('Responsabilidades', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        meeting.responsibles.forEach(responsible => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(`• ${responsible}`, 25, yPosition);
            yPosition += 6;
        });
    }
    
    const fileName = `ata-${meeting.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(fileName);
    showNotification(`Ata baixada: ${fileName}`, 'success');
}

// Show download modal for project
function showDownloadModal(project) {
    const modalHTML = `
        <div id="downloadModal" class="modal modern-modal" style="display: flex;">
            <div class="modal-content download-modal">
                <div class="modal-header download-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <i class="fas fa-download"></i>
                        </div>
                        <div class="header-text">
                            <h2>Downloads do Projeto</h2>
                            <p>${project.sigaNumber} - ${project.title}</p>
                        </div>
                    </div>
                    <button class="close-btn modern-close" onclick="closeDownloadModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="download-options">
                    <div class="download-option" onclick="downloadProjectMeetings(${project.id}); closeDownloadModal();">
                        <div class="option-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="option-content">
                            <h3>Atas de Reunião</h3>
                            <p>Baixar todas as atas de reunião deste projeto em PDF</p>
                            <span class="option-count">${meetings.filter(m => m.projectId === project.id).length} atas</span>
                        </div>
                        <div class="option-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    
                    <div class="download-option" onclick="downloadProjectSchedule(${project.id}); closeDownloadModal();">
                        <div class="option-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <div class="option-content">
                            <h3>Cronograma do Projeto</h3>
                            <p>Baixar o cronograma completo com todas as tarefas em PDF</p>
                            <span class="option-count">${tasks.filter(t => t.projectId === project.id).length} tarefas</span>
                        </div>
                        <div class="option-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    
                    <div class="download-option" onclick="downloadProjectReport(${project.id}); closeDownloadModal();">
                        <div class="option-icon">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <div class="option-content">
                            <h3>Relatório Completo</h3>
                            <p>Baixar relatório completo com informações, estatísticas e resumo</p>
                            <span class="option-count">Relatório executivo</span>
                        </div>
                        <div class="option-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('downloadModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Close modal when clicking outside
    const modal = document.getElementById('downloadModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDownloadModal();
        }
    });
}

// Close download modal
function closeDownloadModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.remove();
    }
}

// Enhanced initialization for Meeting modal
document.addEventListener('DOMContentLoaded', function() {
    // Set default date when modal opens
    const meetingModal = document.getElementById('newMeetingModal');
    if (meetingModal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const isVisible = meetingModal.style.display === 'flex' || meetingModal.classList.contains('show');
                    if (isVisible) {
                        // Set current date
                        document.getElementById('meetingDate').value = new Date().toISOString().split('T')[0];
                        
                        // Populate projects
                        populateProjectSelects();
                        
                        // Focus first field
                        setTimeout(() => {
                            document.getElementById('meetingProject').focus();
                        }, 100);
                        
                        // Clear any existing tags
                        document.getElementById('participantsList').innerHTML = '';
                        document.getElementById('responsiblesList').innerHTML = '';
                    }
                }
            });
        });
        
        observer.observe(meetingModal, { attributes: true });
    }
    
    // Add Enter key support for participant and responsible inputs
    document.getElementById('participantInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addParticipant();
        }
    });
    
    document.getElementById('responsibleInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addResponsible();
        }
    });
});

// Archive system for project-related items
let archivedMeetingMinutes = [];
let archivedTasks = [];

// Archive meeting minutes and tasks when project is completed
function archiveProjectRelatedItems(projectId) {
    // Archive meeting minutes related to this project
    const projectMeetings = meetings.filter(meeting => meeting.projectId === projectId);
    projectMeetings.forEach(meeting => {
        if (!archivedMeetingMinutes.find(am => am.id === meeting.id)) {
            meeting.archivedAt = new Date().toISOString();
            archivedMeetingMinutes.push({...meeting});
        }
    });
    
    // Remove meetings from active list
    meetings = meetings.filter(meeting => meeting.projectId !== projectId);
    
    // Archive tasks (cronograma) related to this project
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    projectTasks.forEach(task => {
        if (!archivedTasks.find(at => at.id === task.id)) {
            task.archivedAt = new Date().toISOString();
            archivedTasks.push({...task});
        }
    });
    
    // Remove tasks from active list
    tasks = tasks.filter(task => task.projectId !== projectId);
    
    console.log(`Archived ${projectMeetings.length} meeting minutes and ${projectTasks.length} tasks for project ${projectId}`);
    
    // Also log the current state
    console.log('Current meetings:', meetings.length);
    console.log('Current tasks:', tasks.length);
    console.log('Archived meetings:', archivedMeetingMinutes.length);
    console.log('Archived tasks:', archivedTasks.length);
}

// Get archived meeting minutes for a project
function getArchivedMeetingMinutes(projectId) {
    return archivedMeetingMinutes.filter(meeting => meeting.projectId === projectId);
}

// Get archived tasks for a project
function getArchivedTasks(projectId) {
    return archivedTasks.filter(task => task.projectId === projectId);
}

// Enhanced archived project card to show related items
function createArchivedProjectCard(project) {
    const period = getCompletionPeriod(project);
    const duration = calculateProjectDuration(project.startDate, project.completedAt);
    
    // Count archived items
    const archivedMeetings = getArchivedMeetingMinutes(project.id);
    const archivedProjectTasks = getArchivedTasks(project.id);
    
    return `
        <div class="archived-project-card">
            <div class="archived-project-header">
                <div class="archived-project-info">
                    <h3>${project.sigaNumber} - ${project.title}</h3>
                    <div class="archived-project-meta">
                        <span class="archived-date">
                            <i class="fas fa-calendar-check"></i>
                            Concluído em ${period.monthYear}
                        </span>
                        <span class="archived-duration">
                            <i class="fas fa-clock"></i>
                            ${duration}
                        </span>
                    </div>
                </div>
                <div class="archived-project-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewArchivedProjectDetails(${project.id})">
                        <i class="fas fa-eye"></i>
                        Ver Detalhes
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="restoreProject(${project.id})">
                        <i class="fas fa-undo"></i>
                        Restaurar
                    </button>
                </div>
            </div>
            
            <div class="archived-project-stats">
                <div class="stat-item">
                    <i class="fas fa-user"></i>
                    <span>${project.requester}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-layer-group"></i>
                    <span>${project.type}</span>
                </div>
                <div class="stat-item priority-${project.priority}">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${getPriorityLabel(project.priority)}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <span>${project.totalHours || 0}h</span>
                </div>
            </div>
            
            <div class="archived-items-summary">
                <div class="archived-item-count">
                    <i class="fas fa-users"></i>
                    <span>${archivedMeetings.length} Atas de Reunião</span>
                </div>
                <div class="archived-item-count">
                    <i class="fas fa-tasks"></i>
                    <span>${archivedProjectTasks.length} Tarefas do Cronograma</span>
                </div>
            </div>
        </div>
    `;
}

// View archived project details with related items
function viewArchivedProjectDetails(projectId) {
    const project = archivedProjects.find(p => p.id === projectId);
    if (!project) return;
    
    const archivedMeetings = getArchivedMeetingMinutes(projectId);
    const archivedProjectTasks = getArchivedTasks(projectId);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'archivedProjectModal';
    
    modal.innerHTML = `
        <div class="modal-content archived-project-modal">
            <div class="modal-header">
                <h2>
                    <i class="fas fa-archive"></i>
                    Projeto Arquivado - ${project.sigaNumber}
                </h2>
                <button class="close-btn" onclick="closeArchivedProjectModal()">&times;</button>
            </div>
            
            <div class="archived-project-details">
                <div class="project-info-section">
                    <h3>Informações do Projeto</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Título:</label>
                            <span>${project.title}</span>
                        </div>
                        <div class="info-item">
                            <label>Solicitante:</label>
                            <span>${project.requester}</span>
                        </div>
                        <div class="info-item">
                            <label>Tipo:</label>
                            <span>${project.type}</span>
                        </div>
                        <div class="info-item">
                            <label>Prioridade:</label>
                            <span class="priority-${project.priority}">${getPriorityLabel(project.priority)}</span>
                        </div>
                        <div class="info-item">
                            <label>Período:</label>
                            <span>${formatDate(project.startDate)} - ${formatDate(project.completedAt)}</span>
                        </div>
                        <div class="info-item">
                            <label>Horas Totais:</label>
                            <span>${project.totalHours || 0}h</span>
                        </div>
                    </div>
                </div>
                
                <div class="archived-items-section">
                    <h3>Atas de Reunião Arquivadas (${archivedMeetings.length})</h3>
                    <div class="archived-meetings-list">
                        ${archivedMeetings.length > 0 ? archivedMeetings.map(meeting => `
                            <div class="archived-item">
                                <div class="item-header">
                                    <h4>${meeting.title}</h4>
                                    <span class="item-date">${formatDate(meeting.date)}</span>
                                </div>
                                <div class="item-content">
                                    <p><strong>Participantes:</strong> ${meeting.participants.join(', ')}</p>
                                    <p><strong>Decisões:</strong> ${meeting.decisions.substring(0, 100)}...</p>
                                </div>
                            </div>
                        `).join('') : '<p class="no-items">Nenhuma ata de reunião arquivada</p>'}
                    </div>
                </div>
                
                <div class="archived-items-section">
                    <h3>Cronograma Arquivado (${archivedProjectTasks.length})</h3>
                    <div class="archived-tasks-list">
                        ${archivedProjectTasks.length > 0 ? archivedProjectTasks.map(task => `
                            <div class="archived-item">
                                <div class="item-header">
                                    <h4>${task.title}</h4>
                                    <span class="task-status status-${task.status}">${getTaskStatusLabel(task.status)}</span>
                                </div>
                                <div class="item-content">
                                    <p><strong>Responsável:</strong> ${task.assigned}</p>
                                    <p><strong>Período:</strong> ${formatDate(task.startDate)} - ${formatDate(task.endDate)}</p>
                                    <p><strong>Descrição:</strong> ${task.description.substring(0, 100)}...</p>
                                </div>
                            </div>
                        `).join('') : '<p class="no-items">Nenhuma tarefa do cronograma arquivada</p>'}
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeArchivedProjectModal()">
                    <i class="fas fa-times"></i>
                    Fechar
                </button>
                <button class="btn btn-primary" onclick="exportArchivedProjectPDF(${projectId})">
                    <i class="fas fa-file-pdf"></i>
                    Exportar PDF
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

// Close archived project modal
function closeArchivedProjectModal() {
    const modal = document.getElementById('archivedProjectModal');
    if (modal) {
        modal.remove();
    }
}

// Export archived project with related items as PDF
function exportArchivedProjectPDF(projectId) {
    const project = archivedProjects.find(p => p.id === projectId);
    if (!project) return;
    
    const archivedMeetings = getArchivedMeetingMinutes(projectId);
    const archivedProjectTasks = getArchivedTasks(projectId);
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text(`Projeto Arquivado: ${project.sigaNumber}`, 20, 20);
    
    // Project info
    doc.setFontSize(12);
    let yPos = 40;
    
    doc.text(`Título: ${project.title}`, 20, yPos);
    yPos += 10;
    doc.text(`Solicitante: ${project.requester}`, 20, yPos);
    yPos += 10;
    doc.text(`Tipo: ${project.type}`, 20, yPos);
    yPos += 10;
    doc.text(`Prioridade: ${getPriorityLabel(project.priority)}`, 20, yPos);
    yPos += 10;
    doc.text(`Período: ${formatDate(project.startDate)} - ${formatDate(project.completedAt)}`, 20, yPos);
    yPos += 10;
    doc.text(`Horas Totais: ${project.totalHours || 0}h`, 20, yPos);
    yPos += 20;
    
    // Archived meetings
    if (archivedMeetings.length > 0) {
        doc.setFontSize(16);
        doc.text('Atas de Reunião Arquivadas:', 20, yPos);
        yPos += 15;
        
        doc.setFontSize(10);
        archivedMeetings.forEach(meeting => {
            doc.text(`• ${meeting.title} (${formatDate(meeting.date)})`, 25, yPos);
            yPos += 8;
            doc.text(`  Participantes: ${meeting.participants.join(', ')}`, 25, yPos);
            yPos += 8;
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
        });
        yPos += 10;
    }
    
    // Archived tasks
    if (archivedProjectTasks.length > 0) {
        doc.setFontSize(16);
        doc.text('Cronograma Arquivado:', 20, yPos);
        yPos += 15;
        
        doc.setFontSize(10);
        archivedProjectTasks.forEach(task => {
            doc.text(`• ${task.title} - ${getTaskStatusLabel(task.status)}`, 25, yPos);
            yPos += 8;
            doc.text(`  Responsável: ${task.assigned}`, 25, yPos);
            yPos += 8;
            doc.text(`  Período: ${formatDate(task.startDate)} - ${formatDate(task.endDate)}`, 25, yPos);
            yPos += 8;
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
        });
    }
    
    doc.save(`projeto-arquivado-${project.sigaNumber}-${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('Relatório do projeto arquivado exportado!', 'success');
}

// Helper function to get priority label
function getPriorityLabel(priority) {
    const labels = {
        'low': 'Baixa',
        'medium': 'Média', 
        'high': 'Alta',
        'critical': 'Crítica'
    };
    return labels[priority] || priority;
}

// Enhanced archived project card function that actually works
function createArchivedProjectCardHTML(project) {
    const period = getCompletionPeriod(project);
    const duration = calculateProjectDuration(project.startDate, project.completedAt);
    
    // Count archived items
    const archivedMeetings = getArchivedMeetingMinutes(project.id);
    const archivedProjectTasks = getArchivedTasks(project.id);
    
    return `
        <div class="archived-project-card">
            <div class="archived-project-header">
                <div class="archived-project-info">
                    <h3>${project.sigaNumber} - ${project.title}</h3>
                    <div class="archived-project-meta">
                        <span class="archived-date">
                            <i class="fas fa-calendar-check"></i>
                            Concluído em ${period.monthYear}
                        </span>
                        <span class="archived-duration">
                            <i class="fas fa-clock"></i>
                            ${duration}
                        </span>
                    </div>
                </div>
                <div class="archived-project-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewArchivedProjectDetails(${project.id})">
                        <i class="fas fa-eye"></i>
                        Ver Detalhes
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="restoreProject(${project.id})">
                        <i class="fas fa-undo"></i>
                        Restaurar
                    </button>
                </div>
            </div>
            
            <div class="archived-project-stats">
                <div class="stat-item">
                    <i class="fas fa-user"></i>
                    <span>${project.requester}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-layer-group"></i>
                    <span>${project.type}</span>
                </div>
                <div class="stat-item priority-${project.priority}">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${getPriorityLabel(project.priority)}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <span>${project.totalHours || 0}h</span>
                </div>
            </div>
            
            <div class="archived-items-summary">
                <div class="archived-item-count">
                    <i class="fas fa-users"></i>
                    <span>${archivedMeetings.length} Atas de Reunião</span>
                </div>
                <div class="archived-item-count">
                    <i class="fas fa-tasks"></i>
                    <span>${archivedProjectTasks.length} Tarefas do Cronograma</span>
                </div>
            </div>
        </div>
    `;
}

// Calculate project duration helper
function calculateProjectDuration(startDate, endDate) {
    if (!startDate || !endDate) return 'N/A';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
        return `${diffDays} dias`;
    } else if (diffDays < 365) {
        const months = Math.round(diffDays / 30);
        return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
        const years = Math.floor(diffDays / 365);
        const remainingMonths = Math.round((diffDays % 365) / 30);
        return `${years} ${years === 1 ? 'ano' : 'anos'}${remainingMonths > 0 ? ` e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}` : ''}`;
    }
}

// Test archived system
function testArchivedSystem() {
    console.log('Testing archived system...');
    console.log('Current projects:', projects.length);
    console.log('Archived projects:', archivedProjects.length);
    
    // Manually add a test archived project for debugging
    if (archivedProjects.length === 0) {
        const testProject = {
            id: 999,
            sigaNumber: 'TEST.2025.000001',
            title: 'Teste de Projeto Arquivado',
            requester: 'Sistema de Teste',
            type: 'Sistemas',
            priority: 'medium',
            status: 'completed',
            startDate: '2025-01-01',
            endDate: '2025-01-15',
            completedAt: new Date().toISOString(),
            description: 'Projeto de teste para validar o sistema de arquivamento',
            isRFP: false,
            totalHours: 20,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        archivedProjects.push(testProject);
        console.log('Added test archived project');
    }
    
    renderArchivedProjects();
}

// Chart Customization System
let chartInstances = {};
let chartSettings = {
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
    const saved = localStorage.getItem('chartSettings');
    if (saved) {
        chartSettings = { ...chartSettings, ...JSON.parse(saved) };
    }
}

// Save chart settings to localStorage
function saveChartSettings() {
    localStorage.setItem('chartSettings', JSON.stringify(chartSettings));
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
                        ${Object.entries(chartSettings.colorSchemes).map(([key, colors]) => `
                            <div class="color-scheme ${key === chartSettings.currentScheme ? 'selected' : ''}" 
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
                                   ${chartSettings.animations.enabled ? 'checked' : ''}
                                   onchange="toggleAnimations(this.checked)">
                            <label for="enableAnimations">Ativar Animações</label>
                        </div>
                        <div class="animation-option">
                            <label for="animationDuration">Duração (ms):</label>
                            <input type="range" id="animationDuration" min="500" max="3000" step="100"
                                   value="${chartSettings.animations.duration}"
                                   onchange="updateAnimationDuration(this.value)">
                            <span id="durationValue">${chartSettings.animations.duration}ms</span>
                        </div>
                    </div>
                </div>
                
                <div class="customizer-section">
                    <h4><i class="fas fa-chart-bar"></i> Tipos de Gráfico Padrão</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Projetos por Tipo:</label>
                            <select id="defaultTypeChart" class="form-control">
                                <option value="bar">Barras</option>
                                <option value="doughnut">Rosca</option>
                                <option value="pie">Pizza</option>
                                <option value="polarArea">Área Polar</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Projetos por Prioridade:</label>
                            <select id="defaultPriorityChart" class="form-control">
                                <option value="polarArea">Área Polar</option>
                                <option value="doughnut">Rosca</option>
                                <option value="pie">Pizza</option>
                                <option value="bar">Barras</option>
                            </select>
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
    grid.querySelectorAll('.color-scheme').forEach(el => el.classList.remove('selected'));
    grid.querySelector(`[data-scheme="${scheme}"]`).classList.add('selected');
    chartSettings.currentScheme = scheme;
}

// Toggle animations
function toggleAnimations(enabled) {
    chartSettings.animations.enabled = enabled;
}

// Update animation duration
function updateAnimationDuration(duration) {
    chartSettings.animations.duration = parseInt(duration);
    document.getElementById('durationValue').textContent = duration + 'ms';
}

// Apply chart settings
function applyChartSettings() {
    saveChartSettings();
    
    // Update all charts with new settings
    updateTypeChart();
    updatePriorityChart();
    updateStatusChart();
    updateHoursChart();
    
    // Close modal
    document.querySelector('.chart-customizer-modal').closest('.modal').remove();
    
    showNotification('Configurações dos gráficos aplicadas com sucesso!', 'success');
}

// Reset chart settings
function resetChartSettings() {
    chartSettings = {
        colorSchemes: chartSettings.colorSchemes,
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
    if (chartInstances.typeChart) {
        chartInstances.typeChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const chartType = document.getElementById('typeChartType')?.value || 'bar';
    
    // Get type counts from all project types
    const typeCounts = {};
    projectTypes.forEach(type => {
        typeCounts[type.name] = projects.filter(p => p.type === type.id || p.type === type.name).length;
    });
    
    const colors = chartSettings.colorSchemes[chartSettings.currentScheme];
    
    chartInstances.typeChart = new Chart(ctx, {
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
                duration: chartSettings.animations.enabled ? chartSettings.animations.duration : 0,
                easing: chartSettings.animations.easing
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
    
    if (chartInstances.priorityChart) {
        chartInstances.priorityChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const chartType = document.getElementById('priorityChartType')?.value || 'polarArea';
    
    const priorityCounts = {
        'Baixa': projects.filter(p => p.priority === 'low').length,
        'Média': projects.filter(p => p.priority === 'medium').length,
        'Alta': projects.filter(p => p.priority === 'high').length,
        'Crítica': projects.filter(p => p.priority === 'critical').length
    };
    
    const colors = chartSettings.colorSchemes[chartSettings.currentScheme];
    
    chartInstances.priorityChart = new Chart(ctx, {
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
                duration: chartSettings.animations.enabled ? chartSettings.animations.duration : 0,
                easing: chartSettings.animations.easing
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
    
    if (chartInstances.statusChart) {
        chartInstances.statusChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const chartType = document.getElementById('statusChartType')?.value || 'doughnut';
    
    const statusCounts = {
        'A Fazer': projects.filter(p => p.status === 'todo').length,
        'Em Andamento': projects.filter(p => p.status === 'in_progress').length,
        'Concluído': projects.filter(p => p.status === 'completed').length
    };
    
    const colors = chartSettings.colorSchemes[chartSettings.currentScheme].slice(0, 3);
    
    chartInstances.statusChart = new Chart(ctx, {
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
                duration: chartSettings.animations.enabled ? chartSettings.animations.duration : 0,
                easing: chartSettings.animations.easing
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
    
    if (chartInstances.hoursChart) {
        chartInstances.hoursChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const chartType = document.getElementById('hoursChartType')?.value || 'bar';
    
    // Get hours by project type
    const hoursData = {};
    projectTypes.forEach(type => {
        const typeProjects = projects.filter(p => p.type === type.id || p.type === type.name);
        hoursData[type.name] = typeProjects.reduce((sum, p) => sum + (p.totalHours || 0), 0);
    });
    
    const colors = chartSettings.colorSchemes[chartSettings.currentScheme];
    
    chartInstances.hoursChart = new Chart(ctx, {
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
                duration: chartSettings.animations.enabled ? chartSettings.animations.duration : 0,
                easing: chartSettings.animations.easing
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

// Initialize system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    loadChartSettings();
    loadSampleData();
    initializeNavigation();
    initializeModalHandlers();
    initializeFormHandlers();
    initializeDragAndDrop();
    renderDashboard();
    populateProjectSelects();
    
    // Apply chart settings when reports page is shown
    const reportsNav = document.querySelector('nav li[onclick="showPage(\'reports\')"]');
    if (reportsNav) {
        const originalClick = reportsNav.onclick;
        reportsNav.onclick = function() {
            originalClick.call(this);
            setTimeout(() => {
                updateTypeChart();
                updatePriorityChart();
                updateStatusChart();
                updateHoursChart();
            }, 100);
        };
    }
});
