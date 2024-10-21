import {Keypair, PublicKey} from "@solana/web3.js"
import { BN } from "bn.js";
import * as anchor from "@coral-xyz/anchor"
import {getAssociatedTokenAddressSync} from "@solana/spl-token"

export function getValues() {
    const id = Keypair.generate();
    const admin = Keypair.generate();
    const mintAKeypair = Keypair.generate();
    let mintBKeypair = Keypair.generate();

    while(new BN(mintAKeypair.publicKey.toBytes()).lt(new BN(mintBKeypair.publicKey.toBytes()))){
        mintBKeypair = Keypair.generate();
    }

    const poolAuthority = PublicKey.findProgramAddressSync([
        mintAKeypair.publicKey.toBuffer(), mintBKeypair.publicKey.toBuffer(), Buffer.from("pool_authority"),
        ],
        anchor.workspace.PlutoProgram.programId
    )[0]

    const liquidityPool = PublicKey.findProgramAddressSync([
        Buffer.from("liquidity_pool"), mintAKeypair.publicKey.toBuffer(), mintBKeypair.publicKey.toBuffer() ,
        ],
        anchor.workspace.PlutoProgram.programId
    )[0]
    const mintToken = PublicKey.findProgramAddressSync([
        Buffer.from("liquidity_token"), mintAKeypair.publicKey.toBuffer(), mintBKeypair.publicKey.toBuffer() ,
        ],
        anchor.workspace.PlutoProgram.programId
    )[0]

    return {
        id,
        mintAKeypair,
        mintBKeypair,
        poolAuthority,
        liquidityPool,
        mintToken,
        poolAccountA: getAssociatedTokenAddressSync(mintAKeypair.publicKey, poolAuthority, true),
        poolAccountB: getAssociatedTokenAddressSync(mintBKeypair.publicKey, poolAuthority, true)
    }
    

}