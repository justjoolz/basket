import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import NFTLoanAuction from "../../contracts/NFTLoanAuction.cdc"


pub fun main(auctionID: UInt64): [NFTLoanAuction.LedgerItem] {
    // get the public account object for the token owner

    for i in NFTLoanAuction.borrowLoanAuction(id: auctionID).readLedger() {
        log(i)
    }

    return NFTLoanAuction.borrowLoanAuction(id: auctionID).readLedger()
}
