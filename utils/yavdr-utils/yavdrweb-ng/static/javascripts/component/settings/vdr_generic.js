YaVDR.Component.Settings.VdrGeneric = Ext.extend(YaVDR.Component, {
  itemId: 'settings-vdr-generic',
  title: 'Einstellung',
  description: 'Hier können allgemeine Einstellungen zum VDR vorgenommen werden.',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Item({
        title: 'Frontend',
        style: 'margin-bottom: 5px',
        items: new YaVDR.Component.Settings.VdrGeneric.Frontend
      }),
      new YaVDR.Component.Item({
        title: 'Lifeguard',
        items: new YaVDR.Component.Settings.VdrGeneric.Lifeguard
      })
    ];
    YaVDR.Component.Settings.VdrGeneric.superclass.initComponent.call(this);
  }
});
YaVDR.registerComponent(YaVDR.Component.Settings.VdrGeneric);


YaVDR.Component.Settings.VdrGeneric.Lifeguard = Ext.extend(YaVDR.Default.Form, {
  initComponent: function() {

    this.lifeguard = {
      itemId: 'lifeguard',
      xtype: 'checkboxgroup',
      fieldLabel: 'Lifeguard',
      columns: 2,
      defaults: {
        name: 'values'
      },
      items: [
        {
          itemId: 'aptitude',
          boxLabel: 'Aptitude',
          inputValue: 'aptitude'
        },
        {
          itemId: 'ssh',
          boxLabel: 'SSH',
          inputValue: 'ssh'
        },
        {
          itemId: 'nfs',
          boxLabel: 'NFS',
          inputValue: 'nfs'
        },
        {
          itemId: 'ftp',
          boxLabel: 'FTP',
          inputValue: 'ftp'
        },
        {
          itemId: 'smb',
          boxLabel: 'SMB',
          inputValue: 'smb'
        },
        {
          itemId: 'xbmc',
          boxLabel: 'XBMC',
          inputValue: 'xbmc'
        }
      ]
    };

    this.lifeguardHelp = {
      xtype: 'displayfield',
      value: 'VDR-Lifeguard kann vor dem Ausschalten prüfen ob bestimmte Prozesse aktiv sind. Soll ein Prozess nicht unterbrochen werden, wird das Ausschalten verschoben. Fügen Sie hier Prozesse hinzu, die das Ausschalten verhindern sollen. Nicht markiert bedeutet: VDR-Lifeguard ist deaktiviert',
      labelSeparator: ' '
    };

    this.items = [
      this.lifeguard,
      this.lifeguardHelp
    ];
    YaVDR.Component.Settings.VdrGeneric.Lifeguard.superclass.initComponent.call(this);
  },
  doSave: function() {
    this.getForm().submit({
      url : '/admin/set_signal?signal=change-lifeguard'
    });
  },
  doLoad: function() {
    YaVDR.getHdfTree('vdr.plugin.lifeguard.enable', function(data) {
      if (typeof data != null) {
        if (typeof data.enable == "object") {
          for (var i = 0; i < data.enable.length; i++) {
            this.getComponent('lifeguard').items.each(function(item) {
              if (item.getItemId() == data.enable[i]) {
                item.setValue(true);
              }
            });
          }
        }
      } else {
        this.getComponent('lifeguard').items.each(function(field) {
          field.setValue(true);
        });
      }
    }, this);
  }
});


YaVDR.Component.Settings.VdrGeneric.Frontend = Ext.extend(YaVDR.Default.Form, {

  initComponent: function() {

    this.frontendStore = new Ext.data.JsonStore({
      fields: [
        { name: 'key' },
        { type: 'boolean', name: 'disabled' },
        { name: 'title' },
        { name: 'description' }
      ],
      data: [
        {
          key: 'xineliboutput',
          title: 'vdr-sxfe@vdr-plugin-xineliboutput',
          description: 'Diese Variante verwendet die xineliboutput-Ausgabe und ist die Standardauswahl für yaVDR'
        },
        {
          key: 'xine',
          title: 'xine@vdr-plugin-xine',
          description: 'Eine alternatives Ausgabedevice und kann verwendet werden falls es Probleme mit xineliboutput gibt'
        },
        {
          key: 'xbmc',
          title: 'XBMC@vdr-plugin-streamdev (experimental)',
          description: 'Möchten Sie kein VDR-Frontend, sondern XBMC als Fernsehausgabe nutzen so wählen Sie diesen Punkt'
        },
        {
          key: 'headless',
          title: 'headless (yaVDR server)',
          description: 'Diese Variate ist für Server gedacht die über keine Fernsehausgabe verfügen'
        }
      ]

    });

    this.frontendTpl = new Ext.XTemplate(
      '<tpl for=".">',
      '<tpl if="disabled == true">',
      '<div class="selection-wrap unselectable" id="frontend-selection-{key}">',
      '</tpl>',
      '<tpl if="disabled == false">',
      '<div class="selection-wrap selectable" id="frontend-selection-{key}">',
      '</tpl>',
      '<div class="title">{title}</div>',
      '<div class="description">{description}</div>',
      '</div>',
      '</tpl>'
      );

    this.frontendTpl.compile();

    this.frontendSelectionHidden = new Ext.form.Hidden({
      name: 'value',
      value: 'xineliboutput'
    });

    this.frontendSelectiorView = new YaVDR.SelectionList({
      fieldLabel: 'Ausgabe',
      hiddenField: this.frontendSelectionHidden,
      tpl: this.frontendTpl,
      store: this.frontendStore
    });

    this.items = [
      this.frontendSelectionHidden,
      this.frontendSelectiorView
    ];

    YaVDR.Component.Settings.VdrGeneric.Frontend.superclass.initComponent.call(this);
  },
  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_signal?signal=change-frontend'
    });
  },

  doLoad: function() {
    YaVDR.getHdfValue('vdr.frontend', function(value) {
      this.frontendSelectiorView.select("frontend-selection-" + value);
    }, this);
  }
});
