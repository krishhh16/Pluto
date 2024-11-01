import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PlutoProgram } from "../target/types/pluto_program";
import { getValues, mintingTokens } from "../utils"
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAccount } from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js"
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { assert } from "chai";

interface GetValuesReturnType {
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


describe("Withdraw", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    console.log("This is my create_pool test")

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

    it("Take out Max liquidity from the pool", async () => {
        const liquidity = Math.sqrt(Amounts.amount_a * Amounts.amount_b);
        console.log("Liquidity:::", liquidity.toString())

        await program.methods.withdrawTokens(new anchor.BN(liquidity))
            .accountsStrict({
                poolAuthority: vals.poolAuthority,
                systemProgram: SYSTEM_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID,
                withdrawer: vals.payer.publicKey,
                withdrawerAccountA: vals.holderAccountA,
                withdrawerAccountB: vals.holderAccountB,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                liquidityPool: vals.liquidityPool,
                mintA: vals.mintAKeypair.publicKey,
                mintB: vals.mintBKeypair.publicKey,
                mintLiquidity: vals.mintToken,
                poolAccountA: vals.poolAccountA,
                poolAccountB: vals.poolAccountB,
                withdrawLiquidity: vals.depositorLiquidity
            })
            .signers([vals.payer])
            .rpc();

        assert(true, "took out all the funds from the ")
    })
    it("Doesn't allow more liquidity to move than the LP themselves own", async () => {
        const liquidity = Math.sqrt(Amounts.amount_a * Amounts.amount_b);
        console.log("Liquidity:::", liquidity.toString())
        try {
            await program.methods.withdrawTokens(new anchor.BN(liquidity + 100))
                .accountsStrict({
                    poolAuthority: vals.poolAuthority,
                    systemProgram: SYSTEM_PROGRAM_ID,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    withdrawer: vals.payer.publicKey,
                    withdrawerAccountA: vals.holderAccountA,
                    withdrawerAccountB: vals.holderAccountB,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    liquidityPool: vals.liquidityPool,
                    mintA: vals.mintAKeypair.publicKey,
                    mintB: vals.mintBKeypair.publicKey,
                    mintLiquidity: vals.mintToken,
                    poolAccountA: vals.poolAccountA,
                    poolAccountB: vals.poolAccountB,
                    withdrawLiquidity: vals.depositorLiquidity
                })
                .signers([vals.payer])
                .rpc()

            assert(false, "Expected program to fail")

        } catch (err) {
            assert(true, "Successfully failed with the error:")
        }
    })


})


