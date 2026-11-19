
/**
 * Multi-Species RNA-seq Analyzer Dashboard Logic
 */

// Global state variables
let gGenes = [];
let gIsReplicateMode = false;
let gSelectedGene = null;
let gActiveTab = 'upload-tab';
let gPathwayList = [];
let gCurrentSortKey = null;
let gCurrentSortOrder = 'none'; // 'none', 'asc', 'desc'
let gSessions = [];
let gActiveSessionId = null;
let gCurrentSelectedGOTerm = null;
let gCurrentSelectedGOGenes = [];
let gCurrentSpecies = 'sce'; // 'sce' (S. cerevisiae) or 'cgl' (C. glutamicum)
let gSelectedTfId = null;

// Base API URL (can be blank since we are hosting static files on same port)
const API_URL = "";

function safeAddListener(elementId, event, handler) {
    const el = document.getElementById(elementId);
    if (el) {
        el.addEventListener(event, handler);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const runInit = (name, fn) => {
        try {
            fn();
        } catch (e) {
            console.error(`[Init Error] Failed to execute ${name}:`, e);
        }
    };
    
    runInit("initSpeciesSelect", initSpeciesSelect);
    runInit("initTabs", initTabs);
    runInit("initDropzone", initDropzone);
    runInit("initControls", initControls);
    runInit("initSessions", initSessions);
    runInit("initAdvancedAnalysisBindings", initAdvancedAnalysisBindings);
    runInit("initGSHZoomPan", initGSHZoomPan);
    runInit("initGSHEditorBindings", initGSHEditorBindings);
    runInit("initIPTargetDiscoveryBindings", initIPTargetDiscoveryBindings);
    runInit("initPCAEvents", initPCAEvents);
    
    runInit("loadMockBtn", () => {
        const mockBtn = document.getElementById("load-mock-btn");
        if (mockBtn) {
            mockBtn.addEventListener("click", () => {
                gCurrentSpecies = "sce";
                const select = document.getElementById("species-select");
                if (select) select.value = "sce";
                updateSpeciesTitle("sce");
                loadMockData();
            });
        }
        const mockCoryneBtn = document.getElementById("load-mock-coryne-btn");
        if (mockCoryneBtn) {
            mockCoryneBtn.addEventListener("click", () => {
                gCurrentSpecies = "cgl";
                const select = document.getElementById("species-select");
                if (select) select.value = "cgl";
                updateSpeciesTitle("cgl");
                loadMockData();
            });
        }
        const mockEcoliBtn = document.getElementById("load-mock-ecoli-btn");
        if (mockEcoliBtn) {
            mockEcoliBtn.addEventListener("click", () => {
                gCurrentSpecies = "eco";
                const select = document.getElementById("species-select");
                if (select) select.value = "eco";
                updateSpeciesTitle("eco");
                loadMockData();
            });
        }
    });
});

function initSpeciesSelect() {
    const select = document.getElementById("species-select");
    if (select) {
        select.addEventListener("change", (e) => {
            gCurrentSpecies = e.target.value;
            gSelectedTfId = null;
            updateSpeciesTitle(gCurrentSpecies);
        });
    }
}

function updateSpeciesTitle(species) {
    gCurrentSpecies = species || 'sce';
    const titleEl = document.getElementById("page-title");
    const subTitleEl = document.querySelector(".header-subtitle");
    const logoText = document.querySelector(".logo-text");
    const activeMenuItem = document.querySelector(`.menu-item[data-tab="${gActiveTab}"] .menu-text`);
    const menuStr = activeMenuItem ? activeMenuItem.textContent : "데이터 업로드";
    
    if (gCurrentSpecies === 'cgl') {
        if (titleEl) titleEl.textContent = `C. glutamicum RNA-seq - ${menuStr}`;
        if (subTitleEl) subTitleEl.textContent = "코리네박테리움 글루타미쿰 raw expression 데이터 기반 DEG 시각화 및 기능성 맵핑 분석 도구";
        if (logoText) logoText.textContent = "CoryneRNA";
    } else if (gCurrentSpecies === 'eco') {
        if (titleEl) titleEl.textContent = `E. coli RNA-seq - ${menuStr}`;
        if (subTitleEl) subTitleEl.textContent = "대장균 (Escherichia coli K-12) raw expression 데이터 기반 DEG 시각화 및 기능성 맵핑 분석 도구";
        if (logoText) logoText.textContent = "ColiRNA";
    } else {
        if (titleEl) titleEl.textContent = `S. cerevisiae RNA-seq - ${menuStr}`;
        if (subTitleEl) subTitleEl.textContent = "효모 raw expression 데이터 기반 DEG 시각화 및 기능성 맵핑 분석 도구";
        if (logoText) logoText.textContent = "YeastRNA";
    }
    
    // Refresh sessions for newly selected species and auto-restore active session for that species
    if (typeof loadSessions === "function") {
        gGenes = [];
        window.gGenes = [];
        loadSessions(true);
    }
    
    // Refresh KEGG pathways for newly selected species
    if (typeof fetchKEGGPathways === "function") {
        fetchKEGGPathways();
    }

    // Refresh Custom Pathway dropdown for newly selected species
    if (typeof initializeMapDropdown === "function") {
        initializeMapDropdown();
        if (typeof selectAndLoadMap === "function") {
            selectAndLoadMap(currentMapId);
        }
    }
}

// ----------------------------------------------------------------------
// 1. Tab Navigation
// ----------------------------------------------------------------------
function initTabs() {
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            if (item.classList.contains("disabled")) return;
            
            const tabId = item.getAttribute("data-tab");
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    gActiveTab = tabId;
    
    // Update menu items active class
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        if (item.getAttribute("data-tab") === tabId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
    
    // Update tab panes visibility
    const panes = document.querySelectorAll(".tab-pane");
    panes.forEach(pane => {
        if (pane.id === tabId) {
            pane.classList.add("active");
        } else {
            pane.classList.remove("active");
        }
    });
    
    // Update Header Title dynamically based on Tab and active Species
    const titleEl = document.getElementById("page-title");
    const menuItem = document.querySelector(`.menu-item[data-tab="${tabId}"] .menu-text`);
    const menuText = menuItem ? menuItem.textContent : "";
    let speciesName = 'S. cerevisiae';
    if (gCurrentSpecies === 'cgl') speciesName = 'C. glutamicum';
    else if (gCurrentSpecies === 'eco') speciesName = 'E. coli';
    if (titleEl) titleEl.textContent = `${speciesName} RNA-seq - ${menuText}`;
    
    // Trigger chart redraws if necessary (Plotly sometimes needs to resize on tab show)
    if (tabId === 'volcano-tab') {
        renderVolcanoOrMAPlot();
    } else if (tabId === 'heatmap-tab') {
        renderHeatmap();
    } else if (tabId === 'pca-tab') {
        renderPCAPlot();
    } else if (tabId === 'network-tab') {
        renderNetworkGraph();
    } else if (tabId === 'motif-tab') {
        renderMotifLogoPlaceholder();
    } else if (tabId === 'custom-pathway-tab') {
        loadGSHPathwayData();
        resetGSHZoom();
    }
}

// Enable tabs after successful upload
function enableAnalysisTabs() {
    const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");
    menuItems.forEach(item => {
        item.classList.remove("disabled");
    });
}

function updateDEGTableHeaders() {
    const ctrlName = (window.gSampleMetadata && window.gSampleMetadata.control_name) ? window.gSampleMetadata.control_name : "WT";
    const treatName = (window.gSampleMetadata && window.gSampleMetadata.treated_name) ? window.gSampleMetadata.treated_name : "Mutant";
    
    const thWt = document.getElementById("deg-th-wt");
    if (thWt) {
        thWt.innerHTML = `${escapeHtml(ctrlName)} 발현 (평균) <i class="fa-solid fa-sort sort-icon"></i>`;
    }
    const thMut = document.getElementById("deg-th-mutant");
    if (thMut) {
        thMut.innerHTML = `${escapeHtml(treatName)} 발현 (평균) <i class="fa-solid fa-sort sort-icon"></i>`;
    }
}

// ----------------------------------------------------------------------
// 1-1. Session History Management
// ----------------------------------------------------------------------
function initSessions() {
    const sessionSelect = document.getElementById("header-session-select");
    if (sessionSelect) {
        sessionSelect.addEventListener("change", (e) => {
            const sid = e.target.value;
            if (sid && (sid !== gActiveSessionId || !gGenes || gGenes.length === 0)) {
                switchSession(sid);
            }
        });
    }
    
    const renameBtn = document.getElementById("btn-rename-active-session");
    if (renameBtn) {
        renameBtn.addEventListener("click", () => {
            if (!gActiveSessionId) return;
            const currentSession = gSessions.find(s => s.id === gActiveSessionId);
            const curName = currentSession ? currentSession.name : "";
            renameSession(gActiveSessionId, curName);
        });
    }
    
    const deleteBtn = document.getElementById("btn-delete-active-session");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            if (!gActiveSessionId) return;
            deleteSession(gActiveSessionId);
        });
    }
    
    // Initial load of sessions and auto-restore active session on page refresh
    loadSessions(true);
}

function loadSessions(autoRestoreActive = false) {
    let url = `${API_URL}/api/sessions`;
    if (gCurrentSpecies) {
        url += `?species=${gCurrentSpecies}`;
    }
    fetch(url)
        .then(r => r.json())
        .then(data => {
            gSessions = data.sessions || [];
            gActiveSessionId = data.active_session_id || null;
            updateSessionDropdown();
            renderSessionCatalog();
            
            // If page was refreshed or no genes are loaded yet, automatically restore active session data
            if (autoRestoreActive && (!gGenes || gGenes.length === 0) && gSessions.length > 0) {
                const targetSession = gSessions.find(s => s.id === gActiveSessionId) || gSessions[0];
                if (targetSession && targetSession.id) {
                    switchSession(targetSession.id);
                }
            }
        })
        .catch(err => {
            console.error("Failed to load sessions:", err);
        });
}

function updateSessionDropdown() {
    const select = document.getElementById("header-session-select");
    if (!select) return;
    
    select.innerHTML = "";
    if (!gSessions || gSessions.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "저장된 세션 없음";
        select.appendChild(opt);
        return;
    }
    
    gSessions.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = `${s.name} (${s.gene_count || 0}개 유전자)`;
        if (s.id === gActiveSessionId) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });
}

function renderSessionCatalog() {
    const container = document.getElementById("session-catalog-list");
    const countBadge = document.getElementById("session-count-badge");
    if (!container) return;
    
    if (countBadge) {
        countBadge.textContent = `${gSessions.length}개의 세션`;
    }
    
    if (!gSessions || gSessions.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 24px;">
                <i class="fa-solid fa-folder-open" style="font-size: 32px; margin-bottom: 8px;"></i>
                <p>저장된 분석 세션이 없습니다. 새로운 RNA-seq 데이터를 업로드하여 첫 번째 세션을 생성해 보세요!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = "";
    gSessions.forEach(s => {
        const isActive = s.id === gActiveSessionId;
        const card = document.createElement("div");
        card.className = `session-card-item ${isActive ? "active-session-card" : ""}`;
        
        card.innerHTML = `
            <div class="session-card-header">
                <div class="session-card-title">
                    <i class="fa-solid fa-file-waveform icon-margin" style="color: ${isActive ? '#2563eb' : '#64748b'};"></i>
                    ${escapeHtml(s.name)}
                </div>
                ${isActive ? '<span class="session-active-badge">현재 세션</span>' : ''}
            </div>
            <div class="session-card-meta">
                <div><i class="fa-regular fa-clock"></i> 생성일시: ${s.created_at || '-'}</div>
                <div><i class="fa-regular fa-file"></i> 원본파일: ${escapeHtml(s.source_name || '-')}</div>
                <div class="session-stats-row">
                    <span class="session-stat-up">▲ UP: ${s.up_count || 0}</span>
                    <span class="session-stat-down">▼ DOWN: ${s.down_count || 0}</span>
                    <span style="color: #64748b;">전체: ${s.gene_count || 0}</span>
                </div>
            </div>
            <div class="session-card-actions">
                ${(!isActive || !gGenes || gGenes.length === 0) ? `<button class="btn btn-primary btn-sm btn-switch-session" data-id="${s.id}" style="padding: 4px 10px; font-size: 12px;"><i class="fa-solid fa-right-to-bracket"></i> ${isActive ? '불러오기' : '전환'}</button>` : ''}
                <button class="btn btn-secondary btn-sm btn-rename-session" data-id="${s.id}" data-name="${escapeHtml(s.name)}" style="padding: 4px 10px; font-size: 12px;"><i class="fa-solid fa-pen"></i> 수정</button>
                <button class="btn btn-secondary btn-sm btn-delete-session" data-id="${s.id}" style="padding: 4px 10px; font-size: 12px; color: #ef4444;"><i class="fa-solid fa-trash"></i> 삭제</button>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Bind button events
    container.querySelectorAll(".btn-switch-session").forEach(btn => {
        btn.addEventListener("click", () => {
            const sid = btn.getAttribute("data-id");
            switchSession(sid);
        });
    });
    
    container.querySelectorAll(".btn-rename-session").forEach(btn => {
        btn.addEventListener("click", () => {
            const sid = btn.getAttribute("data-id");
            const curName = btn.getAttribute("data-name");
            renameSession(sid, curName);
        });
    });
    
    container.querySelectorAll(".btn-delete-session").forEach(btn => {
        btn.addEventListener("click", () => {
            const sid = btn.getAttribute("data-id");
            deleteSession(sid);
        });
    });
}

function escapeHtml(text) {
    if (!text) return "";
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function switchSession(sessionId) {
    updateStatus("analyzing", "세션 데이터 전환 중...");
    fetch(`${API_URL}/api/sessions/switch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId })
    })
    .then(r => {
        if (!r.ok) throw new Error("세션 전환 실패");
        return r.json();
    })
    .then(data => {
        gGenes = data.genes || [];
        gActiveSessionId = data.active_session_id;
        if (data.sample_metadata) {
            window.gSampleMetadata = data.sample_metadata;
        }
        gIsReplicateMode = gGenes.length > 0 && gGenes[0].hasOwnProperty("fdr") && gGenes[0].fdr !== null;
        
        loadSessions(); // Refresh UI dropdown and catalog cards
        finalizeDataLoading();
    })
    .catch(err => {
        alert(`세션 전환 오류: ${err.message}`);
        updateStatus("ready", "대기 중");
    });
}

function renameSession(sessionId, currentName) {
    const newName = prompt("새로운 세션 이름을 입력하세요:", currentName);
    if (!newName || newName.trim() === "" || newName === currentName) return;
    
    fetch(`${API_URL}/api/sessions/${sessionId}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() })
    })
    .then(r => {
        if (!r.ok) throw new Error("세션 이름 변경 실패");
        return r.json();
    })
    .then(() => {
        loadSessions();
        if (sessionId === gActiveSessionId) {
            updateSessionDropdown();
        }
    })
    .catch(err => {
        alert(`세션 이름 변경 오류: ${err.message}`);
    });
}

function deleteSession(sessionId) {
    const targetSession = gSessions.find(s => s.id === sessionId);
    const sessionName = targetSession ? targetSession.name : "이 세션";
    
    if (!confirm(`정말로 '${sessionName}' 세션을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`)) {
        return;
    }
    
    fetch(`${API_URL}/api/sessions/${sessionId}`, {
        method: "DELETE"
    })
    .then(r => {
        if (!r.ok) throw new Error("세션 삭제 실패");
        return r.json();
    })
    .then(data => {
        const activeChanged = gActiveSessionId === sessionId;
        gActiveSessionId = data.active_session_id;
        
        if (activeChanged && gActiveSessionId) {
            switchSession(gActiveSessionId);
        } else {
            loadSessions();
            if (!gActiveSessionId) {
                gGenes = [];
                renderDEGTable();
            }
        }
    })
    .catch(err => {
        alert(`세션 삭제 오류: ${err.message}`);
    });
}

// ----------------------------------------------------------------------
// 2. File Upload & Mock Data
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// 2. File Upload & Mock Data
// ----------------------------------------------------------------------
let hotInstance = null;
let isFallbackGrid = false;

// Default Excel Grid sample data
const defaultGridData = [
    ["locus_tag", "Gene_Symbol", "WT_Rep1", "WT_Rep2", "WT_Rep3", "Mutant_Rep1", "Mutant_Rep2", "Mutant_Rep3"],
    ["YAL038W", "CDC19", "1200.5", "1150.2", "1250.8", "340.2", "320.5", "310.8"],
    ["YGR192C", "TDH3", "2400.1", "2450.4", "2390.9", "4500.8", "4600.2", "4450.5"],
    ["YFL039C", "ACT1", "850.3", "900.2", "870.5", "890.1", "860.4", "880.2"],
    ["YLR355C", "ILD1", "10.2", "12.5", "9.8", "120.5", "115.8", "130.2"],
    ["YDL215C", "GDH2", "50.5", "45.2", "55.8", "5.1", "4.8", "5.5"],
    ["YJR009C", "LUT2", "150.2", "160.5", "140.8", "850.3", "900.2", "870.5"],
    ["YKL060C", "FBA1", "300.5", "310.2", "290.8", "120.2", "130.5", "110.8"],
    ["YOL086C", "ADH1", "5000.5", "5100.2", "4900.8", "1500.2", "1600.5", "1400.8"]
];

// Fallback HTML table grid generator (for offline or loading failures)
function initFallbackGrid(gridEl) {
    isFallbackGrid = true;
    gridEl.innerHTML = "";
    gridEl.style.overflow = "auto";
    gridEl.style.height = "320px";
    
    const table = document.createElement("table");
    table.id = "fallback-html-table";
    table.className = "fallback-excel-table";
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    
    gridEl.appendChild(table);
    
    // Load default data
    loadFallbackData(defaultGridData);
    
    // Add paste event listener for Excel copy-paste compatibility
    table.addEventListener("paste", function(e) {
        e.preventDefault();
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData("Text");
        
        const rows = pastedData.split(/\r?\n/).map(row => row.split("\t"));
        if (rows.length === 0 || rows[0].length === 0) return;
        
        const activeCell = document.activeElement;
        if (!activeCell || activeCell.tagName !== "TD") return;
        
        const startRowIdx = activeCell.parentElement.rowIndex;
        const startColIdx = activeCell.cellIndex;
        
        const trs = table.rows;
        rows.forEach((rowData, rOffset) => {
            const targetRowIdx = startRowIdx + rOffset;
            
            while (targetRowIdx >= trs.length) {
                fallbackAddRow();
            }
            
            const tr = trs[targetRowIdx];
            rowData.forEach((val, cOffset) => {
                const targetColIdx = startColIdx + cOffset;
                
                while (targetColIdx >= tr.cells.length) {
                    fallbackAddCol();
                }
                
                tr.cells[targetColIdx].textContent = val;
            });
        });
    });
}

function loadFallbackData(dataArray) {
    const table = document.getElementById("fallback-html-table");
    if (!table) return;
    table.innerHTML = "";
    
    dataArray.forEach((rowData) => {
        const tr = document.createElement("tr");
        rowData.forEach((val) => {
            const td = document.createElement("td");
            td.contentEditable = "true";
            td.textContent = val;
            td.style.border = "1px solid #cbd5e1";
            td.style.padding = "6px 8px";
            td.style.minWidth = "80px";
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    
    const currentRows = dataArray.length;
    const colCount = dataArray[0] ? dataArray[0].length : 8;
    for (let i = 0; i < (35 - currentRows); i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < colCount; j++) {
            const td = document.createElement("td");
            td.contentEditable = "true";
            td.style.border = "1px solid #cbd5e1";
            td.style.padding = "6px 8px";
            td.style.minWidth = "80px";
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function fallbackAddRow() {
    const table = document.getElementById("fallback-html-table");
    if (!table) return;
    const colCount = table.rows[0] ? table.rows[0].cells.length : 8;
    const tr = document.createElement("tr");
    for (let i = 0; i < colCount; i++) {
        const td = document.createElement("td");
        td.contentEditable = "true";
        td.style.border = "1px solid #cbd5e1";
        td.style.padding = "6px 8px";
        td.style.minWidth = "80px";
        tr.appendChild(td);
    }
    table.appendChild(tr);
}

function fallbackAddCol() {
    const table = document.getElementById("fallback-html-table");
    if (!table) return;
    for (let i = 0; i < table.rows.length; i++) {
        const td = document.createElement("td");
        td.contentEditable = "true";
        td.style.border = "1px solid #cbd5e1";
        td.style.padding = "6px 8px";
        td.style.minWidth = "80px";
        table.rows[i].appendChild(td);
    }
}

// Automatically predict next column name (e.g. Sample_2, Mutant_Rep4) and insert new column
function addNewColumnAutomatically() {
    const addCount = parseInt(document.getElementById("grid-add-col-count").value, 10) || 1;
    
    if (isFallbackGrid) {
        for (let c = 0; c < addCount; c++) {
            fallbackAddCol();
            const table = document.getElementById("fallback-html-table");
            if (table && table.rows[0]) {
                const currentCols = table.rows[0].cells.length;
                const newColName = "Sample_" + currentCols;
                const lastCell = table.rows[0].cells[currentCols - 1];
                lastCell.textContent = newColName;
            }
        }
    } else if (hotInstance) {
        try {
            const gridData = hotInstance.getData();
            if (!gridData || gridData.length === 0) return;
            
            const selected = hotInstance.getSelected();
            let colIdx = (gridData[0] ? gridData[0].length : 8) - 1;
            if (selected && selected.length > 0) {
                colIdx = Math.max(selected[0][1], selected[0][3]);
            }
            
            const firstRow = gridData[0] || [];
            const baseColVal = String(firstRow[colIdx] || "Sample_1").trim();
            
            // Extract prefix and number pattern (e.g. "WT_Rep3" -> prefix="WT_Rep", num=3)
            const match = baseColVal.match(/^(.*?)([\-_]?)(\d+)$/);
            let prefix = "Sample_";
            let separator = "";
            let startNum = colIdx + 1;
            
            if (match) {
                prefix = match[1];
                separator = match[2];
                startNum = parseInt(match[3], 10);
            } else {
                prefix = baseColVal + "_";
                startNum = 1;
            }
            
            for (let c = 0; c < addCount; c++) {
                const genColName = `${prefix}${separator}${startNum + 1 + c}`;
                gridData.forEach((row, rIdx) => {
                    if (rIdx === 0) {
                        row.splice(colIdx + 1 + c, 0, genColName);
                    } else {
                        row.splice(colIdx + 1 + c, 0, "");
                    }
                });
            }
            
            hotInstance.loadData(gridData);
        } catch (err) {
            console.error("Failed to add columns:", err);
            alert("열을 추가하는 도중 에러가 발생했습니다: " + err.message);
        }
    }
}

function fallbackDelRow() {
    const table = document.getElementById("fallback-html-table");
    if (!table) return;
    
    const activeCell = document.activeElement;
    if (activeCell && activeCell.tagName === "TD") {
        const rowIndex = activeCell.parentElement.rowIndex;
        if (table.rows.length > 1) {
            table.deleteRow(rowIndex);
        }
    } else {
        if (table.rows.length > 1) {
            table.deleteRow(table.rows.length - 1);
        }
    }
}

function fallbackDelCol() {
    const table = document.getElementById("fallback-html-table");
    if (!table) return;
    
    const activeCell = document.activeElement;
    let colIndex = -1;
    if (activeCell && activeCell.tagName === "TD") {
        colIndex = activeCell.cellIndex;
    } else {
        colIndex = table.rows[0] ? table.rows[0].cells.length - 1 : -1;
    }
    
    if (colIndex !== -1 && (table.rows[0] && table.rows[0].cells.length > 1)) {
        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].deleteCell(colIndex);
        }
    }
}

function getFallbackData() {
    const table = document.getElementById("fallback-html-table");
    if (!table) return [];
    
    const data = [];
    for (let i = 0; i < table.rows.length; i++) {
        const rowData = [];
        const cells = table.rows[i].cells;
        for (let j = 0; j < cells.length; j++) {
            rowData.push(cells[j].textContent);
        }
        data.push(rowData);
    }
    return data;
}

function initDropzone() {
    // 1. File Upload Elements
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("file-input");
    const fileInfo = document.getElementById("file-info");
    const selectedFileName = document.getElementById("selected-file-name");
    const analyzeBtn = document.getElementById("analyze-btn");
    
    // 2. Text Upload Elements
    const toggleFileUpload = document.getElementById("toggle-file-upload");
    const toggleTextUpload = document.getElementById("toggle-text-upload");
    const fileUploadContainer = document.getElementById("file-upload-container");
    const textUploadContainer = document.getElementById("text-upload-container");
    const analyzeTextBtn = document.getElementById("analyze-text-btn");
    
    // Initialize Handsontable or fallback HTML grid
    const gridEl = document.getElementById("excel-grid");
    if (gridEl) {
        if (typeof Handsontable !== "undefined") {
            try {
                // Prepare default data copy
                const sampleData = JSON.parse(JSON.stringify(defaultGridData));
                for (let i = 0; i < 30; i++) {
                    sampleData.push(["", "", "", "", "", "", "", ""]);
                }
                
                hotInstance = new Handsontable(gridEl, {
                    data: sampleData,
                    rowHeaders: true,
                    colHeaders: true,
                    contextMenu: true,
                    minSpareRows: 1,
                    stretchH: "all",
                    width: "100%",
                    height: "320px",
                    licenseKey: "non-commercial-and-evaluation"
                });
            } catch (e) {
                console.error("Handsontable initialization failed, loading fallback grid:", e);
                initFallbackGrid(gridEl);
            }
        } else {
            console.warn("Handsontable is not defined. Loading fallback HTML grid.");
            initFallbackGrid(gridEl);
        }
    }
    
    // Toggle UI logic
    toggleFileUpload.addEventListener("click", () => {
        toggleFileUpload.classList.add("active");
        toggleTextUpload.classList.remove("active");
        fileUploadContainer.style.display = "block";
        textUploadContainer.style.display = "none";
    });
    
    toggleTextUpload.addEventListener("click", () => {
        toggleTextUpload.classList.add("active");
        toggleFileUpload.classList.remove("active");
        textUploadContainer.style.display = "block";
        fileUploadContainer.style.display = "none";
        
        // Render/Resize grid
        if (isFallbackGrid) {
            // Nothing to do
        } else if (hotInstance) {
            setTimeout(() => {
                hotInstance.render();
            }, 50);
        }
    });
    
    // Grid Control Buttons Event Listeners
    document.getElementById("btn-grid-add-row").addEventListener("click", () => {
        const addCount = parseInt(document.getElementById("grid-add-row-count").value, 10) || 1;
        
        if (isFallbackGrid) {
            for (let r = 0; r < addCount; r++) {
                fallbackAddRow();
            }
        } else if (hotInstance) {
            try {
                const gridData = hotInstance.getData();
                if (!gridData || gridData.length === 0) return;
                
                const selected = hotInstance.getSelected();
                let rowIdx = gridData.length - 1;
                if (selected && selected.length > 0) {
                    rowIdx = Math.max(selected[0][0], selected[0][2]);
                }
                
                const colCount = gridData[0] ? gridData[0].length : 8;
                
                // Splice empty rows based on specified addCount
                for (let r = 0; r < addCount; r++) {
                    const newRow = Array(colCount).fill("");
                    gridData.splice(rowIdx + 1 + r, 0, newRow);
                }
                
                hotInstance.loadData(gridData);
            } catch (err) {
                console.error("Failed to add rows:", err);
            }
        }
    });

    document.getElementById("btn-grid-del-row").addEventListener("click", () => {
        if (isFallbackGrid) {
            fallbackDelRow();
        } else if (hotInstance) {
            try {
                const gridData = hotInstance.getData();
                if (!gridData || gridData.length <= 1) return;
                
                const selected = hotInstance.getSelected();
                if (selected && selected.length > 0) {
                    const startRow = Math.min(selected[0][0], selected[0][2]);
                    const endRow = Math.max(selected[0][0], selected[0][2]);
                    const count = endRow - startRow + 1;
                    gridData.splice(startRow, count);
                } else {
                    gridData.pop();
                }
                hotInstance.loadData(gridData);
            } catch (err) {
                console.error("Failed to delete row:", err);
            }
        }
    });

    document.getElementById("btn-grid-add-col").addEventListener("click", () => {
        addNewColumnAutomatically();
    });

    document.getElementById("btn-grid-del-col").addEventListener("click", () => {
        if (isFallbackGrid) {
            fallbackDelCol();
        } else if (hotInstance) {
            try {
                const gridData = hotInstance.getData();
                if (!gridData || gridData.length === 0) return;
                
                const selected = hotInstance.getSelected();
                let colIdx = (gridData[0] ? gridData[0].length : 8) - 1;
                let count = 1;
                if (selected && selected.length > 0) {
                    colIdx = Math.min(selected[0][1], selected[0][3]);
                    const endCol = Math.max(selected[0][1], selected[0][3]);
                    count = endCol - colIdx + 1;
                }
                
                // Ensure we don't delete all columns
                if (gridData[0].length > count) {
                    gridData.forEach(row => {
                        row.splice(colIdx, count);
                    });
                    hotInstance.loadData(gridData);
                }
            } catch (err) {
                console.error("Failed to delete column:", err);
            }
        }
    });

    document.getElementById("btn-grid-clear").addEventListener("click", () => {
        const headerRow = ["locus_tag", "Gene_Symbol", "WT_Rep1", "WT_Rep2", "WT_Rep3", "Mutant_Rep1", "Mutant_Rep2", "Mutant_Rep3"];
        const emptyData = [headerRow];
        for (let i = 0; i < 30; i++) {
            emptyData.push(["", "", "", "", "", "", "", ""]);
        }
        
        if (isFallbackGrid) {
            loadFallbackData(emptyData);
        } else if (hotInstance) {
            hotInstance.loadData(emptyData);
        }
    });

    document.getElementById("btn-grid-sample").addEventListener("click", () => {
        const sampleData = JSON.parse(JSON.stringify(defaultGridData));
        if (isFallbackGrid) {
            loadFallbackData(sampleData);
        } else if (hotInstance) {
            hotInstance.loadData(sampleData);
        }
    });
    
    // Trigger input click on dropzone click
    dropzone.addEventListener("click", () => fileInput.click());
    
    // Drag and drop classes
    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });
    
    ["dragleave", "drop"].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.remove("dragover");
        });
    });
    
    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect(fileInput.files[0]);
        }
    });
    
    fileInput.addEventListener("change", () => {
        if (fileInput.files.length) {
            handleFileSelect(fileInput.files[0]);
        }
    });
    
    function handleFileSelect(file) {
        selectedFileName.textContent = file.name;
        fileInfo.style.display = "flex";
    }
    
    analyzeBtn.addEventListener("click", () => {
        const file = fileInput.files[0];
        if (!file) return;
        
        uploadFile(file);
    });
    
    // Grid data submission and TSV parsing trigger
    analyzeTextBtn.addEventListener("click", () => {
        const gridData = isFallbackGrid ? getFallbackData() : (hotInstance ? hotInstance.getData() : []);
        const tsvRows = [];

        gridData.forEach((row) => {
            const hasContent = row.some(cell => cell !== null && String(cell).trim() !== "");
            if (hasContent) {
                const cleanRow = row.map(cell => {
                    if (cell === null || cell === undefined) return "";
                    return String(cell).replace(/[\t\r\n]/g, " ");
                });
                tsvRows.push(cleanRow.join("\t"));
            }
        });

        if (tsvRows.length < 2) {
            alert("그리드에 데이터를 입력해 주세요. 최소한 헤더 행과 1개 이상의 데이터 행이 필요합니다.");
            return;
        }

        const tsvText = tsvRows.join("\n");
        uploadText(tsvText);
    });
}

function updateStatus(state, text) {
    const badge = document.getElementById("status-badge");
    badge.className = `status-indicator ${state}`;
    badge.querySelector(".status-text").textContent = text;
}

function uploadFile(file) {
    updateStatus("analyzing", "데이터 분석 중...");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("species", gCurrentSpecies);
    
    fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.detail || "파일 파싱 실패") });
        }
        return response.json();
    })
    .then(data => {
        processUploadedData(data);
    })
    .catch(err => {
        alert(`에러: ${err.message}`);
        updateStatus("ready", "대기 중");
    });
}

function uploadText(text) {
    updateStatus("analyzing", "데이터 분석 중...");
    
    fetch(`${API_URL}/api/upload_text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, species: gCurrentSpecies })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.detail || "텍스트 파싱 실패") });
        }
        return response.json();
    })
    .then(data => {
        processUploadedData(data);
    })
    .catch(err => {
        alert(`에러: ${err.message}`);
        updateStatus("ready", "대기 중");
    });
}

