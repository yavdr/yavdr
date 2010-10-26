Ext.ns('YaVDR');

Ext.apply(YaVDR, {
  /*
   registerSection: function(section, title) {
   var tbar = Ext.getCmp('yavdr-menu');
   tbar.add({
   itemId: section,
   text: title,
   menu: new Ext.menu.Menu()
   });
   tbar.doLayout();

   },
   registerCommand: function(title, func, section, iconCls) {
   var tbar = Ext.getCmp('yavdr-menu');
   if (section) {
   var menu = tbar.getComponent(section).menu;
   menu.add({
   text: title,
   iconCls: iconCls,
   handler: func
   });
   } else {
   tbar.add({
   text: title,
   handler: func
   });
   }
   tbar.doLayout();
   },  */


  getComponent: function(componentId) {
    return YaVDR.Components[componentId];
  },

  registerComponent: function(component) {
    var componentId = component.prototype.itemId;
    YaVDR.Components[componentId] = component;
    /*
     var tbar = Ext.getCmp('yavdr-menu');
     var title = component.prototype.menuTitle;
     if (!title) title = component.prototype.title;
     var itemId = component.prototype.itemId;
     var iconCls = component.prototype.iconCls;
     if (section) {
     var menu = tbar.getComponent(section).menu;
     menu.add({
     text: title,
     iconCls: iconCls,
     itemId: itemId,
     scope: component,
     handler: function() {
     YaVDR.openComponent(this);
     }
     });
     } else {
     tbar.add({
     itemId: itemId,
     // iconCls: iconCls,
     text: title,
     scope: component,
     handler: function() {
     YaVDR.openComponent(this);
     }
     });
     }
     tbar.doLayout();   */
  },
  openComponent: function(componentId) {
    Ext.History.add(componentId);

    /*
     var panel = new component;
     Ext.getCmp('yavdr-content').add(panel);
     Ext.History.add(panel.itemId);
     */
  },
  showComponent: function(componentId) {
    if(!componentId) componentId = 'dashboard';
    var panel = YaVDR.getComponent(componentId);
    if(!panel) {
      YaVDR.openComponent('dashboard');
    } else {
      Ext.getCmp('yavdr-content').add(new YaVDR.Components[componentId]);
      Ext.getCmp('yavdr-content').getLayout().setActiveItem(componentId);
    }
  }
});
YaVDR.Components = new Array();

YaVDR.Header = Ext.extend(Ext.Panel, {
  height: 56,
  style: "background: #000 url('static/images/yavdr.gif') no-repeat right center;",
  region: 'north',
  border: false,
  layout: 'hbox',
  id: 'yavdr-menu',
  cls: 'yavdr-menu',
  baseCls:'x-plain',
  layoutConfig: {
    align: 'middle',
    padding:'0 5 0 5'
  },
  defaults: {
    iconAlign: 'center',
    xtype:'button',
    margins:'5 5 0 0',
    handler: function(button) {
      YaVDR.openComponent(button.getItemId())
    }
  },
  initComponent: function() {


    this.items = [
      {
        itemId: 'dashboard',
        height: 50,
        width: 50,
        margins:'5 15 0 0',
        cls: 'x-btn-menu',
        scale: 'larger',
        icon: 'static/images/menu_home.png'
      },
      {
        itemId: 'programm',
        margins:'5 5 0 0',
        text: 'Programm'
      },
      {
        itemId: 'recordings',
        margins:'5 5 0 0',
        text: 'Aufnahmen'
      },
      {
        itemId: 'timer',
        margins:'5 5 0 0',
        text: 'Timer'
      },
      {
        itemId: 'settings',
        margins:'5 5 0 0',
        text: 'Einstellungen'
      },
      {
        itemId: 'system',
        margins:'5 5 0 0',
        text: 'System'
      }
    ];

    YaVDR.Header.superclass.initComponent.call(this);
  }
});

YaVDR.Body = Ext.extend(Ext.Panel, {
  id: 'yavdr-body',
  region: 'center',
  layout: 'fit',
  activeItem: 0,
  border: true ,
  initComponent: function() {

    this.items = [
      new Ext.Panel({
        id: 'yavdr-content',
        border: false,
        activeItem: 0,
        layout: 'card',
        defaults: {
          autoScroll: true
        },
        items: [
          //new YaVDR.Component.Dashboard
        ]
      })
    ];

    YaVDR.Body.superclass.initComponent.call(this);
  }
});

YaVDR.Viewport = Ext.extend(Ext.Viewport, {
  id: 'yavdr',
  layout: 'border',
  initComponent: function() {
    this.items = [
      new YaVDR.Header({
        //margins: '0 0 0 0'
      }),
      new YaVDR.Body({
        border: false,
        padding: 5
        //margins: '5 5 5 5'
      })
    ];

    YaVDR.Viewport.superclass.initComponent.call(this);
  }
});

YaVDR.Component = Ext.extend(Ext.Panel, {
  border: false ,
  initComponent: function() {
    YaVDR.Component.superclass.initComponent.call(this);
  }
});

Ext.ns('YaVDR.Component.VDR');
Ext.ns('YaVDR.Component.System');
Ext.ns('YaVDR.Component.Diagnose');

YaVDR.Component.Header = Ext.extend(Ext.BoxComponent, {
  height: 36,
  style: 'color: #233d6d;font-weight: bold; font-size: 1.4em; text-indent: 3px; font-family: sans-serif;'
});

YaVDR.Component.Legacy = Ext.extend(YaVDR.Component, {
  initComponent: function() {
    var panel = new Ext.Panel({
      title: this.title,
      frame: true,
      items: [
        new this.panel
      ]
    });

    if (this.layout == 'fit') {
      panel.layout = 'fit'
    } else {
      panel.anchor = '100%'
    }

    this.header = false;
    //this.padding = 5;
    this.items = panel;
    YaVDR.Component.Legacy.superclass.initComponent.call(this);
  }
});

YaVDR.Component.Item = Ext.extend(Ext.Panel, {
  frame: true,
  width: 690,
  style: 'margin-top: 5px'
});

Ext.ns('YaVDR.Default');
YaVDR.Default.Form = Ext.extend(Ext.FormPanel, {
  labelWidth: 200,
  initComponent: function() {
    this.buttons = [
      {
        itemId: 'cancel',
        scope: this,
        text: 'Zurücksetzen',
        handler: this.onCancel,
        icon: '/icons/fugue/cross.png'
      },
      {
        itemId: 'save',
        scope: this,
        text: 'Speichern',
        handler: this.onSave,
        icon: '/icons/fugue/disk-black.png'
      }
    ];
    YaVDR.Default.Form.superclass.initComponent.call(this);
  },
  onSave: function() {
    alert('onSave not implemented');
  },
  onCancel: function() {
    alert('onCancel not implemented');
  }
});

Ext.onReady(function() {
  Ext.QuickTips.init();
  Ext.History.init();
  new YaVDR.Viewport();


  Ext.History.on('change', function(token) {
    if (!token) token = 'dashboard';
    YaVDR.showComponent(token);
  });
  YaVDR.showComponent(Ext.History.getToken());
});


// Hack for YaVDRMenuManager

YaVDRMenuManager = {
  addGroupPanelTab: function(x) {
    return YaVDRMenuManager;
  },

  addGroupPanelSection: function(x) {
    return YaVDRMenuManager;
  }
};