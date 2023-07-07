import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import FungibleToken from "../../contracts/lib/FungibleToken.cdc"
import Basket from "../../contracts/Basket.cdc"

transaction(basketID: UInt64, storagePath: String, amount: UFix64) {

    prepare(acct: AuthAccount) {
        let vaultRef = acct.borrow<&FungibleToken.Vault>(from: StoragePath(identifier: storagePath)!) // /storage/flowTokenVault 
			?? panic("Could not borrow reference to the owner's Vault! /storage/".concat(storagePath))
        
        let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's basket collection")
        let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's basket")
        basket.depositFungibleTokens(from: <- vaultRef.withdraw(amount: amount))
    }
}
