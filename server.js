var http = require('http');
const { readFile } = require('./utils.js');
const { logger } = require('./middlewares/logger.js');

const PORT = process.env.PORT || 8080;
const pageMappings = {
    '/': 'index.html',
    '/about': 'about.html',
    '/contact': 'contact.html',
    '/invalidReq': 'invalidReq.html'
};

const servePage = (url, res) => {
    const fileName = pageMappings[url];
    const data = readFile(fileName);
    console.log('serving', fileName);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    return res.end();
}

const serveStyles = (req, res) => {
    const data = readFile('style.css', './styles/');
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.write(data);
    console.log('serving style.css');
    return res.end();
}

const sendInvalidReqResponse = (req, res) => {
    servePage('/invalidReq', res);
}

const isPageRequest = (url) => url.startsWith('/pages');
const isReqForFavicon = (url) => url === '/favicon.ico';
const isReqForStyles = (url) => url.startsWith('/styles');

const handlePageReq = (req, res) => {
    const pageName = req.url.replace('/pages', '');
    return pageName in pageMappings ?
        servePage(pageName, res) : sendInvalidReqResponse(req, res);
}

const serveFavicon = (res) => {
    const data = readFile('favicon.png', './images/');
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    res.write(data);
    console.log('serving favicon');
    return res.end();
}

const main = () => {
    http.createServer((req, res) => {
        logger(req, res);
        console.log({ isPageRequest: isPageRequest(req.url) });

        if (isPageRequest(req.url)) return handlePageReq(req, res);
        if (isReqForStyles(req.url)) return serveStyles(req, res);
        if (isReqForFavicon(req.url)) return serveFavicon(res);
        sendInvalidReqResponse(req, res);
    }).listen(PORT, () => {
        console.log("listening to port", PORT);
    });
}

main();

