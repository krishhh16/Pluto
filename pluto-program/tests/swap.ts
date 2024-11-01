import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PlutoProgram } from "../target/types/pluto_program";
import { getValues, mintingTokens } from "../utils"
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAccount, getMint } from "@solana/spl-token";
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


describe("Swap", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    console.log("This is my create_pool test")

    const MINIMUM_LIQUIDITY = 100;
    const program = anchor.workspace.PlutoProgram as Program<PlutoProgram>;
    const swapAmountA = new anchor.BN(Amounts.amount_a - 50)
    const swapAmountB = new anchor.BN(Amounts.amount_a - 50)

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

    // it("Swaps A", async () => {
    //     await program.methods.swapTokens(true, swapAmountA, new anchor.BN(50))
    //         .accountsStrict({
    //             associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //             liquidityPool: vals.liquidityPool,
    //             mintA: vals.mintAKeypair.publicKey,
    //             mintB: vals.mintBKeypair.publicKey,
    //             mintLiquidity: vals.mintToken,
    //             poolAccountA: vals.poolAccountA,
    //             poolAccountB: vals.poolAccountB,
    //             poolAuthority: vals.poolAuthority,
    //             systemProgram: SYSTEM_PROGRAM_ID,
    //             tokenProgram: TOKEN_PROGRAM_ID,
    //             trader: vals.payer.publicKey,
    //             traderAtaA: vals.holderAccountA,
    //             traderAtaB: vals.holderAccountB
    //         })
    //         .signers([vals.payer])
    // })
    // it("Swaps B", async () => {
    //     await program.methods.swapTokens(false, swapAmountB, new anchor.BN(50))
    //         .accountsStrict({
    //             associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //             liquidityPool: vals.liquidityPool,
    //             mintA: vals.mintAKeypair.publicKey,
    //             mintB: vals.mintBKeypair.publicKey,
    //             mintLiquidity: vals.mintToken,
    //             poolAccountA: vals.poolAccountA,
    //             poolAccountB: vals.poolAccountB,
    //             poolAuthority: vals.poolAuthority,
    //             systemProgram: SYSTEM_PROGRAM_ID,
    //             tokenProgram: TOKEN_PROGRAM_ID,
    //             trader: vals.payer.publicKey,
    //             traderAtaA: vals.holderAccountA,
    //             traderAtaB: vals.holderAccountB
    //         })
    //         .signers([vals.payer])
                // .rpc()
    // })

    it("confirms if the swap A amount was diduced from the pool", async () => {

        const poolAccountABefore = await getAccount(provider.connection, vals.poolAccountA);
        const poolAccountBBefore = await getAccount(provider.connection, vals.poolAccountB);
        const traderAccountABefore = await getAccount(provider.connection, vals.holderAccountA);
        const traderAccountBBerfore = await getAccount(provider.connection, vals.holderAccountB);


        await program.methods.swapTokens(true, swapAmountA, new anchor.BN(30))
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
            .rpc()

        const poolAccountAAfter = await getAccount(provider.connection, vals.poolAccountA);
        const poolAccountBAfter = await getAccount(provider.connection, vals.poolAccountB);
        const traderAccountAAfter = await getAccount(provider.connection, vals.holderAccountA);
        const traderAccountBAfter = await getAccount(provider.connection, vals.holderAccountB);


        const taxedAmount = new BN(swapAmountA).sub(new BN(swapAmountA.mul(new BN(500)).div(new BN(10000))))

        const outputA = new BN(taxedAmount.mul(new BN(poolAccountBBefore.amount.toString()))).div(new BN(
            new BN(poolAccountABefore.amount.toString()).add(taxedAmount)
        ))


        console.log("before::", new BN(traderAccountABefore.amount.toString()).toString(),
            "\nAfter::", new BN(traderAccountAAfter.amount.toString()).toString())

        console.log("Pool before::", new BN(poolAccountABefore.amount.toString()).toString(),
            "\nAfter::", new BN(poolAccountAAfter.amount.toString()).toString())

        // assert(
        //     new BN(traderAccountAAfter.amount.toString()).eq(
        //         new BN(traderAccountABefore.amount.toString()).sub(outputA)
        //     ),
        //     "The output amount should have been deducted from the trader's ATA"
        // )
    })

})