function loadMockData() {
    updateStatus("analyzing", "기본 예제 분석 데이터 로드 중...");
    let mockFileUrl = "/mock_yeast_rnaseq.xlsx";
    let fileName = "mock_yeast_rnaseq.xlsx";
    if (gCurrentSpecies === "cgl") {
        mockFileUrl = "/mock_coryne_rnaseq.xlsx";
        fileName = "mock_coryne_rnaseq.xlsx";
    } else if (gCurrentSpecies === "eco") {
        mockFileUrl = "/mock_ecoli_rnaseq.xlsx";
        fileName = "mock_ecoli_rnaseq.xlsx";
    }
    
    fetch(mockFileUrl)
        .then(res => {
            if (!res.ok) throw new Error("Sample file not found on server.");
            return res.blob();
        })
        .then(blob => {
            const file = new File([blob], fileName, {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            uploadFile(file);
        })
        .catch(err => {
            alert("기본 예제 엑셀 파일을 가져오지 못했습니다. 서버에서 예제 데이터 파일 존재 여부를 확인해주세요.");
            updateStatus("ready", "대기 중");
        });
}

function processUploadedData(data) {
    gGenes = data.genes || [];
    if (data.hasOwnProperty("is_replicate_mode")) {
        gIsReplicateMode = data.is_replicate_mode;
    } else {
        gIsReplicateMode = gGenes.length > 0 && gGenes[0].hasOwnProperty("fdr") && gGenes[0].fdr !== null;
    }
    if (data.sample_metadata) {
        window.gSampleMetadata = data.sample_metadata;
    }
    if (data.session && data.session.id) {
        gActiveSessionId = data.session.id;
    }
    if (data.species) {
        gCurrentSpecies = data.species;
        const select = document.getElementById("species-select");
        if (select) select.value = data.species;
        updateSpeciesTitle(data.species);
    }
    
    // Fetch all genes to get full dataset for active session
    const sidParam = gActiveSessionId ? `?session_id=${encodeURIComponent(gActiveSessionId)}` : '';
    fetch(`${API_URL}/api/genes${sidParam}`)
        .then(r => {
            if (!r.ok) throw new Error("전체 유전자 데이터 로드 실패");
            return r.json();
        })
        .then(fullData => {
            if (fullData.genes && fullData.genes.length > 0) {
                gGenes = fullData.genes;
            }
            if (fullData.sample_metadata) {
                window.gSampleMetadata = fullData.sample_metadata;
            }
            if (fullData.species) {
                gCurrentSpecies = fullData.species;
                const select = document.getElementById("species-select");
                if (select) select.value = fullData.species;
                updateSpeciesTitle(fullData.species);
            }
            gIsReplicateMode = gGenes.length > 0 && gGenes[0].hasOwnProperty("fdr") && gGenes[0].fdr !== null;
            
            if (typeof loadSessions === "function") {
                loadSessions();
            }
            finalizeDataLoading();
        })
        .catch(err => {
            console.warn("api/genes 호출 실패, 업로드 직후 데이터로 렌더링을 진행합니다:", err);
            finalizeDataLoading();
        });
}

function resetOtherAnalysisViews() {
    // Reset GO Enrichment view
    const goTbody = document.getElementById("go-table-body");
    if (goTbody) {
        goTbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">분석 실행 버튼을 누르시면 검정이 시작됩니다.</td></tr>';
    }
    const goChart = document.getElementById("go-chart-container");
    if (goChart) goChart.style.display = "none";
    
    // Reset Network view
    const cyNet = document.getElementById("cy-network");
    if (cyNet) cyNet.innerHTML = "";
    const netDetails = document.getElementById("network-node-details");
    if (netDetails) {
        netDetails.innerHTML = '<p class="text-center text-muted" style="margin-top: 100px;">네트워크에서 유전자 노드를 클릭하시면 상세 기능 설명이 여기에 표시됩니다.</p>';
    }
}

function finalizeDataLoading() {
    updateStatus("ready", "분석 완료");
    
    // Enable all analysis navigation tabs
    try {
        enableAnalysisTabs();
    } catch (e) {
        console.error("enableAnalysisTabs error:", e);
    }
    
    // Assign original order index for sort reset fallback
    gGenes.forEach((gene, index) => {
        gene.original_index = index;
    });
    
    window.gGenes = gGenes;
    
    // Update dynamic sample headers
    try {
        updateDEGTableHeaders();
    } catch (e) {
        console.error("updateDEGTableHeaders error:", e);
    }
    
    // Configure p-value filters visibility based on mode
    try {
        const pvalFilterGroup = document.getElementById("pvalue-filter-group");
        const heatmapMetricPvalue = document.getElementById("heatmap-metric-pvalue");
        const statTypeEl = document.getElementById("stat-type");
        const statType = statTypeEl ? statTypeEl.value : "fdr";
        const pvalInput = document.getElementById("pvalue-thresh");
        
        if (gIsReplicateMode) {
            if (pvalFilterGroup) pvalFilterGroup.style.display = "flex";
            if (pvalInput) {
                if (statType === "none") {
                    pvalInput.disabled = true;
                    pvalInput.style.opacity = "0.5";
                } else {
                    pvalInput.disabled = false;
                    pvalInput.style.opacity = "1.0";
                }
            }
            if (heatmapMetricPvalue) heatmapMetricPvalue.disabled = false;
            const titleEl = document.getElementById("plot-title-text");
            if (titleEl) titleEl.textContent = "Volcano Plot";
            const plotBtns = document.getElementById("plot-toggle-btns");
            if (plotBtns) plotBtns.style.display = "flex";
        } else {
            if (pvalFilterGroup) pvalFilterGroup.style.display = "none";
            if (heatmapMetricPvalue) heatmapMetricPvalue.disabled = true;
            const metricEl = document.getElementById("heatmap-metric");
            if (metricEl) metricEl.value = "log2fc";
            const titleEl = document.getElementById("plot-title-text");
            if (titleEl) titleEl.textContent = "MA Plot";
            const plotBtns = document.getElementById("plot-toggle-btns");
            if (plotBtns) plotBtns.style.display = "none";
        }
    } catch (e) {
        console.error("Filter configuration error:", e);
    }
    
    // 1. Populate DEG Table
    try {
        renderDEGTable();
    } catch (e) {
        console.error("renderDEGTable error:", e);
    }
    
    // 2. Refresh Volcano / MA Plot
    try {
        renderVolcanoOrMAPlot();
    } catch (e) {
        console.error("renderVolcanoOrMAPlot error:", e);
    }
    
    // 3. Fetch KEGG pathways list
    try {
        if (typeof fetchKEGGPathways === "function") fetchKEGGPathways();
    } catch (e) {
        console.error("fetchKEGGPathways error:", e);
    }
    
    // 4. Update Custom Pathway expression mapping
    try {
        if (typeof loadGSHPathwayData === "function") loadGSHPathwayData();
    } catch (e) {
        console.error("loadGSHPathwayData error:", e);
    }
    
    // 5. Trigger Heatmap and PCA refresh
    try {
        if (typeof renderHeatmap === "function") renderHeatmap();
    } catch (e) {
        console.error("renderHeatmap error:", e);
    }
    try {
        if (typeof renderPCAPlot === "function") renderPCAPlot();
    } catch (e) {
        console.error("renderPCAPlot error:", e);
    }
    
    // 6. Reset older mock states on secondary tabs to ensure clean data isolation
    try {
        resetOtherAnalysisViews();
    } catch (e) {
        console.error("resetOtherAnalysisViews error:", e);
    }
    
    // 7. Automatically switch to DEG result view
    try {
        switchTab("deg-tab");
    } catch (e) {
        console.error("switchTab error:", e);
    }
}

// ----------------------------------------------------------------------
// 3. DEG Table View
// ----------------------------------------------------------------------
function initControls() {
    const controls = ["log2fc-thresh", "pvalue-thresh", "search-gene"];
    controls.forEach(id => {
        document.getElementById(id).addEventListener("input", () => {
            renderDEGTable();
            renderVolcanoOrMAPlot();
        });
    });
    
    // Statistical significance criteria toggle
    document.getElementById("stat-type").addEventListener("change", () => {
        const statType = document.getElementById("stat-type").value;
        const pvalInput = document.getElementById("pvalue-thresh");
        if (statType === "none") {
            pvalInput.disabled = true;
            pvalInput.style.opacity = "0.5";
        } else {
            pvalInput.disabled = false;
            pvalInput.style.opacity = "1.0";
        }
        renderDEGTable();
        renderVolcanoOrMAPlot();
    });
    
    // Heatmap controls
    document.getElementById("regenerate-heatmap").addEventListener("click", renderHeatmap);
    
    const heatmapHeightInput = document.getElementById("heatmap-height");
    if (heatmapHeightInput) {
        heatmapHeightInput.addEventListener("input", (e) => {
            document.getElementById("heatmap-height-val").textContent = `${e.target.value}px`;
            renderHeatmap();
        });
    }
    
    const heatmapDendroGapInput = document.getElementById("heatmap-dendro-gap");
    if (heatmapDendroGapInput) {
        heatmapDendroGapInput.addEventListener("input", (e) => {
            document.getElementById("heatmap-dendro-gap-val").textContent = `${e.target.value}%`;
            renderHeatmap();
        });
    }
    
    const heatmapDendroGapTopInput = document.getElementById("heatmap-dendro-gap-top");
    if (heatmapDendroGapTopInput) {
        heatmapDendroGapTopInput.addEventListener("input", (e) => {
            document.getElementById("heatmap-dendro-gap-top-val").textContent = `${e.target.value}%`;
            renderHeatmap();
        });
    }
    

    
    // Sample order control event listeners
    const sampleOrderTypeSelect = document.getElementById("heatmap-sample-order-type");
    const sampleOrderCustomContainer = document.getElementById("sample-order-custom-container");
    const sampleOrderCustomInput = document.getElementById("heatmap-sample-order-custom");
    
    if (sampleOrderTypeSelect) {
        sampleOrderTypeSelect.addEventListener("change", (e) => {
            if (e.target.value === "custom") {
                sampleOrderCustomContainer.style.display = "block";
            } else {
                sampleOrderCustomContainer.style.display = "none";
            }
            renderHeatmap();
        });
    }
    
    if (sampleOrderCustomInput) {
        sampleOrderCustomInput.addEventListener("input", () => {
            renderHeatmap();
        });
    }
    
    // Clustering check change to enable/disable manual sample ordering
    const heatmapClusterCheck = document.getElementById("heatmap-cluster");
    if (heatmapClusterCheck) {
        // Run once on load to set initial state
        const toggleSampleOrderFields = () => {
            if (heatmapClusterCheck.checked) {
                if (sampleOrderTypeSelect) {
                    sampleOrderTypeSelect.disabled = true;
                    sampleOrderTypeSelect.style.opacity = "0.5";
                }
                sampleOrderCustomContainer.style.display = "none";
            } else {
                if (sampleOrderTypeSelect) {
                    sampleOrderTypeSelect.disabled = false;
                    sampleOrderTypeSelect.style.opacity = "1.0";
                    if (sampleOrderTypeSelect.value === "custom") {
                        sampleOrderCustomContainer.style.display = "block";
                    }
                }
            }
        };
        heatmapClusterCheck.addEventListener("change", () => {
            toggleSampleOrderFields();
            renderHeatmap();
        });
        // Attach initial hook invocation in case mock data finalization triggers
        document.addEventListener("DOMContentLoaded", toggleSampleOrderFields);
        // Let's also run this after data load finalization
    }
    
    // GO Enrichment & Inspector
    document.getElementById("run-go-btn").addEventListener("click", runGOEnrichment);
    
    const goInspectorSearch = document.getElementById("search-go-inspector-gene");
    if (goInspectorSearch) {
        goInspectorSearch.addEventListener("input", () => {
            renderGOInspectorTable();
        });
    }
    
    const goInspectorExport = document.getElementById("btn-export-go-genes");
    if (goInspectorExport) {
        goInspectorExport.addEventListener("click", () => {
            exportSelectedGOGenesToExcel();
        });
    }
    
    // PPI Network Controls & Excel Export
    const btnRebuildNet = document.getElementById("btn-rebuild-network");
    if (btnRebuildNet) {
        btnRebuildNet.addEventListener("click", renderNetworkGraph);
    }
    ["network-source", "network-type", "network-limit", "network-score"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("change", renderNetworkGraph);
        }
    });
    const netExportBtn = document.getElementById("btn-export-network-excel");
    if (netExportBtn) {
        netExportBtn.addEventListener("click", exportNetworkToExcel);
    }
    
    // Target Ego-Network Controls
    const btnRunTargetNet = document.getElementById("btn-run-target-network");
    const targetNetInput = document.getElementById("network-target-input");
    const btnNetClearTarget = document.getElementById("btn-net-clear-target");
    const btnResetNetView = document.getElementById("btn-reset-network-view");
    const netDepthSelect = document.getElementById("network-depth-select");

    if (btnRunTargetNet) {
        btnRunTargetNet.addEventListener("click", () => {
            const val = targetNetInput ? targetNetInput.value.trim() : "";
            gNetTargetGene = val || null;
            renderNetworkGraph();
        });
    }
    if (targetNetInput) {
        targetNetInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                gNetTargetGene = targetNetInput.value.trim() || null;
                renderNetworkGraph();
            }
        });
    }
    if (btnNetClearTarget) {
        btnNetClearTarget.addEventListener("click", resetNetworkTargetView);
    }
    if (btnResetNetView) {
        btnResetNetView.addEventListener("click", resetNetworkTargetView);
    }
    if (netDepthSelect) {
        netDepthSelect.addEventListener("change", () => {
            if (gNetTargetGene || (targetNetInput && targetNetInput.value.trim())) {
                renderNetworkGraph();
            }
        });
    }
    
    // Volcano Toggle buttons
    document.getElementById("btn-show-volcano").addEventListener("click", () => {
        document.getElementById("btn-show-volcano").classList.add("active");
        document.getElementById("btn-show-ma").classList.remove("active");
        renderPlot("volcano");
    });
    
    document.getElementById("btn-show-ma").addEventListener("click", () => {
        document.getElementById("btn-show-ma").classList.add("active");
        document.getElementById("btn-show-volcano").classList.remove("active");
        renderPlot("ma");
    });

    // Add sorting listeners for DEG table headers
    document.querySelectorAll(".sortable-header").forEach(th => {
        th.addEventListener("click", () => {
            const key = th.getAttribute("data-sort-key");
            handleHeaderSort(key, th);
        });
    });

    // KEGG Pathway Gene Search Input Event
    const keggSearchInput = document.getElementById("kegg-search-gene");
    if (keggSearchInput) {
        keggSearchInput.addEventListener("input", (e) => {
            renderPathwayList(e.target.value);
        });
    }

    // DEG Excel Export Binding
    const btnExportExcel = document.getElementById("btn-export-deg-excel");
    if (btnExportExcel) {
        btnExportExcel.addEventListener("click", () => {
            window.open(`${API_URL}/api/export_deg_excel`, '_blank');
        });
    }
    
    // Volcano / MA Plot Export Bindings
    const btnExportVolcanoJpg = document.getElementById("btn-export-volcano-jpg");
    const btnExportVolcanoPdf = document.getElementById("btn-export-volcano-pdf");
    if (btnExportVolcanoJpg) {
        btnExportVolcanoJpg.addEventListener("click", () => exportPlotlyChart("plotly-chart", "jpeg", "yeast_volcano_ma_plot"));
    }
    if (btnExportVolcanoPdf) {
        btnExportVolcanoPdf.addEventListener("click", () => exportPlotlyChart("plotly-chart", "pdf", "yeast_volcano_ma_plot"));
    }
    
    // Heatmap Export Bindings
    const btnExportHeatmapJpg = document.getElementById("btn-export-heatmap-jpg");
    const btnExportHeatmapPdf = document.getElementById("btn-export-heatmap-pdf");
    if (btnExportHeatmapJpg) {
        btnExportHeatmapJpg.addEventListener("click", () => exportPlotlyChart("plotly-heatmap", "jpeg", "yeast_expression_heatmap"));
    }
    if (btnExportHeatmapPdf) {
        btnExportHeatmapPdf.addEventListener("click", () => exportPlotlyChart("plotly-heatmap", "pdf", "yeast_expression_heatmap"));
    }
    
    // PCA Plot Export Bindings
    const btnExportPcaJpg = document.getElementById("btn-export-pca-jpg");
    const btnExportPcaPdf = document.getElementById("btn-export-pca-pdf");
    if (btnExportPcaJpg) {
        btnExportPcaJpg.addEventListener("click", () => exportPlotlyChart("pca-scatter-chart", "jpeg", "yeast_pca_plot"));
    }
    if (btnExportPcaPdf) {
        btnExportPcaPdf.addEventListener("click", () => exportPlotlyChart("pca-scatter-chart", "pdf", "yeast_pca_plot"));
    }
    
    // GO Enrichment Export Bindings
    const btnExportGoJpg = document.getElementById("btn-export-go-jpg");
    const btnExportGoPdf = document.getElementById("btn-export-go-pdf");
    if (btnExportGoJpg) {
        btnExportGoJpg.addEventListener("click", () => exportPlotlyChart("go-bar-chart", "jpeg", "yeast_go_enrichment_chart"));
    }
    if (btnExportGoPdf) {
        btnExportGoPdf.addEventListener("click", () => exportPlotlyChart("go-bar-chart", "pdf", "yeast_go_enrichment_chart"));
    }
    
    // KEGG Map Export Bindings
    const btnExportKeggJpg = document.getElementById("btn-export-kegg-jpg");
    const btnExportKeggPdf = document.getElementById("btn-export-kegg-pdf");
    if (btnExportKeggJpg) {
        btnExportKeggJpg.addEventListener("click", () => exportKeggMap("jpeg", "yeast_kegg_pathway_map"));
    }
    if (btnExportKeggPdf) {
        btnExportKeggPdf.addEventListener("click", () => exportKeggMap("pdf", "yeast_kegg_pathway_map"));
    }
    
    // ------------------------------------------------------------------
    // Gene Detail Modal Bindings
    // ------------------------------------------------------------------
    const closeModalBtn = document.getElementById("close-modal");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            document.getElementById("gene-modal").style.display = "none";
        });
    }
    window.addEventListener("click", (event) => {
        const modal = document.getElementById("gene-modal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // ------------------------------------------------------------------
    // Transcription Factor & STRING Network Toggle Bindings
    // ------------------------------------------------------------------
    const btnNetString = document.getElementById("btn-net-mode-string");
    const btnNetTF = document.getElementById("btn-net-mode-tf");
    const stringControls = document.getElementById("string-controls-wrapper");
    const subtabTFList = document.getElementById("btn-subtab-tflist");
    
    if (btnNetString && btnNetTF) {
        btnNetString.addEventListener("click", () => {
            btnNetString.classList.add("active");
            btnNetTF.classList.remove("active");
            document.getElementById("network-tab-title").textContent = "STRING-DB 단백질 상호작용 네트워크";
            if (stringControls) stringControls.style.display = "flex";
            if (subtabTFList) subtabTFList.style.display = "none";
            
            // Switch back to details subtab
            document.getElementById("btn-subtab-node").click();
            
            gNetworkMode = 'string';
            renderNetworkGraph();
        });
        
        btnNetTF.addEventListener("click", () => {
            btnNetTF.classList.add("active");
            btnNetString.classList.remove("active");
            document.getElementById("network-tab-title").textContent = "전사조절 (TF-Target) 네트워크 분석";
            if (stringControls) stringControls.style.display = "none";
            if (subtabTFList) subtabTFList.style.display = "block";
            
            // Switch to TF List subtab by default for TF mode
            if (subtabTFList) subtabTFList.click();
            
            gNetworkMode = 'tf';
            renderNetworkGraph();
        });
    }
    
    // Network Side Bar Subtabs Toggle Bindings
    const btnSubtabNode = document.getElementById("btn-subtab-node");
    const btnSubtabTFList = document.getElementById("btn-subtab-tflist");
    const nodeDetailsArea = document.getElementById("network-node-details");
    const tfListArea = document.getElementById("network-tf-list-container");
    
    if (btnSubtabNode && btnSubtabTFList) {
        btnSubtabNode.addEventListener("click", () => {
            btnSubtabNode.classList.add("active");
            btnSubtabNode.style.color = "var(--primary-color)";
            btnSubtabNode.style.borderBottom = "2px solid var(--primary-color)";
            
            btnSubtabTFList.classList.remove("active");
            btnSubtabTFList.style.color = "var(--text-muted)";
            btnSubtabTFList.style.borderBottom = "none";
            
            if (nodeDetailsArea) nodeDetailsArea.style.display = "block";
            if (tfListArea) tfListArea.style.display = "none";
        });
        
        btnSubtabTFList.addEventListener("click", () => {
            btnSubtabTFList.classList.add("active");
            btnSubtabTFList.style.color = "var(--primary-color)";
            btnSubtabTFList.style.borderBottom = "2px solid var(--primary-color)";
            
            btnSubtabNode.classList.remove("active");
            btnSubtabNode.style.color = "var(--text-muted)";
            btnSubtabNode.style.borderBottom = "none";
            
            if (nodeDetailsArea) nodeDetailsArea.style.display = "none";
            if (tfListArea) tfListArea.style.display = "block";
        });
    }
    
    // Rebuild Network Button
    const btnRebuild = document.getElementById("btn-rebuild-network");
    if (btnRebuild) {
        btnRebuild.addEventListener("click", () => {
            renderNetworkGraph();
        });
    }

    // ------------------------------------------------------------------
    // Motif Discovery Bindings
    // ------------------------------------------------------------------
    const btnRunMotif = document.getElementById("btn-run-motif");
    if (btnRunMotif) {
        btnRunMotif.addEventListener("click", () => {
            runMotifAnalysis();
        });
    }
    const btnExportMotifJpg = document.getElementById("btn-export-motif-jpg");
    const btnExportMotifPdf = document.getElementById("btn-export-motif-pdf");
    if (btnExportMotifJpg) {
        btnExportMotifJpg.addEventListener("click", () => exportPlotlyChart("motif-logo-chart", "jpeg", "yeast_motif_logo"));
    }
    if (btnExportMotifPdf) {
        btnExportMotifPdf.addEventListener("click", () => exportPlotlyChart("motif-logo-chart", "pdf", "yeast_motif_logo"));
    }
    
    // Custom GSH Pathway Refresh Binding
    const btnRefreshGsh = document.getElementById("btn-refresh-gsh-pathway");
    if (btnRefreshGsh) {
        btnRefreshGsh.addEventListener("click", loadGSHPathwayData);
    }
}

function handleHeaderSort(key, thEl) {
    if (gCurrentSortKey === key) {
        // Toggle: none -> asc -> desc -> none
        if (gCurrentSortOrder === 'none') gCurrentSortOrder = 'asc';
        else if (gCurrentSortOrder === 'asc') gCurrentSortOrder = 'desc';
        else gCurrentSortOrder = 'none';
    } else {
        gCurrentSortKey = key;
        gCurrentSortOrder = 'asc';
    }
    
    // Reset all headers state
    document.querySelectorAll(".sortable-header").forEach(th => {
        th.classList.remove("active-sort");
        const icon = th.querySelector(".sort-icon");
        if (icon) {
            icon.className = "fa-solid fa-sort sort-icon";
        }
    });
    
    // Set active header state
    if (gCurrentSortOrder !== 'none') {
        thEl.classList.add("active-sort");
        const icon = thEl.querySelector(".sort-icon");
        if (icon) {
            if (gCurrentSortOrder === 'asc') {
                icon.className = "fa-solid fa-sort-up sort-icon";
            } else {
                icon.className = "fa-solid fa-sort-down sort-icon";
            }
        }
    }
    
    renderDEGTable();
}

function renderDEGTable() {
    const log2fcThresh = parseFloat(document.getElementById("log2fc-thresh").value) || 0;
    const pvalThresh = parseFloat(document.getElementById("pvalue-thresh").value) || 1.0;
    const searchVal = document.getElementById("search-gene").value.toLowerCase();
    
    const tbody = document.getElementById("deg-table-body");
    tbody.innerHTML = "";
    
    let upCount = 0;
    let downCount = 0;
    let filteredCount = 0;
    const statType = document.getElementById("stat-type") ? document.getElementById("stat-type").value : "fdr";
    
    // Sort logic
    let sortedGenes = [...gGenes];
    if (gCurrentSortKey && gCurrentSortOrder !== 'none') {
        const key = gCurrentSortKey;
        const order = gCurrentSortOrder === 'asc' ? 1 : -1;
        
        sortedGenes.sort((a, b) => {
            let valA, valB;
            
            if (key === "classification") {
                const getClassification = (gene) => {
                    const statVal = statType === "fdr" ? gene.fdr : gene.pvalue;
                    const passesLog2FC = Math.abs(gene.log2fc) >= log2fcThresh;
                    let passesPVal = true;
                    if (statType !== "none" && gIsReplicateMode) {
                        passesPVal = (statVal !== null && statVal <= pvalThresh);
                    }
                    if (passesLog2FC && passesPVal) {
                        if (gene.log2fc >= log2fcThresh) return "Upregulated";
                        if (gene.log2fc <= -log2fcThresh) return "Downregulated";
                    }
                    return "Neutral";
                };
                valA = getClassification(a);
                valB = getClassification(b);
            } else {
                valA = a[key];
                valB = b[key];
            }
            
            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;
            
            if (typeof valA === "string") {
                return order * valA.localeCompare(valB);
            } else {
                return order * (valA - valB);
            }
        });
    } else {
        // Fallback to original order
        sortedGenes.sort((a, b) => (a.original_index || 0) - (b.original_index || 0));
    }
    
    sortedGenes.forEach(gene => {
        const symbol = gene.gene_symbol.toLowerCase();
        const locus = gene.locus_tag.toLowerCase();
        
        // Search filter
        if (searchVal && !symbol.includes(searchVal) && !locus.includes(searchVal)) {
            return;
        }
        
        // Determine DEG classification
        let classification = "Neutral";
        let classClass = "";
        
        const statVal = statType === "fdr" ? gene.fdr : gene.pvalue;
        
        const passesLog2FC = Math.abs(gene.log2fc) >= log2fcThresh;
        let passesPVal = true;
        if (statType !== "none" && gIsReplicateMode) {
            passesPVal = (statVal !== null && statVal <= pvalThresh);
        }
        
        if (passesLog2FC && passesPVal) {
            if (gene.log2fc >= log2fcThresh) {
                classification = "Upregulated";
                classClass = "up-text";
                upCount++;
            } else if (gene.log2fc <= -log2fcThresh) {
                classification = "Downregulated";
                classClass = "down-text";
                downCount++;
            }
        }
        
        filteredCount++;
        
        // Append row
        const row = document.createElement("tr");
        if (gSelectedGene && gSelectedGene.locus_tag === gene.locus_tag) {
            row.classList.add("selected");
        }
        
        row.innerHTML = `
            <td><code>${gene.locus_tag}</code></td>
            <td><strong>${gene.gene_symbol}</strong></td>
            <td>${gene.wt_val}</td>
            <td>${gene.mutant_val}</td>
            <td class="${gene.log2fc >= 0 ? 'up-text' : 'down-text'}">${gene.log2fc > 0 ? '+' : ''}${gene.log2fc}</td>
            <td>${gene.pvalue !== null ? gene.pvalue : '-'}</td>
            <td>${gene.fdr !== null ? gene.fdr : '-'}</td>
            <td class="${classClass}">${classification}</td>
            <td class="text-muted" title="${gene.description}">${gene.description.length > 50 ? gene.description.substring(0, 50) + "..." : gene.description}</td>
        `;
        
        row.addEventListener("click", () => {
            // Highlight row
            document.querySelectorAll("#deg-table tr").forEach(r => r.classList.remove("selected"));
            row.classList.add("selected");
            
            // Show detail panel
            showGeneDetails(gene);
        });
        
        tbody.appendChild(row);
    });
    
    // Update badges
    document.getElementById("stat-up-count").textContent = upCount;
    document.getElementById("stat-down-count").textContent = downCount;
    document.getElementById("stat-total-count").textContent = gGenes.length;
}

// ----------------------------------------------------------------------
// 4. Volcano / MA Plot Redrawing
// ----------------------------------------------------------------------
function renderVolcanoOrMAPlot() {
    const showVolcano = gIsReplicateMode && document.getElementById("btn-show-volcano").classList.contains("active");
    renderPlot(showVolcano ? "volcano" : "ma");
}

function renderPlot(plotType) {
    const log2fcThresh = parseFloat(document.getElementById("log2fc-thresh").value) || 0;
    const rawPvalThresh = document.getElementById("pvalue-thresh") ? parseFloat(document.getElementById("pvalue-thresh").value) : 0.05;
    const pvalThresh = isNaN(rawPvalThresh) ? 0.05 : rawPvalThresh;
    const statType = document.getElementById("stat-type") ? document.getElementById("stat-type").value : "fdr";
    
    const xData = [];
    const yData = [];
    const textData = [];
    const colorData = [];
    const customData = [];
    
    let topDegCandidates = [];
    
    gGenes.forEach(gene => {
        const statVal = statType === "fdr" ? gene.fdr : gene.pvalue;
        let passesPVal = true;
        if (statType !== "none" && gIsReplicateMode) {
            passesPVal = (statVal !== null && statVal !== undefined && !isNaN(statVal) && statVal <= pvalThresh);
        }
        const isUp = gene.log2fc >= log2fcThresh && passesPVal;
        const isDown = gene.log2fc <= -log2fcThresh && passesPVal;
        
        let color = '#94a3b8'; // Neutral (Gray)
        if (isUp) color = '#ef4444'; // Upregulated DEG (Bright Red)
        if (isDown) color = '#3b82f6'; // Downregulated DEG (Bright Blue)
        
        let yVal = 0;
        if (plotType === "volcano") {
            xData.push(gene.log2fc);
            const yStatVal = statType === "none" ? (gene.fdr || gene.pvalue) : statVal;
            yVal = (yStatVal !== null && yStatVal !== undefined && yStatVal > 0) ? -Math.log10(yStatVal) : 0;
            yData.push(yVal);
        } else {
            const meanExpr = (gene.wt_val + gene.mutant_val) / 2;
            const xVal = meanExpr > 0 ? Math.log2(meanExpr) : 0;
            xData.push(xVal);
            yData.push(gene.log2fc);
            yVal = Math.abs(gene.log2fc);
        }
        
        if (passesPVal && (isUp || isDown)) {
            topDegCandidates.push({
                gene: gene,
                symbol: gene.gene_symbol || gene.locus_tag,
                x: plotType === "volcano" ? gene.log2fc : (Math.log2(((gene.wt_val + gene.mutant_val) / 2) || 1)),
                y: yVal,
                score: yVal * Math.abs(gene.log2fc)
            });
        }
        
        const statLabel = statType === "fdr" ? "FDR" : "p-value";
        textData.push(`${gene.gene_symbol} (${gene.locus_tag})<br>Log2FC: ${gene.log2fc}<br>${statLabel}: ${statVal !== null ? statVal : '-'}`);
        colorData.push(color);
        customData.push(gene);
    });
    
    // Sort top DEGs by significance score for auto-annotations
    topDegCandidates.sort((a, b) => b.score - a.score);
    const topDegsToAnnotate = topDegCandidates.slice(0, 8);
    
    const markerSize = gGenes.length > 2000 ? 5 : 6;
    
    const trace = {
        x: xData,
        y: yData,
        mode: 'markers',
        type: 'scattergl',
        text: textData,
        marker: {
            size: markerSize,
            color: colorData,
            opacity: 0.55,
            line: {
                color: 'rgba(255,255,255,0.3)',
                width: 0.3
            }
        },
        customdata: customData
    };
    
    const annotations = topDegsToAnnotate.map(item => ({
        x: item.x,
        y: item.y,
        text: item.symbol,
        showarrow: true,
        arrowhead: 2,
        arrowsize: 0.8,
        arrowwidth: 1,
        arrowcolor: '#475569',
        ax: item.x > 0 ? 25 : -25,
        ay: -20,
        font: {
            family: 'Inter, sans-serif',
            size: 11,
            color: '#0f172a'
        },
        bgcolor: 'rgba(255,255,255,0.85)',
        bordercolor: '#cbd5e1',
        borderwidth: 1,
        borderpad: 2
    }));
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            color: '#0f172a',
            family: 'Inter, sans-serif'
        },
        xaxis: {
            title: plotType === "volcano" ? 'Log2 Fold Change' : 'Log2 Mean Expression (TPM)',
            gridcolor: '#e2e8f0',
            zerolinecolor: '#cbd5e1'
        },
        yaxis: {
            title: plotType === "volcano" ? (statType === "fdr" || statType === "none" ? '-Log10(FDR)' : '-Log10(p-value)') : 'Log2 Fold Change',
            gridcolor: '#e2e8f0',
            zerolinecolor: '#cbd5e1'
        },
        margin: { t: 25, r: 25, b: 65, l: 60 },
        hovermode: 'closest',
        annotations: annotations,
        shapes: []
    };
    
    // Add thresh lines
    if (plotType === "volcano") {
        const maxY = yData.length > 0 ? Math.max(...yData) : 5;
        const maxX = xData.length > 0 ? Math.max(...xData.map(Math.abs)) : 3;
        layout.shapes.push(
            // Vertical -thresh line
            {
                type: 'line',
                x0: -log2fcThresh, x1: -log2fcThresh,
                y0: 0, y1: maxY * 1.05,
                line: { color: 'rgba(15, 23, 42, 0.35)', width: 1, dash: 'dash' }
            },
            // Vertical +thresh line
            {
                type: 'line',
                x0: log2fcThresh, x1: log2fcThresh,
                y0: 0, y1: maxY * 1.05,
                line: { color: 'rgba(15, 23, 42, 0.35)', width: 1, dash: 'dash' }
            }
        );
        if (gIsReplicateMode && statType !== "none" && pvalThresh > 0 && pvalThresh <= 1.0) {
            const hVal = -Math.log10(pvalThresh);
            layout.shapes.push(
                // Horizontal FDR line
                {
                    type: 'line',
                    x0: -maxX * 1.1, x1: maxX * 1.1,
                    y0: hVal, y1: hVal,
                    line: { color: 'rgba(15, 23, 42, 0.35)', width: 1, dash: 'dash' }
                }
            );
        }
    } else {
        // MA Plot thresholds
        layout.shapes.push(
            {
                type: 'line',
                x0: 0, x1: Math.max(...xData) * 1.05,
                y0: log2fcThresh, y1: log2fcThresh,
                line: { color: 'rgba(15, 23, 42, 0.25)', width: 1, dash: 'dash' }
            },
            {
                type: 'line',
                x0: 0, x1: Math.max(...xData) * 1.05,
                y0: -log2fcThresh, y1: -log2fcThresh,
                line: { color: 'rgba(15, 23, 42, 0.25)', width: 1, dash: 'dash' }
            }
        );
    }
    
    Plotly.newPlot('plotly-chart', [trace], layout, {responsive: true});
    
    // Register click event
    const plotEl = document.getElementById('plotly-chart');
    plotEl.on('plotly_click', (data) => {
        if (data.points && data.points[0]) {
            const gene = data.points[0].customdata;
            showGeneDetails(gene);
        }
    });
}

