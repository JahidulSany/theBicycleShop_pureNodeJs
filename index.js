// MODULES
const fs = require('fs').promises;
const http = require('http');
const url = require('url');

// GET DATA
const bicycles = require('./data/data.json');


const server = http.createServer( async(req, res) => {
    if(req.url === '/favicon.ico') return;

    const myURL = new URL(req.url, `http://${req.headers.host}/`);
    const pathname = myURL.pathname;
    const id = myURL.searchParams.get('id');

    // HOMEPAGE
    if (pathname === '/') { 
        let html = await fs.readFile(`${__dirname}/views/bicycles.html`, 'utf-8');
        let eachBicycle = await fs.readFile(`${__dirname}/views/partials/bicycle.html`, 'utf-8');

        let allTheBicycles = '';
        for (let index = 0; index < 6; index++) {
            allTheBicycles += replaceTemplate(eachBicycle, bicycles[index]);
        }
        html = html.replace(/<%AllTheBicycles%>/g, allTheBicycles);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    
    // OVERVIEW
    } else if (pathname === '/bicycle' && id >= 0 && id <= 5) {
        let html = await fs.readFile(`${__dirname}/views/overview.html`, 'utf-8');
        // Getting id from url
        const bicycle = bicycles.find(b => b.id === id);

        html = replaceTemplate(html, bicycle);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    
    } else if(/\.(png)$/i.test(req.url)) {
        let image = await fs.readFile(`${__dirname}/public/images/${req.url.slice(1)}`);
        res.writeHead(404, {'Content-Type': 'image/png'});
        res.end(image);
    
    } else if(/\.(css)$/i.test(req.url)) {
        let css = await fs.readFile(`${__dirname}/public/css/index.css`);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(css);
    
    } else if(/\.(svg)$/i.test(req.url)) {
        let svg = await fs.readFile(`${__dirname}/public/images/icons.svg`);
        res.writeHead(200, {'Content-Type': 'image/svg+xml'});
        res.end(svg);
    
    // 404 NOT FOUND 
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<div><h1> Not Found </div></h1>');
    } 
});


function replaceTemplate(html, bicycle) {
    html = html.replace(/<%IMAGE%>/g, bicycle.image);
    html = html.replace(/<%NAME%>/g, bicycle.name);

    let price = bicycle.originalPrice;
    if (bicycle.hasDiscount){
        price = (price * ( 100 - bicycle.discount)) / 100;
    }
    html = html.replace(/<%PRICE%>/g, `$${price}.00`);

    html = html.replace(/<%OLDPRICE%>/g, `$${bicycle.originalPrice}`);
    html = html.replace(/<%ID%>/g, bicycle.id);
    
    if (bicycle.hasDiscount) {
        html = html.replace(/<%DISCOUNTRATE%>/g,`
            <div class="discount__rate"><p>${bicycle.discount}% Off</p></div>`);
    } else {
        html = html.replace(/<%DISCOUNTRATE%>/g,'');
    }

    for (let index = 0; index < bicycle.star; index++ ) {
        html = html.replace(/<%STAR%>/, 'checked');
    }

    html = html.replace(/<%STAR%>/g, '');

    return html;
}

server.listen(3000, () => console.log('server is running at port: 3000'));

























































