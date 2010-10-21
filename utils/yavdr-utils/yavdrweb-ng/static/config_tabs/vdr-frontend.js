YaVDR.VdrFrontend = Ext.extend(YaVDR.BaseFormPanel, {
  initComponent: function() {
    
    this.store = new Ext.data.JsonStore({
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
        this.tbar= [
          {
            itemId: 'activate',
            text: 'Auswahl übernehmen',
            icon: '/static/images/icons/save.png',
            scope: this,
            handler: this.activateSelection,
          },
          {
            itemId: 'switch-screen',
            text: getLL("x11.dualhead.switch_label"),
            icon: '/static/images/icons/switch_screen.png',
            scope: this,
            disabled: true && (yavdrwebGlobalInfo.devmode != "1"),
            handler: this.switchScreen,
          }
        ];
    
    this.frontendSelectionHidden = new Ext.form.Hidden({
        name: 'value',
        value: 'xineliboutput'
    });
    
    this.frontendSelectiorView = new YaVDR.SelectionList({
      fieldLabel: getLL('frontend.label'),
      hiddenField: this.frontendSelectionHidden,
      tpl: this.frontendTpl,
      store: this.store
    });
    
    this.items = [
      this.frontendSelectionHidden,
      {
        anchor: '100%',
        layout: 'form',
        items: [
          this.frontendSelectiorView
        ]
      }
    ];
    
    YaVDR.VdrFrontend.superclass.initComponent.call(this);
    
    // load store only first time
    this.on('render', this.loadCurrentSelection, this, { single: true });
  },
  loadCurrentSelection: function() {
    Ext.Ajax.request({
      url: 'get_hdf_value?hdfpaths=vdr.frontend&hdfpaths=system.x11.dualhead.enabled&hdfpaths=vdr.plugin.graphtft.enabled',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        var data = Ext.util.JSON.decode( xhr.responseText );
        var currentFrontend = "";
        
        var switchScreenButton = this.getTopToolbar().getComponent('switch-screen');
        
        try {
          currentFrontend = data.vdr.frontend;
        } catch (err) {
          Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current frontend.');
          return false; // Abort
        }
        
        if(currentFrontend == "headless" ||
          currentFrontend == "xine" ||
          currentFrontend == "xineliboutput" ||
          currentFrontend == "xbmc") {
          
          this.frontendSelectiorView.select("frontend-selection-" + currentFrontend);
        } else {
          Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not set frontend selection.');
        }
        
        if (data.system.x11.dualhead.enabled == "1" && data.vdr.plugin.graphtft.enabled != "1") {
          switchScreenButton.enable();
        } else {
          switchScreenButton.disable();
        }

      }
    });
    
    
  },
  switchScreen: function() {
    this.getForm().submit({
      url: 'set_signal?signal=change-display',
      timeout: 30, //wait 30 seconds before telling it failed
      waitMsg: getLL("x11.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope:this,
      success: function (form, action) {
          Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("x11.submit.success") );
      },
      failure:function(form, action) {
          Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("x11.submit.failure") );
      }
    })
  },
  activateSelection: function() {
    this.getForm().submit({
      url: 'set_signal?signal=change-frontend',
      timeout: 30, //wait 30 seconds before telling it failed
      waitMsg: getLL("frontend.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope:this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("frontend.submit.success") );
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("frontend.submit.failure") );
      }
    });
  }
});


Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "vdr", expanded: true})
            .addGroupPanelTab({
                section: "frontend",
                layout: 'fit',
                items:   function() {return new YaVDR.VdrFrontend()}});
});