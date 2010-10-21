YaVDR.WebFrontend = Ext.extend(YaVDR.BaseFormPanel, {
  labelWidth: 300,
  initComponent: function() {
    
    this.store = new Ext.data.JsonStore({
      fields: [
        { name: 'key' },
        { name: 'title' }
      ],

      data: [
        {
          key: 'zh',
          title: 'Chinese'
        },
        {
          key: 'nl',
          title: 'Dutch'
        },
        {
          key: 'en',
          title: 'English'
        },
        {
          key: 'fr',
          title: 'French'
        },
        {
          key: 'de',
          title: 'German'
        },
        {
          key: 'it',
          title: 'Italian'
        },
        {
          key: 'pt',
          title: 'Portugese'
        }
      ]

    });
    
    this.languageTpl = new Ext.XTemplate(
      '<tpl for=".">',
        '<div class="selection-wrap selectable" id="language-selection-{key}">',
          '<div class="title">{title}</div>',
        '</div>',
      '</tpl>'
    );
    
    this.languageSelectionHidden = new Ext.form.Hidden({
      name: 'value',
      value: 'english'
    });
    
    this.languageSelectiorView = new YaVDR.SelectionList({
      hiddenField: this.languageSelectionHidden,
      fieldLabel: getLL("webfrontend.label"),
      tpl: this.languageTpl,
      store: this.store
    });
    
    this.items = [
      this.languageSelectionHidden,
      this.languageSelectiorView
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
    
    YaVDR.WebFrontend.superclass.initComponent.call(this);
    
    this.on('render', this.loadSelection, this, { single: true });
  },
  saveSelection: function() {
    this.getForm().submit({
      url: 'set_hdf_value?key=webfrontend.language',
      waitMsg: getLL("webfrontend.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope:this,
      success: function (form, action) {
        Ext.MessageBox.confirm( getLL("standardform.messagebox_caption.message"), getLL("webfrontend.submit.success"), function(x){
          if(x == 'yes') window.location.reload();
        });
      },
      failure:function(form, action) {
          Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("webfrontend.submit.failure") );
      }
    });
  },
  loadSelection: function() {
    YaVDR.getHdfValue('webfrontend.language', function(value) {
      this.languageSelectiorView.select("language-selection-" + value);
    }, this);
  }
});

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                section: "webfrontend",
                layout: 'fit',
                items:   function() { return new YaVDR.WebFrontend }});
});