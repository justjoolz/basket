import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import NFTLoanAuction from "../../contracts/NFTLoanAuction.cdc"


pub fun main(address: Address) : [UInt64] {

    let account = getAccount(address)
    let cap = account.getCapability(NFTLoanAuction.LoanManagerPublicPath)
    let ref = cap.borrow<&NFTLoanAuction.LoanManager>()!
    
    return ref.loans.keys
}

