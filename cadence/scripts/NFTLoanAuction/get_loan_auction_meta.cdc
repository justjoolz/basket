import NFTLoanAuction from "../../contracts/NFTLoanAuction.cdc"

pub fun main(id: UInt64) : NFTLoanAuction.LoanAuctionMeta {
    return NFTLoanAuction.getLoanAuctionMeta(id: id) 
}

