function LLForLangExists(paramArray, lang){
    var success = true;
    var validstring = "locale_" + lang; //global language var
    for (var z=0; z < paramArray.length; z++){
        validstring += "." + paramArray[z];
        var check = eval("typeof " + validstring + ";");
        if (check == "undefined"){
            success = false;
            break;
        }
    }
    return success;
}

function getLL( param ){
    var paramArray = param.split(".");
    if (!LLForLangExists(paramArray, yavdrwebGlobalInfo.lang)){
        label = "[undefined:"+param+"]";
        //check if we can find the label in English language labels
        if ( yavdrwebGlobalInfo.lang != "en" && LLForLangExists(paramArray, "en")){
            label = "[untranslated] " + eval( "locale_en." + param );
            //alert("Hint for translators: locale." + param + " was not yet translated to language "+lang+".");
        }
        else{
            alert("locale_en." + param + " does not exist in English language labels.");
        }
    }
    else {
        label = eval( "locale_" + yavdrwebGlobalInfo.lang + "." + param );
    }
    return label;
}

var locale_en = {
    meta_lang: {
        local : 'Englisch',
        int : 'English',
        key : 'en'
    },
    menutabs: {
        vdr : {
            title: 'Your VDR',
            tabtip: 'Configuration of basic settings of your VDR',
            content: 'Welcome to the yaVDR Web Frontend!'
        },
        system : {
            title: 'System',
            tabtip: 'Configuration of basic settings of the system',
            content: 'Welcome to the yaVDR Web Frontend!'
        },
        diagnose : {
            title: 'Diagnostics',
            tabtip: 'Stay informed about your system status, track problems',
            content: 'Access to important log files and configuration files'
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
        help: 'When you press the button "Save" VDR will be restarted to notify VDR about the changed LIRC receiver settings. If you haven\'t assigned the buttons of your remote control (via remote.conf) VDR will offer you a step-by-step dialog on the OSD to learn the button assignment of your remote control from you. This dialog disappears after a few seconds if no key on the remote control was pressed. You can restart the dialog by simply pressing "Save" again.',
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
    shutdown: {
        menutab: {
            title : 'Shutdown',
            tabtip : 'Switch between different shutdown methods',
            panel_title : 'VDR Shutdown'
        },
        label: 'Choose shutdown',
        button_label:  'Apply shutdown settings',
        submit: {
            waitmsg : 'Shutdown settings are updated.',    
            success : 'Success.',
            failure : 'Failure.'
        },
        items: {
            s3: 'suspend to RAM',
            s4: 'suspend to DISK',
            s5: 'shutdown',
            reboot: 'reboot "PowerOff" kernel'
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
            label: 'Restart VDR backend',
            submit: {
                waitmsg: 'The signal to restart VDR is being sent.',
                success: 'VDR will restart now.',
                failure: 'Problem on sending signal. Please try again.'
            }
        },
        kill_xbmc : {
            label: 'Kill XBMC (if frozen)',
            submit: {
                waitmsg: 'The signal to stop XBMC is being sent.',
                success: 'XBMC was stopped.',
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
    network: {
        menutab: {
            title : 'Network',
            tabtip : 'Maintain network',
            panel_title : 'Network configuration'
        },
        nfs: {
            help: 'Define the nfs shares from other hosts that should be used from VDR. Directories have to be qualified like "server:/path". The button "Apply" actually submits the changes to your local configuration. VDR uses them after next restart.',
            menutab: {
                title : 'NFS',
                tabtip : 'Maintain NFS mounts and shares'
            },
            labels: {
                newDir : 'Remote directory',
                add : 'Add',
                edit : 'Edit',
                _delete: 'Remove',
                apply: 'Apply'
            }
        },
	samba: {
	    menutab: {
		title : 'Samba',
		tabtip : 'Maintain samba shares'
	    }
	}
    },
    nvidia: {
        menutab: {
            title : 'Nvidia',
            tabtip : 'Maintain Nvidia settings',
            panel_title : 'Nvidia configuration'
        },
        overscan_slider_label : 'Nvidia Overscan compensation',
        button_label : 'Apply value',
        submit: {
            waitmsg : 'Nvidia overscan settings are updated.',
            success : 'Success.',
            failure : 'Failure.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Web Frontend',
            tabtip : 'Configure the appearance of the web frontend',
            panel_title : 'Web Frontend Settings'
        },
        label: 'Choose web frontend language',
        button_label:  'Apply language settings',
        submit: {
            waitmsg : 'Web frontend language settings are updated.',
            success : 'Success. Please press F5 to reload the web frontend with the new language settings.',
            failure : 'Failure.'
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
        },
        section : {
            system_info: {
                title : 'System information', 
                description : 'Network status, system load, file system usage, kernel',
                ifconfig : 'Network Status',
                top: 'System Load',
                dmesg: 'Kernel',
                df: 'File System Usage'
            },
            system_logs: {
                title :'System Logfiles',
                description : 'Important system Logfiles'
            },
            xbmc: {
                title : 'XBMC log files',
                description : 'Find the reason for XBMC crashes or other XBMC problems'
            },
            lirc: {
                title : 'LIRC Configuration',
                description : 'Check the current configuration of LIRC'
            },
            vdr: {
                title : 'VDR Configuration',
                description : 'Check the current configuration of VDR'
            },
            xorg: {
                title : 'X-Server',
                description : 'Check the current configuration of X'
            },
            sound: {
                title : 'Sound (ALSA)',
                description : 'Troubleshoot sound problems (digital / analog output)'
            },
            packages: {
                title : 'Packages',
                description : 'Check which packages and package versions are installed'
            },
            yavdr: {
                title : 'yaVDR-Utils',
                description : 'Troubleshoot problems with the yaVDR web frontend (database + web server)'
            }
        }
    },
    timeout: {
        menutab: {
            title : 'GRUB timeout',
            tabtip : 'Set GRUB timeout',
            panel_title : 'GRUB timeout'
        },
        label: 'Choose timeout',
        button_label:  'Apply timeout settings',
        submit: {
            waitmsg : 'Timeout settings are updated.',    
            success : 'Success.',
            failure : 'Failure.'
        },
        maxText: 'The maximum value for this field is {0}',
        minText: 'The minimum value for this field is {0}'
    },
    x11: {
        menutab: {
            title : 'display settings',
            tabtip : 'display settings',
            panel_title : 'display settings'
        },
        graphtft: {
            label: 'graphTFT',
            boxlabel: 'activated'
        },
        button_label:  'Apply display settings',
        submit: {
            waitmsg : 'Display settings are updated.',    
            success : 'Success.',
            failure : 'Failure.'
        }
    }
};