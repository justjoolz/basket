import { writable } from 'svelte/store';
import type { CurrentUser } from '@onflow/fcl/types/current-user';
import { TokenListProvider } from 'flow-native-token-registry';
import type { TokenInfo } from 'flow-native-token-registry';

export const user = writable({} as CurrentUser);
export const usersNFTs = writable({} as NFTCatalogEntries);
export const ftTokens = writable({} as TokenInfo[]);
export const usersFTs = writable({} as { token: string; balance: number }[]);
export const usersBasketIds = writable({} as number[]);

export const transactionStatus = writable();
export const walletContents = writable();
export const basket = writable();

export function dictionaryToArray(dictionary: any) {
	return Object.keys(dictionary).map((key) => dictionary[key]) as NFTCatalogEntry[][];
}
export function ftDictionaryToArray(dictionary: any) {
	const objectArray = Object.keys(dictionary).map((key) => dictionary[key]) as FTCatalogEntry[];
	console.log('objectArray', objectArray);

	const filteredArray = objectArray.filter((item) => item.balance > 0);
	console.log('fitleredArray', filteredArray);
	return filteredArray;
}

export const getFTs = () => {
	new TokenListProvider().resolve().then((tokens) => {
		const tokenList = tokens.getList();
		console.log('token list', { tokenList });
		ftTokens.set(tokenList);
	});
};
