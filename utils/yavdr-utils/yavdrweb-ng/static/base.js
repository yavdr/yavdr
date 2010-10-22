Ext.ns('YaVDR');

Ext.apply(YaVDR, {
  // Todo Error Handling
  getHdfValue: function(key, callback, scope) {
    Ext.Ajax.request({
      url: 'get_hdf_value?hdfpath=' + key,
      timeout: 3000,
      method: 'GET',
      scope: scope,
      success: function(xhr) {
        var value = xhr.responseText;
        callback.call(this, value);
      }
    });
  },
  // Todo Error Handling
  getHdfTree: function(key, callback, scope) {
    Ext.Ajax.request({
      url: 'get_hdf_value?hdftree=' + key,
      timeout: 3000,
      method: 'GET',
      scope: scope,
      success: function(xhr) {
        console.log(xhr.responseText);
        var value = Ext.decode(xhr.responseText);
        callback.call(this, value);
      }
    });
  },
  // Todo Error Handling
  getFileContent: function(file, callback, scope, options) {
    if(typeof options != 'object') options = {};
          
    options = Ext.applyIf(options, {
      puretext: true
    });
    
    Ext.Ajax.request({
      url: 'get_file_content?file='+file+'&puretext=' + (options.puretext ? 'true' : 'false'),
      timeout: 3000,
      method: 'GET',
      scope: scope,
      success: function(xhr) {
        callback.call(this, xhr.responseText);
      }
    })
  }
});

YaVDR.EasyComboBox = Ext.extend(Ext.form.ComboBox, {
  editable: false,
  forceSelection: true,
  mode: 'local',
  triggerAction: 'all',
  valueField: 'id',
  displayField: 'id',
  initComponent: function() {
    if(!this.store) {
      this.store = new Ext.data.ArrayStore({
        fields: [
          'id'
        ],
        data: this.data
      });
    }
  }
});

// base panel for each page
YaVDR.BasePanel = Ext.extend(Ext.Panel, {
  autoScroll: true,
  bodyStyle: 'border: 1px solid #99BBE8;'
});

YaVDR.BaseFormPanel = Ext.extend(Ext.FormPanel, {
  autoScroll: true,
  bodyStyle: 'border: 1px solid #99BBE8;',
  padding: 5,
  labelWidth: 200
});

YaVDR.BaseTabPanel = Ext.extend(Ext.TabPanel, {
  plain: true,
  activeItem: 0
});

YaVDR.SelectionList = Ext.extend(Ext.DataView, {
  scope: null,
  hiddenField: null,
  cls: 'frame-panel-border',
  style: 'background-color: #FFF; border-color: #B5B8C8;',
  anchor: '100%',
  autoHeight:true,
  singleSelect: true,
  overClass:'x-view-over',
  itemSelector: 'div.selection-wrap',
  initComponent: function() {
    YaVDR.SelectionList.superclass.initComponent.call(this);
    
    this.on('containerclick', this.handleContainerClick, this);
    this.on('selectionchange', this.handleSelection, this);
  },
  handleContainerClick: function(view, event) {
    event.stopEvent();
    return false;
  },
  handleSelection: function(view, selection) {
    if(selection.length == 1) {
      var record = view.getRecords(selection)[0];
      if(!record.data.disabled) {
        view.selection = record;
      } else {
        view.select(view.selection);
        return false; 
      }
    }
    this.hiddenField.setValue(view.selection.data.key).fireEvent('change', this.hiddenField, view.selection.data.key);
  }
});