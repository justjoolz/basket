import * as fcl from "@onflow/fcl";
import "./config.client";
import { user, transactionStatus, usersNFTs, usersFTs, ftTokens, usersBasketIds, selectedBasketMeta, nftCatalog } from './stores.client';
import { GET_ALL_NFTS_IN_ACCOUNT_SCRIPT } from "./scripts";
import type { CurrentUser } from "@onflow/fcl/types/current-user";
import { CREATE_BASKET } from "./txs/createBasket";
import { TokenListProvider, type TokenInfo, ENV, Strategy } from "flow-native-token-registry";
import { get } from "svelte/store";
import { GET_ACCOUNT_STORAGE_DETAILS } from "./scripts/get_account_storage_details";
import { GET_BASKETS } from "./scripts/get_baskets";
import { GET_BASKET_METADATA } from "./scripts/get_nft_metadata";
import { PUBLIC_FLOW_NETWORK } from "$env/static/public";
import { setupFCL } from "./config.client";
import { browser } from "$app/environment";

export const ssr = false;


// Lifecycle FCL Auth functions
export const unauthenticate = () => fcl.unauthenticate()
export const logIn = () => fcl.logIn()
export const signUp = () => fcl.signUp()

export const getUsersNFTs = async (addr: String) => {
    if (!addr) { return }
    transactionStatus.set(`Fetching your NFTs... ${addr}`);

    try {
        const nfts = await fcl.query({
            cadence: GET_ALL_NFTS_IN_ACCOUNT_SCRIPT,
            args: (arg, t) => [arg(addr, t.Address)]
        })

        usersNFTs.set(nfts ?? 'No NFTs found');
        transactionStatus.set('NFTs fetched successfully!')

    } catch (e) {
        transactionStatus.set(e)
        console.log(e);
    }
}


export const getAccountStorageDetails = async (addr: String) => {
    if (!addr) { return }
    transactionStatus.set('Reading your account storage...');

    try {
        const storageDetails = await fcl.query({
            cadence: GET_ACCOUNT_STORAGE_DETAILS,
            args: (arg, t) => [arg(addr, t.Address)]
        })

        console.log({ storageDetails })

        // usersNFTs.set(nfts ?? 'No NFTs found');
        transactionStatus.set('Account storage details loaded.')

    } catch (e) {
        transactionStatus.set(e)
        console.log(e);
    }
}

export const getBaskets = async (addr: String) => {
    if (!addr) { return }
    transactionStatus.set('Reading your baskets...');

    try {
        const basketIds = await fcl.query({
            cadence: GET_BASKETS,
            args: (arg, t) => [arg(addr, t.Address)]
        })

        console.log({ basketIds })

        transactionStatus.set('Baskets loaded.')
        usersBasketIds.set(basketIds)

    } catch (e) {
        transactionStatus.set(e)
        console.log(e);
    }
}


export const fetchBasketMetadata = async (nftId: String) => {
    const addr = get(user).addr
    if (!addr) { return }
    transactionStatus.set(`Reading your Basket metadata... ${addr} - ${nftId}`);

    try {
        const basketMeta = await fcl.query({
            cadence: GET_BASKET_METADATA,
            args: (arg, t) => [arg(addr, t.Address), arg(nftId, t.UInt64)]
        })

        basketMeta.id = nftId
        selectedBasketMeta.set(basketMeta)

        // usersNFTs.set(nfts ?? 'No NFTs found');
        transactionStatus.set(`Basket ${nftId} metadata loaded.`)
        return selectedBasketMeta
    } catch (e) {
        transactionStatus.set(e)
        console.log(e);
    }
}


export async function fetchTokenBalances(tokens: TokenInfo[]) {
    if (!tokens.length) return

    const balances: { token: string, balance: number }[] = []
    const _user: CurrentUser = get(user)
    if (!_user) return

    const promises = tokens.map(async element => {
        const balance = await getFTBalance(_user.addr ?? '', element);
        // delay 1s to avoid rate limit
        await new Promise(r => setTimeout(r, 1000));
        if (balance) {
            balances.push({
                token: element.symbol,
                balance
            });
        }
    });

    await Promise.all(promises);

    console.log({ balances })
    return usersFTs.set(balances)
}


