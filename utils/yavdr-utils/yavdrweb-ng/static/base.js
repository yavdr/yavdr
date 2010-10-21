Ext.ns('YaVDR');

// base panel for each page
YaVDR.BasePanel = Ext.extend(Ext.Panel, {
  autoScroll: true,
  bodyStyle: 'border: 1px solid #99BBE8;',
  initComponent: function() {
    YaVDR.BasePanel.superclass.initComponent.call(this);
  }
});

YaVDR.BaseFormPanel = Ext.extend(Ext.FormPanel, {
  autoScroll: true,
  bodyStyle: 'border: 1px solid #99BBE8;',
  padding: 5,
  buttonAlign: 'left',
  labelWidth: 200,
  initComponent: function() {
    YaVDR.BaseFormPanel.superclass.initComponent.call(this);
  }
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
    this.hiddenField.setValue(view.selection.data.key);
  }
});