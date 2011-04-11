YaVDR.Component.Settings.HwAudio = Ext.extend(YaVDR.Component, {
  itemId: 'settings-hw-audio',
  description: _('Please select the audio output. Make your choice and press "Save". At saving VDR and the video output will be restarted in order to make your choice activ.'),
  title: _('Settings'),
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Item({
        title: _('Audio Settings'),
        style: 'margin-bottom: 5px',
        items: new YaVDR.Component.Settings.HwAudio.Audio
      })
    ];
    YaVDR.Component.Settings.HwAudio.superclass.initComponent.call(this);
  }
});
YaVDR.registerComponent(YaVDR.Component.Settings.HwAudio);

YaVDR.Component.Settings.HwAudio.Audio = Ext.extend(YaVDR.Default.Form, {
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
          key: 'all',
          title: _('Output to all devices'),
          description: _('Audio output will happen to all outputs. The default choice.')
        },
        {
          key: 'analog',
          title: _('Analog'),
          description: _('Audio output will happen through the speaker/headphone plug')
        },
        {
          key: 'spdif',
          title: _('Digital (Toslink/SPDIF)'),
          description: _('Audio output will happen through Toslink/SPDIF.')
        },
        {
          key: 'hdmi',
          title: _('HDMI-Stereo'),
          description: _('Audio output will happen through HDMI in PCM. This variant does a downmix for HDMI devices which only can handle stereo (i.e. tv sets).')
        },
        {
          key: 'passthrough',
          title: _('HDMI-Passthrough'),
          description: _('Audio output will happen through HDMI with Pass Through.')
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
      fieldLabel: _("Audio output"),
      hiddenField: this.soundSelectionHidden,
      tpl: this.soundTpl,
      store: this.store
    });

    this.items = [
      this.soundSelectionHidden,
      this.soundSelectiorView
    ];

    YaVDR.Component.Settings.HwAudio.Audio.superclass.initComponent.call(this);
  },
  doLoad: function() {
    YaVDR.getHdfValue('system.sound.type', function(value) {
      this.soundSelectiorView.select("sound-selection-" + value);
    }, this);
  },
  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_signal?signal=change-sound'
    })
  }
});
