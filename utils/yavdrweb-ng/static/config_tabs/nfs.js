function getNFSForm(){
  var selectedRow = -1;
  var recId = 100;
  var rt = Ext.data.Record.create([{name: 'netspec'}]);
    
  var store = new Ext.data.Store({
    url: 'get_autofs_config?cmd=mounts',
	reader: new Ext.data.ArrayReader( { idIndex: 0 },
					  rt )
	});

  Ext.Ajax.request({
    url: 'get_autofs_config?cmd=mounts',
	timeout: 3000,
	method:  'GET',
	success: function(xhr) {
	myData = Ext.util.JSON.decode( xhr.responseText );
	store.loadData( myData );
      }
    });

  var mounts = new Ext.grid.GridPanel({
    store:       store,
	multiSelect: false,
	height:      100,
	// config options for stateful behavior
	columns: [{dataIndex: 'netspec'}],
	listeners: {
      cellclick: function(grid, rowIndex, columnIndex, e) {
	  var record = grid.getStore().getAt(rowIndex);
	  newDir.setValue( record.get( 'netspec' ) );
	  selectedRow = rowIndex;
	}
      }
    });
	    
  var newDir = new Ext.form.TextField({
    fieldLabel: getLL("network.nfs.labels.newDir"),
	name: 'remote',
	anchor: '100%'
	});

  var mounttable = new Ext.Panel({
    layout:      'form',
	frame:       false,
	plain:       false,
	border:      false,
	labelWidth:  150,
	width:       400,

	items: [ newDir, mounts ]
	});

  var mountactions = new Ext.Panel({
    layout:       'anchor',
	frame:        false,
	border:       false,
	width:        100,
	layoutConfig: {columns:1},
	defaultType:  'button',
	items: [{
	text: getLL("network.nfs.labels.add"),
	    anchor: '100%',
	    listeners: {
	  click: function() {
	      if( newDir.getValue().length ) {
		var r = new store.recordType({
		  netspec: newDir.getValue()},
		  recId++);
		store.add( r );
		selectedRow = -1;
	      }
	    }
	  }
	},{
	text: getLL("network.nfs.labels.edit"),
	    anchor: '100%',
	    listeners: {
	  click: function() {
	      if( 0 <= selectedRow ){
		var record = store.getAt( selectedRow );
		if( newDir.getValue().length ) {
		  record.set( 'netspec', newDir.getValue() );
		  newDir.setValue('');
		  selectedRow = -1;
		}
	      }
	    }
	  }
	},{
	text: getLL("network.nfs.labels._delete"),
	      anchor: '100%',
	      listeners: {
	  click: function() {
	      if( 0 <= selectedRow ){
		var record = store.getAt( selectedRow );
		store.remove( record );
		newDir.setValue('');
		selectedRow = -1;
	      }
	    }
	  }
	},{
	text: getLL("network.nfs.labels.apply"),
	      anchor: '100%',
	      listeners: {
	  click: function() {
	      var mounts = [];
	      selectedRow = -1;
	      Ext.each(store.getRange(), // complete
		       function(k, v){
			 mounts.push( k.data.netspec );},
		       this);
	      Ext.Ajax.request({
		      url: 'set_autofs_config',
			  timeout: 3000,
			  method:  'GET',
			  params: { 'cmd' : 'mounts',
			      'mounts' : mounts },
			  waitMsg: 'wait',
			  waitTitle: getLL("standardform.messagebox_caption.wait"),
			  success: function(xhr) {
			  Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("upload.submit.success") );
		      },
			  failure:function(form, action) {
			  Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("upload.submit.failure") );
		      }
		  })
		      }
		  }
	      }]
      });
    
  var panel = new Ext.FormPanel({
    layout:'column',
	frame: false,
	plain: false,
	border: true,
	bodyStyle:'padding:5px 5px 0;',
	labelWidth: 150,
	items: [mounttable,
		mountactions]
	});

  return panel;
}
