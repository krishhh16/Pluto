// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { PlutoProgram } from "../target/types/pluto_program";
// import { getValues, mintingTokens } from "../utils"
// import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token";
// import { Keypair, PublicKey } from "@solana/web3.js"

// interface GetValuesReturnType {
//   id: Keypair;
//   payer: Keypair;
//   mintAKeypair: Keypair;
//   mintBKeypair: Keypair;
//   poolAuthority: PublicKey;
//   liquidityPool: PublicKey;
//   lp: Keypair;
//   mintToken: PublicKey;
//   poolAccountA: PublicKey;
//   poolAccountB: PublicKey;
//   holderAccountA: PublicKey;
//   holderAccountB: PublicKey;
//   depositorLiquidity: PublicKey;
// }
// describe("pluto-program", () => {
//   // Configure the client to use the local cluster.
//   const provider = anchor.AnchorProvider.env();
//   anchor.setProvider(provider);
//   console.log("This is my create_pool test")

//   const program = anchor.workspace.PlutoProgram as Program<PlutoProgram>;

//   let mintA, mintB;
//   let values: GetValuesReturnType;
//   beforeEach(async () => {

//   });

//   it("Deposits some funds to the pool initial", async () => {
//     values = await getValues(provider.connection);
//     mintA = values.mintAKeypair.publicKey;
//     mintB = values.mintBKeypair.publicKey;

//     await mintingTokens({
//       connection: provider.connection,
//       creator: values.payer,
//       mintAKeypair: values.mintAKeypair,
//       mintBKeypair: values.mintBKeypair,
//     });

//     console.log('init pool about to begin')
//     await program.methods.initPool()
//       .accountsStrict(
//         {
//           mintA: values.mintAKeypair.publicKey,
//           mintB: values.mintBKeypair.publicKey,
//           payer: values.payer.publicKey,
//           liquidityPool: values.liquidityPool,
//           mintLiquidity: values.mintToken,
//           poolAccountA: values.poolAccountA,
//           poolAccountB: values.poolAccountB,
//           poolAuthority: values.poolAuthority,
//           systemProgram: anchor.web3.SystemProgram.programId,
//           associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//           tokenProgram: TOKEN_PROGRAM_ID
//         }
//       )
//       .signers([values.payer])
//       .rpc();
//     // console.log('dp start')

//     const sig = await provider.connection.requestAirdrop(values.lp.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL)

//     provider.connection.confirmTransaction(sig);

//     console.log("something")

//     await getOrCreateAssociatedTokenAccount(
//       provider.connection,
//       values.lp,
//       values.mintAKeypair.publicKey,
//       values.lp.publicKey
//     );

//     await getOrCreateAssociatedTokenAccount(
//       provider.connection,
//       values.lp,
//       values.mintBKeypair.publicKey,
//       values.lp.publicKey
//     );

//     // Create liquidity token account for LP
//     await getOrCreateAssociatedTokenAccount(
//       provider.connection,
//       values.lp,
//       values.mintToken,
//       values.lp.publicKey
//     );

//     await program.methods.depositTokens(new anchor.BN(1000 * anchor.web3.LAMPORTS_PER_SOL), new anchor.BN(1000 * anchor.web3.LAMPORTS_PER_SOL))
//       .accountsStrict({
//         liquidityPool: values.liquidityPool,
//         mintA: values.mintAKeypair.publicKey,
//         mintB: values.mintBKeypair.publicKey,
//         poolAuthority: values.poolAuthority,
//         poolAccountA: values.poolAccountA,
//         poolAccountB: values.poolAccountB,
//         depositor: values.lp.publicKey,
//         mintLiquidity: values.mintToken,
//         depositorAccountLiquidity: getAssociatedTokenAddressSync(
//           values.mintToken,
//           values.lp.publicKey
//         ),
//         depositorMintA: getAssociatedTokenAddressSync(
//           values.mintAKeypair.publicKey,
//           values.lp.publicKey
//         ),
//         depositorMintB: getAssociatedTokenAddressSync(
//           values.mintBKeypair.publicKey,
//           values.lp.publicKey
//         ),
//         payer: values.payer.publicKey,
//         systemProgram: anchor.web3.SystemProgram.programId,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//       })
//       .signers([values.lp, values.payer])
//       .rpc()

//   })

// });
