import express, { Application } from 'express';
import logics from './logics';
import middlewares from './middlewares';

const app: Application = express();
app.use(express.json());

app.get('/products', logics.readProducts);
app.post('/products', middlewares.verifyIfNameExists, logics.createProducts);

app.use('/products/:id', middlewares.verifyIfIdExists);
app.patch('/products/:id', middlewares.verifyIfNameExistsOnUpdate, logics.updateProduct);
app.get('/products/:id', logics.retrieveProduct);
app.delete('/products/:id', logics.destroyProduct);

const PORT: number = 3000;
const runningMsg: string = `Server is running on http://localhost:${PORT}`;
app.listen(PORT, () => console.log(runningMsg));
