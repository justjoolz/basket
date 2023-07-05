import NonFungibleToken from "../../contracts/lib/NonFungibleToken.cdc"
import Basket from "../../contracts/Basket.cdc"

// This transaction returns a UInt64 

pub fun main(): UInt64 {
    return Basket.totalSupply
}
