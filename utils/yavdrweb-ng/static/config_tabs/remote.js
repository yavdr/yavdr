
function getRemoteForm() {
    var panel = new Ext.TabPanel({
        activeTab: 0,
        plain: false,
        border: false,
        items: [{
            title: 'LIRC',
            items: getLircForm()
        },{
            title: 'Inputlirc',
            items: getInputlircForm()
        },{
            title: 'IRServer',
            html: "not implemented yet"
        },{
            title: 'Hilfe',
            html: 'Hilfe!'
        }]
    });
    return panel;
}