export const createEmptyBasket = async () => {
    console.log('createEmptyBasket')
    transactionStatus.set('Creating basket...');

    try {
        const txId = await fcl.mutate({
            cadence: CREATE_BASKET,
        })

        fcl.tx(txId).onceSealed().then(res => {
            transactionStatus.set('Basket created!')
            getBaskets(get(user).addr ?? '')
        })
    } catch (e) {
        transactionStatus.set(e)
        console.log(e);
    }
}

export const getFTBalance = async (addr: String, ft: TokenInfo) => {
    if (!addr) { return }
    transactionStatus.set(`Fetching your FTs... ${ft.name}`);

    const code = `
import FungibleToken from 0xFungibleToken
import ${ft.contractName} from ${ft.address}

pub fun main(address: Address): UFix64? {
    let account = getAccount(address)

    let vaultRef = account.getCapability(${ft.path.balance})
      .borrow<&{FungibleToken.Balance}>()
      // ?? panic("Could not borrow Balance reference to the ${ft.contractName} Vault")

    if vaultRef == nil { return nil }

    return vaultRef?.balance!
  }
`
    try {
        const balance = await fcl.query({
            cadence: code,
            args: (arg, t) => [arg(addr, t.Address)]
        })
        if (!balance) return null
        transactionStatus.set(`FT ${ft.name} balance fetched successfully! ${ft.symbol} ${balance}`)
        return balance
        // usersNFTs.set(nfts ?? 'No NFTs found');
    } catch (e) {
        return null
        transactionStatus.set(e)
        console.log(e);
    }

}

