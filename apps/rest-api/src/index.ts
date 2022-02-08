import { environment } from './environments/environment';
import * as express from 'express';
import * as mongoose from 'mongoose';
import *as  morgan from "morgan";
import * as cors from 'cors';
import authJwt from './helpers/jwt';
import errorHandler from'./helpers/error-handler';


const app = express();

const api = environment.API_URL;

app.use(cors());
app.options('*', cors());


const productsRouter = require('./routers/products.router');
const categoriesRouter = require('./routers/categories.router');
const usersRouter = require('./routers/users.router');
const ordersRouter = require('./routers/orders.router');


//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname+'/public/uploads'));


//routes
app.use(`${api}products/`,productsRouter );
app.use(`${api}users/`,usersRouter );
app.use(`${api}orders/`,ordersRouter );
app.use(`${api}categories/`,categoriesRouter );


mongoose.connect(process.env['DATABASE_CONNECT_CLOUD'] as string,{
    dbName: 'eshop-database'
})
.then(()=>{
    console.log('DB connection ready')
})
.catch((err)=>{
    console.log(err);
});

app.listen(3000, ()=>{

    console.log('Server is running on http://localhost:3000')
})




