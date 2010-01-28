function getNFSForm(){
    var store = new Ext.data.ArrayStore({
	    fields: [ { name:'netspec', type: 'string'} ]
	});

    var mounts = new Ext.grid.GridPanel({
	    store: store,
	    multiSelect: false,
	    stripeRows: true,
	    autoExpandColumn: 'netspec',
	    height: 200,
	    width: 400,
	    title: 'NFS mounts',
	    // config options for stateful behavior
	    stateful: true,
	    stateId: 'grid',
	    columns: [{
		    id: 'netspec',
		    header: 'Remote Spec',
		    width: 400,
		    dataIndex: 'netspec'
		}]
	});
	    
    var myform = new Ext.FormPanel({
        frame: false,
        plain: false,
        border: true,
        bodyStyle:'padding:5px 5px 0;',
        labelWidth: 150,
        buttonAlign: 'left',
        items: mounts
	});

    var submit = myform.addButton({
        text: 'Übernehmen',
        handler: function() {
            myform.form.submit({
                url: 'set_signal?signal=change-auto-net-yavdr',
                waitMsg: 'wait',
                waitTitle: locale.standardform.messagebox_caption.wait,
                scope:this,
                success: function (form, action) {
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.message, locale.upload.submit.success );
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert( locale.standardform.messagebox_caption.error, locale.upload.submit.failure );
                }
            })
        }
    });
    Ext.Ajax.request({
	    url: 'get_autofs_config?cmd=mounts',
		timeout: 3000,
		method: 'GET',
		success: function(xhr) {
		// alert('Response is "' + xhr.responseText + '"');
		var data = Ext.util.JSON.decode( xhr.responseText );
		store.loadData( data );
            }
	});

    return myform;
}