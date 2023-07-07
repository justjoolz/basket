type Field = {
	type: {
		kind: string;
		key?: {
			kind: string;
		};
		value?: {
			type: string;
			kind: string;
			typeID: string;
			fields: Field[];
			initializers: any[];
		};
	};
	id: string;
};

type Restriction = {
	type: string;
	kind: string;
	typeID: string;
	fields: Field[];
	initializers: any[];
};

type LinkedType = {
	type: {
		kind: string;
		typeID: string;
		type: Restriction;
		restrictions: Restriction[];
	};
	kind: string;
	authorized: boolean;
};

type Path = {
	domain: string;
	identifier: string;
};

type NFTCatalogEntry = {
	id: string;
	name: string;
	description: string;
	thumbnail: string;
	externalURL: string;
	storagePath: Path;
	publicPath: Path;
	privatePath: Path;
	publicLinkedType: LinkedType;
	privateLinkedType: LinkedType;
	collectionName: string;
	collectionDescription: string;
	collectionSquareImage: string;
	collectionBannerImage: string;
	collectionExternalURL: string;
	royalties: any[];
};

// type FTCatalogEntry = {
// 	address: string;
// 	contractName: string;
// 	decimals: number;
// 	extensions: { website: string; twitter: string; discord: string };
// 	logoURI: string;
// 	name: string;
// 	path: { vault: string; balance: string; receiver: string };
// 	symbol: string;
// 	tags: string[];
// };

type FTCatalogEntry = {
	token: string;
	balance: number;
};

type NFTCatalogEntries = {
	[key: string]: NFTCatalogEntry;
};
