import path from 'path';
import config from 'config';
import Koa from 'koa';
import render from 'koa-ejs';
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from './components/App';
import {Loader} from './components/App';

const app = new Koa();

render(app, {
    root: path.join(process.cwd(), './src/templates'),
    layout: 'index',
    viewExt: 'ejs',
    cache: false,
    debug: true,
});

app.use(async function(ctx) {

    const exchangeRates = await Loader({days: config.app.daysToShow});

    const initialState = {exchangeRates};

    await ctx.render('index', {
        rootId: 'root',
        title: config.template.title,
        content: ReactDOMServer.renderToString(<App initialState={initialState} />),
        host: config.distServer.host,
        port: config.distServer.port,
        serializedState: JSON.stringify(initialState)
    });
});

app.listen(config.server.port);

console.log(`App is listening on ${config.server.host}:${config.server.port}`);