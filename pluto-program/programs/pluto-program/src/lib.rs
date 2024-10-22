use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;
pub mod errors;
pub mod constants;
use instructions::*;

declare_id!("FiSidDP3YkEpgPCUq5DdTsxQ97hBrLrMU2RDg6HhzPsN");

#[program]
pub mod pluto_program {
    use super::*;

    pub fn init_pool(ctx: Context<CreatePool>) -> Result<()> {
        create_pool(ctx)
    }

    pub fn deposit_tokens(ctx: Context<DepositLiquidity>, amount_a: u64, amount_b: u64) -> Result<()> {
        deposit_liquidity(ctx, amount_a, amount_b)?;
        Ok(())
    }
}