// Helper to generate species-specific UniProt DB link URL
function getUniprotUrl(gene) {
    if (!gene) return "https://www.uniprot.org";
    let locus = gene.locus_tag || gene.gene_symbol || (typeof gene === 'string' ? gene : "");
    let symbol = gene.gene_symbol || locus;
    
    // For C. glutamicum, UniProtKB indexes using Cgl prefix (e.g. Cgl1206) instead of NCBI NCgl prefix (e.g. NCgl1206)
    if (gCurrentSpecies === "cgl" && locus) {
        if (/^NCgl/i.test(locus)) {
            locus = locus.replace(/^NCgl/i, "Cgl");
        } else if (/^cg/i.test(locus) && !/^Cgl/i.test(locus)) {
            locus = locus.replace(/^cg/i, "Cgl");
        }
    }
    
    const query = locus || symbol;
    
    let taxId = "";
    if (gCurrentSpecies === "cgl") taxId = "196627";
    else if (gCurrentSpecies === "eco") taxId = "83333";
    else if (gCurrentSpecies === "sce") taxId = "559292";
    
    if (taxId) {
        return `https://www.uniprot.org/uniprotkb?query=${encodeURIComponent(query)}+AND+taxonomy_id:${taxId}`;
    }
    return `https://www.uniprot.org/uniprotkb?query=${encodeURIComponent(query)}`;
}

// ----------------------------------------------------------------------
// 5. Gene Detail Panel
// ----------------------------------------------------------------------
function showGeneDetails(gene) {
    gSelectedGene = gene;
    const uniprotUrl = getUniprotUrl(gene);
    
    const panel = document.getElementById("gene-detail-body");
    panel.innerHTML = `
        <div class="gene-detail-card">
            <div class="gene-detail-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="gene-detail-title">${gene.gene_symbol}</span>
                    <span class="gene-detail-locus">${gene.locus_tag}</span>
                </div>
                <a href="${uniprotUrl}" target="_blank" rel="noopener noreferrer" class="uniprot-badge-btn" title="UniProt에서 ${gene.gene_symbol || gene.locus_tag} 단백질 3D 구조 및 상세 정보 보기">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> UniProt DB
                </a>
            </div>
            <p class="gene-detail-desc">${gene.description || '유전자 설명이 존재하지 않습니다.'}</p>
            
            <div class="gene-detail-grid">
                <div class="detail-item">
                    <span class="detail-lbl">WT 평균 발현량</span>
                    <span class="detail-val">${gene.wt_val}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-lbl">Mutant 평균 발현량</span>
                    <span class="detail-val">${gene.mutant_val}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-lbl">Log2 Fold Change</span>
                    <span class="detail-val ${gene.log2fc >= 0 ? 'up-text' : 'down-text'}">${gene.log2fc}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-lbl">FDR (Adjusted P-val)</span>
                    <span class="detail-val">${gene.fdr !== null ? gene.fdr : '-'}</span>
                </div>
            </div>
            
            <div id="plotly-bar-detail" style="height: 250px; width: 100%;"></div>
        </div>
    `;
    
    // Render detail WT vs Mutant bar chart
    renderDetailChart(gene);
    
    // If we clicked from DEG table, we should also navigate to Volcano tab to show the detail side panel
    if (gActiveTab !== 'volcano-tab') {
        switchTab('volcano-tab');
    }
}

// Global IGV Browser instance holder
let gIgvBrowserInstance = null;

function openGeneIGVModal(gene) {
    const modal = document.getElementById("gene-modal");
    if (!modal) return;
    
    document.getElementById("modal-gene-title").textContent = `${gene.gene_symbol} (${gene.locus_tag})`;
    document.getElementById("modal-gene-desc").textContent = gene.description || '유전자 설명이 존재하지 않습니다.';
    
    modal.style.display = "flex";
    
    // Bind Close events
    const closeBtn = document.getElementById("close-modal");
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
    }
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };
    
    // Render a copy of the bar chart inside the modal
    setTimeout(() => {
        let trace1, trace2;
        if (gIsReplicateMode && gene.wt_reps && gene.mut_reps) {
            trace1 = {
                x: ['WT', 'Mutant'],
                y: [gene.wt_val, gene.mutant_val],
                type: 'bar',
                name: '평균값',
                marker: { color: ['rgba(99, 102, 241, 0.4)', 'rgba(239, 68, 68, 0.4)'] }
            };
            const repX = [];
            const repY = [];
            gene.wt_reps.forEach(v => { repX.push('WT'); repY.push(v); });
            gene.mut_reps.forEach(v => { repX.push('Mutant'); repY.push(v); });
            trace2 = {
                x: repX,
                y: repY,
                mode: 'markers',
                type: 'scatter',
                name: '반복구',
                marker: { size: 10, color: ['#6366f1', '#6366f1', '#6366f1', '#ff4d4d', '#ff4d4d', '#ff4d4d'], opacity: 0.9 }
            };
        } else {
            trace1 = {
                x: ['WT', 'Mutant'],
                y: [gene.wt_val, gene.mutant_val],
                type: 'bar',
                marker: { color: ['#6366f1', '#ff4d4d'] }
            };
        }
        const layout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#0f172a', family: 'Inter, sans-serif' },
            xaxis: { gridcolor: '#e2e8f0' },
            yaxis: { title: 'Expression Value', gridcolor: '#e2e8f0' },
            margin: { t: 20, r: 10, b: 30, l: 50 },
            showlegend: false,
            height: 220
        };
        Plotly.newPlot('modal-chart', trace2 ? [trace1, trace2] : [trace1], layout, {responsive: true});
    }, 100);
}

