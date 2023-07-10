import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import Basket from "../../contracts/Basket.cdc"

transaction() {

    prepare(signer: AuthAccount) {

        // Borrow the recipient's public NFT basket collection reference
        let receiver = signer
            .getCapability(Basket.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the Basket Collection")

        let emptyVaultNFT <- Basket.createEmptyBasket()
        
        receiver.deposit(token: <- emptyVaultNFT)
    }
}
