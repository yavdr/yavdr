var locale_pt = {
    meta_lang: {
        local : 'Português',
        int : 'Portuguese',
        key : 'pt'
    },
    menutabs: {
        vdr : {
            title: 'O seu VDR',
            tabtip: 'Configuração de opções básicas do seu VDR',
            content: 'Ben-vindo à página web do yaVDR!'
        },
        system : {
            title: 'Sistema',
            tabtip: 'Configuração de opções básicas do seu VDR',
            content: 'Ben-vindo à página web do yaVDR!'
        },
        demos : {
            title: 'Demonstração',
            tabtip: 'Provas de conceito e demonstração de futuras funcionalidades. Pode ser usado para testes.',
            content: 'Provas de conceito e demonstração de futuras funcionalidades. Pode ser usado para testes.'
        },
        development : {
            title: 'Desenvolvimento',
            tabtip: 'Novas funcionalidades em desenvolvimento. Não usar. Ainda não funcionam devidamente.',
            content: 'Novas funcionalidades em desenvolvimento. Não usar. Ainda não funcionam devidamente.'
        },
        diagnose : {
            title: 'Diagnóstico',
            tabtip: 'Mantenha-se informado sobre o seu sistema e analise possíveis problemas.',
            content: 'Acesso a ficheiros de log importantes e ficheiros de configuração.'
        }
    },
    standardform: {
        button: {
            save: 'Guardar'
        },
        messagebox_caption: {
            message: 'Menssagem',
            error: 'Erro',
            wait: 'Aguarde, por favor...'
        }
    },
    remote: {
        menutab: {
            title : 'Comando à distância',
            tabtip :'Opções do comando à distância (Receptor do comando à distância)',
            panel_title : 'Receptor do comando à distância'
        },
        help: 'Três servidores compatíveis com LIRC suportados meste momento. Por favor escolha o que melhor corresponde ao seu dispositivo. <br /><h1>LIRC</h1><br /><br /> Este suporta o maior número de dispositivos. Informe-se sobre a driver que suporta o seu dispositivo. Escolha o driver correcto e, no caso de ser um sensor de porta série caseiro (Attric ou semelhante), tem de escolher a porta série correcta.<br /><br /><h1>Input Lirc</h1><br /><br /> Algumas placas de TV incluem um comando à distância. A maioria, bem como alguns dispositivos USB, são disponiblizados com dispositivos de entrada. Apenas tem de escolher o dispositivo correcto do menu.<br /><br /><h1>Irserver</h1><br /><br /> Algumas caixas HTPC (OrigenAE por exemplo) possuêm um sensor IR de origem, que pode ser usado com o irserver. Apenas necessita de o ligar e guardar.' 
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Opções do LIRC (Receptor do comando à distância)',
            panel_title : 'Receptor do comando à distância (LIRC)'
        },
        help: 'Quando pressionar o botão "Guardar", o VDR será reiniciado para garantir a selecção do novo receptor configurado no LIRC. Se não configurou os botões do seu comando à distância (via remote.conf), o VDR vai oferecer-se para aprender, passo a passo, e configurar o comando à distância por si. Esta opção desaparece ao fim de alguns segundos se nenhum botão for pressionado. Pode reiniciar este procedimento simplesmente pressionando "Guardar" novamente.',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'Driver do LIRC'
             },
             emptytext: 'Escolha um receptor para o seu comando à distância, por favor...',
             label: 'Receptor'
        },
        serial_radiogroup: {
             label : 'Dispositivo série',
             boxlabel_none : 'nenhum'
        },
        submit: {
            waitmsg : 'Opções do receptor do LIRC a serem guardadas.',    
            success : 'As opções foram guardadas com sucesso.',
            failure : 'Erro a guardar opções. Tente de novo, por favor.'
        },
        error: {
            json_decode : 'Impossível descodificar a lista de receptores JSON'
        }
    },
    inputlirc: {
        menutab: {
            title : 'Inputlirc',
            tabtip :'Opções do Inputlirc (Receptor do comando à distância)',
            panel_title : 'Receptor do comando à distância (LIRC)'
        },
        help: 'Por favor escolha o seu receptor do comando à distância na lista acima. Quando pressionar o botão "Guardar", o VDR será reiniciado para garantir a selecção do novo receptor configurado no inputlirc.',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'Driver do Inputlirc'
             },
             emptytext: 'Escolha um receptor para o seu comando à distância, por favor...',
             label: 'Receptor'
        },
        submit: {
            waitmsg : 'Opções do receptor do Inputlirc a serem guardadas.',    
            success : 'As opções foram guardadas com sucesso.',
            failure : 'Erro a guardar opções. Tente de novo, por favor.'
        },
        error: {
            json_decode : 'Impossível descodificar a lista de receptores JSON'
        }
    },
    irserver: {
        menutab: {
            title : 'IRServer',
            tabtip :'Opções do IRServer (Receptor do comando à distância)',
            panel_title : 'Receptor do comando à distância (IRServer)'
        },
        help: 'Quando pressionar o botão "Guardar", o VDR será reiniciado para garantir a selecção do novo receptor configurado no IRServer.',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'Driver do IRDriver'
             },
             emptytext: 'Escolha um receptor para o seu comando à distância, por favor...',
             label: 'Receptor'
        },
        submit: {
            waitmsg : 'Opções do receptor do IRServer a serem guardadas.',    
            success : 'As opções foram guardadas com sucesso.',
            failure : 'Erro a guardar opções. Tente de novo, por favor.'
        },
        error: {
            json_decode : 'Impossível descodificar a lista de receptores JSON'
        }
    },
    channels: {
        menutab: {
            title : 'Lista de Canais (SVDRP)',
            tabtip : 'Opções da Lista de Canais (Organizar Lista de Canais de Rádio e TV)',
            panel_title : '' //unused
        },
        grid_header : { 
            cid : 'Não',
            cname : 'Nome do Canal',
            cprovider : 'Provedor',
            cstr : 'Nome completo do Canal'
        },
        grid_title : 'Lista de Canais (Todos os canais de Rádio e TV)' 
    },
    frontend: {
        menutab: {
            title : 'Frontend do VDR',
            tabtip : 'Mudar entre xine e xineliboutput',
            panel_title : 'Frontend do VDR'
        },
        label: 'Escolha frontend',
        button_label:  'Aplicar opções do frontend',
        submit: {
            waitmsg : 'Opções do frontend actualizadas.',    
            success : 'Sucesso.',
            failure : 'Falhou.'
        }
    },
    shutdown: {
        menutab: {
            title : 'Desligar',
            tabtip : 'Mudar modo de desligar',
            panel_title : 'Desligar VDR'
        },
        label: 'Escolha modo de desligar',
        button_label:  'Aplicar modo de desligar',
        submit: {
            waitmsg : 'Opções do modo de desligar actualizadas.',    
            success : 'Sucesso.',
            failure : 'Falhou.'
        },
        items: {
            s3: 'Suspender para a RAM',
            s3unavailable: 'Suspender para a RAM (indisponível)',
            s4: 'Suspender para o disco',
            s4unavailable: 'Suspender para o disco (indisponível)',
            s5: 'Desligar',
            reboot: 'Reiniciar kernel'
        }
    },
    upload: {
        menutab: {
            title : 'Envio de configurações do VDR',
            tabtip : 'Envio da sua configuração guardada do VDR',
            panel_title : 'Envio da configuração do VDR (a configuração enviada sobrescreve a configuração existente)'
        },
        button_label: 'Envio',
        submit: {
            waitmsg : 'O ficheiro está a ser enviado.',    
            success : 'Ficheiro enviado com sucesso.',
            failure : 'Houve um problema durante o envio do ficheiro.'
        }
    },
    system: {
        menutab: {
            title : 'Sistema',
            tabtip : 'Reiniciar o VDR ou todo o Sistema',
            panel_title : 'Comandos do Sistema'
        },
        vdr_restart : {
            label: 'Reiniciar o backend do VDR',
            submit: {
                waitmsg: 'O comando para reiniciar o VDR está a ser enviado.',
                success: 'O VDR vai reiniciar agora.',
                failure: 'Problema a enviar comando. Tente de novo, por favor.'
            }
        },
        kill_xbmc : {
            label: 'Parar XBMC (se congelado)',
            submit: {
                waitmsg: 'O comando para parar o XBMC está a ser enviado.',
                success: 'O XBMC foi parado.',
                failure: 'Problema a enviar comando. Tente de novo, por favor.'
            }
        },        
        system_restart : {
            label: 'Reiniciar o sistema (Atenção: Não pede confirmação!)',
            submit: {
                waitmsg: 'O comando para reiniciar está a ser enviado.',
                success: 'O sistema vai reiniciar agora.',
                failure: 'Problema a enviar comando. Tente de novo, por favor.'
            }
        }
    },
    network: {
        menutab: {
            title : 'Rede Local',
            tabtip : 'Opções de Rede',
            panel_title : 'Configuração da Rede'
        },
        nfs: {
            help: 'Defina as partilhas NFS de outros sistemas que devem ser usados pelo VDR. As directorias devem começar com "server:/path". O botão "Aplicar" guarda as mudanças nas configurações locais. O VDR usará as novas configurações após da próxima vez que reiniciar.',
            menutab: {
                title : 'NFS',
                tabtip : 'Opções de partilhas NFS'
            },
            labels: {
                newDir : 'Directoria remota',
                add : 'Adicionar',
                edit : 'Editar',
                _delete: 'Remover',
                apply: 'Aplicar'
            }
        },
        samba: {
            menutab: {
                title : 'Samba',
                tabtip : 'Opções de partilhas Samba'
            }
       }
    },
    nvidia: {
        menutab: {
            title : 'Nvidia',
            tabtip : 'Opções de drivers Nvidia',
            panel_title : 'Configuração Nvidia'
        },
        overscan_slider_label : 'Compensação de Overscan Nvidia',
        button_label : 'Aplicar valor',
        submit: {
            waitmsg : 'Opções de Overscan Nvidia actualizadas.',
            success : 'Sucesso.',
            failure : 'Falhou.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Frontend Web',
            tabtip : 'Configurar aparência do frontend Web',
            panel_title : 'Opções do frontend Web'
        },
        label: 'Escolha a linguagem do frontend Web',
        button_label:  'Aplicar configuração da linguagem',
        submit: {
            waitmsg : 'Opções de linguagem do frontend Web actualizadas.',
            success : 'Sucesso. Pressione F5 para actualizar o frontend Web com a nova linguagem, por favor.',
            failure : 'Falhou.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Refrescar',
                refresh_tooltip: 'Carregue neste botão para refrescar o conteúdo deste painel.',
                jumpdown: 'Saltar para o fim do painel',
                jumpdown_tooltip: 'Carregue neste botão para saltar para o fim deste painel, por favor.'
            }
        },
        section : {
            system_info: {
                menutab: {
                    title : 'Informação do Sistema', 
                    tabtip : 'Estado da rede, carga do sistema, uso de ficheiros do sistema e do kernel'
                },
                ifconfig : 'Estado da Rede',
                top: 'Carga do Sitema',
                dmesg: 'Kernel',
                df: 'Uso de ficheiros do sistema'
            },
            system_logs: {
                menutab: {
                    title :'Ficheiros de depuração',
                    tabtip : 'Ficheiros de depuração importantes'
                }
            },
            xbmc: {
                menutab: {
                    title : 'Ficheiros de depuração do XBMC',
                    tabtip : 'Descubra a razão para problemas do XBMC'
                }
            },
            lirc: {
                menutab: {
                    title : 'Configuração do LIRC',
                    tabtip : 'Verifique a configuração actual do LIRC'
                }
            },
            vdr: {
                menutab: {
                    title : 'Configuração do VDR',
                    tabtip : 'Verifique a configuração actual do VDR'
                }
            },
            xorg: {
                menutab: {
                    title : 'Servidor X',
                    tabtip : 'Verifique a configuração actual do X'
                }
            },
            sound: {
                menutab: {
                    title : 'Som (ALSA)',
                    tabtip : 'Solucione problemas de som (digital/analógico)'
                }
            },
            packages: {
                menutab: {
                    title : 'Pacotes',
                    tabtip : 'Verifique que pacotes e suas versões estão instalados'
                }
            },
            yavdr: {
                menutab: {
                    title : 'yaVDR-Utils',
                    tabtip : 'Solucione problemas com o frontend do yaVDR (base de dados + servidor web)'
                }
            }
        }
    },
    timeout: {
        menutab: {
            title : 'Temporização do GRUB',
            tabtip : 'Escolha a temporização do GRUB',
            panel_title : 'Temporização do GRUB'
        },
        label: 'Escolha temporização',
        button_label:  'Aplicar opções de temporização',
        submit: {
            waitmsg : 'Opções de temporização actualizadas.',    
            success : 'Sucesso.',
            failure : 'Falhou.'
        },
        maxText: 'O valor máximo para este campo é {0}',
        minText: 'O valor mínimo para este campo é {0}'
    },
    x11: {
        menutab: {
            title : 'Opções do ecrã',
            tabtip : 'Opções do ecrã',
            panel_title : 'Opções do ecrã'
        },
        graphtft: {
            label: 'graphTFT',
            boxlabel: 'Activado'
        },
        button_label:  'Aplicar opções do ecrã',
        submit: {
            waitmsg : 'Opções do ecrã actualizadas.',    
            success : 'Sucesso.',
            failure : 'Falhou.'
        },
        dualhead: {
            label: 'dual head',
            boxlabel: 'Activado',
            boxlabelunavailable: 'Desligado (menos de 2 ecrãs encontrados)',
            switch_label: 'Mudar ecrã do frontend do VDR'
        },
        primary: 'Primário',
        secondary: 'Secundário',
        modeline: 'Modelo actual',
        device: 'Dispositivo',
        resolution: 'Resolução',
        select_res: 'Escolha resolução',
        enabled: 'Ligado',
        disabled: 'Desligado'
    },
    sound: {
        menutab: {
            title : 'Configurações de som',
            tabtip : 'Configurações de som',
            panel_title : 'Configurações de som'
        },
        button_label:  'Aplicar configurações de som',
        submit: {
            waitmsg : 'Configurações de som actualizadas.',    
            success : 'Sucesso.',
            failure : 'Falhou.'
        },
        label: 'Configuração de som'
    }
};