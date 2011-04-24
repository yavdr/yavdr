Ext.namespace('Ext.ux.dd');

Ext.ux.dd.GridDragDropRowOrder = Ext.extend(Ext.util.Observable, {
  copy : false,

  scrollable : false,

  constructor : function(config) {
    if (config)
      Ext.apply(this, config);

    this.addEvents({
      beforerowmove : true,
      afterrowmove : true,
      beforerowcopy : true,
      afterrowcopy : true
    });

    Ext.ux.dd.GridDragDropRowOrder.superclass.constructor.call(this);
  },

  init : function(grid) {
    this.grid = grid;
    grid.enableDragDrop = true;

    grid.on({
      render : {
        fn : this.onGridRender,
        scope : this,
        single : true
      }
    });
  },

  onGridRender : function(grid) {
    var self = this;

    this.target = new Ext.dd.DropTarget(grid.getEl(), {
      ddGroup : grid.ddGroup || 'GridDD',
      grid : grid,
      gridDropTarget : this,

      notifyDrop : function(dd, e, data) {
        // Remove drag lines. The 'if' condition prevents null error when drop
        // occurs without dragging out of the selection area
        if (this.currentRowEl) {
          this.currentRowEl.removeClass('grid-row-insert-below');
          this.currentRowEl.removeClass('grid-row-insert-between');
          this.currentRowEl.removeClass('grid-row-insert-above');
        }

        // determine the row
        var t = Ext.lib.Event.getTarget(e);
        var rindex = data.grid.getView().findRowIndex(t); // this.grid.getView().findRowIndex(t);

        if (this.grid == data.grid) {
          if (rindex === false || rindex == data.rowIndex) {
            return false;
          }
          // fire the before move/copy event
          if (this.gridDropTarget.fireEvent(self.copy ? 'beforerowcopy'
              : 'beforerowmove', this.gridDropTarget, data.rowIndex, rindex,
              data.selections, 123) === false) {
            return false;
          }

          // update the store
          var ds = this.grid.getStore();

          // Changes for multiselction by Spirit
          var selections = new Array();
          var keys = ds.data.keys;
          for (var key in keys) {
            for (var i = 0; i < data.selections.length; i++) {
              if (keys[key] == data.selections[i].id) {
                // Exit to prevent drop of selected records on itself.
                if (rindex == key) {
                  return false;
                }
                selections.push(data.selections[i]);
              }
            }
          }

          // fix rowindex based on before/after move
          if (rindex > data.rowIndex && this.rowPosition < 0) {
            rindex--;
          }
          if (rindex < data.rowIndex && this.rowPosition > 0) {
            rindex++;
          }

          // fix rowindex for multiselection
          if (rindex > data.rowIndex && data.selections.length > 1) {
            rindex = rindex - (data.selections.length - 1);
          }

          // we tried to move this node before the next sibling, we stay in
          // place
          if (rindex == data.rowIndex) {
            return false;
          }

          // fire the before move/copy event
          /*
           * dupe - does it belong here or above??? if
           * (this.gridDropTarget.fireEvent(self.copy ? 'beforerowcopy' :
           * 'beforerowmove', this.gridDropTarget, data.rowIndex, rindex,
           * data.selections, 123) === false) { return false; }
           */

          if (!self.copy) {
            for (var i = 0; i < data.selections.length; i++) {
              ds.remove(ds.getById(data.selections[i].id));
            }
          }

          for (var i = selections.length - 1; i >= 0; i--) {
            var insertIndex = rindex;
            ds.insert(insertIndex, selections[i]);
          }

          ds.resortChannelNo();
          // re-select the row(s)
          var sm = this.grid.getSelectionModel();
          if (sm) {
            sm.selectRecords(data.selections);
          }

        } else {
          // handle d&d between grids
          if (dd.rindex === false) {
            return false;
          }
          // fire the before move/copy event
          if (this.gridDropTarget.fireEvent(self.copy ? 'beforerowcopy'
              : 'beforerowmove', this.gridDropTarget, data.rowIndex, rindex,
              data.selections, 123) === false) {
            return false;
          }

          var selections = data.grid.getSelectionModel().getSelections();
          var position = dd.rindex + (dd.mode == "below" ? 1 : 0);
          Ext.each(selections, function(record) {
            this.grid.store.insert(position, record);

            data.grid.store.remove(record);
            position++;
          }, this);
          if (this.grid.store.resortChannelNo) this.grid.store.resortChannelNo();
          else data.grid.store.resortChannelNo();
        }

        // fire the after move/copy event
        this.gridDropTarget.fireEvent(self.copy ? 'afterrowcopy'
            : 'afterrowmove', this.gridDropTarget, data.rowIndex, rindex,
            data.selections);
        return true;
      },

      notifyOver : function(dd, e, data) {
        var t = Ext.lib.Event.getTarget(e);
        var rindex = this.grid.getView().findRowIndex(t);

        // Similar to the code in notifyDrop. Filters for selected rows and
        // quits function if any one row matches the current selected row.
        var ds = this.grid.getStore();
        var keys = ds.data.keys;
        for (var key in keys) {
          for (var i = 0; i < data.selections.length; i++) {
            if (keys[key] == data.selections[i].id) {
              if (rindex == key) {
                if (this.currentRowEl) {
                  this.currentRowEl.removeClass('grid-row-insert-below');
                  this.currentRowEl.removeClass('grid-row-insert-between');
                  this.currentRowEl.removeClass('grid-row-insert-above');
                }
                return this.dropNotAllowed;
              }
            }
          }
        }

        // If on first row, remove upper line. Prevents negative index error as
        // a result of rindex going negative.
        if (rindex < 0) { // || rindex === false ) {
          if (this.currentRowEl)
            this.currentRowEl.removeClass('grid-row-insert-above');
          return this.dropNotAllowed;
        }

        try {
          // d&d to empty board
          if (rindex === false && data.grid != this.grid) {
            dd.mode = "below";
            dd.rindex = this.grid.getStore().data.length - 1;
            return this.dropAllowed;
          } else {
            var currentRow = this.grid.getView().getRow(rindex);
            // Find position of row relative to page (adjusting for grid's
            // scroll
            // position)
            var resolvedRow = new Ext.Element(currentRow).getY()
                - this.grid.getView().scroller.dom.scrollTop;
            var rowHeight = currentRow.offsetHeight;

            // Cursor relative to a row. -ve value implies cursor is above the
            // row's middle and +ve value implues cursor is below the row's
            // middle.
            this.rowPosition = e.getPageY() - resolvedRow - (rowHeight / 2);

            // Clear drag line.
            if (this.currentRowEl) {
              this.currentRowEl.removeClass('grid-row-insert-below');
              this.currentRowEl.removeClass('grid-row-insert-between');
              this.currentRowEl.removeClass('grid-row-insert-above');
            }
            dd.mode = null;
            dd.rindex = rindex;
            if (this.rowPosition > 0) {
              // If the pointer is on the bottom half of the row.
              this.currentRowEl = new Ext.Element(currentRow);
              var count = this.grid.getStore().data.length;
              if (count - 1 == rindex)
                this.currentRowEl.addClass('grid-row-insert-below');
              else
                this.currentRowEl.addClass('grid-row-insert-between');

              dd.mode = "below";
            } else {
              // If the pointer is on the top half of the row.
              if (rindex - 1 >= 0) {
                var previousRow = this.grid.getView().getRow(rindex - 1);
                dd.rindex--;
                this.currentRowEl = new Ext.Element(previousRow);
                this.currentRowEl.addClass('grid-row-insert-between');
                dd.mode = "below";
              } else {
                // If the pointer is on the top half of the first row.
                this.currentRowEl.addClass('grid-row-insert-above');
                dd.mode = "above";
              }
            }
          }

        } catch (err) {
          if (console) console.warn(err);
          rindex = false;
        }
        return (rindex === false) ? this.dropNotAllowed : this.dropAllowed;
      },

      notifyOut : function(dd, e, data) {
        // Remove drag lines when pointer leaves the gridView.
        if (this.currentRowEl) {
          this.currentRowEl.removeClass('grid-row-insert-above');
          this.currentRowEl.removeClass('grid-row-insert-between');
          this.currentRowEl.removeClass('grid-row-insert-below');
        }
      }
    });

    if (this.targetCfg) {
      Ext.apply(this.target, this.targetCfg);
    }

    if (this.scrollable) {
      Ext.dd.ScrollManager.register(grid.getView().getEditorParent());
      grid.on({
        beforedestroy : this.onBeforeDestroy,
        scope : this,
        single : true
      });
    }
  },

  getTarget : function() {
    return this.target;
  },

  getGrid : function() {
    return this.grid;
  },

  getCopy : function() {
    return this.copy ? true : false;
  },

  setCopy : function(b) {
    this.copy = b ? true : false;
  },

  onBeforeDestroy : function(grid) {
    // if we previously registered with the scroll manager, unregister
    // it (if we don't it will lead to problems in IE)
    Ext.dd.ScrollManager.unregister(grid.getView().getEditorParent());
  }
});

