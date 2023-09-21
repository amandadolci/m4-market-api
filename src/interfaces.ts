interface IProduct {
	id: number;
	name: string;
	price: number;
	weight: number;
	section: 'food' | 'cleaning';
	expirationDate: Date;
}

interface ICleaningProduct extends IProduct {}

interface IFoodProduct extends IProduct {
	calories: number;
}

type TProductCreate = Omit<IProduct, 'id' | 'date'>;
type TProductUpdate = Partial<TProductCreate>;
type TFoodProductCreate = Omit<IFoodProduct, 'id' | 'date'>;
type TFoodProductUpdate = Partial<TFoodProductCreate>;

export {
	ICleaningProduct,
	IFoodProduct,
	TProductCreate,
	TProductUpdate,
	TFoodProductCreate,
	TFoodProductUpdate,
};
