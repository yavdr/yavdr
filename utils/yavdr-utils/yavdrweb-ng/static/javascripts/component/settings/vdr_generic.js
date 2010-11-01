YaVDR.Component.Settings.VdrGeneric = Ext.extend(YaVDR.Component, {
  itemId: 'settings-vdr-generic',
  title: 'Settings',
  description: 'Here you can make general setting for and around VDR.',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Item({
        title: 'General Settings',
        style: 'margin-bottom: 5px',
        items: new YaVDR.Component.Settings.VdrGeneric.Frontend
      }),
      new YaVDR.Component.Item({
        title: 'Lifeguard Monitoring Items',
        style: 'margin-bottom: 5px',
        items: new YaVDR.Component.Settings.VdrGeneric.Lifeguard
      }),
      new YaVDR.Component.Item({
        title: 'EPG',
        items: new YaVDR.Component.Settings.VdrGeneric.EPG
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
      value: 'VDR-Lifeguard will check the choosen items before allowing the shutdown. Please choose the items which should not be interrupted by a shutdown. Not checked means it will not block the shutdown.',
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
          description: 'This choice is using the xineliboutput plugin with frontend vdr-sxfe. This is the default for yaVDR'
        },
        {
          key: 'xine',
          title: 'xine@vdr-plugin-xine',
          description: 'This is an alternative frontend. It is using the xine plugin using Xine for decoding. If you have trouble with the default, try this one.'
        },
        {
          key: 'xbmc',
          title: 'XBMC@vdr-plugin-vnsi (experimental)',
          description: 'If you want to use VDR as backend for XBMC and watch TV only in XBMC this is your choice.'
        },
        {
          key: 'headless',
          title: 'headless (yaVDR server)',
          description: 'You can choose this if you don\'t want to have any video output. This is if you want to use yavdr as server, or disable any decoding on video cards.'
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
      fieldLabel: 'Video Output',
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

YaVDR.Component.Settings.VdrGeneric.EPG = Ext.extend(YaVDR.Default.Form, {

	initComponent: function() {

		this.charsetOverrideStore = new Ext.data.JsonStore({
			fields: [
				{ name: 'key' },
				{ name: 'title' },
				{ name: 'description' }
			],
			data: [
				{
					key: '',
					title: 'Nothing',
					description: ''
				},
				{
					key: 'ISO-8859-9',
					title: 'ISO-8859-9',
					description: 'The bestway for german television, because sky send epg not in utf-8'
				}
			]
		});

		this.charsetOverrideTpl = new Ext.XTemplate(
						'<tpl for=".">',
						'<div class="selection-wrap selectable" id="charset-selection-{key}">',
						'<div class="title">{title}</div>',
						'<div class="description">{description}</div>',
						'</div>',
						'</tpl>'
						);

		this.charsetOverrideTpl.compile();

		this.charsetOverrideSelectionHidden = new Ext.form.Hidden({
			name: 'value',
			value: ''
		});

		this.charsetOverrideSelectiorView = new YaVDR.SelectionList({
			fieldLabel: 'Charset override',
			hiddenField: this.charsetOverrideSelectionHidden,
			tpl: this.charsetOverrideTpl,
			store: this.charsetOverrideStore
		});

		this.items = [
			this.charsetOverrideSelectionHidden,
			this.charsetOverrideSelectiorView
		];


		YaVDR.Component.Settings.VdrGeneric.EPG.superclass.initComponent.call(this);
	},
	doSave: function() {
		this.getForm().submit({
			url: '/admin/set_signal?signal=change-epg'
		});
	},

	doLoad: function() {
		YaVDR.getHdfValue('vdr.epg.charset_override', function(value) {
      this.charsetOverrideSelectiorView.select("charset-selection-" + value);
		}, this);
	}
});