YaVDR.ChannelsReader = function(meta, recordType) {
  meta = meta || {};
  YaVDR.ChannelsReader.superclass.constructor.call(this, meta, recordType
      || meta.fields);
};

YaVDR.ChannelGroupEdit = Ext.extend(Ext.Window, {
  record : false,
  width : 400,
  title : _('Name of the group'),
  border : false,

  initComponent : function() {
    this.form = new Ext.FormPanel({
      padding : 10,
      defaults : {
        anchor : "100%",
        xtype : 'textfield'
      },
      items : [
        {
          itemId : 'name',
          fieldLabel : _('Name'),
          name : 'name',
          value : this.record.data.name,
          allowBlank: false
        },
        {
          itemId : 'number',
          fieldLabel : _('Next channel no.'),
          name : 'number',
          value : this.record.data.number
        }
      ],
      fbar : [
        {
          text : _('Save'),
          scope : this,
          handler : function() {
            var oldChannelNumber = this.record.get('number');
            this.record.beginEdit();
            this.record.set('name', this.form.getComponent('name').getValue());
            this.record.set('number', this.form.getComponent('number').getValue());
            this.record.endEdit();
            if (oldChannelNumber != this.record.get('number')) {
              this.store.resortChannelNo();
            }
            this.destroy();
          }
        }
      ]
    });

    this.items = this.form;
    YaVDR.ChannelGroupEdit.superclass.initComponent.call(this);
  }
});

