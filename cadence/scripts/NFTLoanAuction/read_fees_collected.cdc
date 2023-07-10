import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import NFTLoanAuction from "../../contracts/NFTLoanAuction.cdc"

pub fun main(): AnyStruct {
    return NFTLoanAuction.readFees()
}
