flow project deploy
flow transactions send ./transactions/Basket/setup_account.cdc && flow transactions send ./transactions/Basket/create_empty_basket.cdc

flow transactions send ./transactions/ExampleNFT/setup_account.cdc && flow transactions send ./transactions/ExampleNFT/mint_nft.cdc f8d6e0586b0a20c7  MyNFT "TestNFT" "https://www.shutterstock.com/shutterstock/photos/1941101041/display_1500/stock-vector-colorful-simple-flat-pixel-art-illustration-of-cartoon-cute-kitten-sitting-in-an-open-cardboard-box-1941101041.jpg" \[\] \[\] \[\]

flow transactions send ./transactions/Basket/deposit_nft.cdc 0 exampleNFTCollection \[0\]

flow transactions send ./transactions/Basket/deposit_flow.cdc 0 0.01


flow scripts execute ./scripts/Basket/get_balances.cdc f8d6e0586b0a20c7 0
flow scripts execute ./scripts/Basket/get_collection_length.cdc f8d6e0586b0a20c7
flow scripts execute ./scripts/Basket/get_nft_metadata.cdc f8d6e0586b0a20c7 0 
flow scripts execute ./scripts/Basket/get_nfts.cdc f8d6e0586b0a20c7 0 
flow scripts execute ./scripts/Basket/get_supply.cdc 
flow scripts execute ./scripts/Basket/read_collection_ids.cdc f8d6e0586b0a20c7

flow scripts execute ./scripts/Basket/get_internal_metadata.cdc f8d6e0586b0a20c7 0