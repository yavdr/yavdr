function getChannelsForm(){

    
    var channellist_store = new Ext.data.JsonStore({
        autoDestroy: true,
        autoLoad: false,
        url: 'get_svdrp_response?command=LSTC',
        storeId: 'channellist_store',
        // reader configs
        root: 'channelList',
        idProperty: 'cid',
        remoteSort: false,
        totalProperty: 'totalCount',
        fields: ['cid', {name:'cid', type: 'int'}, 'cname', {name:'cname', type: 'string'}, 'cstr', {name:'cstr', type: 'string'}]
    });

    var gridLoadMask = new Ext.LoadMask(Ext.getBody(), {
        msg:"Please wait...",
        store: channellist_store
    });
    
    function createChannelGrid(){
        var grid = new Ext.grid.GridPanel({
            store: channellist_store,
            columns: [
                {header: locale.channels.grid_header.cid,  align: 'right', width: 50, dataIndex: 'cid', sortable: true},
                {header: locale.channels.grid_header.cname,  align: 'left', width: 200, dataIndex: 'cname', sortable: true},
                {header: locale.channels.grid_header.cstr,  align: 'left', width: 800, dataIndex: 'cstr', sortable: false}
            ],
            title: locale.channels.grid_title,
            frame: true,
            loadMask: gridLoadMask,
            tbar: [{
                text: 'Aktualisieren',
                icon: 'ext/resources/images/default/grid/refresh.gif',
                tooltip: 'Klicken Sie diesen Button, um den Inhalt des Panels zu aktualisieren.',
                handler: function(){
                    channellist_store.reload();
                }
            }],
            viewConfig: {
                forceFit: false
            }
        });
        grid.on({
            render:{
                scope: this,
                fn: function() {
                    //load store after the grid is done rendering
                    channellist_store.load();
                }
            }/*,
            cellclick:{
                scope: this,
                fn: function(grid, rowIndex, columnIndex, e) {
                    var record = grid.getStore().getAt(rowIndex);  // Get the Record
                    var package = record.get('package_name');  // Get the package name
                    var fieldName = grid.getColumnModel().getDataIndex(columnIndex); // Get column field name
                    var data = record.get(fieldName); // get the package version
                    if (data !== ''){
                        //alert('cellClick: ' + package +  ' / '   + record + ' / ' + fieldName + ' / ' + data );
                        // create the window on the first click and reuse on subsequent clicks
                        singlePackageWindow.setTitle(package +  ' / '   + record + ' / ' + fieldName + ' / ' + data);
                        //singlePackageWindowElement.update( package +  ' / '   + record + ' / ' + fieldName + ' / ' + data);
                        singlePackageWindow.show(this);
                    }
                    else
                        alert('cellClick: Package does not exist.');
                }

            }*/
        });
        return grid;
    }
    
    
    
    var myform = createChannelGrid();
    
    var myform2 = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 130,
        //defaults: {width: 500},
        defaultType: 'textfield',
        items: [
                createChannelGrid()
                /*
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
                })*/
                ]
    });
/*
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
            //this.getForm().submit({/*
            /*  Alternatively, instead of using actionfailed / complete (below) you could use these functions:    
                ,
                success: function (form, action) {
                    Ext.MessageBox.alert('Message', 'Saved OK');
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert('Message', 'Save failed');
                }
             *//*
        })
    }
    });
*/
    return myform;
}