export const basketTxs = {
    depositFT: async (basketId: string, storagePath: string, amount: string) => {
        const cadence = `
        import "FungibleToken"
        import "Basket"
        
        transaction(basketID: UInt64, storagePath: String, amount: UFix64) {
            
            prepare(acct: AuthAccount) {
                let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's basket collection")
                let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's basket")
                
                let vaultRef = acct.borrow<&FungibleToken.Vault>(from: ${storagePath})
                ?? panic("Could not borrow reference to the owner's Vault @ /storage/".concat(storagePath))
                
                basket.depositFungibleTokens(from: <- vaultRef.withdraw(amount: amount))
            }
        }
        `

        console.log({ cadence })
        transactionStatus.set(`depositing ${amount} of tokens from ${storagePath} to basket #${basketId}`);

        try {
            const txId = await fcl.mutate({
                cadence: cadence,
                args: (arg, t) => [arg(basketId, t.UInt64), arg(storagePath, t.String), arg(amount, t.UFix64)]
            })

            fcl.tx(txId).subscribe(res => {
                transactionStatus.set(res.status)
                console.log({ res })
            })
            transactionStatus.set('deposit succesful!')


        } catch (e) {
            transactionStatus.set(e)
            console.log(e);
        }
    },

    withdrawFT: async (baskedId: string, storagePath: string, amount: string) => {
        const cadence = `import "FungibleToken" 
        import "Basket" 
        
        transaction(basketID: UInt64, amount: UFix64) {
        
            prepare(acct: AuthAccount) {
        
                let vaultRef = acct.borrow<&FungibleToken.Vault>(from: ${storagePath})
                ?? panic("Could not borrow reference to the owner's Vault @ ${storagePath}")
                
                let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's collection")
                let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's MegaVault")
                
                let tokens <- basket.withdrawFungibleTokens(identifier: vaultRef.getType().identifier, amount: amount) 
                    
                vaultRef.deposit(from: <- tokens)
            }
        }
        `
        console.log({ cadence })
        transactionStatus.set(`withdrawing ${amount} tokens from basket #${baskedId} to ${storagePath} `);

        try {
            const txId = await fcl.mutate({
                cadence: cadence,
                args: (arg, t) => [arg(baskedId, t.UInt64), arg(amount, t.UFix64)]
            })

            fcl.tx(txId).subscribe(res => {
                transactionStatus.set(res.status)
                console.log({ res })
            })
            transactionStatus.set('deposit succesful!')

        } catch (e) {
            transactionStatus.set(e)
            console.log(e);
        }
    },

    depositFTs: async (baskedId: string, storagePaths: string[], amounts: string[]) => {
        let cadence = `
        import "FungibleToken"
        import "Basket"
        
        transaction(basketID: UInt64) {
            
            prepare(acct: AuthAccount) {
                let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's basket collection")
                let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's basket")
        `

        for (let i = 0; i < storagePaths.length; i++) {
            const storagePath = storagePaths[i];
            const amount = amounts[i];

            cadence += `
                let vaultRef = acct.borrow<&FungibleToken.Vault>(from: ${storagePath})
                ?? panic("Could not borrow reference to the owner's Vault @ /storage/".concat(storagePath))

                basket.depositFungibleTokens(from: <- vaultRef.withdraw(amount: ${amount}))
                `
        }

        cadence += `
            }
        }
        `

        console.log({ cadence })
        transactionStatus.set(`depositing ${JSON.stringify(amounts)} of tokens from ${JSON.stringify(storagePaths)} to basket #${basketId}`);

        try {
            const txId = await fcl.mutate({
                cadence: cadence,
                args: (arg, t) => [arg(basketId, t.UInt64)]
            })

            fcl.tx(txId).subscribe(res => {
                transactionStatus.set(res.status)
                console.log({ res })
            })
            transactionStatus.set('deposit succesful!')

        } catch (e) {
            transactionStatus.set(e)
            console.log(e);
        }
    },
    withdrawFT: async (basketId: string, storagePath: string, amount: string) => {
        const cadence = `import "FungibleToken" 
        import "Basket" 
        
        transaction(basketID: UInt64, amount: UFix64) {
        
            prepare(acct: AuthAccount) {
        
                let vaultRef = acct.borrow<&FungibleToken.Vault>(from: ${storagePath})
                ?? panic("Could not borrow reference to the owner's Vault @ ${storagePath}")
                
                let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's collection")
                let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's MegaVault")
                
                let tokens <- basket.withdrawFungibleTokens(identifier: vaultRef.getType().identifier, amount: amount) 
                    
                vaultRef.deposit(from: <- tokens)
            }
        }
        `
        console.log({ cadence })
        transactionStatus.set(`withdrawing ${amount} tokens from basket #${basketId} to ${storagePath} `);

        try {
            const txId = await fcl.mutate({
                cadence: cadence,
                args: (arg, t) => [arg(basketId, t.UInt64), arg(amount, t.UFix64)]
            })

            fcl.tx(txId).subscribe(res => {
                transactionStatus.set(res.status)
                console.log({ res })
            })
            transactionStatus.set('deposit succesful!')

        } catch (e) {
            transactionStatus.set(e)
            console.log(e);
        }
    },
    // deposit multiple nfts from a single collection
    depositNFTs: async (basketId: string, storagePath: string, ids: string[], contractName: string, address: string) => {
        console.log({ basketId, storagePath, ids, contractName, address })
        const cadence = `
        import NonFungibleToken from 0xNonFungibleToken
        import Basket from 0xBasket
        import ${contractName} from ${address}
        
        transaction(basketID: UInt64, storagePath: String, ids: [UInt64], address: Address) {
            
            prepare(acct: AuthAccount) {
                let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's basket collection")
                let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's basket")
                
                let collectionRef = acct.borrow<&NonFungibleToken.Collection>(from: StoragePath(identifier: storagePath)!)
                ?? panic("Could not borrow reference to the owner's collection @ /storage/".concat(storagePath))
                
                // let contract = getAccount(address).contracts.borrow<&${contractName}.Collection>(name: "${contractName}")

                let emptyCollection <- ${contractName}.createEmptyCollection()

                for id in ids {
                    let nft <- collectionRef.withdraw(withdrawID: id)
                    emptyCollection.deposit(token: <- nft)
                }
                basket.depositNonFungibleTokens(from: <- emptyCollection)
            }
        }
        `
        console.log({ cadence })
        transactionStatus.set(`depositing ${JSON.stringify(ids)} tokens from ${storagePath} to basket #${basketId}`);

        console.log(basketId, storagePath, ids, address)

        try {
            const txId = await fcl.mutate({
                cadence: cadence,
                args: (arg, t) => [arg(parseInt(basketId), t.UInt64), arg(storagePath, t.String), arg(ids.map((id) => parseInt(id)), t.Array(t.UInt64)), arg(address, t.Address)]
            })

            fcl.tx(txId).subscribe(res => {
                transactionStatus.set(res.status)
                console.log({ res })
            })
            transactionStatus.set('deposit succesful!')

        } catch (e) {
            transactionStatus.set(e)
            console.log(e);
        }
    },
    withdrawNFTs: async (basketId: string, storagePath: string, ids: string[], contractName: string, address: string) => {
        console.log({ basketId, storagePath, ids, contractName, address })

        const cadence = `
        import NonFungibleToken from 0xNonFungibleToken
        import Basket from 0xBasket
        import ${contractName} from ${address}
        
        transaction(basketID: UInt64, storagePath: String, ids: [UInt64], address: Address) {
            
            prepare(acct: AuthAccount) {
                let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's basket collection")
                let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's basket")
                
                let collectionRef = acct.borrow<&NonFungibleToken.Collection>(from: StoragePath(identifier: storagePath)!)
                ?? panic("Could not borrow reference to the owner's collection @ /storage/".concat(storagePath))
                
                let emptyCollection <- ${contractName}.createEmptyCollection()

                let tokensToDeposit <- basket.withdrawNonFungibleTokens(targetCollection: <- emptyCollection, ids: ids)

                // let contract = getAccount(address).contracts.borrow<&${contractName}.Collection>(name: "${contractName}")

                for id in tokensToDeposit.getIDs() {
                    let nft <- tokensToDeposit.withdraw(withdrawID: id)
                    collectionRef.deposit(token: <- nft)
                }
                destroy tokensToDeposit
                
            }
        }
        `
        console.log({ cadence })
        transactionStatus.set(`depositing ${JSON.stringify(ids)} tokens from ${storagePath} to basket #${basketId}`);

        console.log(basketId, storagePath, ids, address)

        try {
            const txId = await fcl.mutate({
                cadence: cadence,
                args: (arg, t) => [arg(parseInt(basketId), t.UInt64), arg(storagePath, t.String), arg(ids.map((id) => parseInt(id)), t.Array(t.UInt64)), arg(address, t.Address)]
            })

            fcl.tx(txId).subscribe(res => {
                transactionStatus.set(res.status)
                console.log({ res })
            })
            transactionStatus.set('deposit succesful!')

        } catch (e) {
            transactionStatus.set(e)
            console.log(e);
        }
    },

    // deposit multiple nfts from multiple collections
    // todo: add support for multiple collections
    bulkDepositNFTs: async (basketId: number, collectionNames: string[], importAddresses: string[], storagePaths: string, ids: string[][]) => {

        let cadence = `
        import NonFungibleToken from 0xNonFungibleToken
        import Basket from 0xBasket
        `

        // add collection imports
        for (let i = 0; i < collectionNames.length; i++) {
            cadence += `
            import ${collectionNames[0]} from ${importAddresses[0]}
            `
        }

        cadence += `
        transaction(basketID: UInt64, storagePath: String, ids: [UInt64], address: Address) {
            
            prepare(acct: AuthAccount) {
                let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's basket collection")
                let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's basket")
                
                `

        // for each collection
        for (let i = 0; i < collectionNames.length; i++) {
            cadence += `
                let collectionRef = acct.borrow<&NonFungibleToken.Collection>(from: StoragePath(identifier: ${storagePaths[i]})!)
                ?? panic("Could not borrow reference to the owner's collection @ /storage/".concat(${storagePaths[i]}))

                // let contract = getAccount(address).contracts.borrow<&${collectionNames[i]}.Collection>(name: "${collectionNames[i]}")
                
                let emptyCollection <- ${collectionNames[i]}.createEmptyCollection()
            `

            for (let j = 0; j < ids[i].length; j++) {
                cadence += `
                for id in ids {
                    let nft <- collectionRef.withdraw(withdrawID: id)
                    emptyCollection.deposit(token: <- nft)
                }
                basket.depositNonFungibleTokens(from: <- emptyCollection)
                `
            }
        }

        cadence += `
            }
        }
        `

        console.log({ cadence })

        transactionStatus.set(`depositing ${JSON.stringify(ids)} tokens from ${JSON.stringify(storagePaths)} to basket #${basketId}`);

        try {
            const txId = await fcl.mutate({
                cadence: cadence,
            })

            fcl.tx(txId).subscribe(res => {
                transactionStatus.set(res.status)
                console.log({ res })
            })
            transactionStatus.set('deposit succesful!')

        } catch (e) {
            transactionStatus.set(e)
            console.log(e);
        }
    }
}