function renderDetailChart(gene) {
    let trace1, trace2;
    
    if (gIsReplicateMode && gene.wt_reps && gene.mut_reps) {
        // Show replicates as bar + scatter points
        trace1 = {
            x: ['WT', 'Mutant'],
            y: [gene.wt_val, gene.mutant_val],
            type: 'bar',
            name: '평균값',
            marker: { color: ['rgba(59, 130, 246, 0.4)', 'rgba(239, 68, 68, 0.4)'] }
        };
        
        // Replicate dots
        const repX = [];
        const repY = [];
        gene.wt_reps.forEach(v => { repX.push('WT'); repY.push(v); });
        gene.mut_reps.forEach(v => { repX.push('Mutant'); repY.push(v); });
        
        trace2 = {
            x: repX,
            y: repY,
            mode: 'markers',
            type: 'scatter',
            name: '반복구',
            marker: { size: 10, color: ['#3b82f6', '#3b82f6', '#3b82f6', '#ff4d4d', '#ff4d4d', '#ff4d4d'], opacity: 0.9 }
        };
    } else {
        // Average mode, show simple bar
        trace1 = {
            x: ['WT', 'Mutant'],
            y: [gene.wt_val, gene.mutant_val],
            type: 'bar',
            marker: { color: ['#3b82f6', '#ff4d4d'] }
        };
    }
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            color: '#0f172a',
            family: 'Inter, sans-serif'
        },
        xaxis: {
            gridcolor: '#e2e8f0'
        },
        yaxis: {
            title: 'Expression (TPM/FPKM)',
            gridcolor: '#e2e8f0'
        },
        margin: { t: 20, r: 10, b: 30, l: 50 },
        showlegend: false
    };
    
    const data = trace2 ? [trace1, trace2] : [trace1];
    Plotly.newPlot('plotly-bar-detail', data, layout, {responsive: true});
}

// ----------------------------------------------------------------------
// 6. Heatmap View
// ----------------------------------------------------------------------
function renderHeatmap() {
    if (gGenes.length === 0) return;
    
    const count = parseInt(document.getElementById("heatmap-count").value);
    const metric = document.getElementById("heatmap-metric").value;
    const applyClustering = document.getElementById("heatmap-cluster").checked;
    const chartDiv = document.getElementById("plotly-heatmap");
    
    const heightInput = document.getElementById("heatmap-height");
    const heatmapHeight = heightInput ? parseInt(heightInput.value) : 600;
    if (chartDiv) {
        chartDiv.style.height = `${heatmapHeight}px`;
    }
    
    const gapInput = document.getElementById("heatmap-dendro-gap");
    const gapRatio = gapInput ? parseFloat(gapInput.value) / 100.0 : 0.02;
    
    const gapTopInput = document.getElementById("heatmap-dendro-gap-top");
    const gapRatioTop = gapTopInput ? parseFloat(gapTopInput.value) / 100.0 : 0.01;
    
    if (!applyClustering) {
        // Simple mock hierarchical clustering for layout (Local mode)
        let sorted = [...gGenes];
        if (metric === "log2fc") {
            sorted.sort((a, b) => Math.abs(b.log2fc) - Math.abs(a.log2fc));
        } else {
            sorted = sorted.filter(g => g.fdr !== null);
            sorted.sort((a, b) => a.fdr - b.fdr);
        }
        
        const topGenes = sorted.slice(0, count);
        
        const yLabels = [];
        const zDataWT = [];
        const zDataMutant = [];
        
        topGenes.forEach(gene => {
            yLabels.push(`${gene.gene_symbol} (${gene.locus_tag})`);
            let wtVals = [gene.wt_val];
            let mutVals = [gene.mutant_val];
            if (gIsReplicateMode && gene.wt_reps && gene.mut_reps) {
                wtVals = gene.wt_reps;
                mutVals = gene.mut_reps;
            }
            
            const allVals = [...wtVals, ...mutVals];
            const mean = npMean(allVals);
            const std = npStd(allVals) || 1.0;
            
            zDataWT.push(wtVals.map(v => (v - mean) / std));
            zDataMutant.push(mutVals.map(v => (v - mean) / std));
        });
        
        let wtCount = zDataWT[0].length;
        let mutCount = zDataMutant[0].length;
        
        // 1. Build original sample candidates map
        const samplesList = [];
        for (let i = 0; i < wtCount; i++) {
            samplesList.push({ name: wtCount > 1 ? `WT_Rep${i+1}` : 'WT', type: 'wt', localIdx: i });
        }
        for (let i = 0; i < mutCount; i++) {
            samplesList.push({ name: mutCount > 1 ? `Mutant_Rep${i+1}` : 'Mutant', type: 'mutant', localIdx: i });
        }
        
        // 2. Perform sorting logic based on dropdown choices
        const orderTypeSelect = document.getElementById("heatmap-sample-order-type");
        const orderType = orderTypeSelect ? orderTypeSelect.value : "wt-mutant";
        
        let orderedSamples = [];
        if (orderType === "wt-mutant") {
            orderedSamples = [...samplesList];
        } else if (orderType === "mutant-wt") {
            orderedSamples = [
                ...samplesList.filter(s => s.type === 'mutant'),
                ...samplesList.filter(s => s.type === 'wt')
            ];
        } else if (orderType === "custom") {
            const customInput = document.getElementById("heatmap-sample-order-custom");
            const customVal = customInput ? customInput.value : "";
            const customNames = customVal.split(",").map(s => s.trim().toUpperCase()).filter(s => s !== "");
            
            customNames.forEach(cName => {
                const found = samplesList.find(s => s.name.toUpperCase() === cName);
                if (found && !orderedSamples.includes(found)) {
                    orderedSamples.push(found);
                }
            });
            
            // Append missing samples safely to prevent data loss
            samplesList.forEach(s => {
                if (!orderedSamples.includes(s)) {
                    orderedSamples.push(s);
                }
            });
        } else {
            orderedSamples = [...samplesList];
        }
        
        // 3. Assemble xLabels and zDataMatrix with the reordered samples
        const xLabels = orderedSamples.map(s => s.name);
        const zDataMatrix = [];
        
        for (let r = 0; r < yLabels.length; r++) {
            const rowWT = zDataWT[r];
            const rowMutant = zDataMutant[r];
            const reorderedRow = orderedSamples.map(s => {
                return s.type === 'wt' ? rowWT[s.localIdx] : rowMutant[s.localIdx];
            });
            zDataMatrix.push(reorderedRow);
        }
        
        const trace = {
            z: zDataMatrix,
            x: xLabels,
            y: yLabels,
            type: 'heatmap',
            colorscale: [
                [0, '#0000ff'],      // Deep Blue
                [0.5, '#ffffff'],    // White
                [1, '#ff0000']       // Deep Red
            ],
            colorbar: {
                title: 'Z-score',
                titleside: 'right'
            },
            hoverongaps: false
        };
        
        const layout = {
            height: heatmapHeight,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#0f172a', family: 'Inter, sans-serif' },
            margin: { t: 50, r: 20, b: 40, l: 150 },
            xaxis: { side: 'top', tickangle: -45 },
            yaxis: { autorange: 'reversed', showgrid: false }
        };
        
        Plotly.newPlot('plotly-heatmap', [trace], layout, {responsive: true});
    } else {
        // Advanced Hierarchical Clustering with Dendrograms (Server mode)
        chartDiv.innerHTML = `<div style="text-align: center; padding-top: 150px; color: #64748b;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top: 10px;">이차원 계층 클러스터링(Heatmap & Dendrogram) 연산 중...</p></div>`;
        
        // Extract top genes based on criteria
        let sorted = [...gGenes];
        if (metric === "log2fc") {
            sorted.sort((a, b) => Math.abs(b.log2fc) - Math.abs(a.log2fc));
        } else {
            sorted = sorted.filter(g => g.fdr !== null);
            sorted.sort((a, b) => a.fdr - b.fdr);
        }
        const topGenes = sorted.slice(0, count);
        const geneLocusTags = topGenes.map(g => g.locus_tag);

        fetch(`${API_URL}/api/cluster_heatmap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                genes: geneLocusTags,
                count: count,
                metric: metric,
                species: gCurrentSpecies,
                session_id: gActiveSessionId
            })
        })
        .then(r => r.json())
        .then(data => {
            if (!data.success) {
                chartDiv.innerHTML = `<div class="text-center text-danger" style="padding-top: 150px;">클러스터링 연산 실패: ${data.detail}</div>`;
                return;
            }
            
            const xLabels = data.x_labels || [];
            const yLabels = data.y_labels || [];
            const zMatrix = data.expression_matrix || [];
            const geneDendro = data.gene_dendrogram;
            const sampleDendro = data.sample_dendrogram;
            
            const traces = [];
            
            // Generate index arrays for linear scale matching
            const xIndices = xLabels.map((_, i) => i);
            const yIndices = yLabels.map((_, i) => i);
            
            // 1. Heatmap Trace
            const heatmapTrace = {
                z: zMatrix,
                x: xIndices,
                y: yIndices,
                type: 'heatmap',
                xaxis: 'x',
                yaxis: 'y',
                colorscale: [
                    [0, '#0000ff'],
                    [0.5, '#ffffff'],
                    [1, '#ff0000']
                ],
                colorbar: {
                    title: 'Z-score',
                    titleside: 'right',
                    len: 0.8,
                    y: 0.4
                },
                hoverongaps: false
            };
            traces.push(heatmapTrace);
            
            // 2. Gene Dendrogram Trace (Y-axis hierarchy)
            if (geneDendro && geneDendro.x && geneDendro.x.length > 0) {
                const gdX = [];
                const gdY = [];
                geneDendro.x.forEach((xs, idx) => {
                    const ys = geneDendro.y[idx];
                    gdX.push(...xs, null);
                    gdY.push(...ys, null);
                });
                
                const geneDendroTrace = {
                    x: gdX,
                    y: gdY,
                    type: 'scatter',
                    mode: 'lines',
                    xaxis: 'x2',
                    yaxis: 'y',
                    line: { color: '#475569', width: 1.5 },
                    hoverinfo: 'none',
                    showlegend: false
                };
                traces.push(geneDendroTrace);
            }
            
            // 3. Sample Dendrogram Trace (X-axis hierarchy)
            if (sampleDendro && sampleDendro.x && sampleDendro.x.length > 0) {
                const sdX = [];
                const sdY = [];
                sampleDendro.x.forEach((xs, idx) => {
                    const ys = sampleDendro.y[idx];
                    sdX.push(...xs, null);
                    sdY.push(...ys, null);
                });
                
                const sampleDendroTrace = {
                    x: sdX,
                    y: sdY,
                    type: 'scatter',
                    mode: 'lines',
                    xaxis: 'x3',
                    yaxis: 'y2',
                    line: { color: '#475569', width: 1.5 },
                    hoverinfo: 'none',
                    showlegend: false
                };
                traces.push(sampleDendroTrace);
            }
            
            // Calculate dynamic margins and domain boundaries
            const gap = gapRatio;
            
            // X-axis layouts:
            const xHeatmapStart = 0.24;
            const xGeneDendroEnd = Math.max(0.0, xHeatmapStart - gap);
            
            // Y-axis layouts:
            // 1) Heatmap matrix: [0.0, yHeatmapEnd] -> Sample names attach directly at yHeatmapEnd
            // 2) Blank Clearance Gap: 65px (45px rotated text height + 20px clean blank gap)
            // 3) Sample dendrogram tree: [ySampleDendroStart, 1.0] -> 75px fixed tree height
            const marginT = 30;
            const marginB = 40;
            const availablePlotHeight = Math.max(150, heatmapHeight - marginT - marginB);
            
            const sampleTextClearancePx = 65; // 45px text height + 20px clean open gap
            const dendroTreePx = 75;          // 75px top dendrogram tree height
            const userGapPx = (gapRatioTop * 100) * 1.5;
            
            const sampleTextFraction = Math.min(0.25, sampleTextClearancePx / availablePlotHeight);
            const dendroTreeFraction = Math.min(0.35, dendroTreePx / availablePlotHeight);
            const gapFraction = userGapPx / availablePlotHeight;
            
            const totalTopFraction = sampleTextFraction + dendroTreeFraction + gapFraction;
            const yHeatmapEnd = Math.max(0.35, 1.0 - totalTopFraction);
            const ySampleDendroStart = Math.min(0.99, yHeatmapEnd + sampleTextFraction + gapFraction);

            // Calculate exact X and Y axis coordinate bounds for 1:1 pixel alignment
            const numSamples = xLabels.length;
            const numGenes = yLabels.length;
            const xMin = -0.5;
            const xMax = numSamples - 0.5;

            const layout = {
                height: heatmapHeight,
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#0f172a', family: 'Inter, sans-serif' },
                margin: { t: 30, r: 20, b: 40, l: 150 },
                showlegend: false,
                
                // Axis configurations for subplot domain partitioning
                // X1 is for Heatmap Matrix & Top Sample Labels (directly attached to top edge of heatmap)
                xaxis: {
                    domain: [xHeatmapStart, 1.0],
                    range: [xMin, xMax],
                    side: 'top',
                    tickangle: -45,
                    showgrid: false,
                    zeroline: false,
                    tickvals: xIndices,
                    ticktext: xLabels
                },
                // Y1 is for Heatmap Matrix & Gene Labels (range explicitly set to remove top axis padding)
                yaxis: {
                    domain: [0.0, yHeatmapEnd],
                    range: [numGenes - 0.5, -0.5],
                    showgrid: false,
                    zeroline: false,
                    tickvals: yIndices,
                    ticktext: yLabels
                },
                
                // X2 is for Gene Dendrogram (Left side)
                xaxis2: {
                    domain: [0.0, xGeneDendroEnd],
                    showgrid: false,
                    zeroline: false,
                    showticklabels: false,
                    autorange: 'reversed' // Branch outwards towards the left
                },
                
                // X3 & Y2 are for Sample Dendrogram (Top side, aligned 1:1 with xaxis)
                xaxis3: {
                    domain: [xHeatmapStart, 1.0],
                    range: [xMin, xMax],
                    showgrid: false,
                    zeroline: false,
                    showticklabels: false
                },
                yaxis2: {
                    domain: [ySampleDendroStart, 1.0],
                    range: [-0.02, 1.05],
                    showgrid: false,
                    zeroline: false,
                    showticklabels: false
                }
            };
            
            chartDiv.innerHTML = "";
            Plotly.newPlot('plotly-heatmap', traces, layout, {responsive: true});
        })
        .catch(err => {
            console.error("Clustering API 오류:", err);
            chartDiv.innerHTML = `<div class="text-center text-danger" style="padding-top: 150px;"><i class="fa-solid fa-triangle-exclamation fa-2x mb-10"></i><p>클러스터링 로드 실패: ${err.message}</p></div>`;
        });
    }
}

// Simple stats helpers in JS
function npMean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function npStd(arr) {
    const mean = npMean(arr);
    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
}

// ----------------------------------------------------------------------
// 7. KEGG Pathway View
// ----------------------------------------------------------------------
function fetchKEGGPathways() {
    const listEl = document.getElementById("kegg-pathway-list");
    if (!listEl) return;
    const speciesLabel = (gCurrentSpecies === 'cgl') ? 'C. glutamicum' : 'Yeast';
    listEl.innerHTML = `<li class="loading-item">KEGG ${speciesLabel} 경로 목록을 가져오고 있습니다...</li>`;
    
    let url = `${API_URL}/api/pathways?species=${gCurrentSpecies}`;
    if (gActiveSessionId) {
        url += `&session_id=${gActiveSessionId}`;
    }
    
    fetch(url)
        .then(r => r.json())
        .then(data => {
            gPathwayList = data.pathways;
            
            // Clear input search term on fetch new dataset
            const searchInput = document.getElementById("kegg-search-gene");
            if (searchInput) searchInput.value = "";
            
            renderPathwayList("");
        })
        .catch(err => {
            listEl.innerHTML = `<li class="loading-item text-danger">실패: ${err.message}</li>`;
        });
}

function renderPathwayList(keyword) {
    const listEl = document.getElementById("kegg-pathway-list");
    listEl.innerHTML = "";
    
    if (!gPathwayList || gPathwayList.length === 0) {
        listEl.innerHTML = '<li class="loading-item text-muted">경로 데이터가 없습니다.</li>';
        return;
    }
    
    const searchVal = keyword.trim().toUpperCase();
    const filtered = gPathwayList.filter(path => {
        if (!searchVal) return true;
        // Search by Pathway ID or description
        if (path.pathway_id.toUpperCase().includes(searchVal) || path.description.toUpperCase().includes(searchVal)) {
            return true;
        }
        // Search by contained gene symbols or locus_tags
        if (path.search_genes && path.search_genes.some(g => g.includes(searchVal))) {
            return true;
        }
        return false;
    });
    
    if (filtered.length === 0) {
        listEl.innerHTML = '<li class="loading-item text-muted">검색 조건에 맞는 경로가 없습니다.</li>';
        return;
    }
    
    filtered.forEach(path => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="kegg-path-desc" title="${path.description}">
                <span class="kegg-path-id">${path.pathway_id}</span>
                ${path.description}
            </div>
            <span class="kegg-gene-count-badge">${path.gene_count} 유전자 매핑</span>
        `;
        
        li.addEventListener("click", () => {
            document.querySelectorAll("#kegg-pathway-list li").forEach(el => el.classList.remove("active"));
            li.classList.add("active");
            
            loadPathwayMap(path);
        });
        
        listEl.appendChild(li);
    });
}

function loadPathwayMap(path) {
    const container = document.getElementById("kegg-map-container");
    container.innerHTML = `
        <div class="no-pathway-selected">
            <i class="fa-solid fa-circle-notch fa-spin map-big-icon"></i>
            <p>KEGG 서버로부터 색상 맵핑 지도 생성 중...</p>
            <p class="sub-hint">대사 경로 상의 유전자 발현량에 따라 색칠된 원본 지도를 가져오고 있습니다.</p>
        </div>
    `;
    
    document.getElementById("kegg-map-title").textContent = `KEGG: ${path.description} (${path.pathway_id})`;
    
    let url = `${API_URL}/api/pathway_map/${path.pathway_id}?species=${gCurrentSpecies}`;
    if (gActiveSessionId) {
        url += `&session_id=${gActiveSessionId}`;
    }
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("KEGG 연동에 실패했습니다. (네트워크 연결 혹은 KEGG API 한계 도달)");
            }
            return response.json();
        })
        .then(data => {
            renderPathwayImageViewer(data);
        })
        .catch(err => {
            container.innerHTML = `
                <div class="no-pathway-selected text-danger">
                    <i class="fa-solid fa-triangle-exclamation map-big-icon"></i>
                    <p>KEGG 지도 로드 실패</p>
                    <p class="sub-hint">${err.message}</p>
                </div>
            `;
        });
}

function getGeneColor(log2fc) {
    if (log2fc === null || log2fc === undefined) return null;
    
    if (log2fc > 0) {
        const ratio = Math.min(log2fc / 2.5, 1.0);
        // Semi-transparent Red (Up-regulated)
        return `rgba(239, 68, 68, ${0.4 + ratio * 0.45})`;
    } else {
        const ratio = Math.min(Math.abs(log2fc) / 2.5, 1.0);
        // Semi-transparent Blue (Down-regulated)
        return `rgba(59, 130, 246, ${0.4 + ratio * 0.45})`;
    }
}

function renderPathwayImageViewer(data) {
    const container = document.getElementById("kegg-map-container");
    container.innerHTML = "";
    
    // Create wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "kegg-image-wrapper";
    
    // Create image
    const img = document.createElement("img");
    img.src = data.image;
    img.useMap = "#keggmap_client";
    wrapper.appendChild(img);
    
    // Create Map
    const map = document.createElement("map");
    map.name = "keggmap_client";
    map.id = "keggmap_client";
    
    // Create custom tooltip element
    let tooltip = document.getElementById("kegg-active-tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "kegg-active-tooltip";
        tooltip.className = "kegg-tooltip";
        document.body.appendChild(tooltip);
    }
    
    data.areas.forEach(area => {
        const areaEl = document.createElement("area");
        areaEl.shape = area.shape;
        areaEl.coords = area.coords;
        areaEl.alt = area.title;
        areaEl.href = "#"; // Prevent navigation
        
        // If it's a rect gene node and has log2fc, draw a styled colored overlay box
        if (area.shape === "rect" && area.log2fc !== null) {
            const coordsArr = area.coords.split(",").map(Number);
            if (coordsArr.length === 4) {
                const [x1, y1, x2, y2] = coordsArr;
                const overlay = document.createElement("div");
                overlay.className = "kegg-node-overlay";
                
                // Check if current search query matches this node
                const searchInput = document.getElementById("kegg-search-gene");
                const currentQuery = searchInput ? searchInput.value.trim().toUpperCase() : "";
                
                let isMatched = false;
                if (currentQuery) {
                    const genesList = area.gene.toUpperCase().split("+");
                    if (genesList.some(g => g === currentQuery)) {
                        isMatched = true;
                    }
                    if (area.title && area.title.toUpperCase().includes(currentQuery)) {
                        isMatched = true;
                    }
                    
                    // Support check by related genes from full dataset
                    const matchedGeneInData = gGenes.find(g => 
                        g.locus_tag.toUpperCase() === currentQuery || 
                        g.gene_symbol.toUpperCase() === currentQuery
                    );
                    if (matchedGeneInData) {
                        const targetLocus = matchedGeneInData.locus_tag.toUpperCase();
                        const targetSymbol = matchedGeneInData.gene_symbol.toUpperCase();
                        if (genesList.some(g => g === targetLocus || g === targetSymbol) ||
                            (area.title && (area.title.toUpperCase().includes(targetLocus) || area.title.toUpperCase().includes(targetSymbol)))) {
                            isMatched = true;
                        }
                    }
                }
                
                if (isMatched) {
                    overlay.classList.add("highlight-active");
                }
                
                overlay.style.position = "absolute";
                overlay.style.left = `${x1}px`;
                overlay.style.top = `${y1}px`;
                overlay.style.width = `${x2 - x1}px`;
                overlay.style.height = `${y2 - y1}px`;
                overlay.style.backgroundColor = getGeneColor(area.log2fc);
                overlay.style.border = "1.5px solid rgba(0, 0, 0, 0.4)";
                overlay.style.borderRadius = "2px";
                overlay.style.pointerEvents = "none"; // Let mouse events pass through to <area>
                overlay.style.boxSizing = "border-box";
                overlay.title = `${area.title} (Log2FC: ${area.log2fc})`;
                wrapper.appendChild(overlay);
            }
        }
        
        // Mouse hover interactions
        areaEl.addEventListener("mouseover", (e) => {
            tooltip.style.display = "flex";
            const fcText = area.log2fc !== null ? 
                `<span class="tooltip-fc ${area.log2fc >= 0 ? 'up-text' : 'down-text'}">Log2FC: ${area.log2fc > 0 ? '+' : ''}${area.log2fc}</span>` : 
                '<span class="text-muted">발현 데이터 미매칭</span>';
                
            tooltip.innerHTML = `
                <span class="tooltip-gene">${area.gene}</span>
                ${fcText}
                <span class="tooltip-desc">${area.title}</span>
            `;
            updateTooltipPosition(e, tooltip);
        });
        
        areaEl.addEventListener("mousemove", (e) => {
            updateTooltipPosition(e, tooltip);
        });
        
        areaEl.addEventListener("mouseout", () => {
            tooltip.style.display = "none";
        });
        
        areaEl.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Support searching by locus_tag or gene_symbol in a multi-gene entry
            let match = null;
            // area.gene might be like "YAL038W+YOR347C"
            const genesList = area.gene.toUpperCase().split("+");
            for (const gCode of genesList) {
                match = gGenes.find(g => 
                    g.locus_tag.toUpperCase() === gCode || 
                    g.gene_symbol.toUpperCase() === gCode
                );
                if (match) break;
            }
            
            if (match) {
                showGeneDetails(match);
            }
        });
        
        map.appendChild(areaEl);
    });
    
    wrapper.appendChild(map);
    container.appendChild(wrapper);
}

function updateTooltipPosition(e, tooltip) {
    // Offset relative to mouse
    tooltip.style.left = `${e.pageX + 15}px`;
    tooltip.style.top = `${e.pageY + 15}px`;
}

// Modal Detail View (For KEGG area clicks)
function showGeneDetailsModal(gene) {
    openGeneIGVModal(gene);
}

