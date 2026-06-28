'use strict';

var childProcess = require('child_process');

module.exports = Editor.Panel.define({
  listeners: {
    show() {},
    hide() {},
    'status-changed'(status) {
      this._updateStatus(status || {});
    },
  },
  template: `
    <div class="panel-root">
      <div class="header">
        <span id="statusDot" class="status off"></span>
        <span id="statusText">已停止</span>
        <select id="platformSelect" class="platform-select">
          <option value="claude">Claude Code</option>
          <option value="codex">Codex</option>
          <option value="cursor">Cursor</option>
        </select>
        <div class="btn-group">
          <ui-button id="btnToggle" class="green" title="启动或停止当前项目的 MCP HTTP bridge 和 stdio 服务验证。">启动</ui-button>
          <ui-button id="btnRestart" title="重启 MCP 服务，并重新刷新状态、日志和工具列表。">重启</ui-button>
        </div>
        <span style="flex:1"></span>
        <span style="color:#888" id="portInfo">端口: --</span>
      </div>
      <div class="connect-info" id="connectInfo" style="display:none">
        <span id="connectText"></span>
      </div>
      <div class="section-title">MCP 工具 (<span id="toolCount">0</span>)</div>
      <div class="version-info" id="versionInfo">MCP: -- | Updated: -- | Tools: --</div>
      <div id="toolList" class="tools-area"></div>
      <div class="config-row">
        <label>端口:</label>
        <ui-num-input id="portInput" class="port-input" min="1024" max="65535" step="1"></ui-num-input>
      </div>
      <div class="bootstrap-row">
        <ui-button id="btnSelectEngineSource" title="Select the real local Cocos engine/editor source root and write settings/cocos-creator-38-mcp/engine-paths.*.">Select Engine Source</ui-button>
        <ui-button id="btnBuildInstallPackage" title="Build a distributable install zip containing the generic MCP extension and cocos38-dev skill.">Build Install Package</ui-button>
      </div>
      <div id="resultDialog" class="dialog-mask" style="display:none">
        <div class="dialog">
          <div class="dialog-head">
            <span id="dialogTitle">结果</span>
            <span style="flex:1"></span>
            <ui-button id="btnDialogClose" title="关闭结果弹窗。">关闭</ui-button>
          </div>
          <div id="dialogSummary" class="dialog-summary"></div>
          <div id="dialogBody" class="dialog-body"></div>
          <div class="dialog-actions">
            <ui-button id="btnDialogOpen" title="打开本次生成的 Markdown 报告。">打开报告</ui-button>
            <ui-button id="btnDialogCopy" title="复制本次结果 JSON。">复制 JSON</ui-button>
          </div>
        </div>
      </div>
    </div>
  `,
  style: `
    .panel-root { padding: 10px; display: flex; flex-direction: column; font-size: 13px; height: 100%; }
    .header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    .status { display: inline-block; width: 12px; height: 12px; border-radius: 50%; }
    .status.on { background: #4caf50; box-shadow: 0 0 6px #4caf50; }
    .status.off { background: #f44336; }
    .btn-group { display: flex; gap: 4px; }
    .section-title { margin: 6px 0 4px 0; font-weight: bold; }
    .version-info { margin: 2px 0 6px 0; color: #aaa; font-size: 11px; font-family: monospace; }
    .tools-area { flex: 0 0 auto; border: 1px solid #333; border-radius: 4px; padding: 4px; margin-bottom: 8px; max-height: 240px; overflow-y: auto; }
    .tool-category { border-bottom: 1px solid #2d2d2d; padding: 2px 0; }
    .tool-category:last-child { border-bottom: none; }
    .tool-category-head { display: flex; align-items: center; gap: 5px; padding: 4px 5px; cursor: pointer; color: #ddd; background: #252525; border-radius: 3px; }
    .tool-category-head:hover { background: #303030; }
    .tool-category-count { color: #888; font-size: 11px; margin-left: auto; }
    .tool-category-body { display: none; padding: 2px 0 3px 12px; }
    .tool-category.expanded .tool-category-body { display: block; }
    .tool-item { padding: 3px 5px; font-family: monospace; font-size: 12px; cursor: pointer; border-radius: 3px; }
    .tool-item:hover { background: #2a2a2a; }
    .tool-desc { color: #888; font-size: 11px; margin-left: 18px; display: none; line-height: 1.4; }
    .tool-item.expanded .tool-desc { display: block; }
    .config-row { display: flex; align-items: center; gap: 6px; margin: 4px 0; }
    .config-row label { width: 70px; text-align: right; color: #999; }
    .bootstrap-row { display: flex; align-items: center; gap: 6px; margin: 4px 0 8px 0; }
    .platform-select { height: 24px; border: 1px solid #555; background: #333; color: #ddd; border-radius: 3px; font-size: 12px; padding: 0 4px; }
    .port-input { width: 70px; }
    .connect-info { margin-top: 6px; padding: 6px; background: #2a2a2a; border-radius: 4px; font-size: 11px; color: #888; font-family: monospace; }
    .dialog-mask { position: absolute; inset: 0; z-index: 10; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; padding: 18px; }
    .dialog { width: min(760px, 96%); max-height: 88%; display: flex; flex-direction: column; border: 1px solid #555; background: #242424; border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.45); }
    .dialog-head { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-bottom: 1px solid #3a3a3a; font-weight: bold; }
    .dialog-summary { padding: 8px 10px; color: #ccc; border-bottom: 1px solid #333; white-space: pre-wrap; line-height: 1.5; }
    .dialog-body { padding: 10px; overflow: auto; min-height: 160px; max-height: 460px; background: #1b1b1b; font-family: monospace; font-size: 12px; white-space: pre-wrap; line-height: 1.45; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; padding: 8px 10px; border-top: 1px solid #333; }
  `,
  $: {
    statusDot: '#statusDot',
    statusText: '#statusText',
    btnToggle: '#btnToggle',
    btnRestart: '#btnRestart',
    portInfo: '#portInfo',
    connectInfo: '#connectInfo',
    connectText: '#connectText',
    platformSelect: '#platformSelect',
    toolCount: '#toolCount',
    versionInfo: '#versionInfo',
    toolList: '#toolList',
    portInput: '#portInput',
    btnSelectEngineSource: '#btnSelectEngineSource',
    btnBuildInstallPackage: '#btnBuildInstallPackage',
    resultDialog: '#resultDialog',
    dialogTitle: '#dialogTitle',
    dialogSummary: '#dialogSummary',
    dialogBody: '#dialogBody',
    btnDialogClose: '#btnDialogClose',
    btnDialogOpen: '#btnDialogOpen',
    btnDialogCopy: '#btnDialogCopy',
  },
  methods: {
    _escapeHtml(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },

    _hasClass(el, cls) {
      return el && (' ' + el.className + ' ').indexOf(' ' + cls + ' ') !== -1;
    },

    _setExpanded(el, expanded) {
      var cls = el.className || '';
      if (expanded) {
        if (!this._hasClass(el, 'expanded')) el.className = cls + ' expanded';
      } else {
        el.className = cls.replace(/\s*expanded/g, '');
      }
    },

    _getConnectInfo(platform, port, configPath) {
      var cfgPath = configPath || '.mcp.json';
      if (platform === 'claude') return '已配置 → ' + cfgPath + '\nClaude Code 会自动发现 MCP 服务';
      if (platform === 'codex') return '已配置 → ' + cfgPath + '\nCodex 会自动发现 MCP 服务';
      if (platform === 'cursor') return '已配置 → ' + cfgPath + '\nCursor 会自动发现 MCP 服务';
      return 'HTTP: http://127.0.0.1:' + port;
    },

    _getToolCategory(name) {
      var assetTools = { get_project_info:1,manage_asset:1,manage_script:1,list_assets:1,search_project:1,get_sha:1,validate_script:1,manage_texture:1,manage_material:1,manage_shader:1,manage_audio:1,manage_font:1,manage_atlas:1,manage_skeleton:1,resolve_asset:1 };
      var nodeTools = { get_scene_hierarchy:1,get_node_detail:1,create_node:1,update_node:1,delete_node:1,find_nodes:1 };
      var prefabSceneTools = { manage_scene:1,manage_prefab:1 };
      var componentTools = { manage_components:1,manage_animation:1,manage_vfx:1 };
      var editorTools = { manage_editor:1,manage_undo:1,execute_menu:1,get_editor_state:1,get_active_instances:1,set_active_instance:1,configure_client:1,get_component_schema:1,doctor:1,read_console:1,capture_screenshot:1,find_references:1 };
      var advancedTools = { batch_execute:1,apply_text_edits:1,build_project:1 };
      if (assetTools[name]) return '资源与项目';
      if (nodeTools[name]) return '场景与节点';
      if (prefabSceneTools[name]) return 'Prefab 与场景';
      if (componentTools[name]) return '组件与动画';
      if (editorTools[name]) return '编辑器辅助';
      if (advancedTools[name]) return '高级与工程';
      return '其他';
    },

    _groupTools(tools) {
      var order = ['资源与项目','场景与节点','Prefab 与场景','组件与动画','编辑器辅助','高级与工程','其他'];
      var map = {};
      for (var oi = 0; oi < order.length; oi++) map[order[oi]] = [];
      for (var i = 0; i < tools.length; i++) {
        var cat = this._getToolCategory(tools[i].name);
        if (!map[cat]) map[cat] = [];
        map[cat].push(tools[i]);
      }
      var groups = [];
      for (var gi = 0; gi < order.length; gi++) {
        if (!map[order[gi]] || !map[order[gi]].length) continue;
        map[order[gi]].sort(function(a,b){ return String(a.name).localeCompare(String(b.name)); });
        groups.push({ name: order[gi], tools: map[order[gi]] });
      }
      return groups;
    },

    _makeToolsSignature(tools) {
      var parts = [];
      for (var i = 0; i < tools.length; i++) {
        var t = tools[i] || {};
        var params = t.inputSchema && t.inputSchema.properties ? Object.keys(t.inputSchema.properties).sort().join(',') : '';
        parts.push(String(t.name||'')+'|'+String(t.description||'')+'|'+params);
      }
      return parts.sort().join('\n');
    },

    _renderTools(tools) {
      this.$.toolCount.innerText = tools.length;
      var signature = this._makeToolsSignature(tools);
      if (signature === this._lastToolsSignature) return;
      this._lastToolsSignature = signature;

      var grouped = this._groupTools(tools);
      var html = '';
      for (var gi = 0; gi < grouped.length; gi++) {
        var group = grouped[gi];
        var catExpanded = this._expandedCategories[group.name] !== false;
        html += '<div class="tool-category ' + (catExpanded ? 'expanded' : '') + '" data-category="' + this._escapeHtml(group.name) + '">' +
          '<div class="tool-category-head" data-role="category">' +
          '<span>' + (catExpanded ? '▾' : '▸') + '</span>' +
          '<b>' + this._escapeHtml(group.name) + '</b>' +
          '<span class="tool-category-count">' + group.tools.length + '</span></div>' +
          '<div class="tool-category-body">';
        for (var i = 0; i < group.tools.length; i++) {
          var t = group.tools[i];
          var params = t.inputSchema && t.inputSchema.properties ? Object.keys(t.inputSchema.properties).join(', ') : 'none';
          var toolExpanded = !!this._expandedTools[t.name];
          html += '<div class="tool-item ' + (toolExpanded ? 'expanded' : '') + '" data-tool="' + this._escapeHtml(t.name) + '">' +
            '- <b>' + this._escapeHtml(t.name) + '</b>' +
            '<div class="tool-desc">' + this._escapeHtml(t.description || '') +
            '<br/><small>参数: ' + this._escapeHtml(params) + '</small></div></div>';
        }
        html += '</div></div>';
      }
      this.$.toolList.innerHTML = html;
    },

    _handleToolListClick(e) {
      var target = e.target;
      while (target && target !== this.$.toolList) {
        if (this._hasClass(target, 'tool-category-head')) {
          var cat = target.parentNode;
          var catName = cat.getAttribute('data-category');
          var expanded = !this._hasClass(cat, 'expanded');
          this._expandedCategories[catName] = expanded;
          this._setExpanded(cat, expanded);
          if (target.children && target.children[0]) target.children[0].innerText = expanded ? '▾' : '▸';
          return;
        }
        if (this._hasClass(target, 'tool-item')) {
          var toolName = target.getAttribute('data-tool');
          var toolExpanded = !this._hasClass(target, 'expanded');
          this._expandedTools[toolName] = toolExpanded;
          this._setExpanded(target, toolExpanded);
          return;
        }
        target = target.parentNode;
      }
    },

    _appendLocalLog(message, level) {
      var text = '[MCP Panel] ' + String(message || '');
      var editor = typeof Editor !== 'undefined' ? Editor : null;
      var consoleRef = typeof console !== 'undefined' ? console : null;
      if (level === 'error') {
        if (editor && typeof editor.error === 'function') editor.error(text);
        else if (consoleRef && typeof consoleRef.error === 'function') consoleRef.error(text);
        else if (consoleRef && typeof consoleRef.log === 'function') consoleRef.log(text);
      } else if (level === 'warn') {
        if (editor && typeof editor.warn === 'function') editor.warn(text);
        else if (consoleRef && typeof consoleRef.warn === 'function') consoleRef.warn(text);
        else if (consoleRef && typeof consoleRef.log === 'function') consoleRef.log(text);
      } else if (consoleRef && typeof consoleRef.log === 'function') {
        consoleRef.log(text);
      }
    },

    _markBusy(message) {
      this.$.statusText.innerText = message || '处理中...';
      this.$.btnToggle.disabled = true;
      this.$.btnRestart.disabled = true;
      this._startFastPolling();
    },

    _releaseBusySoon() {
      var self = this;
      if (self._busyReleaseTimer) clearTimeout(self._busyReleaseTimer);
      self._busyReleaseTimer = setTimeout(function() {
        self.$.btnToggle.disabled = false;
        self.$.btnRestart.disabled = false;
        self._refreshStatus();
      }, 1500);
    },

    _appendJsonLog(prefix, value) {
      this._appendLocalLog(prefix + ': ' + JSON.stringify(value, null, 2), value && value.ok === false ? 'error' : 'success');
    },

    _summarizeInstallPackage(result) {
      return [
        'Result: ' + (result && result.ok ? 'passed' : 'failed'),
        'Version: ' + ((result && result.version) || '--'),
        'Updated: ' + ((result && result.mcpToolsUpdatedAt) || '--'),
        'Output: ' + ((result && result.outputPath) || '--'),
        'Files: ' + ((result && result.includedFilesCount) || 0),
        'Zip size: ' + ((result && result.zipSizeBytes) || 0) + ' bytes',
        'Pollution scan: ' + (result && result.pollutionScan && result.pollutionScan.ok ? 'passed' : 'failed')
      ].join('\n');
    },

    _showResultDialog(title, summary, body, raw, reportPath) {
      this._lastDialogRaw = raw || null;
      this._lastDialogReportPath = reportPath || '';
      this.$.dialogTitle.innerText = title || '结果';
      this.$.dialogSummary.innerText = summary || '';
      this.$.dialogBody.innerText = body || '';
      this.$.btnDialogOpen.style.display = reportPath ? 'inline-block' : 'none';
      this.$.resultDialog.style.display = 'flex';
    },

    _hideResultDialog() {
      this.$.resultDialog.style.display = 'none';
    },

    _copyDialogJson() {
      var text = JSON.stringify(this._lastDialogRaw || {}, null, 2);
      try {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
          this._appendLocalLog('结果 JSON 已复制到剪贴板', 'success');
          return;
        }
      } catch (e) {}
      this._appendLocalLog('当前环境不支持自动复制，请在弹窗中手动选择内容', 'warn');
    },

    _openFile(filePath) {
      var platform = process.platform;
      var command = platform === 'win32' ? 'cmd' : (platform === 'darwin' ? 'open' : 'xdg-open');
      var args = platform === 'win32' ? ['/c', 'start', '', filePath] : [filePath];
      try {
        var child = childProcess.spawn(command, args, { detached: true, stdio: 'ignore', windowsHide: true });
        child.unref();
        return true;
      } catch (e) {
        return false;
      }
    },

    _startFastPolling() {
      var self = this;
      var startedAt = Date.now();
      if (self._fastPollTimer) clearInterval(self._fastPollTimer);
        self._fastPollTimer = setInterval(function() {
        self._refreshStatus();
        if (Date.now() - startedAt > 15000) {
          clearInterval(self._fastPollTimer);
          self._fastPollTimer = null;
          self._releaseBusySoon();
        }
      }, 500);
    },

    _updateStatus(s) {
      var running = !!s.running;
      var compatibility = s.compatibility || {};
      this._running = running;
      this.$.statusDot.className = 'status ' + (running ? 'on' : 'off');
      this.$.statusText.innerText = running ? '已启动' : '已停止';
      this.$.btnToggle.innerText = running ? '停止' : '启动';
      this.$.platformSelect.disabled = running;

      if (s.port != null) {
        this.$.portInfo.innerText = '端口: ' + s.port;
        this.$.portInput.value = s.port;
      }
      if (s.platform) this.$.platformSelect.value = s.platform;

      this.$.connectInfo.style.display = running ? 'block' : 'none';
      if (running) {
        var platform = s.platform || this.$.platformSelect.value || 'claude';
        var port = s.port || 6800;
        var info = this._getConnectInfo(platform, port, s.configPath);
        if (s.rulesSync && s.rulesSync.ok) info += '\nRules synced -> ' + (s.rulesSync.targetPath || s.rulesSync.projectRulesPath || '');
        else if (s.rulesSync && s.rulesSync.ok === false) info += '\nRules sync failed: ' + ((s.rulesSync.errors || []).join('; ') || 'unknown error');
        if (s.stdioVerified === true) info += '\n✓ stdio MCP 服务验证通过 (' + (s.stdioToolCount || 0) + ' 个工具)';
        else if (s.stdioVerified === false) info += '\n✗ stdio 验证失败: ' + (s.stdioError || '未知错误');
        else info += '\n正在验证 stdio MCP 服务...';
        this.$.connectText.innerText = info;
      }

      if (s.tools) this._renderTools(s.tools);
      if (this.$.versionInfo) {
        var displayName = compatibility.displayName || compatibility.pluginName || 'MCP';
        var version = compatibility.version || s.version || '--';
        var updatedAt = compatibility.mcpToolsUpdatedAt || '--';
        var toolCount = compatibility.toolCount != null ? compatibility.toolCount : (s.tools ? s.tools.length : '--');
        var counts = compatibility.toolProfileCounts || s.toolProfileCounts || {};
        var profileText = counts && counts.all != null
          ? ' | Profile: core | Core: ' + (counts.core || 0) + ' | Full: ' + (counts.full || 0) + ' | Internal: ' + (counts.internal || 0) + ' | All: ' + (counts.all || 0)
          : '';
        this.$.versionInfo.innerText = displayName + ' v' + version + ' | Updated: ' + updatedAt + ' | Tools: ' + toolCount + profileText;
      }
      if (s.error) this._appendLocalLog('[ERROR] ' + s.error, 'error');
    },

    async _refreshStatus() {
      try {
        var status = await Editor.Message.request('cocos-creator-38-mcp', 'get-status');
        if (status) {
          this._updateStatus(status);
        }
      } catch (e) {}
    },

  },
  ready() {
    var self = this;
    self._running = false;
    self._lastToolsSignature = '';
    self._expandedTools = {};
    self._expandedCategories = {};
    self._lastDialogRaw = null;
    self._lastDialogReportPath = '';

    self.$.toolList.addEventListener('click', function(e) { self._handleToolListClick(e); });
    self.$.btnDialogClose.addEventListener('confirm', function() { self._hideResultDialog(); });
    self.$.btnDialogOpen.addEventListener('confirm', function() {
      if (self._lastDialogReportPath) self._openFile(self._lastDialogReportPath);
    });
    self.$.btnDialogCopy.addEventListener('confirm', function() { self._copyDialogJson(); });
    self.$.resultDialog.addEventListener('click', function(e) {
      if (e.target === self.$.resultDialog) self._hideResultDialog();
    });

    self.$.btnToggle.addEventListener('confirm', function() {
      if (self._running) {
        self._appendLocalLog('请求停止 MCP 服务...', 'info');
        self._markBusy('停止中...');
        Editor.Message.send('cocos-creator-38-mcp', 'stop');
      } else {
        var platform = self.$.platformSelect.value;
        self._appendLocalLog('请求启动 MCP 服务 [' + platform + ']...', 'info');
        self._markBusy('启动中...');
        Editor.Message.request('cocos-creator-38-mcp', 'set-config', { platform: platform }).then(function() {
          setTimeout(function() { Editor.Message.send('cocos-creator-38-mcp', 'start'); }, 100);
        }).catch(function(e) {
          self._appendLocalLog('启动前配置失败: ' + (e && e.message ? e.message : e), 'error');
          self._releaseBusySoon();
        });
      }
      setTimeout(function() { self._refreshStatus(); }, 600);
      self._releaseBusySoon();
    });

    self.$.btnRestart.addEventListener('confirm', function() {
      self._appendLocalLog('请求重启 MCP 服务...', 'info');
      self._markBusy('重启中...');
      Editor.Message.send('cocos-creator-38-mcp', 'restart');
      setTimeout(function() { self._refreshStatus(); }, 900);
      self._releaseBusySoon();
    });

    self.$.platformSelect.addEventListener('change', function(e) {
      if (self._running) return;
      Editor.Message.request('cocos-creator-38-mcp', 'set-config', { platform: e.target.value }).then(function() {
        self._refreshStatus();
      });
    });

    self.$.btnSelectEngineSource.addEventListener('confirm', function() {
      self._appendLocalLog('Select Cocos engine source directory...', 'info');
      Editor.Message.request('cocos-creator-38-mcp', 'select-cocos-engine-source').then(function(result) {
        var body = JSON.stringify(result || {}, null, 2);
        if (result && result.cancelled) {
          self._appendLocalLog('Cocos engine source selection cancelled', 'warn');
          self._showResultDialog('Engine Source', 'Selection cancelled.', body, result || {}, '');
          return;
        }
        self._appendLocalLog('Cocos engine source config ' + (result && result.ok ? 'saved' : 'failed'), result && result.ok ? 'success' : 'error');
        self._showResultDialog('Engine Source', result && result.ok ? 'Manual source path saved.' : 'Manual source path failed.', body, result || {}, '');
        self._refreshStatus();
      }).catch(function(e) {
        self._appendLocalLog('select engine source failed: ' + (e && e.message ? e.message : e), 'error');
        self._showResultDialog('Engine Source Failed', String(e && e.message ? e.message : e), '', { ok: false, error: String(e && e.message ? e.message : e) }, '');
      });
    });

    self.$.btnBuildInstallPackage.addEventListener('confirm', function() {
      self._appendLocalLog('Building generic MCP install package...', 'info');
      Editor.Message.request('cocos-creator-38-mcp', 'build-install-package', {}).then(function(result) {
        var body = JSON.stringify(result || {}, null, 2);
        self._appendLocalLog('Build install package ' + (result && result.ok ? 'passed: ' + result.outputPath : 'failed'), result && result.ok ? 'success' : 'error');
        self._showResultDialog('Build Install Package', self._summarizeInstallPackage(result || {}), body, result || {}, '');
        self._refreshStatus();
      }).catch(function(e) {
        self._appendLocalLog('build install package failed: ' + (e && e.message ? e.message : e), 'error');
        self._showResultDialog('Build Install Package Failed', String(e && e.message ? e.message : e), '', { ok: false, error: String(e && e.message ? e.message : e) }, '');
      });
    });

    self.$.portInput.addEventListener('change', function(e) {
      var port = parseInt(e.target.value, 10);
      if (port >= 1024 && port <= 65535) {
        Editor.Message.send('cocos-creator-38-mcp', 'set-config', { port: port });
      }
    });

    self._refreshStatus();

    self._pollTimer = setInterval(function() {
      self._refreshStatus();
    }, 5000);
  },
  beforeClose() {},
  close() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
    if (this._fastPollTimer) {
      clearInterval(this._fastPollTimer);
      this._fastPollTimer = null;
    }
    if (this._busyReleaseTimer) {
      clearTimeout(this._busyReleaseTimer);
      this._busyReleaseTimer = null;
    }
  },
});
