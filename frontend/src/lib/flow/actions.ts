import * as fcl from "@onflow/fcl";
import "./config";
import { user, transactionStatus, usersNFTs, usersFTs, ftTokens } from './stores';
import { GET_ALL_NFTS_IN_ACCOUNT_SCRIPT } from "./scripts";
import type { CurrentUser } from "@onflow/fcl/types/current-user";
import { CREATE_BASKET } from "./txs/createBasket";
import { TokenListProvider, type TokenInfo } from "flow-native-token-registry";
import { get } from "svelte/store";
import { GET_ACCOUNT_STORAGE_DETAILS } from "./scripts/get_account_storage_details";

// set Svelte $user store to currentUser, 
// so other components can access it
fcl.currentUser.subscribe(user.set)
// fcl.currentUser.subscribe((data: CurrentUser) => user.set(data))

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


function fetchTokenBalances(tokens: TokenInfo[]) {
    if (!tokens.length) return

    const balances: { token: string, balance: number }[] = []
    const _user: CurrentUser = get(user)
    if (!_user) return
    tokens.forEach(async (element) => {
        const balance = await getFTBalance(_user.addr ?? '', element)
        // delay 1s to avoid rate limit
        await new Promise(r => setTimeout(r, 1000));
        if (balance) balances.push({ token: element.symbol, balance: balance })
    });
    usersFTs.set(balances)
}


export const createEmptyBasket = async () => {
    console.log('createEmptyBasket')
    transactionStatus.set('Creating basket...');

    try {
        const txId = await fcl.mutate({
            cadence: CREATE_BASKET,
        })

        fcl.tx(txId).subscribe(res => {
            transactionStatus.set(res.status)
            console.log({ res })
        })
        transactionStatus.set('Basket created succesfully!')

    } catch (e) {
        transactionStatus.set(e)
        console.log(e);
    }
}

export const getFTBalance = async (addr: String, ft: TokenInfo) => {
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

const basket = {
    depositFT: async (baskedId: number, storagePath: string, amount: string) => {

        const cadence = `
        import FungibleToken
        import Basket
        
        transaction(basketID: UInt64, storagePath: String, amount: UFix64) {
            
            prepare(acct: AuthAccount) {
                let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's basket collection")
                let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's basket")
                
                let vaultRef = acct.borrow<&FungibleToken.Vault>(from: StoragePath(identifier: storagePath)!)
                ?? panic("Could not borrow reference to the owner's Vault @ /storage/".concat(storagePath))
                
                basket.depositFungibleTokens(from: <- vaultRef.withdraw(amount: amount))
            }
        }
        `
        transactionStatus.set(`depositing ${amount} of tokens from ${storagePath} to basket #${baskedId}`);

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
    },

    depositNFTs: async (baskedId: number, storagePath: string, ids: string[]) => {

        const cadence = `
        import NonFungibleToken
        import Basket
        
        transaction(basketID: UInt64, storagePath: String, ids: [UInt64]) {
            
            prepare(acct: AuthAccount) {
                let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's basket collection")
                let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's basket")
                
                let collectionRef = acct.borrow<&NonFungibleToken.Collection>(from: StoragePath(identifier: storagePath)!)
                ?? panic("Could not borrow reference to the owner's collection @ /storage/".concat(storagePath))
                
                for id in ids {
                    basket.depositNonFungibleTokens(from: <- collectionRef.withdraw(withdrawID: id)
                }
            }
        }
        `
        transactionStatus.set(`depositing ${JSON.stringify(ids)} tokens from ${storagePath} to basket #${baskedId}`);

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
    },

    bulkDepositNFTs: async (baskedId: number, storagePath: string, ids: string[]) => {

        const cadence = `
        import NonFungibleToken
        import Basket
        
        transaction(basketID: UInt64, storagePaths: [String], ids: [[UInt64]]) {
            
            prepare(acct: AuthAccount) {
                let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's basket collection")
                let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's basket")
                
                for storagePath in storagePaths {
                    let collectionRef = acct.borrow<&NonFungibleToken.Collection>(from: StoragePath(identifier: storagePath)!)
                    ?? panic("Could not borrow reference to the owner's collection @ /storage/".concat(storagePath))
                    
                    for id in ids {
                        basket.depositNonFungibleTokens(from: <- collectionRef.withdraw(withdrawID: id)
                    }
                }
            }
        }
        `
        transactionStatus.set(`depositing ${JSON.stringify(ids)} tokens from ${storagePath} to basket #${baskedId}`);

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


const sendTokens = async (recipient: string, amount: string) => {
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


const getFTs = () => {
    new TokenListProvider().resolve().then((tokens) => {
        const tokenList = tokens.getList();
        ftTokens.set(tokenList);
        return tokenList
    });
}

// Subscriptions ///////////////////////////////////////////////////

// on user fetch their data
user.subscribe((value) => {
    if (!value.loggedIn) return
    console.log('currentUser changed', { value });
    const usersAddress = (value as unknown as CurrentUser).addr;
    if (!usersAddress) { return }
    console.log('fetching nfts for currentUser', usersAddress);
    getUsersNFTs(usersAddress);
    getFTs();
});

ftTokens.subscribe((value) => {
    if (value.length == undefined) return
    console.log('ftTokens changed', value.length)
    transactionStatus.set('Fetching your FTs...');
    fetchTokenBalances(value)
})

usersFTs.subscribe((fungibles) => {
    if (fungibles.length === undefined) return
    console.log('usersFTs changed', { fungibles }, !fungibles.length)
})

usersNFTs.subscribe((value) => {
    if (!Object.keys(value).length) return
    console.log('usersNFTs changed', { value });
});

transactionStatus.subscribe((value) => {
    console.log('transactionStatus changed', { value });

});