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
        columns: [
            {header: "Package", width: 180, dataIndex: 'Package', sortable: true},
            {header: "Version", width: 180, dataIndex: 'Version', sortable: true},
            {header: "Maintainer", width: 180, dataIndex: 'Maintainer', sortable: true},
            {header: "Description",width: 1000, dataIndex: 'Description', sortable: true},
            {header: "",width: 22, dataIndex: 'installed', sortable: true, renderer: renderState}
        ],
        sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
        viewConfig: {
            forceFit: true
        },
        height:210,
        split: true,
        region: 'north'
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
        bodyStyle:'padding:5px 5px 0',
        labelWidth: 150,
        //defaultType: 'textfield',
        buttonAlign: 'left',
        //height: 500,
        layout: 'fit',
        items: [
             grid,
            {
                id: 'detailPanel',
                region: 'center',
                bodyStyle: {
                    background: '#ffffff',
                    padding: '7px'
                },
                
                html: 'Please select a package to see additional details.'
            }]
    });

    store.load();
    
    return myform;
}

function renderState(state) {
    switch(state) {
        case 1:
            return '<img src="/static/images/green.png" border="0">';
            break;
        case 0:
            return '<img src="/static/images/red.png" border="0">';
            break;
        case -1:
            return '<img src="/static/images/yellow.png" border="0">';
            break;
    }
}

