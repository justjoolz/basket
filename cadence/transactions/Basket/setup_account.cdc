import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import Basket from "../../contracts/Basket.cdc"
// This transaction is what an account would run
// to set itself up to receive NFTs

transaction {

    prepare(acct: AuthAccount) {

        // Return early if the account already has a collection
        if acct.borrow<&Basket.Collection>(from: Basket.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- Basket.createEmptyCollection()

        // save it to the account
        acct.save(<-collection, to: Basket.CollectionStoragePath)

        // create a public capability for the collection
        acct.link<&{NonFungibleToken.CollectionPublic, Basket.BasketCollectionPublic}>(
            Basket.CollectionPublicPath,
            target: Basket.CollectionStoragePath
        )
    }
}
