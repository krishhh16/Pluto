// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { PlutoProgram } from "../target/types/pluto_program";
// import { getValues, mintingTokens } from "../utils"
// import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAccount, getMint} from "@solana/spl-token";
// import { Keypair, PublicKey } from "@solana/web3.js"
// import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
// import { assert } from "chai";
// import { BN } from "@project-serum/anchor";

// interface GetValuesReturnType {
//     id: Keypair;
//     payer: Keypair;
//     mintAKeypair: Keypair;
//     mintBKeypair: Keypair;
//     poolAuthority: PublicKey;
//     liquidityPool: PublicKey;
//     lp: Keypair;
//     mintToken: PublicKey;
//     poolAccountA: PublicKey;    poolAccountB: PublicKey;
//     holderAccountA: PublicKey;
//     holderAccountB: PublicKey;
//     depositorLiquidity: PublicKey;
// }


// const Amounts = {
//     amount_a: 100,
//     amount_b: 1000
// }


// describe("Withdraw", () => {
//     const provider = anchor.AnchorProvider.env();
//     anchor.setProvider(provider);
//     console.log("This is my create_pool test")

//     const MINIMUM_LIQUIDITY = 100;
//     const liquidity = Math.sqrt(Amounts.amount_a * Amounts.amount_b);
//     const program = anchor.workspace.PlutoProgram as Program<PlutoProgram>;


//     let vals: GetValuesReturnType;
//     beforeEach(async () => {
//         vals = await getValues(provider.connection);

//         await mintingTokens({
//             connection: provider.connection,
//             creator: vals.payer,
//             mintAKeypair: vals.mintAKeypair,
//             mintBKeypair: vals.mintBKeypair,
//         });

//         //   console.log("starting the pool")
//         await program.methods.initPool()
//             .accountsStrict({
//                 associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//                 liquidityPool: vals.liquidityPool,
//                 mintA: vals.mintAKeypair.publicKey,
//                 mintB: vals.mintBKeypair.publicKey,
//                 mintLiquidity: vals.mintToken,
//                 payer: vals.payer.publicKey,
//                 poolAccountA: vals.poolAccountA,
//                 poolAccountB: vals.poolAccountB,
//                 poolAuthority: vals.poolAuthority,
//                 systemProgram: SYSTEM_PROGRAM_ID,
//                 tokenProgram: TOKEN_PROGRAM_ID
//             })
//             .signers([vals.payer])
//             .rpc()

//         // console.log("init deposit")

//         await program.methods.depositTokens(new anchor.BN(Amounts.amount_a), new anchor.BN(Amounts.amount_b))
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
//     })

//     it("Take out Max liquidity from the pool", async () => {
//         const liquidity = Math.sqrt(Amounts.amount_a * Amounts.amount_b);
//         console.log("Liquidity:::", liquidity.toString())

//         await program.methods.withdrawTokens(new anchor.BN(liquidity))
//             .accountsStrict({
//                 poolAuthority: vals.poolAuthority,
//                 systemProgram: SYSTEM_PROGRAM_ID,
//                 tokenProgram: TOKEN_PROGRAM_ID,
//                 withdrawer: vals.payer.publicKey,
//                 withdrawerAccountA: vals.holderAccountA,
//                 withdrawerAccountB: vals.holderAccountB,
//                 associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//                 liquidityPool: vals.liquidityPool,
//                 mintA: vals.mintAKeypair.publicKey,
//                 mintB: vals.mintBKeypair.publicKey,
//                 mintLiquidity: vals.mintToken,
//                 poolAccountA: vals.poolAccountA,
//                 poolAccountB: vals.poolAccountB,
//                 withdrawLiquidity: vals.depositorLiquidity
//             })
//             .signers([vals.payer])
//             .rpc();

//         assert(true, "took out all the funds from the ")
//     })
//     it("Doesn't allow more liquidity to move than the LP themselves own", async () => {
//         console.log("Liquidity:::", liquidity.toString())
//         try {
//             await program.methods.withdrawTokens(new anchor.BN(liquidity + 100))
//                 .accountsStrict({
//                     poolAuthority: vals.poolAuthority,
//                     systemProgram: SYSTEM_PROGRAM_ID,
//                     tokenProgram: TOKEN_PROGRAM_ID,
//                     withdrawer: vals.payer.publicKey,
//                     withdrawerAccountA: vals.holderAccountA,
//                     withdrawerAccountB: vals.holderAccountB,
//                     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//                     liquidityPool: vals.liquidityPool,
//                     mintA: vals.mintAKeypair.publicKey,
//                     mintB: vals.mintBKeypair.publicKey,
//                     mintLiquidity: vals.mintToken,
//                     poolAccountA: vals.poolAccountA,
//                     poolAccountB: vals.poolAccountB,
//                     withdrawLiquidity: vals.depositorLiquidity
//                 })
//                 .signers([vals.payer])
//                 .rpc()

