Ext.ns('YaVDR');

Ext.apply(YaVDR, {
  registerSection: function(section, title) {
    var tbar = Ext.getCmp('yavdr-body').getTopToolbar();
    tbar.add({
      itemId: section,
      text: ' ' + title + ' ',
      menu: new Ext.menu.Menu()
    });
    tbar.add({
      xtype: 'tbseparator'
    });

  },
  registerCommand: function(title, func, section) {
    var tbar = Ext.getCmp('yavdr-body').getTopToolbar();
    if (section) {
      var menu = tbar.getComponent(section).menu;
      menu.add({
        text: title,
        handler: func
      });
    } else {
      tbar.add({
        text: ' ' + title + ' ',
        handler: func
      });
      tbar.add({
        xtype: 'tbseparator'
      });
    }
  },
  registerComponent: function(component, section) {
    var tbar = Ext.getCmp('yavdr-body').getTopToolbar();
    var title = (new component).title;
    var itemId = (new component).itemId;
    if (section) {
      var menu = tbar.getComponent(section).menu;
      menu.add({
        text: title,
        itemId: itemId,
        scope: component,
        handler: function() {
          YaVDR.openComponent(this);
        }
      });
    } else {
      tbar.add({
        itemId: itemId,
        text: ' ' + title + ' ',
        scope: component,
        handler: function() {
          YaVDR.openComponent(this);
        }
      });
      tbar.add({
        xtype: 'tbseparator'
      });
    }
  },
  openComponent: function(component) {
    var panel = new component;
    Ext.getCmp('yavdr-content').add(panel);
    Ext.getCmp('yavdr-content').getLayout().setActiveItem(panel.itemId);
//    Ext.getCmp('yavdr-content').activate(panel);
  }
});

YaVDR.Header = Ext.extend(Ext.BoxComponent, {
  height: 50,
  region: 'north',
  cls: 'yavdr-header',
  initComponent: function() {
    this.html = "yaVDR";
    YaVDR.Header.superclass.initComponent.call(this);
  }
});

YaVDR.Body = Ext.extend(Ext.Panel, {
  id: 'yavdr-body',
  region: 'center',
  layout: 'fit',
  activeItem: 0,
  border: false ,
  initComponent: function() {
    this.tbar = [
      '-',
      {
        text: ' Dashboard ',
        scope: YaVDR.Component.Dashboard,
        handler: function() {
          YaVDR.openComponent(this);
        }
      },
      '-'
    ];

    this.items = [
      //new Ext.TabPanel({
      new Ext.Panel({
        id: 'yavdr-content',
        border: false,
        activeItem: 0,
        // activeTab: 0,
        layout: 'card',
        //plugins: new Ext.ux.TabCloseMenu(),
        //enableTabScroll:true,
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
      new YaVDR.Header(),
      new YaVDR.Body()
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
    this.padding = 5;
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