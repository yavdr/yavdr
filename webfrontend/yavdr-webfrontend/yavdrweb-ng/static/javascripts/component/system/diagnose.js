YaVDR.Component.System.Diagnose = Ext.extend(YaVDR.Component, {
//  layout: 'border',
//  plain: true,
//  height: 500,
  initComponent: function() {

    this.tabPanel = new Ext.TabPanel({ activeTab: 0 });

    this.items = [
      new YaVDR.Component.Header({
        html: _('Diagnostics'),
//        region: 'north'
      }),
      {
        frame: true,
autoHeight: true,
//        region: 'center',
//        layout: 'fit',
        title: this.subTitle,
        items: this.tabPanel
      }
    ];
    YaVDR.Component.System.Diagnose.superclass.initComponent.call(this);
  },
  addShellResponse: function(title, command) {
    this.tabPanel.add(new YaVDR.Component.System.DiagnoseItem({
      title: title,
      cmd: 'get_shell_response',
      file: command
    }));
  },
  addFileContent: function(title, file) {
    this.tabPanel.add(new YaVDR.Component.System.DiagnoseItem({
      title: title,
      cmd: 'get_file_content',
      file: file
    }));
  }
});

YaVDR.Component.System.DiagnoseItem =  Ext.extend(Ext.Panel, {
  file: null,
  cmd: null,
  autoHeight: true,
//  autoScroll: true,
  style: 'font-family: monospace; white-space: pre; font-size: 12px;',
  initComponent: function() {
    this.tbar = [
      {
        text: _('Refresh'),
        icon: '/static/images/icons/refresh.png',
        scope: this,
        handler: this.reload
      },
      {
        text: _('Go to the end'),
        icon: '/static/images/icons/arrow_down.png',
        scope: this,
        handler: this.jumpDown
      },
      {
        text: _('Sende to PasteBin'),
        icon: '/static/images/icons/clipboard-paste-document-text.png',
        scope: this,
        handler: this.sendPasteBin
      }
    ];

    this.autoLoad = /admin/ + this.cmd + '?puretext=true&' + (this.cmd === 'get_file_content' ? 'file' : 'command') + '=' + this.file

    YaVDR.Component.System.DiagnoseItem.superclass.initComponent.call(this);
  },
  reload: function () {
    this.getUpdater().refresh();
  },
  jumpDown: function() {
    this.body.dom.scrollTop = this.body.dom.scrollHeight - this.body.dom.offsetHeight;
  },
  sendPasteBin: function() {
    YaVDR.PasteBin.paste(this.body.dom.innerHTML, this.file);
  }
});