// ----------------------------------------------------------------------
// 8. GO Enrichment & GO Term Gene Inspector
// ----------------------------------------------------------------------
function runGOEnrichment() {
    const direction = document.getElementById("go-direction").value;
    const log2fcThresh = parseFloat(document.getElementById("log2fc-thresh").value) || 0;
    const pvalThresh = parseFloat(document.getElementById("pvalue-thresh").value) || 1.0;
    
    // Select upregulated or downregulated locus tags based on threshold and stat-type
    const targetList = [];
    const statType = document.getElementById("stat-type") ? document.getElementById("stat-type").value : "fdr";
    gGenes.forEach(gene => {
        const statVal = statType === "fdr" ? gene.fdr : gene.pvalue;
        const passesLog2FC = Math.abs(gene.log2fc) >= log2fcThresh;
        let passesPVal = true;
        if (statType !== "none" && gIsReplicateMode) {
            passesPVal = (statVal !== null && statVal <= pvalThresh);
        }
        
        if (passesLog2FC && passesPVal) {
            if (direction === "up" && gene.log2fc >= log2fcThresh) {
                targetList.push(gene.locus_tag);
            } else if (direction === "down" && gene.log2fc <= -log2fcThresh) {
                targetList.push(gene.locus_tag);
            }
        }
    });
    
    const tbody = document.getElementById("go-table-body");
    tbody.innerHTML = `<tr><td colspan="8" class="text-center"><i class="fa-solid fa-spinner fa-spin icon-margin"></i>GO Enrichment 검정 수행 중... (수초가 소요될 수 있습니다)</td></tr>`;
    
    if (targetList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">선택한 임계값을 충족하는 ${direction === "up" ? '증가' : '감소'} 발현 유전자가 없습니다. 필터 조건을 완화해보세요.</td></tr>`;
        return;
    }
    
    const dbInfoEl = document.getElementById("go-db-info-text");
    if (dbInfoEl) {
        let dbName = "SGD Yeast GO Slim";
        if (gCurrentSpecies === "cgl") dbName = "Corynebacterium GO Slim";
        else if (gCurrentSpecies === "eco") dbName = "Escherichia coli K-12 GO Slim";
        dbInfoEl.innerHTML = `선택한 유전자군에 대해 <strong>${dbName}</strong> 데이터셋을 기반으로 Hypergeometric test(초기하 분포 통계 검정)를 수행하여 통계적으로 유의미한 기능 범주를 도출합니다.`;
    }
    
    fetch(`${API_URL}/api/go_enrichment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            genes: targetList,
            direction: direction,
            species: gCurrentSpecies,
            session_id: gActiveSessionId
        })
    })
    .then(r => {
        if (!r.ok) {
            return r.json().then(err => { throw new Error(err.detail || "GO 분석 실패") });
        }
        return r.json();
    })
    .then(data => {
        tbody.innerHTML = "";
        
        const enrichList = data.enrichment || [];
        if (enrichList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">유의미하게 농축된 GO 카테고리가 없습니다.</td></tr>`;
            document.getElementById("go-chart-container").style.display = "none";
            resetGOInspector();
            return;
        }
        
        // Group by ontology aspect and sort by pvalue ascending (lower is more significant)
        const aspectOrder = ["Molecular Function", "Cellular Component", "Biological Process"];
        const groupedList = [];
        
        aspectOrder.forEach(asp => {
            const subList = enrichList.filter(item => item.aspect === asp);
            subList.sort((a, b) => a.pvalue - b.pvalue);
            groupedList.push(...subList);
        });
        
        enrichList.forEach(item => {
            if (!aspectOrder.includes(item.aspect)) {
                groupedList.push(item);
            }
        });
        
        // Render sorted and grouped list to Table
        groupedList.slice(0, 100).forEach((item, index) => {
            const row = document.createElement("tr");
            row.className = "go-table-row";
            row.setAttribute("data-goid", item.goid);
            
            const genesListStr = item.genes.join(", ");
            const genesSnippet = genesListStr.length > 35 ? genesListStr.substring(0, 35) + "..." : genesListStr;
            
            row.innerHTML = `
                <td><code style="font-weight: 600; color: #6366f1;">${item.goid}</code></td>
                <td><span class="badge ${item.aspect === 'Molecular Function' ? 'badge-optional' : (item.aspect === 'Cellular Component' ? 'badge-required' : 'badge-info')}">${item.aspect}</span></td>
                <td><strong>${escapeHtml(item.term_name)}</strong></td>
                <td class="text-center"><strong>${item.k}</strong></td>
                <td class="text-center">${item.M}</td>
                <td>${item.pvalue.toExponential(4)}</td>
                <td>${item.fdr.toExponential(4)}</td>
                <td class="text-muted" title="${genesListStr}">${genesSnippet} <i class="fa-solid fa-chevron-right" style="font-size: 11px; margin-left: 4px; color: #6366f1;"></i></td>
            `;
            
            row.addEventListener("click", () => {
                document.querySelectorAll(".go-table-row").forEach(r => r.classList.remove("selected-go-row"));
                row.classList.add("selected-go-row");
                selectGOTermInspector(item);
            });
            
            tbody.appendChild(row);
        });

        // Automatically select first GO Term on load
        if (groupedList.length > 0) {
            const firstRow = tbody.querySelector(".go-table-row");
            if (firstRow) {
                firstRow.classList.add("selected-go-row");
            }
            selectGOTermInspector(groupedList[0]);
        }

        // Group terms for Plotly horizontal bar chart
        const molTerms = groupedList.filter(item => item.aspect === "Molecular Function").slice(0, 8);
        const cellTerms = groupedList.filter(item => item.aspect === "Cellular Component").slice(0, 8);
        const bioTerms = groupedList.filter(item => item.aspect === "Biological Process").slice(0, 8);
        
        const chartTerms = [...molTerms.reverse(), ...cellTerms.reverse(), ...bioTerms.reverse()];
        
        if (chartTerms.length > 0) {
            document.getElementById("go-chart-container").style.display = "block";
            const allLabels = chartTerms.map(t => `${t.term_name} (${t.goid})`);
            
            const molTrace = {
                x: chartTerms.map(t => t.aspect === "Molecular Function" ? -Math.log10(t.fdr || t.pvalue || 1e-10) : null),
                y: allLabels,
                name: 'Molecular Function',
                type: 'bar',
                orientation: 'h',
                marker: { color: '#3b82f6' }
            };
            
            const cellTrace = {
                x: chartTerms.map(t => t.aspect === "Cellular Component" ? -Math.log10(t.fdr || t.pvalue || 1e-10) : null),
                y: allLabels,
                name: 'Cellular Component',
                type: 'bar',
                orientation: 'h',
                marker: { color: '#10b981' }
            };
            
            const bioTrace = {
                x: chartTerms.map(t => t.aspect === "Biological Process" ? -Math.log10(t.fdr || t.pvalue || 1e-10) : null),
                y: allLabels,
                name: 'Biological Process',
                type: 'bar',
                orientation: 'h',
                marker: { color: '#f87171' }
            };
            
            const layout = {
                title: {
                    text: 'Gene Ontology Enrichment Results (-log10 q-value)',
                    font: { size: 16, color: '#0f172a', family: 'Inter, sans-serif' }
                },
                barmode: 'overlay',
                xaxis: {
                    title: '-log10(qvalue 또는 pvalue)',
                    gridcolor: '#e2e8f0',
                    zerolinecolor: '#cbd5e1',
                    tickfont: { color: '#475569' }
                },
                yaxis: {
                    type: 'category',
                    categoryorder: 'array',
                    categoryarray: allLabels,
                    tickfont: { size: 10, color: '#0f172a' },
                    automargin: true
                },
                margin: { l: 280, r: 20, t: 50, b: 50 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                legend: {
                    title: { text: 'GO Aspect' },
                    font: { color: '#0f172a' },
                    orientation: 'h',
                    y: -0.2
                }
            };
            
            Plotly.newPlot('go-bar-chart', [molTrace, cellTrace, bioTrace], layout, {responsive: true});
        } else {
            document.getElementById("go-chart-container").style.display = "none";
        }
    })
    .catch(err => {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">에러 발생: ${err.message}</td></tr>`;
    });
}

function selectGOTermInspector(item) {
    gCurrentSelectedGOTerm = item;
    
    const titleEl = document.getElementById("selected-go-title");
    const subTitleEl = document.getElementById("selected-go-subtitle");
    
    if (titleEl) {
        titleEl.textContent = `GO Term 매칭 유전자 상세 분석: ${item.term_name} (${item.goid})`;
    }
    if (subTitleEl) {
        subTitleEl.textContent = `분류: ${item.aspect} | 총 ${item.k}개 매칭 유전자 (p-value: ${item.pvalue.toExponential(4)}, FDR: ${item.fdr.toExponential(4)})`;
    }
    
    // Match genes from gGenes
    const locusSet = new Set((item.genes || []).map(g => g.toUpperCase()));
    gCurrentSelectedGOGenes = gGenes.filter(g => 
        locusSet.has(g.locus_tag.toUpperCase()) || 
        locusSet.has(g.gene_symbol.toUpperCase())
    );
    
    renderGOInspectorTable();
}

function resetGOInspector() {
    gCurrentSelectedGOTerm = null;
    gCurrentSelectedGOGenes = [];
    
    const titleEl = document.getElementById("selected-go-title");
    const subTitleEl = document.getElementById("selected-go-subtitle");
    const tbody = document.getElementById("go-inspector-table-body");
    
    if (titleEl) titleEl.textContent = "GO Term 매칭 유전자 상세 분석 (GO Term Gene Inspector)";
    if (subTitleEl) subTitleEl.textContent = "상단 GO Enrichment 결과 테이블에서 원하는 GO ID 행을 클릭하면 해당 범주의 전체 매칭 유전자 리스트가 하단에 바인딩됩니다.";
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted" style="padding: 36px 16px;">
                    <i class="fa-solid fa-hand-pointer" style="font-size: 28px; margin-bottom: 10px; color: #94a3b8; display: block;"></i>
                    상단 GO 분석 테이블에서 특정 GO ID 행을 클릭하시면 전체 유전자 목록이 표출됩니다.
                </td>
            </tr>
        `;
    }
}

function renderGOInspectorTable() {
    const tbody = document.getElementById("go-inspector-table-body");
    const searchInput = document.getElementById("search-go-inspector-gene");
    if (!tbody) return;
    
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    
    let filtered = gCurrentSelectedGOGenes;
    if (query !== "") {
        filtered = gCurrentSelectedGOGenes.filter(g => 
            g.locus_tag.toLowerCase().includes(query) || 
            g.gene_symbol.toLowerCase().includes(query) ||
            (g.description && g.description.toLowerCase().includes(query))
        );
    }
    
    tbody.innerHTML = "";
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding: 24px;">매칭되는 유전자가 없습니다.</td></tr>`;
        return;
    }
    
    filtered.forEach(gene => {
        const tr = document.createElement("tr");
        tr.style.cursor = "pointer";
        
        const isUp = gene.log2fc >= 0;
        const fcClass = isUp ? "up-text" : "down-text";
        const stateBadge = isUp ? '<span class="badge badge-required" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">UP ▲</span>' : '<span class="badge badge-optional" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2);">DOWN ▼</span>';
        
        const fdrVal = gene.fdr !== null && gene.fdr !== undefined ? gene.fdr : gene.pvalue;
        const fdrDisplay = fdrVal !== null && fdrVal !== undefined ? fdrVal.toExponential(3) : '-';
        
        tr.innerHTML = `
            <td><code style="color: #6366f1; font-weight: 700;">${gene.locus_tag}</code></td>
            <td><strong>${escapeHtml(gene.gene_symbol)}</strong></td>
            <td class="stat-header">${gene.wt_val !== undefined && gene.wt_val !== null ? gene.wt_val.toFixed(2) : '-'}</td>
            <td class="stat-header">${gene.mutant_val !== undefined && gene.mutant_val !== null ? gene.mutant_val.toFixed(2) : '-'}</td>
            <td class="stat-header ${fcClass}"><strong>${gene.log2fc >= 0 ? '+' : ''}${gene.log2fc.toFixed(2)}</strong></td>
            <td class="stat-header">${fdrDisplay}</td>
            <td class="text-center">${stateBadge}</td>
            <td style="font-size: 12.5px; color: var(--text-secondary); max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(gene.description || '')}">${escapeHtml(gene.description || '-')}</td>
        `;
        
        tr.addEventListener("click", () => {
            showGeneDetailsModal(gene);
        });
        
        tbody.appendChild(tr);
    });
}

