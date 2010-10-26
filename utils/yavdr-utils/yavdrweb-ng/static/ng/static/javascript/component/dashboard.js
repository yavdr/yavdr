YaVDR.Component.Dashboard = Ext.extend(YaVDR.Component, {
  itemId: 'dashboard',
  layout:'column',
  initComponent: function() {

    //this.padding = 5;
    this.items = [

      {
        columnWidth: .5,
        baseCls:'x-plain',

        items: [
          {
            frame: true,
            autoScroll: true,
            height: 150,
            anchor: '100%',
            title: 'VDR',
            style: 'margin: 0 5px 5px 0 ',
            tools: [{id: 'refresh'}],
            html: '<b>Status</b>: VDR gestartet<br><b>Speicherplatz</b>: 45G<br><b>Frontend</b>: Xine<br><b>Auflösung</b>: 1920x1080'
          },
          {
            frame: true,
            autoScroll: true,
            anchor: '100%',
            height: 150,
            title: 'Aktuelle VDR-Aufnahme',
            style: 'margin: 0 5px 0 0 ',
            tools: [{id: 'refresh'}],
            html: '* Filme 1<br>* Filme 1<br>* Filme 1<br>* Filme 1<br>* Filme 1<br>* Filme 1<br>'
          }
        ]
      },
      {
        columnWidth: .5,
        baseCls:'x-plain',
        items: [
          {
            frame: true,
            autoScroll: true,
            height: 150,
            anchor: '100%',
            title: 'System',
            tools: [{id: 'refresh'}],
            style: 'margin: 0 0 5px 0 ',
            html: '<b>Shutdown</b>: S3 (Disabled USB-Wakeup)<br> <b>CPU</b>: 10% - <b>RAM</b>: 1024MB (169 MG frei)<br><b>Soundausgabe</b>: HDMI + Analog'
          },
          {
            frame: true,
            autoScroll: true,
            anchor: '100%',
            height: 150,
            title: 'Nächste Timer',
            tools: [{id: 'refresh'}],
            style: 'margin: 0 0 0 0 ',
            html: '* 20:15 Film abc<br>* 20:15 Film abc<br>* 20:15 Film abc<br>* 20:15 Film abc<br>* 20:15 Film abc<br>* 20:15 Film abc<br>* 20:15 Film abc<br>* 20:15 Film abc<br>* 20:15 Film abc<br>* 20:15 Film abc<br>* 20:15 Film abc<br>* 20:15 Film abc<br>* 20:15 Film abc<br>'
          }
        ]
      }

    ];

    YaVDR.Component.Dashboard.superclass.initComponent.call(this);
  }
});

YaVDR.registerComponent(YaVDR.Component.Dashboard);
