YaVDR.DiagnoseItem =  Ext.extend(Ext.Panel, {
  file: null,
  cmd: null,
  autoScroll: true,
  style: 'font-family: monospace; white-space: pre; font-size: 12px;',
  initComponent: function() {
    this.tbar = [
      {
        text: 'Aktualisieren',
        icon: '/static/images/icons/refresh.png',
        scope: this,
        handler: this.reload
      },
      {
        text: 'Ans Ende springen',
        icon: '/static/images/icons/arrow_down.png',
        scope: this,
        handler: this.jumpDown
      },
      {
        text: 'Sende an PasteBin',
        icon: '/static/images/icons/clipboard-paste-document-text.png',
        scope: this,
        handler: this.sendPasteBin
      }
    ];
    
    this.autoLoad = this.cmd + '?' + (this.cmd === 'get_file_content' ? 'file' : 'command') + '=' + this.file

    YaVDR.DiagnoseItem.superclass.initComponent.call(this);
  },
  reload: function () {
    this.getUpdater().refresh();
  },
  jumpDown: function() {
    this.body.dom.scrollTop = this.body.dom.scrollHeight - this.body.dom.offsetHeight;
  },
  sendPasteBin: function() {
    alert('todo');
  }
});

YaVDR.Diagnose = Ext.extend(YaVDR.BaseTabPanel, {
  initComponent: function() {
    YaVDR.Diagnose.superclass.initComponent.call(this);
  }
});

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "diagnose"})
             .addGroupPanelTab({
                    section: "system_info",
                    locale_prefix: 'diagnose.section',
                    layout: 'fit',
                    items: function() {
                      return new YaVDR.Diagnose({
                        items: [
                          new YaVDR.DiagnoseItem({
                            title: getLL("diagnose.section.system_info.top"),
                            cmd: 'get_shell_response',
                            file: 'top'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: getLL("diagnose.section.system_info.ifconfig"),
                            cmd: 'get_shell_response',
                            file: 'ifconfig'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: getLL("diagnose.section.system_info.df"),
                            cmd: 'get_shell_response',
                            file: 'df'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: getLL("diagnose.section.system_info.dmesg"),
                            cmd: 'get_shell_response',
                            file: 'dmesg'
                          })
                        ]
                      }) 
                    }
                    

                  })
             .addGroupPanelTab({
                    section: "system_logs",
                    locale_prefix: 'diagnose.section',
                    layout: 'fit',
                    items: function() {
                      return new YaVDR.Diagnose({
                        items: [
                          new YaVDR.DiagnoseItem({
                            title: '/var/log/messages',
                            cmd: 'get_file_content',
                            file: '/var/log/messages'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: '/var/log/user.log',
                            cmd: 'get_file_content',
                            file: '/var/log/user.log'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: '/var/log/syslog',
                            cmd: 'get_file_content',
                            file: '/var/log/syslog'
                          })
                        ]
                      }) 
                    }
               
              })
             .addGroupPanelTab({
                    section: "xbmc",
                    locale_prefix: 'diagnose.section',
                    layout: 'fit',
                    items: function() {
                      return new YaVDR.Diagnose({
                        items: [
                          new YaVDR.DiagnoseItem({
                            title: '/var/lib/vdr/.xbmc/temp/xbmc.log',
                            cmd: 'get_file_content',
                            file: '/var/lib/vdr/.xbmc/temp/xbmc.log'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: '/var/lib/vdr/.xbmc/temp/xbmc.old.log',
                            cmd: 'get_file_content',
                            file: '/var/lib/vdr/.xbmc/temp/xbmc.old.log'
                          })
                        ]
                      }) 
                    }
                    
                  })
             .addGroupPanelTab({
                    section: "lirc",
                    locale_prefix: 'diagnose.section',
                    layout: 'fit',
                    items: function() {
                      return new YaVDR.Diagnose({
                        items: [
                          new YaVDR.DiagnoseItem({
                            title: 'LIRC Hardware Configuration',
                            cmd: 'get_file_content',
                            file: '/etc/lirc/hardware.conf'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: 'LIRCD Configuration',
                            cmd: 'get_file_content',
                            file: '/etc/lirc/lircd.conf'
                          })
                        ]
                      }) 
                    }
                })
             .addGroupPanelTab({
                    section: "vdr",
                    locale_prefix: 'diagnose.section',
                    layout: 'fit',
                    items: function() {
                      return new YaVDR.Diagnose({
                        items: [
                          new YaVDR.DiagnoseItem({
                            title: 'VDR Setup',
                            cmd: 'get_file_content',
                            file: '/etc/vdr/setup.conf'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: 'VDR Fernbedienung',
                            cmd: 'get_file_content',
                            file: '/etc/vdr/remote.conf'
                          })
                        ]
                      }) 
                    }
               
            })
             .addGroupPanelTab({
                    section: "xorg",
                    locale_prefix: 'diagnose.section',
                    layout: 'fit',
                    items: function() {
                      return new YaVDR.Diagnose({
                        items: [
                          new YaVDR.DiagnoseItem({
                            title: 'X-Server Configuration (only if NVIDIA VDPAU present)',
                            cmd: 'get_file_content',
                            file: '/etc/X11/xorg.conf.yavdr'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: 'XSession.vdr',
                            cmd: 'get_file_content',
                            file: '/etc/X11/Xsession.vdr'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: 'X-Server Logfile',
                            cmd: 'get_file_content',
                            file: '/var/log/Xorg.1.log'
                          })
                        ]
                      }) 
                    }
               
            })
             .addGroupPanelTab({
                    section: "sound",
                    locale_prefix: 'diagnose.section',
                    layout: 'fit',
                    items: function() {
                      return new YaVDR.Diagnose({
                        items: [
                          new YaVDR.DiagnoseItem({
                            title: 'Alsa Device List',
                            cmd: 'get_shell_response',
                            file: 'aplay'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: 'Alsa Custom Sound Configuration',
                            cmd: 'get_file_content',
                            file: '/etc/asound.conf'
                          })
                        ]
                      }) 
                    }
            })
             .addGroupPanelTab({
                    section: "packages",
                    locale_prefix: 'diagnose.section',
                    layout: 'fit',
                    items: function() {
                      return new YaVDR.Diagnose({
                        items: [
                          new YaVDR.DiagnoseItem({
                            title: 'Installed packages (VDR, VDR-Plugins, VDR-Addons, XBMC, yavdr)',
                            cmd: 'get_shell_response',
                            file: 'dpkg'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: 'Apt history of recently installed packages',
                            cmd: 'get_file_content',
                            file: '/var/log/apt/history.log'
                          })
                        ]
                      }) 
                    }
            })
             .addGroupPanelTab({
                    section: "yavdr",
                    locale_prefix: 'diagnose.section',
                    layout: 'fit',
                    items: function() {
                      return new YaVDR.Diagnose({
                        items: [
                          new YaVDR.DiagnoseItem({
                            title: 'yaVDR DB',
                            cmd: 'get_file_content',
                            file: '/var/lib/yavdrdb.hdf'
                          }),
                          new YaVDR.DiagnoseItem({
                            title: 'Logfile Webserver',
                            cmd: 'get_file_content',
                            file: '/var/log/tntnet/tntnet.log'
                          })
                        ]
                      }) 
                    }
               
            });
});