import FungibleToken from "../../contracts/lib/FungibleToken.cdc"
import FUSD from "../../contracts/lib/FUSD.cdc"

transaction {
  prepare(signer: AuthAccount) {

    let existingVault = signer.borrow<&FUSD.Vault>(from: /storage/FUSDVault)

    // If the account is already set up that's not a problem, but we don't want to replace it
    if (existingVault != nil) {
        return
    }
    
    // Create a new FUSD Vault and put it in storage
    signer.save(<-FUSD.createEmptyVault(), to: /storage/FUSDVault)

    // Create a public capability to the Vault that only exposes
    // the deposit function through the Receiver interface
    signer.link<&FUSD.Vault{FungibleToken.Receiver}>(
      /public/FUSDReceiver,
      target: /storage/FUSDVault
    )

    // Create a public capability to the Vault that only exposes
    // the balance field through the Balance interface
    signer.link<&FUSD.Vault{FungibleToken.Balance}>(
      /public/FUSDBalance,
      target: /storage/FUSDVault
    )
    
  }
}