function getPackagesForm(){
    // create the Data Store
    var store = new Ext.data.JsonStore({
        // load using HTTP
        url: 'get_packages',
        idProperty: 'Package',
        fields: ['id', 'Package', 'Version', 'Description', 'Maintainer', 'installed' ],
        sortInfo: {
            field: 'Package',
            direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
        }
    });

    // create the grid
    var grid = new Ext.grid.GridPanel({
        store: store,
	style: 'border: 1px solid #99BBE8',
	margins: '0 0 5 0',
        columns: [
            {header: "",width: 22, dataIndex: 'installed', sortable: true, renderer: renderState},
            {header: "Package", width: 180, dataIndex: 'Package', sortable: true},
            {header: "Version", width: 180, dataIndex: 'Version', sortable: true},
            {header: "Maintainer", width: 180, dataIndex: 'Maintainer', sortable: true},
            {header: "Description",width: 1000, dataIndex: 'Description', sortable: true}
        ],
        sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
        viewConfig: {
            forceFit: true
        },
//        height:300,
        region: 'center',
//        region: 'north',
        listeners: {
            celldblclick: function(grid, row, col, event ) {
                if ("installed" == grid.getColumnModel().getDataIndex(col)) {
                    rec = grid.getStore().getAt(row);
                    package = rec.id;
                    
                    if (rec.data.installed == 0) {
                        // Show a dialog using config options:
                        Ext.Msg.show({
                           title:'Install package?',
                           msg: 'Would you like to install package "' + package + '"?',
                           buttons: Ext.Msg.YESNO,
                           fn: function( buttonId, text, opt) {
                               if (buttonId == "yes") {
                                   var jetzt = new Date();
                                   var win = new Ext.Window({
                                       layout: 'fit',
                                       id: 'installer',
                                       title: 'yaVDR Paket Installer',
                                       width:600,
                                       height:450,
                                       items: [{
                                           html: '<iframe src="dpkg?command=install&package='+package+'&ts='+jetzt.getTime()+'" style="width: 584px; height: 385px;" onload="Ext.getCmp(\'closeinstaller\').enable()"></iframe>'
                                       }],
                                       resizable:false,
                                       closable: false,
                                       modal: true
                                   });
                                   
                                   win.addButton({
                                       id: 'closeinstaller',
                                       disabled:true,
                                       text: 'Close'
                                   }, function() { grid.getStore().load(); win.close(); } );
                                   win.show(this);
                               }
                           },
                           animEl: 'elId',
                           icon: Ext.MessageBox.QUESTION
                        });
                    } else if (package.substr(0,11) == "vdr-plugin-") {
                      if (rec.data.installed == 2) {
                        // Show a dialog using config options:
                        Ext.Msg.show({
                            title:'disable plugin?',
                            msg: 'Would you like to disable "' + package + '"?',
                            buttons: Ext.Msg.YESNO,
                            fn: function( buttonId, text, opt) {
                                if (buttonId == "yes") {
                                    Ext.Ajax.request({
                                        url: 'set_signal?signal=change-plugin&signal_params=disable '+package,
                                        waitMsg: getLL("nvidia.submit.waitmsg"),
                                        timeout: 3000,
                                        method: 'GET',
                                        success: function(xhr) {
                                            grid.getStore().load();
                                        }
                                    });
                                }
                            },
                            animEl: 'elId',
                            icon: Ext.MessageBox.QUESTION
                        });
                      } else {
                        // Show a dialog using config options:
                        Ext.Msg.show({
                            title:'enable plugin?',
                            msg: 'Would you like to enable "' + package + '"?',
                            buttons: Ext.Msg.YESNO,
                            fn: function( buttonId, text, opt) {
                                if (buttonId == "yes") {
                                    Ext.Ajax.request({
                                        url: 'set_signal?signal=change-plugin&signal_params=enable '+package,
                                        waitMsg: getLL("nvidia.submit.waitmsg"),
                                        timeout: 3000,
                                        method: 'GET',
                                        success: function(xhr) {
                                            grid.getStore().load();
                                        }
                                    });
                                }
                            },
                            animEl: 'elId',
                            icon: Ext.MessageBox.QUESTION
                        });
                      }
                    }
                }
            } 
        }
    });
    
    // define a template to use for the detail view
    var packageTplMarkup = [
        'Package: {Package}<br/>',
        'Maintainer: {Maintainer}<br/>',
        'Description: {Description}<br/>'
    ];
    var packageTpl = new Ext.Template(packageTplMarkup);


    grid.getSelectionModel().on('rowselect', function(sm, rowIdx, r) {
        var detailPanel = Ext.getCmp('detailPanel');
        packageTpl.overwrite(detailPanel.body, r.data);
    });

    var myform = new Ext.Panel({
        frame: false,
        plain: false,
        border: false,
//        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
//        autoHeight: true,
        //height: 'auto',
        layout: 'border',
//        layout: 'fit',

items: [
	grid,
	{
                region: 'south',
		autoScroll: true,
		style: 'border: 1px solid #99BBE8',
		bodyStyle: {
			background: '#ffffff',
			padding: '7px'
		},
		height: 82,
		items: [
			{
				id: 'detailPanel',
				html: 'Please select a package to see additional details.'
			},
			{
				id: 'help',
				html: 'dblclick on red icon to install package.....<br/> vdr-plugins can be dis- & enabled...'
			}
		]
	}
]



    });
    
    myform.addButton('apt-get update', function() {
        var jetzt = new Date();
        var win = new Ext.Window({
            layout: 'fit',
            id: 'installer',
            title: 'yaVDR Paket Installer',
            width:600,
            height:450,
            items: [{
                html: '<iframe src="dpkg?command=update&ts='+jetzt.getTime()+'" style="width: 584px; height: 385px;" onload="Ext.getCmp(\'closeinstaller\').enable()"></iframe>'
            }],
            resizable:false,
            closable: false,
            modal: true
        });
       
        win.addButton({
            id: 'closeinstaller',
            disabled:true,
            text: 'Close'
        }, function() { grid.getStore().load(); win.close(); } );
        win.show(this);
    });

    myform.addButton('apt-get autoremove', function() {
        var jetzt = new Date();
        var win = new Ext.Window({
            layout: 'fit',
            id: 'installer',
            title: 'yaVDR Paket Installer',
            width:600,
            height:450,
            items: [{
                html: '<iframe src="dpkg?command=autoremove&ts='+jetzt.getTime()+'" style="width: 584px; height: 385px;" onload="Ext.getCmp(\'closeinstaller\').enable()"></iframe>'
            }],
            resizable:false,
            closable: false,
            modal: true
        });
       
        win.addButton({
            id: 'closeinstaller',
            disabled:true,
            text: 'Close'
        }, function() { grid.getStore().load(); win.close(); } );
        win.show(this);
    });
    store.load();
    
    return myform;
}

function renderState(state) {
    switch(state) {
        case 2:
            return '<img src="/static/images/green.png" border="0">';
            break;
        case 0:
            return '<img src="/static/images/red.png" border="0">';
            break;
        case 1:
            return '<img src="/static/images/yellow.png" border="0">';
            break;
    }
}

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "vdr"})
            .addGroupPanelTab({
                layout: 'fit',
                section: "packages",
                items:   getPackagesForm});
});
