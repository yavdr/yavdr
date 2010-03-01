function getNvidiaForm(){
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        items: [
            {
                xtype: 'sliderfield',
                id: 'nvidia-overscan-slider',
                width: 200,
                name: 'value',
                increment: 1,
                minValue: '0',
                maxValue: 255,
                fieldLabel: getLL("nvidia.overscan_slider_label"),
                value: 4
            }
                ]
    });

    var submit = myform.addButton({
        text: getLL("nvidia.button_label"),
        icon: 'ext/resources/images/default/grid/refresh.gif',
        //formBind: true,
        //scope: this,
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-overscan-compensation',
                waitMsg: getLL("nvidia.submit.waitmsg"),
                waitTitle: getLL("standardform.messagebox_caption.wait"),
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("nvidia.submit.success") );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("nvidia.submit.failure") );
                }
            })
        }
    });
    
    Ext.Ajax.request({
        url: 'get_hdf_value?hdfpath=system.hardware.nvidia.overscan ',
        timeout: 3000,
        method: 'GET',
        success: function(xhr) {
            //alert('Response is "' + xhr.responseText + '"');
            var currentOverscan = "";
            try {
                currentOverscan = xhr.responseText;
            }
            catch (err) {
                Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'Could not recognize overscan value.');
            }
            if (currentOverscan > 0 && currentOverscan < 256){
                var slider = Ext.getCmp('nvidia-overscan-slider');
                if (slider)
                    slider.setValue( currentOverscan );
                else
                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), 'nvidia-overscan-slider.');
            }
        }
    });
    
    return myform;
}