Ext.ns('YaVDR');

Ext.apply(YaVDR, {
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
  },
  registerComponent: function(component, section) {
    var tbar = Ext.getCmp('yavdr-menu');
    var title = (new component).title;
    var itemId = (new component).itemId;
    var iconCls = (new component).iconCls;
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
    tbar.doLayout();
  },
  openComponent: function(component) {
    var panel = new component;
    Ext.getCmp('yavdr-content').add(panel);
    Ext.getCmp('yavdr-content').getLayout().setActiveItem(panel.itemId);
  }
});

YaVDR.Header = Ext.extend(Ext.Panel, {
  height: 55,
  style: "background: #000 url('static/images/yavdr.gif') no-repeat right center;",
  region: 'north',
  border: false,
  layout: 'hbox',
  id: 'yavdr-menu',
  cls: 'yavdr-menu',
  baseCls:'x-plain',
  layoutConfig: {
    padding:'0 0 0 0'
  },
  defaults: {
    cls: 'x-btn-menu',
    iconAlign: 'center',
    scale: 'large',
    height: 42,
    xtype:'button',
    margins:'5 5 0 0'
  },
  initComponent: function() {


    this.items = [
      {
        width: 50,
        height: 50,
        scale: 'larger',
        icon: 'static/images/menu_home.png',
        handler: function() {
          YaVDR.openComponent(YaVDR.Component.Dashboard)
        }
      },
      {
        width: 32,
        icon: 'static/images/moblin/preferences-system-windows.png',
        handler: function() {
          YaVDR.openComponent(YaVDR.Component.Dashboard)
        }
      },
      {
        width: 32,
        icon: 'static/images/moblin/preferences-desktop-wallpaper.png',
        handler: function() {
          YaVDR.openComponent(YaVDR.Component.Dashboard)
        }
      },
      {
        width: 32,
        icon: 'static/images/moblin/preferences-system-windows.png',
        handler: function() {
          YaVDR.openComponent(YaVDR.Component.Dashboard)
        }
      },
      {
        width: 32,
        icon: 'static/images/moblin/notification-properties.png',
        handler: function() {
          YaVDR.openComponent(YaVDR.Component.Dashboard)
        }
      },
      {
        width: 32,
        icon: 'static/images/moblin/preferences-system-windows.png',
        handler: function() {
          YaVDR.openComponent(YaVDR.Component.Dashboard)
        }
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
          new YaVDR.Component.Dashboard
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
  border: false,
  closable: true
});

Ext.ns('YaVDR.Component.VDR');
Ext.ns('YaVDR.Component.System');
Ext.ns('YaVDR.Component.Diagnose');

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


Ext.onReady(function() {
  Ext.QuickTips.init();
  new YaVDR.Viewport();
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