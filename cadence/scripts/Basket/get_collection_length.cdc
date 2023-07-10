import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import Basket from "../../contracts/Basket.cdc"

// This script returns the size of an account's VaultNFT collection.

pub fun main(address: Address): Int {
    // get the public account object for the token owner
    let account = getAccount(address)

    let collectionRef = account.getCapability(Basket.CollectionPublicPath)!
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}
