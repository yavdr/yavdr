var locale_it = {
    meta_lang: {
        local : 'Italiano',
        int : 'Italian',
        key : 'it'
    },
    menutabs: {
        vdr : {
            title: 'VDR',
            tabtip: 'Configurazione delle impostazioni base di VDR',
            content: 'Benvenuto nell\'interfaccia Web di yaVDR!'
        },
        system : {
            title: 'Sistema',
            tabtip: 'Configurazione delle impostazioni base del sistema',
            content: 'Benvenuto nell\'interfaccia Web di yaVDR!'
        },
        demos : {
            title: 'Dimostrazioni',
            tabtip: 'Prove di concetto e dimostrazioni di possibili nuove funzioni che si possono usare a scopo dimostrativo',
            content: 'Prove di concetto e dimostrazioni di possibili nuove funzioni che si possono usare a scopo dimostrativo'
        },
        development : {
            title: 'Sviluppo',
            tabtip: 'Nuovi funzioni che sono in costruzione, non usarle. Ancora non funzionano correttamente.',
            content: 'Nuovi funzioni che sono in costruzione, non usarle. Ancora non funzionano correttamente.'
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
    remote: {
        menutab: {
            title : 'Telecomando',
            tabtip :'Impostazioni telecomando (ricevitore telecomando)',
            panel_title : 'Ricevitore telecomando'
        },
        help: 'Al momento esistono 3 diversi server LIRC compatibili che sono supportati. Scegli quello che meglio si adatta al tuo dispositivo. <br /><h1>LIRC</h1><br /><br /> Supporta la maggior parte dei dispositivi. Informati sul driver supportato. Devi scegliere il driver corretto del dispositivo e nel caso si tratti di una porta seriale autocostruita (Attric, autocostruito e dispositivi simili) devi scegliere la porta seriale corretta.<br /><br /><h1>Ingresso LIRC</h1><br /><br /> Alcune schede DVB includono un ricevitore del telecomando. Alcuni di essi, come i dispositivi USB vengono resi disponibili come i cosiddetti dispositivi di ingresso. Devi soltanto scegliere il dispositivo corretto dal menu a tendina.<br /><br /><h1>Irserver</h1><br /><br /> Alcuni HTPC (per esempio OrigenAE) hanno incluso un ricevitore del telecomando, che può essere usato solo con irserver. Devi soltanto abilitarlo e salvare le impostazioni.'
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Opzioni LIRC (ricevitore telecomando)',
            panel_title : 'Ricevitore telecomando (LIRC)'
        },
        help: 'Quando premi il pulsante "Salva" il programma si riavvierà per notificare a VDR le modifiche del ricevitore del telecomando LIRC. Se non hai assegnato i tasti al tuo telecomando (tramite remote.conf) VDR mostrerà una schermata passo a passo nell\'OSD per l\'apprendimento dei tasti del telecomando. Questa schermata sparirà dopo pochi secondi se nessun tasto del telecomando viene premuto. Puoi riavviare la schermata semplicemente premendo ancora il tasto "Salva".',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'Driver LIRC'
             },
             emptytext: 'Seleziona il ricevitore del telecomando...',
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
            json_decode : 'Impossibile decodificare la lista JSON del ricevitore'
        }
    },
    inputlirc: {
        menutab: {
            title : 'Ingresso LIRC',
            tabtip :'Impostazioni ingresso LIRC (ricevitore telecomando)',
            panel_title : 'Ricevitore telecomando (LIRC)'
        },
        help: 'Seleziona il ricevitore del telecomando dal precedente elenco. Quando premi il pulsante "Salva" il programma si riavvierà per notificare a VDR le modifiche del ricevitore di ingresso LIRC.',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'Driver ingresso LIRC'
             },
             emptytext: 'Seleziona il ricevitore del telecomando...',
             label: 'Ricevitore'
        },
        submit: {
            waitmsg : 'Impostazioni ricevitore di ingresso LIRC salvate.',    
            success : 'Impostazioni salvate con successo.',
            failure : 'Impossibile salvare le impostazioni. Riprova ancora.'
        },
        error: {
            json_decode : 'Impossibile decodificare la lista JSON del ricevitore'
        }
    },
    irserver: {
        menutab: {
            title : 'IRServer',
            tabtip :'Impostazioni IRServer (ricevitore telecomando)',
            panel_title : 'Ricevitore telecomando (IRServer)'
        },
        help: 'Quando premi il pulsante "Salva" il programma si riavvierà per notificare a VDR le modifiche del ricevitore IRServer.',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'Driver IRDriver'
             },
             emptytext: 'Seleziona il ricevitore del telecomando...',
             label: 'Ricevitore'
        },
        submit: {
            waitmsg : 'Impostazioni ricevitore IRServer salvate.',    
            success : 'Impostazioni salvate con successo.',
            failure : 'Impossibile salvare le impostazioni. Riprova ancora.'
        },
        error: {
            json_decode : 'Impossibile decodificare la lista JSON del ricevitore'
        }
    },
    channels: {
        menutab: {
            title : 'Lista canali (SVDRP)',
            tabtip : 'Impostazioni canali (gestisci e ordina i canali radio e TV)',
            panel_title : '' //unused
        },
        grid_header : {
            cid : 'N°',
            cname : 'Nome canale',
            cprovider : 'Emittente',
            cstr : 'Stringa completa canale',
            frequency : 'Frequenza',
            modulation : 'Modulazione',
            source : 'Sorgente',
            symbolrate : 'SymbolRate',
            vpid : 'PID Video',
            apid : 'PID Audio',
            tpid : 'PID Teletext',
            caid : 'CAID',
            sid : 'SID',
            nid : 'NID',
            tid : 'TID',
            rid : 'RID',
            _group : 'Gruppo',
            _friendly_transp: 'Transponder',
            _friendly_lang: 'Lingua',
            _friendly_type: 'TV/Radio',
            _friendly_scrambled : 'FTA/Codificato',
            _friendly_dvb_sat_band : "Banda passante"
        },
        grid_title : 'Lista canali (tutti i canali radio e TV)'
    },
    frontend: {
        menutab: {
            title : 'Interfaccia VDR',
            tabtip : 'Alterna tra le interfacce Xine e Xineliboutput',
            panel_title : 'Interfaccia VDR'
        },
        label: 'Seleziona interfaccia',
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
            tabtip : 'Seleziona tra i diversi metodi di spegnimento',
            panel_title : 'Spegnimento VDR'
        },
        label: 'Seleziona spegnimento',
        button_label:  'Applica impostazioni spegnimento',
        submit: {
            waitmsg : 'Impostazioni spegnimento aggiornate.',    
            success : 'Riuscito.',
            failure : 'Fallito.'
        },
        items: {
            s3: 'sospensione in RAM',
            s3unavailable: 'sospensione in RAM (non disponibile)',
            s4: 'sospensione su DISCO',
            s4unavailable: 'sospensione su DISCO (non disponibile)',
            s5: 'spegnimento',
            reboot: 'riavvio kernel con "PowerOff"'
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
                waitmsg: 'Il segnale per riavviare il computer è stato inviato.',
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
            help: 'Definisci le condivisioni NFS di altri sistemi che dovrebbero essere usate da VDR. Le directory devono avere questa struttura "server:/percorso". Il pulsante "Applica" salva effettivamente le modifiche nella configurazione locale ma queste vengono applicate SOLO al prossimo riavvio di VDR.',
            menutab: {
                title : 'NFS',
                tabtip : 'Gestione mount NFS e condivisioni'
            },
            labels: {
                newDir : 'Directory remota',
                add : 'Aggiungi',
                edit : 'Modifica',
                _delete: 'Elimina',
                apply: 'Applica'
            }
        },
        samba: {
            menutab: {
                title : 'Samba',
                tabtip : 'Mantieni condivisioni Samba'
            }
    },
        submit: {
            waitmsg : 'Modifica configurazione',    
            success : 'Tabella di mount salvata con successo.',
            failure : 'Impossibile salvare le modifiche della tabella di mount.'
        }
    },
    nvidia: {
        menutab: {
            title : 'NVIDIA',
            tabtip : 'Gestione impostazioni NVIDIA',
            panel_title : 'Configurazione NVIDIA'
        },
        overscan_slider_label : 'Compensazione Overscan NVIDIA',
        button_label : 'Applica valore',
        submit: {
            waitmsg : 'Impostazioni overscan NVIDIA aggiornate.',
            success : 'Riuscito.',
            failure : 'Fallito.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Interfaccia Web',
            tabtip : 'Configura l\'aspetto dell\'interfaccia web',
            panel_title : 'Impostazioni interfaccia Web'
        },
        label: 'Seleziona lingua interfaccia web',
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
                refresh_tooltip: 'Fai click su questo pulsante per aggiornare il contenuto del pannello.',
                jumpdown: 'Vai alla fine del pannello',
                jumpdown_tooltip: 'Fai click su questo pulsante per andare alla fine del pannello.'
            }
        },
        section : {
            system_info: {
                menutab: {
                    title : 'Informazioni di sistema',
                    tabtip : 'Stato rete, utilizzo sistema, utilizzo file system, kernel'
                },
                ifconfig : 'Stato rete',
                top: 'Utilizzo sistema',
                dmesg: 'Kernel',
                df: 'Utilizzo file System'
            },
            system_logs: {
                menutab: {
                    title :'File log di sistema',
                    tabtip : 'File log di sistema importanti'
                }
            },
            xbmc: {
                menutab: {
                    title : 'Blocchi XBMC',
                    tabtip : 'Trova il motivo dei blocchi di XBMC o altri problemi di XBMC'
                }
            },
            lirc: {
                menutab: {
                    title : 'Configurazione LIRC',
                    tabtip : 'Verifica la configurazione attuale di LIRC'
                }
            },
            vdr: {
                menutab: {
                    title : 'Configurazione VDR',
                    tabtip : 'Verifica la configurazione attuale di VDR'
                }
            },
            xorg: {
                menutab: {
                    title : 'Server X',
                    tabtip : 'Verifica la configurazione attuale del server X'
                }
            },
            sound: {
                menutab: {
                    title : 'Suono (ALSA)',
                    tabtip : 'Risolvi i problemi sonori (uscita digitale / analogica)'
                }
            },
            packages: {
                menutab: {
                    title : 'Pacchetti',
                    tabtip : 'Verifica quali pacchetti e versioni dei pacchetti sono installati'
                }
            },
            yavdr: {
                menutab: {
                    title : 'Strumenti yaVDR',
                    tabtip : 'Risolvi i problemi con l\'interfaccia web di yaVDR (database e server web)'
                }
            }
        }
    },
    packages: {
        menutab: {
            title : 'Pacchetti yaVDR',
            tabtip : 'Verifica quali pacchetti e quali versioni sono installati',
            panel_title : 'Pacchetti yaVDR'
        }
    },
    timeout: {
        menutab: {
            title : 'Ritardo GRUB',
            tabtip : 'Imposta ritardo GRUB',
            panel_title : 'Ritardo GRUB'
        },
        label: 'Scegli ritardo',
        button_label:  'Applica impostazioni di ritardo',
        submit: {
            waitmsg : 'Impostazioni di ritardo aggiornate.',    
            success : 'Riuscito.',
            failure : 'Fallito.'
        },
        maxText: 'Il valore massimo di questo campo è {0}',
        minText: 'Il valore minimo di questo campo è {0}'
    },
    x11: {
        menutab: {
            title : 'Impostazioni Video',
            tabtip : 'Impostazioni Video',
            panel_title : 'Impostazioni Video'
        },
        graphtft: {
            label: 'GraphTFT',
            boxlabel: 'attivato'
        },
       deinterlacer_hd: {
            label: 'Deinterlacciamento Xine-HD (predefinito bob)'
        },
       deinterlacer_sd: {
            label: 'Deinterlacciamento Xine-SD (predefinito temporal)'
        },
        button_label:  'Applica impostazioni video',
        submit: {
            waitmsg : 'Impostazioni video aggiornate.',    
            success : 'Riuscito.',
            failure : 'Fallito.'
        },
        dualhead: {
            label: 'Doppio schermo',
            boxlabel: 'attivato',
            boxlabelunavailable: 'disabilitato (< 2 schermi trovati)',
            switch_label: 'cambia schermo del frontend di VDR'
        },
        primary: 'primario',
        secondary: 'secondario',
        modeline: 'modeline attuale',
        device: 'dispositivo',
        resolution: 'risoluzione',
        select_res: 'seleziona risoluzione',
        enabled: 'abilitato',
        disabled: 'disabilitato'
    },
    sound: {
        menutab: {
            title : 'Impostazioni Audio',
            tabtip : 'Impostazioni Audio',
            panel_title : 'Impostazioni Audio'
        },
        button_label:  'Applica impostazioni audio',
        submit: {
            waitmsg : 'Impostazioni audio aggiornate.',    
            success : 'Riuscito.',
            failure : 'Fallito.'
        },
        label: 'Impostazioni audio'
    },
    lifeguard: {
        help: 'Controlla se VDR dovrebbe spegnere il sistema. Esegue diverse verifiche specificate dall\'utente quando VDR vuole spegnere il sistema. Lo spegnimento viene posticipato se ognuna delle verifiche indicano che esistono altri processi che non dovrebbero essere interrotti. Abilita qui i processi che VDR non dovrebbe interrompere. Nessuna selezione corrisponde a disattivare soccorso VDR',
        menutab: {
            title : 'Soccorso VDR',
            tabtip : 'Impostazioni soccorso',
            panel_title : 'Impostazioni soccorso'
        },
        button_label:  'Applica impostazioni soccorso',
        submit: {
            waitmsg : 'Impostazioni soccorso aggiornate.',    
            success : 'Riuscito.',
            failure : 'Fallito.'
        },
        label: 'Impostazioni soccorso VDR'
    }
};
