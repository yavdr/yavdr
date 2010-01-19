var locale = {
    menutabs: {
        basics : {
            title: 'Basics',
            tabtip: 'Configuration of basic settings like remote control receiver, channel list, etc.',
            content: 'Welcome to the yaVDR Web Frontend!'
        }
    },
    standardform: {
        button: {
            save: 'Save'
        },
        messagebox_caption: {
            message: 'Message',
            error: 'Error',
            wait: 'Please wait...'           
        }
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Lirc-Settings (Remote Control Receiver)',
            panel_title : 'Remote Control Receiver (LIRC)'
        },        
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'LIRC Driver'
             },
             emptytext: 'Please choose a receiver for your remote control...',
             label: 'Receiver'
        },
        serial_radiogroup: {
             label : 'Serial Interface',
             boxlabel_none : 'none'
        },
        submit: {
            waitmsg : 'LIRC receiver settings are being saved.',    
            success : 'The settings were successfully saved.',
            failure : 'Error on saving settings. Please try again.'
        },
        error: {
            json_decode : 'Could not decode JSON receiver list'
        }
    },
    channels: {
        menutab: {
            title : 'Channel List',
            tabtip : 'Channel settings (Maintain and sort radio and TV channels)',
            panel_title : '' //unused
        },
        grid_header : { 
            cid : 'No',
            cname : 'Channel Name',
            cstr : 'Complete Channel String'
        },
        grid_title : 'Channel List (all radio and TV channels)' 
    },
    frontend: {
        menutab: {
            title : 'VDR Frontend',
            tabtip : 'Switch between xine and xineliboutput frontend',
            panel_title : 'VDR Frontend'
        },
        label: 'Choose frontend',
        button_label:  'Apply frontend settings',
        submit: {
            waitmsg : 'Frontend settings are updated.',    
            success : 'Success.',
            failure : 'Failure.'
        }        
    },
    upload: {
        menutab: {
            title : 'VDR Config Upload',
            tabtip : 'Upload your existing VDR configuration',
            panel_title : 'VDR Config Upload (the uploaded version overwrites the existing version)'
        },
        button_label: 'Upload',
        submit: {
            waitmsg : 'File is being uploaded.',    
            success : 'File was uploaded successfully.',
            failure : 'There was a problem during file upload.'
        }
    },
    system: {
        menutab: {
            title : 'System',
            tabtip : 'Restart VDR or the whole system',
            panel_title : 'System Commands'
        },
        vdr_restart : {
            label: 'Restart VDR service',
            submit: {
                waitmsg: 'The signal to restart VDR is being sent.',
                success: 'VDR will restart now.',
                failure: 'Problem on sending signal. Please try again.'
            }
        },
        system_restart : {
            label: 'Reboot machine (Caution: Not asking for confirmation!)',
            submit: {
                waitmsg: 'The signal to reboot is being sent.',
                success: 'The machine will reboot now.',
                failure: 'Problem on sending signal. Please try again.'
            }
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Refresh',
                refresh_tooltip: 'Please click this button to refresh the content of this panel.',
                jumpdown: 'Jump to end of panel',
                jumpdown_tooltip: 'Please click this button to jump to the end of this panel.'
            }
        }
    }

};
