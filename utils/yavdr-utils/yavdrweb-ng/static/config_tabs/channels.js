function getChannelsForm(){

    var channellist_reader = new Ext.data.JsonReader({
        idProperty: '_num',
        remoteSort: false,
        root: 'channelList',
        totalProperty: 'totalCount',
        fields: [
                 '_num' , {name:'_num',  type: 'int'},
                 'name', {name:'name', type: 'string'},
                 'prov', {name:'prov', type: 'string'},
                 '_friendly_type' , {name:'_friendly_type',  type: 'string'},
                 '_friendly_scrambled' , {name:'_friendly_scrambled',  type: 'string'},
                 '_friendly_lang' , {name:'_friendly_lang',  type: 'string'},
                 '_friendly_transp' , {name:'_friendly_transp',  type: 'string'},
                 'mod'  , {name:'mod',  type: 'string'},
                 '_group', {name:'_group',  type: 'string'},
                 '_friendly_dvb_sat_band' , {name:'_friendly_dvb_sat_band',  type: 'string'}
                 //'src' , {name:'src',  type: 'string'},
                 //'freq' , {name:'freq', type: 'int'},
                 //'symb' , {name:'symb', type: 'int'},
                 //'vpid' , {name:'vpid',  type: 'string'},
                 //'apid' , {name:'apid',  type: 'string'},
                 //'tpid' , {name:'tpid',  type: 'string'},
                 //'caid' , {name:'caid',  type: 'string'},
                 //'sid'  , {name:'sid',  type: 'string'},
                 //'nid'  , {name:'nid',  type: 'string'},
                 //'tid'  , {name:'tid',  type: 'string'},
                 //'rid'  , {name:'rid',  type: 'string'}
             ]
        
    });
    
    
    var channellist_store = new Ext.data.GroupingStore({
        autoDestroy: true,
        autoLoad: false,
        url: 'get_svdrp_response?command=LSTC',
        storeId: 'channellist_store',
        groupField: '_group',
        reader: channellist_reader
    });

    var gridLoadMask = new Ext.LoadMask(Ext.getBody(), {
        msg:"Please wait...",
        store: channellist_store
    });
    
    /*only for debug
    function captureEvents(observable) {
        Ext.util.Observable.capture(
            observable,
            function(eventName) {
                console.info(eventName);
            },
            this
        );      
    }*/
     
    function createChannelGrid(){
        var grid = new Ext.grid.GridPanel({
            store: channellist_store,
            columns: [
                {header: getLL("channels.grid_header._num"),  align: 'right', width: 40, dataIndex: '_num', sortable: true},
                {header: getLL("channels.grid_header.name"),  align: 'left', width: 160, dataIndex: 'name', sortable: true},
                {header: getLL("channels.grid_header.provider"),  align: 'left', width: 100, dataIndex: 'prov', sortable: true},
                {header: getLL("channels.grid_header._friendly_type"),  align: 'center', width: 50, dataIndex: '_friendly_type', sortable: true},
                {header: getLL("channels.grid_header._friendly_scrambled"),  align: 'center', width: 70, dataIndex: '_friendly_scrambled', sortable: true},
                {header: getLL("channels.grid_header._friendly_lang"),  align: 'center', width: 70, dataIndex: '_friendly_lang', sortable: true},
                {header: getLL("channels.grid_header._friendly_transp"),  align: 'left', width: 140, dataIndex: '_friendly_transp', sortable: true},
                {header: getLL("channels.grid_header.modulation"),  align: 'left', width: 140, dataIndex: 'mod', sortable: true},
                {header: getLL("channels.grid_header._friendly_dvb_sat_band"),  align: 'left', width: 160, dataIndex: '_friendly_dvb_sat_band', sortable: true, hidden: true},
                //{header: getLL("channels.grid_header.source"),  align: 'left', width: 50, dataIndex: 'src', sortable: true, hidden: true},
                //{header: getLL("channels.grid_header.frequency"),  align: 'right', width: 70, dataIndex: 'freq', sortable: true, hidden: true},
                //{header: getLL("channels.grid_header.symbolrate"),  align: 'right', width: 70, dataIndex: 'symb', sortable: true, hidden: true},
                //{header: getLL("channels.grid_header.vpid"),  align: 'left', width: 90, dataIndex: 'vpid', sortable: true, hidden: true},
                //{header: getLL("channels.grid_header.apid"),  align: 'left', width: 220, dataIndex: 'apid', sortable: true, hidden: true},
                //{header: getLL("channels.grid_header.tpid"),  align: 'right', width: 40, dataIndex: 'tpid', sortable: true, hidden: true},
                //{header: getLL("channels.grid_header.caid"),  align: 'left', width: 70, dataIndex: 'caid', sortable: true, hidden: true},
                //{header: getLL("channels.grid_header.sid"),  align: 'right', width: 40, dataIndex: 'sid', sortable: true, hidden: true},
                //{header: getLL("channels.grid_header.nid"),  align: 'right', width: 40, dataIndex: 'nid', sortable: true, hidden: true},
                //{header: getLL("channels.grid_header.tid"),  align: 'right', width: 40, dataIndex: 'tid', sortable: true, hidden: true},
                //{header: getLL("channels.grid_header.rid"),  align: 'right', width: 40, dataIndex: 'rid', sortable: true, hidden: true},
                {header: getLL("channels.grid_header._group"),  align: 'left', width: 150, dataIndex: '_group', sortable: true}
            ],
            view: new Ext.grid.GroupingView({
                forceFit: false,
                autoFill :true,
                hideGroupedColumn: true,
                showGroupName: false,
                startCollapsed: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
            }),
            title: getLL("channels.grid_title"),
            frame: true,
            loadMask: gridLoadMask,
            tbar: [
                {
                    text: 'Refresh', //TODO use getLL here!
                    icon: '/ext/resources/images/default/grid/refresh.gif',
                    tooltip: 'Click this button to refresh channel list.',
                    handler: function(){
                        channellist_store.reload();
                    }
                }

/*,
                {
                    text: 'Collapse all groups', //TODO use getLL here!
                    //icon: '/ext/resources/images/default/grid/refresh.gif',
                    tooltip: 'Click this button to collapse all open groups.',
                    handler: function(){
                        grid.view.collapseAllGroups();
                    }
                },
                {
                    text: 'Expand all groups', //TODO use getLL here!
                    //icon: '/ext/resources/images/default/grid/refresh.gif',
                    tooltip: 'Click this button to expand all closed groups.',
                    handler: function(){
                        grid.view.expandAllGroups();
                    }
                },
                {
                    text: 'Clear grouping', //TODO use getLL here!
                    //icon: '/ext/resources/images/default/grid/refresh.gif',
                    tooltip: 'Click this button to remove the current grouping.',
                    handler: function(){
                        channellist_store.clearGrouping();
                    }
                },
                {
                    text: 'Switch to selected channel',
                    id: 'zap_button',
                    //icon: '/ext/resources/images/default/grid/refresh.gif',
                    tooltip: 'Click this button to display this channel on VDR Frontend. This does not if you use XBMC as a frontend (I guess...).',
                    disabled: true,
                    handler: function(){
                        //get selection Model
                        var selectionModel = grid.getSelectionModel();
                        //get the selected record
                        var record = selectionModel.getSelected();
                        //get the index of selected record
                        var idx = grid.store.indexOf(record);
                        alert(idx);
                        Ext.Ajax.request({
                            url: 'get_svdrp_response?command=CHAN 2',
                            timeout: 3000,
                            method: 'GET',
                            scope: this,
                            success: function(xhr) {
                                alert('Response is "' + xhr.responseText + '"');
                                / / / 
                                var lircData = 0;
                                try {
                                    lircData = Ext.util.JSON.decode( xhr.responseText );
                                    //Ext.MessageBox.alert('Success', 'Decode of lircdata OK: ' + lircData.current_receiver);
                                }
                                catch (err) {
                                    Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("lirc.error.json_decode"));
                                }            
                                this.lircData = lircData;
                                / / / 
                            }
                        });
                    }
                }*/
            ],
            viewConfig: {
                forceFit: false
            }/*,
            listeners: {
                rowclick:function(grid, rowIndex, e) {
//                    grid.getComponent('zap_button').setDisabled(false);
//                    e.stopEvent();
                    var index = this.grid.getView().findRowIndex(t);
                    var record = this.grid.store.getAt(index);
                    
                    //get selection Model
                    var selectionModel = grid.getSelectionModel();
                    //get the selected record
                    var record = selectionModel.getSelected();
                    //get the index of selected record
                    var idx = grid.store.indexOf(record);
                    alert(record + " / " + idx);
                    
                    
//                    record.set(this.dataIndex, !record.data[this.dataIndex]);
//                    this.fireEvent('click', this, e, record)            
                }
            }*/
        });
        grid.on({
            render:{
                scope: this,
                fn: function() {
                    //load store after the grid is done rendering
                    channellist_store.load();
                }
            }
        });
        //captureEvents(grid);
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
