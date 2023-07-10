
import FungibleToken from "../../contracts/lib/FungibleToken.cdc"
import FUSD from "../../contracts/lib/FUSD.cdc"

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    let cap = account.getCapability(/public/FUSDBalance)
    let ref = cap.borrow<&FUSD.Vault{FungibleToken.Balance}>()
    return ref?.balance!
}
