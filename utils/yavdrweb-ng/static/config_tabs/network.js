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
	  timeout: 3000,
	      url: 'get_autofs_config?cmd=mounts',
	      method:  'GET',
	      success: function(xhr) {
	      myData = Ext.util.JSON.decode( xhr.responseText );
	      store.loadData( myData );
	  }
      });

  var newDir = new Ext.form.TextField({
	  fieldLabel: getLL("network.nfs.labels.newDir"),
	  name: 'remote',
	  width: 200
      });

  var mounttable = new Ext.grid.GridPanel({
	  store:       store,
	  multiSelect: false,
	  height:      300,
	  plain: false,
	  frame: true,
	  tbar: [ newDir
		  ,{
		  text: getLL("network.nfs.labels.add"),
		  handler: function() {
		      if( newDir.getValue().length ) {
			  var r = new store.recordType({
				  netspec: newDir.getValue()},
			      recId++);
			  store.add( r );
			  selectedRow = -1;
		      }
		  }
	      },{
		  text: getLL("network.nfs.labels.edit"),
		  handler: function() {
		      if( 0 <= selectedRow ){
			  var record = store.getAt( selectedRow );
			  if( newDir.getValue().length ) {
			      record.set( 'netspec', newDir.getValue() );
			      newDir.setValue('');
			      selectedRow = -1;
			  }
		      }
		  }
	      },{
		  text: getLL("network.nfs.labels._delete"),
		  handler: function() {
		      if( 0 <= selectedRow ){
			  var record = store.getAt( selectedRow );
			  store.remove( record );
			  newDir.setValue('');
			  selectedRow = -1;
		      }
		  }
	      },{
		  text: getLL("network.nfs.labels.apply"),
		  handler: function() {
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
	      }],
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
	    
  var description = new Ext.form.TextField({
	  disabled: true,
	  originalValue: getLL("network.nfs.help")
      });

  return [ 
       mounttable,
       new Ext.Panel({
           width: "100%",
           frame: false,
           border: false,
           bodyStyle:'padding:5px 5px 0',
           html: '<p style="font-size: 12px;">' + getLL("network.nfs.help") + "</p>"
       })
   ];
}

function getNetworkForm(){
    var panel = new Ext.TabPanel({
	    activeTab: 0,
	    plain: false,
	    border: false,
     	    items: [{
		    title: getLL("network.nfs.menutab.title"),
		    items: getNFSForm()
		},{
		    title: getLL("network.samba.menutab.title"),
		    html: "not implemented yet"
		}]
     	});

    return panel;
}