function exportSelectedGOGenesToExcel() {
    if (!gCurrentSelectedGOTerm || !gCurrentSelectedGOGenes || gCurrentSelectedGOGenes.length === 0) {
        alert("내보낼 GO Term 유전자 데이터가 없습니다. GO Term 행을 먼저 선택해 주세요.");
        return;
    }
    
    const goIdClean = gCurrentSelectedGOTerm.goid.replace(":", "_");
    const filename = `GO_Genes_${goIdClean}.csv`;
    
    let csvContent = "\uFEFFLocus_Tag,Gene_Symbol,WT_Value,Mutant_Value,Log2FC,FDR,State,Description\n";
    
    gCurrentSelectedGOGenes.forEach(g => {
        const state = g.log2fc >= 0 ? "UP" : "DOWN";
        const desc = (g.description || "").replace(/"/g, '""');
        const fdrVal = g.fdr !== null && g.fdr !== undefined ? g.fdr : g.pvalue;
        csvContent += `"${g.locus_tag}","${g.gene_symbol}",${g.wt_val || 0},${g.mutant_val || 0},${g.log2fc},${fdrVal || ''},"${state}","${desc}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// ----------------------------------------------------------------------
// 11. STRING PPI & TF-Target Regulatory Network Graph
// ----------------------------------------------------------------------
let cyInstance = null;
let gNetworkMode = 'string'; // 'string', 'tf', or 'modulator'
let gTFAssociationData = null; // Stored results from TF enrichment
let gNetworkCurrentData = { nodes: [], edges: [] };

function exportNetworkToExcel() {
    if (!gNetworkCurrentData || (!gNetworkCurrentData.nodes.length && !gNetworkCurrentData.edges.length)) {
        alert("내보낼 네트워크 데이터가 없습니다. 먼저 네트워크를 렌더링해주세요.");
        return;
    }
    
    fetch(`${API_URL}/api/network/export_excel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gNetworkCurrentData)
    })
    .then(res => {
        if (!res.ok) throw new Error("엑셀 내보내기 실패");
        return res.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "yeast_ppi_network_data.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    })
    .catch(err => alert("네트워크 엑셀 다운로드 중 오류 발생: " + err.message));
}

let gNetTargetGene = null;

function focusTargetNetwork(geneSymbol) {
    if (!geneSymbol) return;
    gNetTargetGene = geneSymbol;
    const input = document.getElementById("network-target-input");
    if (input) input.value = geneSymbol;
    renderNetworkGraph();
}

function resetNetworkTargetView() {
    gNetTargetGene = null;
    const input = document.getElementById("network-target-input");
    if (input) input.value = "";
    renderNetworkGraph();
}

function renderTopHubsChips() {
    const hubBox = document.getElementById("network-top-hubs-container");
    if (!hubBox || !gNetworkCurrentData || !gNetworkCurrentData.nodes) return;
    
    // Sort nodes by degree descending
    const sorted = [...gNetworkCurrentData.nodes].sort((a, b) => (b.degree || 0) - (a.degree || 0));
    const topHubs = sorted.slice(0, 6);
    if (topHubs.length === 0) return;
    
    let html = `
        <div style="font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
            <span><i class="fa-solid fa-crown" style="color: #f59e0b;"></i> 핵심 허브 유전자 (Top Degree)</span>
            <span style="font-size: 10px; color: #94a3b8;">클릭 시 포커스</span>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
    `;
    
    topHubs.forEach(h => {
        const deg = h.degree || 0;
        const color = h.log2fc >= 0 ? '#ef4444' : '#3b82f6';
        html += `
            <button type="button" class="btn btn-outline-secondary btn-sm net-hub-chip" data-id="${h.id}" data-label="${h.label}" style="font-size: 11px; padding: 2px 7px; border-radius: 12px; background: #fff; border-color: #cbd5e1; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${color};"></span>
                <strong>${h.label}</strong>
                <span style="font-size: 10px; color: #64748b; background: #f1f5f9; padding: 1px 4px; border-radius: 6px;">k=${deg}</span>
            </button>
        `;
    });
    html += `</div>`;
    hubBox.innerHTML = html;
    
    hubBox.querySelectorAll(".net-hub-chip").forEach(btn => {
        btn.onclick = () => {
            const geneId = btn.getAttribute("data-id");
            if (cyInstance) {
                const targetNode = cyInstance.getElementById(geneId);
                if (targetNode && targetNode.length > 0) {
                    cyInstance.nodes().unselect();
                    targetNode.select();
                    cyInstance.animate({
                        center: { eles: targetNode },
                        zoom: 1.5,
                        duration: 400
                    });
                    showNetworkNodeDetails(targetNode.data());
                }
            }
        };
    });
}

function showNetworkNodeDetails(nodeData) {
    const detailsPanel = document.getElementById("network-node-details");
    if (!detailsPanel) return;
    const nodeGene = { locus_tag: nodeData.id, gene_symbol: nodeData.label };
    const uUrl = getUniprotUrl(nodeGene);
    const deg = nodeData.degree || 0;
    const isSeed = nodeData.is_seed || false;
    
    detailsPanel.innerHTML = `
        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
            <div>
                <span style="font-size: 11px; font-weight: 600; color: #6366f1; text-transform: uppercase;">ORF Name (Systematic ID)</span>
                <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 2px 0;">${nodeData.id}</h5>
            </div>
            <a href="${uUrl}" target="_blank" rel="noopener noreferrer" class="uniprot-badge-btn" title="UniProt에서 상세 단백질 정보 보기">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> UniProt DB
            </a>
        </div>
        <div style="margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 600; color: #64748b;">Gene Symbol</span>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                <span style="font-size: 15px; font-weight: 700; color: #1e293b;">${nodeData.label}</span>
                ${isSeed ? '<span style="background: #f59e0b; color: white; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;"><i class="fa-solid fa-bullseye"></i> Seed Target</span>' : ''}
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
            <div style="background: #f8fafc; padding: 6px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                <span style="font-size: 10px; font-weight: 600; color: #64748b; display: block;">Log2 Fold Change</span>
                <span style="font-size: 13px; font-weight: 700; color: ${nodeData.log2fc >= 0 ? '#ef4444' : '#3b82f6'};">
                    ${nodeData.log2fc >= 0 ? '+' : ''}${typeof nodeData.log2fc === 'number' ? nodeData.log2fc.toFixed(3) : nodeData.log2fc}
                </span>
            </div>
            <div style="background: #f8fafc; padding: 6px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                <span style="font-size: 10px; font-weight: 600; color: #64748b; display: block;">연결 차수 (Degree)</span>
                <span style="font-size: 13px; font-weight: 700; color: #0284c7;">
                    <i class="fa-solid fa-circle-nodes"></i> ${deg}개 파트너
                </span>
            </div>
        </div>
        <div style="margin-bottom: 12px;">
            <span style="font-size: 11px; font-weight: 600; color: #64748b;">Gene Description</span>
            <p style="font-size: 12px; line-height: 1.5; color: #475569; margin: 2px 0; max-height: 130px; overflow-y: auto; background: #fafafa; padding: 6px 8px; border-radius: 4px; border: 1px solid #f1f5f9;">
                ${nodeData.desc || '설명 정보 없음'}
            </p>
        </div>
        <div style="border-top: 1px solid #f1f5f9; padding-top: 10px; display: flex; flex-direction: column; gap: 6px;">
            <button type="button" id="btn-focus-ego-net" class="btn btn-primary btn-sm" style="width: 100%; font-size: 11px; justify-content: center; background: #6366f1; border-color: #6366f1;">
                <i class="fa-solid fa-crosshairs"></i> 이 유전자 중심 서브망 재구성
            </button>
            <button type="button" id="btn-net-reg-target" class="btn btn-secondary btn-sm" style="width: 100%; font-size: 11px; justify-content: center;">
                <i class="fa-solid fa-star" style="color: #f59e0b;"></i> 맞춤 대사경로 타깃 후보로 등록
            </button>
        </div>
        <div id="network-top-hubs-container" style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #cbd5e1;"></div>
    `;

    const btnFocus = document.getElementById("btn-focus-ego-net");
    if (btnFocus) {
        btnFocus.onclick = () => {
            focusTargetNetwork(nodeData.label || nodeData.id);
        };
    }
    const btnReg = document.getElementById("btn-net-reg-target");
    if (btnReg) {
        btnReg.onclick = () => {
            const sym = nodeData.label || nodeData.id;
            const strat = (nodeData.log2fc >= 0) ? "OE" : "KO";
            registerCandidateAsTarget(sym, strat, `PPI 네트워크 발굴 (연결 차수: ${deg})`);
        };
    }
    renderTopHubsChips();
}

function renderNetworkGraph() {
    const limit = document.getElementById("network-limit") ? document.getElementById("network-limit").value : 50;
    const score = document.getElementById("network-score") ? document.getElementById("network-score").value : 400;
    const source = document.getElementById("network-source") ? document.getElementById("network-source").value : 'hybrid';
    const type = document.getElementById("network-type") ? document.getElementById("network-type").value : 'all';
    const container = document.getElementById("cy-network");
    
    const targetInput = document.getElementById("network-target-input");
    const depthSelect = document.getElementById("network-depth-select");
    const btnReset = document.getElementById("btn-reset-network-view");
    const btnClearTarget = document.getElementById("btn-net-clear-target");
    
    const targetGene = gNetTargetGene !== null ? gNetTargetGene : (targetInput ? targetInput.value.trim() : "");
    const depth = depthSelect ? depthSelect.value : 1;
    
    if (targetInput && gNetTargetGene !== null) {
        targetInput.value = gNetTargetGene;
    }
    
    if (btnReset) btnReset.style.display = targetGene ? "inline-flex" : "none";
    if (btnClearTarget) btnClearTarget.style.display = targetGene ? "block" : "none";

    const titleEl = document.getElementById("network-tab-title");
    
    if (gNetworkMode === 'string') {
        if (titleEl) {
            let srcLabel = "하이브리드 (BioGRID + STRING)";
            if (source === "biogrid") srcLabel = "BioGRID (실험 검증 PPI)";
            else if (source === "string") srcLabel = "STRING-DB API";
            
            if (targetGene) {
                titleEl.innerHTML = `🎯 타깃 중심 서브네트워크: <span style="font-weight: 700; color: #6366f1;">${targetGene}</span> <span style="font-size: 12px; color: #64748b;">(${depth}-Hop 이웃, ${srcLabel})</span>`;
            } else {
                titleEl.innerHTML = `단백질 상호작용 네트워크 <span style="font-size: 13px; font-weight: 500; color: #6366f1;">[${srcLabel}]</span>`;
            }
        }
        
        container.innerHTML = `<div style="text-align: center; padding-top: 200px; color: #64748b;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top: 10px;">${targetGene ? `타깃 '${targetGene}' 중심 서브네트워크 추출 중...` : 'PPI 상호작용 네트워크 불러오는 중...'}</p></div>`;
        
        const params = new URLSearchParams({
            limit: limit,
            score: score,
            source: source,
            interaction_type: type,
            species: gCurrentSpecies || 'sce',
            session_id: gActiveSessionId || ''
        });
        
        if (targetGene) {
            params.append("target_gene", targetGene);
            params.append("depth", depth);
        }

        fetch(`${API_URL}/api/network?${params.toString()}`)
        .then(r => r.json())
        .then(data => {
            if (!data.success) {
                container.innerHTML = `<div class="text-center text-danger" style="padding-top: 200px;"><i class="fa-solid fa-triangle-exclamation fa-2x mb-10"></i><p>${data.detail || '네트워크 로딩 실패'}</p></div>`;
                return;
            }
            
            const nodes = data.nodes || [];
            const edges = data.edges || [];
            gNetworkCurrentData = { nodes: nodes, edges: edges };
            
            if (nodes.length === 0) {
                container.innerHTML = `<div class="text-center text-muted" style="padding-top: 200px;">
                    <i class="fa-solid fa-circle-nodes fa-2x" style="color: #cbd5e1; margin-bottom: 10px;"></i>
                    <p>${targetGene ? `'${targetGene}'와 연결된 상호작용 파트너를 찾을 수 없습니다.` : '상위 DEG 유전자들에 매칭되는 상호작용 노드가 없습니다.'}</p>
                    ${targetGene ? `<button class="btn btn-secondary btn-sm" onclick="resetNetworkTargetView()" style="margin-top: 8px;">전체망으로 복귀</button>` : ''}
                </div>`;
                return;
            }
            
            container.innerHTML = "";
            const elements = [];
            
            nodes.forEach(n => {
                let color = '#cbd5e1';
                let borderCol = '#94a3b8';
                let borderWidth = '2px';
                let nodeSize = 46;
                
                if (n.log2fc > 0) {
                    const intensity = Math.min(n.log2fc / 2.0, 1.0);
                    color = `rgb(${255}, ${Math.round(255 - 200 * intensity)}, ${Math.round(255 - 200 * intensity)})`;
                } else if (n.log2fc < 0) {
                    const intensity = Math.min(Math.abs(n.log2fc) / 2.0, 1.0);
                    color = `rgb(${Math.round(255 - 200 * intensity)}, ${Math.round(255 - 200 * intensity)}, ${255})`;
                }
                
                // Highlight target seed node with prominent gold emblem styling
                if (n.is_seed) {
                    borderCol = '#f59e0b';
                    borderWidth = '4.5px';
                    nodeSize = 58;
                }
                
                elements.push({
                    data: {
                        id: n.id,
                        label: n.label,
                        log2fc: n.log2fc,
                        desc: n.desc,
                        degree: n.degree || 0,
                        is_seed: n.is_seed || false,
                        bg: color,
                        borderCol: borderCol,
                        borderWidth: borderWidth,
                        nodeSize: `${nodeSize}px`
                    }
                });
            });
            
            edges.forEach((e, idx) => {
                let lineStyle = 'solid';
                let edgeColor = '#059669';
                if (e.type === 'genetic') {
                    lineStyle = 'dashed';
                    edgeColor = '#a855f7';
                } else if (e.type === 'functional') {
                    lineStyle = 'dotted';
                    edgeColor = '#3b82f6';
                }
                
                elements.push({
                    data: {
                        id: `e_${idx}`,
                        source: e.source,
                        target: e.target,
                        weight: e.score / 1000.0,
                        type: e.type || 'physical',
                        db: e.db || 'BioGRID',
                        lineStyle: lineStyle,
                        edgeColor: edgeColor
                    }
                });
            });
            
            cyInstance = cytoscape({
                container: container,
                elements: elements,
                style: [
                    {
                        selector: 'node',
                        style: {
                            'label': 'data(label)',
                            'background-color': 'data(bg)',
                            'border-width': 'data(borderWidth)',
                            'border-color': 'data(borderCol)',
                            'color': '#0f172a',
                            'font-size': '12px',
                            'font-weight': 'bold',
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'width': 'data(nodeSize)',
                            'height': 'data(nodeSize)',
                            'overlay-padding': '4px',
                            'text-outline-width': '2px',
                            'text-outline-color': '#ffffff'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 'mapData(weight, 0.4, 1.0, 2.0, 5.0)',
                            'line-color': 'data(edgeColor)',
                            'line-style': 'data(lineStyle)',
                            'curve-style': 'bezier',
                            'opacity': 0.8
                        }
                    }
                ],
                layout: {
                    name: 'cose',
                    animate: true,
                    nodeRepulsion: function( node ){ return 2048; },
                    idealEdgeLength: function( edge ){ return 64; },
                    fit: true
                }
            });
            
            const detailsPanel = document.getElementById("network-node-details");
            if (detailsPanel) {
                detailsPanel.innerHTML = `
                    <div style="text-align: center; padding: 20px 8px; color: #64748b;">
                        <i class="fa-solid fa-circle-nodes fa-2x" style="color: #6366f1; opacity: 0.6; margin-bottom: 8px;"></i>
                        <p style="font-size: 12px; margin: 0 0 10px 0;">유전자 노드를 클릭하면 상호작용 상세 정보 및 타깃 서브망 재구성이 가능합니다.</p>
                    </div>
                    <div id="network-top-hubs-container" style="border-top: 1px dashed #cbd5e1; padding-top: 10px;"></div>
                `;
                renderTopHubsChips();
            }
            
            cyInstance.on('tap', 'node', function(evt){
                showNetworkNodeDetails(evt.target.data());
            });
        })
        .catch(err => {
            container.innerHTML = `<div class="text-center text-danger" style="padding-top: 200px;"><i class="fa-solid fa-circle-exclamation fa-2x mb-10"></i><p>네트워크 렌더링 실패: ${err.message}</p></div>`;
        });
    } else {
        // TF-Target Regulatory Network Mode
        container.innerHTML = `<div style="text-align: center; padding-top: 200px; color: #64748b;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top: 10px;">전사인자(TF) 조절 관계 연산 및 초기하 검정 중...</p></div>`;
        const tfListContainer = document.getElementById("network-tf-list-container");
        if (tfListContainer) {
            tfListContainer.innerHTML = `<div style="text-align: center; padding-top: 80px; color: #64748b;"><i class="fa-solid fa-spinner fa-spin"></i><p style="font-size: 12px; margin-top: 6px;">TF 목록 집계 중...</p></div>`;
        }

        // Calculate targetList based on current threshold
        const log2fcThresh = parseFloat(document.getElementById("log2fc-thresh").value) || 0;
        const pvalThresh = parseFloat(document.getElementById("pvalue-thresh").value) || 1.0;
        const statType = document.getElementById("stat-type") ? document.getElementById("stat-type").value : "fdr";
        const targetList = [];
        gGenes.forEach(gene => {
            const statVal = statType === "fdr" ? gene.fdr : gene.pvalue;
            const passesLog2FC = Math.abs(gene.log2fc) >= log2fcThresh;
            let passesPVal = true;
            if (statType !== "none" && gIsReplicateMode) {
                passesPVal = (statVal !== null && statVal <= pvalThresh);
            }
            if (passesLog2FC && passesPVal) {
                targetList.push(gene.locus_tag);
            }
        });

        // Use gSelectedTfId if set
        const selectedTfParam = gSelectedTfId || null;

        fetch(`${API_URL}/api/tf_enrichment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                genes: targetList,
                selected_tf: selectedTfParam,
                species: gCurrentSpecies,
                session_id: gActiveSessionId
            })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success === false) {
                container.innerHTML = `<div class="text-center text-danger" style="padding-top: 200px;"><i class="fa-solid fa-circle-exclamation fa-2x mb-10"></i><p>TF 분석 실패: ${data.detail || "알 수 없는 에러"}</p></div>`;
                return;
            }
            
            gTFAssociationData = data.enrichment || [];
            
            // If gSelectedTfId wasn't set, default to top 1 TF returned from backend
            let activeTfId = selectedTfParam;
            if (!activeTfId && gTFAssociationData.length > 0) {
                activeTfId = gTFAssociationData[0].tf_id;
                gSelectedTfId = activeTfId;
            }
            
            // 1. Render TF Enrichment Table in the Right Subtab
            renderTFListTable(gTFAssociationData, activeTfId);
            
            // 2. Render Full Regulatory Network
            const network = data.network || { nodes: [], edges: [] };
            const nodes = network.nodes || [];
            const edges = network.edges || [];
            
            if (nodes.length === 0) {
                container.innerHTML = `<div class="text-center text-muted" style="padding-top: 200px;">규제 네트워크를 렌더링할 유의미한 TF-Target 관계가 없습니다.</div>`;
                return;
            }
            
            container.innerHTML = "";
            const elements = [];
            
            nodes.forEach(n => {
                let color = '#cbd5e1';
                let shape = 'ellipse';
                let borderCol = '#1e293b';
                
                if (n.is_tf) {
                    shape = 'hexagon';
                    color = '#818cf8'; // Premium indigo for TFs
                    borderCol = '#4f46e5';
                } else {
                    if (n.log2fc > 0) {
                        const intensity = Math.min(n.log2fc / 2.0, 1.0);
                        color = `rgb(${255}, ${Math.round(255 - 200 * intensity)}, ${Math.round(255 - 200 * intensity)})`;
                    } else if (n.log2fc < 0) {
                        const intensity = Math.min(Math.abs(n.log2fc) / 2.0, 1.0);
                        color = `rgb(${Math.round(255 - 200 * intensity)}, ${Math.round(255 - 200 * intensity)}, ${255})`;
                    }
                }
                
                elements.push({
                    data: {
                        id: n.id,
                        label: n.label,
                        log2fc: n.log2fc || 0,
                        is_tf: n.is_tf,
                        desc: n.desc || '',
                        bg: color,
                        shape: shape,
                        border: borderCol
                    }
                });
            });
            
            edges.forEach((e, idx) => {
                elements.push({
                    data: {
                        id: `tf_e_${idx}`,
                        source: e.source,
                        target: e.target,
                        type: e.type || 'regulate'
                    }
                });
            });
            
            cyInstance = cytoscape({
                container: container,
                elements: elements,
                style: [
                    {
                        selector: 'node',
                        style: {
                            'label': 'data(label)',
                            'background-color': 'data(bg)',
                            'shape': 'data(shape)',
                            'border-width': '2.5px',
                            'border-color': 'data(border)',
                            'color': '#0f172a',
                            'font-size': '11px',
                            'font-weight': 'bold',
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'width': '48px',
                            'height': '48px',
                            'text-outline-width': '1.5px',
                            'text-outline-color': '#ffffff'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': '2px',
                            'line-color': '#a5b4fc',
                            'target-arrow-color': '#4f46e5',
                            'target-arrow-shape': 'triangle', // Clarifies regulatory flow directions (TF -> Target)
                            'curve-style': 'bezier',
                            'opacity': 0.85
                        }
                    }
                ],
                layout: {
                    name: 'cose',
                    animate: true,
                    nodeRepulsion: function( node ){ return 3000; },
                    idealEdgeLength: function( edge ){ return 80; },
                    fit: true
                }
            });
            
            // Node Tap Listener
            const detailsPanel = document.getElementById("network-node-details");
            cyInstance.on('tap', 'node', function(evt){
                const nodeData = evt.target.data();
                
                // Switch to detail subtab
                document.getElementById("btn-subtab-node").click();
                
                detailsPanel.innerHTML = `
                    <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 12px;">
                        <span style="font-size: 11px; font-weight: 600; color: #6366f1; text-transform: uppercase;">
                            ${nodeData.is_tf ? 'Transcription Factor (TF)' : 'Target DEG Gene'}
                        </span>
                        <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 2px 0;">${nodeData.id}</h5>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="font-size: 11px; font-weight: 600; color: #64748b;">Gene Symbol</span>
                        <p style="font-size: 14px; font-weight: 500; color: #1e293b; margin: 2px 0;">${nodeData.label}</p>
                    </div>
                    ${!nodeData.is_tf ? `
                    <div style="margin-bottom: 10px;">
                        <span style="font-size: 11px; font-weight: 600; color: #64748b;">Log2 Fold Change</span>
                        <p style="font-size: 14px; font-weight: 600; color: ${nodeData.log2fc >= 0 ? '#ef4444' : '#3b82f6'}; margin: 2px 0;">
                            ${nodeData.log2fc >= 0 ? '+' : ''}${nodeData.log2fc.toFixed(4)}
                        </p>
                    </div>` : ''}
                    <div>
                        <span style="font-size: 11px; font-weight: 600; color: #64748b;">Description</span>
                        <p style="font-size: 13px; line-height: 1.5; color: #475569; margin: 2px 0; max-height: 200px; overflow-y: auto;">
                            ${nodeData.desc || '설명 정보 없음'}
                        </p>
                    </div>
                `;
            });
        })
        .catch(err => {
            console.error("TF Network 렌더링 실패:", err);
            container.innerHTML = `<div class="text-center text-danger" style="padding-top: 200px;"><i class="fa-solid fa-circle-exclamation fa-2x mb-10"></i><p>네트워크 렌더링 실패: ${err.message}</p></div>`;
        });
    }
}

function renderTFListTable(tfResults, activeTfId) {
    const container = document.getElementById("network-tf-list-container");
    if (!container) return;
    
    if (tfResults.length === 0) {
        container.innerHTML = `<p class="text-center text-muted" style="padding: 20px 0;">농축된 전사인자(TF)가 존재하지 않습니다.</p>`;
        return;
    }
    
    let html = `
        <div class="table-responsive" style="max-height: 520px; overflow-y: auto;">
            <table class="data-table" style="font-size: 11px; width: 100%;">
                <thead>
                    <tr>
                        <th>TF</th>
                        <th class="stat-header">매치 (k/M)</th>
                        <th class="stat-header">p-value</th>
                        <th class="stat-header">FDR</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    tfResults.forEach(r => {
        const isSelected = r.tf_id === activeTfId;
        const rowStyle = isSelected ? "background: rgba(99, 102, 241, 0.15); font-weight: bold;" : "";
        const rowClass = isSelected ? "tf-row selected-tf-row" : "tf-row";
        
        html += `
            <tr class="${rowClass}" data-tf-id="${r.tf_id}" data-tf-name="${r.tf_name}" style="cursor: pointer; ${rowStyle}">
                <td><strong>${r.tf_name}</strong></td>
                <td class="text-center">${r.k} / ${r.M}</td>
                <td class="text-right">${r.pvalue.toExponential(3)}</td>
                <td class="text-right">${r.fdr.toExponential(3)}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Add Row Click Event to fetch network for specific TF
    container.querySelectorAll(".tf-row").forEach(row => {
        row.addEventListener("click", () => {
            const tfId = row.getAttribute("data-tf-id");
            gSelectedTfId = tfId;
            
            // Update selected indicator classes
            container.querySelectorAll(".tf-row").forEach(r => {
                r.classList.remove("selected-tf-row");
                r.style.background = "";
                r.style.fontWeight = "normal";
            });
            row.classList.add("selected-tf-row");
            row.style.background = "rgba(99, 102, 241, 0.15)";
            row.style.fontWeight = "bold";
            
            // Re-render Cytoscape network focused on this TF
            renderNetworkGraph();
        });
    });
}

function highlightTFInNetwork(tfName) {
    if (!cyInstance) return;
    
    cyInstance.batch(() => {
        // 1. Reset styles
        cyInstance.nodes().style({
            'opacity': 0.25,
            'border-color': '#cbd5e1'
        });
        cyInstance.edges().style({
            'opacity': 0.1,
            'line-color': '#e2e8f0'
        });
        
        // 2. Find TF node
        const tfNode = cyInstance.getElementById(tfName);
        if (tfNode.length > 0) {
            tfNode.style({
                'opacity': 1.0,
                'border-color': '#4f46e5',
                'border-width': '4px',
                'width': '65px',
                'height': '65px'
            });
            
            // 3. Find connected targets and edges
            const connectedEdges = tfNode.connectedEdges();
            connectedEdges.style({
                'opacity': 1.0,
                'line-color': '#4f46e5',
                'width': '3.5px'
            });
            
            connectedEdges.targets().style({
                'opacity': 1.0,
                'border-color': '#1e293b',
                'border-width': '2.5px'
            });
            
            // Pan and zoom to TF node and targets
            cyInstance.animate({
                fit: {
                    eles: tfNode.union(connectedEdges.targets()),
                    padding: 50
                },
                duration: 500
            });
        } else {
            // TF is not in network viewport, reset to show all
            cyInstance.nodes().style('opacity', 1.0);
            cyInstance.edges().style('opacity', 0.85);
            cyInstance.fit();
            alert(`전사인자 "${tfName}"가 현재 가시 노드 내에 포함되어 있지 않습니다.`);
        }
    });
}

// ----------------------------------------------------------------------
// 10. Data & Visual Chart Export Helpers (Excel, JPG, PDF)
// ----------------------------------------------------------------------
function exportPlotlyChart(elementId, format, filename) {
    const gd = document.getElementById(elementId);
    if (!gd || !gd.data || gd.data.length === 0) {
        alert("내보낼 차트 데이터가 존재하지 않습니다.");
        return;
    }
    
    // Deep copy original layout properties to restore them later
    const originalLayout = JSON.parse(JSON.stringify(gd.layout));
    
    // Create a temporary light-theme-friendly layout for high-quality publication export
    const exportLayout = {
        ...gd.layout,
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    };
    
    // Force title font color to be dark
    if (exportLayout.title) {
        if (typeof exportLayout.title === 'string') {
            exportLayout.title = { text: exportLayout.title, font: { color: '#0f172a' } };
        } else {
            exportLayout.title = {
                ...exportLayout.title,
                font: exportLayout.title.font ? { ...exportLayout.title.font, color: '#0f172a' } : { color: '#0f172a' }
            };
        }
    }
    
    // Force general font color to dark grey
    if (exportLayout.font) {
        exportLayout.font = { ...exportLayout.font, color: '#1e293b' };
    } else {
        exportLayout.font = { color: '#1e293b' };
    }
    
    // Adjust X axis colors (dark labels and grid lines)
    if (exportLayout.xaxis) {
        exportLayout.xaxis = {
            ...exportLayout.xaxis,
            gridcolor: '#e2e8f0',
            zerolinecolor: '#cbd5e1',
            tickfont: exportLayout.xaxis.tickfont ? { ...exportLayout.xaxis.tickfont, color: '#334155' } : { color: '#334155' },
            title: exportLayout.xaxis.title ? (typeof exportLayout.xaxis.title === 'string' ? { text: exportLayout.xaxis.title, font: { color: '#0f172a' } } : { ...exportLayout.xaxis.title, font: { color: '#0f172a', ...exportLayout.xaxis.title.font } }) : undefined
        };
    }
    
    // Adjust Y axis colors (dark labels and grid lines)
    if (exportLayout.yaxis) {
        exportLayout.yaxis = {
            ...exportLayout.yaxis,
            gridcolor: '#e2e8f0',
            zerolinecolor: '#cbd5e1',
            tickfont: exportLayout.yaxis.tickfont ? { ...exportLayout.yaxis.tickfont, color: '#334155' } : { color: '#334155' },
            title: exportLayout.yaxis.title ? (typeof exportLayout.yaxis.title === 'string' ? { text: exportLayout.yaxis.title, font: { color: '#0f172a' } } : { ...exportLayout.yaxis.title, font: { color: '#0f172a', ...exportLayout.yaxis.title.font } }) : undefined
        };
    }
    
    // Adjust Legend fonts
    if (exportLayout.legend) {
        exportLayout.legend = {
            ...exportLayout.legend,
            font: exportLayout.legend.font ? { ...exportLayout.legend.font, color: '#1e293b' } : { color: '#1e293b' }
        };
    }
    
    // Temporarily apply the light layout, capture the image, and revert
    Plotly.relayout(gd, exportLayout).then(() => {
        if (format === 'jpeg') {
            Plotly.downloadImage(gd, {
                format: 'jpeg',
                filename: filename,
                width: 1200,
                height: 800,
                setBackground: '#ffffff'
            }).then(() => {
                Plotly.relayout(gd, originalLayout);
            }).catch(err => {
                Plotly.relayout(gd, originalLayout);
                console.error(err);
            });
        } else if (format === 'pdf') {
            Plotly.toImage(gd, {
                format: 'jpeg',
                width: 1200,
                height: 800,
                quality: 1,
                setBackground: '#ffffff'
            }).then(dataUrl => {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('landscape', 'px', [1200, 800]);
                pdf.addImage(dataUrl, 'JPEG', 0, 0, 1200, 800);
                pdf.save(`${filename}.pdf`);
                Plotly.relayout(gd, originalLayout);
            }).catch(err => {
                Plotly.relayout(gd, originalLayout);
                console.error(err);
                alert("PDF 생성 중 오류가 발생했습니다: " + err.message);
            });
        }
    });
}

function exportKeggMap(format, filename) {
    const container = document.getElementById("kegg-map-container");
    const wrapper = container.querySelector(".kegg-image-wrapper");
    if (!wrapper) {
        alert("선택 및 로드된 KEGG Pathway 지도가 없습니다.");
        return;
    }
    
    // Save original inline styles to restore after capture
    const originalWidthStyle = wrapper.style.width;
    const originalHeightStyle = wrapper.style.height;
    const originalOverflowStyle = wrapper.style.overflow;
    
    // Get full scrollable/renderable dimensions of the pathway map
    const fullWidth = wrapper.scrollWidth;
    const fullHeight = wrapper.scrollHeight;
    
    // Temporarily force wrapper size to fit the entire map to prevent clipping
    wrapper.style.width = `${fullWidth}px`;
    wrapper.style.height = `${fullHeight}px`;
    wrapper.style.overflow = "visible";
    
    html2canvas(wrapper, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: fullWidth,
        height: fullHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        scale: 2 // Double scale for high-definition publication resolution
    }).then(canvas => {
        // Restore styles immediately
        wrapper.style.width = originalWidthStyle;
        wrapper.style.height = originalHeightStyle;
        wrapper.style.overflow = originalOverflowStyle;
        
        if (format === 'jpeg') {
            const link = document.createElement("a");
            link.download = `${filename}.jpg`;
            link.href = canvas.toDataURL("image/jpeg", 0.95);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (format === 'pdf') {
            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            const imgWidth = canvas.width / 2; // Compensate scale: 2
            const imgHeight = canvas.height / 2;
            
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF(imgWidth > imgHeight ? 'l' : 'p', 'px', [imgWidth, imgHeight]);
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${filename}.pdf`);
        }
    }).catch(err => {
        // Restore styles on error
        wrapper.style.width = originalWidthStyle;
        wrapper.style.height = originalHeightStyle;
        wrapper.style.overflow = originalOverflowStyle;
        console.error(err);
        alert("KEGG 지도 캡처 및 내보내기 실패: " + err.message);
    });
}

// ----------------------------------------------------------------------
// 13. Promoter Sequence Motif Discovery
// ----------------------------------------------------------------------
function renderMotifLogoPlaceholder() {
    const chartDiv = document.getElementById("motif-logo-chart");
    if (!chartDiv) return;
    
    chartDiv.innerHTML = `
        <div class="text-center text-muted" style="padding: 100px 0;">
            <i class="fa-solid fa-wand-magic-sparkles fa-3x mb-15" style="color: #cbd5e1;"></i>
            <p style="font-size: 14px; font-weight: 500;">상단 '모티프 분석 실행' 버튼을 눌러 프로모터 모티프를 도출하세요.</p>
        </div>
    `;
    
    document.getElementById("motif-consensus-text").textContent = "N/A";
    document.getElementById("motif-score-text").textContent = "N/A";
}

function runMotifAnalysis() {
    if (gGenes.length === 0) {
        alert("분석할 유전자 발현 데이터가 없습니다. 먼저 데이터를 로드해 주세요.");
        return;
    }
    
    const chartDiv = document.getElementById("motif-logo-chart");
    const lenSelect = document.getElementById("motif-len-select");
    const motifLen = lenSelect ? lenSelect.value : 8;
    
    chartDiv.innerHTML = `
        <div style="text-align: center; padding-top: 150px; color: #64748b;">
            <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
            <p style="margin-top: 10px; font-weight: 500;">프로모터 서열 획득 및 Gibbs Sampling 모티프 연산 중...</p>
        </div>
    `;
    
    // Calculate targetList based on current threshold
    const log2fcThresh = parseFloat(document.getElementById("log2fc-thresh").value) || 0;
    const pvalThresh = parseFloat(document.getElementById("pvalue-thresh").value) || 1.0;
    const statType = document.getElementById("stat-type") ? document.getElementById("stat-type").value : "fdr";
    const targetList = [];
    gGenes.forEach(gene => {
        const statVal = statType === "fdr" ? gene.fdr : gene.pvalue;
        const passesLog2FC = Math.abs(gene.log2fc) >= log2fcThresh;
        let passesPVal = true;
        if (statType !== "none" && gIsReplicateMode) {
            passesPVal = (statVal !== null && statVal <= pvalThresh);
        }
        if (passesLog2FC && passesPVal) {
            targetList.push(gene.locus_tag);
        }
    });

    if (targetList.length === 0) {
        chartDiv.innerHTML = `
            <div class="text-center text-warning" style="padding-top: 150px;">
                <i class="fa-solid fa-triangle-exclamation fa-2x mb-10"></i>
                <p>현재 필터 기준에 부합하는 유효한 DEG 유전자가 없습니다.<br>상단 필터 설정을 조정하여 유의미한 유전자를 확보해 주세요.</p>
            </div>
        `;
        return;
    }
    
    fetch(`${API_URL}/api/motif_discovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            genes: targetList,
            motif_len: parseInt(motifLen)
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.success === false || !data.consensus) {
            chartDiv.innerHTML = `
                <div class="text-center text-danger" style="padding-top: 150px;">
                    <i class="fa-solid fa-circle-exclamation fa-2x mb-10"></i>
                    <p>모티프 분석 실패: ${data.detail || "서열 정보가 부족합니다."}</p>
                </div>
            `;
            return;
        }
        
        // Update summary text
        document.getElementById("motif-consensus-text").textContent = data.consensus || "N/A";
        document.getElementById("motif-score-text").textContent = `${data.score ? data.score.toFixed(3) : "0"} bits`;
        
        // Draw Sequence Logo stacked bar chart
        const logoData = data.logo || [];
        if (logoData.length === 0) {
            chartDiv.innerHTML = `<div class="text-center text-muted" style="padding-top: 150px;">모티프 데이터가 비어 있습니다.</div>`;
            return;
        }
        
        // Prepare arrays for Plotly traces
        const positions = logoData.map(d => `Pos ${d.position}`);
        const bitsA = logoData.map(d => d.heights ? d.heights.A || 0.0 : 0.0);
        const bitsC = logoData.map(d => d.heights ? d.heights.C || 0.0 : 0.0);
        const bitsG = logoData.map(d => d.heights ? d.heights.G || 0.0 : 0.0);
        const bitsT = logoData.map(d => d.heights ? d.heights.T || 0.0 : 0.0);
        
        // Trace A (Emerald Green)
        const traceA = {
            x: positions,
            y: bitsA,
            name: 'A',
            type: 'bar',
            marker: { color: '#10b981' },
            hovertemplate: 'Position %{x}<br>A: %{y:.3f} bits<extra></extra>'
        };
        
        // Trace C (Blue)
        const traceC = {
            x: positions,
            y: bitsC,
            name: 'C',
            type: 'bar',
            marker: { color: '#3b82f6' },
            hovertemplate: 'Position %{x}<br>C: %{y:.3f} bits<extra></extra>'
        };
        
        // Trace G (Orange/Amber)
        const traceG = {
            x: positions,
            y: bitsG,
            name: 'G',
            type: 'bar',
            marker: { color: '#f59e0b' },
            hovertemplate: 'Position %{x}<br>G: %{y:.3f} bits<extra></extra>'
        };
        
        // Trace T (Red)
        const traceT = {
            x: positions,
            y: bitsT,
            name: 'T',
            type: 'bar',
            marker: { color: '#ef4444' },
            hovertemplate: 'Position %{x}<br>T: %{y:.3f} bits<extra></extra>'
        };
        
        const layout = {
            title: {
                text: `Promoter Consensus Motif: "${data.consensus}" (Length: ${motifLen} bp)`,
                font: { size: 16, color: '#0f172a', family: 'Inter, sans-serif' }
            },
            xaxis: {
                title: 'Sequence Position (5\' -> 3\')',
                tickfont: { size: 12, color: '#475569' }
            },
            yaxis: {
                title: 'Information Content (Bits)',
                gridcolor: '#e2e8f0',
                range: [0, 2.1], // Maximum information content for DNA is 2 bits
                tickfont: { size: 12, color: '#475569' }
            },
            barmode: 'stack', // Stacked bars mock the sequence logo
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: { l: 60, r: 20, t: 60, b: 60 },
            legend: {
                orientation: 'h',
                yanchor: 'bottom',
                y: 1.02,
                xanchor: 'right',
                x: 1
            }
        };
        
        chartDiv.innerHTML = "";
        Plotly.newPlot('motif-logo-chart', [traceT, traceG, traceC, traceA], layout, {responsive: true});
    })
    .catch(err => {
        console.error("Motif 분석 중 오류 발생:", err);
        chartDiv.innerHTML = `
            <div class="text-center text-danger" style="padding-top: 150px;">
                <i class="fa-solid fa-circle-exclamation fa-2x mb-10"></i>
                <p>모티프 분석 오류: ${err.message}</p>
            </div>
        `;
    });
}

// ----------------------------------------------------------------------
// 10. Advanced Strain Analysis Integration
// ----------------------------------------------------------------------
function initAdvancedAnalysisBindings() {
    // Subtab toggles
    const subtabTfBtn = document.getElementById("btn-subtab-tf");
    const subtabBottleneckBtn = document.getElementById("btn-subtab-bottleneck");
    const subtabStressBtn = document.getElementById("btn-subtab-stress");
    const subtabReporterBtn = document.getElementById("btn-subtab-reporter");
    const subtabCandidateBtn = document.getElementById("btn-subtab-candidate");

    const tfArea = document.getElementById("subtab-tf-area");
    const bottleneckArea = document.getElementById("subtab-bottleneck-area");
    const stressArea = document.getElementById("subtab-stress-area");
    const reporterArea = document.getElementById("subtab-reporter-area");
    const candidateArea = document.getElementById("subtab-candidate-area");

    const resetSubtabs = () => {
        [subtabTfBtn, subtabBottleneckBtn, subtabStressBtn, subtabCandidateBtn].forEach(btn => {
            if (btn) {
                btn.classList.remove("active");
                btn.style.color = "var(--text-muted)";
                btn.style.borderColor = "var(--border-color)";
            }
        });
        [tfArea, bottleneckArea, stressArea, candidateArea].forEach(area => {
            if (area) area.style.display = "none";
        });
    };

    if (subtabTfBtn) {
        subtabTfBtn.addEventListener("click", () => {
            resetSubtabs();
            subtabTfBtn.classList.add("active");
            subtabTfBtn.style.color = "var(--text-primary)";
            subtabTfBtn.style.borderColor = "var(--primary-color)";
            if (tfArea) tfArea.style.display = "block";
        });
    }

    if (subtabBottleneckBtn) {
        subtabBottleneckBtn.addEventListener("click", () => {
            resetSubtabs();
            subtabBottleneckBtn.classList.add("active");
            subtabBottleneckBtn.style.color = "var(--text-primary)";
            subtabBottleneckBtn.style.borderColor = "var(--primary-color)";
            if (bottleneckArea) bottleneckArea.style.display = "block";
            populateBottleneckPathwayDropdown();
        });
    }

    if (subtabStressBtn) {
        subtabStressBtn.addEventListener("click", () => {
            resetSubtabs();
            subtabStressBtn.classList.add("active");
            subtabStressBtn.style.color = "var(--text-primary)";
            subtabStressBtn.style.borderColor = "var(--primary-color)";
            if (stressArea) stressArea.style.display = "block";
        });
    }



    if (subtabCandidateBtn) {
        subtabCandidateBtn.addEventListener("click", () => {
            resetSubtabs();
            subtabCandidateBtn.classList.add("active");
            subtabCandidateBtn.style.color = "var(--text-primary)";
            subtabCandidateBtn.style.borderColor = "var(--primary-color)";
            if (candidateArea) candidateArea.style.display = "block";
            populateCandidateCategories();
        });
    }

    // Action button listeners
    const btnRunTf = document.getElementById("btn-run-tf-analysis");
    if (btnRunTf) btnRunTf.addEventListener("click", runTFActivityAnalysis);

    const btnRunBottleneck = document.getElementById("btn-run-bottleneck");
    if (btnRunBottleneck) btnRunBottleneck.addEventListener("click", runMetabolicBottleneckScan);

    const btnRunStress = document.getElementById("btn-run-stress-prediction");
    if (btnRunStress) btnRunStress.addEventListener("click", runStressSpectrumPrediction);



    // Candidate Target & Bypass Enzyme Finder bindings
    initCandidateTargetFinderBindings();

    // Toggle WT / Mutant traces in stress radar chart
    const btnToggleWT = document.getElementById("btn-stress-toggle-wt");
    const btnToggleMut = document.getElementById("btn-stress-toggle-mut");

    if (btnToggleWT) {
        btnToggleWT.addEventListener("click", () => {
            btnToggleWT.classList.toggle("active");
            renderStressRadarChart();
        });
    }

    if (btnToggleMut) {
        btnToggleMut.addEventListener("click", () => {
            btnToggleMut.classList.toggle("active");
            renderStressRadarChart();
        });
    }
}

// 1) TF Activity Analysis
function runTFActivityAnalysis() {
    const chartDiv = document.getElementById("tf-activity-chart");
    chartDiv.innerHTML = `<div style="text-align:center; padding-top:150px; color:#64748b;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top:10px;">전사인자 활성 추론 계산 중...</p></div>`;

    fetch(`${API_URL}/api/tf_activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    })
    .then(res => {
        if (!res.ok) throw new Error("TF 분석 API 실패");
        return res.json();
    })
    .then(data => {
        if (!data.success || data.results.length === 0) {
            chartDiv.innerHTML = `<div style="text-align:center; padding-top:150px; color:#ef4444;">유의한 전사인자 표적 농축 결과를 도출하지 못했습니다.</div>`;
            return;
        }

        const results = data.results;
        const tfNames = results.map(r => r.tf);
        const scores = results.map(r => r.score);
        const colors = scores.map(s => s >= 0 ? 'rgba(99, 102, 241, 0.85)' : 'rgba(239, 68, 68, 0.85)');

        const trace = {
            x: scores,
            y: tfNames,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: colors,
                line: { color: 'rgba(0, 0, 0, 0.1)', width: 1 }
            },
            text: scores.map(s => `${s >= 0 ? '+' : ''}${s}`),
            textposition: 'auto',
            customdata: results
        };

        const layout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: {
                title: '활성 활성화도 지수 (PSRS Score)',
                gridcolor: '#e2e8f0',
                zerolinecolor: '#cbd5e1'
            },
            yaxis: {
                autorange: 'reversed',
                gridcolor: '#e2e8f0'
            },
            margin: { l: 80, r: 30, t: 10, b: 60 }
        };

        chartDiv.innerHTML = "";
        const myPlot = document.createElement("div");
        myPlot.style.width = "100%";
        myPlot.style.height = "100%";
        chartDiv.appendChild(myPlot);

        Plotly.newPlot(myPlot, [trace], layout, {responsive: true});

        myPlot.on('plotly_click', function(clickData) {
            const point = clickData.points[0];
            const tfData = point.customdata;
            displayTfTargetDEGs(tfData);
        });

        displayTfTargetDEGs(results[0]);
    })
    .catch(err => {
        console.error(err);
        chartDiv.innerHTML = `<div style="text-align:center; padding-top:150px; color:#ef4444;">오류 발생: ${err.message}</div>`;
    });
}

