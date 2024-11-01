import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PlutoProgram } from "../target/types/pluto_program";
import { getValues, mintingTokens } from "../utils"
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js"
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";

interface GetvalsReturnType {
  id: Keypair;
  payer: Keypair;
  mintAKeypair: Keypair;
  mintBKeypair: Keypair;
  poolAuthority: PublicKey;
  liquidityPool: PublicKey;
  lp: Keypair;
  mintToken: PublicKey;
  poolAccountA: PublicKey;
  poolAccountB: PublicKey;
  holderAccountA: PublicKey;
  holderAccountB: PublicKey;
  depositorLiquidity: PublicKey;
}

const Amounts = {
    amount_a: 100,
    amount_b: 1000
}


describe("pluto-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  console.log("This is my create_pool test")

  const program = anchor.workspace.PlutoProgram as Program<PlutoProgram>;

  let mintA, mintB;
  let vals: GetvalsReturnType;
  beforeEach(async () => {
    vals = await getValues(provider.connection);
    mintA = vals.mintAKeypair.publicKey;
    mintB = vals.mintBKeypair.publicKey;

    await mintingTokens({
      connection: provider.connection,
      creator: vals.payer,
      mintAKeypair: vals.mintAKeypair,
      mintBKeypair: vals.mintBKeypair,
    });

    console.log('init pool about to begin')
    await program.methods.initPool()
      .accountsStrict(
        {
          mintA: vals.mintAKeypair.publicKey,
          mintB: vals.mintBKeypair.publicKey,
          payer: vals.payer.publicKey,
          liquidityPool: vals.liquidityPool,
          mintLiquidity: vals.mintToken,
          poolAccountA: vals.poolAccountA,
          poolAccountB: vals.poolAccountB,
          poolAuthority: vals.poolAuthority,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID
        }
      )
      .signers([vals.payer])
      .rpc();
      const sig = await provider.connection.requestAirdrop(vals.lp.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL)
    
      provider.connection.confirmTransaction(sig);
  });

  it("Deposits some funds to the pool initial", async () => {
   
    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      vals.lp,
      vals.mintAKeypair.publicKey,
      vals.lp.publicKey
    );

    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      vals.lp,
      vals.mintBKeypair.publicKey,
      vals.lp.publicKey
    );

    // Create liquidity token account for LP
    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      vals.lp,
      vals.mintToken,
      vals.lp.publicKey
    );

    await program.methods.depositTokens(new anchor.BN(Amounts.amount_a), new anchor.BN(Amounts.amount_b))
    .accountsStrict({
        poolAuthority: vals.poolAuthority,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        depositor: vals.payer.publicKey,
        depositorAccountLiquidity: vals.depositorLiquidity,
        depositorMintA: vals.holderAccountA,
        depositorMintB: vals.holderAccountB,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        liquidityPool: vals.liquidityPool,
        mintA: vals.mintAKeypair.publicKey,
        mintB: vals.mintBKeypair.publicKey,
        mintLiquidity: vals.mintToken,
        payer: vals.payer.publicKey,
        poolAccountA: vals.poolAccountA,
        poolAccountB: vals.poolAccountB
    })
    .signers([vals.payer])
    .rpc();

  })

  it("Deposit twice", async () => {
    it("Deposits some funds to the pool initial", async () => {
   
        await getOrCreateAssociatedTokenAccount(
          provider.connection,
          vals.lp,
          vals.mintAKeypair.publicKey,
          vals.lp.publicKey
        );
    
        await getOrCreateAssociatedTokenAccount(
          provider.connection,
          vals.lp,
          vals.mintBKeypair.publicKey,
          vals.lp.publicKey
        );
    
        // Create liquidity token account for LP
        await getOrCreateAssociatedTokenAccount(
          provider.connection,
          vals.lp,
          vals.mintToken,
          vals.lp.publicKey
        );
    
        await program.methods.depositTokens(new anchor.BN(Amounts.amount_a), new anchor.BN(Amounts.amount_b))
        .accountsStrict({
            poolAuthority: vals.poolAuthority,
            systemProgram: SYSTEM_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            depositor: vals.payer.publicKey,
            depositorAccountLiquidity: vals.depositorLiquidity,
            depositorMintA: vals.holderAccountA,
            depositorMintB: vals.holderAccountB,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            liquidityPool: vals.liquidityPool,
            mintA: vals.mintAKeypair.publicKey,
            mintB: vals.mintBKeypair.publicKey,
            mintLiquidity: vals.mintToken,
            payer: vals.payer.publicKey,
            poolAccountA: vals.poolAccountA,
            poolAccountB: vals.poolAccountB
        })
        .signers([vals.payer])
        .rpc();
    
        await program.methods.depositTokens(new anchor.BN(Amounts.amount_a), new anchor.BN(Amounts.amount_b))
        .accountsStrict({
            poolAuthority: vals.poolAuthority,
            systemProgram: SYSTEM_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            depositor: vals.payer.publicKey,
            depositorAccountLiquidity: vals.depositorLiquidity,
            depositorMintA: vals.holderAccountA,
            depositorMintB: vals.holderAccountB,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            liquidityPool: vals.liquidityPool,
            mintA: vals.mintAKeypair.publicKey,
            mintB: vals.mintBKeypair.publicKey,
            mintLiquidity: vals.mintToken,
            payer: vals.payer.publicKey,
            poolAccountA: vals.poolAccountA,
            poolAccountB: vals.poolAccountB
        })
        .signers([vals.payer])
        .rpc();
    
      })
  })

});
