use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;
pub mod errors;
pub mod constants;
use instructions::*;

declare_id!("HtdeUxcuZJffCTVipULK7gVBkYVtgG8pTGF1pjEDYWRE");

#[program]
pub mod pluto_program {
    use super::*;

    pub fn init_pool(ctx: Context<CreatePool>) -> Result<()> {
        create_pool(ctx)?;
        Ok(())
    }

    pub fn deposit_tokens(ctx: Context<DepositLiquidity>, amount_a: u64, amount_b: u64) -> Result<()> {
        deposit_liquidity(ctx, amount_a, amount_b)?;
        Ok(())
    }
}
