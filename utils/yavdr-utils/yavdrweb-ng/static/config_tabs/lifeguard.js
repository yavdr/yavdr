YaVDR.VdrLiveGuard = Ext.extend(YaVDR.BaseFormPanel, {
  initComponent: function() {
    
    this.items = [
      {
        itemId: 'lifeguard',
        xtype: 'checkboxgroup',
        fieldLabel: getLL("lifeguard.label"),
        columns: 2,
        defaults: {
          name: 'values'
        },
        items: [
          {
            itemId: 'aptitude',
            boxLabel: 'Aptitude',
            inputValue: 'aptitude'
          }, {
            itemId: 'ssh',
            boxLabel: 'SSH',
            inputValue: 'ssh'
          }, {
            itemId: 'nfs',
            boxLabel: 'NFS',
            inputValue: 'nfs'
          }, {
            itemId: 'ftp',
            boxLabel: 'FTP',
            inputValue: 'ftp'
          }, {
            itemId: 'smb',
            boxLabel: 'SMB',
            inputValue: 'smb'
          }, {
            itemId: 'xbmc',
            boxLabel: 'XBMC',
            inputValue: 'xbmc'
          }
        ]
      },
      {
        html : '<br/><br/>' + getLL("lifeguard.help")
      }
    ]
    
    this.tbar = [
      {
        scope: this,
        itemId: 'save',
        text: 'Auswahl übernehmen',
        icon: '/static/images/icons/save.png',
        handler: this.saveSelection
      }
    ];
    
    YaVDR.VdrFrontend.superclass.initComponent.call(this);
    
    this.on('render', this.loadSelection, this);
  },
  saveSelection: function() {
    this.getForm().submit({
      url : 'set_signal?signal=change-lifeguard',
      timeout : 30, // wait 30 seconds before telling it failed
      waitMsg : getLL("lifeguard.submit.waitmsg"),
      waitTitle : getLL("standardform.messagebox_caption.wait"),
      scope : this,
      success : function(form, action) {
        Ext.MessageBox.alert(
          getLL("standardform.messagebox_caption.message"),
          getLL("lifeguard.submit.success"));
      },
      failure : function(form, action) {
        Ext.MessageBox.alert(
          getLL("standardform.messagebox_caption.error"),
          getLL("lifeguard.submit.failure"));
      }
    })
  },
  loadSelection: function() {
    YaVDR.getHdfTree('vdr.plugin.lifeguard.enable', function(data) {
      if(typeof data != null) {
        if(typeof data.enable == "object") {
          for (var i = 0; i < data.enable.length; i++) {
            this.getComponent('lifeguard').items.each(function(item) {
              if(item.getItemId() == data.enable[i]) {
                item.setValue(true);
              }
            });
          }
        }
      } else {
        this.getComponent('lifeguard').items.each(function(field) {
          field.setValue(true);
        });
      }
    }, this);
  }
});



function getVDRLifeguardForm() {
	var myform = new Ext.FormPanel( {
		frame : false,
		plain : false,
		border : false,
		bodyStyle : 'padding:5px 5px 0',
		labelWidth : 150,
		// defaultType: 'textfield',
		buttonAlign : 'left',
		items : [ {
			id : 'lifeguard_radio_group',
			name : 'lifeguard',
			xtype : 'checkboxgroup',
			fieldLabel : getLL("lifeguard.label"),
			columns : 2,
			items : [ {
				id : 'lifeguard_aptitude',
				boxLabel : 'Aptitude',
				name : 'values',
				inputValue : 'aptitude'
			}, {
				id : 'lifeguard_ssh',
				boxLabel : 'SSH',
				name : 'values',
				inputValue : 'ssh'
			}, {
				id : 'lifeguard_nfs',
				boxLabel : 'NFS',
				name : 'values',
				inputValue : 'nfs'
			}, {
				id : 'lifeguard_ftp',
				boxLabel : 'FTP',
				name : 'values',
				inputValue : 'ftp'
			}, {
				id : 'lifeguard_smb',
				boxLabel : 'SMB',
				name : 'values',
				inputValue : 'smb'
			}, {
				id : 'lifeguard_xbmc',
				boxLabel : 'XBMC',
				name : 'values',
				inputValue : 'xbmc'
			} ]
		}, {
			html : '<br/><br/>' + getLL("lifeguard.help")
		} ]
	});

	var submit = myform.addButton( {
		text : getLL("lifeguard.button_label"),
		icon : '/ext/resources/images/default/grid/refresh.gif',
		// formBind: true,
		// scope: this,
		handler : function() {
			myform.form.submit( {
				url : 'set_signal?signal=change-lifeguard',
				timeout : 30, // wait 30 seconds before telling it failed
				waitMsg : getLL("lifeguard.submit.waitmsg"),
				waitTitle : getLL("standardform.messagebox_caption.wait"),
				scope : this,
				success : function(form, action) {
					Ext.MessageBox.alert(
							getLL("standardform.messagebox_caption.message"),
							getLL("lifeguard.submit.success"));
				},
				failure : function(form, action) {
					Ext.MessageBox.alert(
							getLL("standardform.messagebox_caption.error"),
							getLL("lifeguard.submit.failure"));
				}
			})
		}
	});

	Ext.Ajax.request( {
		url : 'get_hdf_value?hdftree=vdr.plugin.lifeguard.enable',
		timeout : 3000,
		method : 'GET',
		scope : myform,
		success : function(xhr) {
			// alert('Response is "' + xhr.responseText + '"');
			try {
				var currentLifeguard = Ext.util.JSON.decode(xhr.responseText);
				if (currentLifeguard != null) {
					if (typeof(currentLifeguard.enable) == "object") {
						for (var i = 0; i < currentLifeguard.enable.length; i++) {
							var rButton = Ext
									.getCmp('lifeguard_' + currentLifeguard.enable[i]);
							if (rButton)
								rButton.setValue(true);
							else
								Ext.MessageBox.alert(
										getLL("standardform.messagebox_caption.error"),
										'Could not find lifeguard radiobutton group.');
						}
					}
				} else {
					var group = this.getComponent('lifeguard_radio_group');
					Ext.each(group.items.items, function(e, index) {
						e.setValue(true);
					});
				}
			} catch (err) {
				Ext.MessageBox.alert(
						getLL("standardform.messagebox_caption.error"),
						'Could not recognize current lifeguard setting.');
			}
	
		}
	});

	return myform;
}

Ext.onReady(function() {
	YaVDRMenuManager.addGroupPanelSection( {
		section : "vdr"
	}).addGroupPanelTab( {
		section : "lifeguard",
                layout: 'fit',
		//items: getVDRLifeguardForm
                items : function() { return new YaVDR.VdrLiveGuard }
	});
});