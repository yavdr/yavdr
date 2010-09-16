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

    var viewport = new Ext.Viewport({
    	
        layout:'fit',
        items:[
            Ext.create({
            	id: 'webfrontend',
                xtype: 'grouptabpanel',
                tabWidth: 190,
                activeGroup: 0,
                items: YaVDRMenuManager.getMenu()
            })
        ] //viewport items
    });//viewport
});//extonready
