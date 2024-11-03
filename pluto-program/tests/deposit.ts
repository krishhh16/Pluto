import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PlutoProgram } from "../target/types/pluto_program";
import { getValues, mintingTokens } from "../utils"
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAccount, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js"
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { assert } from "chai";
import { BN } from "@project-serum/anchor";

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
    });

    // it("Deposits some funds to the pool initial", async () => {

    //     await getOrCreateAssociatedTokenAccount(
    //         provider.connection,
    //         vals.lp,
    //         vals.mintAKeypair.publicKey,
    //         vals.lp.publicKey
    //     );

    //     await getOrCreateAssociatedTokenAccount(
    //         provider.connection,
    //         vals.lp,
    //         vals.mintBKeypair.publicKey,
    //         vals.lp.publicKey
    //     );

    //     // Create liquidity token account for LP
    //     await getOrCreateAssociatedTokenAccount(
    //         provider.connection,
    //         vals.lp,
    //         vals.mintToken,
    //         vals.lp.publicKey
    //     );

    //     await program.methods.depositTokens(new anchor.BN(Amounts.amount_a), new anchor.BN(Amounts.amount_b))
    //         .accountsStrict({
    //             poolAuthority: vals.poolAuthority,
    //             systemProgram: SYSTEM_PROGRAM_ID,
    //             tokenProgram: TOKEN_PROGRAM_ID,
    //             depositor: vals.payer.publicKey,
    //             depositorAccountLiquidity: vals.depositorLiquidity,
    //             depositorMintA: vals.holderAccountA,
    //             depositorMintB: vals.holderAccountB,
    //             associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //             liquidityPool: vals.liquidityPool,
    //             mintA: vals.mintAKeypair.publicKey,
    //             mintB: vals.mintBKeypair.publicKey,
    //             mintLiquidity: vals.mintToken,
    //             payer: vals.payer.publicKey,
    //             poolAccountA: vals.poolAccountA,
    //             poolAccountB: vals.poolAccountB
    //         })
    //         .signers([vals.payer])
    //         .rpc();

    // })

    // it("Deposit twice", async () => {
    //     await program.methods.depositTokens(new anchor.BN(Amounts.amount_a), new anchor.BN(Amounts.amount_b))
    //         .accountsStrict({
    //             poolAuthority: vals.poolAuthority,
    //             systemProgram: SYSTEM_PROGRAM_ID,
    //             tokenProgram: TOKEN_PROGRAM_ID,
    //             depositor: vals.payer.publicKey,
    //             depositorAccountLiquidity: vals.depositorLiquidity,
    //             depositorMintA: vals.holderAccountA,
    //             depositorMintB: vals.holderAccountB,
    //             associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //             liquidityPool: vals.liquidityPool,
    //             mintA: vals.mintAKeypair.publicKey,
    //             mintB: vals.mintBKeypair.publicKey,
    //             mintLiquidity: vals.mintToken,
    //             payer: vals.payer.publicKey,
    //             poolAccountA: vals.poolAccountA,
    //             poolAccountB: vals.poolAccountB
    //         })
    //         .signers([vals.payer])
    //         .rpc();

    //     await program.methods.depositTokens(new anchor.BN(Amounts.amount_a), new anchor.BN(Amounts.amount_b))
    //         .accountsStrict({
    //             poolAuthority: vals.poolAuthority,
    //             systemProgram: SYSTEM_PROGRAM_ID,
    //             tokenProgram: TOKEN_PROGRAM_ID,
    //             depositor: vals.payer.publicKey,
    //             depositorAccountLiquidity: vals.depositorLiquidity,
    //             depositorMintA: vals.holderAccountA,
    //             depositorMintB: vals.holderAccountB,
    //             associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //             liquidityPool: vals.liquidityPool,
    //             mintA: vals.mintAKeypair.publicKey,
    //             mintB: vals.mintBKeypair.publicKey,
    //             mintLiquidity: vals.mintToken,
    //             payer: vals.payer.publicKey,
    //             poolAccountA: vals.poolAccountA,
    //             poolAccountB: vals.poolAccountB
    //         })
    //         .signers([vals.payer])
    //         .rpc();

    // })

    // it("Reverts if the amount is less than MINIMUM_LIQUIDITY", async () => {
    //     try {
    //         await program.methods.depositTokens(new anchor.BN(5), new anchor.BN(5)) // Since MINIMUM_LIQUIDITY is set to 100
    //             .accountsStrict({
    //                 poolAuthority: vals.poolAuthority,
    //                 systemProgram: SYSTEM_PROGRAM_ID,
    //                 tokenProgram: TOKEN_PROGRAM_ID,
    //                 depositor: vals.payer.publicKey,
    //                 depositorAccountLiquidity: vals.depositorLiquidity,
    //                 depositorMintA: vals.holderAccountA,
    //                 depositorMintB: vals.holderAccountB,
    //                 associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //                 liquidityPool: vals.liquidityPool,
    //                 mintA: vals.mintAKeypair.publicKey,
    //                 mintB: vals.mintBKeypair.publicKey,
    //                 mintLiquidity: vals.mintToken,
    //                 payer: vals.payer.publicKey,
    //                 poolAccountA: vals.poolAccountA,
    //                 poolAccountB: vals.poolAccountB
    //             })
    //             .signers([vals.payer])
    //             .rpc();
    //         console.error("Expected the instruction to revert back")
    //     } catch (err) {
    //         console.log("The test failed with error:", err)
    //     }
    // })

    it("Deposits the whole ATA balance if the amount specified is more than their balance", async () => {
        const depositorATAABefore = await getAccount(provider.connection, vals.holderAccountA);
        const depositorATABBefore = await getAccount(provider.connection, vals.holderAccountB);
        const additionalAmount = String("1000")
        await program.methods.depositTokens(new anchor.BN(depositorATAABefore.amount.toString() + additionalAmount), new anchor.BN(depositorATABBefore.amount.toString() + additionalAmount)) // Making sure that the amount is more than the amount they own themselves
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

        const poolAcocuntA = await getAccount(provider.connection, vals.poolAccountA)
        const poolAcocuntB = await getAccount(provider.connection, vals.poolAccountB)
        const depositorATAAAfter = await getAccount(provider.connection, vals.holderAccountA);
        const depositorATABAfter = await getAccount(provider.connection, vals.holderAccountB);

        
        assert(
            new BN(depositorATAAAfter.amount.toString()).eq(new BN("0")) 
            && new BN(depositorATABAfter.amount.toString()).eq(new BN("0")),
            "Depositor's ATA"
        )

        assert(
            new BN(poolAcocuntA.amount.toString()).eq(new BN(depositorATAABefore.amount.toString()))
            && new BN(poolAcocuntB.amount.toString()).eq(new BN(depositorATABBefore.amount.toString())),
            "Expected the Pool's balance to be incremented by the depositor's entire balance"
        )


    })


    // it("Has the expected aamounts in all the ATAs", async () => {

    //     const depositorLPBefore = await getAccount(provider.connection, vals.depositorLiquidity);
    //     const depositATABBefore = await getAccount(provider.connection, vals.holderAccountA);
    //     const depositATAABefore = await getAccount(provider.connection, vals.holderAccountB);
    //     const poolATAABefore = await getAccount(provider.connection, vals.poolAccountA)
    //     const poolATABBefore = await getAccount(provider.connection, vals.poolAccountB)

    //     await program.methods.depositTokens(new anchor.BN(Amounts.amount_a), new anchor.BN(Amounts.amount_b))
    //     .accountsStrict({
    //         poolAuthority: vals.poolAuthority,
    //         systemProgram: SYSTEM_PROGRAM_ID,
    //         tokenProgram: TOKEN_PROGRAM_ID,
    //         depositor: vals.payer.publicKey,
    //         depositorAccountLiquidity: vals.depositorLiquidity,
    //         depositorMintA: vals.holderAccountA,
    //         depositorMintB: vals.holderAccountB,
    //         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //         liquidityPool: vals.liquidityPool,
    //         mintA: vals.mintAKeypair.publicKey,
    //         mintB: vals.mintBKeypair.publicKey,
    //         mintLiquidity: vals.mintToken,
    //         payer: vals.payer.publicKey,
    //         poolAccountA: vals.poolAccountA,
    //         poolAccountB: vals.poolAccountB
    //     })
    //     .signers([vals.payer])
    //     .rpc();

    //     const depositorLPAfter = await getAccount(provider.connection, vals.depositorLiquidity);
    //     const depositATABAfter = await getAccount(provider.connection, vals.holderAccountA);
    //     const depositATAAAfter = await getAccount(provider.connection, vals.holderAccountB);
    //     const poolATAAAfter = await getAccount(provider.connection, vals.poolAccountA)
    //     const poolATABAfter = await getAccount(provider.connection, vals.poolAccountB)




    // })

});
