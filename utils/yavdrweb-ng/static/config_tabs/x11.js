function getX11Form( resolutionArray ){

    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: false,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 130,
        defaults: {width: 500},
        defaultType: 'textfield',
        items: [
                new Ext.form.ComboBox({ 
                    store: new Ext.data.ArrayStore({
                        fields: [
                                 "id",
                                 "resolution"
                                 ],
                                 data : resolutionArray
                    }),
                    displayField:'resolution',
                    typeAhead: true,
                    forceSelection: true,
                    mode: "local",
                    triggerAction: 'all',
                    emptyText:'Bitte X11-Auflösung wählen...',
                    fieldLabel: 'X11-Auflösung',
                    selectOnFocus:true,
                    width: '100%',
                    height: '100%'
                })
                ]
    });

    var submit = myform.addButton({
        text: 'Save',
        //formBind: true,
        //scope: this,
        handler: function() {
        myform.form.submit({
            url: 'set_x11_resolution',
            waitMsg:'Bildschirm-Settings werden gespeichert.',
            scope:this
            //success:this.onSuccess,
            //failure:this.onFailure,
            //params:{cmd:'save'},
            //this.getForm().submit({
            /*  Alternatively, instead of using actionfailed / complete (below) you could use these functions:    
                ,
                success: function (form, action) {
                    Ext.MessageBox.alert('Message', 'Saved OK');
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert('Message', 'Save failed');
                }
             */
        })
    }
    });

    return myform;
}