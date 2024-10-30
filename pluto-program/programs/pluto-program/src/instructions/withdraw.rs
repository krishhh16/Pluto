use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Burn, Mint, TokenAccount, Transfer, Token}
};

use fixed::types::I64F64;

use crate::{
    constants::*,
    states::*
};


pub fn widthdraw_lp(ctx: Context<Withdraw>, amount: u64) -> Result<()> {

    let authroity_bumps = ctx.bumps.pool_authority;
    let authority_seeds = &[
        &ctx.accounts.mint_a.key().to_bytes(),
        &ctx.accounts.mint_b.key().to_bytes(),
        AUTHORITY_SEED,
        &[authroity_bumps]
        ];
        let signer_seeds = &[&authority_seeds[..]];
        // amount_a=  (amount * pool_a_amount) / mintLiquidity supply
        
        
        let amount_a = I64F64::from_num(amount)
        .checked_mul(I64F64::from_num(ctx.accounts.pool_account_a.amount))
        .unwrap()
        .checked_div(I64F64::from_num(
            ctx.accounts.mint_liquidity.supply + MINIMUM_LIQUIDITY
        ))
        .unwrap()
        .floor()
        .to_num::<u64>();
      
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.pool_account_a.to_account_info(),
                to: ctx.accounts.withdrawer_account_a.to_account_info(),
                authority: ctx.accounts.pool_authority.to_account_info(),
            },
            signer_seeds,
        ),
        amount_a,
    )?;
    
    let amount_b = I64F64::from_num(amount)
    .checked_mul(I64F64::from_num(ctx.accounts.pool_account_b.amount))
    .unwrap()
    .checked_div(I64F64::from_num(
        ctx.accounts.mint_liquidity.supply + MINIMUM_LIQUIDITY,
    ))
    .unwrap()
    .floor()
    .to_num::<u64>();
token::transfer(
    CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.pool_account_b.to_account_info(),
            to: ctx.accounts.withdrawer_account_b.to_account_info(),
            authority: ctx.accounts.pool_authority.to_account_info(),
        },
        signer_seeds,
    ),
    amount_b,
)?;

msg!("amount_a: {}, amount_b: {}",amount_a, amount_b );
// Burn the liquidity tokens
// It will fail if the amount is invalid
token::burn(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Burn {
            mint: ctx.accounts.mint_liquidity.to_account_info(),
            from: ctx.accounts.withdraw_liquidity.to_account_info(),
            authority: ctx.accounts.withdrawer.to_account_info(),
        },
    ),
    amount,
)?;

Ok(())

}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub withdrawer: Signer<'info>,
    #[account(
        seeds = [
            b"liquidity_pool",
            liquidity_pool.mint_a.key().as_ref(),
            liquidity_pool.mint_b.key().as_ref(),
        ], 
        bump = liquidity_pool.bump
    )]
    pub liquidity_pool: Account<'info, LiquidityPool>,
    #[account( 
        mut,
        seeds = [b"liquidity_token",mint_a.key().as_ref(), mint_b.key().as_ref()],
        bump,
    )]
    pub mint_liquidity: Box<Account<'info, Mint>>,
    /// CHECK: read only authority
    #[account(
    seeds = [
    mint_a.key().as_ref(),
    mint_b.key().as_ref(),
    AUTHORITY_SEED
    ],
    bump
     )]
    pub pool_authority: AccountInfo<'info>,
    #[account(mut)]
    pub mint_a: Account<'info, Mint>,
    #[account(mut)]
    pub mint_b: Account<'info, Mint>,
    #[account(
        mut, 
        associated_token::authority = pool_authority,
        associated_token::mint  = mint_a
    )]
    pub pool_account_a: Account<'info, TokenAccount>,
    #[account(
        mut, 
        associated_token::authority = pool_authority,
        associated_token::mint  = mint_b
    )]
    pub pool_account_b: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = withdrawer,
        associated_token::mint = mint_liquidity,
        associated_token::authority = withdrawer
    )]
    pub withdraw_liquidity: Box<Account<'info, TokenAccount>>,
    #[account(
        mut, 
        associated_token::authority = withdrawer,
        associated_token::mint  = mint_a
    )]
    pub withdrawer_account_a: Account<'info, TokenAccount>,
    #[account(
        mut, 
        associated_token::authority = withdrawer,
        associated_token::mint  = mint_b
    )]
    pub withdrawer_account_b: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>    
}