Ext.extend(YaVDR.ChannelsReader, Ext.data.DataReader, {
  getSuccess : function() {
    return true;
  },
  read : function(response) {
    var doc = response.responseText;
    if (!doc) {
      throw {
        message : _("ChannelsReader.read: Channels not available")
      };
    }
    return this.readRecords(doc);
  },
  readRecords : function(doc) {
    var success = true;
    var lines = doc.split("\n");
    var records = new Array();
    var channel = 1;
    for (var i = 0; i < lines.length; ++i) {
      var line = lines[i];
      if (line == '')
        continue;
      var columns = line.split(':')

      var names, position, data = {}
      // is a channel
      if (columns[0] == '') {

        if (columns[1].slice(0, 1) == '@') {
          position = columns[1].indexOf(" ");
          data.number = parseInt(columns[1].substr(1, position));
          channel = data.number;
          data.name = columns[1].substr(position + 1);
        } else {
          data.name = columns[1];
        }

        data.type = 1;
      } else {
        names = columns[0].split(';');
        data.type = 0;
        data.name = names[0];
        data.provider = names[1];
        data.frequency = columns[1];
        data.parameters = columns[2];
        data.source = columns[3];
        data.srate = columns[4];
        data.vpid = columns[5];
        data.apid = columns[6];
        data.tpid = columns[7];
        data.caid = columns[8];
        data.sid = columns[9];
        data.nid = columns[10];
        data.tid = columns[11];
        data.rid = columns[12];
        data.channel_orig = channel;
        data.channel = channel++;
      }
      records.push(new Ext.data.Record(data));
    }

    return {
      success : success,
      records : records,
      totalRecords : records.length
    };
  }
});