export const sendTokens = async (recipient: string, amount: string) => {
    const cadence = `
    import FungibleToken from 0xFungibleToken
    import FlowToken from 0xFLOW

    transaction(recepient: Address, amount: UFix64){
      prepare(signer: AuthAccount){
        let sender = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow Provider reference to the Vault")

        let receiverAccount = getAccount(recepient)

        let receiver = receiverAccount.getCapability(/public/flowTokenReceiver)
          .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()
          ?? panic("Could not borrow Receiver reference to the Vault")

                let tempVault <- sender.withdraw(amount: amount)
        receiver.deposit(from: <- tempVault)
      }
    }
  `;
    const args = (arg: (arg0: string, arg1: string) => any, t: { Address: any; UFix64: any; }) => [arg(recipient, t.Address), arg(amount, t.UFix64)];
    const limit = 500;

    const txId = await fcl.mutate({ cadence, args, limit });

    console.log("Waiting for transaction to be sealed...");

    const txDetails = await fcl.tx(txId).onceSealed();
    console.log({ txDetails });
};


const getFTs = async () => {
    console.log("getting token list")
    let env = PUBLIC_FLOW_NETWORK === 'mainnet' ? ENV.Mainnet : ENV.Testnet;
    console.log(PUBLIC_FLOW_NETWORK, env)
    return new TokenListProvider().resolve("CDN" as Strategy, env).then((tokens) => {
        const tokenList = tokens.getList();
        ftTokens.set(tokenList);
        console.log("set token list")
        return tokenList
    });
}

