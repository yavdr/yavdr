YaVDR.SoundSettings = Ext.extend(YaVDR.BaseFormPanel, {
  initComponent: function() {

    /*
     
                {id: 'analog', boxLabel: 'Analog', name: 'value', inputValue: 'analog'},
                {id: 'spdif', boxLabel: 'Digital (Toslink/SPDIF)', name: 'value', inputValue: 'spdif'},
                {id: 'hdmi', boxLabel: 'HDMI Stereo', name: 'value', inputValue: 'hdmi'},
                {id: 'hdmi+analog', boxLabel: 'HDMI-Analog', name: 'value', inputValue: 'hdmi+analog'},
                {id: 'passthrough', boxLabel: 'HDMI Pass Through', name: 'value', inputValue: 'passthrough'}
     */
    
    this.store = new Ext.data.JsonStore({
      fields: [
        { name: 'key' },
        { type: 'boolean', name: 'disabled' },
        { name: 'title' },
        { name: 'description' }
      ],
      data: [
        {
          key: 'analog',
          title: 'Analog',
          description: 'Tonausgabe erfolgt über Analog über die Klinkenbuchse.'
        },
        {
          key: 'spdif',
          title: 'Digital (Toslink/SPDIF)',
          description: 'Tonausgabe erfolgt über digital über Toslink/SPDIF.'
        },
        {
          key: 'hdmi',
          title: 'HDMI Stereo',
          description: 'Tonausgabe erfolgt über HDMI in PCM. Diese Variante ist für Receiver oder TVs die keinen keinen Suround verarbeiten können.'
        },
        {
          key: 'hdmi+analog',
          title: 'HDMI-Analog',
          description: 'Tonausgabe erfolgt über HDMI und Analog zeitgleich.'
        },
        {
          key: 'passthrough',
          title: 'HDMI Pass Through',
          description: 'Tonausgabe erfolgt über HDMI und liefert den orginalen Stream.'
        }
      ]

    });
    
    this.soundTpl = new Ext.XTemplate(
      '<tpl for=".">',
         '<tpl if="disabled == true">',
            '<div class="selection-wrap unselectable" id="sound-selection-{key}">',
          '</tpl>',
         '<tpl if="disabled == false">',
            '<div class="selection-wrap selectable" id="sound-selection-{key}">',
          '</tpl>',
          '<div class="title">{title}</div>',
          '<div class="description">{description}</div>',
        '</div>',
      '</tpl>'
    );
    
    this.soundTpl.compile();
        
    this.soundSelectionHidden = new Ext.form.Hidden({
      name: 'value',
      value: 'analog'
    });
    
    this.soundSelectiorView = new YaVDR.SelectionList({
      fieldLabel: getLL('sound.label'),
      hiddenField: this.soundSelectionHidden,
      tpl: this.soundTpl,
      store: this.store
    });
    
    this.items = [
      this.soundSelectionHidden,
      this.soundSelectiorView
    ]
    
    this.tbar = [
      {
        scope: this,
        itemId: 'save',
        text: 'Auswahl übernehmen',
        icon: '/static/images/icons/save.png',
        handler: this.saveSelection
      }
    ];
    
    YaVDR.SoundSettings.superclass.initComponent.call(this);
    this.on('render', this.loadSelection, this, { single: true });
  },
  saveSelection: function() {
    this.getForm().submit({
      url: '/admin/set_signal?signal=change-sound',
      timeout: 30, //wait 30 seconds before telling it failed
      waitMsg: getLL("sound.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope:this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("sound.submit.success") );
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("sound.submit.failure") );
      }
    })
  },
  loadSelection: function() {
    YaVDR.getHdfValue('system.sound.type', function(value) {
      this.soundSelectiorView.select("sound-selection-" + value);
    }, this);
  }
});

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                section: "sound",
                layout: 'fit',
                items:   function() { return new YaVDR.SoundSettings() }});
});