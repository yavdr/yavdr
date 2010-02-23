function getLL( param ){
    paramArray = param.split(".");
    var success = true;
    var validstring = "locale";
    for (var z=0; z < paramArray.length; z++){
        validstring += "." + paramArray[z];
        var check = eval("typeof " + validstring + ";");
        if (check == "undefined"){
            success = false;
            break;
        }
    }
    
    if (!success){
        label = "[undefined:"+param+"]";
        //alert("Hint for translators: Can't access locale." + param + ": " + validstring + " is undefined in current language.");
    }
    else
        label = eval(validstring);
    return label;
}

Ext.onReady(function() {
	Ext.QuickTips.init();

	function addGroupPanelTab( config ){
	    if (!config.layout)
	        config.layout = "auto"; //"auto" doesn't blow up forms to full height, "fit" does
	    var tabpanel = {
            //xtype: 'portal',
            layout: 'fit',
            iconCls: 'x-icon-tickets', //icon does not exist currently, but this property is used as a spacer
            title: getLL( config.section + ".menutab.title" ),
            tabTip: getLL( config.section + ".menutab.tabtip"),
            style: 'padding: 20px 30px 20px 30px;',
            items:[
               new Ext.Panel({
                   layout: config.layout,
                   title: getLL( config.section + ".menutab.panel_title"),
                   frame: true,
                   plain: false,
                   border: true,
                   items: [ config.items ]
               })
            ]
        };
        
        if (config.layout == "vbox")
    	    tabpanel.layoutConfig = {
                align : 'stretch'
                //pack  : 'start'
            };
        
        return tabpanel;
    };

    var viewport = new Ext.Viewport({
        layout:'fit',
        items:[{
            xtype: 'grouptabpanel',
            tabWidth: 190,
            activeGroup: 0,
            items: [{
                //mainItem: 1,
                items: [
                    /*
                     *  BASICS MODULE
                     */
                    {
                        xtype: 'portal',
                        layout: 'fit',
                        title: getLL("menutabs.basics.title"),
                        tabTip: getLL("menutabs.basics.tabtip"),
                        style: 'padding: 20px 30px 20px 30px;',
                        items:[
                           new Ext.Panel({
                               layout: 'fit',
                               frame: false,
                               plain: false,
                               border: false,
                               html: '<h1 style="font-family: sans-serif;">' + getLL("menutabs.basics.content") + '</h1>'
                           })
                        ]
                    },
                    addGroupPanelTab({
                        section: "lirc",
                        layout: "vbox",
                        items:   getLircForm()
                    }),
                    addGroupPanelTab({
                        section: "frontend",
                        items:   getVDRFrontendForm()
                    }),
                    addGroupPanelTab({
                        section: "upload",
                        layout: "fit",
                        items:   getVDRConfigUploadForm()
                    }),
                    addGroupPanelTab({
                        section: "system",
                        items:   getSystemForm()
                    }),
                    addGroupPanelTab({
                        section: "webfrontend",
                        items:   getWebFrontendForm()
                    })
                ]},
                /*
                 *  DEMO MODULE
                 */
                {
                    expanded: false,
                    items: [
                        {
                            layout: 'fit',
                            title: "Demos", //getLL("menutabs.development.title"),
                            tabTip: "Proof of concept, demos of possible new features", //getLL("menutabs.development.tabtip"),
                            style: 'padding: 20px 30px 20px 30px;',
                            items:[
                               new Ext.Panel({
                                   layout: 'fit',
                                   frame: false,
                                   plain: false,
                                   border: false,
                                   html: '<h1 style="font-family: sans-serif;">Demos of possible new features</h1>'
                               })
                            ]
                        },
                        {
                            title: getLL("channels.menutab.title") + " (SVDRP)",
                            layout: 'fit',
                            iconCls: 'x-icon-tickets', //icon does not exist currently, but this property is used as a spacer
                            tabTip: getLL("channels.menutab.tabtip"),
                            style: 'padding: 20px 30px 20px 30px;',
                            items: [
                                new Ext.Panel({
                                    layout: 'fit',
                                    //title: getLL("channels.menutab.panel_title"),
                                    frame: false,
                                    plain: false,
                                    border: false,
                                    items: [ getChannelsForm() ]
                                })
                            ]
                        }
                    ]
                },
                /*
                 *  DIAGNOSE MODULE
                 */
                {
                    expanded: false,
                    items: [getDiagnoseItems()]
                },
                /*
                 *  DEVELOPMENT MODULE (UNCOMMENT THIS TO MAKE IT VISIBLE)
                 */
                {
                    expanded: false,
                        items: [
                            {
                                layout: 'fit',
                                title: "Development", //getLL("menutabs.development.title"),
                                tabTip: "Under Development", //getLL("menutabs.development.tabtip"),
                                style: 'padding: 20px 30px 20px 30px;',
                                items:[
                                   new Ext.Panel({
                                       layout: 'fit',
                                       frame: false,
                                       plain: false,
                                       border: false,
                                       html: '<h1 style="font-family: sans-serif;">New features under development, they don\'t work properly yet.</h1>'
                                   })
                                ]
                            },
                            addGroupPanelTab({
                                section: "nvidia",
                                items:   getNvidiaForm()
                            }),
                            addGroupPanelTab({
                                section: "network",
                                items:   getNFSForm()
                            }),
                    		addGroupPanelTab({
                        		section: "shutdown",
                        		items:   getVDRShutdownForm()
                    		})
                        ]
                }
            ]//grouptabpanel items
        }]//viewport items
    });//viewport
});//extonready

