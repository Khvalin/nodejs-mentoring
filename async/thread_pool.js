const dns = require('dns');
const util = require('util');

const async_hooks = require('async_hooks');

const start = process.hrtime();

//console.log('thread pool size %d', process.env.UV_THREADPOOL_SIZE);

dns.setServers(['74.82.42.42'], ['91.239.100.100'], ['77.88.8.8'], ['109.69.8.51']); //

for (let i = 0; i < 10; ++i) {
  dns.lookup(`fake-servername.${ Math.random() }.tld`, (err, address, family) => {
    //console.log('address: %j family: IPv%s', address, family);
    const end = process.hrtime(start);
    console.log(util.format('lookup %d finished in %ds', i, end[0] + end[1] / 1e9));
  });
}