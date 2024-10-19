use crate::states::LiquidityPool;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(id:i64)]
pub struct CreatePool<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
            init,
            seeds = [b"liquidity_pool", id.to_le_bytes().as_ref()],
            bump,
            payer = payer,
            space = LiquidityPool::INIT_SPACE
        )]
    pub liquidity_pool: Account<'info, LiquidityPool>,
    pub system_program: Program<'info, System>,
}


pub fn create_pool(ctx: Context<CreatePool>, id: i64, mint_a: Pubkey, mint_b: Pubkey)-> Result<()> {
    ctx.accounts.liquidity_pool.set_inner(LiquidityPool {
        pool_id: id,
        mint_a,
        mint_b
    });

    Ok(())
}