import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import Basket from "../../contracts/Basket.cdc"
import FlowToken from "../../contracts/lib/FlowToken.cdc"

transaction(basketId: UInt64, amount: UFix64) {

    prepare(acct: AuthAccount) {

        let vaultRef = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
			?? panic("Could not borrow reference to the owner's Vault!")
        
        let baskets = acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) ?? panic("Could not borrow a reference to the owner's baskets collection")
        let basket = baskets.borrowBasket(id: basketId) ?? panic("Could not borrow a reference to the owner's basket")
        basket.depositFungibleTokens(from: <- vaultRef.withdraw(amount: amount))
    }
}
