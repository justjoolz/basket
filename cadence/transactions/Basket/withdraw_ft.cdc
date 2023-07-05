import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import Basket from "../../contracts/Basket.cdc"
import FlowToken from "../../contracts/lib/FlowToken.cdc"

transaction(megaVaultID: UInt64, amount: UFix64) {

    prepare(acct: AuthAccount) {

        let vaultRef = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
			?? panic("Could not borrow reference to the owner's Vault!")
        
        let megaVaults = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's collection")
        let megaVault = megaVaults.borrowBasket(id: megaVaultID) ?? panic("Could not borrow a reference to the owner's MegaVault")
        
        let tokens <- megaVault.withdrawFungibleTokens(identifier: vaultRef.getType().identifier, amount: amount) 
            ?? panic("Cannot withdraw tokens")
        vaultRef.deposit(from: <- tokens)
    }
}
