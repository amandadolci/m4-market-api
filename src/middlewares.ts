import { NextFunction, Request, Response } from 'express';
import {
	ICleaningProduct,
	IFoodProduct,
	TProductCreate,
	TProductUpdate,
	TFoodProductCreate,
	TFoodProductUpdate,
} from './interfaces';
import { marketDatabase } from './database';

function verifyIfIdExists(
	request: Request,
	response: Response,
	next: NextFunction
): void | Response {
	const { id } = request.params;

	const foundProduct: ICleaningProduct | IFoodProduct | undefined = marketDatabase.find(
		(element: ICleaningProduct | IFoodProduct) => element.id === Number(id)
	);

	if (!foundProduct) {
		return response.status(404).json({ error: 'Product not found.' });
	}

	response.locals = {
		...response.locals,
		foundProduct,
		productIndex: marketDatabase.indexOf(foundProduct),
	};

	return next();
}

function verifyIfNameExists(request: Request, response: Response, next: NextFunction) {
	const payload: (TProductCreate | TFoodProductCreate)[] = request.body;
	let foundProduct = undefined;

	payload.forEach(productRequest => {
		foundProduct = marketDatabase.find(
			({ name }) => productRequest.name.toLowerCase() === name.toLowerCase()
		);
	});

	if (foundProduct) {
		return response.status(409).json({ error: 'Product already registered.' });
	}

	return next();
}

function verifyIfNameExistsOnUpdate(request: Request, response: Response, next: NextFunction) {
	const payload: TProductUpdate | TFoodProductUpdate = request.body;

	const foundProduct =
		marketDatabase.find(({ name }) => payload.name?.toLowerCase() === name.toLowerCase()) ||
		undefined;

	if (foundProduct) {
		return response.status(409).json({ error: 'Product already registered.' });
	}

	return next();
}

export default { verifyIfIdExists, verifyIfNameExists, verifyIfNameExistsOnUpdate };
