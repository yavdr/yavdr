var locale_fr = {
    meta_lang: {
        local : 'Francais',
        int : 'French',
        key : 'fr'
    },
    menutabs: {
        vdr : {
            title: 'Votre VDR',
            tabtip: 'Configuration des paramètres de base de votre VDR',
            content: 'Bienvenue sur l\'interface Web de yaVDR!'
        },
        system : {
            title: 'Système',
            tabtip: 'Configuration des paramètres de base du système',
            content: 'Bienvenue sur l\'interface Web de yaVDR!'
        },
        demos : {
            title: 'Démos',
            tabtip: 'Validation de principe, démonstrations de nouvelles caractéristiques, peut être utilisé à des fins de test',
            content: 'Validation de principe, démonstrations de nouvelles caractéristiques, peut être utilisé à des fins de test'
        },
        development : {
            title: 'Développement',
            tabtip: 'Nouvelles fonctionnalités qui sont en cours de développement, ne les utilisez pas. Ils ne fonctionnent pas correctement pour le moment.',
            content: 'Nouvelles fonctionnalités qui sont en cours de développement, ne les utilisez pas. Ils ne fonctionnent pas correctement pour le moment.'
        },
        diagnose : {
            title: 'Diagnostiquer',
            tabtip: 'Restez informé sur l\'état du système, le suivi des problèmes',
            content: 'Accès aux fichiers des logs importants et aux fichiers de configuration'
        }
    },
    standardform: {
        button: {
            save: 'Enregistrer'
        },
        messagebox_caption: {
            message: 'Message',
            error: 'Erreur',
            wait: 'Patienter S\'il vous plait...'
        }
    },
    remote: {
        menutab: {
            title : 'Télécommande',
            tabtip :'Télécommande-Paramètres (Récepteur de la télécommande)',
            panel_title : 'Récepteur de la télécommande'
        },
        help: 'Il ya 3 différents serveurs LIRC compatibles supportés pour le moment. S\'il vous plaît choisissez celui qui convient le mieux pour votre appareil. <br /><h1>LIRC</h1><br /><br /> Celui-ci convient pour la plupart des appareils. S\'il vous plaît renseignez-vous, pour savoir quel pilote est supporté par votre appareil. Vous devez choisir le bon pilote pour votre périphérique et dans certain cas son pilote pour le port-série (Attric, montage perso et d\'autres dispositifs similaires), vous devez choisir le bon port série. <br /> <br /><h1>Input Lirc</h1><br /><br /> Certaines cartes DVB comprenne un récepteur de télécommande. La plupart d\'entre eux, ainsi que certains périphériques USB sont disponibles en tant que dispositifs dite d\'entrée. Vous avez seulement besoin de choisir le bon périphérique dans la liste déroulante. <br /><br /><h1>Irserver</h1><br /><br /> Certains cas d\'HTPC (par exemple OrigenAE) ont inclus un récepteur de télécommande , qui ne peut être utilisé qu\'avec irserver. Il vous suffit de l\'activer et de l\'enregistrer ensuite.' 
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Lirc-Paramètres (Récepteur de la télécommande)',
            panel_title : 'Récepteur de la télécommande (LIRC)'
        },
        help: 'Lorsque vous appuyez sur le bouton "Enregistrer" VDR sera redémarré pour prendre en compte les nouveaux paramètres du récepteur LIRC. Si vous n\'avez pas affecté les boutons de votre télécommande (via remote.conf), VDR vous offrira à travers l\'OSD, étape par étape, la configuration de chaque touche de votre télécommande. Cette boîte de dialogue disparaîtra après quelques secondes si aucune touche de la télécommande n\'est pressée. Vous pouvez relancer le dialogue en appuyant simplement sur "Enregistrer".',
        combobox: {
             tooltip : {
                 driver: 'Pilote',
                 lirc_driver: 'LIRC Pilote'
             },
             emptytext: 'S\'il vous plaît choisissez un récepteur pour votre télécommande...',
             label: 'Recepteur'
        },
        serial_radiogroup: {
             label : 'Interface Série',
             boxlabel_none : 'aucun'
        },
        submit: {
            waitmsg : 'Les paramètres LIRC sont enregistrés.',
            success : 'Les paramètres ont été correctement enregistrés.',
            failure : 'Erreur pendant l\'enregistrement des paramètres. S\'il vous plaît essayez de nouveau.'
        },
        error: {
            json_decode : 'Impossible de décoder la liste de récepteur JSON'
        }
    },
    inputlirc: {
        menutab: {
            title : 'Inputlirc',
            tabtip :'Inputlirc-Paramètres (Récepteur de la télécommande)',
            panel_title : 'Récepteur de la télécommande (LIRC)'
        },
        help: 'S\'il vous plaît Choisissez votre récepteur dans la liste ci-dessus. Lorsque vous appuyez sur le bouton "Enregistrer" VDR sera redémarré pour prendre en compte les nouveaux paramètres du récepteur Inputlirc.',
        combobox: {
             tooltip : {
                 driver: 'Pilote',
                 lirc_driver: 'Inputlirc Pilote'
             },
             emptytext: 'S\'il vous plaît choisissez un récepteur pour votre télécommande...',
             label: 'Récepteur'
        },
        submit: {
            waitmsg : 'Les paramètres du récepteur Inputlirc sont enregistrés.',    
            success : 'Les paramètres ont été correctement enregistrés.',
            failure : 'Erreur pendant l\'enregistrement des paramètres. S\'il vous plaît essayez de nouveau.'
        },
        error: {
            json_decode : 'Impossible de décoder la liste de récepteur JSON'
        }
    },
    irserver: {
        menutab: {
            title : 'IRServer',
            tabtip :'IRServer-Paramètres (Récepteur de la télécommande)',
            panel_title : 'Récepteur de la télécommande (IRServer)'
        },
        help: 'Lorsque vous appuyez sur le bouton "Enregistrer" VDR sera redémarré pour prendre en compte les nouveaux paramètres du récepteur IRServer.',
        combobox: {
             tooltip : {
                 driver: 'Pilote',
                 lirc_driver: 'IRDriver Pilote'
             },
             emptytext: 'S\'il vous plaît choisissez un récepteur pour votre télécommande...',
             label: 'Récepteur'
        },
        submit: {
            waitmsg : 'Les paramètres IRServer vont maintenant être enregistrés.',    
            success : 'Les paramètres ont été correctement enregistrés.',
            failure : 'Erreur pendant l\'enregistrement des paramètres. S\'il vous plaît essayez de nouveau.'
        },
        error: {
            json_decode : 'Impossible de décoder la liste de récepteur JSON'
        }
    },
    channels: {
        menutab: {
            title : 'Liste des Chaînes',
            tabtip : 'Réglages des chaînes (modifs et tri des radios et chaînes de télévision)',
            panel_title : '' //unused
        },
        grid_header : { 
            _num : 'N°',
            name : 'Nom',
            provider : 'Fournisseur',
            str : 'Information comlete de la chaîne',
            frequency : 'Frequence',
            modulation : 'Modulation',
            source : 'Source',
            symbolrate : 'Symbolrate',
            vpid : 'VPID',
            apid : 'APID',
            tpid : 'TPID',
            caid : 'CAID',
            sid : 'SID',
            nid : 'NID',
            tid : 'TID',
            rid : 'RID',
            _group : 'Groupe',
            _friendly_transp: 'Transpondeur',
            _friendly_lang: 'Langue',
            _friendly_type: 'TV/Radio',
            _friendly_scrambled : 'Gratuite/Cryptée',
            _friendly_dvb_sat_band : 'Zone de couverture satellite',
        },
        grid_title : 'Liste des Chaînes (toute radio et chaînes de TV)' 
    },
    frontend: {
        menutab: {
            title : 'VDR Interface',
            tabtip : 'Basculer entre l\'interface xine et xineliboutput',
            panel_title : 'VDR Interface'
        },
        label: 'Choix de l\'interface',
        button_label:  'Appliquer les paramètres de l\'interface',
        submit: {
            waitmsg : 'Les paramètres de l\'interface ont été modifiés.',    
            success : 'Succès.',
            failure : 'Échec.'
        }
    },
    shutdown: {
        menutab: {
            title : 'Extinction',
            tabtip : 'Choix entre différentes méthodes d\'extinction',
            panel_title : 'VDR Extinction'
        },
        label: 'Choisisser l\'extinction',
        button_label:  'Appliquer les paramètres d\'extinction',
        submit: {
            waitmsg : 'Les paramètres d\'extinction ont été modifiés.',    
            success : 'Succès.',
            failure : 'Echec.'
        },
        items: {
            s3: 'suspend to RAM',
            s3unavailable: 'suspend to RAM (unavailable)',
            s4: 'suspend to DISK',
            s4unavailable: 'suspend to DISK  (unavailable)',
            s5: 'extinction',
            reboot: 'redémarrage "PowerOff" kernel'
        }
    },
    upload: {
        menutab: {
            title : 'VDR Configue Import',
            tabtip : 'Importez votre configuration existante de VDR',
            panel_title : 'VDR Configue Import (la version importée supprime la version existante)'
        },
        button_label: 'Import',
        submit: {
            waitmsg : 'Le fichier est en cours d\'importation.',    
            success : 'Le fichier a été importé avec succès.',
            failure : 'Un problème est survenu durant l\'importation.'
        }
    },
    system: {
        menutab: {
            title : 'Systeme',
            tabtip : 'Redémarrez VDR ou l\'ensemble du système.',
            panel_title : 'Systeme Commandes'
        },
        vdr_restart : {
            label: 'Redémarrez VDR',
            submit: {
                waitmsg: 'Le signal pour redémarrer VDR a été envoyé.',
                success: 'VDR va maintenant redémarrer.',
                failure: 'Problème sur le signal d\'envoi. S\'il vous plaît essayez de nouveau.'
            }
        },
        kill_xbmc : {
            label: 'Tuer XBMC (Si bloquer)',
            submit: {
                waitmsg: 'Le signal pour arrêter XBMC a été envoyé.',
                success: 'XBMC est arrêté.',
                failure: 'Problème sur le signal d\'envoi. S\'il vous plaît essayez de nouveau.'
            }
        },        
        system_restart : {
            label: 'Redémarrer la machine (Attention: pas de demande de confirmation!)',
            submit: {
                waitmsg: 'Le signal de redémarrage a été envoyé.',
                success: 'La machine va maintenant redémarrer.',
                failure: 'Problème sur le signal d\'envoi. S\'il vous plaît essayez de nouveau.'
            }
        }
    },
    network: {
        menutab: {
            title : 'Réseau',
            tabtip : 'Entretien du réseau',
            panel_title : 'Réseau configuration'
        },
        nfs: {
        help: 'Définir les partages NFS depuis d\'autres hôtes qui devraient être utilisés par VDR. Les répertoires doivent être qualifiés comme "serveur: / chemin". Le bouton "Appliquer" soutient effectivement les modifications de votre configuration locale. VDR les utilisera au prochain redémarrage.',
            menutab: {
                title : 'NFS',
                tabtip : 'Entretien des montages NFS et partages'
            },
            labels: {
                newDir : 'Répertoire à distance',
                add : 'Ajouter',
                edit : 'Editer',
                _delete: 'Supprimer',
                apply: 'Appliquer'
            }
        },
        samba: {
            menutab: {
                title : 'Samba',
                tabtip : 'Maintenir les partages Samba'
            }
       },
        submit: {
            waitmsg : 'La configuration est appliquée.',    
            success : 'La table de montage a été modifié avec succès.',
            failure : 'Un problème pendant la modification de la table de montage a été détecté.'
        }
    },
    nvidia: {
        menutab: {
            title : 'Nvidia',
            tabtip : 'Entretien des paramètres Nvidia',
            panel_title : 'Nvidia configuration'
        },
        overscan_slider_label : 'Nvidia compensation Overscan',
        button_label : 'Appliquer la valeur',
        submit: {
            waitmsg : 'Nvidia overscan paramètres mis à jour.',
            success : 'Succès.',
            failure : 'Echec.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Web Interface',
            tabtip : 'Configure l\'apparance de l\'interface web',
            panel_title : 'Web Interface Paramètres'
        },
        label: 'Choisisser le langage de l\'interface web',
        button_label:  'Appliquer les paramètres du langage',
        submit: {
            waitmsg : 'La langue de l\'interface Web à été mise à jour.',
            success : 'Succès. S\'il vous plaît pressez F5 pour recharger l\'interface web avec la nouvelle langue.',
            failure : 'Echec.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Rafraichir',
                refresh_tooltip: 'S\'il vous plaît cliquer sur ce bouton pour rafraîchir le contenu de la fenêtre.',
                jumpdown: 'Bas de page',
                jumpdown_tooltip: 'S\'il vous plaît cliquer sur ce bouton pour sauter en bas de page.'
            }
        },
        section : {
            system_info: {
                menutab: {
                    title : 'Information Systeme', 
                    tabtip : 'L\'état du réseau, la charge du système, l\'utilisation des fichiers système, le kernel'
                },
                ifconfig : 'L\'état du réseau',
                top: 'La charge du système',
                dmesg: 'Kernel',
                df: 'L\'utilisation des fichiers système'
            },
            system_logs: {
                menutab: {
                    title :'Logs des Fichiers Systeme',
                    tabtip : 'Les fichiers des logs importants'
                }
            },
            xbmc: {
                menutab: {
                    title : 'Logs des Fichiers d\'XBMC',
                    tabtip : 'Trouver la cause des plantages d\'XBMC ou autres problèmes'
                }
            },
            lirc: {
                menutab: {
                    title : 'LIRC Configuration',
                    tabtip : 'Vérifiez la configuration actuelle de LIRC'
                }
            },
            vdr: {
                menutab: {
                    title : 'VDR Configuration',
                    tabtip : 'Vérifiez la configuration actuelle de VDR'
                }
            },
            xorg: {
                menutab: {
                    title : 'X-Serveur',
                    tabtip : 'Vérifiez la configuration actuelle de X'
                }
            },
            sound: {
                menutab: {
                    title : 'Son (ALSA)',
                    tabtip : 'Résoudre les problèmes de son (numérique / sortie analogique)'
                }
            },
            packages: {
                menutab: {
                    title : 'Paquets',
                    tabtip : 'Vérifier quels paquets et versions sont installés'
                }
            },
            yavdr: {
                menutab: {
                    title : 'yaVDR-Utils',
                    tabtip : 'Résoudre les problèmes de l\'interface web yaVDR (base de données + serveur web)'
                }
            }
        }
    },
    packages: {
        menutab: {
            title : 'yaVDR-Paquets',
            tabtip : 'Vérifier quels paquets et versions sont installés',
            panel_title : 'yaVDR-Paquets'
        }
    },
    timeout: {
        menutab: {
            title : 'GRUB délai',
            tabtip : 'Fixer le délai de GRUB',
            panel_title : 'GRUB délai'
        },
        label: 'Choisir le délai',
        button_label:  'Appliquer le délai',
        submit: {
            waitmsg : 'Le paramètre du délai est mis à jour.',
            success : 'Succès.',
            failure : 'Echec.'
        },
        maxText: 'La valeur maximum de ce champ est (0)',
        minText: 'La valeur minimum de ce champ est (0)'
    },
    x11: {
        menutab: {
            title : 'paramètres d\'affichage',
            tabtip : 'paramètres d\'affichage',
            panel_title : 'paramètres d\'affichage'
        },
        graphtft: {
            label: 'graphTFT',
            boxlabel: 'activer'
        },
       deinterlacer_hd: {
            label: 'Xine-HD-Désentrelacement  (défaut bob)'
        },
       deinterlacer_sd: {
            label: 'Xine-SD-Désentrelacement  (défaut temporal)'
        },
        button_label:  'Appliquer les paramètres d\'affichage',
        submit: {
            waitmsg : 'Paramètres d\'affichage mis à jour.',
            success : 'Succès.',
            failure : 'Echec.'
        },
        dualhead: {
            label: 'double écran',
            boxlabel: 'activer',
            boxlabelunavailable: 'desactivé (< 2 ecrans trouvés)',
            switch_label: 'changer d\'écran pour l\'interface VDR'
        },
        primary: 'primaire',
        secondary: 'secondaire',
        modeline: 'modeline actuelle',
        device: 'dispositif',
        resolution: 'résolution',
        select_res: 'selectionner une résolution',
        enabled: 'activer',
        disabled: 'désactiver'
    },
    sound: {
        menutab: {
            title : 'Paramètres audio',
            tabtip : 'Paramètres audio',
            panel_title : 'Paramètres audio'
        },
        button_label:  'Appliquer les paramètres audio',
        submit: {
            waitmsg : 'Paramètres audio mis à jour.',
            success : 'Succès.',
            failure : 'Echec.'
        },
        label: 'Paramètres audio'
    },
    lifeguard: {
        help: 'VDR-Lifeguard vérifie avant l\'extinction de yaVDR si certains processus sont actifs. L\'arret est reportée si l\'un des tests indiquent qu\'il y a un processus qui ne devrait pas être interrompu. Activez ici les processus empêchant la mise hors tension de l\'appareil. Aucune sélection signifie que VDR-Lifeguard est désactivé',
        menutab: {
            title : 'VDR-Lifeguard',
            tabtip : 'Paramètres Lifeguard',
            panel_title : 'Paramètres Lifeguard'
        },
        button_label:  'Appliquer les paramètres Lifeguard',
        submit: {
            waitmsg : 'Paramètres de Lifeguard mis à jour.',
            success : 'Succès.',
            failure : 'Echec.'
        },
        label: 'VDR-Lifeguard Paramètres'
    }
};
