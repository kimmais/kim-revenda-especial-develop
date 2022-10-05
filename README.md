Para rodar a aplicação
1. Conectar VPN TACOM
2. PLAY no VSCode debugger

Para publicar
1. Apaga a pasta Publish
2. Na pasta do projeto, rodar no terminal
  dotnet publish -c Release -o Publish
3. Na pasta Publish, pega tudo menos o web.config, appsettings.json e appsettings.Development.json e zipa