const getNFTCatalog = async () => {
    const addr = get(user).addr
    console.log("GETTTING CATALOG ENTRIESSSSSSSSS")
    if (!addr) { return }

    transactionStatus.set(`Fetching NFTCatalog...`);

    // import NFTCatalog from 0x49a7cda3a1eecc29
    const cadence = `
    import "NFTCatalog" 

    pub fun main(): {String: NFTCatalog.NFTCatalogMetadata} {
        let catalogKeys = NFTCatalog.getCatalogKeys()    
        let collections: {String: NFTCatalog.NFTCatalogMetadata} = {}
    
        for key in catalogKeys {
            collections[key] = NFTCatalog.getCatalogEntry(collectionIdentifier: key)
        }
    
        return collections
    }
    `
    console.log({ cadence })
    try {
        const catalogEntries = await fcl.query({
            cadence: cadence
        })
        console.log({ catalogEntries })
        nftCatalog.set(catalogEntries)

        // if (!balance) return null
        // transactionStatus.set(`FT ${ft.name} balance fetched successfully! ${ft.symbol} ${balance}`)
        // return balance
        // usersNFTs.set(nfts ?? 'No NFTs found');
    } catch (e) {
        // return null
        transactionStatus.set(e)
        console.log(e);
    }


}


async function fetchUsersData() {
    await getUsersNFTs(get(user).addr ?? '');

    await getFTs().then(async (ftTokens) => {
        console.log('fetching token balances....')
        await fetchTokenBalances(ftTokens)
    });

    await getNFTCatalog()

    await getBaskets(get(user).addr ?? '');
}

export function handleUserChange(user: CurrentUser) {
    console.log('currentUser changed', { user }, '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    setupFCL()
    if (user?.loggedIn) {
        transactionStatus.set('logged in fetching users data ');
        fetchUsersData();
    } else {
        usersNFTs.set({});
        usersFTs.set([]);
        usersBasketIds.set([]);
        selectedBasketMeta.set({
            name: "",
            description: "",
            thumbnail: "",
            owner: "",
            type: "",
            royalties: [],
            externalURL: "",
            serialNumber: "",
            collectionPublicPath: {
                domain: "",
                identifier: ""
            },
            collectionStoragePath: {
                domain: "",
                identifier: ""
            },
            collectionProviderPath: {
                domain: "",
                identifier: ""
            },
            collectionPublic: "",
            collectionPublicLinkedType: "",
            collectionProviderLinkedType: "",
            collectionName: "",
            collectionDescription: "",
            collectionExternalURL: "",
            collectionSquareImage: "",
            collectionBannerImage: "",
            collectionSocials: {
                twitter: ""
            },
            edition: {
                name: "",
                number: "",
                max: null
            },
            traits: {
                traits: [
                    {
                        name: "",
                        value: "",
                        displayType: "",
                        rarity: null
                    }
                ]
            },
            medias: undefined,
            license: null,
            id: ""
        });
        transactionStatus.set('logged out')
    }
}
