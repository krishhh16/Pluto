import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PlutoProgram } from "../target/types/pluto_program";
import {getValues} from "./utils"

describe("pluto-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PlutoProgram as Program<PlutoProgram>;
  const values = getValues()
  it("creates the pool", async () => {
    
    await program.methods.initPool()
    .accounts(
      {
        mintA: values.mintAKeypair.publicKey,
        mintB: values.mintBKeypair.publicKey,
        payer: provider.publicKey
      }
    )
    .rpc();

    const account = await program.account.liquidityPool.fetch(values.liquidityPool);
    console.log(account)
  })
});
