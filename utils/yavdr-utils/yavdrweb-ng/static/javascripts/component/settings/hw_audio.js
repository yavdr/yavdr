YaVDR.Component.Settings.HwAudio = Ext.extend(YaVDR.Component, {
  itemId: 'settings-hw-audio',
  description: 'Please select the audio output',
  title: 'Audio Settings',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Item({
        title: 'Audio',
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
          key: 'analog',
          title: 'Analog',
          description: 'Audio output will happen through the speaker/headphone plug'
        },
        {
          key: 'spdif',
          title: 'Digital (Toslink/SPDIF)',
          description: 'Audio output will happen through Toslink/SPDIF.'
        },
        {
          key: 'hdmi',
          title: 'HDMI Stereo',
          description: 'Audio output will happen through HDMI in PCM. This variant does a downmix for HDMI devices which only can handle stereo (i.e. tv sets).'
        },
        {
          key: 'hdmi+analog',
          title: 'HDMI-Analog',
          description: 'Audio output will happen through HDMI and analog at the same time. HDMI will be stereo.'
        },
        {
          key: 'passthrough',
          title: 'HDMI Pass Through',
          description: 'Audio output will happen through HDMI with Pass Through.'
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
      fieldLabel: "Audio Output ",
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
