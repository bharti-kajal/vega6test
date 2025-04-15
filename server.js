import express from 'express';
import path from "path";
import router from './config/routes.js';
import {connectUsingMongoose} from './config/dbConfig.js';
import expressEjsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';

const port = 3100;

const server = express();
server.use(cookieParser());
server.use(session({ secret: 'BlogApp@kajal', resave: false, saveUninitialized: false }));
server.use(flash());

server.use((req, res, next) => {
    res.locals.flash = req.flash();
    next();
});

server.set('view engine', 'ejs');
server.set('views',  path.join(path.resolve(), 'src', 'views'));
server.use(expressEjsLayouts);
server.use(express.urlencoded({extended: true}));
server.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

server.set('layout', 'layout'); 
server.use(router);

server.listen(port, () => {
    console.log('server is up and running on port ', port);
    connectUsingMongoose();
});


