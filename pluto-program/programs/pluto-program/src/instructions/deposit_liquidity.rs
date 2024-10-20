use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Token, TokenAccount, Mint, MintTo, Transfer}
};

use fixed::types::I64F64;

use crate::{
    errors::Errors,
    states::*
};

pub fn deposit_liquidity(ctx: Context<DepositLiquidity>, amount_a: u64, amount_b: u64) -> Result<()> {
    
    Ok(())
}

#[derive(Accounts)]
pub struct DepositLiquidity <'info> {
    #[account(
        seeds = [
            pool.mint_a.key().as_ref(),
            pool.mint_a.key().as_ref()
        ],
        bump,
        has_one = mint_a,
        has_one = mint_b
    )]
    pub pool: Box<Account<'info, LiquidityPool>>,
    pub mint_a: Box<Account<'info, Mint>>,
    pub mint_b: Box<Account<'info, Mint>>,
    /// CHECK: Read only authority
    #[account(
        seeds = [
            pool.mint_a.key().as_ref(),
            pool.mint_b.key().as_ref(),
            b"authority"
        ],
        bump
    )]
    pub pool_authority: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = mint_a,
        associated_token::authority = pool_authority
    )]
    pub pool_mint_a: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = mint_b,
        associated_token::authority = pool_authority
    )]
    pub pool_mint_b: Box<Account<'info, TokenAccount>>,
    pub depositor: Signer<'info>,
    pub mint_liquidity: Box<Account<'info, Mint>>, 
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint_liquidity,
        associated_token::authority = depositor
    )]
    pub depositor_account_liquidity: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = mint_a,
        associated_token::authority = depositor
    )]
    pub depositor_mint_a: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = mint_b,
        associated_token::authority = depositor
    )]
    pub depositor_mint_b: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}