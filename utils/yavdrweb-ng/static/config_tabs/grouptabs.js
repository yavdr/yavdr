Ext.onReady(function() {
/*
// Start a simple clock task that updates a div once per second
var updateClock = function(){
    Ext.fly('ext-gen51').update(new Date().format('g:i:s A'));
} 
var task = {
    run: updateClock,
    interval: 1000 //1 second
}
var runner = new Ext.util.TaskRunner();
runner.start(task);

// equivalent using TaskMgr
Ext.TaskMgr.start({
    run: updateClock,
    interval: 1000
});
*/

    /*
     * Extend Checkbox to allow boxLabel to be changed
     */ 
    Ext.override(Ext.form.Checkbox, {
        setBoxLabel: function(boxLabel){
            this.boxLabel = boxLabel;
            if(this.rendered){
                this.wrap.child('.x-form-cb-label').update(boxLabel);
            }
            
            return this;
        }
    });


    //http://www.extjs.com/forum/showthread.php?t=42990&page=2
    Ext.form.SliderField = Ext.extend(Ext.Slider, {
        isFormField: true,
        initComponent: function() {
            this.originalValue = this.value;
            Ext.form.SliderField.superclass.initComponent.call(this);
        },
        onRender: function(){
            Ext.form.SliderField.superclass.onRender.apply(this, arguments);
            this.hiddenEl = this.el.createChild({
                tag: 'input', 
                type: 'text', 
                name: this.name + "_dummy"|| this.id + "_dummy", 
                disabled:true, 
                style: 'position: relative; float:left; left: 200px; margin-top:-20px; font-size:10px; width: 30px;'
            });
            this.hiddenEl2 = this.el.createChild({
                tag: 'input', 
                type: 'hidden', 
                name: this.name || this.id 
            });
        },
        setValue: function(v) {
            v = parseInt(v);
            if(this.maxValue && v > this.maxValue) v = this.maxValue;
            if(this.minValue && v < this.minValue) v = this.minValue;
            Ext.form.SliderField.superclass.setValue.apply(this, [v]);
            if(this.rendered){
                this.hiddenEl.dom.value = v;
                this.hiddenEl2.dom.value = v;
            }
        },
        reset: function() {
            this.setValue(this.originalValue);
            this.clearInvalid();
        },
        getName: function() {
            return this.name;
        },
        validate: function() {
            return true;
        },
        markInvalid: Ext.emptyFn,
        clearInvalid: Ext.emptyFn
    });
    Ext.reg('sliderfield', Ext.form.SliderField);
    
    Ext.QuickTips.init();

    function addGroupPanelSection( config ){
        return tabpanel = {
            xtype: 'portal',
            layout: 'fit',
            title: getLL(  "menutabs." + config.section + ".title" ),
            tabTip: getLL(  "menutabs." + config.section + ".tabtip"),
            style: 'padding: 20px 30px 20px 30px;',
            items:[ new Ext.Panel({
                layout: 'fit',
                frame: false,
                plain: false,
                border: false,
                html: '<h1 style="font-family: sans-serif;">' + getLL("menutabs." + config.section + ".content") + '</h1>'
            })]
        };
    };

    function addGroupPanelTab( config ){
        if (!config.layout)
            config.layout = "auto"; //"auto" doesn't blow up forms to full height, "fit" does
        if (typeof config.border == "undefined")
            config.border = true;
        if (typeof config.frame == "undefined")
            config.frame = true;
        
        var contentPanel = new Ext.Panel({
            layout: config.layout,
            title: getLL( config.section + ".menutab.panel_title"),
            frame: config.frame,
            plain: false,
            border: config.border
        });
    
        var tabpanel = {
            layout: 'fit',
            iconCls: 'x-icon-tickets', //icon does not exist currently, but this property is used as a spacer
            title: getLL( config.section + ".menutab.title" ),
            tabTip: getLL( config.section + ".menutab.tabtip"),
            style: 'padding: 20px 30px 20px 30px;',
            items:[ contentPanel ],
            listeners: {
                beforerender: function( panel ) {
                var content = config.items();
                contentPanel.add( content );
                contentPanel.doLayout();
                }
            }
        };
        
        if (config.layout == "vbox")
        tabpanel.layoutConfig = {
            align : 'stretch'
            //pack  : 'start'
        };
        
        return tabpanel;
    };

    var groupPanelItems = new Array(
        {
            //BASICS MODULE
            items: [
                addGroupPanelSection({
                    section: "vdr"
                }),
                addGroupPanelTab({
                    section: "frontend",
                    items:   getVDRFrontendForm
                }),
                addGroupPanelTab({
                    section: "upload",
                    layout: "fit",
                    items:   getVDRConfigUploadForm
                }),
                addGroupPanelTab({
                    section: "shutdown",
                    items:   getVDRShutdownForm
                })
            ]
        },
        {
            //SYSTEM MODULE
            expanded: false,
            items: [
                addGroupPanelSection({
                    section: "system"
                }),
                addGroupPanelTab({
                    section: "remote",
                    items:   getRemoteForm
                }),
                addGroupPanelTab({
                    section: "timeout",
                    items:   getGRUBTimeoutForm
                }),
                addGroupPanelTab({
                    section: "x11",
                    items:   getX11Form
                }),
                addGroupPanelTab({
                    section: "nvidia",
                    items:   getNvidiaForm
                }),
                addGroupPanelTab({
                    section: "system",
                    items:   getSystemForm
                }),
                addGroupPanelTab({
                    section: "webfrontend",
                    items:   getWebFrontendForm
                })
            ]
        },
        {
            //DEMO MODULE
            expanded: false,
            items: [
                addGroupPanelSection({
                    section: "demos"
                }),
                addGroupPanelTab({
                    section: "channels",
                    layout: "fit",
                    border: false,
                    frame: false,
                    items:   getChannelsForm
                })
            ]
        },
        { 
            //DIAGNOSE MODULE
            expanded: false,
            items: [getDiagnoseItems()]
        }
    );
    
    /*
     *  Should we render the DEVELOPMENT MODULE? (only if devmode is "1")
     */
    if (yavdrwebGlobalInfo.devmode == "1"){
        groupPanelItems[groupPanelItems.length] = {
            expanded: false,
            items: [
                addGroupPanelSection({
                    section: "development"
                }),
                addGroupPanelTab({
                    layout: 'fit',
                    section: "network",
                    items:   getNetworkForm
                })
            ]
        };
    }

    var viewport = new Ext.Viewport({
    layout:'fit',
        items:[{
            xtype: 'grouptabpanel',
            tabWidth: 190,
            activeGroup: 0,
            items: groupPanelItems
        }]//viewport items
    });//viewport
});//extonready