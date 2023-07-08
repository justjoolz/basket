import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import Basket from "../../contracts/Basket.cdc"
import ExampleNFT from "../../contracts/lib/ExampleNFT.cdc"

transaction(basketID: UInt64, storagePath: String, ids: [UInt64]) {
    
    prepare(acct: AuthAccount) {
        let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's basket collection")
        let basket = baskets.borrowBasket(id: basketID) ?? panic("Could not borrow a reference to the owner's basket")
        
        let collectionRef = acct.borrow<&NonFungibleToken.Collection>(from: StoragePath(identifier: storagePath)!)
        ?? panic("Could not borrow reference to the owner's collection @ /storage/".concat(storagePath))
        
        let collection <- ExampleNFT.createEmptyCollection()
        for id in ids {
            collection.deposit(token: <- collectionRef.withdraw(withdrawID: id))
        }
        basket.depositNonFungibleTokens(from: <- collection)
    }
}