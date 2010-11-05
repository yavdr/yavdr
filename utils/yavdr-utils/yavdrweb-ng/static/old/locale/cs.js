var locale_cs = {
    meta_lang: {
        local : 'Česky',
        int : 'Czech',
        key : 'cs'
    },
    menutabs: {
        vdr : {
            title: 'VDR',
            tabtip: 'Základní nastavení VDR',
            content: 'Vítejte v yaVDR web rozhraní!'
        },
        system : {
            title: 'Systém',
            tabtip: 'Základní nastavení systému',
            content: 'Vítejte v yaVDR web rozhraní!'
        },
        demos : {
            title: 'Dema',
            tabtip: 'Koncepty a demo nových vlastností. Možno použít pro testovací účely',
            content: 'Koncepty a demo nových vlastností. Možno použít pro testovací účely'
        },
        development : {
            title: 'Vývoj',
            tabtip: 'Nové vlastnosti ve vývoji, nepoužívejte. Nejsou ještě zcela funkční.',
            content: 'Nové vlastnosti ve vývoji, nepoužívejte. Nejsou ještě zcela funkční.'
        },
        diagnose : {
            title: 'Diagnostika',
            tabtip: 'Informace o stavu systému, sledování problémů',
            content: 'Přístup k důležitým log souborům a konfiguraci'
        }
    },
    standardform: {
        button: {
            save: 'Uložit'
        },
        messagebox_caption: {
            message: 'Zpráva',
            error: 'Chyba',
            wait: 'Prosím čekejte...'
        }
    },
    remote: {
        menutab: {
            title : 'Dálkové ovládání',
            tabtip :'Nastavení dálkového ovládání (přijímače)',
            panel_title : 'Přijímač dálkového ovládání'
        },
        help: 'Jsou dostupné a podporované 3 různé LIRC servery. Vyberte ten, který odpovídá Vaší konfiguraci. <br /><h1>LIRC</h1><br /><br /> Podporuje většinu zařízení. Vyberte správný ovladač pro vaše zařízení, pokud používáte zařízení připojené na sériový port (Attric, doma postavené a ostatní podobná) je nutné ho správně zadat.<br /><br /><h1>InputLirc</h1><br /><br /> Některé DVB karty obsahují přijímač dálkového ovládání. Většina z nich stejně jako některá USB zařízení se chovají jako tzv. inputdevices. <br /><br /><h1>Irserver</h1><br /><br /> Některé HTPC boxy (např. OrigenAE) obsahují přijímač dálkového ovládání, který je podporován pouze pomocí irserver.' },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Nastavení LIRC pro přijímač',
            panel_title : 'Přijímač DO (LIRC)'
        },
        help: 'Stisknutím tlačítka "Uložit" bude služba VDR restartována s novým nastavením. Pokud nejsou nastavana přiřazení tlačítek (remote.conf), spustí se průvodce nastavením. Pokud nedojde k žádnému vstupu, průvodce se po chvíli ukončí.',
        combobox: {
             tooltip : {
                 driver: 'Ovladač',
                 lirc_driver: 'LIRC ovladač'
             },
             emptytext: 'Vyberte prosím přijímač dálkového ovládání...',
             label: 'Přijímač'
        },
        serial_radiogroup: {
             label : 'Sériové rozhraní',
             boxlabel_none : 'nic'
        },
        submit: {
            waitmsg : 'Nastavení přijímače LIRC se ukládá.',    
            success : 'Nastavení přijímače LIRC uloženo.',
            failure : 'Chyba při ukládání nastavení přijímače LIRC. Zkuste znovu.'
        },
        error: {
            json_decode : 'Nelze dekódovat JSON seznam přijímačů'
        }
    },
    inputlirc: {
        menutab: {
            title : 'Inputlirc',
            tabtip :'Nastavení Inputlirc pro přijímač',
            panel_title : 'Přijímač DO (inputlirc)'
        },
        help: 'Vyberte přijímač DO ze seznamu. Stisknutím tlačítka "Uložit" bude služba VDR restartována s novým nastavením.',
        combobox: {
             tooltip : {
                 driver: 'Ovladač',
                 lirc_driver: 'Inputlirc ovladač'
             },
             emptytext: 'Vyberte prosím přijímač dálkového ovládání....',
             label: 'Přijímač'
        },
        submit: {
            waitmsg : 'Nastavení příjímače Inputlirc se ukládá.',    
            success : 'Nastavení příjímače Inputlirc uloženo.',
            failure : 'Nastavení uloženo.'
        },
        error: {
            json_decode : 'Nelze dekódovat JSON seznam přijímačů'
        }
    },
    irserver: {
        menutab: {
            title : 'IRServer',
            tabtip :'Nastavení IRserveru pro přijímač',
            panel_title : 'Přijímač DO (IRServer)'
        },
        help: 'Stisknutím tlačítka "Uložit" bude služba VDR restartována s novým nastavením.',
        combobox: {
             tooltip : {
                 driver: 'Ovladač',
                 lirc_driver: 'IRDriver ovladač'
             },
             emptytext: 'Vyberte prosím přijímač dálkového ovládání...',
             label: 'Přijímač'
        },
        submit: {
            waitmsg : 'Nastavení přijímače IRServeru se ukládá.',    
            success : 'Nastavení přijímače IRServeru uloženo',
            failure : 'Chyba při ukládání nastavení přijímače IRServer. Zkuste znovu.'
        },
        error: {
            json_decode : 'Nelze dekódovat JSON seznam přijímačů'
        }
    },
    channels: {
        menutab: {
            title : 'Seznam stanic',
            tabtip : 'Nastavení stanic (správa a řazení radio a TV stanic)',
            panel_title : '' //unused
        },
        grid_header : { 
            _num : 'č',
            name : 'Stanice',
            provider : 'Poskytovatel',
            str : 'Název stanice',
            frequency : 'Frekvence',
            modulation : 'Modulace',
            source : 'Zdroj',
            symbolrate : 'Symbolrate',
            vpid : 'VPID',
            apid : 'APID',
            tpid : 'TPID',
            caid : 'CAID',
            sid : 'SID',
            nid : 'NID',
            tid : 'TID',
            rid : 'RID',
            _group : 'Gruppe',
            _friendly_transp: 'Transponder',
            _friendly_lang: 'Jazyk',
            _friendly_type: 'TV/Radio',
            _friendly_scrambled : 'FTA/kódováno',
            _friendly_dvb_sat_band : "Špatný signál"
        },
        grid_title : 'Seznam stanic (všechny radio a televizní)'
    },
    frontend: {
        menutab: {
            title : 'VDR rozhraní (frontend)',
            tabtip : 'Přepnutí mezi nastavením výstupu pomocí xine, nebo xineliboutput',
            panel_title : 'VDR Rozhraní'
        },
        label: 'Zvolte rozhraní',
        button_label:  'Použít nastaveni rozhraní',
        submit: {
            waitmsg : 'Nastaveni rozhraní aktualizováno.',
            success : 'Úspěch.',
            failure : 'Chyba.'
        }
    },
    shutdown: {
        menutab: {
            title : 'Vypnout',
            tabtip : 'Výběr způsobu vypnutí systému',
            panel_title : 'Vypínání VDR'
        },
        label: 'Zvolte způsob vypnutí',
        button_label:  'Použít nastavení vypínání',
        submit: {
            waitmsg : 'Nastavení vypínání aktualizováno',  
            success : 'Úspěch.',
            failure : 'Chyba.'
        },
        items: {
            s3: 'uspat do paměti (s2ram)',
            s3unavailable: 'uspání do paměti nepodporováno',
            s4: 'uspat na disk (s2disk)',
            s4unavailable: 'uspání na disk nepodporováno',
            s5: 'vypnutí',
            reboot: 'reboot "PowerOff" kernel'
        }
    },
    upload: {
        menutab: {
            title : 'Editor konfigurace VDR',
            tabtip : 'Editace konfiguračních souborů, nahrání uložených souborů',
            panel_title : 'Editace konfiguračních souborů'
        },
        button_label: 'Nahrát soubor',
        submit: {
            waitmsg : 'Soubor se nahrává.',    
            success : 'Soubor nahrán.',
            failure : 'Chyba při nahrávání souboru.'
        }
    },
    system: {
        menutab: {
            title : 'Systém',
            tabtip : 'Restartovat službu VDR, nebo celý systém',
            panel_title : 'Systémové příkazy'
        },
        vdr_restart : {
            label: 'Restartovat službu VDR (backend)',
            submit: {
                waitmsg: 'Signál k restartu VDR zaslán.',
                success: 'VDR se restartuje.',
                failure: 'Problém s posláním signálu. Zkuse znovu.'
            }
        },
        kill_xbmc : {
            label: 'Zabít XBMC (pokud nereaguje)',
            submit: {
                waitmsg: 'Signál k vypnutí XBMC zaslán.',
                success: 'XBMC vypnuto.',
                failure: 'Problém s posláním signálu. Zkuse znovu.'
            }
        },        
        system_restart : {
            label: 'Restartovat počítač (nečeká na potvrzení!)',
            submit: {
                waitmsg: 'Signál k restartu zaslán.',
                success: 'Počítač bude restartován.',
                failure: 'Problém s posláním signálu. Zkuse znovu.'
            }
        }
    },
    network: {
        menutab: {
            title : 'Síť',
            tabtip : 'Správa sítě',
            panel_title : 'Nastavení síťě'
        },
        nfs: {
            help: 'Zadejte NFS zdroje z jiných zařízení. Adresáře musí obsahovat "server:/path". Tlačítko "Uložit" pouze uloží nastavení, které bude použito při restartu systému.',
            menutab: {
                title : 'NFS',
                tabtip : 'Správa NFS sdílení a připojení'
            },
            labels: {
                newDir : 'Vzdálený adresář',
                add : 'Přidat',
                edit : 'Upravit',
                _delete: 'Odstranit',
                apply: 'Použít'
            }
        },
        samba: {
	        menutab: {
                title : 'Samba',
                tabtip : 'Správa sdílení Samba'
            }
	},
        submit: {
            waitmsg : 'Změna konfigurace.',    
            success : 'Změna tabulky připojení úspěšná.',
            failure : 'Chyba při uložení změn tabulky připojení.'
        }
    },
    nvidia: {
        menutab: {
            title : 'Nvidia',
            tabtip : 'Správa nastavení Nvidia',
            panel_title : 'Nastavení Nvidia'
        },
        overscan_slider_label : 'Nvidia Overscan kompenzace',
        button_label : 'Použít hodnotu',
        submit: {
            waitmsg : 'Nastavení Nvidia overscan se aktualizuje.',
            success : 'Úspěch.',
            failure : 'Chyba.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Web rozhraní',
            tabtip : 'Konfigurace vzhledu web rozhraní',
            panel_title : 'Nastavení web rozhraní'
        },
        label: 'Zvolte jazyk web rozhraní',
        button_label:  'Použít nastavení jazyka',
        submit: {
            waitmsg : 'Nastavení web rozhraní se aktualizuje.',
            success : 'Úspěch. Chcete restartovat web rozhraní s novým jazykovým nastavením?',
            failure : 'Chyba.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Obnovit',
                refresh_tooltip: 'Stisknutím tlačítka dojde k obnovení obsahu panelu.',
                jumpdown: 'Skon na konec panelu',
                jumpdown_tooltip: 'Stisknutím tlačítka dojde k přesunu na konec seznamu.'
            }
        },
        section : {
            system_info: {
                menutab: {
                    title : 'Informace o systému',
                    tabtip: 'Status sítě, zátěž systému, využití disků, stavové zprávy jádra'
                },
                ifconfig : 'Status sítě',
                top: 'Zátěž systému',
                dmesg: 'Jádro',
                df: 'Využití disku'
            },
            system_logs: {
                menutab: {
                    title :'Systémové log soubory',
                    tabtip: 'Důležité systémové log soubory'
                }
            },
            xbmc: {
                menutab: {
                    title : 'XBMC log soubory',
                    tabtip : 'Diagnostika důvodu pádů XBMC'
                }
            },
            lirc: {
                menutab: {
                    title : 'Nastavení LIRC',
                    tabtip : 'Kontrola aktuálního nastavení LIRC'
                }
            },
            vdr: {
                menutab: {
                    title : 'Nastavení LIRC',
                    tabtip : 'Kontrola aktuálního nastavení VDR'
                }
            },
            xorg: {
                menutab: {
                    title : 'X-Server',
                    tabtip : 'Kontrola aktuálního nastavení X'
                }
            },
            sound: {
                menutab: {
                    title : 'Zvuk (ALSA)',
                    tabtip : 'Řešení problémů se zvukem (digitální / analogový výstup)'
                }
            },
            packages: {
                menutab: {
                    title : 'Balíčky',
                    tabtip : 'Kontrola nainstalovaných balíčků a jejich verzí'
                }
            },
            yavdr: {
                menutab: {
                    title : 'Nastavení yaVDR',
                    tabtip : 'Řešení problémů s yaVDR web rozhraním (databáze web rozhraní)'
                }
            }
        }
    },
    packages: {
        menutab: {
            title : 'Balíčky yaVDR',
            tabtip : 'Kontrola balíčků a jejich verzí',
            panel_title : 'Balíčky yaVDR'
        }
    },
    timeout: {
        menutab: {
            title : 'Prodleva GRUB',
            tabtip : 'Nastabení prodlevy při zaváďění systému (timeout)',
            panel_title : 'Prodleva GRUB'
        },
        label: 'Zvolte prodlevu',
        button_label:  'Použít nastavení prodlevy',
        submit: {
            waitmsg : 'Nastavení prodlevy se aktualizuje',  
            success : 'Úspěch.',
            failure : 'Chyba.'
        },
        maxText: 'Maximální hodnota pro tuto položku je {0}',
        minText: 'Minimální hodnota pro tuto položku je {0}'
    },
    x11: {
        menutab: {
            title : 'Nastavení zobrazení',
            tabtip : 'Nastavení zobrazení',
            panel_title : 'Nastavení zobrazení'
        },
        graphtft: {
            label: 'graphTFT',
            boxlabel: 'aktivováno'
        },
       deinterlacer_hd: {
            label: 'Odstranění prokládaní Xine HD (doporučený bob)'
        },
       deinterlacer_sd: {
            label: 'Odstranění prokládaní Xine SD (doporučený temporal)'
        },
        button_label:  'Použít nastavení zobrazení',
        submit: {
            waitmsg : 'Nastavení zobrazení se aktualizují.',    
            success : 'Úspěch.',
            failure : 'Chyba.'
        },
        dualhead: {
            label: 'dual head',
            boxlabel: 'aktivní',
            boxlabelunavailable: 'nepodporováno (< 2 obrazovky)',
            switch_label: 'přepnout výstup (konektor) vdr rozhraní'
        },
        primary: 'primární',
        secondary: 'sekundární',
        modeline: 'současná modeline',
        device: 'zařízení',
        resolution: 'rozlišení',
        select_res: 'vyberte rozlišení',
        enabled: 'zapnuto',
        disabled: 'vypnuto'
    },
    sound: {
        menutab: {
            title : 'Nastavení zvuku',
            tabtip : 'Nastavení zvuku',
            panel_title : 'Nastavení zvuku'
        },
        button_label:  'Použít nastavení zvuku',
        submit: {
            waitmsg : 'Nastavení zvuku se aktualizuje', 
            success : 'Úspěch.',
            failure : 'Chyba.'
        },
        label: 'výběr výstupu'
    },
    lifeguard: {
        help: 'Kontrola zda může VDR vypnout počítač. při požadavku na vypnutí provádí různé testy nastavené uživatelem.\nVypnutí je odloženo, pokud běží procesy, které se nemají přerušovat. Zaškrtnuté procesy jsou označeny jako chráněné.',
        menutab: {
            title : 'VDR-Lifeguard',
            tabtip : 'Nastavení Lifeguard (ochrana nechtěného vypnutí)',
            panel_title : 'Nastavení Lifeguard'
        },
        button_label:  'Použít nastavení Lifeguard',
        submit: {
            waitmsg : 'Nastavení Lifeguard uložena.',    
            success : 'Úspěch.',
            failure : 'Chyba.'
        },
        label: 'Nastavení VDR-Lifeguard'
    }
};
