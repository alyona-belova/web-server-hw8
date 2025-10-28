export default (express, bodyParser, createReadStream, crypto, http) => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
        next();
    });

    app.get('/login/', (req, res) => {
        res.send('27a51f8a-d703-492b-9fe6-b1d0e877d2ad');
    });

    app.get('/code/', (req, res) => {
        const filePath = new URL(import.meta.url).pathname;
        // Windows/Linux path handling
        const normalizedPath = process.platform === 'win32' ? filePath.substring(1) : filePath;
        createReadStream(normalizedPath).pipe(res);
    });

    app.get('/sha1/:input/', (req, res) => {
        const hash = crypto.createHash('sha1').update(req.params.input).digest('hex');
        res.send(hash);
    });

    app.all('/req/', (req, res) => {
        const addr = req.method === 'POST' ? req.body.addr : req.query.addr;
        
        if (!addr) {
            return res.send('');
        }

        http.get(addr, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => res.send(data));
        }).on('error', () => res.send(''));
    });

    app.all('*', (req, res) => {
        res.send('27a51f8a-d703-492b-9fe6-b1d0e877d2ad');
    });

    return app;
};
