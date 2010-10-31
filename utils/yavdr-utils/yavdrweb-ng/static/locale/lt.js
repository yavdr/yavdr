var locale_lt = {
    meta_lang: {
        local : 'Lietuvių',
        int : 'Lithuanian',
        key : 'lt'
    },
    menutabs: {
        vdr : {
            title: 'Jūsų VDR',
            tabtip: 'Pagrindinių jūsų VDR parametrų nustatymai',
            content: 'Sveiki atvykę į yaVDR valdymo panelį!'
        },
        system : {
            title: 'Sistema',
            tabtip: 'Pagrindinių jūsų VDR parametrų nustatymai',
            content: 'Sveiki atvykę į yaVDR valdymo panelę!'
        },
        demos : {
            title: 'Demo',
            tabtip: 'Idėjos, galimų naujų savybių bandymai, gali būti naudojami bandymo tikslais',
            content: 'Idėjos, galimų naujų savybių bandymai, gali būti naudojami bandymo tikslais'
        },
        development : {
            title: 'Sistemos plėtojimas',
            tabtip: 'Naujos galimybės kurios dar tobulinamos, kol kas rekomenduotina nenaudoti.',
            content: 'Naujos galimybės kurios dar tobulinamos, kol kas rekomenduotina nenaudoti.'
        },
        diagnose : {
            title: 'Diagnostika',
            tabtip: 'Gaukite informaciją apie jūsų sistemos būseną, sekite problemas',
            content: 'Užmeskit akį į svarbius logų ir nustatymų failus'
        }
    },
    standardform: {
        button: {
            save: 'Išsaugoti'
        },
        messagebox_caption: {
            message: 'Žinutė',
            error: 'Klaida',
            wait: 'Lukterkit...'
        }
    },
    remote: {
        menutab: {
            title : 'Distancinis valdymas',
            tabtip :'Distancinio valdymo nustatymai (Distancinio valdymo imtuvas)',
            panel_title : 'Distancinio valdymo imtuvas'
        },
        help: 'Šiuo metu palaikomi trijų tipų su LIRC suderinami serveriai. Pasirinkite vieną, labiausiai atitinkantį jūsų turimą įrenginį. <br /><h1>LIRC</h1><br /><br /> Jei naudojate savos gamybos arba panašios kilmės serijinio prievado įrenginį, turite pasirinkti teisingą serijinį prievadą.<br /><br /><h1>Lirc įvestis</h1><br /><br />Kai kurios DVB kortos turi distancinio valdymo imtuvą. Dauguma jų kaip ir kai kurie USB įrenginiai yra matomi kaip įvesties įrenginiai.Jums tiesiog reikia pasirinkti teisingą įrenginį iš išsiskleidančio sąrašo.<br /><br /><h1>Irserver</h1><br /><br />Kai kurie media centrų korpusai (kad ir OrigenAE) turi integruotą distancino valdymo imtuvą, kuris gali būti naudojamas tik su irserver demonu. Jums tiesiog reikia šį demoną įgalinti ir tada išsaugoti padarytus pakeitimus.' 
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Lirc-nustatymai (Distancinio valdymo imtuvas)',
            panel_title : 'Distancinio valdymo imtuvas (LIRC)'
        },
        help: 'Kai nuspausite mygtuką "Išsaugoti" VDR persikraus kad priimtų pasikeitusius LIRC nustatymus. Jei jūs dar nepriskyrėte distancinio pulto mygtukų reikšmių (remote.conf faile), VDR pasiųlys nuoseklų vedlį TV ekrane, šiam veiksmui atlikti. Šis pranešimas TV ekrane užsidarys po kelių sekundžių, jei per tą laiką nenuspausite bet kurio iš distancinio valdymo pulto mygtuko. Jūs tiesiog galite iškviesti šį langą tiesiog spustelėję ant "Išsaugoti" mygtuko dar kartą.',
        combobox: {
             tooltip : {
                 driver: 'Tvarkyklė (draiveris)',
                 lirc_driver: 'LIRC tvarkyklė (draiveris)'
             },
             emptytext: 'Pasirinkite savo distancinio pulto imtuvą...',
             label: 'Imtuvas'
        },
        serial_radiogroup: {
             label : 'Serijinė įvestis',
             boxlabel_none : ' '
        },
        submit: {
            waitmsg : 'LIRC imtuvo nustatymai saugomi.',    
            success : 'LIRC imtuvo nustatymai sėkmingai išsaugoti.',
            failure : 'Klaida saugant nustatymus. Bandykit dar kartą.'
        },
        error: {
            json_decode : 'Negali dekoduoti imtuvų sąrašo pateikiamo JSON formatu'
        }
    },
    inputlirc: {
        menutab: {
            title : 'Inputlirc',
            tabtip :'Inputlirc-nustatymai (Distancinio valdymo imtuvas)',
            panel_title : 'Distancinio valdymo imtuvas (LIRC)'
        },
        help: 'Pasirinkite jūsų turimą distancinio valdymo imtuvą iš aukščiau pateikto sąrašo. Kai nuspausite mygtuką \"Išsaugoti\" VDR persikraus kad priimtų pasikeitusius inputlirc nustatymus.',
        combobox: {
             tooltip : {
                 driver: 'Tvarkyklė (draiveris)',
                 lirc_driver: 'Inputlirc tvarkyklė'
             },
             emptytext: 'Pasirinkite imtuvą savo distancinio valdymo pultui...',
             label: 'Imtuvas'
        },
        submit: {
            waitmsg : 'Inputlirc imtuvo nustatymai saugomi.',    
            success : 'Nustatymai sėkmingai išsaugoti.',
            failure : 'Klaida saugant nustatymus. Bandykite dar kartą.'
        },
        error: {
            json_decode : 'Negali dekoduoti imtuvų sąrašo pateikiamo JSON formatu'
        }
    },
    irserver: {
        menutab: {
            title : 'IRServer',
            tabtip :'IRServer-nustatymai (Distancinio valdymo imtuvas)',
            panel_title : 'Distancinio valdymo imtuvas (IRServer)'
        },
        help: 'Kai nuspausite mygtuką "Išsaugoti" VDR persikraus kad priimtų pasikeitusius IRServer nustatymus.',
        combobox: {
             tooltip : {
                 driver: 'Tvarkyklė (draiveris)',
                 lirc_driver: 'IRDriver tvarkyklė'
             },
             emptytext: 'Pasirinkite imtuvą savo distancinio valdymo pultui...',
             label: 'Imtuvas'
        },
        submit: {
            waitmsg : 'IRServer imtuvo nustatymai saugomi.',    
            success : 'Imtuvo nustatymai sėkmingai išsaugoti.',
            failure : 'Klaida saugant nustatymus. Bandykite dar kartą.'
        },
        error: {
            json_decode : 'Negali dekoduoti imtuvų sąrašo pateikiamo JSON formatu'
        }
    },
    channels: {
        menutab: {
            title : 'Kanalai',
            tabtip : 'Kanalų nustatymai (Valdyti ir rūšiuoti TV ir radijo kanalus)',
            panel_title : '' //unused
        },
        grid_header : { 
            _num : 'Ne',
            name : 'Kanalo pavadinimas',
            provider : 'Tiekėjas',
            str : 'Pilna kanalo eilutė',
            frequency : 'Dažnis',
            modulation : 'Modulacija',
            source : 'Šaltinis',
            symbolrate : 'Srautas (SR)',
            vpid : 'VPID',
            apid : 'APID',
            tpid : 'TPID',
            caid : 'CAID',
            sid : 'SID',
            nid : 'NID',
            tid : 'TID',
            rid : 'RID',
            _group : 'Grupė',
            _friendly_transp: 'Siųstuvas',
            _friendly_lang: 'Kalba',
            _friendly_type: 'TV/Radijo',
            _friendly_scrambled : 'nekuoduota/koduota',
            _friendly_dvb_sat_band : "Palydovinio signalo dažnių juosta"
        },
        grid_title : 'Kanalų sąrašas (visi radioo ir TV kanalai)' 
    },
    frontend: {
        menutab: {
            title : 'VDR video išvestis',
            tabtip : 'Pereiti tarp xine ir xineliboutput išvesčių',
            panel_title : 'VDR video išvestis'
        },
        label: 'Pasirinkite išvestį',
        button_label:  'Patvirtinti išvesčių nustatymus',
        submit: {
            waitmsg : 'Išvesčių nustatymai atnaujinti.',    
            success : 'Pavyko.',
            failure : 'Nepavyko.'
        }
    },
    shutdown: {
        menutab: {
            title : 'Išjungimas',
            tabtip : 'Pereiti tarp skirtingų išjungimo metodų',
            panel_title : 'VDR išjungimas'
        },
        label: 'Pasirinkite išjungimo metodą',
        button_label:  'Apply shutdown settings',
        submit: {
            waitmsg : 'Išjungimo nustatymai saugomi.',    
            success : 'Pavyko.',
            failure : 'Nepavyko.'
        },
        items: {
            s3: 'pervesti į RAM'ą',
            s3unavailable: 'pervesti į RAM'ą (negalima)',
            s4: 'pervesti į DISKĄ',
            s4unavailable: 'pervesti į DISKĄ  (negalima)',
            s5: 'išjungti',
            reboot: 'perkrauti \"išjungti\" branduolį'
        }
    },
    upload: {
        menutab: {
            title : 'VDR nustatymų failų atsiuntimas',
            tabtip : 'Koreguoti VDR konfigūracinius failus, siųsti turimus VDR nustatymų failus',
            panel_title : 'Atsiųsti turimus VDR nustatymų failus'
        },
        button_label: 'Atsiuntimas',
        submit: {
            waitmsg : 'Failas siunčiamas.',    
            success : 'Failas atsiųstas sėkmingai.',
            failure : 'Klaida siunčiant failą.'
        }
    },
    system: {
        menutab: {
            title : 'Sistema',
            tabtip : 'Perkrauti VDR arba visą sistemą',
            panel_title : 'Sistemos komandos'
        },
        vdr_restart : {
            label: 'Perkrauti VDR',
            submit: {
                waitmsg: 'Signalas perkrauti VDR siunčiamas.',
                success: 'VDR dabar persikraus.',
                failure: 'Klaida siunčiant signalą. Pabandykite dar kartą.'
            }
        },
        kill_xbmc : {
            label: 'Išjunkit XBMC (jei pakibo)',
            submit: {
                waitmsg: 'Signalas išjungti XBMC siunčiamas.',
                success: 'XBMC išjungtas.',
                failure: 'Klaida siunčiant signalą. Pabandykite dar kartą.'
            }
        },        
        system_restart : {
            label: 'Perkraukit įrenginį (Atsargiai: Atliekama tučtuojau neklausiant patvirtinimo!)',
            submit: {
                waitmsg: 'Signalas perkrauti siunčiamas.',
                success: 'Įrenginys dabar persikraus.',
                failure: 'Klaida siunčiant signalą. Pabandykite dar kartą.'
            }
        }
    },
    network: {
        menutab: {
            title : 'Tinklas',
            tabtip : 'Valdyti tinklą',
            panel_title : 'Tinklo nustatymai'
        },
        nfs: {
            help: 'Nustatykit kitų tinklo elementų NFS ryšius kuriuos naudos VDR. Katalogai turėtų būti pateikti sekančiai "serveris:/kelias". Mygtuku "Patvirtinti" patvirtinami vietinės sistemos nustatymai. VDR naudos juos perkrovus sistemą.',
            menutab: {
                title : 'NFS',
                tabtip : 'Valdyti NFS ryšius'
            },
            labels: {
                newDir : 'Nutolęs katalogas',
                add : 'Pridėti',
                edit : 'Koreguoti',
                _delete: 'Trinti',
                apply: 'Patvirtinti'
            }
        },
        samba: {
	        menutab: {
                title : 'Samba',
                tabtip : 'Valdyti samba ryšius'
            }
	},
        submit: {
            waitmsg : 'Pakeitimai saugomi.',    
            success : 'Pakeitimai sėkmingai išsaugoti.',
            failure : 'Problemos saugant pakeitimus, bandykite dar kartą.'
        }
    },
    nvidia: {
        menutab: {
            title : 'Nvidia',
            tabtip : 'Valdyti Nvidia nustatymus',
            panel_title : 'Nvidia nustatymai'
        },
        overscan_slider_label : 'Nvidia nematomos zonos (Overscan) kompensacija',
        button_label : 'Patvirtinti',
        submit: {
            waitmsg : 'Nvidia nematomos zonos pakeitimai atnaujinami.',
            success : 'Pavyko.',
            failure : 'Nepavyko.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Valdymo panelis',
            tabtip : 'Keisti valdymo panelio išvaizdą',
            panel_title : 'Valdymo panelio nustatymai'
        },
        label: 'Pasirinkite valdymo panelio kalbą',
        button_label:  'Patvirtinti kalbos nustatymus',
        submit: {
            waitmsg : 'Valdymo panelio nustatymai atnaujinami.',
            success : 'Pavyko. Ar norite perkrauti valdymo panelį, kad pradėti naudotis naujais kalbiniais nustatymais?',
            failure : 'Nepavyko.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Perkrauti',
                refresh_tooltip: 'Spustelkit šį mygtuką jei norite atnaujinti šio skyriaus turinį.',
                jumpdown: 'Peršokti į skyriaus pabaigą',
                jumpdown_tooltip: 'Spustelkit šį mygtuką jei norite peršokti į skyriaus pabaigą.'
            }
        },
        section : {
            system_info: {
                menutab: {
                    title : 'Sistemos informacija', 
                    tabtip: 'Tinklo būklė, sistemos apkrova, failų sistemos panaudojimas, branduolys'
                },
                ifconfig : 'Tinklo būklė',
                top: 'Sistemos apkrova',
                dmesg: 'Branduolys',
                df: 'Failų sistemos panaudojimas'
            },
            system_logs: {
                menutab: {
                    title :'Sistemos log failai',
                    tabtip: 'Svarbūs sistemos log failai'
                }
            },
            xbmc: {
                menutab: {
                    title : 'XBMC log failai',
                    tabtip : 'Išsiaiškinti dėl ko lūžta arba kyla kitokio pobūdžio problemos su XBMC'
                }
            },
            lirc: {
                menutab: {
                    title : 'LIRC nustatymai',
                    tabtip : 'Patikrinti dabartinius LIRC nustatymus'
                }
            },
            vdr: {
                menutab: {
                    title : 'VDR nustatymai',
                    tabtip : 'Patikrinti dabartinius VDR nustatymus'
                }
            },
            xorg: {
                menutab: {
                    title : 'X-Serveris',
                    tabtip : 'Patikrinti dabartinius X serverio nustatymus'
                }
            },
            sound: {
                menutab: {
                    title : 'Garsas (ALSA)',
                    tabtip : 'Šalinti su garsu susijusias problemas (skaitmeniniu / analoginiu išėjimu)'
                }
            },
            packages: {
                menutab: {
                    title : 'Paketai',
                    tabtip : 'Patikrinti kurie paketai ir kokios jų versijos yra įdiegti'
                }
            },
            yavdr: {
                menutab: {
                    title : 'yaVDR-įrankiai',
                    tabtip : 'Šalinti problemas susijusias su yaVDR valdymo panele (duomenų baze ar http serveriu)'
                }
            }
        }
    },
    packages: {
        menutab: {
            title : 'yaVDR-paketai',
            tabtip : 'Tikrinama kurie paketai ir kokios jų versijos įdiegti',
            panel_title : 'yaVDR-paketai'
        }
    },
    timeout: {
        menutab: {
            title : 'GRUB krovimosi atidėjimas',
            tabtip : 'Nustatyti GRUB krovimosi atidėjimą',
            panel_title : 'GRUB krovimosi atidėjimas'
        },
        label: 'Pasirinkite krovimosi atidėjimą',
        button_label:  'Patvirtinti krovimosi atidėjimo nustatymus',
        submit: {
            waitmsg : 'Krovimosi atidėjimo nustatymai atnaujinami.',    
            success : 'Pavyko.',
            failure : 'Nepavyko.'
        },
        maxText: 'Didžiausia šio laukelio reikšmė yra {0}',
        minText: 'Mažiausia šio laukelio reikšmė yra {0}'
    },
    x11: {
        menutab: {
            title : 'Video išvesties nustatymai',
            tabtip : 'Video išvesties nustatymai',
            panel_title : 'Video išvesties nustatymai'
        },
        graphtft: {
            label: 'graphTFT',
            boxlabel: 'aktyvuota'
        },
       deinterlacer_hd: {
            label: 'Xine-HD-Deinterlacer (numatytasis bob)'
        },
       deinterlacer_sd: {
            label: 'Xine-SD-Deinterlacer (numatytasis temporal)'
        },
        button_label:  'Patvirtinti video išvesties nustatymų pakeitimus',
        submit: {
            waitmsg : 'Video išvesties nustatymai atnaujinami.',    
            success : 'Pavyko.',
            failure : 'Neavyko.'
        },
        dualhead: {
            label: 'dviguba vaizdo išvestis',
            boxlabel: 'aktyvuota',
            boxlabelunavailable: 'atjungta (rasti daugiau nei 2 ekranai)',
            switch_label: 'pakeisti vdr video išvesties sąsają'
        },
        primary: 'pirminis',
        secondary: 'antrinis',
        modeline: 'dabartinė video nustatymų eilutė',
        device: 'įrenginys',
        resolution: 'skiriamoji geba',
        select_res: 'pasirinkti skiriamąją gebą',
        enabled: 'įjungta',
        disabled: 'išjungta'
    },
    sound: {
        menutab: {
            title : 'Garso nustatymai',
            tabtip : 'Garso nustatymai',
            panel_title : 'Garso nustatymai'
        },
        button_label:  'Patvirtinti garso nustatymų pakeitimus',
        submit: {
            waitmsg : 'Atnaujinami garso nustatymai.',    
            success : 'Pavyko.',
            failure : 'Nepavyko.'
        },
        label: 'garso nustatymas'
    },
    lifeguard: {
        help: 'Pažymėkite jei prieš VDRui išjungiant šį įrenginį turėtų būti Atliekami įvairūs testai. Išjungimas bus atidėtas jei galios bent nors viana iš sąlygų, tai yra bus bent vienas iš pažymėtų procesų kurie neturėtų būti nutraukti. Įgalinkite čia procesus, kurių VDR neturėtų sustapdyti',
        menutab: {
            title : 'VDR-Apsauga',
            tabtip : 'Apsaugos nustatymai',
            panel_title : 'Apsaugos nustatymai'
        },
        button_label:  'Patvirtinti apsaugos nustatymų pakeitimus',
        submit: {
            waitmsg : 'Atnaujinami apsaugos nustatymai.',    
            success : 'Pavyko.',
            failure : 'Nepavyko.'
        },
        label: 'VDR-Apsaugos nustatymai'
    }
};

