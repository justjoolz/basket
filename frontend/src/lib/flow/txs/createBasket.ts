export const CREATE_BASKET = `
import "NonFungibleToken"
import "Basket"

transaction() {

    prepare(signer: AuthAccount) {

        // Borrow the recipient's public NFT collection reference
        let receiver = signer
            .getCapability(Basket.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        let emptyVaultNFT <- Basket.createEmptyBasket()
        
        receiver.deposit(token: <- emptyVaultNFT)
    }
}
`