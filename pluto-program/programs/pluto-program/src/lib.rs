use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;

use instructions::*;

declare_id!("HtdeUxcuZJffCTVipULK7gVBkYVtgG8pTGF1pjEDYWRE");

#[program]
pub mod pluto_program {
    use super::*;

    pub fn init_pool(ctx: Context<CreatePool>) -> Result<()> {
        create_pool(ctx)?;
        Ok(())
    }
}
