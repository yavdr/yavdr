function LLForLangExists(paramArray, lang){
    var success = true;
    var validstring = "locale_" + lang; //global language var
    for (var z=0; z < paramArray.length; z++){
        validstring += "." + paramArray[z];
        var check = eval("typeof " + validstring + ";");
        if (check == "undefined"){
            success = false;
            break;
        }
    }
    return success;
}

function getLL( param ){
    var paramArray = param.split(".");
    if (!LLForLangExists(paramArray, yavdrwebGlobalInfo.lang)){
        label = "[undefined:"+param+"]";
        //check if we can find the label in English language labels
        if ( yavdrwebGlobalInfo.lang != "en" && LLForLangExists(paramArray, "en")){
            label = "[untranslated] " + eval( "locale_en." + param );
            //alert("Hint for translators: locale." + param + " was not yet translated to language "+lang+".");
        }
        else{
            alert("locale_en." + param + " does not exist in English language labels.");
        }
    }
    else
        label = eval( "locale_" + yavdrwebGlobalInfo.lang + "." + param );
    return label;
}

Ext.onReady(function() {

    
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
          name: this.name || this.id + "_dummy", 
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

