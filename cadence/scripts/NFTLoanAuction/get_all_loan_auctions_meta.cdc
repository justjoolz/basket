import NFTLoanAuction from "../../contracts/NFTLoanAuction.cdc"

pub fun main(): {UInt64: NFTLoanAuction.LoanAuctionMeta} {
    return NFTLoanAuction.getAllLoanAuctionsMeta() 
}

