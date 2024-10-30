use anchor_lang::prelude::*;
use anchor_spl::{
    token::{
        Token,
        TokenAccount,
        Mint,
        Transfer
    },
    associated_token::AssociatedToken
};

use crate::{
    errors::Errors,
    states::*,
    constants::*
};
use fixed::types::I64F64;

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub trader: Signer<'info>,
    #[account(
        seeds = [
            b"liquidity_pool",
            liquidity_pool.mint_a.key().as_ref(),
            liquidity_pool.mint_b.key().as_ref(),
        ], 
        bump = liquidity_pool.bump,
        has_one = mint_a,
        has_one = mint_b,
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
        payer = trader,
        associated_token::mint = mint_a,
        associated_token::authority = trader
    )]
    pub trader_ata_a: Account<'info, TokenAccount>,
    #[account(
        init_if_needed, 
        payer = trader,
        associated_token::mint = mint_b,
        associated_token::authority = trader
    )]
    pub trader_ata_b: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>
    
}