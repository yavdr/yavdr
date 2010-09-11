function getChannelsForm(){

    var channellist_reader = new Ext.data.JsonReader({
        idProperty: 'cnum',
        remoteSort: false,
        root: 'channelList',
        totalProperty: 'totalCount',
        fields: [
                 'cnum' , {name:'cnum',  type: 'int'},
                 'cname', {name:'cname', type: 'string'},
                 'cprov', {name:'cprov', type: 'string'},
                 'csrc' , {name:'csrc',  type: 'string'},
                 'c_friendly_type' , {name:'c_friendly_type',  type: 'string'},
                 'c_friendly_scrambled' , {name:'c_friendly_scrambled',  type: 'string'},
                 'c_friendly_lang' , {name:'c_friendly_lang',  type: 'string'},
                 'cfreq', {name:'cfreq', type: 'int'},
                 'cmod' , {name:'cmod',  type: 'string'},
                 'csymb', {name:'csymb', type: 'int'},
                 'cvpid' , {name:'cvpid',  type: 'string'},
                 'capid' , {name:'capid',  type: 'string'},
                 'ctpid' , {name:'ctpid',  type: 'string'},
                 'ccaid' , {name:'ccaid',  type: 'string'},
                 'csid' , {name:'csid',  type: 'string'},
                 'cnid' , {name:'cnid',  type: 'string'},
                 'ctid' , {name:'ctid',  type: 'string'},
                 'crid' , {name:'crid',  type: 'string'},
                 'cgroup' , {name:'cgroup',  type: 'string'}
                 //,'cstr' , {name:'cstr',  type: 'string'}
             ]
        
    });
    
    
    var channellist_store = new Ext.data.GroupingStore({
        autoDestroy: true,
        autoLoad: false,
        url: 'get_svdrp_response?command=LSTC',
        storeId: 'channellist_store',
        groupField: 'cgroup',
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
                {header: getLL("channels.grid_header.cnumber"),  align: 'right', width: 30, dataIndex: 'cnum', sortable: true},
                {header: getLL("channels.grid_header.cname"),  align: 'left', width: 160, dataIndex: 'cname', sortable: true},
                {header: getLL("channels.grid_header.cprovider"),  align: 'left', width: 90, dataIndex: 'cprov', sortable: true},
                {header: getLL("channels.grid_header.csource"),  align: 'left', width: 50, dataIndex: 'csrc', sortable: true},
                {header: getLL("channels.grid_header.c_friendly_type"),  align: 'left', width: 50, dataIndex: 'c_friendly_type', sortable: true},
                {header: getLL("channels.grid_header.c_friendly_scrambled"),  align: 'left', width: 70, dataIndex: 'c_friendly_scrambled', sortable: true},
                {header: getLL("channels.grid_header.c_friendly_lang"),  align: 'left', width: 70, dataIndex: 'c_friendly_lang', sortable: true},
                {header: getLL("channels.grid_header.cfrequency"),  align: 'right', width: 70, dataIndex: 'cfreq', sortable: true},
                {header: getLL("channels.grid_header.cmodulation"),  align: 'left', width: 90, dataIndex: 'cmod', sortable: true},
                {header: getLL("channels.grid_header.csymbolrate"),  align: 'right', width: 70, dataIndex: 'csymb', sortable: true},
                {header: getLL("channels.grid_header.cvpid"),  align: 'left', width: 90, dataIndex: 'cvpid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.capid"),  align: 'left', width: 220, dataIndex: 'capid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.ctpid"),  align: 'right', width: 40, dataIndex: 'ctpid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.ccaid"),  align: 'left', width: 70, dataIndex: 'ccaid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.csid"),  align: 'right', width: 40, dataIndex: 'csid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.cnid"),  align: 'right', width: 40, dataIndex: 'cnid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.ctid"),  align: 'right', width: 40, dataIndex: 'ctid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.crid"),  align: 'right', width: 40, dataIndex: 'crid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header.cgroup"),  align: 'left', width: 150, dataIndex: 'cgroup', sortable: true, hidden: true}
                //,{header: getLL("channels.grid_header.cstr"),  align: 'left', width: 800, dataIndex: 'cstr', sortable: false}
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