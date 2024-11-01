import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PlutoProgram } from "../target/types/pluto_program";
import { getValues, mintingTokens } from "../utils"
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAccount, getMint } from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js"
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { assert } from "chai";
import { BN } from "@project-serum/anchor";

interface GetValuesReturnType {
    id: Keypair;
    payer: Keypair;
    mintAKeypair: Keypair;
    mintBKeypair: Keypair;
    poolAuthority: PublicKey;
    liquidityPool: PublicKey;
    lp: Keypair;
    mintToken: PublicKey;
    poolAccountA: PublicKey; poolAccountB: PublicKey;
    holderAccountA: PublicKey;
    holderAccountB: PublicKey;
    depositorLiquidity: PublicKey;
}


const Amounts = {
    amount_a: 100,
    amount_b: 100
}


describe("Withdraw", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    console.log("This is my create_pool test")
    
    const MINIMUM_LIQUIDITY = 100;
    const liquidity = Math.sqrt(Amounts.amount_a * Amounts.amount_b);
    const program = anchor.workspace.PlutoProgram as Program<PlutoProgram>;


    let vals: GetValuesReturnType;
    beforeEach(async () => {
        vals = await getValues(provider.connection);

        await mintingTokens({
            connection: provider.connection,
            creator: vals.payer,
            mintAKeypair: vals.mintAKeypair,
            mintBKeypair: vals.mintBKeypair,
        });

        //   console.log("starting the pool")
        await program.methods.initPool()
            .accountsStrict({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                liquidityPool: vals.liquidityPool,
                mintA: vals.mintAKeypair.publicKey,
                mintB: vals.mintBKeypair.publicKey,
                mintLiquidity: vals.mintToken,
                payer: vals.payer.publicKey,
                poolAccountA: vals.poolAccountA,
                poolAccountB: vals.poolAccountB,
                poolAuthority: vals.poolAuthority,
                systemProgram: SYSTEM_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID
            })
            .signers([vals.payer])
            .rpc()

        // console.log("init deposit")

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

    it("Swaps A", async () => {
        await program.methods.swapTokens(true, new anchor.BN(Amounts.amount_a - 50), new anchor.BN(50))
        .accountsStrict({
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            liquidityPool: vals.liquidityPool,
            mintA: vals.mintAKeypair.publicKey,
            mintB: vals.mintBKeypair.publicKey,
            mintLiquidity: vals.mintToken,
            poolAccountA: vals.poolAccountA,
            poolAccountB: vals.poolAccountB,
            poolAuthority: vals.poolAuthority,
            systemProgram: SYSTEM_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            trader: vals.payer.publicKey,
            traderAtaA: vals.holderAccountA,
            traderAtaB: vals.holderAccountB
        })
        .signers([vals.payer])
    })
    it("Swaps B", async () => {
        await program.methods.swapTokens(false, new anchor.BN(Amounts.amount_a - 50), new anchor.BN(50))
        .accountsStrict({
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            liquidityPool: vals.liquidityPool,
            mintA: vals.mintAKeypair.publicKey,
            mintB: vals.mintBKeypair.publicKey,
            mintLiquidity: vals.mintToken,
            poolAccountA: vals.poolAccountA,
            poolAccountB: vals.poolAccountB,
            poolAuthority: vals.poolAuthority,
            systemProgram: SYSTEM_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            trader: vals.payer.publicKey,
            traderAtaA: vals.holderAccountA,
            traderAtaB: vals.holderAccountB
        })
        .signers([vals.payer])
    })

})