//             assert(false, "Expected program to fail")

//         } catch (err) {
//             assert(true, "Successfully failed with the error:")
//         }
//     })

//     it("Sends the right amount of token a and b to the LP", async () => {
//         const LPa = await getAccount(provider.connection, vals.holderAccountA);
//         const LPb = await getAccount(provider.connection, vals.holderAccountB);
//         const mintLiquidity = await getMint(provider.connection, vals.mintToken);
        
//         console.log("LPA before:", LPa.amount.toString(), "\nLPb before:", LPb.amount.toString());
        
//         const poolA = await getAccount(provider.connection, vals.poolAccountA);
//         const poolB = await getAccount(provider.connection, vals.poolAccountB);
        
//         // Use BN for all calculations to ensure precision
//         const liquidityBN = new BN(liquidity);
//         const poolAmountABN = new BN(poolA.amount.toString());
//         const poolAmountBBN = new BN(poolB.amount.toString());
//         const mintSupplyBN = new BN(mintLiquidity.supply.toString());
//         const minimumLiquidityBN = new BN(MINIMUM_LIQUIDITY);
        
//         // Calculate expected withdrawal amounts with BN operations
//         const tokenaAWithdrawAmountBN = liquidityBN
//             .mul(poolAmountABN)
//             .div(mintSupplyBN.add(minimumLiquidityBN));
//         const tokenaBWithdrawAmountBN = liquidityBN
//             .mul(poolAmountBBN)
//             .div(mintSupplyBN.add(minimumLiquidityBN));
        
//         console.log("Expected Withdrawal Amounts:", 
//             "Token A:", tokenaAWithdrawAmountBN.toString(), 
//             "\nToken B:", tokenaBWithdrawAmountBN.toString()
//         );
        
//         // Perform the withdrawal
//         await program.methods.withdrawTokens(new BN(liquidity))
//             .accountsStrict({
//                 poolAuthority: vals.poolAuthority,
//                 systemProgram: SYSTEM_PROGRAM_ID,
//                 tokenProgram: TOKEN_PROGRAM_ID,
//                 withdrawer: vals.payer.publicKey,
//                 withdrawerAccountA: vals.holderAccountA,
//                 withdrawerAccountB: vals.holderAccountB,
//                 associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//                 liquidityPool: vals.liquidityPool,
//                 mintA: vals.mintAKeypair.publicKey,
//                 mintB: vals.mintBKeypair.publicKey,
//                 mintLiquidity: vals.mintToken,
//                 poolAccountA: vals.poolAccountA,
//                 poolAccountB: vals.poolAccountB,
//                 withdrawLiquidity: vals.depositorLiquidity
//             })
//             .signers([vals.payer])
//             .rpc();
        
//         // Get updated account states
//         const _LPa = await getAccount(provider.connection, vals.holderAccountA);
//         const _LPb = await getAccount(provider.connection, vals.holderAccountB);
        
//         // Calculate actual received amounts
//         const actualAReceivedBN = new BN(_LPa.amount.toString()).sub(new BN(LPa.amount.toString()));
//         const actualBReceivedBN = new BN(_LPb.amount.toString()).sub(new BN(LPb.amount.toString()));
        
//         console.log("Actual received amounts:", 
//             "Token A:", actualAReceivedBN.toString(), 
//             "\nToken B:", actualBReceivedBN.toString()
//         );
        
//         // Compare expected vs actual with a tolerance of ±1
//         const tolerance = new BN(1);
//         const aDifference = tokenaAWithdrawAmountBN.sub(actualAReceivedBN).abs();
//         const bDifference = tokenaBWithdrawAmountBN.sub(actualBReceivedBN).abs();
        
//         console.log("Difference in A:", aDifference.toString(), "Difference in B:", bDifference.toString());

//         // Validate within tolerance
//         if (aDifference.lte(tolerance) && bDifference.lte(tolerance)) {
//             console.log("Test passed: Withdrawal amounts match expected values within tolerance.");
//         } else {
//             assert.fail("Test failed: Discrepancy in expected and actual withdrawal amounts exceeds tolerance.")
//         }

//     })


// })


