import { Request, Response } from 'express';
import {
	ICleaningProduct,
	IFoodProduct,
	TProductCreate,
	TProductUpdate,
	TFoodProductCreate,
	TFoodProductUpdate,
} from './interfaces';
import { marketDatabase } from './database';

function getNextId(): number {
	const lastItem: ICleaningProduct | IFoodProduct | undefined = marketDatabase
		.sort((a, b): number => a.id - b.id)
		.at(-1);

	if (!lastItem) return 1;
	return lastItem.id + 1;
}

function addExpirationDate(date: Date) {
	date.setFullYear(date.getFullYear() + 1);
	return date;
}

function readProducts(request: Request, response: Response): Response {
	const total = marketDatabase.reduce(
		(previousValue, currentValue) => previousValue + currentValue.price,
		0
	);
	return response.status(200).json({ total: total, marketProducts: marketDatabase });
}

function createProducts(request: Request, response: Response): Response {
	const payload: (TProductCreate | TFoodProductCreate)[] = request.body;
	let count = getNextId();
	const newProducts: (ICleaningProduct | IFoodProduct)[] = payload.map(product => {
		const newProductInStock = {
			...product,
			id: count++,
			expirationDate: addExpirationDate(new Date()),
		};
		marketDatabase.push(newProductInStock);
		return newProductInStock;
	});
	const total = payload.reduce(
		(previousValue, currentValue) => previousValue + currentValue.price,
		0
	);

	return response.status(201).json({ total: total, marketProducts: newProducts });
}

function retrieveProduct(request: Request, response: Response): Response {
	const { foundProduct } = response.locals;
	return response.status(200).json(foundProduct);
}

function updateProduct(request: Request, response: Response): Response {
	const { foundProduct, productIndex } = response.locals;
	const payload: TProductUpdate | TFoodProductUpdate = request.body;

	const product: ICleaningProduct | IFoodProduct = (marketDatabase[productIndex] = {
		...foundProduct,
		...payload,
	});

	return response.status(200).json(product);
}

function destroyProduct(request: Request, response: Response): Response {
	const { productIndex } = response.locals;

	marketDatabase.splice(productIndex, 1);
	return response.status(204).json();
}

export default { createProducts, readProducts, retrieveProduct, updateProduct, destroyProduct };
