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


function getWebFrontendForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [{
            id: 'web_lang_radio_group',
            name: 'value',
            xtype: 'radiogroup',
            fieldLabel: getLL("webfrontend.label"),
            columns: 1,
            items: [
                {id: 'lang-zh', boxLabel: 'Chinese', name: 'value', inputValue: 'zh'},
                {id: 'lang-nl', boxLabel: 'Dutch',   name: 'value', inputValue: 'nl'},
                {id: 'lang-en', boxLabel: 'English', name: 'value', inputValue: 'en'},
                {id: 'lang-fr', boxLabel: 'French',  name: 'value', inputValue: 'fr'},
                {id: 'lang-de', boxLabel: 'German',  name: 'value', inputValue: 'de'},
                {id: 'lang-it', boxLabel: 'Italian', name: 'value', inputValue: 'it'},
                {id: 'lang-pt', boxLabel: 'Portugese', name: 'value', inputValue: 'pt'}
            ]
        }]
    });

    var submit = myform.addButton({
        text: getLL("webfrontend.button_label"),
        icon: '/ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_hdf_value?key=webfrontend.language',
                waitMsg: getLL("webfrontend.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.confirm( getLL("standardform.messagebox_caption.message"), getLL("webfrontend.submit.success"), function(){location.reload("http://localhost")} );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("webfrontend.submit.failure") );
                }
            })
        }
    });
    
    Ext.Ajax.request({
        url: 'get_hdf_value?hdfpath=webfrontend.language',
        timeout: 3000,
        method: 'GET',
        scope: myform,
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currentFrontend = "";
            try {
                currentFrontend = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize current web frontend language.');
            }
            if (currentFrontend == "") currentFrontend == "en";
            if (
                currentFrontend == "zh" || 
            	currentFrontend == "de" || 
            	currentFrontend == "en" || 
            	currentFrontend == "nl" || 
            	currentFrontend == "fr" || 
                currentFrontend == "pt" || 
            	currentFrontend == "it"
            ){
                var rButton = this.getComponent('web_lang_radio_group');
                if (rButton)
                    rButton.setValue( currentFrontend );
                else
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not find web frontend radiobutton group.');
            }
        }
    });
    
    return myform;
}

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                section: "webfrontend",
                layout: 'fit',
                items:   function() { return new YaVDR.WebFrontend }});
});