YaVDR.ChannelsStore = Ext.extend(Ext.data.Store, {
  constructor : function(config) {
    YaVDR.ChannelsStore.superclass.constructor.call(this, Ext.apply(config, {
      url : '/admin/get_file_content?file=/var/lib/vdr/channels.conf&puretext=true',
      reader : new YaVDR.ChannelsReader(config)
    }));
  },
  generateConfig : function() {
    var channels = new Array();
    this.each(function(record) {
      var data = record.data;
      if (data.type == 1) {
        if (data.number > 0) {
          channels.push(":@" + data.number + ' ' + data.name)
        } else {
          channels.push(":" + data.name)
        }
      } else {
        channels.push(data.name + ';' + data.provider + ':'
            + data.frequency + ':' + data.parameters + ':'
            + data.source + ':' + data.srate + ':' + data.vpid + ':'
            + data.apid + ':' + data.tpid + ':' + data.caid + ':'
            + data.sid + ':' + data.nid + ':' + data.tid + ':'
            + data.rid)
      }

    }, this);
    return channels.join("\n");
  },
  save : function() {
    Ext.Ajax.request({
      url : '/admin/set_file_content?file=/var/lib/vdr/channels.conf',
      params : {
        content : this.generateConfig()
      },
      success : function() {
        alert(_('Channels saved'));
      }
    });
  },
  resortChannelNo: function() {
    var _self = this;
    window.setTimeout(function () {
      _self._asyncResortChannelNo();
    }, 100);
  },
  _asyncResortChannelNo: function() {
    var channel = 1;
    this.each(function(record) {
      var data = record.data;
      if (data.type == 1) {
        if (data.number > channel) {
          channel = data.number;
        }
      } else {
        record.beginEdit();
        record.set('channel', channel);
        record.endEdit();
        record.commit(true);
        //if (record.get("channel") == channel++) {
        //record.reject();
        //record.modified = null;
        //}

        channel++;
      }
    }, this);
  }
});

YaVDR.ChannelConfWindow = Ext.extend(Ext.Window, {
  value : "",
  title : _('generated channels.conf'),
  modal : true,
  maximizable : true,
  width : 400,
  height : 300,
  layout : 'fit',
  initComponent : function() {
    this.tbar = [
      {
        text : _('Send to PasteBin'),
        icon : '/static/images/icons/clipboard-paste-document-text.png',
        scope : this,
        handler : this.sendPasteBin
      }
    ];
    this.content = new Ext.form.TextArea({
      autoScroll : true,
      border : false,
      style : 'font-family: monospace; white-space: pre; font-size: 12px;',
      value : this.value
    });
    this.items = [ this.content ];
    YaVDR.ChannelConfWindow.superclass.initComponent.call(this);
  },
  sendPasteBin : function() {
    YaVDR.PasteBin.paste(this.content.getValue(), "channels.conf");
  }
});

