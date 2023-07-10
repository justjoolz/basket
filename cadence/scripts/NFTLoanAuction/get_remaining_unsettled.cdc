import FUSD from "../../contracts/lib/FUSD.cdc"
import NFTLoanAuction from "../../contracts/NFTLoanAuction.cdc"

pub fun main(auctionID: UInt64): UFix64 {
  return NFTLoanAuction.getRemainingUnsettled(auctionID: auctionID)

}