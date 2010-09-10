
YaVDRMenuManager = {
};

YaVDRMenuManager.apply = function(o, c){
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
}; 

YaVDRMenuManager.apply(YaVDRMenuManager, {
    groupPanelConfig: new Array(),
    groupPanelPosConfig: new Array(),
    
    getMenu: function() {
        var result = Array();
        var i;
        for(i = 0; i < this.groupPanelPosConfig.length; i++) {
            result[result.length] = this.groupPanelConfig[this.groupPanelPosConfig[i]].getMenu();
        }
        return result;
    },
    
    addGroupPanelSection: function (config) {
        if (typeof this.groupPanelConfig[config.section] == "undefined") {
            this.groupPanelPosConfig[this.groupPanelPosConfig.length] = config.section;
            tabpanel = this.groupPanelConfig[config.section] = new groupPanelSection(config);
        } else {
            tabpanel = this.groupPanelConfig[config.section];
        }
        return tabpanel;
    }

});

function groupPanelSection(config) {
    this.sub = new Array();
    if (typeof config.expanded == "undefined") {
         config.expanded = false;
    }
    this.config = config;

    this.addGroupPanelTab = function(config) {
        this.sub[this.sub.length] = new groupPanelTab(config);
        
        return this;
    };
    
    this.getMenu = function() {
        var items = new Array();
        items[0] = {
            xtype: 'portal',
            layout: 'fit',
            title: getLL(  "menutabs." + this.config.section + ".title" ),
            tabTip: getLL(  "menutabs." + this.config.section + ".tabtip"),
            style: 'padding: 20px 30px 20px 30px;',
            items:[ new Ext.Panel({
                layout: 'fit',
                frame: false,
                plain: false,
                border: false,
                html: '<h1 style="font-family: sans-serif;">' + getLL("menutabs." + this.config.section + ".content") + '</h1>'
            })]
        };
        
        var i;
        for(i = 0; i < this.sub.length; i++) {
            items[items.length] = this.sub[i].getMenu();
        }
        
        return { expanded: config.expanded, items: items };
    };
};

function groupPanelTab(config){
    this.config = config;
    
    this.getMenu = function() {
        var contentType = typeof this.config.items;
        var tabpanel = null;
        var locale_prefix;
        if (typeof this.config.locale_prefix == 'undefined') {
            locale_prefix = this.config.section;
        } else {
            locale_prefix = this.config.locale_prefix+"."+this.config.section;
        }
        
        if (contentType == "function") {
            if (!this.config.layout)
                this.config.layout = "auto"; //"auto" doesn't blow up forms to full height, "fit" does
            if (typeof this.config.border == "undefined")
                this.config.border = true;
            if (typeof this.config.frame == "undefined")
                this.config.frame = true;
        
            var contentPanel = new Ext.Panel({
                layout: this.config.layout,
                title: getLL( locale_prefix + ".menutab.panel_title"),
                frame: this.config.frame,
                plain: false,
                border: this.config.border,
            });
            
            tabpanel = {
                content: config.items,
                contentPanel: contentPanel,
                layout: 'fit',
                iconCls: 'x-icon-tickets', //icon does not exist currently, but this property is used as a spacer
                title: getLL( locale_prefix + ".menutab.title" ),
                tabTip: getLL( locale_prefix + ".menutab.tabtip"),
                style: 'padding: 20px 30px 20px 30px;',
                items:[ contentPanel ],
                listeners: {
                    beforerender: function( panel ) {
                        this.contentPanel.add( this.content() );
                        this.contentPanel.doLayout();
                    }
                }
            };
            
            if (this.config.layout == "vbox")
                tabpanel.layoutConfig = {
                    align : 'stretch'
                    //pack  : 'start'
                };
            
            return tabpanel;
        } else {
            tabpanel = {
                title:  getLL( locale_prefix + ".menutab.title" ),
                layout: 'fit',
                iconCls: 'x-icon-configuration', //needed for left padding even if we don't use an icon...
                tabTip: getLL( locale_prefix + ".menutab.tabtip"),
                style: 'padding: 20px 30px 20px 30px;',
                frame: false,
                border: false,
                items: [
                    new Ext.TabPanel({
                        frame: false,
                        border: false,
                        plain: true,
                        activeTab: 0,
                        defaults:{autoScroll: true},
                        items: this.config.items 
                    })
                ]
            }
        }
        
        return tabpanel;
    }
};

Ext.onReady(function() {
    // predefine menu structure
    YaVDRMenuManager.addGroupPanelSection({section: "vdr"});
    YaVDRMenuManager.addGroupPanelSection({section: "system"});
    YaVDRMenuManager.addGroupPanelSection({section: "diagnose"});
    if (yavdrwebGlobalInfo.devmode == "1") {
        YaVDRMenuManager.addGroupPanelSection({section: "development"});
    }
});