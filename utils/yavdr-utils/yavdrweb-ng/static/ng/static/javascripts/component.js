YaVDR.Component = Ext.extend(Ext.Panel, {
  border: false ,
  header: false,
  initComponent: function() {
    YaVDR.Component.superclass.initComponent.call(this);
    if (this.title) this.insert(0, new YaVDR.Component.Header({ html: this.title }));
    if (this.description) this.insert(1, new YaVDR.Component.Item({
      title: 'Einleitung',
      style: 'padding-bottom: 5px',
      html: this.description
    }));
  }
});


YaVDR.Component.Header = Ext.extend(Ext.BoxComponent, {
  height: 36,
  style: 'color: #233d6d;font-weight: bold; font-size: 1.4em; text-indent: 3px; font-family: sans-serif; padding-bottom: 5px;'
});

YaVDR.Component.Item = Ext.extend(Ext.Panel, {
  frame: true,
  width: 690
});