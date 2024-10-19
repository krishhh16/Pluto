use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct liquidity_pool{
    pub creator: Pubkey,
    pub escrow_id: i64,
    #[max_len(40)]
    mint_a: String,
    #[max_len(40)]
    mint_b: String,
    reserve_a: i64,
    reserve_b: i64
}