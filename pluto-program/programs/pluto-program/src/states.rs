use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct LiquidityPool {
    pub mint_a: Pubkey,
    pub mint_b: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct LiquidityProvider {
    
}