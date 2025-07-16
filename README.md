# Sistema de Gerenciamento de Projetos - Versão HTML/CSS/JS

Esta é uma versão simplificada do sistema de gerenciamento de projetos que funciona **diretamente no navegador** sem precisar instalar nada.

## 🚀 Como usar

### Método 1: Abrir diretamente
1. Baixe a pasta `static`
2. Abra o arquivo `index.html` no seu navegador
3. Pronto! O sistema está funcionando

### Método 2: Servidor local simples
Se quiser rodar em um servidor local:
```bash
# Python 3
python -m http.server 8000

# Node.js (se tiver instalado)
npx serve .

# Depois acesse: http://localhost:8000
```

## 🎯 Funcionalidades Disponíveis

### ✅ Funcionando Completamente
- **Dashboard com Kanban**: Visualização dos projetos por status com drag-and-drop
- **Gestão de projetos**: Criação, edição e visualização completa
- **Cronograma Gantt**: Criação e gerenciamento de tarefas com filtros
- **Atas de reunião**: Sistema completo com templates e busca
- **ServiceNow**: Chamados abertos organizados por projeto
- **Relatórios**: Gráficos interativos e exportação PDF
- **Importação de planilhas**: CSV com template de exemplo
- **Filtros e busca**: Por tipo, prioridade e texto em todas as páginas
- **Estatísticas**: Contadores em tempo real
- **Interface responsiva**: Funciona perfeitamente em desktop e mobile

### 📋 Campos dos Projetos
- Número SIGA
- Título
- Solicitante
- Tipo (Sistemas, Infra, Networking, Servidores)
- Criticidade (Baixa, Média, Alta, Crítica)
- Data de início e fim
- Descrição
- Checkbox "É um RFP?"

### 📊 Dados de Exemplo
O sistema já vem com 4 projetos de exemplo para demonstração:
- Migração de Sistema Legacy (Em Andamento)
- Implementação de Firewall (A Fazer)
- Upgrade de Servidores (Concluído)
- Atualização de Infraestrutura (A Fazer)

## 📝 Formato da Planilha para Importação

Para importar projetos via CSV, use este formato:

```csv
Numero SIGA,Titulo,Solicitante,Tipo,Prioridade,Data Inicio,Data Fim,Descricao,E RFP
SIT.2025.000001,Exemplo de Projeto,João Silva,Sistemas,medium,2025-01-15,2025-02-15,Descrição do projeto,false
```

**Tipos disponíveis**: Sistemas, Infra, Networking, Servidores  
**Prioridades**: low, medium, high, critical  

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com grid e flexbox
- **JavaScript ES6+**: Funcionalidades interativas
- **Font Awesome**: Ícones
- **Armazenamento local**: Dados salvos no navegador

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (versões recentes)
- ✅ Dispositivos móveis (iOS, Android)
- ✅ Tablets
- ✅ Funciona offline após primeiro carregamento

## 🔒 Limitações

- **Dados temporários**: Perdidos ao fechar o navegador
- **Usuário único**: Não há sistema de login
- **Sem sincronização**: Dados não são compartilhados entre dispositivos
- **Funcionalidades básicas**: Versão simplificada do sistema completo

## 🌟 Vantagens

- **Zero instalação**: Funciona imediatamente
- **Leve**: Carrega rapidamente
- **Portátil**: Funciona em qualquer dispositivo
- **Demonstração**: Perfeito para mostrar o sistema

## 📞 Próximos Passos

Para uma versão completa com:
- Banco de dados persistente
- Sistema de login
- Sincronização em tempo real
- Relatórios avançados
- API completa

Use a versão completa React/Node.js disponível no repositório principal.

---

**Desenvolvido para demonstração do Sistema de Gerenciamento de Projetos**