function displayTfTargetDEGs(tfData) {
    document.getElementById("tf-selected-desc").innerHTML = `
        <strong>${tfData.tf}</strong>: ${tfData.description}<br>
        <span class="text-muted" style="font-size:11px;">P-value: ${tfData.p_value.toExponential(3)} | 상태: <span style="font-weight:bold; color:${tfData.state==='Activated'?'#4f46e5':'#dc2626'}">${tfData.state}</span></span>
    `;

    const container = document.getElementById("tf-target-list-container");
    container.innerHTML = "";

    if (tfData.target_degs.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#94a3b8; padding-top:40px; font-size:12px;">유의미한 표적 발현 유전자(DEG)가 존재하지 않습니다.</div>`;
        return;
    }

    tfData.target_degs.forEach(sym => {
        const row = document.createElement("div");
        row.className = "tf-gene-row";
        
        const matched = gGenes.find(g => g.gene_symbol.toUpperCase() === sym.toUpperCase());
        const log2fc = matched ? matched.log2fc : 0.0;
        const colorClass = log2fc >= 0 ? "up-text" : "down-text";

        row.innerHTML = `
            <span><strong>${sym}</strong></span>
            <span class="${colorClass}" style="font-weight:bold;">${log2fc > 0 ? '+' : ''}${log2fc} Log2FC</span>
        `;
        container.appendChild(row);
    });
}

// 2) Metabolic Bottleneck Scan
function populateBottleneckPathwayDropdown() {
    const select = document.getElementById("bottleneck-pathway-select");
    if (!select) return;
    if (select.children.length > 0) return;

    fetch(`${API_URL}/api/pathways`)
    .then(res => res.json())
    .then(data => {
        select.innerHTML = "";
        data.pathways.forEach(path => {
            const opt = document.createElement("option");
            opt.value = path.pathway_id;
            opt.textContent = `${path.pathway_id.replace("path:", "")} - ${path.description.length > 25 ? path.description.substring(0, 25) + '...' : path.description}`;
            select.appendChild(opt);
        });
    })
    .catch(err => console.error("KEGG 목록 로드 실패:", err));
}

function runMetabolicBottleneckScan() {
    const select = document.getElementById("bottleneck-pathway-select");
    if (!select) return;
    const pathwayId = select.value;

    const tbody = document.getElementById("bottleneck-table-body");
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:50px 0;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top:10px;">대사 경로 병목 지점 스캔 중...</p></td></tr>`;

    fetch(`${API_URL}/api/metabolic_bottleneck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathway_id: pathwayId })
    })
    .then(res => {
        if (!res.ok) throw new Error("병목 분석 API 실패");
        return res.json();
    })
    .then(data => {
        tbody.innerHTML = "";
        if (!data.success || data.candidates.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#64748b; padding:40px 0;">본 경로에는 임계 범위 내에 걸려있는 병목 의심 유전자가 검출되지 않았습니다.</td></tr>`;
            return;
        }

        data.candidates.forEach(cand => {
            const row = document.createElement("tr");
            const classSeverity = cand.severity === "High" ? "severity-high" : "severity-medium";
            
            row.innerHTML = `
                <td><code>${cand.locus_tag}</code></td>
                <td><strong>${cand.gene_symbol}</strong></td>
                <td>${cand.wt_val}</td>
                <td>${cand.mutant_val}</td>
                <td class="${cand.log2fc >= 0 ? 'up-text' : 'down-text'}">${cand.log2fc > 0 ? '+' : ''}${cand.log2fc}</td>
                <td style="color:#475569; font-size:12px;">${cand.reason}</td>
                <td><span class="${classSeverity}">${cand.severity}</span></td>
                <td style="font-size:12px; color:#1e293b; line-height:1.4;">${cand.guide}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#ef4444; padding:40px 0;">분석 실패: ${err.message}</td></tr>`;
    });
}

// 3) Stress Spectrum Prediction (Radar Chart)
let gLastStressData = null;

function runStressSpectrumPrediction() {
    const chartDiv = document.getElementById("stress-radar-chart");
    chartDiv.innerHTML = `<div style="text-align:center; padding-top:130px; color:#64748b;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top:10px;">스트레스 저항성 판정 연산 중...</p></div>`;

    const reportContainer = document.getElementById("stress-report-container");
    reportContainer.innerHTML = "";

    fetch(`${API_URL}/api/stress_prediction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    })
    .then(res => {
        if (!res.ok) throw new Error("스트레스 분석 API 실패");
        return res.json();
    })
    .then(data => {
        if (!data.success || data.profiles.length === 0) {
            chartDiv.innerHTML = `<div style="text-align:center; padding-top:130px; color:#ef4444;">유효한 매칭 데이터를 확보하지 못했습니다.</div>`;
            return;
        }

        gLastStressData = data.profiles;
        
        // Render Chart based on toggles
        renderStressRadarChart();

        // Render Report
        data.profiles.forEach(p => {
            const card = document.createElement("div");
            card.style.border = "1px solid var(--border-color)";
            card.style.borderRadius = "8px";
            card.style.padding = "12px";
            card.style.background = "#ffffff";
            
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <strong>${p.name}</strong>
                    <span class="${p.class_name}">${p.status} (PSRS: ${p.score})</span>
                </div>
                <p style="font-size:12px; color:#475569; line-height:1.4; margin-bottom:0;">${p.verdict}</p>
            `;
            reportContainer.appendChild(card);
        });
    })
    .catch(err => {
        console.error(err);
        chartDiv.innerHTML = `<div style="text-align:center; padding-top:130px; color:#ef4444;">오류: ${err.message}</div>`;
    });
}

function renderStressRadarChart() {
    const chartDiv = document.getElementById("stress-radar-chart");
    if (!gLastStressData || gLastStressData.length === 0) return;

    const btnWT = document.getElementById("btn-stress-toggle-wt");
    const btnMut = document.getElementById("btn-stress-toggle-mut");

    const showWT = btnWT ? btnWT.classList.contains("active") : true;
    const showMut = btnMut ? btnMut.classList.contains("active") : true;

    // Styles update based on active class
    if (btnWT) {
        if (showWT) {
            btnWT.style.background = "#fef2f2";
            btnWT.style.color = "#dc2626";
            btnWT.style.borderColor = "#fca5a5";
        } else {
            btnWT.style.background = "#ffffff";
            btnWT.style.color = "var(--text-muted)";
            btnWT.style.borderColor = "var(--border-color)";
        }
    }
    if (btnMut) {
        if (showMut) {
            btnMut.style.background = "#e0e7ff";
            btnMut.style.color = "#4f46e5";
            btnMut.style.borderColor = "#a5b4fc";
        } else {
            btnMut.style.background = "#ffffff";
            btnMut.style.color = "var(--text-muted)";
            btnMut.style.borderColor = "var(--border-color)";
        }
    }

    const thetaVals = gLastStressData.map(p => p.name);
    thetaVals.push(thetaVals[0]); // circular wrap-around

    const traces = [];

    // 1) Wild-Type Trace (Red)
    if (showWT) {
        const wtScores = Array(gLastStressData.length + 1).fill(0.0);
        traces.push({
            type: 'scatterpolar',
            r: wtScores,
            theta: thetaVals,
            name: '야생형 (WT)',
            fill: 'toself',
            fillcolor: 'rgba(239, 68, 68, 0.12)',
            line: { color: 'rgba(239, 68, 68, 0.85)', width: 2 },
            marker: { size: 6 }
        });
    }

    // 2) Mutant Trace (Indigo/Blue)
    if (showMut) {
        const mutScores = gLastStressData.map(p => p.score);
        mutScores.push(mutScores[0]);
        traces.push({
            type: 'scatterpolar',
            r: mutScores,
            theta: thetaVals,
            name: '변이주 (Mutant)',
            fill: 'toself',
            fillcolor: 'rgba(99, 102, 241, 0.12)',
            line: { color: 'rgba(99, 102, 241, 0.85)', width: 2 },
            marker: { size: 6 }
        });
    }

    const layout = {
        polar: {
            radialaxis: {
                visible: true,
                range: [-10, 10],
                gridcolor: '#e2e8f0',
                zerolinecolor: '#cbd5e1'
            },
            angularaxis: {
                gridcolor: '#e2e8f0'
            }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { l: 45, r: 45, t: 30, b: 30 },
        showlegend: false
    };

    chartDiv.innerHTML = "";
    const myPlot = document.createElement("div");
    myPlot.style.width = "100%";
    myPlot.style.height = "100%";
    chartDiv.appendChild(myPlot);

    Plotly.newPlot(myPlot, traces, layout, {responsive: true});
}

// 5) Candidate Target & Bypass Enzyme Finder
let gCandidateScanMode = "reference";
let gLastCandidateScanData = null;

function initCandidateTargetFinderBindings() {
    const modeBtns = document.querySelectorAll(".cand-mode-btn");
    const panelRef = document.getElementById("cand-panel-reference");
    const panelAct = document.getElementById("cand-panel-activity");
    const onlySwitchChk = document.getElementById("cand-only-on-switch");

    modeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            gCandidateScanMode = btn.getAttribute("data-mode") || "reference";
            modeBtns.forEach(b => {
                b.classList.remove("active");
                b.style.background = "#ffffff";
                b.style.color = "#475569";
                b.style.borderColor = "#cbd5e1";
            });
            btn.classList.add("active");
            btn.style.background = "#eef2ff";
            btn.style.color = "#4338ca";
            btn.style.borderColor = "#6366f1";

            if (panelRef) panelRef.style.display = (gCandidateScanMode === "reference") ? "block" : "none";
            if (panelAct) panelAct.style.display = (gCandidateScanMode === "activity") ? "block" : "none";
            if (gCandidateScanMode === "on_off" && onlySwitchChk) {
                onlySwitchChk.checked = true;
            }
        });
    });

    // Reference preset buttons
    document.querySelectorAll(".cand-preset-ref").forEach(btn => {
        btn.addEventListener("click", () => {
            const genes = btn.getAttribute("data-genes") || "";
            const input = document.getElementById("cand-ref-genes-input");
            if (input) input.value = genes;
            runCandidateTargetScan();
        });
    });

    // Quick activity buttons
    document.querySelectorAll(".cand-quick-act").forEach(btn => {
        btn.addEventListener("click", () => {
            const goid = btn.getAttribute("data-goid") || "GO:0016791";
            const select = document.getElementById("cand-activity-select");
            if (select) select.value = goid;
            runCandidateTargetScan();
        });
    });

    const btnRun = document.getElementById("btn-run-candidate-scan");
    if (btnRun) {
        btnRun.addEventListener("click", runCandidateTargetScan);
    }

    const btnExportCsv = document.getElementById("btn-export-cand-csv");
    if (btnExportCsv) {
        btnExportCsv.addEventListener("click", exportCandidateTargetsToCSV);
    }
}

function populateCandidateCategories() {
    const select = document.getElementById("cand-activity-select");
    if (!select) return;

    const sidParam = gActiveSessionId ? `?session_id=${encodeURIComponent(gActiveSessionId)}&species=${encodeURIComponent(gCurrentSpecies || 'sce')}` : `?species=${encodeURIComponent(gCurrentSpecies || 'sce')}`;
    fetch(`${API_URL}/api/candidate_targets/categories${sidParam}`)
    .then(res => res.json())
    .then(data => {
        if (!data.success) return;

        const ctrlName = data.control_name || "WT";
        const treatName = data.treated_name || "Mutant";
        const groupLabel = document.getElementById("cand-chart-group-label");
        if (groupLabel) groupLabel.textContent = `${ctrlName} vs ${treatName}`;
        const thWt = document.getElementById("cand-th-wt");
        if (thWt) thWt.textContent = `${ctrlName} 발현량 (백분위)`;
        const thMut = document.getElementById("cand-th-mut");
        if (thMut) thMut.textContent = `${treatName} 발현량 (백분위)`;

        const curVal = select.value || "GO:0016791";
        select.innerHTML = "";

        const optAll = document.createElement("option");
        optAll.value = "all";
        optAll.textContent = "🌐 전체 유전자 / 키워드 자유 검색";
        select.appendChild(optAll);

        if (data.mol_functions && data.mol_functions.length > 0) {
            const grpF = document.createElement("optgroup");
            grpF.label = "🧪 분자 기능 / 효소 활성 (GO Molecular Function)";
            data.mol_functions.forEach(item => {
                const opt = document.createElement("option");
                opt.value = item.goid;
                opt.textContent = `${item.goid} - ${item.name} (${item.count}개 유전자)`;
                grpF.appendChild(opt);
            });
            select.appendChild(grpF);
        }

        if (data.bio_processes && data.bio_processes.length > 0) {
            const grpP = document.createElement("optgroup");
            grpP.label = "🔄 생물학적 대사 과정 (GO Biological Process)";
            data.bio_processes.forEach(item => {
                const opt = document.createElement("option");
                opt.value = item.goid;
                opt.textContent = `${item.goid} - ${item.name} (${item.count}개 유전자)`;
                grpP.appendChild(opt);
            });
            select.appendChild(grpP);
        }

        // Restore selection if available
        if ([...select.options].some(o => o.value === curVal)) {
            select.value = curVal;
        } else if ([...select.options].some(o => o.value === "GO:0016791")) {
            select.value = "GO:0016791";
        }
    })
    .catch(err => console.error("Failed to load candidate categories:", err));
}

function runCandidateTargetScan() {
    const chartDiv = document.getElementById("cand-scatter-chart");
    const tbody = document.getElementById("cand-results-tbody");
    const banner = document.getElementById("cand-ref-diagnostic-banner");

    const refGenes = document.getElementById("cand-ref-genes-input") ? document.getElementById("cand-ref-genes-input").value.trim() : "";
    const actGoid = document.getElementById("cand-activity-select") ? document.getElementById("cand-activity-select").value : "all";
    const direction = document.getElementById("cand-direction-select") ? document.getElementById("cand-direction-select").value : "up";
    const wtMax = parseFloat(document.getElementById("cand-wt-max-input")?.value) || 5.0;
    const mutMin = parseFloat(document.getElementById("cand-mut-min-input")?.value) || 10.0;
    const minFc = parseFloat(document.getElementById("cand-min-fc-input")?.value) || 0.5;
    const keyword = document.getElementById("cand-keyword-input") ? document.getElementById("cand-keyword-input").value.trim() : "";
    const onlyOnSwitch = document.getElementById("cand-only-on-switch") ? document.getElementById("cand-only-on-switch").checked : false;

    if (gCandidateScanMode === "reference" && !refGenes) {
        showGshToast("기준(Reference) 유전자를 1개 이상 입력해주세요 (예: ISN1, SDT1, PHO8).");
        return;
    }

    if (chartDiv) {
        chartDiv.innerHTML = `<div style="text-align:center; color:#64748b;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top:10px;">유전체 기능 주석(GO/EC/도메인) 및 On/Off 발현 전환 스캔 중...</p></div>`;
    }
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:45px 0; color:#64748b;"><i class="fa-solid fa-spinner fa-spin"></i> 후보 유전자 랭킹 연산 중...</td></tr>`;
    }

    fetch(`${API_URL}/api/candidate_targets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            session_id: gActiveSessionId,
            species: gCurrentSpecies || "sce",
            mode: gCandidateScanMode,
            reference_genes: refGenes,
            activity_goid: actGoid,
            keyword: keyword,
            direction: direction,
            only_on_switch: onlyOnSwitch,
            wt_max_cutoff: wtMax,
            mut_min_cutoff: mutMin,
            min_abs_log2fc: minFc
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("타겟 후보 발굴 API 호출 실패");
        return res.json();
    })
    .then(data => {
        if (!data.success) {
            throw new Error(data.detail || "결과를 생성하지 못했습니다.");
        }
        gLastCandidateScanData = data;

        const ctrlName = data.control_name || "WT";
        const treatName = data.treated_name || "Mutant";
        const groupLabel = document.getElementById("cand-chart-group-label");
        if (groupLabel) groupLabel.textContent = `${ctrlName} vs ${treatName}`;
        const thWt = document.getElementById("cand-th-wt");
        if (thWt) thWt.textContent = `${ctrlName} 발현량 (백분위)`;
        const thMut = document.getElementById("cand-th-mut");
        if (thMut) thMut.textContent = `${treatName} 발현량 (백분위)`;

        // Render Reference Diagnostic Banner if in reference mode
        renderCandidateRefBanner(data);

        // Render Scatter Plot
        renderCandidateScatterChart(data, wtMax, mutMin);

        // Render Table
        renderCandidateResultsTable(data);

        // Auto-select #1 candidate in detail box
        if (data.candidates && data.candidates.length > 0) {
            renderCandidateDetailBox(data.candidates[0], ctrlName, treatName);
        } else if (data.reference_profiles && data.reference_profiles.length > 0) {
            renderCandidateDetailBox(data.reference_profiles[0], ctrlName, treatName);
        }
    })
    .catch(err => {
        console.error(err);
        if (chartDiv) chartDiv.innerHTML = `<div style="text-align:center; color:#ef4444;">오류: ${err.message}</div>`;
        if (tbody) tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#ef4444; padding:40px 0;">분석 실패: ${err.message}</td></tr>`;
        if (banner) banner.style.display = "none";
    });
}

