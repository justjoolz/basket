import * as fcl from "@onflow/fcl";
import "./config";
import { user, transactionStatus, usersNFTs, usersFTs, getFTs, ftTokens } from './stores';
import { GET_ACCOUNT_STORAGE_DETAILS, GET_ALL_NFTS_IN_ACCOUNT_SCRIPT } from "./scripts";
import type { CurrentUser } from "@onflow/fcl/types/current-user";
import { CREATE_BASKET } from "./scripts/createBasket";
import type { TokenInfo } from "flow-native-token-registry";
import { get } from "svelte/store";

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
    transactionStatus.set('Fetching your NFTs...');

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

// on user fetch their data
user.subscribe((value) => {
    if (!value) {
        return;
    }
    console.log('currentUser changed', { value });
    const usersAddress = (value as unknown as CurrentUser).addr;
    if (!usersAddress) { return }
    console.log('fetching nfts for currentUser', usersAddress);
    getUsersNFTs(usersAddress);
    let tokens = getFTs()
});

ftTokens.subscribe((value) => {
    transactionStatus.set('Fetching your FTs...');
    fetchTokenBalances(value)
})

usersFTs.subscribe((fungibles) => {
    console.log('usersFTs changed', { fungibles });
    console.log(fungibles)
})

// usersNFTs.subscribe((value) => {
//     console.log('usersNFTs changed', { value });
// });

function fetchTokenBalances(tokens: TokenInfo[]) {
    if (!tokens.length) return

    const balances: { token: string, balance: number }[] = []
    tokens.forEach(async (element) => {
        const _user: CurrentUser = get(user)
        if (!_user) return
        const balance = await getUsersFTs(_user.addr ?? '', element)
        balances.push({ token: element.symbol, balance: balance })
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

export const getUsersFTs = async (addr: String, ft: TokenInfo) => {
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
        transactionStatus.set(`FT ${ft.name} balance fetched successfully! ${ft.symbol} ${balance}`)
        return balance
        // usersNFTs.set(nfts ?? 'No NFTs found');
    } catch (e) {
        return null
        transactionStatus.set(e)
        console.log(e);
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