YaVDR.Component.Settings.VdrChannels = Ext.extend(YaVDR.Component, {
    itemId : 'settings-vdr-channels',
    layout : 'border',
    bodyStyle: 'background-color: #FFF',
    height: 500,
    initComponent : function() {
      this.initStore();
      this.initGrid();
      this.initClipBoardStore();
      this.initClipBoardGrid();

      this.items = [ new YaVDR.Component.Header({
        region : 'north',
        html : _('Settings')
      }), {
        region : 'west',
        title: _('Channelpedia'),
        collapsible: true,   // make collapsible
        floatable: true,
        split: true,
        collapseMode: 'mini',
        width: 300,
        collapsed: true,
        id: 'west-region-container',
        layout: 'fit',
        qtip: _('Channelpedia'),
        xtype: 'treepanel',
        useArrows: true,
        autoScroll: true,
        animate: false,
        //enableDD: true,
        containerScroll: true,
        border: true,
        // auto create TreeLoader
        dataUrl: '/admin/channelpedia',

        root: {
            nodeType: 'async',
            text: 'Channelpedia',
            draggable: false,
            id: 'root',
            leaf: false
        }

      }, new YaVDR.Component.Item({
        region : 'center',
        title : _('Channels'),
        layout : 'fit',
        items : this.grid
      }), new YaVDR.Component.Item({
        region : 'east',
        title : _('Clipboard'),
        layout : 'fit',
        width : 250,
        split : true,
        items : this.clipBoardGrid
      })

      ];
      YaVDR.Component.Settings.VdrChannels.superclass.initComponent
          .call(this);
      this.on('render', this.reloadStore, this);

    },
    initClipBoardStore : function() {
      this.clipBoardStore = new Ext.data.Store();
    },
    initClipBoardGrid : function() {
      this.clipBoardGrid = new Ext.grid.GridPanel({
        store : this.clipBoardStore,
        ddGroup : 'channels',
        bodyStyle : 'border: 1px solid #D0D0D0;',
        columns : [
          {
            header : _("Name"),
            renderer : this.renderName,
            align : 'left',
            width : 160,
            dataIndex : 'name',
            sortable : false
          }
        ],
        // sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
        plugins : new Ext.ux.dd.GridDragDropRowOrder({
          copy : false,
          scrollable : true
        }),
        viewConfig : {
          forceFit : true
        }
      });

      this.clipBoardGrid.on('rowcontextmenu', function(grid, index, e) {
        e.stopEvent();
        var record = this.clipBoardStore.getAt(index);
        if (!grid.getSelectionModel().isIdSelected(record.id)
            || !grid.getSelectionModel().hasSelection()) {
          grid.getSelectionModel().selectRow(index);
        }

        var contextMenu = new Ext.menu.Menu({
          items : [
            {
              text : _('Move into channels.conf'),
              icon : '/icons/silk/cart_remove.png',
              menu : [
                {
                  text : _('On top'),
                  icon : '/icons/fugue/node-insert-previous.png',
                  scope : this,
                  handler : function() {
                    var selections = this.clipBoardGrid
                        .getSelectionModel().getSelections();
                    var position = 0;
                    Ext.each(selections, function(record) {
                      this.store.insert(position, record);
                      this.clipBoardStore.remove(record);
                      position++;
                    }, this);
                  }
                },
                {
                  text : _('At bottom'),
                  icon : '/icons/fugue/node-insert-next.png',
                  scope : this,
                  handler : function() {
                    var selections = this.clipBoardGrid
                        .getSelectionModel().getSelections();
                    var position = this.store.getCount();
                    Ext.each(selections, function(record) {
                      this.store.insert(position, record);
                      this.clipBoardStore.remove(record);
                      position++;
                    }, this);
                  }
                }
              ]
            },
            {
              text : this.clipBoardGrid.getSelectionModel()
                  .getSelections().length > 1 ? _('Delete selection')
                  : sprintf(_('Delete "%s"'), record.data.name),
              icon : '/icons/silk/delete.png',
              scope : this,
              handler : function() {
                this.clipBoardStore.remove(this.clipBoardGrid
                    .getSelectionModel().getSelections());
              }
            }
          ]
        });
        // show
        contextMenu.showAt(e.getXY());
      }, this);
    },
    reloadStore : function() {
      this.store.reload();
      this.clipBoardStore.removeAll();
    },
    saveStore : function() {
      this.store.save();
    },
    newGroup : function() {
      // Show a dialog using config options:
      Ext.Msg.prompt(_('Add new group'),
          _('Please enter the group name:'), function(btn, text) {
        if (btn == 'ok' && text != '') {
          this.store.insert(0, new Ext.data.Record({
            type : 1,
            name : text
          }))
        }
      }, this);
    },
    renderName : function(value, metaData, record, rowIndex, colIndex, store) {
      var name;
      if (record.data.type == 1) {
        name = "<b>" + record.data.name + "</b>";
        if (record.data.number > 0)
          name = name + " (" + record.data.number + ")"
      } else {
        name = value;
      }
      return name;
    },
    renderChannel : function(value, metaData, record, rowIndex, colIndex, store) {
      if (record.data.type == 1) {
        return "";
      } else {
        if (value == record.data.channel_orig)
          return value;
        else
          return value + " (" + record.data.channel_orig + ")";
      }
    },
    displayConf : function() {
      (new YaVDR.ChannelConfWindow({
        value : this.store.generateConfig()
      })).show();
    },
    initGrid : function() {
      this.grid = new Ext.grid.GridPanel({
        ddGroup : 'channels',
        store : this.store,
        // enableDragDrop: true,
        tbar : [
          {
            text : _('Add new group'),
            icon : '/icons/silk/folder_add.png',
            scope : this,
            handler : this.newGroup
          },
          '-',
          {
            text : _("Display channels.conf"),
            scope : this,
            icon : '/icons/silk/page.png',
            handler : this.displayConf
          },
          '-',
          {
            text : _('Save'),
            icon: '/static/images/icons/save.png',
            scope : this,
            handler : this.saveStore
          },
          {
            text : _('Reload'),
            icon: '/static/images/icons/refresh.png',
            scope : this,
            handler : this.reloadStore
          }
        ],
        bodyStyle : 'border: 1px solid #D0D0D0;',
        columns : [
          {
            header : _("Channel"),
            renderer: this.renderChannel,
            align : 'right',
            width : 60,
            dataIndex : 'channel',
            sortable : false
          },
          {
            header : _("Name"),
            renderer : this.renderName,
            align : 'left',
            width : 160,
            dataIndex : 'name',
            sortable : false
          },
          {
            header : _("Provider"),
            id:"provider",
            align : 'left',
            width : 100,
            dataIndex : 'provider',
            sortable : false
          }
        ],
        plugins : new Ext.ux.dd.GridDragDropRowOrder({
          copy : false,
          scrollable : true
        }),
        autoExpandColumn: "provider",
        view: new Ext.ux.grid.BufferView({
          // custom row height
          //rowHeight: 34,
          // render rows as they come into viewable area.
          scrollDelay: false
          //forceFit : true
        }),

        loadMask : _("loading channels")
      });

      this.grid.on('rowcontextmenu', function(grid, index, e) {
        e.stopEvent();
        var record = this.store.getAt(index);
        if (!grid.getSelectionModel().isIdSelected(record.id)
            || !grid.getSelectionModel().hasSelection()) {
          grid.getSelectionModel().selectRow(index);
        }
        var contextMenu = new Ext.menu.Menu(
        {
          items : [
            {
              text : _('Move into clipboard'),
              icon : '/icons/silk/cart_put.png',
              menu : [
                {
                  text : _('On top'),
                  icon : '/icons/fugue/node-insert-previous.png',
                  scope : this,
                  handler : function() {
                    var selections = this.grid.getSelectionModel().getSelections();
                    this.store.remove(selections);
                    this.clipBoardStore.insert(0, selections);
                  }
                },
                {
                  text : _('At bottom'),
                  icon : '/icons/fugue/node-insert-next.png',
                  scope : this,
                  handler : function() {
                    var records = this.grid.getSelectionModel().getSelections();
                    Ext.each(records, function(record) {
                      this.store.remove(record);
                      this.clipBoardStore.insert(this.clipBoardStore.getCount(), record);
                    }, this);
                  }
                }
              ]
            },
            {
              text : _('Insert clipboard'),
              icon : '/icons/silk/cart_remove.png',
              disabled : (this.clipBoardStore.getCount() == 0),
              menu : [
                {
                  text : sprintf(_('Above %s'), record.data.name),
                  scope : this,
                  icon : '/icons/fugue/node-insert-previous.png',
                  handler : function() {
                    var position = index;
                    this.clipBoardStore.each(function(record) {
                      this.store.insert(position, record);
                      position++;
                    }, this);
                    this.clipBoardStore.removeAll();
                  }
                },
                {
                  text : sprintf(_('Below %s'), record.data.name),
                  icon : '/icons/fugue/node-insert-next.png',
                  scope : this,
                  handler : function() {
                    var position = index + 1;
                    this.clipBoardStore.each(function(record) {
                      this.store.insert(position, record);
                      position++;
                    }, this);
                    this.clipBoardStore.removeAll();
                  }
                }
              ]
            },
            {
              text : _('Edit'),
              icon : '/icons/silk/pencil.png',
              scope : this,
              disabled : (record.data.type != 1 || this.grid.getSelectionModel().getSelections().length > 1),
              handler : function() {
                (new YaVDR.ChannelGroupEdit({
                  scope : this,
                  record : record,
                  store: this.store
                })).show()
              }
            },
            {
              text : this.grid.getSelectionModel().getSelections().length > 1 ? _('Delete selection') : sprintf(_('Delete "%s"'), record.data.name),
              icon : '/icons/silk/delete.png',
              scope : this,
              handler : function() {
                this.store.remove(this.grid.getSelectionModel().getSelections());
              }
            }
          ]
        });
        // show
        contextMenu.showAt(e.getXY());
      }, this);
    },
    initStore : function() {
      this.store = new YaVDR.ChannelsStore({
        autoLoad: false
      });
    }
  });
YaVDR.registerComponent(YaVDR.Component.Settings.VdrChannels);
