YaVDR.Component.Dashboard = Ext.extend(YaVDR.Component, {
  itemId: 'dashboard',
  title: 'Dashboard',
  closable: false,
  anchor: '90%',
  initComponent: function() {

    this.padding = 10;
    this.items = [
      {
        frame: true,
        anchor: '100%',
        title: 'VDR',
        style: 'margin: 0 0 10px 0 ',
        html: 'asjdasdjhsa<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff asjdasdjhsa<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff'
      },
      {
        frame: true,
        anchor: '100%',
        title: 'System',
        html: 'asjdasdjhsa<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff asjdasdjhsa<br>sfdfdsff<br>sfdfsdfsdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsdfdsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsdfsff<br>sfdfdsff<br>sfdfdsff<br>sfdfdsff'
      }
    ];

    YaVDR.Component.Dashboard.superclass.initComponent.call(this);
  }
});
