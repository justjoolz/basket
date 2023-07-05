import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import FungibleToken from "../../contracts/lib/FungibleToken.cdc"
import Basket from "../../contracts/Basket.cdc"

transaction(megaVaultID: UInt64, amount: UFix64) {

    prepare(acct: AuthAccount) {
        let vaultRef = acct.borrow<&{FungibleToken.Vault}>(from: StoragePath(storagePath)) // /storage/flowTokenVault 
			?? panic("Could not borrow reference to the owner's Vault!")
        
        let megaVaults = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's collection")
        let megaVault = megaVaults.borrowBasket(id: megaVaultID) ?? panic("Could not borrow a reference to the owner's MegaVault")
        megaVault.depositFungibleTokens(from: <- provider.withdraw(amount: amount))
    }
}
