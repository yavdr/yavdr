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
  registerCommand: function(title, func, section) {
    var tbar = Ext.getCmp('yavdr-menu');
    if (section) {
      var menu = tbar.getComponent(section).menu;
      menu.add({
        text: title,
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

YaVDR.Header = Ext.extend(Ext.Container, {
  height: 60,
  region: 'north',
  border: false,
  initComponent: function() {

    this.items = [
      {
        xtype: 'box',
        height: 30,
        style: 'text-align: right; margin-bottom: 5px; line-height: 30px; text-indent: 5px; color: #4E78B1; font-wight: bold; font-size: 20px; font-family: Arial',
        html: 'yaVDR'
      }, {

        xtype: 'buttongroup',
        id: 'yavdr-menu',
        cls: 'yavdr-menu',
        plain: true,
        border: false,
        unstyled: true,
        defaults: {
          style: 'margin: 0 0 0 5px'
        },
        items: [
          {
            text: ' Dashboard ',
            style: '',
            scope: YaVDR.Component.Dashboard,
            handler: function() {
              YaVDR.openComponent(this);
            }
          }
        ]
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
  //style: 'background-color: #4E78B1',
  initComponent: function() {
    this.items = [
      new YaVDR.Header({
        margins: '5 5 0 5'
      }),
      new YaVDR.Body({
        margins: '5 5 5 5'
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