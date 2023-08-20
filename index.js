const hosts = require('./collections/hosts.js');

const dns = require('./services/dns.js');
const fs = require('fs');
const { program } = require('commander');

program.command('add')
    .argument('<host>', 'Host a ser adicionado')
    .action(async (host) => {
        let db_host = await hosts.findByHost(host);

        if (db_host === null) {
            await hosts.insert({
                host
            });

            console.log(`${host} adicionado ao banco de dados`);
        } else {
            console.log(`${host} já existe`);
        }
    
        process.exit(0);
    });

program.command('import')
    .argument('<file>', 'Arquivo contendo os hosts')
    .action(async (file) => {
        if (!(await fs.existsSync(file))) {
            console.log(`O arquivo especificado não existe.`);
            return;
        }
    
        console.log('Importando ...\n');
    
        let lines = (await fs.readFileSync(file, { encoding: 'utf-8' })).split('\n');
    
        for (const line of lines) {
            if (line.trim() == '') {
                continue;
            }
    
            let [ host, port ] = line.split(':');
    
            let db_host = await hosts.findByHost(host);
    
            if (db_host === null) {
                await hosts.insert({
                    host
                });
    
                console.log(`${host} adicionado ao banco de dados`);
            }
        }
    
        process.exit(0);
    });

program.command('show')
    .option('--all', 'Exibir também hosts inativos', false)
    .action(async (options) => {
        let db_hosts = [];

        if (options.all) {
            db_hosts = await hosts.findAll();
        } else {
            db_hosts = await hosts.findAllActives();
        }

        console.log(db_hosts.map(db_host => db_host.host).join('\n'));

        process.exit(0);
    });

program.command('resume')
    .action(async () => {
        console.log('Records: ' + (await hosts.count()));
        console.log('Up: ' + (await hosts.countActives()));

        process.exit(0);
    });

program.command('check')
    .action(async () => {
        let db_hosts = await hosts.findAll();

        for (const db_host of db_hosts) {
            let active = false;

            for (const rrtype of ['A', 'AAAA', 'CNAME', 'NS']) {
                let results = await dns.resolve(db_host.host, rrtype);

                if (results.length > 0) {
                    active = true;
                    break;
                }
            }

            if (active && db_host.removed_at !== null) {
                db_host.removed_at = null;

                await hosts.update(db_host.id, db_host);
            } else if (!active && db_host.removed_at === null) {
                await hosts.remove(db_host.id);
            }
        }

        process.exit(0);
    });

program.parse();