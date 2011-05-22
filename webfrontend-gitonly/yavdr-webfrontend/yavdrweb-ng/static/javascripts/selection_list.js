YaVDR.SelectionList = Ext.extend(Ext.DataView, {
  scope: null,
  hiddenField: null,
  style: 'background-color: #FFF; border: 1px solid #D0D0D0;',
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
    if (selection.length == 1) {
      var record = view.getRecords(selection)[0];
      if (!record.data.disabled) {
        view.selection = record;
      } else {
        view.select(view.selection);
        return false;
      }
    }
    this.hiddenField.setValue(view.selection.data.key).fireEvent('change', this.hiddenField, view.selection.data.key);
  },

  // private
  onDisable : function(){
      this.el.mask();
      YaVDR.SelectionList.superclass.onDisable.call(this);
  },

  // private
  onEnable : function(){
      this.el.unmask();
      YaVDR.SelectionList.superclass.onEnable.call(this);
  }

});