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