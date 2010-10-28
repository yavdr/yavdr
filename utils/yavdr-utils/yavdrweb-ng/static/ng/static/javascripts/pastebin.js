YaVDR.PasteBin = Ext.extend(Ext.Window, {
  width: 500,
  autoHeight: true,
  content: null,
  modal: true,
  closable: true,
  id: 'pastebin',
  title: 'Sende an PasteBin',
  initComponent: function() {

    this.formPanel = new Ext.FormPanel({
      border: false,
      padding: 10,
      standardSubmit: true,
      url: 'http://pastebin.com/api_public.php',
      method: 'post',
      defaults: {
        xtype: 'textfield',
        anchor: '100%'
      },
      items: [
        {
          name: 'paste_name',
          fieldLabel: 'Titel (optional)',
          value: this.contentTitle
        },
        {
          name: 'paste_email',
          fieldLabel: 'E-Mail (optional)'
        },
        {
          height: 200,
          name: 'paste_code',
          fieldLabel: 'Inhalt',
          xtype: 'textarea',
          value: this.content
        },
        {
          xtype: 'hidden',
          name: 'paste_private',
          value: '1'
        },
        {
          xtype: 'hidden',
          name: 'paste_format',
          value: 'text'
        }
      ]
    });

    this.items = [this.formPanel];

    this.buttons = [
      {
        icon: '/icons/fugue/cross.png',
        text: 'Abbrechen',
        scope: this,
        handler: this.cancel
      },
      {
        icon: '/icons/silk/accept.png',
        text: 'Senden',
        scope: this,
        handler: this.send
      }
    ];

    YaVDR.PasteBin.superclass.initComponent.call(this);
    this.formPanel.on('render', function(panel) {
      panel.form.el.dom.setAttribute('target', '_blank');
    });
  },
  cancel: function() {
    this.close();
  },
  send: function() {
    this.formPanel.getForm().submit();
  }
});

Ext.apply(YaVDR.PasteBin, {
  paste: function(content, title) {
    (new YaVDR.PasteBin({
      contentTitle: title,
      content: content
    })).show();
  }
});
