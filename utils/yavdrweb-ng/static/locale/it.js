var locale_it = {
    meta_lang: {
        local : 'Italiano',
        int : 'Italian',
        key : 'it'
    },
    menutabs: {
        basics : {
            title: 'Base',
            tabtip: 'Configurazione delle impostazioni base come il ricevitore del telecomando, la lista canali, etc.',
            content: 'Benvenuto nell\'interfaccia Web di yaVDR!'
        },
        diagnose : {
            title: 'Diagnostica',
            tabtip: 'Rimani informato sullo stato del sistema e i problemi rilevati',
            content: 'Accesso ai file di log importanti e ai file di configurazione'
        }
    },
    standardform: {
        button: {
            save: 'Salva'
        },
        messagebox_caption: {
            message: 'Messaggio',
            error: 'Errore',
            wait: 'Attendere prego...'
        }
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Opzioni LIRC (ricevitore telecomando)',
            panel_title : 'Ricevitore telecomando (LIRC)'
        },
        help: 'Quando premi il pulsante "Salva" VDR si riavvierà per notificare a VDR le modifiche del ricevitore del telecomando LIRC. Se non hai assegnato i tasti al tuo telecomando (tramite remote.conf) VDR mostrerà una schermata passo a passo nell\'OSD per l\'apprendimento dei tasti del telecomando. Questa schermata sparirà dopo pochi secondi se nessun tasto del telecomando viene premuto. Puoi riavviare la schermata semplicemente premendo ancora il tasto "Salva".',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'Driver LIRC'
             },
             emptytext: 'Seleziona un ricevitore per il telecomando...',
             label: 'Ricevitore'
        },
        serial_radiogroup: {
             label : 'Interfaccia seriale',
             boxlabel_none : 'nessuna'
        },
        submit: {
            waitmsg : 'Impostazioni ricevitore LIRC salvate.',    
            success : 'Impostazioni salvate con successo.',
            failure : 'Impossibile salvare le impostazioni. Riprova ancora.'
        },
        error: {
            json_decode : 'Impossibile decodificare la lista ricevitore JSON'
        }
    },
    channels: {
        menutab: {
            title : 'Lista canali',
            tabtip : 'Impostazioni canali (gestisci e ordina i canali radio e TV)',
            panel_title : '' //unused
        },
        grid_header : { 
            cid : 'N°',
            cname : 'Nome canale',
            cstr : 'Stringa completa canale'
        },
        grid_title : 'Lista canali (tutti i canali radio e TV)' 
    },
    frontend: {
        menutab: {
            title : 'Interfaccia VDR',
            tabtip : 'Alterna tra l\'interfaccia Xine e Xineliboutput',
            panel_title : 'Interfaccia VDR'
        },
        label: 'Scegli interfaccia',
        button_label:  'Applica impostazioni interfaccia',
        submit: {
            waitmsg : 'Impostazioni interfaccia aggiornate.',    
            success : 'Riuscito.',
            failure : 'Fallito.'
        }
    },
    shutdown: {
        menutab: {
            title : 'Spegnimento',
            tabtip : 'Scegli tra diversi metodi di spegnimento',
            panel_title : 'Spegnimento VDR'
        },
        label: 'Scegli spegnimento',
        button_label:  'Applica impostazioni spegnimento',
        submit: {
            waitmsg : 'Impostazioni spegnimento aggiornate.',    
            success : 'Riuscito.',
            failure : 'Fallito.'
        },
        items: {
        	s3: 'sospensione in RAM',
        	s4: 'sospensione su DISCO',
        	s5: 'spegnimento',
        	reboot: 'riavvio kernel "PowerOff"'
        }
    },
    upload: {
        menutab: {
            title : 'Carica configurazione VDR',
            tabtip : 'Carica una configurazione di VDR esistente',
            panel_title : 'Carica configurazione VDR (la versione caricata sovrascrive la versione esistente)'
        },
        button_label: 'Carica',
        submit: {
            waitmsg : 'Caricamento file.',    
            success : 'File caricato con successo.',
            failure : 'Si è verificato un errore durante il caricamento.'
        }
    },
    system: {
        menutab: {
            title : 'Sistema',
            tabtip : 'Riavvia VDR o l\'intero sistema',
            panel_title : 'Comandi di sistema'
        },
        vdr_restart : {
            label: 'Riavvia VDR',
            submit: {
                waitmsg: 'Il segnale di riavvio VDR è stato inviato.',
                success: 'VDR si riavvierà adesso.',
                failure: 'Problemi con l\'invio del segnale. Riprova.'
            }
        },
        kill_xbmc : {
            label: 'Termina XBMC (se bloccato)',
            submit: {
                waitmsg: 'Il segnale per fermare XBMC è stato inviato.',
                success: 'XBMC è stato fermato.',
                failure: 'Problemi con l\'invio del segnale. Riprova.'
            }
        },        
        system_restart : {
            label: 'Riavvia il computer (Attenzione: nessuna richiesta di conferma!)',
            submit: {
                waitmsg: 'Il segnale per riavviare è stato inviato.',
                success: 'Il computer si riavvierà adesso.',
                failure: 'Problemi con l\'invio del segnale. Riprova.'
            }
        }
    },
    network: {
        menutab: {
            title : 'Rete',
            tabtip : 'Gestione rete',
            panel_title : 'Configurazione rete'
        },
        nfs: {
            menutab: {
                title : 'NFS',
                tabtip : 'Gestione mount e condivisioni',
                panel_title : 'Configurazione NFS'
            },
            labels: {
                newDir : 'Directory remota',
                add : 'Aggiungi',
                edit : 'Modifica',
                _delete: 'Elimina',
                apply: 'Applica'
            }
        }
    },
    nvidia: {
        menutab: {
            title : 'Nvidia',
            tabtip : 'Gestione impostazioni Nvidia',
            panel_title : 'Configurazione Nvidia'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Interfaccia Web',
            tabtip : 'Configura l\'aspetto dell\'interfaccia web',
            panel_title : 'Impostazioni interfaccia Web'
        },
        label: 'Scegli lingua interfaccia web',
        button_label:  'Applica impostazioni lingua',
        submit: {
            waitmsg : 'Impostazioni lingua interfaccia web aggiornate.',
            success : 'Riuscito. Premi F5 per ricaricare l\'interfaccia web con le impostazioni della nuova lingua.',
            failure : 'Fallito.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Aggiorna',
                refresh_tooltip: 'Fai click su questo pulsante per aggiornare il contenuto di questo pannello.',
                jumpdown: 'Vai alla fine del pannello',
                jumpdown_tooltip: 'Fai click su questo pulsante per andare alla fine di questo pannello.'
            }
        },
        section : {
            system_info: {
                title : 'Informazioni sistema', 
                description : 'Stato rete, carico sistema, utilizzo file system, kernel',
                ifconfig : 'Stato rete',
                top: 'Carico sistema',
                dmesg: 'Kernel',
                df: 'Utilizzo file System'
            },
            system_logs: {
                title :'File log di sistema',
                description : 'File log di sistema importanti'
            },
            xbmc: {
                title : 'Blocchi XBMC',
                description : 'Trova il motivo dei blocchi di XBMC o altri problemi di XBMC'
            },
            lirc: {
                title : 'Configurazione LIRC',
                description : 'Verifica la configurazione attuale di LIRC'
            },
            vdr: {
                title : 'Configurazione VDR',
                description : 'Verifica la configurazione attuale di VDR'
            },
            xorg: {
                title : 'Server X',
                description : 'Verifica la configurazione attuale di X'
            },
            sound: {
                title : 'Suono (ALSA)',
                description : 'Risolvi i problemi sonori (uscita digitale / analogica)'
            },
            packages: {
                title : 'Pacchetti',
                description : 'Verifica quali pacchetti e versioni dei pacchetti sono installati'
            },
            yavdr: {
                title : 'Strumenti yaVDR',
                description : 'Risolvi i problemi con l\'interfaccia web di yaVDR (database e server web)'
            }
        }
    }
};