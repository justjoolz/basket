import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import Basket from "../../contracts/Basket.cdc"

// This script returns the nft ids of an account's VaultNFT collection. indexed by type identifier

pub fun main(address: Address, id: UInt64): {String: [UInt64]} {
    // get the public account object for the token owner
    let account = getAccount(address)

    let collectionRef = account.getCapability(Basket.CollectionPublicPath)
        .borrow<&{Basket.BasketCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    let megaVault = collectionRef.borrowBasket(id: id) ?? panic("Could not borrow a reference to the specified MegaVault")
    return megaVault.getNFTs()
}
