import { Keypair, PublicKey } from "@solana/web3.js"
import { BN } from "bn.js";
import * as anchor from "@coral-xyz/anchor"
import { getAssociatedTokenAddressSync, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token"
import { assert } from "chai";

export async function getValues(connection: anchor.web3.Connection) {
    const id = Keypair.generate();
    const payer = Keypair.generate();
    const mintAKeypair = Keypair.generate();
    let mintBKeypair = Keypair.generate();
    const lp = Keypair.generate();

    const sig = await connection.requestAirdrop(payer.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL);
    const sig2 = await connection.requestAirdrop(lp.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL);

    await connection.confirmTransaction(sig);
    await connection.confirmTransaction(sig2);
    while (new BN(mintAKeypair.publicKey.toBytes()).lt(new BN(mintBKeypair.publicKey.toBytes()))) {
        mintBKeypair = Keypair.generate();
    }

    const poolAuthority = PublicKey.findProgramAddressSync([
        mintAKeypair.publicKey.toBuffer(), mintBKeypair.publicKey.toBuffer(), Buffer.from("pool_authority"),
    ],
        anchor.workspace.PlutoProgram.programId
    )[0]

    const liquidityPool = PublicKey.findProgramAddressSync([
        Buffer.from("liquidity_pool"), mintAKeypair.publicKey.toBuffer(), mintBKeypair.publicKey.toBuffer(),
    ],
        anchor.workspace.PlutoProgram.programId
    )[0]
    const mintToken = PublicKey.findProgramAddressSync([
        Buffer.from("liquidity_token"), mintAKeypair.publicKey.toBuffer(), mintBKeypair.publicKey.toBuffer()
    ],
        anchor.workspace.PlutoProgram.programId
    )[0]

    // Create token accounts for LP
    // await getOrCreateAssociatedTokenAccount(
    //     connection,
    //     lp,
    //     mintAKeypair.publicKey,
    //     lp.publicKey
    //   );
  
    //   await getOrCreateAssociatedTokenAccount(
    //     connection,
    //     lp,
    //     mintBKeypair.publicKey,
    //     lp.publicKey
    //   );
  
    //   // Create liquidity token account for LP
    //   await getOrCreateAssociatedTokenAccount(
    //     connection,
    //     lp,
    //     mintToken,
    //     lp.publicKey
    //   );

    // console.log({
    //     id: id.publicKey.toString(),
    //     payer: payer.publicKey.toString(),
    //     mintAKeypair,
    //     mintBKeypair,
    //     poolAuthority,
    //     liquidityPool,
    //     lp,
    //     mintToken,
    //     poolAccountA: getAssociatedTokenAddressSync(mintAKeypair.publicKey, poolAuthority, true),
    //     poolAccountB: getAssociatedTokenAddressSync(mintBKeypair.publicKey, poolAuthority, true),
    //     depositorLiquidity: getAssociatedTokenAddressSync(mintToken, payer.publicKey, true),
    //     holderAccountA: getAssociatedTokenAddressSync(mintAKeypair.publicKey, payer.publicKey, true),
    //     holderAccountB: getAssociatedTokenAddressSync(mintBKeypair.publicKey, payer.publicKey, true),
    // })

    return {
        id,
        payer,
        mintAKeypair,
        mintBKeypair,
        poolAuthority,
        liquidityPool,
        lp,
        mintToken,
        poolAccountA: getAssociatedTokenAddressSync(mintAKeypair.publicKey, poolAuthority, true),
        poolAccountB: getAssociatedTokenAddressSync(mintBKeypair.publicKey, poolAuthority, true),
        depositorLiquidity: getAssociatedTokenAddressSync(mintToken, payer.publicKey, true),
        holderAccountA: getAssociatedTokenAddressSync(mintAKeypair.publicKey, payer.publicKey, true),
        holderAccountB: getAssociatedTokenAddressSync(mintBKeypair.publicKey, payer.publicKey, true),
    }
}
export const mintingTokens = async ({
    connection,
    creator,
    holder = creator,
    mintAKeypair,
    mintBKeypair,
    mintedAmount = 100,
    decimals = 6,
  }: {
    connection: anchor.web3.Connection;
    creator: anchor.web3.Signer;
    holder?: anchor.web3.Signer;
    mintAKeypair: Keypair;
    mintBKeypair: Keypair;
    mintedAmount?: number;
    decimals?: number;
  }) => {
    // Mint tokens
    await connection.confirmTransaction(await connection.requestAirdrop(creator.publicKey, 10 ** 10));
    await createMint(connection, creator, creator.publicKey, creator.publicKey, decimals, mintAKeypair);
    await createMint(connection, creator, creator.publicKey, creator.publicKey, decimals, mintBKeypair);
    await getOrCreateAssociatedTokenAccount(connection, holder, mintAKeypair.publicKey, holder.publicKey, true);
    await getOrCreateAssociatedTokenAccount(connection, holder, mintBKeypair.publicKey, holder.publicKey, true);
    await mintTo(
      connection,
      creator,
      mintAKeypair.publicKey,
      getAssociatedTokenAddressSync(mintAKeypair.publicKey, holder.publicKey, true),
      creator.publicKey,
      mintedAmount * 10 ** decimals,
    );
    await mintTo(
      connection,
      creator,
      mintBKeypair.publicKey,
      getAssociatedTokenAddressSync(mintBKeypair.publicKey, holder.publicKey, true),
      creator.publicKey,
      mintedAmount * 10 ** decimals,
    );


    assert(true);
  };