function renderCandidateRefBanner(data) {
    const banner = document.getElementById("cand-ref-diagnostic-banner");
    const refContainer = document.getElementById("cand-ref-genes-badges");
    const funcContainer = document.getElementById("cand-shared-func-badges");
    if (!banner || !refContainer || !funcContainer) return;

    if (data.mode !== "reference" || !data.reference_profiles || data.reference_profiles.length === 0) {
        banner.style.display = "none";
        return;
    }

    banner.style.display = "block";
    refContainer.innerHTML = "";
    funcContainer.innerHTML = "";

    const ctrlName = data.control_name || "WT";
    const treatName = data.treated_name || "Mutant";

    data.reference_profiles.forEach(ref => {
        const fc = ref.log2fc;
        const fcSign = fc > 0 ? "+" : "";
        const fcColor = fc >= 0.8 ? "#dc2626" : (fc <= -0.8 ? "#2563eb" : "#475569");
        const pill = document.createElement("div");
        pill.style.cssText = "background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:6px 10px; font-size:11px; display:flex; align-items:center; gap:8px; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.03);";
        pill.title = "클릭하여 우측 패널에서 상세 정보 확인";
        pill.innerHTML = `
            <span style="background:#e0e7ff; color:#3730a3; font-weight:700; padding:1px 6px; border-radius:4px; font-size:10px;">REF</span>
            <strong>${ref.gene_symbol}</strong> <code style="font-size:10px; color:#64748b;">(${ref.locus_tag})</code>
            <span style="color:#334155;">${ctrlName}: <b>${ref.wt_val}</b> → ${treatName}: <b>${ref.mutant_val}</b></span>
            <span style="font-weight:700; color:${fcColor};">(${fcSign}${fc} Log2FC)</span>
        `;
        pill.addEventListener("click", () => renderCandidateDetailBox(ref, ctrlName, treatName));
        refContainer.appendChild(pill);
    });

    if (data.shared_functions && data.shared_functions.length > 0) {
        data.shared_functions.forEach(sf => {
            const badge = document.createElement("span");
            badge.style.cssText = "background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46; padding:4px 9px; border-radius:6px; font-size:11px; font-weight:600;";
            badge.innerHTML = `<i class="fa-solid fa-bolt" style="color:#10b981; margin-right:4px;"></i>${sf.name} (<code>${sf.goid}</code>, ${sf.count}/${data.reference_profiles.length} 일치)`;
            funcContainer.appendChild(badge);
        });
    }
    if (data.shared_ec_prefixes && data.shared_ec_prefixes.length > 0) {
        data.shared_ec_prefixes.forEach(ec => {
            const badge = document.createElement("span");
            badge.style.cssText = "background:#fef3c7; border:1px solid #fde68a; color:#92400e; padding:4px 9px; border-radius:6px; font-size:11px; font-weight:600;";
            badge.innerHTML = `<i class="fa-solid fa-flask" style="color:#f59e0b; margin-right:4px;"></i>효소 분류: EC ${ec}.-`;
            funcContainer.appendChild(badge);
        });
    }
}

function renderCandidateScatterChart(data, wtMaxCutoff, mutMinCutoff) {
    const chartDiv = document.getElementById("cand-scatter-chart");
    if (!chartDiv) return;

    const pool = data.pool_genes || [];
    const candMap = new Map((data.candidates || []).map((c, idx) => [c.locus_tag, { ...c, rank: idx + 1 }]));
    const ctrlName = data.control_name || "WT";
    const treatName = data.treated_name || "Mutant";

    if (pool.length === 0 && (!data.candidates || data.candidates.length === 0)) {
        chartDiv.innerHTML = `<div style="text-align:center; color:#94a3b8;">조건에 부합하는 유전자가 없습니다. 필터 임계값을 완화해보세요.</div>`;
        return;
    }

    const onSwitchPts = [];
    const topCandPts = [];
    const refPts = [];
    const bgPts = [];

    pool.forEach(g => {
        const xVal = Math.log10((g.wt_val || 0) + 1.0);
        const yVal = Math.log10((g.mutant_val || 0) + 1.0);
        const cObj = candMap.get(g.locus_tag) || g;
        const labelSym = g.is_unnamed_orf && g.ncbi_id ? `${g.locus_tag} (NCBI:${g.ncbi_id})` : g.gene_symbol;
        const pt = { x: xVal, y: yVal, label: labelSym, gene: cObj };

        if (g.is_reference) {
            refPts.push(pt);
        } else if (g.is_de_novo_on || g.is_de_novo_off) {
            onSwitchPts.push(pt);
        } else if (candMap.has(g.locus_tag)) {
            topCandPts.push(pt);
        } else {
            bgPts.push(pt);
        }
    });

    const makeTrace = (pts, name, color, size, symbol, showText = false) => ({
        x: pts.map(p => p.x),
        y: pts.map(p => p.y),
        mode: showText ? "markers+text" : "markers",
        type: "scatter",
        name: name,
        text: pts.map(p => p.label),
        textposition: "top center",
        textfont: { size: 11, color: "#0f172a", family: "Inter, sans-serif" },
        hovertemplate: pts.map(p =>
            `<b>${p.label}</b> (${p.gene.locus_tag})<br>` +
            `${ctrlName}: ${p.gene.wt_val} (백분위 ${p.gene.wt_pct}%)<br>` +
            `${treatName}: ${p.gene.mutant_val} (백분위 ${p.gene.mut_pct}%)<br>` +
            `Log2FC: ${p.gene.log2fc > 0 ? '+' : ''}${p.gene.log2fc}<br>` +
            `${p.gene.func_summary.substring(0, 70)}<extra></extra>`
        ),
        marker: {
            size: size,
            color: color,
            symbol: symbol,
            line: { color: "#ffffff", width: 1.2 }
        },
        customdata: pts.map(p => p.gene)
    });

    const traces = [];
    if (bgPts.length > 0) traces.push(makeTrace(bgPts, "동일 기능군 기타 유전자", "rgba(148, 163, 184, 0.55)", 7, "circle", false));
    if (topCandPts.length > 0) traces.push(makeTrace(topCandPts, "⚡ 발현 증가 후보", "#f59e0b", 10, "circle", topCandPts.length <= 12));
    if (refPts.length > 0) traces.push(makeTrace(refPts, "📌 기준(Reference) 유전자", "#3b82f6", 12, "diamond", true));
    if (onSwitchPts.length > 0) traces.push(makeTrace(onSwitchPts, "🔥 De novo On/Off 스위치", "#ef4444", 14, "star", true));

    const allX = pool.map(g => Math.log10((g.wt_val || 0) + 1.0));
    const allY = pool.map(g => Math.log10((g.mutant_val || 0) + 1.0));
    const maxCoord = Math.max(3.0, ...allX, ...allY) * 1.08;

    const xCut = Math.log10((wtMaxCutoff || 5.0) + 1.0);
    const yCut = Math.log10((mutMinCutoff || 10.0) + 1.0);

    const layout = {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "#ffffff",
        margin: { l: 55, r: 20, t: 30, b: 50 },
        xaxis: {
            title: `${ctrlName} 발현량 — Log10(Expr + 1)`,
            range: [-0.15, maxCoord],
            gridcolor: "#f1f5f9",
            zerolinecolor: "#cbd5e1"
        },
        yaxis: {
            title: `${treatName} 발현량 — Log10(Expr + 1)`,
            range: [-0.15, maxCoord],
            gridcolor: "#f1f5f9",
            zerolinecolor: "#cbd5e1"
        },
        legend: { orientation: "h", y: 1.12, x: 0, font: { size: 11 } },
        hovermode: "closest",
        shapes: [
            // y = x diagonal line
            {
                type: "line",
                x0: 0, y0: 0, x1: maxCoord, y1: maxCoord,
                line: { color: "#94a3b8", width: 1, dash: "dot" }
            },
            // Highlight box for De novo On-Switch zone (WT <= wtMaxCutoff & Mutant >= mutMinCutoff)
            {
                type: "rect",
                x0: -0.12, x1: xCut,
                y0: yCut, y1: maxCoord * 0.98,
                fillcolor: "rgba(239, 68, 68, 0.06)",
                line: { color: "rgba(239, 68, 68, 0.35)", width: 1, dash: "dash" }
            }
        ],
        annotations: [
            {
                x: xCut / 2,
                y: maxCoord * 0.93,
                text: "🔥 On-Switch 구역",
                showarrow: false,
                font: { size: 10, color: "#dc2626" }
            }
        ]
    };

    chartDiv.innerHTML = "";
    const plotEl = document.createElement("div");
    plotEl.style.width = "100%";
    plotEl.style.height = "100%";
    chartDiv.appendChild(plotEl);

    Plotly.newPlot(plotEl, traces, layout, { responsive: true });

    plotEl.on("plotly_click", (clickData) => {
        if (clickData.points && clickData.points[0] && clickData.points[0].customdata) {
            const gObj = clickData.points[0].customdata;
            renderCandidateDetailBox(gObj, ctrlName, treatName);
        }
    });
}

function renderCandidateDetailBox(gene, ctrlName = "WT", treatName = "Mutant") {
    const box = document.getElementById("cand-selected-detail-box");
    if (!box || !gene) return;

    const uniprotUrl = getUniprotUrl(gene);
    const sgdUrl = `https://www.yeastgenome.org/locus/${encodeURIComponent(gene.locus_tag)}`;
    const fcSign = gene.log2fc > 0 ? "+" : "";
    const fcColor = gene.log2fc >= 0.5 ? "#dc2626" : (gene.log2fc <= -0.5 ? "#2563eb" : "#334155");

    const unnamedAlert = gene.is_unnamed_orf
        ? `<div style="background:#fffbeb; border:1px solid #fde68a; color:#92400e; padding:6px 10px; border-radius:6px; font-size:11px; margin-bottom:10px;">
               <i class="fa-solid fa-lightbulb" style="color:#f59e0b; margin-right:4px;"></i>
               <b>숨겨진 후보 알림:</b> 이 유전자는 표준 3글자 심볼이 부여되지 않아 체계명(<code>${gene.locus_tag}</code>${gene.ncbi_id ? ` / NCBI: <code>${gene.ncbi_id}</code>` : ""})으로만 표기되므로 기존 주요 유전자 위주 검토에서 누락되기 쉬운 <b>Known-function 미명명 ORF</b>입니다.
           </div>`
        : "";

    const mfTags = (gene.mol_functions || []).map(x => `<span style="background:#eef2ff; color:#4338ca; border:1px solid #c7d2fe; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:600;">${x.name} (${x.goid})</span>`).join(" ");
    const ecTags = (gene.ec_numbers || []).map(ec => `<span style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:600;">EC ${ec}</span>`).join(" ");
    const bpTags = (gene.bio_processes || []).map(x => `<span style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; padding:2px 7px; border-radius:4px; font-size:11px;">${x.name}</span>`).join(" ");
    const ccTags = (gene.cell_components || []).map(x => `<span style="background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; padding:2px 7px; border-radius:4px; font-size:11px;">📍 ${x.name}</span>`).join(" ");

    const safeNoteKO = `${treatName} 특이 발현 우회 효소 후보 (${ctrlName}:${gene.wt_val} -> ${treatName}:${gene.mutant_val}, Log2FC:${fcSign}${gene.log2fc})`.replace(/'/g, "");
    const safeNoteOE = `${treatName} 과발현 검증 타겟 (${ctrlName}:${gene.wt_val} -> ${treatName}:${gene.mutant_val}, Log2FC:${fcSign}${gene.log2fc})`.replace(/'/g, "");
    const targetSymbol = (gene.gene_symbol && !gene.gene_symbol.match(/^\d+$/)) ? gene.gene_symbol : gene.locus_tag;

    box.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:10px; height:100%; justify-content:space-between;">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:8px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                            <span style="font-size:18px; font-weight:800; color:#0f172a;">${targetSymbol}</span>
                            <code style="font-size:12px; background:#e2e8f0; padding:2px 6px; border-radius:4px; color:#334155;">${gene.locus_tag}</code>
                            ${gene.ncbi_id ? `<span style="font-size:11px; color:#64748b;">(NCBI ID: ${gene.ncbi_id})</span>` : ""}
                            ${gene.candidate_score ? `<span style="background:#4f46e5; color:#ffffff; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:700;">Score: ${gene.candidate_score}</span>` : ""}
                        </div>
                        <div style="margin-top:4px; font-size:11px; font-weight:600; color:#dc2626;">${gene.switch_label || ""}</div>
                    </div>
                    <div style="display:flex; gap:6px;">
                        ${gCurrentSpecies === "sce" ? `<a href="${sgdUrl}" target="_blank" class="btn btn-secondary btn-sm" style="padding:3px 8px; font-size:11px; text-decoration:none;">SGD DB ↗</a>` : ""}
                        <a href="${uniprotUrl}" target="_blank" class="btn btn-secondary btn-sm" style="padding:3px 8px; font-size:11px; text-decoration:none;">UniProt ↗</a>
                    </div>
                </div>

                ${unnamedAlert}

                <!-- Expression Comparison Box -->
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:10px;">
                    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px; text-align:center;">
                        <div style="font-size:10px; color:#64748b; font-weight:600;">${ctrlName} (대조군)</div>
                        <div style="font-size:15px; font-weight:800; color:#1e293b; margin-top:2px;">${gene.wt_val}</div>
                        <div style="font-size:10px; color:#94a3b8;">백분위 ${gene.wt_pct}%</div>
                    </div>
                    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px; text-align:center;">
                        <div style="font-size:10px; color:#64748b; font-weight:600;">${treatName} (실험군)</div>
                        <div style="font-size:15px; font-weight:800; color:#dc2626; margin-top:2px;">${gene.mutant_val}</div>
                        <div style="font-size:10px; color:#94a3b8;">백분위 ${gene.mut_pct}% (${gene.pct_jump >= 0 ? "+" : ""}${gene.pct_jump}%p)</div>
                    </div>
                    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px; text-align:center;">
                        <div style="font-size:10px; color:#64748b; font-weight:600;">Log2 FC / FDR</div>
                        <div style="font-size:15px; font-weight:800; color:${fcColor}; margin-top:2px;">${fcSign}${gene.log2fc}</div>
                        <div style="font-size:10px; color:#94a3b8;">FDR: ${gene.fdr !== null && gene.fdr !== undefined ? gene.fdr : "-"}</div>
                    </div>
                </div>

                <!-- Functional Annotations -->
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:10px; font-size:11px; line-height:1.6;">
                    <div style="margin-bottom:6px;">
                        <strong style="color:#1e293b;">🧪 분자 기능 & EC 번호:</strong>
                        <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:3px;">
                            ${mfTags || `<span style="color:#94a3b8;">등록된 분자 기능 없음</span>`}
                            ${ecTags}
                        </div>
                    </div>
                    <div style="margin-bottom:6px;">
                        <strong style="color:#1e293b;">🔄 연관 대사 과정 & 세포 내 위치:</strong>
                        <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:3px;">
                            ${bpTags || `<span style="color:#94a3b8;">미등록</span>`}
                            ${ccTags}
                        </div>
                    </div>
                    ${gene.engineering_note ? `<div style="margin-top:6px; padding-top:6px; border-top:1px dashed #e2e8f0; color:#334155;"><b>💡 대사공학 진단:</b> ${gene.engineering_note}</div>` : ""}
                </div>
            </div>

            <!-- Action Buttons: Register to Target Engineering List -->
            <div style="display:flex; gap:8px; padding-top:8px; border-top:1px solid #e2e8f0;">
                <button type="button" class="btn btn-primary btn-sm" style="flex:1; background:#2563eb; border:none; padding:8px 10px; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:6px;" onclick="registerCandidateAsTarget('${targetSymbol}', 'KO', '${safeNoteKO}')">
                    <i class="fa-solid fa-scissors"></i> 결손(KO) 타겟 리스트 등록
                </button>
                <button type="button" class="btn btn-primary btn-sm" style="flex:1; background:#ef4444; border:none; padding:8px 10px; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:6px;" onclick="registerCandidateAsTarget('${targetSymbol}', 'OE', '${safeNoteOE}')">
                    <i class="fa-solid fa-arrow-up"></i> 과발현(OE) 타겟 리스트 등록
                </button>
            </div>
        </div>
    `;
}

function renderCandidateResultsTable(data) {
    const tbody = document.getElementById("cand-results-tbody");
    const countBadge = document.getElementById("cand-result-count-badge");
    if (!tbody) return;

    const candidates = data.candidates || [];
    if (countBadge) countBadge.textContent = `${data.total_candidates || candidates.length}개`;

    const ctrlName = data.control_name || "WT";
    const treatName = data.treated_name || "Mutant";

    if (candidates.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#64748b; padding:45px 0;">설정된 필터 조건에 부합하는 후보 유전자가 없습니다. [실험군 최소 발현량]이나 [On/Off 전환 필터] 조건을 완화해 보세요.</td></tr>`;
        return;
    }

    tbody.innerHTML = "";
    candidates.forEach((cand, idx) => {
        const tr = document.createElement("tr");
        tr.style.cursor = "pointer";
        if (cand.is_de_novo_on) {
            tr.style.background = "rgba(254, 242, 242, 0.55)";
        }

        const targetSymbol = (cand.gene_symbol && !cand.gene_symbol.match(/^\d+$/)) ? cand.gene_symbol : cand.locus_tag;
        const symbolHtml = cand.is_unnamed_orf
            ? `<strong>${cand.locus_tag}</strong><br><span style="font-size:10px; color:#d97706; font-weight:600;">[미명명 ORF${cand.ncbi_id ? ` / NCBI:${cand.ncbi_id}` : ""}]</span>`
            : `<strong>${cand.gene_symbol}</strong> <code style="font-size:11px; color:#64748b;">(${cand.locus_tag})</code>`;

        let switchBadgeStyle = "background:#f1f5f9; color:#475569;";
        if (cand.switch_type === "ON_SWITCH") switchBadgeStyle = "background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; font-weight:700;";
        else if (cand.switch_type === "OFF_SWITCH") switchBadgeStyle = "background:#dbeafe; color:#1d4ed8; border:1px solid #93c5fd; font-weight:700;";
        else if (cand.switch_type === "HIGH_UP") switchBadgeStyle = "background:#fef3c7; color:#92400e; border:1px solid #fde68a; font-weight:600;";

        const fcSign = cand.log2fc > 0 ? "+" : "";
        const fcClass = cand.log2fc >= 0 ? "up-text" : "down-text";

        const mfList = (cand.mol_functions || []).map(x => x.name).join(", ");
        const ecList = (cand.ec_numbers || []).length > 0 ? ` [EC ${cand.ec_numbers.join(", ")}]` : "";
        const bpList = (cand.bio_processes || []).slice(0, 2).map(x => x.name).join(", ");
        const funcDisplay = (mfList || bpList || cand.func_summary) + ecList;

        const safeNoteKO = `${treatName} 우회 효소 결실 후보 (${ctrlName}:${cand.wt_val}->${treatName}:${cand.mutant_val})`.replace(/'/g, "");
        const safeNoteOE = `${treatName} 과발현 후보 (${ctrlName}:${cand.wt_val}->${treatName}:${cand.mutant_val})`.replace(/'/g, "");

        tr.innerHTML = `
            <td style="text-align:center; font-weight:700; color:#334155;">#${idx + 1}</td>
            <td style="text-align:center;">
                <span style="background:${cand.candidate_score >= 70 ? '#4f46e5' : '#64748b'}; color:#ffffff; padding:2px 8px; border-radius:10px; font-weight:700; font-size:11px;">
                    ${cand.candidate_score}
                </span>
            </td>
            <td>${symbolHtml}</td>
            <td><span style="display:inline-block; padding:2px 7px; border-radius:6px; font-size:11px; ${switchBadgeStyle}">${cand.switch_label}</span></td>
            <td style="text-align:right;"><b>${cand.wt_val}</b> <span style="font-size:10px; color:#94a3b8;">(${cand.wt_pct}%)</span></td>
            <td style="text-align:right;"><b>${cand.mutant_val}</b> <span style="font-size:10px; color:#64748b;">(${cand.mut_pct}%)</span></td>
            <td style="text-align:right; font-weight:700;" class="${fcClass}">${fcSign}${cand.log2fc}</td>
            <td style="text-align:right; color:#64748b;">${cand.fdr !== null && cand.fdr !== undefined ? cand.fdr : "-"}</td>
            <td style="font-size:11px; color:#334155; line-height:1.4;">${funcDisplay}</td>
            <td style="text-align:center;" onclick="event.stopPropagation();">
                <div style="display:inline-flex; gap:4px;">
                    <button type="button" class="btn btn-secondary btn-sm" style="padding:2px 7px; font-size:10px; font-weight:700; color:#1d4ed8; border-color:#bfdbfe; background:#eff6ff;" title="결손(KO) 타겟 리스트에 추가" onclick="registerCandidateAsTarget('${targetSymbol}', 'KO', '${safeNoteKO}')">+KO</button>
                    <button type="button" class="btn btn-secondary btn-sm" style="padding:2px 7px; font-size:10px; font-weight:700; color:#b91c1c; border-color:#fecaca; background:#fef2f2;" title="과발현(OE) 타겟 리스트에 추가" onclick="registerCandidateAsTarget('${targetSymbol}', 'OE', '${safeNoteOE}')">+OE</button>
                </div>
            </td>
        `;

        tr.addEventListener("click", () => {
            renderCandidateDetailBox(cand, ctrlName, treatName);
        });

        tbody.appendChild(tr);
    });
}

function registerCandidateAsTarget(symbol, strategy, note) {
    // Ensure pathwayMapsStore[currentMapId] is initialized even if user hasn't opened the Custom Pathway tab yet
    if (!pathwayMapsStore || !pathwayMapsStore[currentMapId]) {
        const savedStore = localStorage.getItem("pathway_maps_store");
        if (savedStore) {
            try { pathwayMapsStore = JSON.parse(savedStore); } catch (e) {}
        }
        if (!pathwayMapsStore[currentMapId]) {
            pathwayMapsStore[currentMapId] = {
                name: "Yeast GSH Pathway (S. cerevisiae)",
                species: gCurrentSpecies || "sce",
                width: 1024,
                height: 580,
                nodes: [],
                arrows: []
            };
        }
    }
    addTargetGene(symbol, strategy, note);
}

function exportCandidateTargetsToCSV() {
    if (!gLastCandidateScanData || !gLastCandidateScanData.candidates || gLastCandidateScanData.candidates.length === 0) {
        showGshToast("먼저 타겟 후보 발굴을 실행해주세요.");
        return;
    }
    const ctrlName = gLastCandidateScanData.control_name || "WT";
    const treatName = gLastCandidateScanData.treated_name || "Mutant";
    const headers = ["Rank", "Score", "Locus_Tag", "Gene_Symbol", "NCBI_ID", "Switch_Type", `${ctrlName}_Expr`, `${ctrlName}_Pct`, `${treatName}_Expr`, `${treatName}_Pct`, "Log2FC", "FDR", "EC_Numbers", "Molecular_Functions", "Biological_Processes"];
    const rows = gLastCandidateScanData.candidates.map((c, idx) => [
        idx + 1,
        c.candidate_score,
        c.locus_tag,
        c.gene_symbol,
        c.ncbi_id || "",
        c.switch_type,
        c.wt_val,
        c.wt_pct,
        c.mutant_val,
        c.mut_pct,
        c.log2fc,
        c.fdr !== null && c.fdr !== undefined ? c.fdr : "",
        `"${(c.ec_numbers || []).join("; ")}"`,
        `"${(c.mol_functions || []).map(x => x.name).join("; ")}"`,
        `"${(c.bio_processes || []).map(x => x.name).join("; ")}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candidate_target_genes_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

