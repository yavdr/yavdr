function getChannelsForm(){

    var channellist_reader = new Ext.data.JsonReader({
        idProperty: 'num',
        remoteSort: false,
        root: 'channelList',
        totalProperty: 'totalCount',
        fields: [
                 'num' , {name:'num',  type: 'int'},
                 'name', {name:'name', type: 'string'},
                 'prov', {name:'prov', type: 'string'},
                 'src' , {name:'src',  type: 'string'},
                 '_friendly_type' , {name:'_friendly_type',  type: 'string'},
                 '_friendly_scrambled' , {name:'_friendly_scrambled',  type: 'string'},
                 '_friendly_lang' , {name:'_friendly_lang',  type: 'string'},
                 '_friendly_transp' , {name:'_friendly_transp',  type: 'string'},
                 'freq' , {name:'freq', type: 'int'},
                 'mod'  , {name:'mod',  type: 'string'},
                 'symb' , {name:'symb', type: 'int'},
                 'vpid' , {name:'vpid',  type: 'string'},
                 'apid' , {name:'apid',  type: 'string'},
                 'tpid' , {name:'tpid',  type: 'string'},
                 'caid' , {name:'caid',  type: 'string'},
                 'sid'  , {name:'sid',  type: 'string'},
                 'nid'  , {name:'nid',  type: 'string'},
                 'tid'  , {name:'tid',  type: 'string'},
                 'rid'  , {name:'rid',  type: 'string'},
                 'group', {name:'group',  type: 'string'}
             ]
        
    });
    
    
    var channellist_store = new Ext.data.GroupingStore({
        autoDestroy: true,
        autoLoad: false,
        url: 'get_svdrp_response?command=LSTC',
        storeId: 'channellist_store',
        groupField: 'group',
        reader: channellist_reader
    });

    var gridLoadMask = new Ext.LoadMask(Ext.getBody(), {
        msg:"Please wait...",
        store: channellist_store
    });
    
    function createChannelGrid(){
        var grid = new Ext.grid.GridPanel({
            store: channellist_store,
            columns: [
                {header: getLL("channels.grid_header.number"),  align: 'right', width: 30, dataIndex: 'num', sortable: true},
                {header: getLL("channels.grid_header.name"),  align: 'left', width: 160, dataIndex: 'name', sortable: true},
                {header: getLL("channels.grid_header.provider"),  align: 'left', width: 90, dataIndex: 'prov', sortable: true},
                {header: getLL("channels.grid_header._friendly_type"),  align: 'center', width: 50, dataIndex: '_friendly_type', sortable: true},
                {header: getLL("channels.grid_header._friendly_scrambled"),  align: 'center', width: 70, dataIndex: '_friendly_scrambled', sortable: true},
                {header: getLL("channels.grid_header._friendly_lang"),  align: 'center', width: 70, dataIndex: '_friendly_lang', sortable: true},
                {header: getLL("channels.grid_header._friendly_transp"),  align: 'left', width: 140, dataIndex: '_friendly_transp', sortable: true},
                {header: getLL("channels.grid_header.modulation"),  align: 'left', width: 90, dataIndex: 'mod', sortable: true},
                {header: getLL("channels.grid_header.source"),  align: 'left', width: 50, dataIndex: 'src', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.frequency"),  align: 'right', width: 70, dataIndex: 'freq', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.symbolrate"),  align: 'right', width: 70, dataIndex: 'symb', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.vpid"),  align: 'left', width: 90, dataIndex: 'vpid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.apid"),  align: 'left', width: 220, dataIndex: 'apid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.tpid"),  align: 'right', width: 40, dataIndex: 'tpid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.caid"),  align: 'left', width: 70, dataIndex: 'caid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.sid"),  align: 'right', width: 40, dataIndex: 'sid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.nid"),  align: 'right', width: 40, dataIndex: 'nid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.tid"),  align: 'right', width: 40, dataIndex: 'tid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.rid"),  align: 'right', width: 40, dataIndex: 'rid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.group"),  align: 'left', width: 150, dataIndex: 'group', sortable: true, hidden: true}
            ],
            view: new Ext.grid.GroupingView({
                forceFit:true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
            }),
            title: getLL("channels.grid_title"),
            frame: true,
            loadMask: gridLoadMask,
            tbar: [{
                text: 'Refresh', //TODO use getLL here!
                icon: '/ext/resources/images/default/grid/refresh.gif',
                tooltip: 'Click this button to refresh channel list.',
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

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "vdr"})
            .addGroupPanelTab({
                section: "channels",
                layout: "fit",
                border: false,
                frame: false,
                items:   getChannelsForm});
});