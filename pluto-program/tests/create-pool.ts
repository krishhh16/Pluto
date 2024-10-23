import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PlutoProgram } from "../target/types/pluto_program";
import {getValues, mintingTokens} from "../utils"
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { assert } from "chai";

describe("pluto-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  console.log("This is my create_pool test")

  const program = anchor.workspace.PlutoProgram as Program<PlutoProgram>;

  it("creates the pool", async () => {
    const values = await getValues(provider.connection)
    await mintingTokens({
      connection: provider.connection,
      creator: values.payer,
      mintAKeypair: values.mintAKeypair,
      mintBKeypair: values.mintBKeypair,
    });

    await program.methods.initPool()
    .accountsStrict(
      {
        mintA: values.mintAKeypair.publicKey,
        mintB: values.mintBKeypair.publicKey,
        payer: values.payer.publicKey,
        liquidityPool: values.liquidityPool,
        mintLiquidity: values.mintToken,
        poolAccountA: values.poolAccountA,
        poolAccountB: values.poolAccountB,
        poolAuthority: values.poolAuthority,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID
      }
    )
    .signers([values.payer])
    .rpc();

    const account = await program.account.liquidityPool.fetch(values.liquidityPool);
    console.log("Created Account: ", account)
    assert(account.mintA.toString() == values.mintAKeypair.publicKey.toString())
    assert(account.mintB.toString() == values.mintBKeypair.publicKey.toString())
  })
});
